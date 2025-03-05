import { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from './api/useImageUpload';
import { useEmailSubmission } from './api/useEmailSubmission';
import { useAnalysisProgress } from './useAnalysisProgress';
import { useAnalysisState } from './useAnalysisState';
import { useFullAnalysis } from './useFullAnalysis';
import type { SearchResults } from '../types';

export function useImageAnalysis(apiUrl?: string, initialSessionId?: string) {
  const effectiveApiUrl = apiUrl || import.meta.env.VITE_API_URL;
  
  const {
    isAnalyzing,
    analysisSteps,
    startAnalysis,
    stopAnalysis
  } = useAnalysisProgress();

  const {
    state,
    setState,
    resetState
  } = useAnalysisState(initialSessionId);

  const {
    uploadImage: uploadImageBase,
    isUploading,
    customerImage,
    sessionId,
    setSessionId,
    setCustomerImage,
    error: uploadError
  } = useImageUpload(effectiveApiUrl);

  const {
    startFullAnalysis,
    error: analysisError
  } = useFullAnalysis(effectiveApiUrl, {
    onStart: startAnalysis,
    onComplete: (results) => {
      setState(prev => ({
        ...prev,
        searchResults: results,
        itemType: results?.metadata?.analysisResults?.openaiAnalysis?.category || null
      }));
      stopAnalysis();
    },
    onError: (error) => {
      setState(prev => ({ ...prev, error }));
      stopAnalysis();
    }
  });

  const {
    submitEmail,
    error: emailError
  } = useEmailSubmission(effectiveApiUrl);

  // Combine upload and analysis into a single flow
  const handleUpload = useCallback(async (file: File) => {
    try {
      const uploadedSessionId = await uploadImageBase(file);
      if (uploadedSessionId) {
        await startFullAnalysis(uploadedSessionId);
      }
    } catch (err) {
      console.error('Upload and analysis flow failed:', err);
    }
  }, [uploadImageBase, startFullAnalysis]);

  // Handle email submission
  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (!sessionId) return false;
    
    try {
      const success = await submitEmail(email, sessionId);
      if (success) {
        setState(prev => ({ 
          ...prev, 
          isSubmitted: true,
          hasEmailBeenSubmitted: true 
        }));
      }
      return success;
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to submit email' 
      }));
      return false;
    }
  }, [sessionId, submitEmail, setState]);

  // Initialize with session ID if provided
  useEffect(() => {
    if (initialSessionId && !sessionId) {
      const gcsUrl = `https://storage.googleapis.com/images_free_reports/sessions/${initialSessionId}/UserUploadedImage.jpeg`;
      
      setState(prev => ({
        ...prev,
        isInitializing: true,
        gcsImageUrl: gcsUrl
      }));

      setSessionId(initialSessionId);
      setCustomerImage(gcsUrl);

      startFullAnalysis(initialSessionId)
        .catch(err => setState(prev => ({ 
          ...prev, 
          error: err instanceof Error ? err.message : 'Failed to initialize'
        })))
        .finally(() => setState(prev => ({ 
          ...prev, 
          isInitializing: false 
        })));
    }
  }, [initialSessionId, sessionId, setSessionId, setCustomerImage, startFullAnalysis, setState]);

  // Combine errors from different sources
  useEffect(() => {
    const currentError = uploadError || analysisError || emailError;
    if (currentError) {
      setState(prev => ({ ...prev, error: currentError }));
    }
  }, [uploadError, analysisError, emailError, setState]);

  return {
    uploadImage: handleUpload,
    startFullAnalysis,
    submitEmail: handleEmailSubmit,
    resetState,
    isUploading,
    isAnalyzing,
    isInitializing: state.isInitializing,
    customerImage,
    sessionId,
    setSessionId,
    gcsImageUrl: state.gcsImageUrl,
    searchResults: state.searchResults,
    error: state.error,
    analysisSteps,
    hasEmailBeenSubmitted: state.hasEmailBeenSubmitted,
    itemType: state.itemType
  };
}
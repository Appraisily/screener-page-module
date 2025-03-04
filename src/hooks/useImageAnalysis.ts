import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useImageUpload } from './api/useImageUpload';
import { useVisualSearch } from './api/useVisualSearch';
import { useOriginAnalysis } from './api/useOriginAnalysis';
import { useEmailSubmission } from './api/useEmailSubmission';
import { useOpenAIAnalysis } from './api/useOpenAIAnalysis';
import { debug } from './utils/debug';
import { ApiError, useErrorHandler } from './useErrorHandler';
import type { SearchResults, OriginResults } from '../types';

export function useImageAnalysis(initialSessionId?: string) {
  // Session management
  const [sessionId, setSessionId] = useState<string>(initialSessionId || '');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // Error handling
  const { handleError } = useErrorHandler();
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const { 
    uploadImage: uploadImageBase, 
    isUploading, 
    customerImage, 
    setSessionId: setUploadSessionId,
    setCustomerImage 
  } = useImageUpload();
  
  const { 
    startVisualSearch: searchVisually, 
    testVisualSearch,
    isSearching, 
    searchResults 
  } = useVisualSearch();
  
  const { 
    analyzeOrigin: analyzeOriginBase, 
    isAnalyzing: isAnalyzingOrigin, 
    originResults 
  } = useOriginAnalysis();
  
  const { 
    submitEmail: submitEmailBase, 
    isSubmitting, 
    userEmail 
  } = useEmailSubmission();
  
  const { 
    analyzeWithOpenAI, 
    isAnalyzingWithOpenAI, 
    openAIResults 
  } = useOpenAIAnalysis();

  // Initialize session ID if not provided
  useEffect(() => {
    if (!initialSessionId) {
      const newSessionId = uuidv4();
      debug('Generated new session ID', { type: 'info', data: { sessionId: newSessionId } });
      setSessionId(newSessionId);
      setUploadSessionId(newSessionId);
    } else {
      setSessionId(initialSessionId);
      setUploadSessionId(initialSessionId);
    }
    setIsInitializing(false);
  }, [initialSessionId, setUploadSessionId]);

  // Handle image upload with proper error management
  const uploadImage = useCallback(async (file: File) => {
    setError(null);
    try {
      const result = await uploadImageBase(file);
      if (result) {
        setCurrentStep(1);
      }
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to upload image');
      handleError(apiError);
      return null;
    }
  }, [uploadImageBase, handleError]);

  // Handle visual search with proper session management
  const startVisualSearch = useCallback(async (searchSessionId: string) => {
    setError(null);
    try {
      await searchVisually(searchSessionId);
      setCurrentStep(2);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to run visual search');
      handleError(apiError);
    }
  }, [searchVisually, handleError]);

  // Handle origin analysis
  const analyzeOrigin = useCallback(async () => {
    setError(null);
    try {
      await analyzeOriginBase(sessionId);
      setCurrentStep(3);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to analyze origin');
      handleError(apiError);
    }
  }, [sessionId, analyzeOriginBase, handleError]);

  // Handle email submission
  const submitEmail = useCallback(async (email: string) => {
    setError(null);
    try {
      const result = await submitEmailBase(email, sessionId);
      if (result) {
        setCurrentStep(4);
      }
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to submit email');
      handleError(apiError);
      return false;
    }
  }, [sessionId, submitEmailBase, handleError]);

  // Handle image analysis workflow
  const analyzeImage = useCallback(async (file: File) => {
    setError(null);
    try {
      debug('Starting image analysis', { type: 'info', data: { sessionId } });
      
      // Upload the image
      await uploadImage(file);
      
      // If successful, proceed with visual search
      if (customerImage && sessionId) {
        await startVisualSearch(sessionId);
        
        // Run OpenAI analysis
        await analyzeWithOpenAI(sessionId);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Image analysis failed');
      handleError(apiError);
    }
  }, [sessionId, customerImage, uploadImage, startVisualSearch, analyzeWithOpenAI, handleError]);

  // Handle running origin analysis
  const runOriginAnalysis = useCallback(async () => {
    setError(null);
    try {
      await analyzeOrigin();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Origin analysis failed');
      handleError(apiError);
    }
  }, [analyzeOrigin, handleError]);

  // Handle email submission
  const submitUserEmail = useCallback(async (email: string) => {
    setError(null);
    try {
      await submitEmail(email);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Email submission failed');
      handleError(apiError);
    }
  }, [submitEmail, handleError]);

  return {
    // Session info
    sessionId,
    setSessionId,
    currentStep,
    isInitializing,
    
    // Core functions
    analyzeImage,
    runOriginAnalysis,
    submitUserEmail,
    
    // Exposed API functions for components
    uploadImage,
    startVisualSearch,
    testVisualSearch,
    submitEmail,
    analyzeOrigin,
    
    // Loading states
    isUploading,
    isSearching,
    isAnalyzingOrigin,
    isSubmitting,
    isAnalyzingWithOpenAI,
    
    // Results
    customerImage,
    searchResults,
    originResults,
    userEmail,
    openAIResults,
    
    // Error state
    error
  };
}
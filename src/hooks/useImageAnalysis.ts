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
  
  // Error handling
  const { error, handleError } = useErrorHandler();

  // API hooks
  const { uploadImage, isUploading, uploadError, imageData } = useImageUpload();
  const { searchVisually, isSearching, searchResults } = useVisualSearch();
  const { analyzeOrigin, isAnalyzing, originResults } = useOriginAnalysis();
  const { submitEmail, isSubmitting, emailSubmissionResult } = useEmailSubmission();
  const { analyzeWithOpenAI, isAnalyzingWithOpenAI, openAIResults } = useOpenAIAnalysis();

  // Initialize session ID if not provided
  useEffect(() => {
    if (!initialSessionId) {
      const newSessionId = uuidv4();
      debug('Generated new session ID', { type: 'info', data: { sessionId: newSessionId } });
      setSessionId(newSessionId);
    }
  }, [initialSessionId]);

  // Handle image upload and analysis
  const analyzeImage = useCallback(async (file: File) => {
    if (!sessionId) {
      debug('Cannot analyze image: No session ID', { type: 'error' });
      return;
    }

    try {
      debug('Starting image analysis', { type: 'info', data: { sessionId } });
      
      // Upload the image
      await uploadImage(file, sessionId);
      
      // Run visual search
      await searchVisually(sessionId);
      
      // Run OpenAI analysis
      await analyzeWithOpenAI(sessionId);
      
    } catch (err) {
      debug('Image analysis error', { type: 'error', data: err });
      handleError(err as ApiError);
    }
  }, [sessionId, uploadImage, searchVisually, analyzeWithOpenAI, handleError]);

  // Handle origin analysis
  const runOriginAnalysis = useCallback(async () => {
    if (!sessionId) {
      debug('Cannot analyze origin: No session ID', { type: 'error' });
      return;
    }

    try {
      await analyzeOrigin(sessionId);
    } catch (err) {
      debug('Origin analysis error', { type: 'error', data: err });
      handleError(err as ApiError);
    }
  }, [sessionId, analyzeOrigin, handleError]);

  // Handle email submission
  const submitUserEmail = useCallback(async (email: string) => {
    if (!sessionId) {
      debug('Cannot submit email: No session ID', { type: 'error' });
      return;
    }

    try {
      await submitEmail(email, sessionId);
    } catch (err) {
      debug('Email submission error', { type: 'error', data: err });
      handleError(err as ApiError);
    }
  }, [sessionId, submitEmail, handleError]);

  return {
    sessionId,
    analyzeImage,
    runOriginAnalysis,
    submitUserEmail,
    isUploading,
    isSearching,
    isAnalyzing,
    isSubmitting,
    isAnalyzingWithOpenAI,
    imageData,
    searchResults,
    originResults,
    emailSubmissionResult,
    openAIResults,
    error
  };
}
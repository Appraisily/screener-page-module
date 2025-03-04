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
  console.log('useImageAnalysis hook initialized with initialSessionId:', initialSessionId);
  
  // Session management
  const [sessionId, setSessionId] = useState<string>(initialSessionId || '');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // Error handling
  const { handleError } = useErrorHandler();
  const [error, setError] = useState<string | null>(null);

  // API hooks
  console.log('Initializing API hooks...');
  
  const { 
    uploadImage: uploadImageBase, 
    isUploading, 
    customerImage, 
    setSessionId: setUploadSessionId,
    setCustomerImage,
    uploadError 
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
  
  console.log('API hooks initialized successfully');

  // Initialize session ID if not provided
  useEffect(() => {
    console.log('useImageAnalysis initializing session ID effect');
    
    if (!initialSessionId) {
      const newSessionId = uuidv4();
      console.log('Generated new session ID:', newSessionId);
      debug('Generated new session ID', { type: 'info', data: { sessionId: newSessionId } });
      setSessionId(newSessionId);
      setUploadSessionId(newSessionId);
    } else {
      console.log('Using provided session ID:', initialSessionId);
      setSessionId(initialSessionId);
      setUploadSessionId(initialSessionId);
    }
    
    setIsInitializing(false);
    console.log('Session initialization complete');
    
  }, [initialSessionId, setUploadSessionId]);

  // Debug session state changes
  useEffect(() => {
    console.log('Session ID updated:', sessionId);
  }, [sessionId]);
  
  useEffect(() => {
    console.log('Customer image updated:', customerImage ? 'Has image' : 'No image');
  }, [customerImage]);
  
  useEffect(() => {
    console.log('Search results updated:', searchResults ? 'Has results' : 'No results');
  }, [searchResults]);

  // Handle image upload with proper error management
  const uploadImage = useCallback(async (file: File) => {
    console.log('uploadImage called with file:', file.name, file.type, file.size);
    setError(null);
    try {
      console.log('Calling uploadImageBase...');
      const result = await uploadImageBase(file);
      console.log('Upload result:', result ? 'Success' : 'Failed');
      if (result) {
        setCurrentStep(1);
      }
      return result;
    } catch (err) {
      console.error('Upload error:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to upload image');
      handleError(apiError);
      return null;
    }
  }, [uploadImageBase, handleError]);

  // Handle visual search with proper session management
  const startVisualSearch = useCallback(async (searchSessionId: string) => {
    console.log('startVisualSearch called with session ID:', searchSessionId);
    setError(null);
    try {
      console.log('Calling searchVisually...');
      await searchVisually(searchSessionId);
      console.log('Visual search completed');
      setCurrentStep(2);
    } catch (err) {
      console.error('Visual search error:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to run visual search');
      handleError(apiError);
    }
  }, [searchVisually, handleError]);

  // Handle origin analysis
  const analyzeOrigin = useCallback(async () => {
    console.log('analyzeOrigin called with session ID:', sessionId);
    setError(null);
    try {
      console.log('Calling analyzeOriginBase...');
      await analyzeOriginBase(sessionId);
      console.log('Origin analysis completed');
      setCurrentStep(3);
    } catch (err) {
      console.error('Origin analysis error:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to analyze origin');
      handleError(apiError);
    }
  }, [sessionId, analyzeOriginBase, handleError]);

  // Handle email submission
  const submitEmail = useCallback(async (email: string) => {
    console.log('submitEmail called with email:', email, 'and session ID:', sessionId);
    setError(null);
    try {
      console.log('Calling submitEmailBase...');
      const result = await submitEmailBase(email, sessionId);
      console.log('Email submission result:', result ? 'Success' : 'Failed');
      if (result) {
        setCurrentStep(4);
      }
      return result;
    } catch (err) {
      console.error('Email submission error:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to submit email');
      handleError(apiError);
      return false;
    }
  }, [sessionId, submitEmailBase, handleError]);

  // Handle image analysis workflow
  const analyzeImage = useCallback(async (file: File) => {
    console.log('analyzeImage called with file:', file.name);
    setError(null);
    try {
      debug('Starting image analysis', { type: 'info', data: { sessionId } });
      
      // Upload the image
      console.log('Starting image upload step...');
      await uploadImage(file);
      
      // If successful, proceed with visual search
      if (customerImage && sessionId) {
        console.log('Starting visual search step...');
        await startVisualSearch(sessionId);
        
        // Run OpenAI analysis
        console.log('Starting OpenAI analysis step...');
        await analyzeWithOpenAI(sessionId);
      }
    } catch (err) {
      console.error('Image analysis workflow error:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Image analysis failed');
      handleError(apiError);
    }
  }, [sessionId, customerImage, uploadImage, startVisualSearch, analyzeWithOpenAI, handleError]);

  return {
    // Session info
    sessionId,
    setSessionId,
    currentStep,
    isInitializing,
    
    // Core functions
    analyzeImage,
    runOriginAnalysis: analyzeOrigin,
    submitUserEmail: submitEmail,
    
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
    
    // Error states
    error,
    uploadError
  };
}
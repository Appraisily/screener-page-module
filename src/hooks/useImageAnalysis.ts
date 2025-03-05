import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { debug } from './utils/debug';
import api from '../lib/api';
import type { SearchResults, OriginResults, OpenAIAnalysisResults } from '../types';

export function useImageAnalysis(initialSessionId?: string) {
  console.log('useImageAnalysis hook initialized with initialSessionId:', initialSessionId);
  
  // Session management
  const [sessionId, setSessionId] = useState<string>(initialSessionId || '');
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // State for managing uploads and results
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isAnalyzingOrigin, setIsAnalyzingOrigin] = useState<boolean>(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState<boolean>(false);
  
  // Data states
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [originResults, setOriginResults] = useState<OriginResults | null>(null);
  const [openAIResults, setOpenAIResults] = useState<OpenAIAnalysisResults | null>(null);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize session id if not provided
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      debug('Generated new session ID', { sessionId: newSessionId });
    }
  }, [sessionId]);

  /**
   * Upload an image for analysis
   */
  const uploadImage = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setError(null);
    
    try {
      debug('Starting image upload', { sessionId });
      const result = await api.uploadImage(file, sessionId);
      
      // Update session id from response if different
      if (result.sessionId && result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }
      
      // Set the image URL
      setCustomerImage(result.imageUrl);
      
      debug('Upload successful', { imageUrl: result.imageUrl });
      
      // Auto-start full analysis after upload
      try {
        debug('Auto-starting full analysis', { sessionId: result.sessionId });
        const analysisResults = await api.fullAnalysis(result.sessionId);
        setOpenAIResults(analysisResults);
        console.log('Full analysis completed');
        
        // Auto-start visual search
        console.log('Auto-starting visual search with session ID:', result.sessionId);
        await startVisualSearch(result.sessionId);
      } catch (analysisError) {
        console.error('Auto-analysis failed:', analysisError);
        // Continue with just the upload
      }
      
      // Move to the next step
      setCurrentStep(prev => Math.max(prev, 1));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Image upload failed';
      setUploadError(errorMessage);
      debug('Upload failed', { error: errorMessage });
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [sessionId]);

  /**
   * Start visual similarity search
   */
  const startVisualSearch = useCallback(async (sid = sessionId) => {
    if (!sid) {
      setError('Session ID is required for visual search');
      return null;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      debug('Starting visual search', { sessionId: sid });
      const results = await api.visualSearch(sid);
      
      setSearchResults(results);
      debug('Search results processed', { processedResults: results });
      
      // Auto-start value estimation after visual search
      try {
        debug('Automatically calling find-value endpoint after visual search', { sessionId: sid });
        await api.valueEstimation(sid);
      } catch (estimationError) {
        debug('Automatic value estimation failed', { error: String(estimationError) });
        // Continue with just the search results
      }
      
      // Move to the next step
      setCurrentStep(prev => Math.max(prev, 2));
      console.log('Visual search completed');
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Visual search failed';
      setError(errorMessage);
      debug('Visual search failed', { error: errorMessage });
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, [sessionId]);

  /**
   * Analyze artwork origin
   */
  const analyzeOrigin = useCallback(async () => {
    if (!sessionId) {
      setError('Session ID is required for origin analysis');
      return null;
    }
    
    setIsAnalyzingOrigin(true);
    setError(null);
    
    try {
      debug('Starting origin analysis', { sessionId });
      const results = await api.originAnalysis(sessionId);
      
      setOriginResults(results);
      debug('Origin analysis completed', { results });
      
      // Move to the next step if higher
      setCurrentStep(prev => Math.max(prev, 3));
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Origin analysis failed';
      setError(errorMessage);
      debug('Origin analysis failed', { error: errorMessage });
      throw error;
    } finally {
      setIsAnalyzingOrigin(false);
    }
  }, [sessionId]);

  /**
   * Submit user email for results
   */
  const submitEmail = useCallback(async (email: string) => {
    if (!sessionId) {
      setError('Session ID is required for email submission');
      return false;
    }
    
    setIsSubmittingEmail(true);
    setError(null);
    
    try {
      debug('Submitting email', { email, sessionId });
      const success = await api.submitEmail(email, sessionId);
      
      debug('Email submission completed', { success });
      
      // Move to final step
      setCurrentStep(prev => Math.max(prev, 4));
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email submission failed';
      setError(errorMessage);
      debug('Email submission failed', { error: errorMessage });
      return false;
    } finally {
      setIsSubmittingEmail(false);
    }
  }, [sessionId]);

  /**
   * Test the visual search API (for development only)
   */
  const testVisualSearch = useCallback(async (testSessionId: string) => {
    try {
      debug('Testing visual search', { testSessionId });
      const results = await api.visualSearch(testSessionId);
      debug('Test results received', { results });
      return results;
    } catch (error) {
      debug('Test search failed', { error });
      throw error;
    }
  }, []);

  // Reset state when session changes
  useEffect(() => {
    if (sessionId) {
      debug('Session ID changed or initialized', { sessionId });
    }
  }, [sessionId]);

  // Log when searchResults changes
  useEffect(() => {
    if (searchResults) {
      console.log('Search results updated: Has results');
    } else {
      console.log('Search results updated: No results');
    }
  }, [searchResults]);

  return {
    // Session
    sessionId,
    currentStep,
    
    // Methods
    uploadImage,
    startVisualSearch,
    analyzeOrigin,
    submitEmail,
    testVisualSearch,
    setCustomerImage,
    
    // Status
    isUploading,
    isSearching,
    isAnalyzingOrigin,
    
    // Data
    customerImage,
    searchResults,
    originResults,
    openAIResults,
    
    // Errors
    error,
    uploadError
  };
}
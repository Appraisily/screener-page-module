import { useState, useEffect } from 'react';
import { useImageUpload } from './api/useImageUpload';
import { useVisualSearch } from './api/useVisualSearch';
import { useOriginAnalysis } from './api/useOriginAnalysis';
import { useEmailSubmission } from './api/useEmailSubmission';

export function useImageAnalysis(apiUrl?: string, initialSessionId?: string) {
  const effectiveApiUrl = apiUrl || import.meta.env.VITE_API_URL;
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(!!initialSessionId);

  const {
    uploadImage,
    isUploading,
    customerImage,
    sessionId,
    setSessionId,
    setCustomerImage,
    error: uploadError,
    setError: setUploadError
  } = useImageUpload(effectiveApiUrl);

  const {
    startVisualSearch,
    testVisualSearch,
    isSearching,
    searchResults,
    error: searchError,
    setError: setSearchError
  } = useVisualSearch(effectiveApiUrl);

  const {
    analyzeOrigin,
    isAnalyzing: isAnalyzingOrigin,
    originResults,
    error: originError,
    setError: setOriginError
  } = useOriginAnalysis(effectiveApiUrl);

  const {
    submitEmail,
    isSubmitting,
    userEmail,
    error: emailError,
    setError: setEmailError
  } = useEmailSubmission(effectiveApiUrl);

  // Combine errors
  const error = uploadError || searchError || originError || emailError;

  // Clear all errors
  const clearErrors = () => {
    setUploadError(null);
    setSearchError(null);
    setOriginError(null);
    setEmailError(null);
  };

  // Handle step transitions
  useEffect(() => {
    if (searchResults) {
      setCurrentStep(2);
    }
    if (originResults) {
      setCurrentStep(3);
    }
    if (userEmail) {
      setCurrentStep(4);
    }
  }, [searchResults, originResults, userEmail]);

  // Initialize with session ID if provided
  useEffect(() => {
    if (initialSessionId && !sessionId) {
      setIsInitializing(true);
      setSessionId(initialSessionId);
      
      // Fetch the temporary image
      fetch(`${effectiveApiUrl}/image/${initialSessionId}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch image');
          return response.url;
        })
        .then(imageUrl => {
          setCustomerImage(imageUrl);
          // Start visual search automatically
          return startVisualSearch(initialSessionId);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [initialSessionId, effectiveApiUrl]);

  return {
    // Image upload
    uploadImage,
    isUploading,
    customerImage,
    sessionId,
    isInitializing,

    // Visual search
    startVisualSearch,
    isSearching,
    searchResults,

    // Origin analysis
    analyzeOrigin: () => sessionId && analyzeOrigin(sessionId),
    isAnalyzingOrigin,
    originResults,

    // Email submission
    submitEmail: async (email: string) => sessionId && submitEmail(email, sessionId),
    isSubmitting,
    userEmail,

    // Common
    error,
    clearErrors,
    currentStep
  };
}
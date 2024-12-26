import { useState, useEffect } from 'react';
import { useImageUpload } from './api/useImageUpload';
import { useVisualSearch } from './api/useVisualSearch';
import { useOriginAnalysis } from './api/useOriginAnalysis';
import { useEmailSubmission } from './api/useEmailSubmission';

export function useImageAnalysis(apiUrl?: string, initialSessionId?: string) {
  const effectiveApiUrl = apiUrl || import.meta.env.VITE_API_URL;
  const [currentStep, setCurrentStep] = useState(1);

  const {
    uploadImage,
    isUploading,
    customerImage,
    sessionId,
    error: uploadError,
    setError: setUploadError
  } = useImageUpload(effectiveApiUrl);

  const {
    startVisualSearch,
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

  return {
    // Image upload
    uploadImage,
    isUploading,
    customerImage,
    sessionId,

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
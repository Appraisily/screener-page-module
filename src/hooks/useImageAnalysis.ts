import { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from './api/useImageUpload';
import { useEmailSubmission } from './api/useEmailSubmission';
import { useAnalysisState } from './useAnalysisState';
import { useFullAnalysis } from './useFullAnalysis';
import type { SearchResults, AnalysisStep } from '../types';

// Enhanced analysis steps with percentage completion tracking
const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'visual',
    title: 'Visual Search',
    description: 'Finding similar items...',
    status: 'pending',
    percentComplete: 0
  },
  {
    id: 'details',
    title: 'Details Analysis',
    description: 'Analyzing characteristics...',
    status: 'pending',
    percentComplete: 0
  },
  {
    id: 'origin',
    title: 'Origin Check',
    description: 'Determining likely origin...',
    status: 'pending',
    percentComplete: 0
  },
  {
    id: 'market',
    title: 'Market Research',
    description: 'Finding comparable sales...',
    status: 'pending',
    percentComplete: 0
  }
];

export function useImageAnalysis(apiUrl?: string, initialSessionId?: string) {
  const effectiveApiUrl = apiUrl || import.meta.env.VITE_API_URL;
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [shouldPollResults, setShouldPollResults] = useState(false);
  const [originResults, setOriginResults] = useState(null);
  const [isAnalyzingOrigin, setIsAnalyzingOrigin] = useState(false);

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
    onStart: () => {
      setIsAnalyzing(true);
      setCurrentStepIndex(0);
      setShouldPollResults(true);
      
      // Reset all steps
      setAnalysisSteps(ANALYSIS_STEPS.map(step => ({ ...step, status: 'pending', percentComplete: 0 })));
      
      // Start first step as processing
      updateStepProgress('visual', 'processing', 0);
    },
    onComplete: (results) => {
      setState(prev => ({
        ...prev,
        searchResults: results,
        itemType: results?.metadata?.analysisResults?.openaiAnalysis?.category || null
      }));
      
      // Mark all steps as completed
      analysisSteps.forEach(step => {
        updateStepProgress(step.id, 'completed', 100);
      });
      
      setIsAnalyzing(false);
      setShouldPollResults(false);
    },
    onError: (error) => {
      setState(prev => ({ ...prev, error }));
      setIsAnalyzing(false);
      setShouldPollResults(false);
    }
  });

  const {
    submitEmail,
    error: emailError
  } = useEmailSubmission(effectiveApiUrl);

  // Update a specific step's status and progress
  const updateStepProgress = useCallback((stepId: string, status: AnalysisStep['status'], percentComplete: number) => {
    setAnalysisSteps(current => 
      current.map(step => 
        step.id === stepId 
          ? { ...step, status, percentComplete: Math.min(100, percentComplete) }
          : step
      )
    );
    
    // If we've completed a step, move to the next one
    if (status === 'completed') {
      const stepIndex = analysisSteps.findIndex(step => step.id === stepId);
      if (stepIndex >= 0 && stepIndex === currentStepIndex) {
        setCurrentStepIndex(prev => Math.min(prev + 1, analysisSteps.length - 1));
      }
    }
  }, [analysisSteps, currentStepIndex]);

  // Determine the overall analysis progress percentage
  const calculateOverallProgress = useCallback(() => {
    const totalSteps = analysisSteps.length;
    if (totalSteps === 0) return 0;
    
    const completedSteps = analysisSteps.filter(step => step.status === 'completed').length;
    const currentStep = analysisSteps[currentStepIndex];
    const currentStepContribution = 
      currentStep && currentStep.status === 'processing' 
        ? (currentStep.percentComplete / 100) / totalSteps 
        : 0;
    
    return Math.min(100, Math.round((completedSteps / totalSteps + currentStepContribution) * 100));
  }, [analysisSteps, currentStepIndex]);

  // Combine upload and analysis into a single flow
  const handleUpload = useCallback(async (file: File) => {
    try {
      // Upload the image
      const uploadedSessionId = await uploadImageBase(file);
      if (uploadedSessionId) {
        // Start the analysis process - value estimation will be triggered 
        // by the progress hooks from useProgressiveResults
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

  // Placeholder for origin analysis
  const analyzeOrigin = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setIsAnalyzingOrigin(true);
      
      // This would be a real API call in the actual implementation
      // const response = await fetch(`${effectiveApiUrl}/origin-analysis`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ sessionId })
      // });
      
      // Simulated response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOriginResults({
        originality: 'original',
        confidence: 0.85,
        style_analysis: 'Abstract expressionist with contemporary influence',
        unique_characteristics: [
          'Bold brushstrokes',
          'Vibrant color palette',
          'Textured canvas surface',
          'Asymmetrical composition'
        ],
        comparison_notes: 'Shows similarities to mid-century abstract works but with a contemporary approach',
        recommendation: 'This appears to be an original work worthy of professional appraisal'
      });
    } catch (error) {
      console.error('Origin analysis error:', error);
    } finally {
      setIsAnalyzingOrigin(false);
    }
  }, [sessionId, effectiveApiUrl]);

  return {
    uploadImage: handleUpload,
    startFullAnalysis,
    submitEmail: handleEmailSubmit,
    analyzeOrigin,
    resetState,
    isUploading,
    isAnalyzing,
    isInitializing: state.isInitializing,
    isAnalyzingOrigin,
    customerImage,
    sessionId,
    setSessionId,
    gcsImageUrl: state.gcsImageUrl,
    searchResults: state.searchResults,
    originResults,
    error: state.error,
    analysisSteps,
    hasEmailBeenSubmitted: state.hasEmailBeenSubmitted,
    itemType: state.itemType,
    // Progressive loading properties
    updateStepProgress,
    overallProgress: calculateOverallProgress(),
    shouldPollResults,
    currentStepIndex
  };
}
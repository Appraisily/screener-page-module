import { useState, useCallback, useEffect } from 'react';
import type { AnalysisStep } from '../types';

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

export function useAnalysisProgress() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [shouldPollResults, setShouldPollResults] = useState(false);

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

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setShouldPollResults(true);
    
    // Reset all steps
    setAnalysisSteps(ANALYSIS_STEPS.map(step => ({ ...step, status: 'pending', percentComplete: 0 })));
    
    // Start first step as processing
    updateStepProgress('visual', 'processing', 0);
    
    // We'll simulate progress for demo purposes, but in real implementation
    // this would come from polling the backend
    const simulateProgress = () => {
      const currentStep = analysisSteps[currentStepIndex];
      if (currentStep && currentStep.status === 'processing') {
        updateStepProgress(
          currentStep.id, 
          'processing',
          Math.min(100, (currentStep.percentComplete || 0) + Math.random() * 10)
        );
        
        // If this step is almost complete, mark it as completed and move to next
        if (currentStep.percentComplete >= 95) {
          updateStepProgress(currentStep.id, 'completed', 100);
          
          // Start next step if available
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < analysisSteps.length) {
            setCurrentStepIndex(nextIndex);
            updateStepProgress(analysisSteps[nextIndex].id, 'processing', 0);
          } else {
            // All steps complete
            setShouldPollResults(false);
          }
        }
      }
    };
    
    // Create an interval to simulate progress updates
    const interval = setInterval(simulateProgress, 800);
    
    return () => {
      clearInterval(interval);
      setShouldPollResults(false);
    };
  }, [analysisSteps, currentStepIndex, updateStepProgress]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setShouldPollResults(false);
    setAnalysisSteps(ANALYSIS_STEPS);
    setCurrentStepIndex(0);
  }, []);

  // Simulate an error in a specific step (for testing)
  const setStepError = useCallback((stepId: string) => {
    updateStepProgress(stepId, 'error', 0);
  }, [updateStepProgress]);

  return {
    isAnalyzing,
    analysisSteps,
    currentStepIndex,
    shouldPollResults,
    overallProgress: calculateOverallProgress(),
    startAnalysis,
    stopAnalysis,
    updateStepProgress,
    setStepError
  };
}
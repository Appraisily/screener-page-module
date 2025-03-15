import { useState, useCallback } from 'react';
import type { AnalysisStep } from '../types';

const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'visual',
    title: 'Visual Search',
    description: 'Finding similar items...',
    status: 'pending'
  },
  {
    id: 'details',
    title: 'Details Analysis',
    description: 'Analyzing characteristics...',
    status: 'pending'
  },
  {
    id: 'origin',
    title: 'Origin Check',
    description: 'Determining likely origin...',
    status: 'pending'
  },
  {
    id: 'market',
    title: 'Market Research',
    description: 'Finding comparable sales...',
    status: 'pending'
  }
];

export function useAnalysisProgress() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalysisSteps(ANALYSIS_STEPS);

    // Start progress simulation
    const stepInterval = Math.floor(7500 / ANALYSIS_STEPS.length); // 7.5 seconds total
    const interval = setInterval(() => {
      setCurrentStepIndex(current => {
        const nextIndex = current + 1;
        if (nextIndex >= ANALYSIS_STEPS.length) {
          clearInterval(interval);
          return current;
        }
        return nextIndex;
      });

      setAnalysisSteps(current =>
        current.map((step, index) => ({
          ...step,
          status: index < currentStepIndex ? 'completed' 
                 : index === currentStepIndex ? 'processing' 
                 : 'pending'
        }))
      );
    }, stepInterval);

    return () => clearInterval(interval);
  }, []);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setAnalysisSteps(ANALYSIS_STEPS);
    setCurrentStepIndex(0);
  }, []);

  return {
    isAnalyzing,
    analysisSteps,
    startAnalysis,
    stopAnalysis
  };
}
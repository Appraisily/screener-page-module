import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';
import { OpenAIAnalysisResults } from '../../types';

export function useOpenAIAnalysis() {
  const [isAnalyzingWithOpenAI, setIsAnalyzingWithOpenAI] = useState(false);
  const [openAIResults, setOpenAIResults] = useState<OpenAIAnalysisResults | null>(null);
  const { handleError } = useErrorHandler();

  const analyzeWithOpenAI = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    setIsAnalyzingWithOpenAI(true);
    debug('Starting OpenAI analysis', { 
      type: 'info',
      data: { sessionId }
    });

    try {
      // Use the API client to call OpenAI analysis
      const response = await api.analyzeWithOpenAI(sessionId);
      
      // Extract the data from the response
      const results = response.data;
      
      setOpenAIResults(results);
      return results;

    } catch (err) {
      const error = err as ApiError;
      handleError(error);
      setOpenAIResults(null);
      return null;
    } finally {
      setIsAnalyzingWithOpenAI(false);
    }
  }, [handleError]);

  return {
    analyzeWithOpenAI,
    isAnalyzingWithOpenAI,
    openAIResults
  };
} 
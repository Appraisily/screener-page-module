import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';
import { OpenAIAnalysisResults } from '../../types';

// Define the API response type
interface OpenAIAnalysisResponse {
  success: boolean;
  message?: string;
  data: {
    detailedAnalysis: OpenAIAnalysisResults;
  };
}

export function useOpenAIAnalysis() {
  const [isAnalyzingWithOpenAI, setIsAnalyzingWithOpenAI] = useState(false);
  const [openAIResults, setOpenAIResults] = useState<OpenAIAnalysisResults | null>(null);
  const { handleError } = useErrorHandler();

  const analyzeWithOpenAI = useCallback(async (sessionId: string) => {
    if (!sessionId) return null;

    setIsAnalyzingWithOpenAI(true);
    debug('Starting full analysis with OpenAI', { 
      type: 'info',
      data: { sessionId }
    });

    try {
      // Use the API client with the correct endpoint name from API docs
      const response = await api.analyzeWithOpenAI<OpenAIAnalysisResponse>(sessionId);
      
      // Handle the standardized response format per API docs
      if (response && response.data && response.data.detailedAnalysis) {
        const results = response.data.detailedAnalysis;
        debug('Full analysis results received', { 
          type: 'info',
          data: { resultKeys: Object.keys(results) }
        });
        setOpenAIResults(results);
        return results;
      } else {
        debug('Invalid full analysis response format', {
          type: 'warn',
          data: { response }
        });
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      const error = err as ApiError;
      debug('Full analysis error', { 
        type: 'error',
        data: { message: error.message, code: error.code }
      });
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
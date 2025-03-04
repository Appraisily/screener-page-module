import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import type { OriginResults } from '../../types';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

export function useOriginAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [originResults, setOriginResults] = useState<OriginResults | null>(null);
  const { handleError } = useErrorHandler();

  const analyzeOrigin = useCallback(async (sessionId: string) => {
    if (!sessionId) {
      debug('Cannot analyze origin: No session ID', { type: 'error' });
      return;
    }

    setIsAnalyzing(true);
    debug('Starting origin analysis', { type: 'info', data: { sessionId } });

    try {
      // Use the API client with updated endpoint
      const response = await api.getOriginAnalysis(sessionId);
      
      debug('Origin analysis results received', { type: 'info' });
      
      // Extract origin data from the standardized response format
      if (response && response.origin) {
        setOriginResults(response.origin as OriginResults);
      } else {
        debug('Invalid origin analysis response format', { 
          type: 'warning',
          data: { response }
        });
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      debug('Origin analysis error', { type: 'error', data: err });
      handleError(err as ApiError);
    } finally {
      setIsAnalyzing(false);
    }
  }, [handleError]);

  return {
    analyzeOrigin,
    isAnalyzing,
    originResults
  };
}
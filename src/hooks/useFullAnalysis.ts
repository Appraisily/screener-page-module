import { useCallback, useRef } from 'react';
import type { SearchResults } from '../types';

interface AnalysisCallbacks {
  onStart?: () => void;
  onComplete?: (results: SearchResults) => void;
  onError?: (error: string) => void;
}

export function useFullAnalysis(apiUrl: string, callbacks: AnalysisCallbacks) {
  const analysisInProgress = useRef(false);
  const { onStart, onComplete, onError } = callbacks;

  const startFullAnalysis = useCallback(async (sessionId: string) => {
    if (!sessionId || analysisInProgress.current) return;

    try {
      analysisInProgress.current = true;
      onStart?.();

      const response = await fetch(`${apiUrl}/full-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }
      
      console.log('Full analysis API returned complete data:', data);
      
      // Ensure we're capturing all the data from the response
      const completeResults = {
        metadata: data.results.metadata,
        detailedAnalysis: data.results.detailedAnalysis,
        // Include any other fields that might be present
        ...(data.results.visualAnalysis && { visualAnalysis: data.results.visualAnalysis }),
        ...(data.results.originAnalysis && { originAnalysis: data.results.originAnalysis }),
        timestamp: data.timestamp || Date.now()
      };

      onComplete?.(completeResults);
      return completeResults;

    } catch (err) {
      const error = err instanceof Error ? err.message : 'Analysis failed';
      onError?.(error);
      throw err;
    } finally {
      analysisInProgress.current = false;
    }
  }, [apiUrl, onStart, onComplete, onError]);

  return {
    startFullAnalysis,
    error: null // We're handling errors through callbacks
  };
}
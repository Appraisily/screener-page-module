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

      onComplete?.(data.results);
      return data.results;

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
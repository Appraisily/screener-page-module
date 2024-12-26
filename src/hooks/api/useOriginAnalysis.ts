import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import type { OriginResults } from '../../types';

export function useOriginAnalysis(apiUrl: string) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originResults, setOriginResults] = useState<OriginResults | null>(null);

  const analyzeOrigin = useCallback(async (sessionId: string) => {
    if (!sessionId) {
      debug('Cannot analyze origin: No session ID', { type: 'error' });
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${apiUrl}/origin-analysis`, {
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
        throw new Error(data.message || 'Origin analysis failed');
      }

      setOriginResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Origin analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiUrl]);

  return {
    analyzeOrigin,
    isAnalyzing,
    error,
    originResults,
    setError,
    setOriginResults
  };
}
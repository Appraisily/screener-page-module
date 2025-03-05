import { useState, useCallback } from 'react';

interface AuctionResult {
  title: string;
  price: number;
  currency: string;
  house: string;
  date: string;
  description?: string;
}

interface ValueEstimationResult {
  timestamp: number;
  query: string;
  success: boolean;
  minValue: number;
  maxValue: number;
  mostLikelyValue: number;
  explanation: string;
  auctionResults: AuctionResult[];
  auctionResultsCount: number;
}

export function useValueEstimation(apiUrl: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValueEstimationResult | null>(null);

  const getValueEstimation = useCallback(async (sessionId: string): Promise<ValueEstimationResult | null> => {
    if (!sessionId) return null;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/find-value`, {
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
        throw new Error(data.message || 'Failed to get value estimation');
      }

      setResult(data.results);
      return data.results;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get value estimation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  return {
    getValueEstimation,
    isLoading,
    error,
    result
  };
}
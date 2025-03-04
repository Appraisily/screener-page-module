import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

// Interface for value estimation results based on API docs
interface ValueEstimationResults {
  timestamp: number;
  query: string;
  estimatedValueRange: {
    low: number;
    high: number;
    currency: string;
  };
  confidence: string;
  marketTrends: string;
  additionalNotes: string;
  auctionResults: Array<{
    title: string;
    price: number;
    currency: string;
    house: string;
    date: string;
    description: string;
  }>;
  auctionResultsCount: number;
}

export function useValueEstimation() {
  const [isEstimating, setIsEstimating] = useState(false);
  const [valueResults, setValueResults] = useState<ValueEstimationResults | null>(null);
  const { handleError } = useErrorHandler();

  const estimateValue = useCallback(async (sessionId: string) => {
    if (!sessionId) {
      debug('Cannot estimate value: No session ID', { type: 'error' });
      return null;
    }

    setIsEstimating(true);
    debug('Starting value estimation', { type: 'info', data: { sessionId } });

    try {
      // Call the find-value endpoint
      const response = await api.findValue(sessionId);
      
      debug('Value estimation results received', { type: 'info' });
      
      // Handle the standardized response format
      if (response && response.results) {
        setValueResults(response.results as ValueEstimationResults);
        return response.results as ValueEstimationResults;
      } else {
        debug('Invalid value estimation response format', {
          type: 'warning',
          data: { response }
        });
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      debug('Value estimation error', { type: 'error', data: err });
      handleError(err as ApiError);
      return null;
    } finally {
      setIsEstimating(false);
    }
  }, [handleError]);

  return {
    estimateValue,
    isEstimating,
    valueResults
  };
} 
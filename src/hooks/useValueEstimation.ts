import { useState, useCallback, useEffect } from 'react';

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

interface ValueEstimationProgress {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
  percentComplete: number;
  stage: string;
  message: string;
  estimatedTimeRemaining?: number; // in seconds
}

export function useValueEstimation(apiUrl: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValueEstimationResult | null>(null);
  const [progress, setProgress] = useState<ValueEstimationProgress>({
    status: 'idle',
    percentComplete: 0,
    stage: 'Not started',
    message: 'Value estimation not yet started'
  });
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Function to check the status of value estimation
  const checkValueEstimationStatus = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${apiUrl}/find-value/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        // If endpoint doesn't exist yet, simulate progress
        if (response.status === 404) {
          // Simulate progress based on time
          setProgress(prev => {
            // Don't overwrite if we've already completed or errored
            if (prev.status === 'completed' || prev.status === 'error') {
              return prev;
            }
            
            const newPercent = Math.min(prev.percentComplete + 3, 95);
            
            // Update stage based on progress percentage
            let stage = prev.stage;
            let message = prev.message;
            
            if (newPercent < 20) {
              stage = 'Finding similar items';
              message = 'Searching auction databases for similar items...';
            } else if (newPercent < 40) {
              stage = 'Analyzing market trends';
              message = 'Analyzing recent market trends for this type of item...';
            } else if (newPercent < 60) {
              stage = 'Evaluating condition factors';
              message = 'Evaluating condition and quality factors...';
            } else if (newPercent < 80) {
              stage = 'Calculating value ranges';
              message = 'Calculating probable value ranges based on data...';
            } else {
              stage = 'Finalizing appraisal';
              message = 'Finalizing value estimation and preparing report...';
            }
            
            return {
              status: 'processing',
              percentComplete: newPercent,
              stage,
              message,
              estimatedTimeRemaining: Math.round((100 - newPercent) / 3) // Rough estimate
            };
          });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'completed') {
        setProgress({
          status: 'completed',
          percentComplete: 100,
          stage: 'Value estimation complete',
          message: 'Your item value estimation is ready!'
        });
        
        // Stop polling if we're complete
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        // Automatically fetch the complete results
        getValueEstimation(sessionId);
      } else if (data.status === 'error') {
        setProgress({
          status: 'error',
          percentComplete: data.percentComplete || 0,
          stage: 'Error in value estimation',
          message: data.message || 'An error occurred during value estimation'
        });
        
        // Stop polling on error
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
      } else {
        setProgress({
          status: data.status || 'processing',
          percentComplete: data.percentComplete || 0,
          stage: data.stage || 'Processing',
          message: data.message || 'Analyzing your item for value estimation...',
          estimatedTimeRemaining: data.estimatedTimeRemaining
        });
      }
    } catch (err) {
      console.error('Error checking value estimation status:', err);
      // Don't update progress on network errors, just keep trying
    }
  }, [apiUrl, statusCheckInterval, getValueEstimation]);

  // Main function to start value estimation
  const getValueEstimation = useCallback(async (sessionId: string): Promise<ValueEstimationResult | null> => {
    if (!sessionId) return null;

    setError(null);
    setIsLoading(true);
    
    // Initialize progress state
    setProgress({
      status: 'processing',
      percentComplete: 5,
      stage: 'Starting value estimation',
      message: 'Initiating the value estimation process...',
      estimatedTimeRemaining: 45 // Initial estimate of 45 seconds
    });
    
    // Set up status polling (every 2 seconds)
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
    
    const interval = setInterval(() => {
      checkValueEstimationStatus(sessionId);
    }, 2000);
    
    setStatusCheckInterval(interval);

    try {
      // Make the actual API call
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

      // Update progress to completed
      setProgress({
        status: 'completed',
        percentComplete: 100,
        stage: 'Value estimation complete',
        message: 'Your item value estimation is ready!'
      });
      
      // Stop polling
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }

      setResult(data.results);
      return data.results;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get value estimation';
      setError(errorMessage);
      
      // Update progress to error state
      setProgress({
        status: 'error',
        percentComplete: progress.percentComplete,
        stage: 'Error in value estimation',
        message: errorMessage
      });
      
      // Stop polling on error
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, progress.percentComplete, statusCheckInterval, checkValueEstimationStatus]);

  return {
    getValueEstimation,
    checkValueEstimationStatus,
    isLoading,
    error,
    result,
    progress
  };
}
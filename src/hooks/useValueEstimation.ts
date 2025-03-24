import { useState, useCallback, useEffect, useRef } from 'react';

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

  // Create a stable reference for the getValueEstimation function to prevent initialization issues
  const getValueEstimationRef = useRef<(sessionId: string) => Promise<ValueEstimationResult | null>>();

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
        if (getValueEstimationRef.current) {
          getValueEstimationRef.current(sessionId);
        }
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
  }, [apiUrl, statusCheckInterval]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    };
  }, [statusCheckInterval]);

  // Main function to start value estimation - completely rewritten to avoid circular dependencies
  const getValueEstimation = useCallback(function safeGetValueEstimation(sessionId: string): Promise<ValueEstimationResult | null> {
    // Guard against null session ID
    if (!sessionId) {
      console.error('getValueEstimation called with null sessionId');
      return Promise.resolve(null);
    }

    // Reset error state and set loading
    setError(null);
    setIsLoading(true);
    
    console.log(`Starting value estimation for session: ${sessionId}`);
    
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
      setStatusCheckInterval(null);
    }
    
    // Start a new status check interval
    try {
      const newInterval = setInterval(() => {
        // Safe call to prevent circular references
        try {
          const safeSessionId = sessionId;
          
          // Directly implement status checking logic to avoid circular dependencies
          fetch(`${apiUrl}/find-value/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: safeSessionId })
          })
          .then(response => {
            if (!response.ok) {
              if (response.status === 404) {
                // Simulate progress based on time
                setProgress(prev => {
                  // Don't overwrite if already completed/errored
                  if (prev.status === 'completed' || prev.status === 'error') return prev;
                  
                  const newPercent = Math.min(prev.percentComplete + 3, 95);
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
                    estimatedTimeRemaining: Math.round((100 - newPercent) / 3)
                  };
                });
                return;
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (!data) return;
            
            if (data.status === 'completed') {
              setProgress({
                status: 'completed',
                percentComplete: 100,
                stage: 'Value estimation complete',
                message: 'Your item value estimation is ready!'
              });
              
              if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                setStatusCheckInterval(null);
              }
            } else if (data.status === 'error') {
              setProgress({
                status: 'error',
                percentComplete: data.percentComplete || 0,
                stage: 'Error in value estimation',
                message: data.message || 'An error occurred during value estimation'
              });
              
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
          })
          .catch(err => {
            console.error('Error checking value estimation status:', err);
          });
        } catch (innerErr) {
          console.error('Error in status check interval:', innerErr);
        }
      }, 2000);
      
      setStatusCheckInterval(newInterval);
    } catch (err) {
      console.error('Error setting up status check interval:', err);
    }
    
    // Return a promise that handles the API call
    return new Promise((resolve, reject) => {
      // Make the actual API call
      console.log(`Making request to ${apiUrl}/find-value for session ${sessionId}`);
      
      fetch(`${apiUrl}/find-value`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      })
      .then(response => {
        // Log the response status
        console.log(`Value estimation API response status: ${response.status}`);
        
        if (!response.ok) {
          // Try to get more details from the error response
          return response.text().then(errorText => {
            console.error(`Value estimation API error: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Value estimation API response:', data);
        
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
        resolve(data.results);
      })
      .catch(err => {
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
        
        resolve(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
    });
  }, [apiUrl, progress.percentComplete, statusCheckInterval]);

  // Assign the getValueEstimation function to the reference
  getValueEstimationRef.current = getValueEstimation;

  return {
    getValueEstimation,
    checkValueEstimationStatus,
    isLoading,
    error,
    result,
    progress
  };
}
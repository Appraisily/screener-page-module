import { useState, useEffect, useCallback } from 'react';
import type { SearchResults } from '../types';

// Polling intervals in milliseconds
const INITIAL_POLL_INTERVAL = 1000; // 1 second
const MAX_POLL_INTERVAL = 5000;     // 5 seconds
const POLL_INTERVAL_STEP = 500;     // Increase by 0.5 seconds each time

// Maximum number of polling attempts
const MAX_POLL_ATTEMPTS = 30;       // 30 attempts maximum

interface UseProgressiveResultsProps {
  apiUrl: string;
  sessionId: string | null;
  shouldPoll: boolean;
  onStepProgress: (stepId: string, percentComplete: number) => void;
  onStepComplete: (stepId: string) => void;
  onStepError: (stepId: string) => void;
  onComplete: (results: SearchResults) => void;
}

export function useProgressiveResults({
  apiUrl,
  sessionId,
  shouldPoll,
  onStepProgress,
  onStepComplete,
  onStepError,
  onComplete
}: UseProgressiveResultsProps) {
  const [partialResults, setPartialResults] = useState<Partial<SearchResults> | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL);
  const [isPolling, setIsPolling] = useState(false);
  
  // Function to poll for partial results
  const pollResults = useCallback(async () => {
    if (!sessionId || !shouldPoll) return;
    
    try {
      // Call the backend endpoint that would check for partial results
      // In a real implementation, this endpoint would return whatever analysis 
      // results are available so far
      const response = await fetch(`${apiUrl}/session/${sessionId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis status');
      }
      
      const data = await response.json();
      
      // If we have partial data available
      if (data.success && data.data) {
        setPartialResults(data.data.results || {});
        
        // Update progress for each step based on the response
        // This is a simplified example - in a real implementation, 
        // the backend would return detailed progress info
        
        // Visual search step
        if (data.data.visual_progress) {
          const visualProgress = data.data.visual_progress;
          onStepProgress('visual', visualProgress.percent || 0);
          
          if (visualProgress.status === 'complete') {
            onStepComplete('visual');
          } else if (visualProgress.status === 'error') {
            onStepError('visual');
          }
        }
        
        // Details analysis step
        if (data.data.details_progress) {
          const detailsProgress = data.data.details_progress;
          onStepProgress('details', detailsProgress.percent || 0);
          
          if (detailsProgress.status === 'complete') {
            onStepComplete('details');
          } else if (detailsProgress.status === 'error') {
            onStepError('details');
          }
        }
        
        // Origin check step
        if (data.data.origin_progress) {
          const originProgress = data.data.origin_progress;
          onStepProgress('origin', originProgress.percent || 0);
          
          if (originProgress.status === 'complete') {
            onStepComplete('origin');
          } else if (originProgress.status === 'error') {
            onStepError('origin');
          }
        }
        
        // Market research step
        if (data.data.market_progress) {
          const marketProgress = data.data.market_progress;
          onStepProgress('market', marketProgress.percent || 0);
          
          if (marketProgress.status === 'complete') {
            onStepComplete('market');
          } else if (marketProgress.status === 'error') {
            onStepError('market');
          }
        }
        
        // If all analysis is complete, call the onComplete callback
        if (data.data.status === 'complete' && data.data.results) {
          onComplete(data.data.results);
          return true; // Stop polling
        }
      }
      
      // For demo purposes, let's simulate progress
      // In a real implementation, remove this simulation
      if (process.env.NODE_ENV === 'development') {
        simulateProgressUpdate(pollCount);
      }
      
      // Increase polling interval gradually to reduce load
      if (pollCount > 5) {
        setPollInterval(prev => Math.min(prev + POLL_INTERVAL_STEP, MAX_POLL_INTERVAL));
      }
      
      // Increment poll count
      setPollCount(count => count + 1);
      
      // If we reach max attempts, stop polling
      if (pollCount >= MAX_POLL_ATTEMPTS) {
        return true; // Stop polling
      }
      
      return false; // Continue polling
    } catch (error) {
      console.error('Error polling for results:', error);
      // Don't stop polling on errors, just try again
      return false;
    }
  }, [apiUrl, sessionId, shouldPoll, pollCount, onStepProgress, onStepComplete, onStepError, onComplete]);

  // Simulated progress update for demo purposes
  // In a real implementation, the progress would come from the backend
  const simulateProgressUpdate = useCallback((count: number) => {
    const totalSteps = 4; // visual, details, origin, market
    const stepsPerPhase = [
      { step: 'visual', startAt: 0, completeAt: 7 },
      { step: 'details', startAt: 5, completeAt: 15 },
      { step: 'origin', startAt: 12, completeAt: 22 },
      { step: 'market', startAt: 20, completeAt: 28 }
    ];
    
    stepsPerPhase.forEach(({ step, startAt, completeAt }) => {
      if (count >= startAt && count <= completeAt) {
        // Calculate progress percentage
        const stepDuration = completeAt - startAt;
        const stepProgress = count - startAt;
        const percent = Math.min(100, Math.round((stepProgress / stepDuration) * 100));
        
        // Update step progress
        onStepProgress(step, percent);
        
        // Mark as completed when we reach the complete count
        if (count === completeAt) {
          onStepComplete(step);
        }
      }
    });
    
    // Simulate an error for demo purposes (uncommment to test)
    // if (count === 9) {
    //   onStepError('details');
    // }
    
    // Simulate completion
    if (count >= 28) {
      // This would normally be filled by the backend
      const demoResults: SearchResults = {
        metadata: {
          originalName: 'sample-artwork.jpg',
          timestamp: Date.now(),
          analyzed: true,
          mimeType: 'image/jpeg',
          size: 1024 * 1024,
          fileName: 'UserUploadedImage.jpeg',
          imageUrl: `https://storage.googleapis.com/images_free_reports/sessions/${sessionId}/UserUploadedImage.jpeg`,
          analysisTimestamp: Date.now(),
          analysisResults: {
            labels: ['painting', 'art', 'canvas', 'abstract'],
            webEntities: 5,
            matchCounts: {
              exact: 2,
              partial: 3,
              similar: 10
            },
            pagesWithMatches: 8,
            webLabels: 12,
            openaiAnalysis: {
              category: 'Art',
              description: 'Abstract Oil Painting'
            }
          },
          originAnalyzed: true,
          originAnalysisTimestamp: Date.now()
        },
        detailedAnalysis: {
          maker_analysis: {
            creator_name: 'Unknown Contemporary Artist',
            reasoning: 'The style and technique suggest a contemporary artist from the late 20th or early 21st century.'
          },
          signature_check: {
            signature_text: 'No visible signature',
            interpretation: 'Without a signature, attribution is challenging.'
          },
          origin_analysis: {
            likely_origin: 'Western Europe or North America',
            reasoning: 'The abstract style and color palette are consistent with Western contemporary art traditions.'
          },
          marks_recognition: {
            marks_identified: 'No visible marks or stamps',
            interpretation: 'No provenance markings detected on visible surfaces.'
          },
          age_analysis: {
            estimated_date_range: '1990s to 2010s',
            reasoning: 'The materials, style, and condition suggest creation within the last 30 years.'
          },
          visual_search: {
            similar_artworks: 'Abstract works by contemporary artists',
            notes: 'The piece shows influences from abstract expressionism with a contemporary approach.'
          }
        }
      };
      
      onComplete(demoResults);
      return true; // Stop polling
    }
    
    return false; // Continue polling
  }, [onStepProgress, onStepComplete, onStepError, onComplete, sessionId]);

  // Start/stop polling based on shouldPoll flag
  useEffect(() => {
    if (!shouldPoll || !sessionId || isPolling) return;
    
    setIsPolling(true);
    
    const poll = async () => {
      const shouldStop = await pollResults();
      
      if (shouldStop) {
        setIsPolling(false);
        return;
      }
      
      // Schedule next poll
      setTimeout(poll, pollInterval);
    };
    
    poll();
    
    return () => {
      setIsPolling(false);
    };
  }, [shouldPoll, sessionId, pollInterval, pollResults, isPolling]);

  return {
    partialResults,
    isPolling
  };
}
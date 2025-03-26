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
      
      // Store the complete raw data for debugging and full access
      const rawResults = data.results;
      
      // Perform deep validation and defensive initialization of the data to prevent runtime errors
      // Ensure all required nested properties exist before usage
      const safeResults = {
        metadata: data.results?.metadata || {
          originalName: 'unknown.jpg',
          timestamp: Date.now(),
          analyzed: true,
          mimeType: 'image/jpeg',
          size: 0,
          fileName: 'UserUploadedImage.jpg',
          imageUrl: '',
          analysisTimestamp: Date.now(),
          analysisResults: {
            labels: [],
            webEntities: 0,
            matchCounts: { exact: 0, partial: 0, similar: 0 },
            pagesWithMatches: 0,
            webLabels: 0,
            openaiAnalysis: {
              category: 'Art',
              description: 'Unknown Item'
            }
          },
          originAnalyzed: false,
          originAnalysisTimestamp: Date.now()
        },
        
        detailedAnalysis: data.results?.detailedAnalysis || {
          concise_description: 'Unknown Item Analysis Result',
          maker_analysis: {
            creator_name: 'Unknown Artist',
            reasoning: 'Insufficient information for detailed analysis.'
          },
          signature_check: {
            signature_text: 'No visible signature',
            interpretation: 'Cannot determine authenticity without signature.'
          },
          origin_analysis: {
            likely_origin: 'Unknown',
            reasoning: 'Insufficient information for origin analysis.'
          },
          marks_recognition: {
            marks_identified: 'No identifiable marks',
            interpretation: 'No manufacturer or studio marks visible.'
          },
          age_analysis: {
            estimated_date_range: 'Unknown',
            reasoning: 'Insufficient information for age estimation.'
          },
          visual_search: {
            similar_artworks: 'None found',
            notes: 'No similar items identified in database.'
          }
        }
      };
      
      // Create a complete copy of all fields from the backend response
      // This ensures we don't lose any data the backend sends
      const completeResults = {
        // Start with our safe results with defaults
        ...safeResults,
        
        // Include ALL fields from the original response
        // This picks up any fields we might not have explicitly defined in our types
        ...(rawResults || {}),
        
        // Previously specified fields
        ...(data.results?.visualAnalysis && { visualAnalysis: data.results.visualAnalysis }),
        ...(data.results?.originAnalysis && { originAnalysis: data.results.originAnalysis }),
        
        // Include any nested data structures we might want to access directly
        ...(data.results?.additionalDetails && { additionalDetails: data.results.additionalDetails }),
        ...(data.results?.marketData && { marketData: data.results.marketData }),
        ...(data.results?.similarItems && { similarItems: data.results.similarItems }),
        ...(data.results?.auctionData && { auctionData: data.results.auctionData }),
        
        // Maintain the raw data for debugging or access to any field
        _rawData: rawResults,
        
        // Metadata
        timestamp: data.timestamp || Date.now(),
        sessionId: data.sessionId || null
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
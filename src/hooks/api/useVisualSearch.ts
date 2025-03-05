import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import type { SearchResults } from '../../types';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

// Define the API response type
interface VisualSearchResponse {
  success: boolean;
  message?: string;
  results: {
    vision?: {
      description?: any;
      webEntities?: any[];
      webLabels?: any[];
      derivedSubjects?: any[];
      matches?: {
        exact: any[];
        partial: any[];
        similar: any[];
      };
      pagesWithMatchingImages?: any[];
    };
    openai?: any;
    analyzed?: boolean;
    analysisTimestamp?: number;
  };
}

// Define the value estimation response type
interface ValueEstimationResponse {
  success: boolean;
  message?: string;
  results: any;
}

export function useVisualSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const { handleError } = useErrorHandler();

  const processResults = (results: any): SearchResults => {
    // Extract the fields we need from the visual search results
    // according to the API documentation
    return {
      openai: results?.openai || {},
      description: results?.vision?.description || {},
      webEntities: results?.vision?.webEntities || [],
      webLabels: results?.vision?.webLabels || [],
      derivedSubjects: results?.vision?.derivedSubjects || [],
      matches: results?.vision?.matches || { exact: [], partial: [], similar: [] },
      pagesWithMatchingImages: results?.vision?.pagesWithMatchingImages || []
    };
  };

  const startVisualSearch = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    debug('Starting visual search', { type: 'info', data: { sessionId } });
    setIsSearching(true);

    try {
      // Call API with updated endpoint
      const response = await api.runVisualSearch<VisualSearchResponse>(sessionId);
      
      // Handle the standardized response format
      if (response && response.results) {
        const processedResults = processResults(response.results);
        debug('Search results processed', { type: 'info', data: { processedResults } });
        setSearchResults(processedResults);
        
        // Automatically call find-value endpoint after successful visual search
        debug('Automatically calling find-value endpoint after visual search', { type: 'info', data: { sessionId } });
        try {
          const valueResponse = await api.findValue<ValueEstimationResponse>(sessionId);
          debug('Value estimation results received automatically', { type: 'info', data: { valueResults: valueResponse.results } });
        } catch (valueErr) {
          debug('Automatic value estimation failed', { type: 'warn', data: valueErr });
          // We don't want to fail the whole process if value estimation fails
          // So we just log the error but don't throw it
        }
        
        return processedResults;
      } else {
        debug('Invalid visual search response format', {
          type: 'warn',
          data: { response }
        });
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      debug('Visual search error', { type: 'error', data: err });
      handleError(err as ApiError);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [handleError]);

  const testVisualSearch = useCallback(async (testSessionId: string) => {
    debug('Starting test visual search', { type: 'info', data: { sessionId: testSessionId } });
    setIsSearching(true);
    let processedResults = null;

    try {
      // Call API with updated endpoint
      const response = await api.runVisualSearch<VisualSearchResponse>(testSessionId);
      
      // Handle the standardized response format
      if (response && response.results) {
        processedResults = processResults(response.results);
        debug('Test search results processed', { type: 'info', data: { processedResults } });
        setSearchResults(processedResults);
        
        // Automatically call find-value endpoint after successful test visual search
        debug('Automatically calling find-value endpoint after test visual search', { type: 'info', data: { sessionId: testSessionId } });
        try {
          const valueResponse = await api.findValue<ValueEstimationResponse>(testSessionId);
          debug('Test value estimation results received automatically', { type: 'info', data: { valueResults: valueResponse.results } });
        } catch (valueErr) {
          debug('Automatic test value estimation failed', { type: 'warn', data: valueErr });
          // We don't fail the whole process if value estimation fails
        }
        
        return processedResults;
      } else {
        debug('Invalid test visual search response format', {
          type: 'warn',
          data: { response }
        });
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      debug('Test visual search error', { type: 'error', data: err });
      handleError(err as ApiError);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [handleError]);

  return {
    startVisualSearch,
    testVisualSearch,
    isSearching,
    searchResults,
    setSearchResults
  };
}
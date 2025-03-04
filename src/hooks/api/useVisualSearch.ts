import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import type { SearchResults } from '../../types';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

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
      const response = await api.runVisualSearch(sessionId);
      
      // Handle the standardized response format
      if (response && response.results) {
        const processedResults = processResults(response.results);
        debug('Search results processed', { type: 'info', data: { processedResults } });
        setSearchResults(processedResults);
        return processedResults;
      } else {
        debug('Invalid visual search response format', {
          type: 'warning',
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
      const response = await api.runVisualSearch(testSessionId);
      
      // Handle the standardized response format
      if (response && response.results) {
        processedResults = processResults(response.results);
        debug('Test search results processed', { type: 'info', data: { processedResults } });
        setSearchResults(processedResults);
        return processedResults;
      } else {
        debug('Invalid test visual search response format', {
          type: 'warning',
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
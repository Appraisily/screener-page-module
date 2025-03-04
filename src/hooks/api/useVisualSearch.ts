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
    return {
      openai: results?.openai,
      description: results?.vision?.description,
      webEntities: results?.vision?.webEntities || [],
      webLabels: results?.vision?.webLabels || [],
      derivedSubjects: results?.vision?.derivedSubjects || [],
      matches: results?.vision?.matches,
      pagesWithMatchingImages: results?.vision?.pagesWithMatchingImages
    };
  };

  const startVisualSearch = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    debug('Starting visual search', { sessionId });
    setIsSearching(true);

    try {
      // Use the new API client
      const results = await api.runVisualSearch(sessionId);
      
      const processedResults = processResults(results);
      
      debug('Search results processed', { processedResults });
      setSearchResults(processedResults);
    } catch (err) {
      debug('Visual search error', { type: 'error', data: err });
      handleError(err as ApiError);
    } finally {
      setIsSearching(false);
    }
  }, [handleError]);

  const testVisualSearch = useCallback(async (testSessionId: string) => {
    debug('Starting test visual search', { sessionId: testSessionId });
    setIsSearching(true);
    let processedResults = null;

    try {
      // Use the new API client
      const results = await api.runVisualSearch(testSessionId);
      
      processedResults = processResults(results);
      
      debug('Test search results processed', { processedResults });
      setSearchResults(processedResults);
    } catch (err) {
      debug('Test visual search error', { type: 'error', data: err });
      handleError(err as ApiError);
    } finally {
      setIsSearching(false);
      return processedResults;
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
import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import type { SearchResults } from '../../types';

export function useVisualSearch(apiUrl: string) {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  const startVisualSearch = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    debug('Starting visual search', { sessionId });
    setError(null);
    setIsSearching(true);

    try {
      const response = await fetch(`${apiUrl}/visual-search`, {
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
        throw new Error(data.message || 'Search failed');
      }

      const processedResults = {
        openai: data.results?.openai,
        description: data.results?.vision?.description,
        webEntities: data.results?.vision?.webEntities || [],
        webLabels: data.results?.vision?.webLabels || [],
        derivedSubjects: data.results?.vision?.derivedSubjects || [],
        matches: data.results?.vision?.matches,
        pagesWithMatchingImages: data.results?.vision?.pagesWithMatchingImages
      };

      debug('Search results processed', { processedResults });
      setSearchResults(processedResults);
    } catch (err) {
      debug('Visual search error', { type: 'error', data: err });
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [apiUrl]);

  const testVisualSearch = useCallback(async (testSessionId: string) => {
    debug('Starting test visual search', { sessionId: testSessionId });
    setError(null);
    setIsSearching(true);

    try {
      const response = await fetch(`${apiUrl}/visual-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: testSessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Search failed');
      }

      const processedResults = {
        openai: data.results?.openai,
        description: data.results?.vision?.description,
        webEntities: data.results?.vision?.webEntities || [],
        webLabels: data.results?.vision?.webLabels || [],
        derivedSubjects: data.results?.vision?.derivedSubjects || [],
        matches: data.results?.vision?.matches,
        pagesWithMatchingImages: data.results?.vision?.pagesWithMatchingImages
      };

      debug('Test search results processed', { processedResults });
      setSearchResults(processedResults);
    } catch (err) {
      debug('Test visual search error', { type: 'error', data: err });
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [apiUrl]);

  return {
    startVisualSearch,
    testVisualSearch,
    isSearching,
    error,
    searchResults,
    setError,
    setSearchResults
  };
}
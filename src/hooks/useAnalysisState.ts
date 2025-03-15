import { useState, useCallback } from 'react';
import type { SearchResults } from '../types';

interface AnalysisState {
  isInitializing: boolean;
  gcsImageUrl: string | null;
  searchResults: SearchResults | null;
  error: string | null;
  isSubmitted: boolean;
  hasEmailBeenSubmitted: boolean;
  itemType: 'Art' | 'Antique' | null;
}

const initialState: AnalysisState = {
  isInitializing: false,
  gcsImageUrl: null,
  searchResults: null,
  error: null,
  isSubmitted: false,
  hasEmailBeenSubmitted: false,
  itemType: null
};

export function useAnalysisState(initialSessionId?: string) {
  const [state, setState] = useState<AnalysisState>({
    ...initialState,
    isInitializing: !!initialSessionId
  });

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setState,
    resetState
  };
}
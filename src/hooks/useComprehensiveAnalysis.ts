import { useCallback } from 'react';
import { useImageAnalysis } from './useImageAnalysis';
import { useValueEstimation } from './useValueEstimation';

/**
 * High-level hook that orchestrates the full lifecycle of analysing an artwork.
 * It wraps the lower-level hooks but presents a single consolidated interface
 * that the UI can consume. All backend endpoints (except health-related ones)
 * are leveraged.
 */
export function useComprehensiveAnalysis(apiUrl?: string, initialSessionId?: string) {
  // Primary image flow (upload, visual search, details, origin, progressive results)
  const imageFlow = useImageAnalysis(apiUrl, initialSessionId);

  // Value estimation is decoupled and can run independently once a session exists
  const {
    getValueEstimation,
    isLoading: isValueEstimationLoading,
    error: valueEstimationError,
    result: valueEstimationResult,
    progress: valueEstimationProgress
  } = useValueEstimation(apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:8080');

  /**
   * Helper that triggers value estimation as soon as the caller decides the
   * prerequisites are satisfied (typically after detailed analysis is ready).
   */
  const startValueEstimation = useCallback((sessionId: string) => {
    if (!sessionId) return;
    return getValueEstimation(sessionId);
  }, [getValueEstimation]);

  return {
    // Spread all properties from the primary flow
    ...imageFlow,

    // Value estimation specific state
    startValueEstimation,
    isValueEstimationLoading,
    valueEstimationError,
    valueEstimationResult,
    valueEstimationProgress
  };
} 
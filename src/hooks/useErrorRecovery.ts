import { useState, useCallback, useEffect } from 'react';
import { 
  registerSession, 
  updateSessionState, 
  getSession, 
  markSessionError, 
  findRecoverableSession 
} from '../utils/sessionRecovery';
import { createRetryFetch } from '../utils/retryService';
import { mergeWithFallbacks } from '../utils/fallbackService';
import type { SearchResults } from '../types';

// Error categories
export type ErrorCategory = 
  | 'network'      // Network connectivity issues
  | 'server'       // Backend server errors
  | 'timeout'      // Operation timed out
  | 'auth'         // Authentication errors
  | 'validation'   // Input validation errors
  | 'api'          // API-specific errors
  | 'resource'     // Resource not found or access issues
  | 'unknown';     // Uncategorized errors

// Error details with recovery options
export interface ErrorDetails {
  message: string;
  category: ErrorCategory;
  timestamp: number;
  originalError?: any;
  recoverable: boolean;
  retryCount: number;
  context?: Record<string, any>;
}

// Interface for the hook's returned values
interface ErrorRecoveryHook {
  error: ErrorDetails | null;
  isRecovering: boolean;
  hasRecovered: boolean;
  setError: (error: Error | string, category?: ErrorCategory, context?: Record<string, any>) => void;
  clearError: () => void;
  retryOperation: () => Promise<boolean>;
  recoverSession: (sessionId: string) => Promise<boolean>;
  retryFetch: ReturnType<typeof createRetryFetch>;
  generateFallbackResults: (sessionId: string, imageUrl: string) => SearchResults;
  getRecoverableSession: () => ReturnType<typeof findRecoverableSession>;
}

/**
 * Determines the error category based on the error
 * 
 * @param error The error object or message
 * @returns The determined error category
 */
function categorizeError(error: any): ErrorCategory {
  if (!error) return 'unknown';
  
  // Handle fetch/network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'network';
  }
  
  // Handle timeout errors
  if (error.name === 'TimeoutError' || 
      error.message?.toLowerCase().includes('timeout')) {
    return 'timeout';
  }
  
  // Handle HTTP status code errors
  if (error.status) {
    const status = error.status;
    if (status >= 500) return 'server';
    if (status === 401 || status === 403) return 'auth';
    if (status === 404) return 'resource';
    if (status === 422) return 'validation';
    if (status >= 400) return 'api';
  }
  
  return 'unknown';
}

/**
 * Determines if an error is recoverable
 * 
 * @param category The error category
 * @param retryCount Current retry attempt count
 * @returns Whether the error is recoverable
 */
function isErrorRecoverable(category: ErrorCategory, retryCount: number): boolean {
  // Network and server errors are typically transient
  if (['network', 'server', 'timeout'].includes(category) && retryCount < 3) {
    return true;
  }
  
  // Resource errors might be recoverable if we can generate fallbacks
  if (category === 'resource' && retryCount < 2) {
    return true;
  }
  
  // Other errors are generally not automatically recoverable
  return false;
}

/**
 * Hook for advanced error handling and recovery
 * 
 * @param onRecoveryComplete Optional callback when recovery completes
 * @returns Error recovery interface
 */
export function useErrorRecovery(
  onRecoveryComplete?: (recovered: boolean) => void
): ErrorRecoveryHook {
  const [error, setErrorState] = useState<ErrorDetails | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [hasRecovered, setHasRecovered] = useState(false);
  
  // Create retry-enabled fetch
  const retryFetch = createRetryFetch({
    maxRetries: 3,
    initialDelay: 1000,
    shouldRetry: (error, attemptNumber) => {
      const category = categorizeError(error);
      return isErrorRecoverable(category, attemptNumber);
    }
  });
  
  // Set error with categorization
  const setError = useCallback((
    err: Error | string,
    category?: ErrorCategory,
    context?: Record<string, any>
  ) => {
    const errorMessage = typeof err === 'string' ? err : err.message;
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    const determinedCategory = category || categorizeError(errorObj);
    
    const errorDetails: ErrorDetails = {
      message: errorMessage,
      category: determinedCategory,
      timestamp: Date.now(),
      originalError: errorObj,
      recoverable: isErrorRecoverable(determinedCategory, 0),
      retryCount: 0,
      context
    };
    
    setErrorState(errorDetails);
    setHasRecovered(false);
    
    // If there's a session ID in the context, mark the session as having an error
    if (context?.sessionId) {
      markSessionError(context.sessionId);
    }
    
    return errorDetails;
  }, []);
  
  // Clear any active error
  const clearError = useCallback(() => {
    setErrorState(null);
    setIsRecovering(false);
  }, []);
  
  // Retry the failed operation
  const retryOperation = useCallback(async (): Promise<boolean> => {
    if (!error || !error.recoverable) return false;
    
    try {
      setIsRecovering(true);
      
      // Update retry count
      setErrorState(prev => prev ? {
        ...prev,
        retryCount: prev.retryCount + 1,
        recoverable: isErrorRecoverable(prev.category, prev.retryCount + 1)
      } : null);
      
      // Wait a bit before retrying (with increasing delay based on retry count)
      const delayMs = 1000 * Math.pow(2, error.retryCount);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // In a real implementation, we would perform the actual retry
      // For now, simulate a success 75% of the time
      const success = Math.random() > 0.25;
      
      if (success) {
        clearError();
        setHasRecovered(true);
        onRecoveryComplete?.(true);
        return true;
      } else {
        // Update error to show retry failed
        setErrorState(prev => prev ? {
          ...prev,
          message: `${prev.message} (retry failed)`,
          recoverable: isErrorRecoverable(prev.category, prev.retryCount + 1)
        } : null);
        onRecoveryComplete?.(false);
        return false;
      }
    } catch (e) {
      console.error('Error during recovery attempt:', e);
      setErrorState(prev => prev ? {
        ...prev,
        message: `${prev.message} (recovery error)`,
        recoverable: false
      } : null);
      onRecoveryComplete?.(false);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [error, clearError, onRecoveryComplete]);
  
  // Recover a specific session
  const recoverSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setIsRecovering(true);
      
      // Get the session state
      const sessionState = getSession(sessionId);
      if (!sessionState) return false;
      
      // Update session state to show recovery attempt
      updateSessionState(sessionId, {
        status: 'active',
        lastUpdatedAt: Date.now()
      });
      
      // Wait a moment to simulate recovery process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would perform actual recovery actions here
      const success = true;
      
      if (success) {
        clearError();
        setHasRecovered(true);
        onRecoveryComplete?.(true);
        return true;
      } else {
        setError(
          'Failed to recover session',
          'unknown',
          { sessionId }
        );
        onRecoveryComplete?.(false);
        return false;
      }
    } catch (e) {
      console.error('Error during session recovery:', e);
      setError(
        'Error during session recovery',
        'unknown', 
        { sessionId }
      );
      onRecoveryComplete?.(false);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [clearError, setError, onRecoveryComplete]);
  
  // Generate fallback results when real analysis fails
  const generateFallbackResults = useCallback((
    sessionId: string,
    imageUrl: string
  ): SearchResults => {
    // Use our fallback service to create results
    return mergeWithFallbacks({}, sessionId, imageUrl);
  }, []);
  
  // Check for recoverable sessions on initial load
  useEffect(() => {
    // This would typically be triggered only after determining
    // that there was an interrupted session, not on every load
  }, []);
  
  return {
    error,
    isRecovering,
    hasRecovered,
    setError,
    clearError,
    retryOperation,
    recoverSession,
    retryFetch,
    generateFallbackResults,
    getRecoverableSession: findRecoverableSession
  };
}
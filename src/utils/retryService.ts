/**
 * Retry service with exponential backoff
 * 
 * This utility provides functions to retry operations with exponential backoff
 * to handle transient errors gracefully.
 */

// Default configuration for retries
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,                // Maximum number of retry attempts
  initialDelay: 1000,           // Initial delay in milliseconds
  maxDelay: 10000,              // Maximum delay in milliseconds
  backoffFactor: 2,             // Multiplicative factor for each retry
  jitter: 0.2,                  // Random jitter factor (0-1) to avoid thundering herd
  shouldRetry: () => true       // Default predicate always retries
};

export type RetryConfig = {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: number;
  shouldRetry?: (error: any, attemptNumber: number) => boolean;
};

/**
 * Retries a promise-returning function with exponential backoff
 *
 * @param operation Function that returns a promise to retry
 * @param config Retry configuration
 * @returns Promise with the operation result
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let attemptNumber = 0;
  let delay = retryConfig.initialDelay;

  while (true) {
    try {
      // Attempt the operation
      return await operation();
    } catch (error) {
      attemptNumber++;
      
      // If we've reached max retries or shouldn't retry, rethrow
      if (
        attemptNumber >= retryConfig.maxRetries ||
        !retryConfig.shouldRetry(error, attemptNumber)
      ) {
        throw error;
      }
      
      // Calculate next delay with jitter
      const jitterAmount = delay * retryConfig.jitter * (Math.random() * 2 - 1);
      delay = Math.min(
        retryConfig.maxDelay,
        delay * retryConfig.backoffFactor + jitterAmount
      );
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Creates a fetch function with retry capability
 * 
 * @param config Retry configuration
 * @returns Enhanced fetch function with retries
 */
export function createRetryFetch(config: RetryConfig = {}) {
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    const shouldRetry = (error: any, attemptNumber: number) => {
      // Determine if we should retry based on the error
      if (error instanceof Error && error.name === 'AbortError') {
        return false; // Don't retry aborted requests
      }
      
      // If response is available, only retry on certain status codes
      if (error instanceof Response) {
        const retriableStatus = [408, 429, 500, 502, 503, 504];
        return retriableStatus.includes(error.status);
      }
      
      // Allow custom predicate to override
      if (config.shouldRetry) {
        return config.shouldRetry(error, attemptNumber);
      }
      
      return true;
    };

    return retryWithBackoff(
      async () => {
        const response = await fetch(url, options);
        
        // Throw the response object for non-successful status codes
        // to trigger retry logic
        if (!response.ok) {
          throw response;
        }
        
        return response;
      },
      { ...config, shouldRetry }
    );
  };
}
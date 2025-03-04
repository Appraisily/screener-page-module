import { useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast for notifications

// Custom error interface to add API error properties
export interface ApiError extends Error {
  code?: string;
  details?: any;
  status?: number;
  response?: any;
  originalError?: Error;
}

// Map of friendly error messages
const errorMessages: Record<string, string> = {
  'VALIDATION_ERROR': 'There was a problem with the information you provided. Please check and try again.',
  'UNAUTHORIZED': 'Please sign in to continue.',
  'NOT_FOUND': 'The requested information could not be found.',
  'SERVER_ERROR': 'Something went wrong on our end. Please try again later.',
  'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
  'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment and try again.',
};

export function useErrorHandler() {
  const handleError = useCallback((error: ApiError) => {
    console.error('API Error:', error);
    
    // Get appropriate message
    const message = 
      (error.code && errorMessages[error.code]) || 
      error.message || 
      'An unexpected error occurred';
    
    // Show toast notification
    toast.error(message, {
      duration: 5000,
    });
    
    // Handle specific error types
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Handle unauthorized errors if needed
        break;
        
      case 'VALIDATION_ERROR':
        // Return validation errors to the component
        return error.details;
        
      case 'NOT_FOUND':
        // Handle not found errors if needed
        break;
        
      // Add other cases as needed
        
      default:
        // Default error handling
        break;
    }
    
    return null;
  }, []);
  
  return { handleError };
} 
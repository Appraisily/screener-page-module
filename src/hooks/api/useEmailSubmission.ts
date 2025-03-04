import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

export function useEmailSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const submitEmail = useCallback(async (email: string, sessionId: string): Promise<boolean> => {
    if (!sessionId) return false;

    setIsSubmitting(true);
    debug('Submitting email', { 
      type: 'info',
      data: { email, sessionId }
    });

    try {
      // Use the new API client
      await api.submitEmail({ email, sessionId });
      
      setUserEmail(email);
      return true;
    } catch (err) {
      const error = err as ApiError;
      handleError(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [handleError]);

  return {
    submitEmail,
    isSubmitting,
    userEmail,
    setUserEmail
  };
}
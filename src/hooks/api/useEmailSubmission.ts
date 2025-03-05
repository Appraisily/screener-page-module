import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

// Add interface for email submission data
interface EmailSubmissionData {
  email: string;
  sessionId: string;
  name?: string;
  subscribeToNewsletter?: boolean;
}

export function useEmailSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const submitEmail = useCallback(async (
    email: string, 
    sessionId: string,
    options?: { name?: string; subscribeToNewsletter?: boolean }
  ): Promise<boolean> => {
    if (!sessionId) return false;

    setIsSubmitting(true);
    debug('Submitting email', { 
      type: 'info',
      data: { email, sessionId, ...options }
    });

    try {
      // Create submission data with optional fields
      const submissionData: EmailSubmissionData = {
        email,
        sessionId,
        ...(options?.name && { name: options.name }),
        ...(options?.subscribeToNewsletter !== undefined && { 
          subscribeToNewsletter: options.subscribeToNewsletter 
        })
      };

      // Use the API client with updated types
      await api.submitEmail(submissionData);
      
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
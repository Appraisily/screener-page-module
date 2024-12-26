import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';

export function useEmailSubmission(apiUrl: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const submitEmail = useCallback(async (email: string, sessionId: string): Promise<boolean> => {
    if (!sessionId) return false;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/submit-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, sessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit email');
      }

      setUserEmail(email);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit email');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [apiUrl]);

  return {
    submitEmail,
    isSubmitting,
    error,
    userEmail,
    setError,
    setUserEmail
  };
}
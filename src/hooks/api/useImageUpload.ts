import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';
import api from '../../lib/api/client';
import { useErrorHandler, ApiError } from '../useErrorHandler';

interface UploadResponse {
  imageUrl: string;
  sessionId: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    
    debug('Starting image upload', { 
      type: 'info',
      data: {
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type
      }
    });
    
    console.debug('[Debug] useImageUpload.uploadImage called', file);

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Use the API client to upload the image
      const response = await api.uploadImage(file);
      console.debug('[Debug] Upload API response:', response);
      
      // Defensive coding to handle potential response format issues
      if (!response) {
        console.debug('[Debug] Upload failed: Empty response');
        throw new Error('Empty response from server');
      }
      
      // More flexible handling of response structure
      // Just check that we at least have an object with both required properties
      if (typeof response === 'object') {
        const imageUrl = response.imageUrl || '';
        const sessionId = response.sessionId || '';
        
        if (imageUrl && sessionId) {
          // Update state with the response data
          setCustomerImage(imageUrl);
          setSessionId(sessionId);

          console.debug('[Debug] Upload successful:', { 
            imageUrl, 
            sessionId 
          });

          return {
            imageUrl,
            sessionId
          };
        } else {
          console.debug('[Debug] Upload failed: Missing required fields', response);
          const missingFields = [];
          if (!imageUrl) missingFields.push('imageUrl');
          if (!sessionId) missingFields.push('sessionId');
          
          throw new Error(`Missing required fields in response: ${missingFields.join(', ')}`);
        }
      } else {
        console.debug('[Debug] Upload failed: Response is not an object', response);
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.debug('[Debug] Upload failed:', err);
      console.error('[Debug] Upload error:', err);
      const error = err as ApiError;
      const errorMessage = error.message || 'Failed to upload image';
      setUploadError(errorMessage);
      handleError(error);
      setCustomerImage(null);
      setSessionId(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [handleError]);

  return {
    uploadImage,
    isUploading,
    customerImage,
    sessionId,
    uploadError,
    setSessionId,
    setCustomerImage
  };
}
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
        throw new Error('Empty response from server');
      }
      
      let uploadResponse: UploadResponse;
      
      // Handle different response formats
      if (typeof response === 'object') {
        if (response.imageUrl && response.sessionId) {
          uploadResponse = response as UploadResponse;
        } else {
          console.error('[Debug] Response missing expected fields:', response);
          throw new Error('Invalid response format from server');
        }
      } else {
        console.error('[Debug] Unexpected response type:', typeof response, response);
        throw new Error('Unexpected response format from server');
      }
      
      console.debug('[Debug] Processed upload response:', uploadResponse);
      
      // Update state with the response data
      setCustomerImage(uploadResponse.imageUrl);
      setSessionId(uploadResponse.sessionId);

      return {
        imageUrl: uploadResponse.imageUrl,
        sessionId: uploadResponse.sessionId
      };

    } catch (err) {
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
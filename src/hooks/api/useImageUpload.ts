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
  const { handleError } = useErrorHandler();

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    debug('Starting image upload', { 
      type: 'info',
      data: {
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type
      }
    });

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Use the new API client
      const response = await api.uploadImage(file) as UploadResponse;
      
      setCustomerImage(response.imageUrl);
      setSessionId(response.sessionId);

      return {
        imageUrl: response.imageUrl,
        sessionId: response.sessionId
      };

    } catch (err) {
      const error = err as ApiError;
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
    setSessionId,
    setCustomerImage
  };
}
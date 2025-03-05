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
      // Validate file before upload
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      console.debug('[Debug] File passed validation, uploading...');
      
      // Use the API client to upload the image
      const response = await api.uploadImage(file);
      console.debug('[Debug] Upload API response received:', response);
      
      // Validate the response
      if (!response) {
        console.debug('[Debug] Upload failed: Empty response');
        throw new Error('Empty response from server');
      }
      
      // Check response has the required properties
      if (typeof response !== 'object') {
        console.debug('[Debug] Upload failed: Response is not an object', response);
        throw new Error('Invalid response format from server');
      }
      
      const { imageUrl, sessionId } = response;
      
      if (!imageUrl || !sessionId) {
        console.debug('[Debug] Upload failed: Missing required fields', response);
        const missingFields = [];
        if (!imageUrl) missingFields.push('imageUrl');
        if (!sessionId) missingFields.push('sessionId');
        
        throw new Error(`Missing required fields in response: ${missingFields.join(', ')}`);
      }
      
      // Update state with the response data
      console.debug('[Debug] Upload successful, updating state with:', { imageUrl, sessionId });
      setCustomerImage(imageUrl);
      setSessionId(sessionId);

      debug('Image upload successful', { 
        type: 'info',
        data: { 
          imageUrl: imageUrl,
          sessionId: sessionId 
        }
      });

      return { imageUrl, sessionId };
    } catch (err) {
      console.debug('[Debug] Upload failed:', err);
      console.error('[Debug] Upload error:', err);
      
      const error = err as ApiError;
      const errorMessage = error.message || 'Failed to upload image';
      
      setUploadError(errorMessage);
      handleError(error);
      setCustomerImage(null);
      setSessionId(null);
      
      debug('Image upload failed', {
        type: 'error',
        data: { 
          error: errorMessage,
          originalError: err
        }
      });
      
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
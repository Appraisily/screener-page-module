import { useState, useCallback } from 'react';
import { debug } from '../utils/debug';

export function useImageUpload(apiUrl: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;

    setError(null);
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

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${apiUrl}/upload-temp`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
      }

      setCustomerImage(data.imageUrl);
      setSessionId(data.sessionId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setCustomerImage(null);
      setSessionId(null);
    } finally {
      setIsUploading(false);
    }
  }, [apiUrl]);

  return {
    uploadImage,
    isUploading,
    error,
    customerImage,
    sessionId,
    setError,
    setSessionId,
    setCustomerImage
  };
}
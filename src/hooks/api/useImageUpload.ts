import { useState, useCallback } from 'react';

export function useImageUpload(apiUrl: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;

    console.log('[Debug] useImageUpload.uploadImage called', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setError(null);
    setIsUploading(true);

    try {
      if (file.size > 5 * 1024 * 1024) {
        console.error('[Debug] File size too large');
        throw new Error('File size exceeds 5MB limit');
      }

      if (!file.type.startsWith('image/')) {
        console.error('[Debug] Invalid file type');
        throw new Error('Please upload an image file');
      }

      const formData = new FormData();
      formData.append('image', file);

      console.log('[Debug] Making upload request to:', `${apiUrl}/upload-temp`);
      const response = await fetch(`${apiUrl}/upload-temp`, {
        method: 'POST',
        body: formData
      });

      console.log('[Debug] Upload response status:', response.status);
      if (!response.ok) {
        console.error('[Debug] Upload request failed:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Debug] Upload response data:', data);
      
      if (!data.success || !data.sessionId) {
        console.error('[Debug] Upload failed:', data.message);
        throw new Error(data.message || 'Failed to upload image');
      }

      console.log('[Debug] Setting upload results', {
        imageUrl: data.imageUrl,
        sessionId: data.sessionId
      });
      
      // Set sessionId first to ensure it's available
      setCustomerImage(data.imageUrl);
      setSessionId(data.sessionId);

      // Return the sessionId for immediate use
      return data.sessionId;

    } catch (err) {
      console.error('[Debug] Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setCustomerImage(null);
      setSessionId(null);
      return null;
    } finally {
      console.log('[Debug] Upload process completed');
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
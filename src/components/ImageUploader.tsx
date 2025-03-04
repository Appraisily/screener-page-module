import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  customerImage: string | null;
  sessionId?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, isUploading, customerImage, sessionId }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        console.log('Dropped file:', file.name, 'Size:', file.size, 'Type:', file.type);
        onUpload(file);
      } else {
        console.warn('Invalid file type:', file?.type);
      }
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleClick = () => {
    if (!isUploading) {
      console.log('Upload button clicked, opening file selector');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={`rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 transition-all duration-200 ${
          isUploading
            ? 'ring-gray-800'
            : 'ring-gray-200 hover:ring-gray-800'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {customerImage ? (
            <div className="relative w-full">
              <img
                src={customerImage}
                alt="Uploaded item"
                className="w-full h-auto max-h-[300px] sm:max-h-[500px] object-contain rounded-lg shadow-lg transition-transform duration-200 hover:-translate-y-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                }}
              />
              {sessionId && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Session ID:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono text-gray-800">
                      {sessionId}
                    </code>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-gray-900 animate-spin mx-auto" />
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
                      <p className="text-sm font-medium text-gray-800">Processing image...</p>
                      <p className="text-xs text-gray-600">Getting AI analysis results</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-full bg-gray-900 p-4">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isUploading ? 'Analyzing your item...' : 'Upload Your Art or Antique'}
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  {isUploading ? 'Please wait while our AI analyzes your image' : 'Drag & drop your photo or click to browse'}
                </p>
                <p className="mt-4 text-xs text-gray-500">
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </p>
              </div>
            </>
          )}
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`rounded-md px-8 py-4 text-lg font-semibold shadow-sm 
                     transition-all duration-200 cursor-pointer flex items-center gap-2
                     ${isUploading 
                       ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                       : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            onClick={handleClick}
          >
            <ImageIcon className="w-5 h-5" />
            {customerImage ? 'Upload Another Item' : 'Select Photo'}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
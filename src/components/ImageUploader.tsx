import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
  isUploading: boolean;
  customerImage: string | null;
  sessionId?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onReset, isUploading, customerImage, sessionId }) => {
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

  const handleUploadAnother = () => {
    onReset();
  };

  const handleClick = () => {
    if (!isUploading) {
      console.log('Upload button clicked, opening file selector');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={`relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg 
                   transition-all duration-300 ${
          isUploading
            ? 'ring-2 ring-[#007bff]'
            : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-[#007bff]'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {customerImage ? (
            <div className="relative w-full">
              <img
                src={customerImage}
                alt="Uploaded item"
                className="w-full h-auto max-h-[400px] object-contain rounded-xl shadow-lg border border-gray-200
                         transition-all duration-300 hover:border-[#007bff]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                }}
              />
              {sessionId && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Session ID:</span>
                    <code className="px-3 py-1.5 bg-white rounded-md text-sm font-mono text-[#007bff] shadow-sm border border-gray-200">
                      {sessionId}
                    </code>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md rounded-xl">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 text-[#007bff] animate-spin mx-auto" />
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm">
                      <p className="text-sm font-medium text-gray-900">Processing image...</p>
                      <p className="text-xs text-gray-600">Getting AI analysis results</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                             from-gray-900 to-gray-600 mb-4">
                  {isUploading ? 'Uploading item...' : 'Upload Your Art or Antique'}
                </h3>
                <p className="text-xl text-gray-600 mb-6 max-w-lg mx-auto">
                  {isUploading ? 'Please wait while we process your image' : 'Drop your file here or click to browse'}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#007bff] animate-pulse" />
                  <p className="text-sm text-gray-600">
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
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
            className={`rounded-xl px-8 py-4 text-lg font-semibold shadow-xl 
                     transition-all duration-300 cursor-pointer flex items-center gap-3 
                     hover:shadow-2xl hover:scale-[1.02] active:scale-100
                     ${isUploading
                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       : 'bg-black text-white hover:bg-gray-900'}`}
            onClick={customerImage ? handleUploadAnother : handleClick}
          >
            <ImageIcon className="w-5 h-5" />
            {customerImage ? 'Upload Another Item' : 'Select Item'}
          </label>
        </div>
        
        {/* Grid pattern moved to bottom layer */}
        <div className="absolute inset-0 bg-grid opacity-[0.1] pointer-events-none" />
      </div>
    </div>
  );
};

export default ImageUploader;
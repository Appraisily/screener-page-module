import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2, Shield } from 'lucide-react';

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
        className={`relative overflow-hidden rounded-2xl bg-white border-2 border-dashed p-8 
                   transition-all duration-300 shadow-elegant ${
          isUploading
            ? 'border-gray-400 bg-gray-50'
            : customerImage 
              ? 'border-gray-200 bg-white'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {customerImage ? (
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                <img
                  src={customerImage}
                  alt="Uploaded artwork"
                  className="w-full h-auto max-h-[400px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                  }}
                />
              </div>
              
              {sessionId && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Analysis ID:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono text-gray-900 border border-gray-300">
                      {sessionId}
                    </code>
                  </div>
                </div>
              )}
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto">
                      <Loader2 className="w-full h-full text-gray-600 animate-spin" />
                    </div>
                    <div className="bg-white px-6 py-3 rounded-lg shadow-elegant border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">Processing Image</p>
                      <p className="text-xs text-gray-600 mt-1">Preparing for analysis...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {isUploading ? 'Processing Image' : 'Upload Your Artwork'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isUploading 
                      ? 'Please wait while we prepare your image for analysis' 
                      : 'Drag and drop your image here, or click to browse'
                    }
                  </p>
                </div>
                
                {/* File format info */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    JPEG, PNG, WebP up to 5MB • Secure & confidential
                  </span>
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
            className={`rounded-lg px-8 py-4 font-medium shadow-sm border
                     transition-all duration-200 cursor-pointer flex items-center gap-3 
                     ${isUploading
                       ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                       : customerImage
                         ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                         : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                     }`}
            onClick={customerImage ? handleUploadAnother : handleClick}
          >
            <ImageIcon className="w-5 h-5" />
            {customerImage ? 'Upload Different Image' : isUploading ? 'Processing...' : 'Choose Image'}
          </label>
        </div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-50" />
      </div>
    </div>
  );
};

export default ImageUploader;
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import classNames from 'classnames';

export interface ImageUploaderProps {
  onUpload: (file: File) => Promise<any>;
  uploadedImageUrl?: string | null;
  uploadError?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  sessionId?: string;
  onReset?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  uploadedImageUrl,
  uploadError,
  isUploading = false,
  uploadProgress = 0,
  sessionId,
  onReset,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        await onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  // Update drag state based on dropzone status
  useEffect(() => {
    setDragActive(isDragActive);
  }, [isDragActive]);

  const handleButtonClick = () => {
    if (uploadedImageUrl && onReset) {
      onReset();
    } else if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={classNames(
          "relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center",
          "min-h-[300px] sm:min-h-[400px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          {
            "border-primary-400 bg-primary-50": dragActive,
            "border-gray-300 hover:border-primary-300 bg-gray-50 hover:bg-gray-100": !dragActive && !uploadedImageUrl && !isUploading,
            "border-red-300 bg-red-50": uploadError,
            "border-gray-200": isUploading || uploadedImageUrl,
          }
        )}
      >
        <input {...getInputProps()} ref={inputRef} />
        
        {/* Progress overlay when uploading */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mb-4"></div>
            <div className="w-3/4 max-w-xs bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
          </div>
        )}
        
        {/* Error message display */}
        {uploadError && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-red-600 font-medium text-lg mb-2">Upload Failed</h3>
            <p className="text-gray-600 text-center mb-4">{uploadError}</p>
            <button 
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                if (onReset) onReset();
              }}
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Display uploaded image */}
        {uploadedImageUrl ? (
          <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
            <img
              src={uploadedImageUrl}
              alt="Uploaded artwork"
              className="max-h-full max-w-full object-contain rounded-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=Image+Failed+to+Load';
              }}
            />
            {sessionId && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {sessionId.substring(0, 6)}...
              </div>
            )}
            <button 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                if (onReset) onReset();
              }}
            >
              <Upload className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-sm">
              <ImageIcon className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Upload Artwork</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Drag and drop your image here, or click to browse your files
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Supported formats: JPEG, PNG, WebP (max 10MB)
            </p>
            <button 
              className="bg-primary-100 hover:bg-primary-200 text-primary-800 font-medium px-5 py-2.5 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) inputRef.current.click();
              }}
            >
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
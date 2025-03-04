import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  customerImage: string | null;
  sessionId?: string | null;
  uploadError?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUpload, 
  isUploading, 
  customerImage, 
  sessionId,
  uploadError 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulate progress during upload
  React.useEffect(() => {
    if (isUploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          // Increase progressively but never reach 100% until upload is complete
          if (prev < 90) {
            return prev + (90 - prev) / 10;
          }
          return prev;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        // Set to 100% when done
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      };
    }
  }, [isUploading]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
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

  // Dropzone style classes
  const dropzoneClasses = `
    rounded-2xl relative bg-white p-6 sm:p-10 shadow-xl transition-all duration-200
    ${uploadError ? 'ring-2 ring-error/50' : 
      isDragging ? 'ring-2 ring-secondary-500 scale-[1.01] shadow-secondary-500/20' : 
      isUploading ? 'ring-2 ring-primary-700/50' : 
      'ring-1 ring-slate-200 hover:ring-primary-600 hover:shadow-lg hover:shadow-primary-600/5'}
  `;

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={dropzoneClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Progress bar */}
        {isUploading && (
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden rounded-t-2xl">
            <div 
              className="h-full bg-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-secondary-500/10 backdrop-blur-[1px] flex items-center justify-center border-2 border-dashed border-secondary-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-1/2 w-20 h-1/2 -ml-10">
                <div className="w-full h-full bg-secondary-500/10 rounded-b-full animate-shimmer"></div>
              </div>
              <div className="absolute top-0 left-1/4 w-20 h-1/3 -ml-10 delay-75">
                <div className="w-full h-full bg-secondary-500/10 rounded-b-full animate-shimmer" style={{animationDelay: '0.2s'}}></div>
              </div>
              <div className="absolute top-0 left-3/4 w-20 h-2/5 -ml-10 delay-150">
                <div className="w-full h-full bg-secondary-500/10 rounded-b-full animate-shimmer" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
            
            <div className="bg-white/90 rounded-lg p-3 shadow-lg z-10 animate-pulse-custom">
              <Upload className="w-8 h-8 text-secondary-500 mx-auto" />
              <p className="text-primary-900 font-medium mt-2">Drop to upload</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-6">
          {uploadError && (
            <div className="w-full bg-error/10 text-error px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
          
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
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Session ID:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono text-slate-800">
                      {sessionId}
                    </code>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-primary-600 animate-spin" 
                        style={{ 
                          borderTopColor: 'transparent',
                          borderLeftColor: 'transparent',
                          animationDuration: '1.5s'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-700">{Math.round(uploadProgress)}%</span>
                      </div>
                    </div>
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
                      <p className="text-sm font-medium text-primary-900">Processing image...</p>
                      <p className="text-xs text-slate-600">Getting AI analysis results</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={`rounded-full p-4 shadow-md ${uploadError ? 'bg-error' : 'bg-primary-900'}`}>
                {isUploading ? (
                  <div className="w-8 h-8 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 border-dashed animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ) : uploadError ? (
                  <AlertCircle className="w-8 h-8 text-white" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary-900">
                  {isUploading 
                    ? 'Analyzing your item...' 
                    : uploadError 
                      ? 'Upload Failed' 
                      : 'Upload Your Art or Antique'
                  }
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  {isUploading 
                    ? 'Please wait while our AI analyzes your image' 
                    : uploadError
                      ? 'Please try again or use a different image'
                      : 'Drag & drop your photo or click to browse'
                  }
                </p>
                {!isUploading && !uploadError && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      JPEG
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      PNG
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      WebP
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Max 5MB
                    </div>
                  </div>
                )}
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
            className={`btn-primary rounded-md px-6 py-3 text-base font-semibold shadow-sm 
                     transition-all duration-200 cursor-pointer flex items-center gap-2
                     ${isUploading 
                       ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                       : customerImage 
                         ? 'bg-slate-100 text-primary-800 hover:bg-slate-200' 
                         : 'hover:shadow-md hover:-translate-y-0.5'}`}
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
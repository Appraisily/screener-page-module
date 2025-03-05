import { AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import VisualSearchPanel from './VisualSearchPanel';
import ResultsDisplay from './ResultsDisplay';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

export interface ArtScreenerProps {
  sessionId?: string;
}

const ArtScreener = ({ sessionId: initialSessionId }: ArtScreenerProps) => {
  const {
    uploadImage,
    startVisualSearch,
    submitEmail,
    isUploading,
    isSearching,
    customerImage,
    sessionId,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    error,
    searchResults,
    currentStep,
    uploadError,
    setCustomerImage
  } = useImageAnalysis(initialSessionId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <header className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="w-20 h-20 bg-primary-900 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-900">
                Unlock the Secrets of Your Art & Antiques
              </h1>
              <p className="text-xl text-slate-700">
                Get a Professional Value Estimate in Minutes – No Sign-Up Required
              </p>
              <p className="text-sm text-slate-500">
                Powered by <span className="font-semibold">APPRAISILY.COM</span> – the ultimate tool in art appraisal
              </p>
            </div>

            <p className="text-lg text-slate-600 max-w-2xl">
              Discover if your artwork is worth more than you think. Our AI-powered analysis provides instant insights into authenticity and potential value – completely free, no obligations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span className="text-slate-700">Free instant analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span className="text-slate-700">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span className="text-slate-700">Expert insights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span className="text-slate-700">AI-powered accuracy</span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mx-auto max-w-2xl mb-8 p-4 alert-error flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error" />
            <p className="text-error">{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {!initialSessionId && (
            <ImageUploader
              onUpload={uploadImage}
              isUploading={isUploading}
              uploadedImageUrl={customerImage}
              uploadError={uploadError || undefined}
              sessionId={sessionId}
              onReset={() => {
                setCustomerImage(null);
              }}
            />
          )}
          
          {customerImage && sessionId && !searchResults && !isSearching && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-slate-600">
                  Your image has been uploaded successfully. Use the tool below to analyze it:
                </p>
              </div>
              <div className="mx-auto max-w-2xl">
                <VisualSearchPanel onClick={() => sessionId && startVisualSearch(sessionId)} isSearching={isSearching} />
              </div>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <p className="text-slate-600 mt-4">Performing visual search...</p>
            </div>
          )}

          {searchResults && (
            <ResultsDisplay
              searchResults={searchResults}
              sessionId={sessionId}
              submitEmail={submitEmail}
              onAnalyzeOrigin={analyzeOrigin}
              isAnalyzingOrigin={isAnalyzingOrigin}
              originResults={originResults}
              isAnalyzing={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtScreener;
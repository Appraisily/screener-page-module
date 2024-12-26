import React from 'react';
import { AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import VisualSearchPanel from './VisualSearchPanel';
import ResultsDisplay from './ResultsDisplay';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

export interface ArtScreenerProps {
  apiUrl?: string;
  sessionId?: string;
}

const ArtScreener: React.FC<ArtScreenerProps> = ({ apiUrl, sessionId: initialSessionId }) => {
  const {
    uploadImage,
    startVisualSearch,
    testVisualSearch,
    submitEmail,
    isUploading,
    isSearching,
    customerImage,
    sessionId,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    error,
    searchResults
  } = useImageAnalysis(apiUrl, initialSessionId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <header className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Fast, Free Screening for Art & Antiques
              </h1>
              <p className="text-xl text-[#007bff]">
                by Appraisily
              </p>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl">
              See if your item's worth further appraisal. Get instant insights using our proprietary tools to help determine authenticity and potential value.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
                <span className="text-gray-600">Free instant analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
                <span className="text-gray-600">No sign-up required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
                <span className="text-gray-600">Professional insights</span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mx-auto max-w-2xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {!initialSessionId && (
            <ImageUploader 
              onUpload={uploadImage}
              isUploading={isUploading}
              customerImage={customerImage}
              sessionId={sessionId}
            />
          )}

          {customerImage && sessionId && !searchResults && !isSearching && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Your image has been uploaded successfully. Use the tool below to analyze it:
                </p>
              </div>
              <div className="mx-auto max-w-2xl">
                <VisualSearchPanel onClick={startVisualSearch} />
              </div>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <p className="text-gray-600 mt-4">Performing visual search...</p>
            </div>
          )}

          {searchResults && (
            <ResultsDisplay
              similarImages={[]}
              analysis={null}
              enhancedAnalysis={null}
              offerText={null}
              onGenerateAnalysis={() => {}}
              onEnhanceAnalysis={() => {}}
              onAnalyzeOrigin={analyzeOrigin}
              isAnalyzingOrigin={isAnalyzingOrigin}
              originResults={originResults}
              isAnalyzing={false}
              isEnhancing={false}
              steps={[]}
              itemType={null}
              searchResults={searchResults}
              sessionId={sessionId || null}
              submitEmail={submitEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtScreener;
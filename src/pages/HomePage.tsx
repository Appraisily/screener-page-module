import { useEffect, useCallback } from 'react';
import { AlertCircle, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import VisualSearchPanel from '../components/VisualSearchPanel';
import ResultsDisplay from '../components/ResultsDisplay';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

function HomePage() {
  const {
    uploadImage,
    startVisualSearch,
    testVisualSearch,
    submitEmail,
    isUploading,
    isSearching,
    customerImage,
    sessionId,
    setSessionId,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    error,
    searchResults
  } = useImageAnalysis();

  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (sessionId) {
      return await submitEmail(email);
    }
    return false;
  }, [sessionId, submitEmail]);

  useEffect(() => {
    console.log('HomePage state update:', {
      hasSessionId: !!sessionId,
      sessionIdValue: sessionId,
      hasSearchResults: !!searchResults,
      customerImageUrl: customerImage
    });
  }, [sessionId, searchResults, customerImage]);
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <header className="mx-auto max-w-3xl text-center mb-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 bg-primary-900 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-900">
                  Fast, Free Screening for Art & Antiques
                </h1>
                <p className="text-xl text-slate-700">
                  by Appraisily
                </p>
              </div>

              <p className="text-lg text-slate-600 max-w-2xl">
                See if your item's worth further appraisal. Get instant insights using our proprietary tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm px-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">Free instant analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">No sign-up required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">Professional insights</span>
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
            <ImageUploader 
              onUpload={uploadImage}
              isUploading={isUploading}
              customerImage={customerImage}
              sessionId={sessionId}
            />

            {customerImage && sessionId && !searchResults && !isSearching && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-slate-600">
                    Your image has been uploaded successfully. Use the tool below to analyze it:
                  </p>
                </div>
              <div className="mx-auto max-w-2xl">
                <VisualSearchPanel 
                  onClick={() => sessionId && startVisualSearch(sessionId)} 
                  isSearching={isSearching}
                />
              </div>
              </div>
            )}
            
            {/* Test Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={async () => {
                  if (!isSearching && setSessionId) {
                    const testId = '5beeda96-1ab6-49a5-b689-58af1bc8768d';
                    setSessionId(testId);
                    await testVisualSearch(testId);
                  }
                }}
                className="btn-primary px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
                disabled={isSearching}
              >
                <Search className="w-4 h-4 mr-2" />
                Test Visual Search
              </button>
            </div>

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
                submitEmail={handleEmailSubmit}
                onAnalyzeOrigin={analyzeOrigin}
                isAnalyzingOrigin={isAnalyzingOrigin}
                originResults={originResults}
                isAnalyzing={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
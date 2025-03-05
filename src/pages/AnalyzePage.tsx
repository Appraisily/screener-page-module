import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import AnalysisProgress from '../components/AnalysisProgress';
import EmailCollectionCard from '../components/EmailCollectionCard';
import ResultsDisplay from '../components/ResultsDisplay';
import Services from '../components/Services';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

function AnalyzePage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const {
    isInitializing,
    customerImage,
    gcsImageUrl,
    error,
    currentStep,
    searchResults,
    submitEmail,
    hasEmailBeenSubmitted,
    analysisSteps,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults
  } = useImageAnalysis(undefined, sessionId);

  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (sessionId) {
      return await submitEmail(email);
    }
    return false;
  }, [sessionId, submitEmail]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <AnalysisProgress steps={analysisSteps} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <header className="mx-auto max-w-3xl text-center mb-16">
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <div className="w-24 h-24 mb-2">
                <img 
                  src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png?updatedAt=1731919266638" 
                  alt="Appraisily Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Analyzing Your Artwork
              </h1>
              <p className="text-2xl font-semibold mt-2 text-[rgb(0,123,255)]">
                AI-Powered Analysis in Progress
              </p>
            </div>
          </header>

          {/* Customer Image Display */}
          {(customerImage || gcsImageUrl) && (
            <div className="mx-auto max-w-2xl mb-16">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={customerImage || gcsImageUrl}
                    alt="Uploaded artwork"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                    }}
                  />
                </div>
                {sessionId && (
                  <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-sm font-medium text-gray-600">Analysis ID:</span>
                    <code className="px-3 py-1 bg-white rounded text-sm font-mono text-blue-600 border border-blue-200">
                      {sessionId}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-2xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {searchResults && !hasEmailBeenSubmitted && (
            <EmailCollectionCard onSubmit={handleEmailSubmit} />
          )}

          <div className="space-y-16">
            <Services 
              itemType={searchResults?.openai?.category || null}
              submitEmail={handleEmailSubmit}
            />
            {customerImage && (
              <ResultsDisplay 
                searchResults={searchResults}
                sessionId={sessionId}
                submitEmail={submitEmail}
                onAnalyzeOrigin={analyzeOrigin}
                isAnalyzingOrigin={isAnalyzingOrigin}
                originResults={originResults}
                isAnalyzing={false}
                hasEmailBeenSubmitted={hasEmailBeenSubmitted}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyzePage;
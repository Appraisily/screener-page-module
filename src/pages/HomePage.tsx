import { useEffect, useCallback, useState } from 'react';
import Navbar from '../components/Navbar';
import DebugButton from '../components/DebugButton';
import EmailCollectionCard from '../components/EmailCollectionCard';
import Header from '../components/home/Header';
import UploadSection from '../components/home/UploadSection';
import ExampleCarousel from '../components/ExampleCarousel';
import ExampleAnalysisReport from '../components/ExampleAnalysisReport';
import DetailedAnalysisReport from '../components/DetailedAnalysisReport';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

interface HomePageProps {
  apiUrl?: string;
}

function HomePage({ apiUrl }: HomePageProps) {
  const [isEmailCardMinimized, setIsEmailCardMinimized] = useState(false);
  const [showBackupButton, setShowBackupButton] = useState(false);

  const {
    uploadImage,
    startFullAnalysis,
    submitEmail,
    resetState,
    isUploading,
    isAnalyzing,
    customerImage,
    sessionId,
    setSessionId,
    error,
    hasEmailBeenSubmitted,
    searchResults,
    analysisSteps
  } = useImageAnalysis(apiUrl);

  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (sessionId) {
      return await submitEmail(email);
    }
    return false;
  }, [sessionId, submitEmail]);

  const handleDebug = useCallback((testSessionId: string) => {
    setSessionId(testSessionId);
    startFullAnalysis(testSessionId);
  }, [startFullAnalysis, setSessionId]);

  const toggleEmailCard = useCallback(() => {
    setIsEmailCardMinimized(prev => !prev);
  }, []);

  // Show backup button if analysis hasn't started within 5 seconds of having a sessionId
  useEffect(() => {
    if (sessionId && !isAnalyzing && !searchResults) {
      const timer = setTimeout(() => {
        setShowBackupButton(true);
      }, 5000);

      return () => clearTimeout(timer);
    }

    setShowBackupButton(false);
  }, [sessionId, isAnalyzing, searchResults]);

  const handleManualAnalysis = useCallback(() => {
    if (sessionId) {
      console.log('[Debug] Manual analysis triggered');
      startFullAnalysis(sessionId);
      setShowBackupButton(false);
    }
  }, [sessionId, startFullAnalysis]);

  return (
    <>
      <Navbar />
      {import.meta.env.DEV && (
        <DebugButton onDebug={handleDebug} />
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <Header />

          <div className="space-y-24">
            {/* Primary Upload Section */}
            <UploadSection
              onUpload={uploadImage}
              onReset={resetState}
              onManualAnalysis={handleManualAnalysis}
              isUploading={isUploading}
              isAnalyzing={isAnalyzing}
              customerImage={customerImage}
              sessionId={sessionId}
              showBackupButton={showBackupButton}
              error={error}
              analysisSteps={analysisSteps}
            />

            {/* Analysis Results - Only shown when we have results */}
            {searchResults && customerImage && (
              <DetailedAnalysisReport
                sessionId={sessionId || null}
                imageUrl={customerImage}
                data={searchResults?.detailedAnalysis || null}
              />
            )}

            {/* Recent Examples - Only show if no analysis is in progress */}
            {!customerImage && !isAnalyzing && !searchResults && (
              <ExampleCarousel />
            )}

            {/* Sample Report - Only show if no active analysis */}
            {!customerImage && !searchResults && !isAnalyzing && (
              <ExampleAnalysisReport />
            )}
          </div>

          {/* Show email card whenever we have a session, unless email is already submitted */}
          {sessionId && !hasEmailBeenSubmitted && (
            <EmailCollectionCard 
              onSubmit={handleEmailSubmit}
              isMinimized={isEmailCardMinimized}
              onToggleMinimize={toggleEmailCard}
            />
          )}

        </div>
      </div>
    </>
  );
}

export default HomePage;
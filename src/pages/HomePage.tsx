import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from '../components/SimpleIcons';
import Navbar from '../components/Navbar';
import DebugButton from '../components/DebugButton';
import EmailCollectionCard from '../components/EmailCollectionCard';
import Header from '../components/home/Header';
import UploadSection from '../components/home/UploadSection';
import ExampleCarousel from '../components/ExampleCarousel';
import ExampleAnalysisReport from '../components/ExampleAnalysisReport';
import DetailedAnalysisReport from '../components/DetailedAnalysisReport';
import AnalysisProgress from '../components/AnalysisProgress';
import ProgressiveResults from '../components/ProgressiveResults';
import ValueEstimationProgress from '../components/ValueEstimationProgress';
import ErrorRecoveryDialog from '../components/ErrorRecoveryDialog';
import Services from '../components/Services';
import { 
  useImageAnalysis,
  useProgressiveResults,
  useValueEstimation,
  useErrorRecovery 
} from '../hooks'; // Import from centralized hooks index
import { 
  registerSession, 
  updateSessionState, 
  cleanupAbandonedSessions 
} from '../utils/sessionRecovery';

interface HomePageProps {
  apiUrl?: string;
}

function HomePage({ apiUrl }: HomePageProps) {
  const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const [isEmailCardMinimized, setIsEmailCardMinimized] = useState(false);
  const [showBackupButton, setShowBackupButton] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [useFallbackResults, setUseFallbackResults] = useState(false);
  const [showValueEstimationProgress, setShowValueEstimationProgress] = useState(false);
  const [skipValueEstimation, setSkipValueEstimation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use error recovery hook
  const {
    error: recoveryError,
    isRecovering,
    hasRecovered,
    setError,
    clearError,
    retryOperation,
    generateFallbackResults
  } = useErrorRecovery();

  const {
    uploadImage,
    startFullAnalysis,
    submitEmail,
    resetState,
    isUploading,
    isAnalyzing,
    isInitializing,
    customerImage,
    gcsImageUrl,
    sessionId,
    setSessionId,
    error,
    hasEmailBeenSubmitted,
    searchResults,
    analysisSteps,
    updateStepProgress,
    overallProgress,
    shouldPollResults,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    itemType
  } = useImageAnalysis(apiUrl, urlSessionId);

  // Value estimation hook
  const {
    getValueEstimation,
    isLoading: isValueEstimationLoading,
    error: valueEstimationError,
    result: valueEstimationResult,
    progress: valueEstimationProgress
  } = useValueEstimation(import.meta.env.VITE_API_URL || 'http://localhost:8080');

  // State to manage auto-start of value estimation
  const [valueEstimationStarted, setValueEstimationStarted] = useState(false);
  const [valueEstimationComplete, setValueEstimationComplete] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showValueLoader, setShowValueLoader] = useState(false);

  // Progressive results with error handling
  const { partialResults } = useProgressiveResults({
    apiUrl: import.meta.env.VITE_API_URL,
    sessionId,
    shouldPoll: shouldPollResults,
    onStepProgress: (stepId, percentComplete) => {
      updateStepProgress(stepId, 'processing', percentComplete);
      
      // Update session state with progress
      if (sessionId) {
        updateSessionState(sessionId, { currentStep: stepId });
      }
    },
    onStepComplete: (stepId) => {
      updateStepProgress(stepId, 'completed', 100);
      
      // As soon as we have any detail information, start value estimation
      // This happens in parallel with the remaining analysis steps
      if (!valueEstimationStarted && sessionId && !skipValueEstimation && getValueEstimation) {
        // For both details and origin step completion, check if we have enough data
        if ((stepId === 'details' || stepId === 'visual') && partialResults?.detailedAnalysis) {
          console.log(`Auto-starting value estimation after ${stepId} analysis completion`);
          setValueEstimationStarted(true);
          setShowValueEstimationProgress(true);
          setShowValueLoader(true);
          getValueEstimation(sessionId)
            .then(result => {
              if (result) {
                setValueEstimationComplete(true);
                setShowValueLoader(false);
              }
            })
            .catch(err => {
              console.error('Value estimation failed:', err);
            });
        }
      }
    },
    onStepError: (stepId) => {
      updateStepProgress(stepId, 'error', 0);
      
      // Show recovery dialog for failed steps
      setError(`Analysis step "${stepId}" failed`, 
        stepId === 'visual' ? 'network' : 'server',
        { sessionId, stepId }
      );
      setShowRecoveryDialog(true);
    },
    onComplete: (results) => {
      try {
        if (!results) {
          console.error('Received null/undefined results from analysis');
          return;
        }
        
        // Mark analysis as complete - this will affect our conditional rendering
        setAnalysisComplete(true);
        
        // Auto-start value estimation if it hasn't started yet
        if (!valueEstimationStarted && sessionId && !skipValueEstimation && getValueEstimation) {
          console.log('Auto-starting value estimation after full analysis completion');
          setValueEstimationStarted(true);
          setShowValueEstimationProgress(true);
          setShowValueLoader(true);
          getValueEstimation(sessionId)
            .then(result => {
              if (result) {
                setValueEstimationComplete(true);
                setShowValueLoader(false);
              }
            })
            .catch(err => console.error('Value estimation failed:', err));
        }
      } catch (error) {
        console.error('Error processing analysis results:', error);
      }
    }
  });

  // Session initialization and URL update (if needed)
  useEffect(() => {
    if (urlSessionId && !isInitialized) {
      console.log(`Initializing from URL session ID: ${urlSessionId}`);
      setIsInitialized(true);
      
      // If navigated to /analyze/:sessionId, update URL to home page with session
      if (window.location.pathname.startsWith('/analyze/')) {
        navigate('/', { replace: true });
      }
    }
  }, [urlSessionId, navigate, isInitialized]);

  // Session registration and cleanup
  useEffect(() => {
    if (sessionId && (customerImage || gcsImageUrl)) {
      // Register this session for tracking
      registerSession(sessionId, customerImage || gcsImageUrl || '');
      
      // Clean up any abandoned sessions
      cleanupAbandonedSessions();
    }
  }, [sessionId, customerImage, gcsImageUrl]);
  
  // Auto-increment overall progress to give feedback even if backend is slow
  useEffect(() => {
    if (!isAnalyzing || overallProgress >= 100) return;
    
    // Increment progress by 1-3% every 300ms for a smoother experience
    const progressTimer = setInterval(() => {
      // Don't update if we're already at 100% or not analyzing
      if (!isAnalyzing || overallProgress >= 99) {
        clearInterval(progressTimer);
        return;
      }
      
      // Random increment between 1-3% for more natural progression
      const increment = Math.floor(Math.random() * 3) + 1;
      
      // Update a step if needed to show activity
      const pendingStep = analysisSteps.find(step => 
        step.status === 'pending' || (step.status === 'processing' && step.percentComplete < 95)
      );
      
      if (pendingStep) {
        const newPercent = Math.min(95, (pendingStep.percentComplete || 0) + increment);
        updateStepProgress(pendingStep.id, 'processing', newPercent);
      }
    }, 300);
    
    return () => clearInterval(progressTimer);
  }, [isAnalyzing, overallProgress, analysisSteps, updateStepProgress]);

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

  // Retry handler for recovery dialog
  const handleRetry = useCallback(() => {
    retryOperation().then(success => {
      if (success) {
        setShowRecoveryDialog(false);
      }
    });
  }, [retryOperation]);
  
  // Fallback handler for recovery dialog
  const handleUseFallback = useCallback(() => {
    setUseFallbackResults(true);
    setShowRecoveryDialog(false);
    clearError();
  }, [clearError]);
  
  // Merge with fallbacks if needed
  const finalResults = useFallbackResults && sessionId && (customerImage || gcsImageUrl)
    ? generateFallbackResults(sessionId, customerImage || gcsImageUrl || '')
    : searchResults;

  // Handle timeout detection
  useEffect(() => {
    if (!isAnalyzing || !sessionId) return;
    
    // Set up timeout detection
    const timeoutDuration = 2 * 60 * 1000; // 2 minutes
    const timeoutId = setTimeout(() => {
      // If we're still analyzing after the timeout, show recovery options
      if (isAnalyzing) {
        setError('Analysis is taking longer than expected', 'timeout', { sessionId });
        setShowRecoveryDialog(true);
      }
    }, timeoutDuration);
    
    return () => clearTimeout(timeoutId);
  }, [isAnalyzing, sessionId, setError]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <AnalysisProgress steps={analysisSteps} overallProgress={overallProgress} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {import.meta.env.DEV && (
        <DebugButton onDebug={handleDebug} />
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          {/* Only show header if we don't have a session in progress */}
          {!sessionId && !customerImage && !isAnalyzing && (
            <Header />
          )}

          {sessionId && (customerImage || gcsImageUrl) && (
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
          )}

          <div className="space-y-24">
            {/* Customer Image Display for recovered sessions */}
            {sessionId && (customerImage || gcsImageUrl) && (
              <div className="mx-auto max-w-2xl mb-8">
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

            {/* Error display */}
            {error && !recoveryError && (
              <div className="mx-auto max-w-2xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Primary Upload Section - Only show if no session is already in progress */}
            {(!sessionId && !customerImage) && (
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
            )}

            {/* Show analysis progress while analyzing */}
            {isAnalyzing && (
              <div className="mb-12">
                <AnalysisProgress 
                  steps={analysisSteps} 
                  overallProgress={overallProgress}
                />
              </div>
            )}
            
            {/* Show value estimation progress */}
            {showValueEstimationProgress && valueEstimationProgress.status !== 'idle' && !valueEstimationResult && (
              <div className="mb-12 mt-8">
                <ValueEstimationProgress
                  status={valueEstimationProgress.status}
                  percentComplete={valueEstimationProgress.percentComplete}
                  stage={valueEstimationProgress.stage}
                  message={valueEstimationProgress.message}
                  estimatedTimeRemaining={valueEstimationProgress.estimatedTimeRemaining}
                  onCancel={() => {
                    setSkipValueEstimation(true);
                    setShowValueEstimationProgress(false);
                  }}
                />
              </div>
            )}

            {/* Show progressive results ONLY during analysis */}
            {isAnalyzing && !useFallbackResults && (
              <ProgressiveResults
                partialResults={partialResults}
                analysisSteps={analysisSteps}
                sessionId={sessionId}
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* Analysis Results - Only shown when we have final results or using fallback */}
            {((finalResults && (customerImage || gcsImageUrl) && !isAnalyzing) || useFallbackResults) && (
              <>
                {showValueLoader && !valueEstimationComplete && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg font-semibold text-gray-700">Fetching Auction Data and Appraisal Insights...</p>
                    </div>
                    <p className="text-center text-gray-500 mt-3">
                      We're analyzing auction market data to provide accurate insights about your item's value.
                    </p>
                  </div>
                )}
                
                <DetailedAnalysisReport
                  sessionId={sessionId || null}
                  imageUrl={customerImage || gcsImageUrl || ''}
                  data={(useFallbackResults ? finalResults : finalResults)?.detailedAnalysis || null}
                />
              </>
            )}

            {/* Recent Examples - Only show if no analysis is in progress */}
            {!customerImage && !isAnalyzing && !searchResults && !sessionId && (
              <ExampleCarousel />
            )}

            {/* Sample Report - Only show if no active analysis */}
            {!customerImage && !searchResults && !isAnalyzing && !sessionId && (
              <ExampleAnalysisReport />
            )}

            {/* Related services */}
            {finalResults && (
              <Services 
                itemType={finalResults?.metadata?.analysisResults?.openaiAnalysis?.category || itemType || null}
                submitEmail={handleEmailSubmit}
              />
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

      {/* Error Recovery Dialog */}
      {showRecoveryDialog && recoveryError && (
        <ErrorRecoveryDialog
          error={recoveryError}
          isRecovering={isRecovering}
          hasRecovered={hasRecovered}
          onRetry={handleRetry}
          onFallback={handleUseFallback}
          onDismiss={() => setShowRecoveryDialog(false)}
        />
      )}
    </>
  );
}

export default HomePage;
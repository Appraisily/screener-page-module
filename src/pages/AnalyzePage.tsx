import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import AnalysisProgress from '../components/AnalysisProgress';
import EmailCollectionCard from '../components/EmailCollectionCard';
import ResultsDisplay from '../components/ResultsDisplay';
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
import { mergeWithFallbacks } from '../utils/fallbackService';

function AnalyzePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [useFallbackResults, setUseFallbackResults] = useState(false);
  const [showValueEstimationProgress, setShowValueEstimationProgress] = useState(false);
  const [skipValueEstimation, setSkipValueEstimation] = useState(false);

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
    isInitializing,
    customerImage,
    gcsImageUrl,
    error,
    searchResults,
    submitEmail,
    hasEmailBeenSubmitted,
    analysisSteps,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    isAnalyzing,
    updateStepProgress,
    overallProgress,
    shouldPollResults
  } = useImageAnalysis(undefined, sessionId);
  
  // Value estimation hook
  const {
    getValueEstimation,
    isLoading: isValueEstimationLoading,
    error: valueEstimationError,
    result: valueEstimationResult,
    progress: valueEstimationProgress
  } = useValueEstimation(import.meta.env.VITE_API_URL || 'http://localhost:8080');

  // Session registration and cleanup
  useEffect(() => {
    if (sessionId && customerImage) {
      // Register this session for tracking
      registerSession(sessionId, customerImage);
      
      // Clean up any abandoned sessions
      cleanupAbandonedSessions();
    }
  }, [sessionId, customerImage]);

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
      
      // When any major analysis step completes, check if we can start value estimation
      // Prioritize starting after 'origin' analysis, but also start after 'details' if that's available
      if ((stepId === 'origin' || stepId === 'details') && sessionId && !skipValueEstimation && getValueEstimation) {
        // Check if we have detailed analysis data before starting value estimation
        const hasDetailedData = !!partialResults?.detailedAnalysis;
        
        if (hasDetailedData) {
          console.log(`Starting value estimation after ${stepId} analysis completion`);
          setShowValueEstimationProgress(true);
          getValueEstimation(sessionId).catch(err => {
            console.error('Value estimation failed:', err);
          });
        } else {
          console.log(`Completed ${stepId} but waiting for detailed analysis before value estimation`);
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
        console.log('Full analysis complete with results:', results);
        
        // Perform safe, defensive validation before processing
        if (!results) {
          console.error('Received null/undefined results from analysis');
          return;
        }
        
        // Create safe copies of required objects with default values to prevent access before initialization errors
        const safeResults = {
          metadata: results.metadata || {},
          detailedAnalysis: results.detailedAnalysis || {},
          // Add other fields as needed
        };
        
        // Define all variables that will be used before accessing them
        // Safe access to nested properties with null/undefined checks at each level
        const safeMetadata = safeResults.metadata || {};
        const safeAnalysisResults = safeMetadata.analysisResults || {};
        const safeOpenAIAnalysis = safeAnalysisResults.openaiAnalysis || {};
        const safeDetailedAnalysis = safeResults.detailedAnalysis || {};
        
        // Update the searchResults state with the complete results
        if (safeMetadata && safeDetailedAnalysis) {
          // Check if we have the required concise_description field for value estimation
          if (!safeDetailedAnalysis.concise_description) {
            console.warn('Missing concise_description in detailedAnalysis, value estimation might fail');
            
            // Add a fallback description if missing
            if (safeOpenAIAnalysis.description) {
              const fallbackDescription = `${safeOpenAIAnalysis.category || 'Art'} ${safeOpenAIAnalysis.description}`;
              console.log(`Using fallback description for value estimation: "${fallbackDescription}"`);
              
              // Add the concise_description field to the results
              safeDetailedAnalysis.concise_description = fallbackDescription;
            } else {
              // Ultimate fallback if we have nothing else
              safeDetailedAnalysis.concise_description = "Unknown Art Item";
              console.log("Using generic fallback description for value estimation");
            }
          }
          
          // Trigger value estimation automatically when full analysis is complete
          if (sessionId && !skipValueEstimation) {
            console.log('Auto-starting value estimation for session:', sessionId);
            
            // Use setTimeout to break the call chain and prevent potential race conditions
            setTimeout(() => {
              try {
                setShowValueEstimationProgress(true);
                getValueEstimation(sessionId)
                  .then(result => {
                    console.log('Value estimation completed successfully:', result);
                  })
                  .catch(err => {
                    console.error('Auto-triggered value estimation failed:', err);
                    // Don't let errors break the UI
                  });
              } catch (valEstErr) {
                console.error('Error starting value estimation:', valEstErr);
                // Continue showing UI even if value estimation fails
              }
            }, 0);
          }
        } else {
          console.warn('Missing required metadata or detailedAnalysis in results');
        }
      } catch (error) {
        console.error('Error processing analysis results:', error);
      }
    }
  });
  
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

  // Email submission handler
  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (sessionId) {
      return await submitEmail(email);
    }
    return false;
  }, [sessionId, submitEmail]);
  
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

          {error && !recoveryError && (
            <div className="mx-auto max-w-2xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
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

          {/* Show progressive results as they become available */}
          {(isAnalyzing || useFallbackResults) && (
            <ProgressiveResults
              partialResults={useFallbackResults ? finalResults : partialResults}
              analysisSteps={analysisSteps}
              sessionId={sessionId}
              isAnalyzing={isAnalyzing}
            />
          )}

          {finalResults && !hasEmailBeenSubmitted && (
            <EmailCollectionCard onSubmit={handleEmailSubmit} />
          )}

          <div className="space-y-16">
            <Services 
              itemType={finalResults?.metadata?.analysisResults?.openaiAnalysis?.category || null}
              submitEmail={handleEmailSubmit}
            />
            {/* Show final results when analysis is complete or using fallbacks */}
            {customerImage && (!isAnalyzing || useFallbackResults) && finalResults && (
              <ResultsDisplay 
                searchResults={finalResults}
                sessionId={sessionId}
                submitEmail={submitEmail}
                onAnalyzeOrigin={analyzeOrigin}
                isAnalyzingOrigin={isAnalyzingOrigin}
                originResults={originResults}
                isAnalyzing={isAnalyzing && !useFallbackResults}
                hasEmailBeenSubmitted={hasEmailBeenSubmitted}
                valueEstimation={valueEstimationResult}
              />
            )}
          </div>
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

export default AnalyzePage;
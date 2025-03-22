import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Info, Tag, Calendar, Search, MapPin } from 'lucide-react';
import type { SearchResults, AnalysisStep } from '../types';

interface ProgressiveResultsProps {
  partialResults: Partial<SearchResults> | null;
  analysisSteps: AnalysisStep[];
  sessionId: string | null;
  isAnalyzing: boolean;
}

const ProgressiveResults: React.FC<ProgressiveResultsProps> = ({
  partialResults,
  analysisSteps,
  sessionId,
  isAnalyzing
}) => {
  // Helper to determine if a particular step is completed
  const isStepCompleted = (stepId: string) => {
    const step = analysisSteps.find(s => s.id === stepId);
    return step?.status === 'completed';
  };

  // Get the currently processing step
  const currentStep = analysisSteps.find(s => s.status === 'processing');

  // Determine if we have some visual search results to show
  const hasVisualResults = partialResults?.metadata?.analysisResults?.webEntities !== undefined;
  
  // Determine if we have detailed analysis to show
  const hasDetailedResults = partialResults?.detailedAnalysis !== undefined;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          {sessionId && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-500">Session ID:</span>
              <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{sessionId}</code>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Show a message when analysis is in progress */}
          {isAnalyzing && currentStep && (
            <div className="bg-blue-50 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-medium text-blue-700">{currentStep.title} in progress</h3>
                <p className="text-sm text-blue-600">{currentStep.description}</p>
              </div>
            </div>
          )}

          {/* Visual Search Results (if available) */}
          <AnimatePresence>
            {isStepCompleted('visual') && hasVisualResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Visual Search Results
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">Category</h4>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partialResults?.metadata?.analysisResults?.openaiAnalysis?.category || 'Analyzing...'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">Description</h4>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partialResults?.metadata?.analysisResults?.openaiAnalysis?.description || 'Analyzing...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detailed Analysis Results (if available) */}
          <AnimatePresence>
            {isStepCompleted('details') && hasDetailedResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Detailed Analysis
                </h3>
                
                <div className="space-y-4">
                  {/* Origin */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">Likely Origin</h4>
                    </div>
                    <p className="text-gray-900">
                      {partialResults?.detailedAnalysis?.origin_analysis?.likely_origin || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {partialResults?.detailedAnalysis?.origin_analysis?.reasoning || ''}
                    </p>
                  </div>
                  
                  {/* Age */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">Estimated Age</h4>
                    </div>
                    <p className="text-gray-900">
                      {partialResults?.detailedAnalysis?.age_analysis?.estimated_date_range || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {partialResults?.detailedAnalysis?.age_analysis?.reasoning || ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No results yet message */}
          {!hasVisualResults && !hasDetailedResults && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-gray-700 font-medium">Analysis in progress</h3>
              <p className="text-gray-500 text-sm mt-1">Results will appear here as they become available</p>
            </div>
          )}

          {/* Error message if any step has an error */}
          {analysisSteps.some(step => step.status === 'error') && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-700">Analysis Issue</h4>
                  <p className="text-sm text-red-600 mt-1">
                    We encountered an issue with part of the analysis. Some results may be incomplete.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressiveResults;
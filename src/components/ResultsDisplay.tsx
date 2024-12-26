import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import AppraiserProfile from './AppraiserProfile';
import VisualSearchResults from './VisualSearchResults';
import OriginAnalysisPanel from './OriginAnalysisPanel';
import EmailCollector from './EmailCollector';
import type { AnalysisStep } from '../hooks/useImageAnalysis';

interface ResultsDisplayProps {
  similarImages: string[];
  analysis: string | null;
  enhancedAnalysis: string | null;
  offerText: string | null;
  onGenerateAnalysis: () => void;
  onEnhanceAnalysis: () => void;
  isAnalyzing: boolean;
  isEnhancing: boolean;
  steps: AnalysisStep[];
  itemType: 'Art' | 'Antique' | null;
  searchResults?: any;
  sessionId: string | null;
  submitEmail: (email: string) => Promise<boolean>;
  onAnalyzeOrigin?: () => void;
  isAnalyzingOrigin?: boolean;
  originResults?: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  similarImages,
  analysis,
  enhancedAnalysis,
  offerText,
  onGenerateAnalysis,
  onEnhanceAnalysis,
  isAnalyzing,
  isEnhancing,
  steps,
  itemType,
  searchResults,
  sessionId,
  submitEmail,
  onAnalyzeOrigin,
  isAnalyzingOrigin,
  originResults
}) => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  useEffect(() => {
    console.log('ResultsDisplay mounted/updated:', {
      hasSearchResults: !!searchResults,
      sessionId,
      emailSubmitted,
      searchResultsKeys: searchResults ? Object.keys(searchResults) : []
    });
  }, [searchResults, sessionId, emailSubmitted]);

  // Debug logging for email collector conditions
  console.log('Email Collector Conditions:', {
    hasSearchResults: !!searchResults,
    emailSubmitted,
    sessionId,
    searchResultsData: searchResults
  });


  return (
    <div className="space-y-12">
      {/* Visual Search Results */}
      {searchResults && <VisualSearchResults results={searchResults} />}
      
      {/* Origin Analysis Panel */}
      {searchResults && (
        <div className="mx-auto max-w-2xl mt-8">
          <OriginAnalysisPanel 
            onClick={onAnalyzeOrigin || (() => {})}
            isAnalyzing={isAnalyzingOrigin}
            results={originResults}
          />
        </div>
      )}
      
      {/* Email Collector */}
      {originResults && !emailSubmitted && sessionId && (
        <div className="mx-auto max-w-2xl mt-8">
          <EmailCollector 
            onSubmit={async (email) => {
              const success = await submitEmail(email);
              if (success) {
                setEmailSubmitted(true);
              }
            }}
            isLoading={isAnalyzing}
          />
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <p className="text-gray-600 mt-4">Generating expert analysis...</p>
        </div>
      )}

      {analysis && (
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:ring-[rgb(0,123,255)] transition-colors">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Expert Analysis</h2>
          <div className="prose max-w-none">
            {analysis.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {!enhancedAnalysis && !isEnhancing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onEnhanceAnalysis}
                className="rounded-md bg-[rgb(0,123,255)] px-6 py-3 text-lg font-semibold text-white shadow-sm 
                         hover:bg-[rgb(0,123,255)]/90 focus-visible:outline focus-visible:outline-2 
                         focus-visible:outline-offset-2 focus-visible:outline-[rgb(0,123,255)] 
                         transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Enhanced Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {isEnhancing && (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <p className="text-gray-600 mt-4">Enhancing analysis with additional insights...</p>
        </div>
      )}

      {enhancedAnalysis && (
        <>
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:ring-[rgb(0,123,255)] transition-colors">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enhanced Analysis</h2>
            <div className="prose max-w-none">
              {enhancedAnalysis.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <AppraiserProfile message={offerText} />
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;
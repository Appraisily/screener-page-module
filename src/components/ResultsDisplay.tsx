import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import AppraiserProfile from './AppraiserProfile';
import VisualSearchResults from './VisualSearchResults';
import OriginAnalysisPanel from './OriginAnalysisPanel';
import EmailCollector from './EmailCollector';
import type { SearchResults, OriginResults, OpenAIAnalysisResults } from '../types';

interface ResultsDisplayProps {
  searchResults?: SearchResults | null;
  sessionId?: string | null;
  submitEmail: (email: string) => Promise<boolean>;
  onAnalyzeOrigin?: () => void;
  isAnalyzing: boolean;
  isAnalyzingOrigin?: boolean;
  originResults?: OriginResults | null;
  openAIResults?: OpenAIAnalysisResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  searchResults,
  sessionId,
  submitEmail,
  onAnalyzeOrigin,
  isAnalyzing,
  isAnalyzingOrigin,
  originResults,
  openAIResults
}) => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  useEffect(() => {
    console.log('ResultsDisplay mounted/updated:', {
      hasSearchResults: !!searchResults,
      sessionId,
      emailSubmitted,
      searchResultsKeys: searchResults ? Object.keys(searchResults) : [],
      hasOpenAIResults: !!openAIResults
    });
  }, [searchResults, sessionId, emailSubmitted, openAIResults]);

  return (
    <div className="space-y-12">
      {/* Visual Search Results */}
      <div className="overflow-x-hidden">
        {searchResults && <VisualSearchResults results={{...searchResults, openAIResults}} />}
      </div>
      
      {/* Email Confirmation */}
      {emailSubmitted && (
        <div className="mx-auto max-w-2xl bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Thank you for your interest!
              </h3>
              <p className="text-sm text-gray-600">
                We've sent your detailed analysis report to your email. Please check your inbox 
                (and spam folder) in the next few minutes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Origin Analysis Panel */}
      {searchResults && (
        <div className="mx-auto max-w-2xl mt-8">
          <OriginAnalysisPanel 
            onClick={() => onAnalyzeOrigin?.()}
            isAnalyzing={isAnalyzingOrigin}
            results={originResults as any}
          />
        </div>
      )}
      
      {/* Email Collector */}
      {searchResults && !emailSubmitted && (
        <div className="mx-auto max-w-2xl mt-8">
          <EmailCollector 
            onSubmit={async (email) => {
              setEmailSubmitted(true);
              await submitEmail(email);
              return true;
            }}
            isLoading={isAnalyzing}
          />
        </div>
      )}

      {emailSubmitted && (
        <div className="mx-auto max-w-2xl mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Want a Professional Opinion?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Get a detailed appraisal from our certified experts for the most accurate valuation.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="https://www.appraisily.com/pick-your-appraisal-type/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white
                         bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Learn More About Professional Appraisals
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
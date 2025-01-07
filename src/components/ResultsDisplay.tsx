import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import AppraiserProfile from './AppraiserProfile';
import VisualSearchResults from './VisualSearchResults';
import OriginAnalysisPanel from './OriginAnalysisPanel';
import EmailCollector from './EmailCollector';
import type { SearchResults, OriginResults } from '../types';

interface ResultsDisplayProps {
  searchResults?: SearchResults | null;
  sessionId?: string | null;
  submitEmail: (email: string) => Promise<boolean>;
  onAnalyzeOrigin?: () => void;
  isAnalyzing: boolean;
  isAnalyzingOrigin?: boolean;
  originResults?: OriginResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  searchResults,
  sessionId,
  submitEmail,
  onAnalyzeOrigin,
  isAnalyzing,
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

  return (
    <div className="space-y-12">
      {/* Visual Search Results */}
      <div className="overflow-x-hidden">
        {searchResults && <VisualSearchResults results={searchResults} />}
      </div>
      
      {/* Email Confirmation */}
      {emailSubmitted && (
        <div className="mx-auto max-w-2xl bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Mail className="w-6 h-6 text-blue-600" />
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
            results={originResults}
          />
        </div>
      )}
      
      {/* Email Collector */}
      {searchResults && !emailSubmitted && (
        <div className="mx-auto max-w-2xl mt-8">
          <EmailCollector 
            onSubmit={(email) => {
              setEmailSubmitted(true);
              submitEmail(email); // Fire and forget
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
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#007bff] 
                         bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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
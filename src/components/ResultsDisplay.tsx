import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import AppraiserProfile from './AppraiserProfile';
import VisualSearchResults from './VisualSearchResults';
import OriginAnalysisPanel from './OriginAnalysisPanel';
import EmailCollector from './EmailCollector';
import type { SearchResults, OriginResults } from '../types';

interface ResultsDisplayProps {
  searchResults: SearchResults;
  sessionId: string;
  submitEmail: (email: string) => Promise<boolean>;
  onAnalyzeOrigin?: () => void;
  isAnalyzing: boolean;
  isAnalyzingOrigin?: boolean;
  originResults?: OriginResults;
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

      {emailSubmitted && originResults && (
        <div className="mx-auto max-w-2xl mt-8">
          <AppraiserProfile />
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
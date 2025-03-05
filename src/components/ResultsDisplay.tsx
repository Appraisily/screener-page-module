import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import VisualSearchResults from './VisualSearchResults';
import EmailCollector from './EmailCollector';
import type { SearchResults } from '../types';

interface ResultsDisplayProps {
  searchResults?: SearchResults | null;
  sessionId?: string | null;
  submitEmail: (email: string) => Promise<boolean>;
  isAnalyzing: boolean;
  itemType?: string;
  hasEmailBeenSubmitted?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  searchResults,
  sessionId,
  submitEmail,
  isAnalyzing,
  itemType,
  hasEmailBeenSubmitted = false
}) => {
  return (
    <div className="space-y-12">
      {itemType && (
        <div className="mx-auto max-w-2xl text-center mb-8">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Identified as: {itemType}
          </span>
        </div>
      )}
      
      <div className="overflow-x-hidden">
        {searchResults && (
          <VisualSearchResults 
            results={searchResults} 
            sessionId={sessionId || ''} 
            onEmailSubmit={submitEmail}
            hasEmailBeenSubmitted={hasEmailBeenSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
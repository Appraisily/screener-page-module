import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, DollarSign, AlertCircle, TrendingUp, BarChart3, Clock, Info } from 'lucide-react';
import VisualSearchResults from './VisualSearchResults';
import EmailCollector from './EmailCollector';
import AuctionResults from './AuctionResults';
import type { SearchResults } from '../types';

interface ValueEstimationResult {
  timestamp: number;
  query: string;
  success: boolean;
  minValue: number;
  maxValue: number;
  mostLikelyValue: number;
  explanation: string;
  auctionResults: Array<{
    title: string;
    price: number;
    currency: string;
    house: string;
    date: string;
    description?: string;
  }>;
  auctionResultsCount: number;
}

interface ResultsDisplayProps {
  searchResults?: SearchResults | null;
  sessionId?: string | null;
  submitEmail: (email: string) => Promise<boolean>;
  isAnalyzing: boolean;
  itemType?: string;
  hasEmailBeenSubmitted?: boolean;
  valueEstimation?: ValueEstimationResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  searchResults,
  sessionId,
  submitEmail,
  isAnalyzing,
  itemType,
  hasEmailBeenSubmitted = false,
  valueEstimation = null
}) => {
  const [showRawData, setShowRawData] = useState(false);
  
  // For debugging purposes - check for additional data we might not be displaying
  const hasAdditionalData = searchResults && 
    (searchResults._rawData || 
     searchResults.additionalDetails || 
     searchResults.marketData || 
     searchResults.similarItems ||
     searchResults.auctionData);
  
  return (
    <div className="space-y-12">
      {itemType && (
        <div className="mx-auto max-w-2xl text-center mb-8">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Identified as: {itemType}
          </span>
        </div>
      )}
      
      {/* Value Estimation Section - Show either results or progress */}
      {valueEstimation ? (
        // Show actual value estimation results if we have them
        <div className="max-w-3xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 mb-12">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Value Estimation</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Value Range</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${valueEstimation.minValue.toLocaleString()} - ${valueEstimation.maxValue.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Most Likely Value</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${valueEstimation.mostLikelyValue.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Value Analysis</h3>
              <p className="text-gray-700">{valueEstimation.explanation}</p>
            </div>
            
            {valueEstimation.auctionResults && valueEstimation.auctionResults.length > 0 && (
              <div className="mb-8">
                <AuctionResults 
                  results={valueEstimation.auctionResults}
                  minValue={valueEstimation.minValue}
                  maxValue={valueEstimation.maxValue}
                  mostLikelyValue={valueEstimation.mostLikelyValue}
                />
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Comparable Auction Results
                    </h3>
                    <span className="text-sm text-gray-500">
                      {valueEstimation.auctionResultsCount} results found
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {valueEstimation.auctionResults.map((result, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{result.title}</h4>
                            <span className="text-base font-bold text-green-600">
                              ${result.price.toLocaleString()} {result.currency}
                            </span>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{result.date}</span>
                            </div>
                            <div>
                              <span className="font-medium">Auction House:</span> {result.house}
                            </div>
                            {result.description && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-gray-700 line-clamp-2">
                                  {result.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 italic">
                    These comparable items from recent auctions were used to inform our value estimation. 
                    Each item has been selected based on its similarity to your item in terms of style, 
                    age, condition, and other relevant factors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : isAnalyzing ? (
        // Show progress state when analyzing but no value estimation yet
        <div className="max-w-3xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 mb-12">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Value Estimation</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 px-6 py-6 bg-blue-50/50 rounded-lg border border-blue-100 mb-6 justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-blue-700 font-medium">
                Analyzing your item for value estimation...
              </span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              We'll provide a detailed estimate of your item's value once analysis is complete.
            </p>
          </div>
        </div>
      ) : null}
    
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
      
      {/* Debug section to show raw data - only visible in development or with showRawData */}
      {hasAdditionalData && (import.meta.env.DEV || showRawData) && (
        <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Additional Data Fields Available
            </h3>
            <button 
              onClick={() => setShowRawData(!showRawData)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
            >
              {showRawData ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {showRawData && searchResults && (
            <div className="border border-gray-200 rounded bg-white p-4 overflow-auto max-h-96">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(searchResults, null, 2)}
              </pre>
            </div>
          )}
          
          {!showRawData && (
            <div className="text-sm text-gray-600">
              <p>The analysis contains additional data fields not shown in the UI. Click "Show Details" to view all data.</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {searchResults?.additionalDetails && <li>Additional details</li>}
                {searchResults?.marketData && <li>Market data</li>}
                {searchResults?.similarItems && <li>Similar items</li>}
                {searchResults?.auctionData && <li>Auction data</li>}
                {searchResults?._rawData && <li>Raw analysis data</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
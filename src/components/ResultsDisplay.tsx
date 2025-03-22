import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, DollarSign, AlertCircle, TrendingUp, BarChart3, Clock } from 'lucide-react';
import VisualSearchResults from './VisualSearchResults';
import EmailCollector from './EmailCollector';
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
  return (
    <div className="space-y-12">
      {itemType && (
        <div className="mx-auto max-w-2xl text-center mb-8">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Identified as: {itemType}
          </span>
        </div>
      )}
      
      {/* Value Estimation Section */}
      {valueEstimation && (
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
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Recent Auction Results
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction House</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {valueEstimation.auctionResults.slice(0, 5).map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${result.price.toLocaleString()} {result.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.house}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
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
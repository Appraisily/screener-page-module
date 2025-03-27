import React, { useState, useEffect } from 'react';
import { DollarSign, Search, MapPin, User, Clock, Building2, BarChart3, ArrowRight } from 'lucide-react';
import { useValueEstimation } from '../hooks/useValueEstimation';
import { useAuctionData } from '../hooks/useAuctionData';
import AuctionInsights from './AuctionInsights';
import AuctionResultsList from './AuctionResultsList';

interface AnalysisData {
  concise_description: string;
  maker_analysis: {
    creator_name: string;
    reasoning: string;
  };
  signature_check: {
    signature_text: string;
    interpretation: string;
  };
  origin_analysis: {
    likely_origin: string;
    reasoning: string;
  };
  marks_recognition: {
    marks_identified: string;
    interpretation: string;
  };
  age_analysis: {
    estimated_date_range: string;
    reasoning: string;
  };
  visual_search: {
    similar_artworks: string;
    notes: string;
  };
}

interface DetailedAnalysisReportProps {
  sessionId: string | null;
  imageUrl: string;
  data: AnalysisData | null;
  onValueEstimated?: (result: any) => void;
}

const DetailedAnalysisReport: React.FC<DetailedAnalysisReportProps> = ({
  sessionId,
  imageUrl,
  data,
  onValueEstimated
}) => {
  const {
    getValueEstimation,
    isLoading: isCalculatingValue,
    result: valueResult,
    error: valueError
  } = useValueEstimation(import.meta.env.VITE_API_URL);

  const handleGetValueEstimate = async () => {
    if (!sessionId) return;
    
    try {
      const result = await getValueEstimation(sessionId);
      if (result) {
        onValueEstimated?.(result);
      }
    } catch (err) {
      console.error('Failed to get value estimation:', err);
    }
  };

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <p className="text-gray-600">Analysis data is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header - Modern premium gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-center p-6">
        <img
          src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png"
          alt="Appraisily Logo"
          className="w-20 h-20 mx-auto mb-2 bg-white p-2 rounded-xl shadow-md"
        />
        <h3 className="text-2xl font-bold text-white">SCREENER Analysis</h3>
        <p className="text-blue-100 mt-1">AI-Powered Artifact Analysis</p>
        {sessionId && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-blue-100">Session ID:</span>
            <code className="text-sm font-mono text-white">{sessionId}</code>
          </div>
        )}
      </div>

      {/* Image display with better framing */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg border border-gray-200 shadow-inner bg-gray-50">
          <img
            src={imageUrl}
            alt={data?.concise_description || "Uploaded image"}
            className="w-full h-full object-contain"
          />
        </div>
        {data?.concise_description && (
          <p className="text-center mt-4 text-gray-700 font-medium">{data.concise_description}</p>
        )}
      </div>

      {/* Quick Stats in cards with gradient accents */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Creator</p>
                <p className="font-semibold text-gray-900 text-lg">{data.maker_analysis.creator_name}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Origin</p>
                <p className="font-semibold text-gray-900 text-lg">{data.origin_analysis.likely_origin}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Period</p>
                <p className="font-semibold text-gray-900 text-lg">{data.age_analysis.estimated_date_range}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis - enhanced with better cards */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Detailed Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Maker Analysis */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Maker Analysis
              </h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700">{data.maker_analysis.reasoning}</p>
            </div>
          </div>

          {/* Origin Analysis */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Origin Analysis
              </h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700">{data.origin_analysis.reasoning}</p>
            </div>
          </div>

          {/* Age Analysis */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Age Analysis
              </h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700">{data.age_analysis.reasoning}</p>
            </div>
          </div>

          {/* Visual Search */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Search className="w-5 h-5" />
                Visual Analysis
              </h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700">{data.visual_search.notes}</p>
              {data.visual_search.similar_artworks && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Similar artworks:</span> {data.visual_search.similar_artworks}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Get Value Estimate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGetValueEstimate}
            disabled={isCalculatingValue}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg
                     hover:from-blue-700 hover:to-blue-800 transition-colors duration-200 font-semibold shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculatingValue ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gathering Auction Data...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Get Appraisal Insights
              </>
            )}
          </button>
        </div>
        
        {valueError && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600">{valueError}</p>
          </div>
        )}

        {valueResult && valueResult.auctionResults && valueResult.auctionResults.length > 0 && (
          <div className="mt-6">
            <AuctionInsights
              results={valueResult.auctionResults.map(result => ({
                title: result.title,
                price: {
                  amount: typeof result.price === 'number' ? result.price : result.price.amount,
                  currency: typeof result.price === 'number' ? result.currency : result.price.currency,
                  symbol: typeof result.price === 'number' ? '$' : result.price.symbol
                },
                auctionHouse: result.house,
                date: result.date,
                lotNumber: '',
                saleType: 'Auction'
              }))}
              minValue={valueResult.minValue}
              maxValue={valueResult.maxValue}
              mostLikelyValue={valueResult.mostLikelyValue}
              explanation={valueResult.explanation}
              onViewMoreClick={() => {
                // Handle premium upgrade
                window.open('https://www.appraisily.com/premium', '_blank');
              }}
            />
          </div>
        )}
        
        {valueResult && (!valueResult.auctionResults || valueResult.auctionResults.length === 0) && (
          <div className="mt-6 space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Value Estimation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Range</p>
                  <p className="text-xl font-bold text-[#007bff]">
                    ${valueResult.minValue.toLocaleString()} - ${valueResult.maxValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Most Likely</p>
                  <p className="text-xl font-bold text-[#007bff]">
                    ${valueResult.mostLikelyValue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-gray-700">{valueResult.explanation}</p>
              </div>
              
              {/* Message when no auction results are available */}
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Additional Market Data Available</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Upgrade to Premium for access to auction results, market trends, and more detailed insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedAnalysisReport;
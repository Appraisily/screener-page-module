import React, { useState, useEffect } from 'react';
import { DollarSign, Search, MapPin, User, Clock, Building2, BarChart3 } from 'lucide-react';
import { useValueEstimation } from '../hooks/useValueEstimation';
import { useAuctionData } from '../hooks/useAuctionData';
import AuctionResults from './AuctionResults';
import AuctionResultsList from './AuctionResultsList';
import AuctionDataPreview from './AuctionDataPreview';

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
      {/* Header */}
      <div className="p-6 border-b border-gray-100 text-center">
        <img
          src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png"
          alt="Appraisily Logo"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
        {sessionId && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Session ID:</span>
            <code className="text-sm font-mono text-[#007bff]">{sessionId}</code>
          </div>
        )}
      </div>

      {/* Uploaded Image */}
      <div className="aspect-[4/3] w-full relative overflow-hidden border-b border-gray-100">
        <img
          src={imageUrl}
          alt={data.concise_description}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-[#007bff]" />
          <div>
            <p className="text-sm text-gray-600">Creator</p>
            <p className="font-semibold text-gray-900">{data.maker_analysis.creator_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-[#007bff]" />
          <div>
            <p className="text-sm text-gray-600">Origin</p>
            <p className="font-semibold text-gray-900">{data.origin_analysis.likely_origin}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-[#007bff]" />
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="font-semibold text-gray-900">{data.age_analysis.estimated_date_range}</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="p-6 space-y-6">
        {/* Maker Analysis */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Maker Analysis</h4>
          <p className="text-gray-600">{data.maker_analysis.reasoning}</p>
        </div>

        {/* Origin Analysis */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Origin Analysis</h4>
          <p className="text-gray-600">{data.origin_analysis.reasoning}</p>
        </div>

        {/* Age Analysis */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Age Analysis</h4>
          <p className="text-gray-600">{data.age_analysis.reasoning}</p>
        </div>

        {/* Visual Search */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Visual Analysis</h4>
          <p className="text-gray-600">{data.visual_search.notes}</p>
          {data.visual_search.similar_artworks && (
            <p className="text-gray-600 mt-2">
              Similar artworks: {data.visual_search.similar_artworks}
            </p>
          )}
        </div>

        {/* Get Value Estimate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGetValueEstimate}
            disabled={isCalculatingValue}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#007bff] text-white rounded-lg
                     hover:bg-[#007bff]/90 transition-colors duration-200 font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculatingValue ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating Value...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Get Value Estimate
              </>
            )}
          </button>
        </div>
        
        {valueError && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600">{valueError}</p>
          </div>
        )}

        {valueResult && (
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
            </div>
            
            {/* Auction market data visualization */}
            {valueResult.auctionResults && valueResult.auctionResults.length > 0 && (
              <AuctionResults 
                results={valueResult.auctionResults.map(result => ({
                  title: result.title,
                  price: result.price,
                  currency: result.currency,
                  house: result.house,
                  date: result.date,
                  description: result.description
                }))}
                minValue={valueResult.minValue}
                maxValue={valueResult.maxValue}
                mostLikelyValue={valueResult.mostLikelyValue}
              />
            )}
            
            {/* Auction results list */}
            {valueResult.auctionResults && valueResult.auctionResults.length > 0 && (
              <AuctionDataPreview
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
                limitPreview={2}
                title="Comparable Items Sold at Auction"
                onUpgradeClick={() => {
                  // Here you'd handle the premium upgrade flow
                  window.open('https://www.appraisily.com/premium', '_blank');
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedAnalysisReport;
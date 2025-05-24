import React, { useState, useEffect } from 'react';
import { DollarSign, Search, MapPin, User, Clock, Building2, BarChart3, ArrowRight, Shield } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-elegant border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Analysis data is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-elegant border border-gray-200 overflow-hidden">
      {/* Header - Professional clean design */}
      <div className="bg-gray-900 text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-white p-3 rounded-xl shadow-sm">
          <img
            src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png"
            alt="Appraisily Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Professional Analysis Report</h3>
        <p className="text-gray-300">Expert Art & Antique Assessment</p>
        {sessionId && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Shield className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300">Report ID:</span>
            <code className="text-sm font-mono text-white">{sessionId}</code>
          </div>
        )}
      </div>

      {/* Image display with professional framing */}
      <div className="bg-gray-50 p-8 border-b border-gray-200">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl border border-gray-300 shadow-sm bg-white">
          <img
            src={imageUrl}
            alt={data?.concise_description || "Analyzed artwork"}
            className="w-full h-full object-contain"
          />
        </div>
        {data?.concise_description && (
          <p className="text-center mt-4 text-gray-700 font-medium text-lg">{data.concise_description}</p>
        )}
      </div>

      {/* Key findings - elegant card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 bg-white">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Attribution</p>
                <p className="font-semibold text-gray-900">{data.maker_analysis.creator_name}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Origin</p>
                <p className="font-semibold text-gray-900">{data.origin_analysis.likely_origin}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Period</p>
                <p className="font-semibold text-gray-900">{data.age_analysis.estimated_date_range}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis - professional card layout */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Detailed Assessment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attribution Analysis */}
          <div className="card">
            <div className="card-header">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" />
                Attribution Analysis
              </h4>
            </div>
            <div className="card-body">
              <p className="text-gray-700 leading-relaxed">{data.maker_analysis.reasoning}</p>
            </div>
          </div>

          {/* Origin Analysis */}
          <div className="card">
            <div className="card-header">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-700" />
                Origin Assessment
              </h4>
            </div>
            <div className="card-body">
              <p className="text-gray-700 leading-relaxed">{data.origin_analysis.reasoning}</p>
            </div>
          </div>

          {/* Period Analysis */}
          <div className="card">
            <div className="card-header">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-700" />
                Period Assessment
              </h4>
            </div>
            <div className="card-body">
              <p className="text-gray-700 leading-relaxed">{data.age_analysis.reasoning}</p>
            </div>
          </div>

          {/* Visual Analysis */}
          <div className="card">
            <div className="card-header">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-700" />
                Visual Assessment
              </h4>
            </div>
            <div className="card-body">
              <p className="text-gray-700 leading-relaxed">{data.visual_search.notes}</p>
              {data.visual_search.similar_artworks && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Similar works:</span> {data.visual_search.similar_artworks}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Value Estimation CTA */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGetValueEstimate}
            disabled={isCalculatingValue}
            className="btn-primary group"
          >
            {isCalculatingValue ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gathering Market Data...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Get Market Insights
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
        
        {valueError && (
          <div className="mt-6 p-4 bg-error-50 rounded-lg border border-error-200">
            <p className="text-sm text-error-700">{valueError}</p>
          </div>
        )}

        {valueResult && valueResult.auctionResults && valueResult.auctionResults.length > 0 && (
          <div className="mt-8">
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
                window.open('https://www.appraisily.com/premium', '_blank');
              }}
            />
          </div>
        )}
        
        {valueResult && (!valueResult.auctionResults || valueResult.auctionResults.length === 0) && (
          <div className="mt-8 space-y-6">
            <div className="card">
              <div className="card-header">
                <h4 className="text-lg font-semibold text-gray-900">Market Assessment</h4>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Estimated Range</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${valueResult.minValue.toLocaleString()} - ${valueResult.maxValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Most Likely Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${valueResult.mostLikelyValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">High</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{valueResult.explanation}</p>
                </div>
                
                {/* Premium upgrade prompt */}
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Enhanced Market Analysis Available</h4>
                      <p className="text-gray-300 text-sm">
                        Access detailed auction records, price trends, and comprehensive market data with our professional service.
                      </p>
                    </div>
                    <button 
                      onClick={() => window.open('https://www.appraisily.com/premium', '_blank')}
                      className="btn-secondary text-gray-900 bg-white hover:bg-gray-100"
                    >
                      Learn More
                    </button>
                  </div>
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
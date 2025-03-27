import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, ShoppingBag, BarChart3, DollarSign, AlertTriangle, Clock, Info } from 'lucide-react';

export interface AuctionResult {
  title: string;
  price: {
    amount: number;
    currency: string;
    symbol: string;
  };
  auctionHouse: string;
  date: string;
  lotNumber: string;
  saleType: string;
  imageUrl?: string;
  relevanceScore?: number;
  adjustmentFactor?: number;
}

interface AuctionInsightsProps {
  results: AuctionResult[];
  minValue: number;
  maxValue: number;
  mostLikelyValue: number;
  explanation?: string;
  className?: string;
  onViewMoreClick?: () => void;
  confidenceLevel?: number;
  marketTrend?: 'rising' | 'stable' | 'declining';
}

const AuctionInsights: React.FC<AuctionInsightsProps> = ({
  results,
  minValue,
  maxValue,
  mostLikelyValue,
  explanation,
  className = '',
  onViewMoreClick,
  confidenceLevel = 85,
  marketTrend = 'stable'
}) => {
  // Process results data
  const totalResults = results.length;
  const avgPrice = results.reduce((sum, r) => sum + r.price.amount, 0) / totalResults;
  const medianPrice = [...results]
    .sort((a, b) => a.price.amount - b.price.amount)[Math.floor(results.length / 2)]?.price.amount;
  
  // Find highest and lowest items
  const highestItem = [...results].sort((a, b) => b.price.amount - a.price.amount)[0];
  const lowestItem = [...results].sort((a, b) => a.price.amount - b.price.amount)[0];
  
  // Extract auction houses
  const auctionHouses = [...new Set(results.map(r => r.auctionHouse))];
  
  // Timeframe calculation
  const dates = results.map(r => new Date(r.date).getTime()).sort();
  const oldestDate = new Date(dates[0]);
  const newestDate = new Date(dates[dates.length - 1]);
  const monthsDiff = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 + 
                     (newestDate.getMonth() - oldestDate.getMonth());
  
  // Calculate market tendency
  const chronologicalResults = [...results]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstHalf = chronologicalResults.slice(0, Math.ceil(chronologicalResults.length / 2));
  const secondHalf = chronologicalResults.slice(Math.ceil(chronologicalResults.length / 2));
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.price.amount, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.price.amount, 0) / secondHalf.length;
  const marketTrend = secondHalfAvg > firstHalfAvg * 1.1 
    ? 'rising' 
    : secondHalfAvg < firstHalfAvg * 0.9 
      ? 'falling' 
      : 'stable';

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h2 className="text-xl font-bold">Appraisal Insights</h2>
        <p className="text-blue-100 mt-1">Based on real auction market data</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Estimated Value</p>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold text-white">${mostLikelyValue.toLocaleString()}</span>
              <span className="text-blue-200 text-sm ml-1.5">most likely</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Value Range</p>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold text-white">${minValue.toLocaleString()} - ${maxValue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Auction Data</p>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold text-white">{totalResults}</span>
              <span className="text-blue-200 text-sm ml-1.5">comparable sales</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Show confidence level gauge */}
        {confidenceLevel && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Appraisal Confidence</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                confidenceLevel >= 90 ? 'bg-green-100 text-green-800' :
                confidenceLevel >= 70 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {confidenceLevel >= 90 ? 'High Confidence' :
                 confidenceLevel >= 70 ? 'Medium Confidence' :
                 'Limited Confidence'}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {confidenceLevel}% confidence
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${confidenceLevel}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    confidenceLevel >= 90 ? 'bg-green-500' :
                    confidenceLevel >= 70 ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-600">
                Based on the quality and relevance of auction data available for this item.
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Market summary */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Market Summary</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  marketTrend === 'rising' 
                    ? 'bg-green-100 text-green-800' 
                    : marketTrend === 'declining' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {marketTrend === 'rising' ? 'Rising Market' : marketTrend === 'declining' ? 'Declining Market' : 'Stable Market'}
                </span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Sale Price</p>
                    <p className="text-lg font-semibold text-gray-900">${Math.round(avgPrice).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Highest Sale</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${highestItem?.price.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {highestItem?.auctionHouse}, {new Date(highestItem?.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Auction Houses</p>
                    <p className="text-lg font-semibold text-gray-900">{auctionHouses.length}</p>
                    <p className="text-xs text-gray-500">
                      {auctionHouses.slice(0, 2).join(', ')}
                      {auctionHouses.length > 2 ? ` and ${auctionHouses.length - 2} more` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Distribution */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Price Distribution</h3>
                </div>
              </div>
              <div className="p-4">
                {/* Price range bar chart */}
                <div className="mt-4 space-y-4">
                  {/* Your item value marker */}
                  <div className="relative mb-8">
                    <div className="absolute left-0 right-0 h-6 bg-gray-100 rounded-full"></div>
                    <div 
                      className="absolute left-0 h-6 bg-blue-100 rounded-full"
                      style={{ 
                        width: `${((maxValue - minValue) / maxValue) * 100}%`,
                        left: `${(minValue / maxValue) * 100}%`
                      }}
                    ></div>
                    <div 
                      className="absolute top-0 w-2 h-6 bg-green-500 rounded-full"
                      style={{ left: `${(mostLikelyValue / maxValue) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-full mt-1 text-xs font-medium text-gray-600 transform -translate-x-1/2"
                      style={{ left: `${(minValue / maxValue) * 100}%` }}
                    >
                      ${minValue.toLocaleString()}
                    </div>
                    <div 
                      className="absolute top-full mt-1 text-xs font-medium text-gray-600 transform -translate-x-1/2"
                      style={{ left: `${(maxValue / maxValue) * 100}%` }}
                    >
                      ${maxValue.toLocaleString()}
                    </div>
                    <div 
                      className="absolute top-full mt-1 text-xs font-medium text-green-600 transform -translate-x-1/2"
                      style={{ left: `${(mostLikelyValue / maxValue) * 100}%` }}
                    >
                      ${mostLikelyValue.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Auction result dots */}
                  <div className="relative h-8 mb-2">
                    <div className="absolute left-0 right-0 bottom-0 h-2 bg-gray-100 rounded-full"></div>
                    {results.map((result, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="absolute bottom-0 w-1.5 h-1.5 bg-blue-500 rounded-full transform -translate-x-1/2"
                        style={{ left: `${(result.price.amount / maxValue) * 100}%` }}
                      />
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Each dot represents an auction result. Your estimated value is shown in green.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Appraisal Explanation */}
            {explanation && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Expert Insights</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700">{explanation}</p>
                </div>
              </div>
            )}
            
            {/* Recent Comparable Sales */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Comparable Sales</h3>
                </div>
                <span className="text-xs text-gray-500">
                  Past {monthsDiff > 0 ? `${monthsDiff} months` : 'month'}
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {results.slice(0, 3).map((result, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{result.title}</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span className="font-medium">{result.price.symbol}{result.price.amount.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-500">{result.auctionHouse}</div>
                      <div className="text-gray-500 col-span-2 text-xs mt-1">
                        {new Date(result.date).toLocaleDateString()} • {result.saleType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {results.length > 3 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <button 
                    onClick={onViewMoreClick}
                    className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    View {results.length - 3} More Results
                  </button>
                </div>
              )}
            </div>
            
            {/* Market Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 text-sm">Market Advisory</h4>
                <p className="text-amber-700 text-xs mt-1">
                  This appraisal insight is based on historical auction data and should be used as a reference only.
                  For insurance, estate planning, or sale purposes, please consult a professional appraiser.
                </p>
              </div>
            </div>
            
            {/* Upgrade button for premium */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-indigo-900">Unlock Premium Insights</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    Get in-depth price trends, market analysis, and more
                  </p>
                </div>
              </div>
              <button
                onClick={onViewMoreClick}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionInsights;
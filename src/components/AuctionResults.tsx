import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Info } from 'lucide-react';

interface AuctionResult {
  title: string;
  price: number;
  currency: string;
  house: string;
  date: string;
  description?: string;
}

interface AuctionResultsProps {
  results: AuctionResult[];
  minValue: number;
  maxValue: number;
  mostLikelyValue: number;
}

const AuctionResults: React.FC<AuctionResultsProps> = ({
  results,
  minValue,
  maxValue,
  mostLikelyValue
}) => {
  // Calculate distribution data for price histogram
  const calculatePriceDistribution = () => {
    if (!results.length) return [];
    
    // Find min and max from actual results
    const prices = results.map(r => r.price);
    const dataMin = Math.min(...prices);
    const dataMax = Math.max(...prices);
    
    // Create 5 price buckets
    const bucketSize = (dataMax - dataMin) / 5;
    const buckets = Array(5).fill(0);
    
    // Count items in each bucket
    results.forEach(result => {
      const bucketIndex = Math.min(
        Math.floor((result.price - dataMin) / bucketSize),
        buckets.length - 1
      );
      buckets[bucketIndex]++;
    });
    
    // Find the highest count for scaling
    const maxCount = Math.max(...buckets);
    
    // Return data points with bucket ranges
    return buckets.map((count, i) => {
      const startPrice = Math.round(dataMin + (i * bucketSize));
      const endPrice = Math.round(dataMin + ((i + 1) * bucketSize));
      return {
        range: `$${startPrice.toLocaleString()} - $${endPrice.toLocaleString()}`,
        count,
        percentage: maxCount ? (count / maxCount) * 100 : 0
      };
    });
  };
  
  const priceDistribution = calculatePriceDistribution();
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Market Analysis
        </h3>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Value Range</h4>
            <p className="text-xl font-bold text-blue-600">
              ${minValue.toLocaleString()} - ${maxValue.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Most Likely Value</h4>
            <p className="text-xl font-bold text-green-600">
              ${mostLikelyValue.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Auction Results</h4>
            <p className="text-xl font-bold text-gray-700">
              {results.length} <span className="text-sm font-normal">comparable items</span>
            </p>
          </div>
        </div>
        
        {priceDistribution.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Price Distribution
              </h4>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Based on {results.length} auction results
              </div>
            </div>
            
            <div className="space-y-2">
              {priceDistribution.map((bucket, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{bucket.range}</span>
                    <span>{bucket.count} {bucket.count === 1 ? 'item' : 'items'}</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bucket.percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        bucket.percentage > 75 
                          ? 'bg-blue-500' 
                          : bucket.percentage > 50
                            ? 'bg-blue-400'
                            : bucket.percentage > 25
                              ? 'bg-blue-300'
                              : 'bg-blue-200'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-blue-500" />
            Value Indicators
          </h4>
          
          <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden mb-2">
            {/* Min-max range bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-100"
              style={{ 
                left: `${(minValue / maxValue) * 100}%`, 
                width: `${((maxValue - minValue) / maxValue) * 100}%` 
              }}
            />
            
            {/* Most likely value marker */}
            <div 
              className="absolute top-0 h-full w-1 bg-green-500"
              style={{ left: `${(mostLikelyValue / maxValue) * 100}%` }}
            />
            
            {/* Price markers for auction results */}
            {results.map((result, i) => (
              <div 
                key={i}
                className="absolute bottom-0 w-0.5 h-1/2 bg-blue-400 opacity-50"
                style={{ left: `${(result.price / maxValue) * 100}%` }}
              />
            ))}
            
            {/* Labels */}
            <div className="absolute top-2 left-2 text-xs font-medium text-gray-600">
              ${minValue.toLocaleString()}
            </div>
            <div className="absolute top-2 right-2 text-xs font-medium text-gray-600">
              ${maxValue.toLocaleString()}
            </div>
            <div 
              className="absolute bottom-2 text-xs font-medium text-green-600"
              style={{ left: `${(mostLikelyValue / maxValue) * 100}%`, transform: 'translateX(-50%)' }}
            >
              ${mostLikelyValue.toLocaleString()}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            This visualization shows where your item's estimated value falls within the market range. 
            Each vertical line represents a comparable auction result, with the green line indicating 
            your item's most likely value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionResults;
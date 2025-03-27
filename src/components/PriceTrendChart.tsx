import React, { useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

// Define the type for auction results
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
}

interface PriceTrendChartProps {
  results: AuctionResult[];
  className?: string;
  title?: string;
  height?: number;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  results,
  className = '',
  title = 'Price Trends Over Time',
  height = 220,
}) => {
  // Process the data to create time-sorted price points
  const { 
    dataPoints, 
    minPrice, 
    maxPrice, 
    avgPrice, 
    earliestDate, 
    latestDate,
    trendDirection 
  } = useMemo(() => {
    if (!results || !results.length) {
      return { 
        dataPoints: [], 
        minPrice: 0, 
        maxPrice: 0, 
        avgPrice: 0, 
        earliestDate: '', 
        latestDate: '',
        trendDirection: 'stable' 
      };
    }
    
    // Convert string dates to timestamps and sort by date
    const pointsWithDates = results.map(result => {
      const dateObj = new Date(result.date);
      return {
        date: dateObj,
        timestamp: dateObj.getTime(),
        price: result.price.amount,
        title: result.title
      };
    }).sort((a, b) => a.timestamp - b.timestamp);
    
    // Extract values for display
    const prices = pointsWithDates.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Get date range
    const earliest = pointsWithDates[0].date.toLocaleDateString();
    const latest = pointsWithDates[pointsWithDates.length - 1].date.toLocaleDateString();
    
    // Calculate trend direction
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (pointsWithDates.length > 1) {
      // Get first 25% and last 25% of points
      const firstQuarter = pointsWithDates.slice(0, Math.max(1, Math.floor(pointsWithDates.length / 4)));
      const lastQuarter = pointsWithDates.slice(-Math.max(1, Math.floor(pointsWithDates.length / 4)));
      
      // Calculate averages
      const firstAvg = firstQuarter.reduce((sum, p) => sum + p.price, 0) / firstQuarter.length;
      const lastAvg = lastQuarter.reduce((sum, p) => sum + p.price, 0) / lastQuarter.length;
      
      // Determine trend direction
      const changePercent = (lastAvg - firstAvg) / firstAvg;
      
      if (changePercent > 0.1) {
        trend = 'up';
      } else if (changePercent < -0.1) {
        trend = 'down';
      }
    }
    
    return { 
      dataPoints: pointsWithDates, 
      minPrice: min, 
      maxPrice: max, 
      avgPrice: avg,
      earliestDate: earliest,
      latestDate: latest,
      trendDirection: trend
    };
  }, [results]);
  
  // If no data, don't render
  if (!results || !results.length) {
    return null;
  }
  
  // Chart dimensions
  const paddingX = 40;  // padding on left and right
  const paddingY = 40;  // padding on top and bottom
  const chartWidth = 600;
  const chartHeight = height;
  const plotWidth = chartWidth - (paddingX * 2);
  const plotHeight = chartHeight - (paddingY * 2);
  
  // Function to map price to y-coordinate
  const priceToY = (price: number) => {
    const rangeAdjustment = maxPrice - minPrice || 1;
    return paddingY + plotHeight - ((price - minPrice) / rangeAdjustment * plotHeight);
  };
  
  // Function to map date to x-coordinate
  const timestampToX = (timestamp: number) => {
    const first = dataPoints[0].timestamp;
    const last = dataPoints[dataPoints.length - 1].timestamp;
    const rangeAdjustment = last - first || 1;
    return paddingX + ((timestamp - first) / rangeAdjustment * plotWidth);
  };
  
  // Calculate points for SVG polyline
  const polylinePoints = dataPoints.map(
    point => `${timestampToX(point.timestamp)},${priceToY(point.price)}`
  ).join(' ');
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-5 h-5 ${
            trendDirection === 'up' ? 'text-green-500' : 
            trendDirection === 'down' ? 'text-red-500' : 
            'text-blue-500'
          }`} />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {earliestDate} — {latestDate}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="px-3 py-1.5 bg-blue-50 rounded-full flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Average: ${Math.round(avgPrice).toLocaleString()}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
            trendDirection === 'up' ? 'bg-green-50 text-green-700' : 
            trendDirection === 'down' ? 'bg-red-50 text-red-700' : 
            'bg-gray-50 text-gray-700'
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${
              trendDirection === 'up' ? 'text-green-600' : 
              trendDirection === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`} />
            <span className="text-xs font-medium">
              {trendDirection === 'up' ? 'Upward Trend' : 
               trendDirection === 'down' ? 'Downward Trend' : 
               'Stable Prices'}
            </span>
          </div>
        </div>
        
        {/* SVG Chart */}
        <div className="mt-4 overflow-x-auto">
          <svg
            width={chartWidth}
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="mx-auto"
          >
            {/* X-axis */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            
            {/* Y-axis */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={paddingX}
              y2={chartHeight - paddingY}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75].map((ratio, i) => {
              const y = priceToY(minPrice + (maxPrice - minPrice) * ratio);
              return (
                <line
                  key={`grid-h-${i}`}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="4"
                />
              );
            })}
            
            {/* Price labels */}
            <text
              x={paddingX - 5}
              y={chartHeight - paddingY + 15}
              textAnchor="end"
              fontSize={10}
              fill="#6b7280"
            >
              ${Math.round(minPrice).toLocaleString()}
            </text>
            <text
              x={paddingX - 5}
              y={paddingY + 5}
              textAnchor="end"
              fontSize={10}
              fill="#6b7280"
            >
              ${Math.round(maxPrice).toLocaleString()}
            </text>
            
            {/* Price trend line */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={
                trendDirection === 'up' ? '#10b981' : 
                trendDirection === 'down' ? '#ef4444' : 
                '#3b82f6'
              }
              strokeWidth={2}
            />
            
            {/* Data points */}
            {dataPoints.map((point, i) => (
              <circle
                key={`point-${i}`}
                cx={timestampToX(point.timestamp)}
                cy={priceToY(point.price)}
                r={4}
                fill="white"
                stroke={
                  trendDirection === 'up' ? '#10b981' : 
                  trendDirection === 'down' ? '#ef4444' : 
                  '#3b82f6'
                }
                strokeWidth={2}
              />
            ))}
          </svg>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          This chart shows price trends for similar items sold at auction over time.
          {trendDirection === 'up' && ' Prices show an upward trend, suggesting increasing market value.'}
          {trendDirection === 'down' && ' Prices show a downward trend, which may indicate decreasing market value.'}
          {trendDirection === 'stable' && ' Prices appear relatively stable over this time period.'}
        </p>
      </div>
    </div>
  );
};

export default PriceTrendChart;
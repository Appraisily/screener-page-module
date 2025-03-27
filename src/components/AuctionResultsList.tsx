import React, { useState } from 'react';
import { DollarSign, Calendar, Building, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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
}

interface AuctionResultsListProps {
  results: AuctionResult[];
  title?: string;
  showTitle?: boolean;
  maxVisible?: number;
  showViewMoreButton?: boolean;
  onViewMoreClick?: () => void;
  className?: string;
  isPremium?: boolean;
}

const AuctionResultsList: React.FC<AuctionResultsListProps> = ({
  results,
  title = 'Recent Auction Results',
  showTitle = true,
  maxVisible = 3,
  showViewMoreButton = true,
  onViewMoreClick,
  className = '',
  isPremium = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleResults = expanded ? results : results.slice(0, maxVisible);
  const hasMore = results.length > maxVisible;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      {showTitle && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {visibleResults.length} of {results.length} auction results
            </p>
          </div>
          {isPremium && (
            <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Premium
            </span>
          )}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {visibleResults.map((result, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">{result.title}</h4>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900">
                  {result.price.symbol}{result.price.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{result.auctionHouse}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">{result.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-gray-700">{result.saleType || 'Auction'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && showViewMoreButton && (
        <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onViewMoreClick || toggleExpanded}
            className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View {results.length - maxVisible} More Results
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionResultsList;
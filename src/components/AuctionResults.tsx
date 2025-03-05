import React from 'react';
import { Building2, Calendar, DollarSign } from 'lucide-react';

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
}

export default function AuctionResults({ results }: AuctionResultsProps) {
  if (!results.length) return null;

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">Recent Auction Results</h4>
      <div className="grid gap-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100
                     hover:border-[#007bff] transition-all duration-200 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 mb-1 truncate group-hover:text-[#007bff] transition-colors">
                  {result.title}
                </h5>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{result.house}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(result.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {result.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {result.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <DollarSign className="w-5 h-5 text-[#007bff]" />
                {result.price.toLocaleString()} {result.currency}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { DollarSign, LockKeyhole, ChevronRight } from 'lucide-react';
import AuctionResultsList, { AuctionResult } from './AuctionResultsList';

interface AuctionDataPreviewProps {
  results: AuctionResult[];
  limitPreview?: number;
  title?: string;
  onUpgradeClick?: () => void;
  className?: string;
}

const AuctionDataPreview: React.FC<AuctionDataPreviewProps> = ({
  results,
  limitPreview = 2,
  title = 'Similar Items Sold at Auction',
  onUpgradeClick,
  className = '',
}) => {
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);

  if (!results || results.length === 0) {
    return null;
  }

  // Only show a limited number of results in the preview
  const previewResults = results.slice(0, limitPreview);
  const hiddenCount = results.length - limitPreview;

  const handleToggleUpgrade = () => {
    setShowUpgradeOptions(!showUpgradeOptions);
  };

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      setShowUpgradeOptions(false);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {/* Preview auction results */}
      <AuctionResultsList 
        results={previewResults}
        title={title}
        showViewMoreButton={false}
      />

      {/* "View More" section with upgrade CTA */}
      {hiddenCount > 0 && (
        <div className="mt-4 border border-blue-200 rounded-lg overflow-hidden">
          <div 
            className="bg-blue-50 p-4 flex items-center justify-between cursor-pointer"
            onClick={handleToggleUpgrade}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <LockKeyhole className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {hiddenCount} More Auction Results Available
                </h4>
                <p className="text-sm text-gray-600">
                  Unlock complete auction history with Premium
                </p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${showUpgradeOptions ? 'rotate-90' : ''}`} />
          </div>

          {/* Upgrade options panel (hidden by default) */}
          {showUpgradeOptions && (
            <div className="p-4 bg-white">
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Premium Auction Data Includes:</h5>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Complete auction history for similar items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Price trend analysis over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Alerts for upcoming auctions of similar pieces</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={handleUpgradeClick}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Upgrade to Premium - $19.99
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-3">
                Access to all premium features and detailed auction data
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionDataPreview;
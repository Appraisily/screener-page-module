import React from 'react';
import { Search } from 'lucide-react';

const IMAGEKIT_URL = 'https://ik.imagekit.io/appraisily/WebPage';

interface VisualSearchPanelProps {
  onClick: (sessionId?: string) => void;
  isSearching?: boolean;
}

const VisualSearchPanel: React.FC<VisualSearchPanelProps> = ({ onClick, isSearching }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSearching) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-lg border border-gray-100 
                 hover:border-[#007bff] p-6 shadow-sm hover:shadow-lg 
                 transition-all duration-300 relative"
    >
      {isSearching && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#007bff] border-t-transparent rounded-full" />
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={`${IMAGEKIT_URL}/visual?tr=w-64,h-64,q-60`}
            alt="Visual Search"
            className="w-full h-full object-cover transform transition-transform duration-300 
                     group-hover:scale-105"
            loading="lazy"
            width="64"
            height="64"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            Visual Search
            <Search className="h-5 w-5 text-gray-900" aria-hidden="true" />
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Find similar artworks
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualSearchPanel;
import React from 'react';
import { Search, Tag } from 'lucide-react';

interface OpenAIAnalysisProps {
  category: string;
  description: string;
}

const OpenAIAnalysis: React.FC<OpenAIAnalysisProps> = ({ category, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-[#007bff]" />
        <h3 className="text-lg font-semibold text-gray-900">Your Artwork at a Glance</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#007bff]" />
          <span className="text-sm font-medium text-gray-700">AI's Quick Classification:</span>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {category}
          </span>
        </div>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            We've identified this piece as an original artwork—here's a quick snapshot of its style:
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenAIAnalysis;
import React from 'react';
import { Search, Tag, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface OpenAIAnalysisProps {
  category: string;
  description: string;
}

const OpenAIAnalysis: React.FC<OpenAIAnalysisProps> = ({ category, description }) => {
  return (
    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden group">
      {/* Subtle gradient accent border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-80 transform origin-left group-hover:scale-x-100 scale-x-[0.7] transition-transform duration-300"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors">
          <Search className="w-5 h-5 text-primary-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
          <p className="text-sm text-gray-500">Expert assessment powered by AI</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Classification</span>
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2 text-xl font-bold text-white shadow-sm">{category}</div>
          </div>

          <div className="mt-2">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIAnalysis;
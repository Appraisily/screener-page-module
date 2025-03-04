import React from 'react';
import { Search, Tag, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface OpenAIAnalysisProps {
  category: string;
  description: string;
}

const OpenAIAnalysis: React.FC<OpenAIAnalysisProps> = ({ category, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Search className="w-5 h-5 text-gray-900" />
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
            <div className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-xl font-bold text-white">{category}</div>
          </div>

          <div className="mt-2">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
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
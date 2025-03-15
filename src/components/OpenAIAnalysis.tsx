import React from 'react';
import { Search, Tag, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface OpenAIAnalysisProps {
  category: string;
  description: string;
}

const OpenAIAnalysis: React.FC<OpenAIAnalysisProps> = ({ category, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#007bff] transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Search className="w-5 h-5 text-[#007bff]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vision Search Module</h3>
          <p className="text-sm text-gray-500">Initial assessment</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Classification</span>
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-xl font-bold text-blue-700">{category}</div>
          </div>

          <div className="mt-2">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
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
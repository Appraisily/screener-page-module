import React from 'react';
import { Search, Sparkles, Fingerprint, ImageIcon } from 'lucide-react';
import OpenAIAnalysis from './OpenAIAnalysis';
import { cn } from '../lib/utils';

interface WebLabel {
  label: string;
  score: number;
  languages: string[];
}

interface WebEntity {
  entityId: string;
  score: number;
  description: string;
}

interface VisualSearchResults {
  webEntities: WebEntity[];
  description: {
    labels: string[];
    confidence: number;
  },
  openai: {
    category: 'Art' | 'Antique';
    description: string;
  }
  webLabels: WebLabel[];
  derivedSubjects: string[];
  matches?: {
    exact: Array<{url: string; score: number; type: string; metadata: any}>;
    partial: Array<{url: string; score: number; type: string; metadata: any}>;
    similar: Array<{url: string; score: number; type: string; metadata: any}>;
  };
  pagesWithMatchingImages?: Array<any>;
}

interface VisualSearchResultsProps {
  results: VisualSearchResults;
}

const VisualSearchResults: React.FC<VisualSearchResultsProps> = ({ results }) => {
  console.log('VisualSearchResults received:', results);

  return (
    <div className="space-y-6 overflow-x-hidden">
      {results?.openai && (
        <OpenAIAnalysis 
          category={results.openai.category}
          description={results.openai.description}
        />
      )}
      
      {/* Main Analysis Panel */}
      {((results.description?.labels?.length ?? 0) > 0 || (results.webEntities?.length ?? 0) > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#007bff]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key Characteristics</h3>
              <p className="text-sm text-gray-500">These terms and percentages indicate how strongly our module associates each characteristic with your piece, based on visual cues such as shape, color, and texture.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Web Entities */}
            {(results.webEntities?.length ?? 0) > 0 && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(results.webEntities ?? []).map((entity, index) => (
                    <div 
                      key={index}
                      className="relative flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                          <span className="text-sm font-medium text-blue-600">
                            {Math.round(entity.score * 100)}%
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{entity.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Derived Subjects */}
            {(results.derivedSubjects?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Subject Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {(results.derivedSubjects ?? []).map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100/75 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200/50 hover:bg-gray-200/50 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Labels */}
            {(results.description?.labels?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Visual Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {(results.description?.labels ?? []).map((label, index) => (
                    <span
                      key={index}
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
                        "bg-blue-50/50 text-blue-700 border border-blue-200/50",
                        "hover:bg-blue-100/50 transition-colors"
                      )}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Images */}
            {results.matches?.similar && (results.matches.similar?.length ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-[#007bff]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Similar Items Found</h3>
                    <p className="text-sm text-gray-500">Discover pieces that share visual characteristics with your item. These comparisons can provide insights into style, period, and market value.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(results.matches?.similar ?? []).map((match, index) => (
                    <div 
                      key={index}
                      className="relative rounded-xl overflow-hidden aspect-square group hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200"
                    >
                      <img
                        src={match.url}
                        alt={`Similar image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-900">
                            {Math.round(match.score * 100)}% Match
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualSearchResults;
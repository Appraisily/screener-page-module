import React from 'react';
import { Search } from 'lucide-react';
import OpenAIAnalysis from './OpenAIAnalysis';

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
    <div className="space-y-6">
      {results?.openai && (
        <OpenAIAnalysis 
          category={results.openai.category}
          description={results.openai.description}
        />
      )}
      
      {/* Main Analysis Panel */}
      {(results.description?.labels?.length > 0 || results.webEntities?.length > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Vision Analysis</h3>
          </div>
          
          <div className="space-y-6">
            {/* Web Entities */}
            {results.webEntities?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Key Characteristics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.webEntities.map((entity, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">{entity.description}</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(entity.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Derived Subjects */}
            {results.derivedSubjects?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Subject Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {results.derivedSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Labels */}
            {results.description?.labels?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Visual Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {results.description.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Images */}
            {results.matches?.similar?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Similar Artworks Found</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.matches.similar.map((match, index) => (
                    <div 
                      key={index}
                      className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square group hover:shadow-lg transition-all"
                    >
                      <img
                        src={match.url}
                        alt={`Similar image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-3">
                        Similarity: {Math.round(match.score * 100)}%
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
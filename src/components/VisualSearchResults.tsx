import React from 'react';
import { Search, Sparkles, Fingerprint, User, MapPin, Calendar } from 'lucide-react';
import OpenAIAnalysis from './OpenAIAnalysis';
import ServicePanels from './ServicePanels';
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
  metadata: {
    analysisResults: {
      openaiAnalysis: {
        category: 'Art' | 'Antique';
        description: string;
      }
    }
  };
  detailedAnalysis: {
    maker_analysis: {
      creator_name: string;
      reasoning: string;
    };
    origin_analysis: {
      likely_origin: string;
      reasoning: string;
    };
    age_analysis: {
      estimated_date_range: string;
      reasoning: string;
    };
    marks_recognition: {
      marks_identified: string;
      interpretation: string;
    };
    visual_search: {
      similar_artworks: string;
      notes: string;
    };
  };
}

interface VisualSearchResultsProps {
  results: VisualSearchResults;
  sessionId: string;
  onEmailSubmit: (email: string) => Promise<boolean>;
  hasEmailBeenSubmitted: boolean;
}

const VisualSearchResults: React.FC<VisualSearchResultsProps> = ({ 
  results, 
  sessionId, 
  onEmailSubmit,
  hasEmailBeenSubmitted
}) => {

  const { metadata, detailedAnalysis } = results;
  const { analysisResults } = metadata;

  return (
    <div className="space-y-6 overflow-x-hidden">
      {analysisResults?.openaiAnalysis && (
        <OpenAIAnalysis 
          category={analysisResults.openaiAnalysis.category}
          description={analysisResults.openaiAnalysis.description}
        />
      )}
      
      {/* Detailed Analysis Sections */}
      {detailedAnalysis && (
        <div className="space-y-8">
          <div className="text-center opacity-60 hover:opacity-100 transition-opacity duration-200">
            <p className="text-sm uppercase tracking-wider text-gray-500 font-medium">
              Detailed Analysis
            </p>
            <div className="w-12 h-0.5 bg-gray-200 mx-auto mt-2" />
          </div>
          
          <div>
            <ServicePanels 
              analysis={detailedAnalysis} 
              sessionId={sessionId}
              onEmailSubmit={onEmailSubmit}
              hasEmailBeenSubmitted={hasEmailBeenSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualSearchResults;
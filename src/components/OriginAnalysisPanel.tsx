import React from 'react';
import { MapPin, Star, Fingerprint, Sparkles, AlertCircle } from 'lucide-react';

const IMAGEKIT_URL = 'https://ik.imagekit.io/appraisily/WebPage';

interface OriginAnalysisResult {
  originality: string;
  confidence: number;
  style_analysis: string;
  unique_characteristics: string[];
  comparison_notes: string;
  recommendation: string;
}

interface OriginAnalysisPanelProps {
  onClick: () => void;
  isAnalyzing?: boolean;
  results?: {
    timestamp: number;
    matches: {
      exact: Array<{url: string; score: number; type: string; metadata: any}>;
      partial: Array<{url: string; score: number; type: string; metadata: any}>;
      similar: Array<{url: string; score: number; type: string; metadata: any}>;
    };
    originAnalysis: OriginAnalysisResult;
    webEntities: Array<{
      entityId: string;
      score: number;
      description: string;
    }>;
    visionLabels: {
      labels: string[];
      confidence: number;
    };
    openaiAnalysis: {
      category: string;
      description: string;
    };
  };
}

const OriginAnalysisPanel: React.FC<OriginAnalysisPanelProps> = ({ 
  onClick, 
  isAnalyzing = false,
  results
}) => {
  const handleClick = () => {
    console.log('[Origin Analysis] Panel clicked', {
      isAnalyzing,
      hasResults: !!results
    });
    if (!isAnalyzing) {
      onClick();
    }
  };

  const renderConfidenceBar = (confidence: number) => {
    const percentage = confidence * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div 
          className="bg-gray-900 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const renderSimilarImages = (matches: any) => {
    if (!matches?.similar?.length) return null;
    
    return (
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Similar Artworks Found</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {matches.similar.slice(0, 6).map((match: any, index: number) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={match.url}
                alt={`Similar artwork ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                {Math.round(match.score * 100)}% match
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden
                  transition-all duration-300">
      <div 
        onClick={handleClick}
        className={`relative p-6 cursor-pointer border-b ${
          isAnalyzing ? 'border-gray-900' : 'border-gray-100 hover:border-gray-900'
        }`}
      >
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Analyzing origin...</p>
            </div>
          </div>
        )}
        <div className="relative z-0">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={`${IMAGEKIT_URL}/origin?tr=w-64,h-64,q-60`}
                alt="Origin Analysis"
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
                Origin Analysis
                <MapPin className="h-5 w-5 text-gray-900" aria-hidden="true" />
                {isAnalyzing && (
                  <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-r-transparent"></span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isAnalyzing ? 'Analyzing artwork origin...' : 'Determine likely origin'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Results Section */}
      {results?.originAnalysis && (
        <div className="border-t border-gray-100">
          <div className="p-6 space-y-8">
            {/* OpenAI Analysis */}
            {results.openaiAnalysis && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-gray-900" />
                  <h4 className="font-medium text-gray-900">AI Analysis</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.openaiAnalysis.description}
                </p>
              </div>
            )}

            {/* Originality Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-900" />
                  <h4 className="font-medium text-gray-900">Originality Assessment</h4>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(results.originAnalysis.confidence * 100)}% Confidence
                </span>
              </div>
              {renderConfidenceBar(results.originAnalysis.confidence)}
              <p className="mt-2 text-sm text-gray-600">
                Classification: <span className="font-medium">{results.originAnalysis.originality}</span>
              </p>
            </div>

            {/* Style Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-gray-900" />
                <h4 className="font-medium text-gray-900">Style Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {results.originAnalysis.style_analysis}
              </p>
            </div>

            {/* Unique Characteristics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint className="w-5 h-5 text-gray-900" />
                <h4 className="font-medium text-gray-900">Unique Characteristics</h4>
              </div>
              <ul className="space-y-2">
                {results.originAnalysis.unique_characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 flex-shrink-0" />
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison Notes */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-gray-900" />
                <h4 className="font-medium text-gray-900">Analysis Notes</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {results.originAnalysis.comparison_notes}
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
              <p className="text-sm text-gray-700">
                {results.originAnalysis.recommendation}
              </p>
            </div>

            {renderSimilarImages(results.matches)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OriginAnalysisPanel;
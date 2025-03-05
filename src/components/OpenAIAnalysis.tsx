import React from 'react';
import { Search, User, Palette, Layout, File, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import { OpenAIAnalysisResults } from '../types';

interface OpenAIAnalysisProps {
  results: OpenAIAnalysisResults;
}

const OpenAIAnalysis: React.FC<OpenAIAnalysisProps> = ({ results }) => {
  if (!results) return null;
  
  const {
    concise_description,
    detailed_analysis,
    artist_identification,
    style_period,
    subject_matter,
    composition,
    color_palette,
    condition_assessment,
    signature_analysis,
    framing_notes,
    provenance_indicators,
    market_relevance,
    additional_observations
  } = results;

  return (
    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden group">
      {/* Subtle gradient accent border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-80 transform origin-left group-hover:scale-x-100 scale-x-[0.7] transition-transform duration-300"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors">
          <Search className="w-5 h-5 text-primary-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expert AI Analysis</h3>
          <p className="text-sm text-gray-500">Comprehensive assessment powered by AI</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Concise Description */}
        {concise_description && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <p className="text-gray-800">{concise_description}</p>
          </div>
        )}
        
        {/* Artist Identification */}
        {artist_identification && (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-700" />
              <h4 className="font-medium text-gray-900">Artist Analysis</h4>
            </div>
            <div className="pl-7 space-y-3">
              {artist_identification.artist_name && (
                <div>
                  <span className="text-sm text-gray-600">Potential Artist:</span>
                  <p className="font-medium text-gray-900">{artist_identification.artist_name}</p>
                  {artist_identification.confidence && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full" 
                          style={{ width: `${artist_identification.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(artist_identification.confidence * 100)}% confidence</span>
                    </div>
                  )}
                </div>
              )}
              
              {artist_identification.similar_artists && artist_identification.similar_artists.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Similar Artists:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {artist_identification.similar_artists.map((artist, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Style and Composition */}
        {(style_period || subject_matter || composition) && (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Layout className="w-5 h-5 text-gray-700" />
              <h4 className="font-medium text-gray-900">Style & Composition</h4>
            </div>
            <div className="pl-7 space-y-3">
              {style_period && (
                <div>
                  <span className="text-sm text-gray-600">Style/Period:</span>
                  <p className="text-gray-800">{style_period}</p>
                </div>
              )}
              
              {subject_matter && (
                <div>
                  <span className="text-sm text-gray-600">Subject Matter:</span>
                  <p className="text-gray-800">{subject_matter}</p>
                </div>
              )}
              
              {composition && (
                <div>
                  <span className="text-sm text-gray-600">Composition:</span>
                  <p className="text-gray-800">{composition}</p>
                </div>
              )}
              
              {color_palette && (
                <div>
                  <span className="text-sm text-gray-600">Color Palette:</span>
                  <p className="text-gray-800">{color_palette}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Detailed Analysis (if present) */}
        {detailed_analysis && (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <File className="w-5 h-5 text-gray-700" />
              <h4 className="font-medium text-gray-900">Detailed Analysis</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{detailed_analysis}</p>
          </div>
        )}
        
        {/* Additional Notes */}
        {additional_observations && (
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-gray-700" />
              <h4 className="font-medium text-gray-900">Additional Observations</h4>
            </div>
            <p className="text-gray-700">{additional_observations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenAIAnalysis;
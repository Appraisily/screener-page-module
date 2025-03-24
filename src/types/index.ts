// Common types used across components
export type ItemType = 'Art' | 'Antique';

export interface DetailedAnalysis {
  concise_description?: string; // Added to match the backend response
  maker_analysis: {
    creator_name: string;
    reasoning: string;
  };
  signature_check: {
    signature_text: string;
    interpretation: string;
  };
  origin_analysis: {
    likely_origin: string;
    reasoning: string;
  };
  marks_recognition: {
    marks_identified: string;
    interpretation: string;
  };
  age_analysis: {
    estimated_date_range: string;
    reasoning: string;
  };
  visual_search: {
    similar_artworks: string;
    notes: string;
  };
}

export interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  percentComplete?: number;
}

export interface SearchResults {
  metadata: {
    originalName: string;
    timestamp: number;
    analyzed: boolean;
    mimeType: string;
    size: number;
    fileName: string;
    imageUrl: string;
    analysisTimestamp: number;
    analysisResults: {
      labels: string[];
      webEntities: number;
      matchCounts: {
        exact: number;
        partial: number;
        similar: number;
      };
      pagesWithMatches: number;
      webLabels: number;
      openaiAnalysis: {
        category: ItemType;
        description: string;
      };
    };
    originAnalyzed: boolean;
    originAnalysisTimestamp: number;
  };
  detailedAnalysis: DetailedAnalysis;
}

export interface OriginResults {
  originality: string;
  confidence: number;
  style_analysis: string;
  unique_characteristics: string[];
  comparison_notes: string;
  recommendation: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}
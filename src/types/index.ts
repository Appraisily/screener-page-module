// Common types used across components
export type ItemType = 'Art' | 'Antique';

export interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface SearchResults {
  openai: {
    category: ItemType;
    description: string;
  };
  description: {
    labels: string[];
    confidence: number;
  };
  webEntities: Array<{
    entityId: string;
    score: number;
    description: string;
  }>;
  webLabels: Array<{
    label: string;
    score: number;
    languages: string[];
  }>;
  derivedSubjects: string[];
  matches?: {
    exact: Array<{url: string; score: number; type: string; metadata: any}>;
    partial: Array<{url: string; score: number; type: string; metadata: any}>;
    similar: Array<{url: string; score: number; type: string; metadata: any}>;
  };
  pagesWithMatchingImages?: any; // Add this field to match the structure used in useVisualSearch
}

export interface OriginAnalysisResult {
  originality: string;
  confidence: number;
  style_analysis: string;
  unique_characteristics: string[];
  comparison_notes: string;
  recommendation: string;
}

export interface OriginResults {
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
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface OpenAIAnalysisResults {
  description?: string;
  analysis?: string;
  confidence?: number;
}
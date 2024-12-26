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
}

export interface OriginResults {
  originality: string;
  confidence: number;
  style_analysis: string;
  unique_characteristics: string[];
  comparison_notes: string;
  recommendation: string;
}
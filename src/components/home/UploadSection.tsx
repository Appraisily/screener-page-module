import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import AnalysisProgress from '../AnalysisProgress';
import type { AnalysisStep } from '../../types';

interface UploadSectionProps {
  onUpload: (file: File) => void;
  onReset: () => void;
  onManualAnalysis: () => void;
  isUploading: boolean;
  isAnalyzing: boolean;
  customerImage: string | null;
  sessionId: string | null;
  showBackupButton: boolean;
  error: string | null;
  analysisSteps: AnalysisStep[];
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUpload,
  onReset,
  onManualAnalysis,
  isUploading,
  isAnalyzing,
  customerImage,
  sessionId,
  showBackupButton,
  error,
  analysisSteps
}) => {
  return (
    <div className="relative py-8">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-gradient-overlay opacity-30" />
      
      <div className="relative">
        <ImageUploader 
          onUpload={onUpload}
          onReset={onReset}
          isUploading={isUploading}
          customerImage={customerImage}
          sessionId={sessionId}
        />

        {error && (
          <div className="mx-auto max-w-2xl mt-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
            <p className="text-error-700 text-sm">{error}</p>
          </div>
        )}

        {showBackupButton && sessionId && !isAnalyzing && (
          <div className="text-center mt-6">
            <div className="inline-flex flex-col items-center gap-4 p-6 bg-warning-50 rounded-xl border border-warning-200">
              <p className="text-sm text-warning-800 font-medium">
                Analysis hasn't started automatically? You can start it manually:
              </p>
              <button
                onClick={onManualAnalysis}
                className="btn-accent group"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                Start Analysis
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-8">
            <AnalysisProgress steps={analysisSteps} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
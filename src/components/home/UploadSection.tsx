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
    <div className="relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#007bff,_transparent_70%)] opacity-[0.15]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#007bff,_transparent_70%)] opacity-[0.15]"></div>
      </div>
      
      <div className="relative">
        <ImageUploader 
          onUpload={onUpload}
          onReset={onReset}
          isUploading={isUploading}
          customerImage={customerImage}
          sessionId={sessionId}
        />

        {error && (
          <div className="mx-auto max-w-2xl mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showBackupButton && sessionId && !isAnalyzing && (
          <div className="text-center mt-8">
            <div className="inline-flex flex-col items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm text-yellow-800">
                If the analysis hasn't started automatically, you can start it manually:
              </p>
              <button
                onClick={onManualAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#007bff] text-white rounded-lg
                         hover:bg-[#007bff]/90 transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                Start Analysis
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <AnalysisProgress steps={analysisSteps} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
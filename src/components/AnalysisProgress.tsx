import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, LineChart, CheckCircle2, Loader2, AlertCircle } from './SimpleIcons';
import type { AnalysisStep } from '../types';

const STEP_ICONS = {
  visual: Search,
  details: Sparkles,
  origin: MapPin,
  market: LineChart,
};

interface AnalysisProgressProps {
  steps: AnalysisStep[];
  overallProgress?: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  steps, 
  overallProgress = 0 
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-elegant border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Professional Analysis in Progress
      </h2>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">{overallProgress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS];
            const isActive = step.status === 'processing';
            const isComplete = step.status === 'completed';
            const isError = step.status === 'error';
            const percentComplete = step.percentComplete || 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-50 rounded-lg p-4 border transition-all duration-300 ${
                  isActive 
                    ? 'border-gray-300 bg-white shadow-sm' 
                    : isComplete
                      ? 'border-success-300 bg-success-50'
                      : isError
                        ? 'border-error-300 bg-error-50'
                        : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${isActive 
                                  ? 'bg-gray-100' 
                                  : isComplete
                                    ? 'bg-success-100'
                                    : isError
                                      ? 'bg-error-100'
                                      : 'bg-gray-100'
                                }`}>
                    {isError ? (
                      <AlertCircle className="w-5 h-5 text-error-600" />
                    ) : (
                      <Icon className={`w-5 h-5 ${
                        isActive 
                          ? 'text-gray-700' 
                          : isComplete
                            ? 'text-success-600'
                            : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      {isActive && (
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {percentComplete}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {isError ? 'Error during analysis' : step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                    </div>
                  )}
                  {isComplete && (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 text-success-600"
                      >
                        <CheckCircle2 className="w-full h-full" />
                      </motion.div>
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${percentComplete}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gray-700 rounded-full"
                    />
                  </div>
                )}
                {isError && (
                  <div className="mt-3 px-3 py-2 text-xs bg-error-50 text-error-700 rounded border border-error-200">
                    We encountered an issue with this step. You can still continue with the analysis.
                    <button className="ml-2 underline hover:text-error-800 font-medium">Retry</button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisProgress;
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
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 text-center">
        Analyzing Your Item
      </h2>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-[#007bff] rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4">
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
                className={`bg-white/50 rounded-lg p-4 shadow-sm border transition-all duration-300 ${
                  isActive 
                    ? 'border-[#007bff] shadow-[#007bff]/10' 
                    : isComplete
                      ? 'border-green-500 shadow-green-500/10'
                      : isError
                        ? 'border-red-500 shadow-red-500/10'
                        : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                                ${isActive 
                                  ? 'bg-[#007bff]/10' 
                                  : isComplete
                                    ? 'bg-green-500/10'
                                    : isError
                                      ? 'bg-red-500/10'
                                      : 'bg-gray-50'
                                }`}>
                    {isError ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <Icon className={`w-6 h-6 ${
                        isActive 
                          ? 'text-[#007bff]' 
                          : isComplete
                            ? 'text-green-500'
                            : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      {isActive && (
                        <span className="text-xs font-medium text-[#007bff]">{percentComplete}%</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {isError ? 'Error during analysis' : step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-[#007bff] animate-spin" />
                    </div>
                  )}
                  {isComplete && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 text-green-500"
                      >
                        <CheckCircle2 className="w-full h-full" />
                      </motion.div>
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${percentComplete}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-[#007bff] rounded-full"
                    />
                  </div>
                )}
                {isError && (
                  <div className="mt-3 px-3 py-2 text-xs bg-red-50 text-red-600 rounded border border-red-100">
                    We encountered an issue with this step. You can still continue with the analysis.
                    <button className="ml-2 underline hover:text-red-700">Retry</button>
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
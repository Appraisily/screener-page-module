import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Loader2, BarChart, Clock, Search, AlertCircle, CheckCircle } from 'lucide-react';

interface ValueEstimationProgressProps {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
  percentComplete: number;
  stage: string;
  message: string;
  estimatedTimeRemaining?: number;
  onCancel?: () => void;
}

const ValueEstimationProgress: React.FC<ValueEstimationProgressProps> = ({
  status,
  percentComplete,
  stage,
  message,
  estimatedTimeRemaining,
  onCancel
}) => {
  // Don't render anything if we're in idle state
  if (status === 'idle') return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 max-w-xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center
            ${status === 'processing' 
              ? 'bg-blue-50 text-blue-500' 
              : status === 'completed'
                ? 'bg-green-50 text-green-500'
                : status === 'error'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-50 text-gray-500'
            }`}
          >
            {status === 'processing' ? (
              <DollarSign className="w-6 h-6" />
            ) : status === 'completed' ? (
              <CheckCircle className="w-6 h-6" />
            ) : status === 'error' ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Value Estimation</h3>
            <p className="text-sm text-gray-600">{stage}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">{message}</span>
            <span className="text-sm font-medium text-gray-700">{percentComplete}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${percentComplete}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                status === 'processing' 
                  ? 'bg-blue-500' 
                  : status === 'completed'
                    ? 'bg-green-500'
                    : status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
              }`}
            />
          </div>
        </div>
        
        {status === 'processing' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center gap-1.5 mr-4">
                <Search className="w-4 h-4" />
                <span>Finding comparable items</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart className="w-4 h-4" />
                <span>Analyzing market data</span>
              </div>
            </div>
            
            {estimatedTimeRemaining !== undefined && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>~{estimatedTimeRemaining} seconds remaining</span>
              </div>
            )}
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{message}</p>
            {onCancel && (
              <button 
                onClick={onCancel}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Skip value estimation
              </button>
            )}
          </div>
        )}
        
        {status === 'processing' && onCancel && (
          <div className="mt-4 text-right">
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Continue without waiting
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ValueEstimationProgress;
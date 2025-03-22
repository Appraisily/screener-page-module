import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, RefreshCw, Clock, Sparkles } from 'lucide-react';
import type { ErrorDetails } from '../hooks/useErrorRecovery';

interface ErrorRecoveryDialogProps {
  error: ErrorDetails | null;
  isRecovering: boolean;
  hasRecovered: boolean;
  onRetry: () => void;
  onFallback: () => void;
  onDismiss: () => void;
}

const ErrorRecoveryDialog: React.FC<ErrorRecoveryDialogProps> = ({
  error,
  isRecovering,
  hasRecovered,
  onRetry,
  onFallback,
  onDismiss
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!error) return null;
  
  // Determine icon based on error category
  const getIcon = () => {
    switch (error.category) {
      case 'network':
      case 'server':
        return <RefreshCw className="w-6 h-6 text-amber-500" />;
      case 'timeout':
        return <Clock className="w-6 h-6 text-amber-500" />;
      case 'auth':
      case 'resource':
      case 'validation':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    }
  };
  
  // Get user-friendly error title
  const getErrorTitle = () => {
    switch (error.category) {
      case 'network':
        return 'Connection Issue';
      case 'server':
        return 'Server Error';
      case 'timeout':
        return 'Request Timeout';
      case 'auth':
        return 'Authentication Error';
      case 'resource':
        return 'Resource Not Found';
      case 'validation':
        return 'Validation Error';
      case 'api':
        return 'API Error';
      default:
        return 'Analysis Issue';
    }
  };
  
  // Get user-friendly recovery message
  const getRecoveryMessage = () => {
    if (hasRecovered) {
      return 'We've successfully recovered from the error!';
    }
    
    if (isRecovering) {
      return 'Attempting to recover...';
    }
    
    if (error.recoverable) {
      switch (error.category) {
        case 'network':
          return 'We're having trouble connecting to our servers. Would you like to retry?';
        case 'server':
          return 'Our servers are experiencing an issue. Would you like to retry?';
        case 'timeout':
          return 'The analysis is taking longer than expected. Would you like to retry?';
        default:
          return 'We encountered an issue with your analysis. Would you like to retry?';
      }
    } else {
      return 'We encountered an issue that we can't automatically recover from.';
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          // Close only if clicking the backdrop, not the dialog
          if (e.target === e.currentTarget) {
            onDismiss();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
            {getIcon()}
            <h3 className="font-medium text-gray-900 text-lg">{getErrorTitle()}</h3>
          </div>
          
          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-gray-600">{getRecoveryMessage()}</p>
            
            {/* Detailed error info (collapsible) */}
            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span className="text-xs">{showDetails ? '▼' : '►'}</span>
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>
              
              {showDetails && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 font-mono">
                  <p className="mb-1">{error.message}</p>
                  {error.originalError && (
                    <p className="text-gray-400">{error.originalError.toString()}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            {error.recoverable && !hasRecovered && (
              <button
                onClick={onRetry}
                disabled={isRecovering}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRecovering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Recovering...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={onFallback}
              disabled={isRecovering}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Continue with Partial Results
            </button>
            
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorRecoveryDialog;
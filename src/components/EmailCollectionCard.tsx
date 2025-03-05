import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Lock, Clock, Star, CheckCircle, X, MessageSquare } from 'lucide-react';
import { validateEmail } from '../utils/validation';

interface EmailCollectionCardProps {
  onSubmit: (email: string) => Promise<boolean>;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const EmailCollectionCard: React.FC<EmailCollectionCardProps> = ({ 
  onSubmit, 
  isMinimized = false,
  onToggleMinimize 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const success = await onSubmit(email);
      if (success) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MinimizedButton = () => (
    <motion.button
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={onToggleMinimize}
      className="fixed bottom-4 right-4 bg-[#007bff] text-white p-4 rounded-full shadow-lg 
                hover:bg-[#007bff]/90 transition-all duration-200 z-50
                hover:shadow-xl hover:scale-105 group"
    >
      <Mail className="w-6 h-6 group-hover:animate-bounce" />
      <span className="sr-only">Get Free Report</span>
    </motion.button>
  );

  if (isMinimized) {
    return <MinimizedButton />;
  }

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 right-4 w-full max-w-md z-50"
        >
          <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-lg">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-green-800">Report Requested!</h4>
                <p className="text-sm text-green-700">
                  Your complete valuation report is being prepared.
                  <br />
                  We'll email it to you in the next few minutes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-full max-w-md z-50"
        >
          <div className="bg-black/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-4">
            <button
              onClick={onToggleMinimize}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white 
                       transition-colors duration-200 rounded-lg hover:bg-white/10"
              aria-label="Minimize"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">Get your free report</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-[#007bff] text-white rounded-full">
                      FREE
                    </span>
                  </div>
                  <ul className="text-gray-400 text-xs space-y-0.5">
                    <li className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#007bff]" />
                      <span>Professional valuation estimate</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#007bff]" />
                      <span>Instant delivery to your inbox</span>
                    </li>
                  </ul>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-64 px-3 py-2 text-sm rounded-lg bg-white/10 border ${
                    error ? 'border-red-400' : 'border-white/20'
                  } text-white placeholder:text-gray-500 focus:outline-none focus:ring-2
                    focus:ring-white/20 focus:border-white/30 transition-all duration-200`}
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="group relative flex items-center justify-center gap-2 bg-white text-black
                           rounded-lg px-6 py-3 text-sm font-medium hover:bg-gray-100
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all duration-300 transform hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Free Report
                      <ArrowRight className="w-4 h-4 transform transition-transform duration-300 
                                         group-hover:translate-x-1" />
                    </>
                  )}
                  <div className="absolute inset-0 rounded-lg border-2 border-white/20 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>
            </div>
            {error && (
              <p id="email-error" role="alert" className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400" />
                {error}
              </p>
            )}
            <p className="text-[10px] text-gray-500 mt-2">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailCollectionCard;
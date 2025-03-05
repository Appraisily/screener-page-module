import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface EmailCollectorProps {
  onSubmit: (email: string) => Promise<boolean>;
  isLoading?: boolean;
}

const EmailCollector: React.FC<EmailCollectorProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onSubmit(email);
    } catch (err) {
      setError('Failed to submit email. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 overflow-hidden">
      {/* Top colored accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500"></div>
      
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Get Your Complete Analysis Report</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter your email to receive your comprehensive art analysis report, including:
          </p>
          
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
              <span className="text-sm text-slate-700">Detailed artwork evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
              <span className="text-sm text-slate-700">Market value insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
              <span className="text-sm text-slate-700">Authentication guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
              <span className="text-sm text-slate-700">Comparable sales data</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`block w-full rounded-md border ${
                  error ? 'border-error' : 'border-slate-200'
                } px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-slate-50`}
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-error">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-900 px-4 py-3 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  Get Complete Report
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-3">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary-700 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-700 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCollector;
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-5 h-5 text-secondary-500" />
        <h3 className="text-lg font-semibold text-primary-900">Get Your Complete Analysis Report</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600">
            Enter your email to receive your comprehensive art analysis report, including:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-slate-600">
            <li>Detailed artwork evaluation</li>
            <li>Market value insights</li>
            <li>Authentication guidance</li>
            <li>Comparable sales data</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className={`block w-full rounded-lg border ${
                error ? 'border-error' : 'border-slate-200'
              } px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700`}
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-error">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-900 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                Get Complete Report
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-800 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-800 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default EmailCollector;
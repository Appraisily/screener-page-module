import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface EmailCollectorProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const EmailCollector: React.FC<EmailCollectorProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(email);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-5 h-5 text-[#007bff]" />
        <h3 className="text-lg font-semibold text-gray-900">Get Your Full Report</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            Enter your email to receive your complete artwork analysis report, including:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
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
                error ? 'border-red-300' : 'border-gray-200'
              } px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#007bff] focus:outline-none focus:ring-1 focus:ring-[#007bff]`}
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#007bff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007bff]/90 focus:outline-none focus:ring-2 focus:ring-[#007bff]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        <p className="text-xs text-gray-500 mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#007bff] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#007bff] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default EmailCollector;
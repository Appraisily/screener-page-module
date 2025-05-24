import React from 'react';
import { CheckCircle, Shield, Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="mx-auto max-w-4xl text-center mb-20">
      <div className="animate-fade-in">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Professional Art & Antique Analysis</span>
        </div>

        {/* Main headline */}
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 text-balance">
            Professional Art
            <span className="block text-gray-700">Screening</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Get expert insights into your artwork's attribution, origin, and significance with our professional screening service.
          </p>
        </div>

        {/* Value proposition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Expert Analysis</h3>
            <p className="text-sm text-gray-600">Professional assessment by certified appraisers</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Fast Results</h3>
            <p className="text-sm text-gray-600">Preliminary screening in minutes</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Confidential</h3>
            <p className="text-sm text-gray-600">Secure and private assessment process</p>
          </div>
        </div>

        {/* Call to action hint */}
        <div className="text-gray-500 text-sm">
          Upload your artwork below to begin the professional screening process
        </div>
      </div>
    </header>
  );
};

export default Header;
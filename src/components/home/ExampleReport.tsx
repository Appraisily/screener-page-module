import React from 'react';

const ExampleReport: React.FC = () => {
  return (
    <div className="mt-24 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">How Your Report Will Look</h2>
        <p className="mt-4 text-lg text-gray-600">
          After uploading your artwork, you'll receive a detailed report like this
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 text-center">
          <img
            src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png"
            alt="Appraisily Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold text-gray-900">Art Analysis Report</h3>
          <p className="text-sm text-[#007bff] mt-1">by Appraisily</p>
        </div>

        {/* Uploaded Image Section */}
        <div className="aspect-[4/3] w-full relative overflow-hidden border-b border-gray-100">
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
            User Input
          </div>
          <img
            src="https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/UserUploadedImage.jpg"
            alt="Early English Baroque Oil Portrait"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header Info */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
          <div className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full mb-4">
            AI Analysis Results
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-gray-900">Early English Baroque Oil Portrait</h3>
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Session ID:</span>
                <code className="px-2 py-1 bg-gray-50 rounded text-sm font-mono text-blue-600">
                  dfcea0c9-f596-41f2-9bcb-06947d9ac2a4
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Category:</span>
                <span className="text-blue-600">Art</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Description:</span>
                <span className="text-gray-600">Classic portrait painting with painting labels</span>
              </div>
            </div>
          </div>
        </div>

        {/* Value Estimation */}
        <div className="p-6 bg-blue-50/50">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-gray-900">Value Estimation</h4>
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-sm text-gray-600">Range:</span>
                <p className="text-xl font-bold text-blue-600">$375 - $530,000</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Most Likely:</span>
                <p className="text-xl font-bold text-blue-600">$7,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            This is an example of our AI-powered analysis. Your report will be customized based on your specific item.
            Professional appraisal is recommended for final authentication and valuation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExampleReport;
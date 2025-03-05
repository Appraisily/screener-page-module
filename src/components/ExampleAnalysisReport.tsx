import React from 'react';
import { DollarSign, Search, MapPin, User, Building2, Clock } from 'lucide-react';

const ExampleAnalysisReport: React.FC = () => {
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

        {/* Example Image */}
        <div className="aspect-[4/3] w-full relative overflow-hidden border-b border-gray-100">
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
            Example Report
          </div>
          <img
            src="https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/UserUploadedImage.jpg"
            alt="Example artwork"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
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

        {/* Visual Analysis */}
        <div className="p-6 space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Visual Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Web Entities</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-50 rounded text-sm text-blue-700">Art</span>
                <span className="px-2 py-1 bg-blue-50 rounded text-sm text-blue-700">Painting</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Similar Images Found</h5>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image${i}.jpg`}
                    alt={`Similar artwork ${i}`}
                    className="w-full h-12 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Origin Analysis */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Origin Analysis</h4>
            <div className="grid gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Style Analysis</h5>
                <p className="text-gray-600">
                  The painting appears in the style of a 17th-century Baroque portrait, with subdued lighting, 
                  a dark background, and the sitter's face emerging from shadow in the traditional 'old master' manner.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Unique Characteristics</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007bff] mt-2 flex-shrink-0" />
                    Long, curled hair typical of mid to late 17th-century portraiture
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007bff] mt-2 flex-shrink-0" />
                    Warm, earthy tonality and chiaroscuro-like contrast
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007bff] mt-2 flex-shrink-0" />
                    Soft, blended brushwork around the face and hair
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Market Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">ANTIQUE 17 CENTURY ENGLISH OIL PORTRAIT PAINTING</p>
                  <p className="text-sm text-gray-600">Antique Arena Inc, 2022</p>
                </div>
                <span className="font-semibold text-[#007bff]">$375</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Portrait of Lady Anne O'Brien</p>
                  <p className="text-sm text-gray-600">Setdart Auction House, 2022</p>
                </div>
                <span className="font-semibold text-[#007bff]">€7,000</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Attributed to Sir Peter Lely, Late 17th Century</p>
                  <p className="text-sm text-gray-600">Hindman, 2021</p>
                </div>
                <span className="font-semibold text-[#007bff]">$10,625</span>
              </div>
            </div>
          </div>

          {/* Value Analysis */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Value Analysis</h4>
            <p className="text-gray-600">
              Comparable early English Baroque portraits show huge variation. Unattributed or modest 
              works typically realize prices in the low thousands, while strong attributions or 
              exceptional quality can drive values higher.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            This is an example report. Your analysis will be customized based on your specific item,
            including detailed visual analysis, market comparables, and expert insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExampleAnalysisReport;
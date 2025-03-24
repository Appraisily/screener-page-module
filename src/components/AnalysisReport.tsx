import React from 'react';

interface AnalysisReportProps {
  isExample?: boolean;
  sessionId?: string;
  imageUrl?: string;
  analysisData?: {
    title: string;
    category: string;
    description: string;
    valueRange: string;
    mostLikelyValue: string;
    webEntities: string[];
    similarImages: string[];
    originality: {
      confidence: number;
      styleAnalysis: string;
      characteristics: string[];
    };
    analysis: {
      maker: string;
      age: string;
    };
    auctionResults: Array<{
      title: string;
      house: string;
      year: string;
      price: string;
    }>;
    valueAnalysis: string;
  };
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({
  isExample = false,
  sessionId = 'dfcea0c9-f596-41f2-9bcb-06947d9ac2a4',
  imageUrl = 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/UserUploadedImage.jpg',
  analysisData = {
    title: 'Early English Baroque Oil Portrait',
    category: 'Art',
    description: 'Classic portrait painting with painting labels',
    valueRange: '$375 - $530,000',
    mostLikelyValue: '$7,000',
    webEntities: ['Art', 'Painting'],
    similarImages: [
      'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image1.jpg',
      'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image2.jpg',
      'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image3.jpg',
      'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image4.jpg',
      'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/similar-image5.jpg'
    ],
    originality: {
      confidence: 60,
      styleAnalysis: 'The painting appears in the style of a 17th-century Baroque portrait, with subdued lighting, a dark background, and the sitter\'s face emerging from shadow in the traditional \'old master\' manner.',
      characteristics: [
        'Long, curled hair typical of mid to late 17th-century portraiture',
        'Warm, earthy tonality and chiaroscuro-like contrast',
        'Soft, blended brushwork around the face and hair'
      ]
    },
    analysis: {
      maker: 'Likely from the circle of Sir Peter Lely. The soft modeling of facial features, luxurious shoulder-length curls, and the subdued Baroque-era color palette align with known stylistic traits prevalent in Restoration-era portraiture.',
      age: 'Estimated date range: Mid-to-late 17th century. The hairstyle, period fashion, and painting technique suggest a date consistent with the Restoration era (c. 1660-1680).'
    },
    auctionResults: [
      {
        title: 'ANTIQUE 17 CENTURY ENGLISH OIL PORTRAIT PAINTING',
        house: 'Antique Arena Inc',
        year: '2022',
        price: '$375'
      },
      {
        title: 'Portrait of Lady Anne O\'Brien',
        house: 'Setdart Auction House',
        year: '2022',
        price: '€7,000'
      },
      {
        title: 'Attributed to Sir Peter Lely, Late 17th Century',
        house: 'Hindman',
        year: '2021',
        price: '$10,625'
      }
    ],
    valueAnalysis: 'Comparable early English Baroque portraits show huge variation. Unattributed or modest works typically realize prices in the low thousands, while strong attributions or exceptional quality can drive values higher.'
  }
}) => {
  return (
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
          src={imageUrl}
          alt={analysisData.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Header Info */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
        <div className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full mb-4">
          AI Analysis Results
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">{analysisData.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm mt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Session ID:</span>
              <code className="px-2 py-1 bg-gray-50 rounded text-sm font-mono text-blue-600">
                {sessionId}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Category:</span>
              <span className="text-blue-600">{analysisData.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Description:</span>
              <span className="text-gray-600">{analysisData.description}</span>
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
              <p className="text-xl font-bold text-blue-600">{analysisData.valueRange}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Most Likely:</span>
              <p className="text-xl font-bold text-blue-600">{analysisData.mostLikelyValue}</p>
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
              {analysisData.webEntities.map((entity, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 rounded text-sm text-blue-700">
                  {entity}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Similar Images Found</h5>
            <div className="grid grid-cols-5 gap-2">
              {analysisData.similarImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Similar artwork ${i + 1}`}
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
              <h5 className="font-medium text-gray-900 mb-2">Originality Assessment</h5>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Confidence: {analysisData.originality.confidence}%
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${analysisData.originality.confidence}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Style Analysis</h5>
              <p className="text-gray-600">{analysisData.originality.styleAnalysis}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Unique Characteristics</h5>
              <ul className="space-y-2">
                {analysisData.originality.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    {char}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Full Analysis */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Full Analysis Findings</h4>
          <div className="grid gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Maker Analysis</h5>
              <p className="text-gray-600">{analysisData.analysis.maker}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Age Analysis</h5>
              <p className="text-gray-600">{analysisData.analysis.age}</p>
            </div>
          </div>
        </div>

        {/* Auction Results */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Recent Auction Results</h4>
          <div className="grid gap-3">
            {analysisData.auctionResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{result.title}</p>
                  <p className="text-sm text-gray-600">{result.house}, {result.year}</p>
                </div>
                <span className="font-semibold text-blue-600">{result.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value Analysis */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-2">Value Analysis</h5>
          <p className="text-gray-600">{analysisData.valueAnalysis}</p>
        </div>
      </div>

      {/* Footer Note */}
      {isExample && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            This is an example of our AI-powered analysis. Your report will be customized based on your specific item.
            Professional appraisal is recommended for final authentication and valuation.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
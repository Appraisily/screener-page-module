import React, { useEffect, useCallback, useState } from 'react';
import { AlertCircle, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import VisualSearchPanel from '../components/VisualSearchPanel';
import ResultsDisplay from '../components/ResultsDisplay';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

// Simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Component error caught:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

function HomePage() {
  const [renderContent, setRenderContent] = useState(false);
  
  useEffect(() => {
    console.log('HomePage initializing...');
    // Delay rendering to ensure all CSS is loaded
    const timer = setTimeout(() => {
      setRenderContent(true);
      console.log('HomePage content ready to render');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Basic fallback content that will always render
  const FallbackContent = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Art Screener</h1>
          <p className="text-xl text-slate-600 mb-8">Upload your artwork for instant analysis</p>
          <button 
            className="px-4 py-2 bg-primary-900 text-white rounded-md shadow hover:bg-primary-800"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
  
  // If we're not ready to render yet, show a loading message
  if (!renderContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-xl text-primary-900">Loading application...</p>
        </div>
      </div>
    );
  }

  try {
    // Now that we're ready to render, try loading the actual content
    return (
      <ErrorBoundary fallback={<FallbackContent />}>
        <MainContent />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Error rendering HomePage:", error);
    return <FallbackContent />;
  }
}

// Separate the main content into its own component for better error isolation
function MainContent() {
  const {
    uploadImage,
    startVisualSearch,
    testVisualSearch,
    submitEmail,
    isUploading,
    isSearching,
    customerImage,
    sessionId,
    setSessionId,
    analyzeOrigin,
    isAnalyzingOrigin,
    originResults,
    error,
    searchResults
  } = useImageAnalysis();

  console.log('MainContent hook state:', { 
    hasSessionId: !!sessionId, 
    hasImage: !!customerImage,
    isUploading,
    isSearching 
  });

  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    if (sessionId) {
      return await submitEmail(email);
    }
    return false;
  }, [sessionId, submitEmail]);

  useEffect(() => {
    console.log('HomePage state update:', {
      hasSessionId: !!sessionId,
      sessionIdValue: sessionId,
      hasSearchResults: !!searchResults,
      customerImageUrl: customerImage
    });
  }, [sessionId, searchResults, customerImage]);
  
  // Sample appraisal data
  const recentAppraisals = [
    { id: 1, title: 'Example appraisal 1', image: 'https://ik.imagekit.io/appraisily/WebPage/example1.jpg' },
    { id: 2, title: 'Example appraisal 2', image: 'https://ik.imagekit.io/appraisily/WebPage/example2.jpg' },
    { id: 3, title: 'Example appraisal 3', image: 'https://ik.imagekit.io/appraisily/WebPage/example3.jpg' },
    { id: 4, title: 'Example appraisal 4', image: 'https://ik.imagekit.io/appraisily/WebPage/example4.jpg' },
    { id: 5, title: 'Example appraisal 5', image: 'https://ik.imagekit.io/appraisily/WebPage/example5.jpg' },
    { id: 6, title: 'Example appraisal 6', image: 'https://ik.imagekit.io/appraisily/WebPage/example6.jpg' }
  ];
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <header className="mx-auto max-w-3xl text-center mb-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 bg-primary-900 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-900">
                  Fast, Free Screening for Art & Antiques
                </h1>
                <p className="text-xl text-slate-700">
                  by Appraisily
                </p>
              </div>

              <p className="text-lg text-slate-600 max-w-2xl">
                See if your item's worth further appraisal. Get instant insights using our proprietary tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm px-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">Free instant analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">No sign-up required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span className="text-slate-600">Professional insights</span>
                </div>
              </div>
            </div>
          </header>

          {error && (
            <div className="mx-auto max-w-2xl mb-8 p-4 alert-error flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-error" />
              <p className="text-error">{error}</p>
            </div>
          )}

          <div className="space-y-16">
            <ErrorBoundary fallback={
              <div className="text-center py-8">
                <div className="text-error mb-4">
                  <AlertCircle className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Upload Component Error
                </h3>
                <p className="text-slate-600">
                  There was an error loading the image uploader. 
                  <button 
                    className="underline text-primary-600 ml-2" 
                    onClick={() => window.location.reload()}
                  >
                    Try refreshing
                  </button>
                </p>
              </div>
            }>
            <ImageUploader 
              onUpload={uploadImage}
              isUploading={isUploading}
              customerImage={customerImage}
              sessionId={sessionId}
            />
            </ErrorBoundary>

            {customerImage && sessionId && !searchResults && !isSearching && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-slate-600">
                    Your image has been uploaded successfully. Use the tool below to analyze it:
                  </p>
                </div>
              <div className="mx-auto max-w-2xl">
                <VisualSearchPanel 
                  onClick={() => sessionId && startVisualSearch(sessionId)} 
                  isSearching={isSearching}
                />
              </div>
              </div>
            )}
            
            {/* Test Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={async () => {
                  if (!isSearching && setSessionId) {
                    const testId = '5beeda96-1ab6-49a5-b689-58af1bc8768d';
                    setSessionId(testId);
                    await testVisualSearch(testId);
                  }
                }}
                className="btn-primary px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
                disabled={isSearching}
              >
                <Search className="w-4 h-4 mr-2" />
                Test Visual Search
              </button>
            </div>

            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
                <p className="text-slate-600 mt-4">Performing visual search...</p>
              </div>
            )}

            {searchResults && (
              <ErrorBoundary fallback={
                <div className="text-center py-8">
                  <p className="text-error">There was an error displaying results</p>
                </div>
              }>
              <ResultsDisplay
                  searchResults={searchResults}
                  sessionId={sessionId}
                  submitEmail={handleEmailSubmit}
                onAnalyzeOrigin={analyzeOrigin}
                isAnalyzingOrigin={isAnalyzingOrigin}
                originResults={originResults}
                isAnalyzing={false}
                />
              </ErrorBoundary>
            )}
            
            {/* Recent Appraisals Section */}
            <section className="mt-24">
              <div className="mx-auto max-w-4xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-900 mb-4">Recent Appraisals</h2>
                  <p className="text-lg text-slate-600">Examples of items we've analyzed</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {recentAppraisals.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback for images that fail to load
                            const target = e.target as HTMLImageElement;
                            target.src = `https://placehold.co/300x300/f8fafc/64748b?text=Example+${item.id}`;
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-primary-900">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Report Example Section */}
            <section className="mt-24 bg-white py-16 rounded-2xl shadow-xl">
              <div className="mx-auto max-w-5xl px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-900 mb-4">How Your Report Will Look</h2>
                  <p className="text-lg text-slate-600">After uploading your artwork, you'll receive a detailed report like this</p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                  {/* Report Header */}
                  <div className="bg-primary-900 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Art Analysis Report</h3>
                        <p className="text-primary-200">by Appraisily</p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left Column - Image */}
                      <div className="md:w-1/3">
                        <div className="rounded-lg overflow-hidden border border-slate-200">
                          <img 
                            src="https://ik.imagekit.io/appraisily/WebPage/example_report.jpg" 
                            alt="Example artwork" 
                            className="w-full h-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/400x500/f8fafc/64748b?text=Example+Artwork";
                            }}
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <h4 className="font-semibold text-primary-900">Early English Baroque Oil Portrait</h4>
                        </div>
                      </div>
                      
                      {/* Right Column - Details */}
                      <div className="md:w-2/3">
                        <div className="space-y-6">
                          {/* Session Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-500">Session ID:</p>
                              <p className="font-mono text-xs text-slate-700">dfcea0c9-f596-41f2-9bcb-06947d9ac2a4</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Category:</p>
                              <p className="text-slate-700">Art</p>
                            </div>
                          </div>
                          
                          {/* Value Estimation */}
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary-900 mb-2">Value Estimation</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-slate-500">Range:</p>
                                <p className="text-primary-900 font-semibold">$375 - $530,000</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Most Likely:</p>
                                <p className="text-secondary-600 font-bold text-lg">$7,000</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Visual Analysis */}
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-2">Visual Analysis</h4>
                            <div className="mb-3">
                              <p className="text-sm text-slate-500">Web Entities</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700">Art</span>
                                <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700">Painting</span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-slate-500 mb-2">Similar Images Found</p>
                              <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map(num => (
                                  <div key={num} className="aspect-w-1 aspect-h-1 overflow-hidden rounded bg-slate-100">
                                    <img 
                                      src={`https://ik.imagekit.io/appraisily/WebPage/similar${num}.jpg`}
                                      alt={`Similar artwork ${num}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://placehold.co/100x100/f8fafc/64748b?text=Similar+${num}`;
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Origin Analysis */}
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-2">Origin Analysis</h4>
                            
                            <div className="mb-4">
                              <p className="text-sm text-slate-500 mb-1">Style Analysis</p>
                              <p className="text-sm text-slate-700">
                                The painting appears in the style of a 17th-century Baroque portrait, with subdued lighting, 
                                a dark background, and the sitter's face emerging from shadow in the traditional 'old master' manner.
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-slate-500 mb-1">Unique Characteristics</p>
                              <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                                <li>Long, curled hair typical of mid to late 17th-century portraiture</li>
                                <li>Warm, earthy tonality and chiaroscuro-like contrast</li>
                                <li>Soft, blended brushwork around the face and hair</li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Market Activity */}
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-2">Recent Market Activity</h4>
                            <div className="space-y-3">
                              <div className="p-3 border border-slate-200 rounded">
                                <p className="font-medium text-primary-900">ANTIQUE 17 CENTURY ENGLISH OIL PORTRAIT PAINTING</p>
                                <p className="text-sm text-slate-500">Antique Arena Inc, 2022</p>
                                <p className="text-secondary-600 font-semibold mt-1">$375</p>
                              </div>
                              
                              <div className="p-3 border border-slate-200 rounded">
                                <p className="font-medium text-primary-900">Portrait of Lady Anne O'Brien</p>
                                <p className="text-sm text-slate-500">Setdart Auction House, 2022</p>
                                <p className="text-secondary-600 font-semibold mt-1">€7,000</p>
                              </div>
                              
                              <div className="p-3 border border-slate-200 rounded">
                                <p className="font-medium text-primary-900">Attributed to Sir Peter Lely, Late 17th Century</p>
                                <p className="text-sm text-slate-500">Hindman, 2021</p>
                                <p className="text-secondary-600 font-semibold mt-1">$10,625</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Value Analysis */}
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-2">Value Analysis</h4>
                            <p className="text-sm text-slate-700">
                              Comparable early English Baroque portraits show huge variation. Unattributed or modest works 
                              typically realize prices in the low thousands, while strong attributions or exceptional quality 
                              can drive values higher.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Footer */}
                  <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 italic">
                      This is an example report. Your analysis will be customized based on your specific item, 
                      including detailed visual analysis, market comparables, and expert insights.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
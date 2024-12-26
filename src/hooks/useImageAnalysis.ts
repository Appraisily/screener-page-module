import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const DEBUG = true;

// Function to extract sessionId from URL parameters
const getSessionIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('sessionId');
};

interface DebugOptions {
  type?: 'info' | 'warn' | 'error';
  data?: any;
}

const debug = (message: string, options: DebugOptions = {}) => {
  if (DEBUG) {
    const { type = 'info', data } = options;
    const prefix = `[Visual Search]`;

    switch (type) {
      case 'warn':
        console.warn(prefix, message, data ? '\nData: ' + JSON.stringify(data, null, 2) : '');
        break;
      case 'error':
        console.error(prefix, message, data ? '\nData: ' + JSON.stringify(data, null, 2) : '');
        break;
      default:
        console.log(prefix, message, data ? '\nData: ' + JSON.stringify(data, null, 2) : '');
    }
  }
};

export type AnalysisStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
};

export function useImageAnalysis(apiUrl?: string, initialSessionId?: string) {
  const effectiveApiUrl = apiUrl || API_URL;
  const [isUploading, setIsUploading] = useState(false);
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Load session on mount if sessionId is in URL
  useEffect(() => {
    const urlSessionId = getSessionIdFromUrl();
    if (urlSessionId) {
      loadExistingSession(urlSessionId);
    }
  }, []);

  const loadExistingSession = async (sid: string) => {
    debug('Loading existing session', { data: { sessionId: sid } });
    setError(null);
    setIsUploading(true);

    try {
      const response = await fetch(`${effectiveApiUrl}/session/${sid}`);
      if (!response.ok) {
        throw new Error('Failed to load session');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load session');
      }

      setCustomerImage(data.imageUrl);
      setSessionId(sid);
      
      // Automatically start visual search for existing sessions
      startVisualSearch(sid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsUploading(false);
    }
  };
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isAnalyzingOrigin, setIsAnalyzingOrigin] = useState(false);
  const [originResults, setOriginResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const analyzeOrigin = async () => {
    if (!sessionId) {
      debug('Cannot analyze origin: No session ID', { type: 'error' });
      return;
    }

    debug('Starting origin analysis', { data: { sessionId } });
    setError(null);
    setIsAnalyzingOrigin(true);

    try {
      const response = await fetch(`${API_URL}/origin-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      debug('Origin analysis response', { data });

      if (!data.success) {
        throw new Error(data.message || 'Origin analysis failed');
      }

      setOriginResults(data.results);
      debug('Origin analysis completed', { data: data.results });
    } catch (err) {
      debug('Origin analysis error', { 
        type: 'error',
        data: err instanceof Error ? err.message : 'Unknown error'
      });
      setError(err instanceof Error ? err.message : 'Origin analysis failed');
    } finally {
      setIsAnalyzingOrigin(false);
    }
  };

  const testVisualSearch = async (testSessionId: string) => {
    debug('Starting test visual search', { data: { sessionId: testSessionId } });
    setSessionId(testSessionId); // Set sessionId immediately when starting test
    setError(null);
    setIsSearching(true);

    try {
      const response = await fetch(`${API_URL}/visual-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: testSessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Search failed');
      }

      // Process and structure the results
      debug('Processing complete visual search results', { 
        type: 'info',
        data: data.results
      });

      const processedResults = {
        openai: data.results.openai,
        description: data.results.vision.description,
        webEntities: data.results.vision.webEntities,
        webLabels: data.results.vision.webLabels,
        derivedSubjects: data.results.vision.derivedSubjects,
        matches: data.results.vision.matches,
        pagesWithMatchingImages: data.results.vision.pagesWithMatchingImages
      };

      // Set sessionId from test data
      debug('Setting sessionId from test data', { data: { testSessionId } });
      setSessionId(testSessionId);

      setSearchResults(processedResults);
      debug('Search results state updated', { data: processedResults });
      debug('Visual search completed with full results', { 
        type: 'info',
        data: {
          openai: processedResults.openai,
          description: processedResults.description,
          webEntities: processedResults.webEntities?.length,
          webLabels: processedResults.webLabels?.length,
          matches: {
            exact: processedResults.matches?.exact?.length,
            partial: processedResults.matches?.partial?.length,
            similar: processedResults.matches?.similar?.length
          },
          pagesWithMatchingImages: processedResults.pagesWithMatchingImages?.length
        }
      });
      debug('Final state after test visual search', { 
        data: { 
          sessionId: testSessionId,
          hasResults: !!processedResults,
          resultKeys: Object.keys(processedResults)
        }
      });
    } catch (err) {
      debug('Test visual search error', { 
        type: 'error', 
        data: err instanceof Error ? err.message : 'Unknown error'
      });
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    setError(null);
    setIsUploading(true);
    debug('Starting image upload', { 
      fileName: file.name, 
      fileSize: file.size, 
      type: file.type 
    });

    try {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      const formData = new FormData();
      formData.append('image', file);

      debug('Making upload request to:', API_URL);
      const response = await fetch(`${API_URL}/upload-temp`, {
        method: 'POST',
        body: formData
      });

      // Check if response is OK and content type is JSON
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format - expected JSON');
      }

      const data = await response.json();
      debug('Upload response status:', { data: { status: response.status } });
      debug('Upload response data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
      }

      debug('Upload completed successfully', { 
        data: {
          sessionId: data.sessionId,
          imageUrl: data.imageUrl
        }
      });

      setCustomerImage(data.imageUrl);
      setSessionId(data.sessionId);

    } catch (err) {
      debug('Upload error:', { 
        type: 'error',
        data: err instanceof Error ? err.message : 'Unknown error'
      });
      setError(err instanceof Error ? err.message : 'Upload failed');
      setCustomerImage(null);
      setSessionId(null);
    } finally {
      setIsUploading(false);
      debug('Upload process completed', { type: 'info' });
    }
  };

  const startVisualSearch = async () => {
    if (!sessionId) return;

    debug('Starting visual search process', { data: { sessionId } });
    setError(null);
    setIsSearching(true);

    try {
      debug('Making visual search request');
      const response = await fetch(`${API_URL}/visual-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      debug('Visual search response received', { 
        data: { 
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      debug('Visual search response parsed', { 
        data: {
          type: 'info',
          sessionId: data.sessionId,
          category: data.results?.openai?.category,
          description: data.results?.openai?.description,
          labels: data.results?.description?.labels?.length || 0,
          entities: data.results?.vision?.webEntities?.length || 0
        }
      });


      if (!data.success) {
        debug('Visual search failed', { type: 'error', data });
        throw new Error(data.message || 'Search failed');
      }

      // Set sessionId from test data
      debug('Using session ID:', { data: { type: 'info', sessionId } });

      // Process and structure the results
      debug('Processing visual search results', { 
        type: 'info',
        data: {
          openai: data.results.openai,
          description: data.results.vision.description,
          webEntities: data.results.vision.webEntities?.length,
          webLabels: data.results.vision.webLabels?.length
        }
      });

      const processedResults = {
        openai: data.results.openai,
        description: data.results.vision.description,
        webEntities: data.results.vision.webEntities,
        webLabels: data.results.vision.webLabels,
        derivedSubjects: data.results.vision.derivedSubjects,
        matches: data.results.vision.matches,
        pagesWithMatchingImages: data.results.vision.pagesWithMatchingImages
      };

      setSearchResults(processedResults);
      debug('Search results state updated', { data: processedResults });
      debug('Visual search completed with full results', { 
        type: 'info',
        data: {
          openai: processedResults.openai,
          description: processedResults.description,
          webEntities: processedResults.webEntities?.length,
          webLabels: processedResults.webLabels?.length,
          matches: {
            exact: processedResults.matches?.exact?.length,
            partial: processedResults.matches?.partial?.length,
            similar: processedResults.matches?.similar?.length
          },
          pagesWithMatchingImages: processedResults.pagesWithMatchingImages?.length
        }
      });
    } catch (err) {
      debug('Visual search error', { 
        type: 'error', 
        data: err instanceof Error ? err.message : 'Unknown error'
      });
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      debug('Visual search process completed');
      setIsSearching(false);
    }
  };

  const submitEmail = async (email: string) => {
    if (!sessionId) return;

    setIsSubmittingEmail(true);
    debug('Submitting email', { data: { email, sessionId } });
    
    setError(null);
    try {
      const response = await fetch(`${API_URL}/submit-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          sessionId 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit email');
      }

      setUserEmail(email);
      debug('Email submitted successfully');
      return true;

    } catch (err) {
      debug('Email submission error', { 
        type: 'error',
        data: err instanceof Error ? err.message : 'Unknown error'
      });
      setError(err instanceof Error ? err.message : 'Failed to submit email');
      return false;
    }
  };

  return {
    uploadImage,
    startVisualSearch,
    testVisualSearch,
    submitEmail,
    analyzeOrigin,
    isUploading,
    currentStep,
    isSearching,
    isAnalyzingOrigin,
    customerImage,
    sessionId,
    error,
    searchResults,
    userEmail,
    originResults
  };
}
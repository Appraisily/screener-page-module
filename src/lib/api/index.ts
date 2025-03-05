import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { 
  SearchResults, 
  OriginResults, 
  OpenAIAnalysisResults
} from '../../types';

// Define API response interfaces
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: any;
  } | null;
  data: T | null;
}

interface VisualSearchResponse {
  success: boolean;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: any;
  } | null;
  results: {
    vision?: {
      description?: any;
      webEntities?: any[];
      webLabels?: any[];
      derivedSubjects?: any[];
      matches?: {
        exact: any[];
        partial: any[];
        similar: any[];
      };
      pagesWithMatchingImages?: any[];
    };
    openai?: any;
    analyzed?: boolean;
    analysisTimestamp?: number;
  };
}

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle FormData content type properly
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('[API Error] Request failed:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for standardizing response format
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[API Error] Response failed:', error);
    return Promise.reject(parseAxiosError(error));
  }
);

// Error handling utility
function parseAxiosError(error: AxiosError): Error {
  // Network or timeout errors
  if (error.code === 'ECONNABORTED') {
    return new Error('Request timed out. Please try again.');
  }
  
  if (!error.response) {
    return new Error('Network error. Please check your connection.');
  }
  
  // API errors with response
  const status = error.response.status;
  const data = error.response.data as any;
  
  // Try to extract error message from response
  const message = data?.error?.message || 
                  data?.message || 
                  `Request failed with status ${status}`;
                  
  const apiError = new Error(message);
  (apiError as any).statusCode = status;
  (apiError as any).apiError = data?.error || null;
  
  return apiError;
}

// Utility for logging API calls
function logApiCall(method: string, endpoint: string, params?: any) {
  console.log(`[API] ${method} ${endpoint}`, params || '');
}

/**
 * All API methods are centralized here
 */
const api = {
  /**
   * Image Upload API
   */
  uploadImage: async (file: File, sessionId?: string): Promise<{sessionId: string, imageUrl: string}> => {
    logApiCall('POST', '/upload-temp');
    
    const formData = new FormData();
    formData.append('image', file);
    
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }
    
    try {
      const response = await apiClient.post<ApiResponse<{sessionId: string, imageUrl: string}>>('/upload-temp', formData);
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Image upload failed');
      }
      
      return response.data.data!;
    } catch (error) {
      console.error('[API Error] Upload failed:', error);
      throw error;
    }
  },
  
  /**
   * Visual Search API
   */
  visualSearch: async (sessionId: string): Promise<SearchResults> => {
    logApiCall('POST', '/visual-search', { sessionId });
    
    try {
      const response = await apiClient.post<VisualSearchResponse>('/visual-search', { 
        sessionId 
      });
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Visual search failed');
      }
      
      // Process and standardize results
      const searchResults: SearchResults = {
        openai: data.results?.openai || {},
        description: data.results?.vision?.description || {},
        webEntities: data.results?.vision?.webEntities || [],
        webLabels: data.results?.vision?.webLabels || [],
        derivedSubjects: data.results?.vision?.derivedSubjects || [],
        matches: {
          exact: data.results?.vision?.matches?.exact || [],
          partial: data.results?.vision?.matches?.partial || [],
          similar: data.results?.vision?.matches?.similar || []
        },
        pagesWithMatchingImages: data.results?.vision?.pagesWithMatchingImages || []
      };
      
      return searchResults;
    } catch (error) {
      console.error('[API Error] Visual search failed:', error);
      throw error;
    }
  },
  
  /**
   * Origin Analysis API
   */
  originAnalysis: async (sessionId: string): Promise<OriginResults> => {
    logApiCall('POST', '/origin-analysis', { sessionId });
    
    try {
      const response = await apiClient.post<ApiResponse<OriginResults>>('/origin-analysis', { 
        sessionId 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Origin analysis failed');
      }
      
      return response.data.data!;
    } catch (error) {
      console.error('[API Error] Origin analysis failed:', error);
      throw error;
    }
  },
  
  /**
   * OpenAI Analysis API
   */
  openAIAnalysis: async (sessionId: string): Promise<OpenAIAnalysisResults> => {
    logApiCall('POST', '/openai-analysis', { sessionId });
    
    try {
      const response = await apiClient.post<ApiResponse<OpenAIAnalysisResults>>('/openai-analysis', { 
        sessionId 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'OpenAI analysis failed');
      }
      
      return response.data.data!;
    } catch (error) {
      console.error('[API Error] OpenAI analysis failed:', error);
      throw error;
    }
  },
  
  /**
   * Value Estimation API
   */
  valueEstimation: async (sessionId: string, options?: any): Promise<any> => {
    logApiCall('POST', '/find-value', { sessionId, ...options });
    
    try {
      const response = await apiClient.post<ApiResponse<any>>('/find-value', { 
        sessionId,
        ...options
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Value estimation failed');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('[API Error] Value estimation failed:', error);
      throw error;
    }
  },
  
  /**
   * Email Submission API
   */
  submitEmail: async (email: string, sessionId: string): Promise<boolean> => {
    logApiCall('POST', '/email-submission', { email, sessionId });
    
    try {
      const response = await apiClient.post<ApiResponse<{success: boolean}>>('/email-submission', { 
        email,
        sessionId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Email submission failed');
      }
      
      return response.data.data?.success || false;
    } catch (error) {
      console.error('[API Error] Email submission failed:', error);
      throw error;
    }
  },
  
  /**
   * Full Analysis API
   */
  fullAnalysis: async (sessionId: string): Promise<OpenAIAnalysisResults> => {
    logApiCall('POST', '/full-analysis', { sessionId });
    
    try {
      const response = await apiClient.post<ApiResponse<OpenAIAnalysisResults>>('/full-analysis', { 
        sessionId 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Full analysis failed');
      }
      
      return response.data.data!;
    } catch (error) {
      console.error('[API Error] Full analysis failed:', error);
      throw error;
    }
  }
};

export default api; 
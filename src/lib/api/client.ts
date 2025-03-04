import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../../hooks/useErrorHandler';

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

interface StandardApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
}

// Response interceptor for handling the standardized format
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.debug(`[Debug] API Response (${response.config.url}):`, response.status, response.data);
    
    // Check if the response follows our standard format
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 
        'success' in responseData && typeof responseData.success === 'boolean') {
      
      if (responseData.success === true && 
          'data' in responseData && 
          responseData.data !== null && 
          responseData.data !== undefined) {
        // Return just the data for successful requests
        console.debug('[Debug] Extracted data from standardized response:', responseData.data);
        return responseData.data;
      } else if ('error' in responseData && responseData.error) {
        // For unsuccessful responses with 2xx status, create and throw an error
        const error = new Error(
          responseData.error.message || 'Unknown error'
        ) as ApiError;
        error.code = responseData.error.code || 'UNKNOWN_ERROR';
        error.details = responseData.error.details || null;
        error.response = response;
        return Promise.reject(error);
      }
    }
    
    // For responses not following our format, return as is
    return response.data;
  },
  (error: AxiosError) => {
    console.debug(`[Debug] API Error:`, error.message);
    
    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Unable to connect to the server. Please check your internet connection.') as ApiError;
      networkError.code = 'NETWORK_ERROR';
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    
    console.debug(`[Debug] API Error Response:`, error.response.status, error.response.data);
    
    // Handle API errors with error response format
    const responseData = error.response.data as any;
    if (responseData && typeof responseData === 'object' && 'error' in responseData && responseData.error) {
      const apiError = new Error(
        responseData.error.message || 'An error occurred'
      ) as ApiError;
      apiError.code = responseData.error.code;
      apiError.details = responseData.error.details;
      apiError.status = error.response.status;
      apiError.response = error.response;
      return Promise.reject(apiError);
    }
    
    // Handle unexpected error formats
    const fallbackError = new Error(
      responseData?.message || 'An unexpected error occurred'
    ) as ApiError;
    fallbackError.code = 'UNKNOWN_ERROR';
    fallbackError.status = error.response.status;
    fallbackError.response = error.response;
    fallbackError.originalError = error;
    return Promise.reject(fallbackError);
  }
);

// API method wrappers
const api = {
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
  
  // Custom methods for specific endpoints with proper return types
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    console.debug('[Debug] Making upload request to:', `${apiClient.defaults.baseURL}/upload-temp`);
    
    try {
      const response = await apiClient.post('/upload-temp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.debug('[Debug] Upload response status:', response.status);
      console.debug('[Debug] Upload response data:', response.data);
      console.debug('[Debug] Response type:', typeof response.data);
      
      // Check for our specific API response format {success: true, data: {...}, error: null}
      const responseData = response.data;
      if (responseData && typeof responseData === 'object' && 
          'success' in responseData && responseData.success === true && 
          'data' in responseData && responseData.data && 
          typeof responseData.data === 'object') {
        console.debug('[Debug] Found standardized API response format');
        
        // Extract data from the nested data object
        const data = responseData.data;
        
        if ('imageUrl' in data && 'sessionId' in data) {
          console.debug('[Debug] Successfully extracted fields from data object');
          return {
            imageUrl: data.imageUrl,
            sessionId: data.sessionId
          };
        }
      }
      
      // If we have direct access to the expected fields, return them
      if (responseData && typeof responseData === 'object' && 
          'imageUrl' in responseData && 'sessionId' in responseData) {
        console.debug('[Debug] Found direct imageUrl and sessionId in response');
        return {
          imageUrl: responseData.imageUrl,
          sessionId: responseData.sessionId
        };
      }
      
      console.debug('[Debug] Direct fields not found, trying to extract from nested structure');
      
      // If the response has data but not in the expected format, try to extract it
      // This is defensive coding to handle potential API inconsistencies
      if (responseData && typeof responseData === 'object') {
        // Try to find the data in different possible locations based on the response structure
        let extractedData = responseData;
        
        // Handle nested data structure
        if ('data' in responseData && responseData.data && typeof responseData.data === 'object') {
          console.debug('[Debug] Found nested data object, extracting from there');
          extractedData = responseData.data;
        }
        
        // Extract using various potential property names
        const imageUrl = 
          ('imageUrl' in extractedData) ? extractedData.imageUrl : 
          ('image_url' in extractedData) ? extractedData.image_url : 
          ('url' in extractedData) ? extractedData.url : '';
          
        const sessionId = 
          ('sessionId' in extractedData) ? extractedData.sessionId : 
          ('session_id' in extractedData) ? extractedData.session_id : 
          ('id' in extractedData) ? extractedData.id : '';
        
        const extracted = {
          imageUrl,
          sessionId
        };
        
        console.debug('[Debug] Extracted values:', extracted);
        
        if (extracted.imageUrl && extracted.sessionId) {
          console.debug('[Debug] Successfully extracted required fields');
          return extracted;
        }
      }
      
      console.error('[Debug] Failed to extract required data from response:', responseData);
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('[Debug] Upload request failed:', error);
      throw error;
    }
  },
  
  getSession: (sessionId: string) => apiClient.get(`/session/${sessionId}`),
  
  submitEmail: (data: { email: string, sessionId: string, name?: string, subscribeToNewsletter?: boolean }) => apiClient.post('/submit-email', data),
  
  runVisualSearch: (sessionId: string) => apiClient.post('/visual-search', { sessionId }),
  
  getOriginAnalysis: (sessionId: string) => apiClient.post('/origin-analysis', { sessionId }),

  analyzeWithOpenAI: (sessionId: string) => apiClient.post('/full-analysis', { sessionId }),
  
  findValue: (sessionId: string) => apiClient.post('/find-value', { sessionId }),
};

export default api; 
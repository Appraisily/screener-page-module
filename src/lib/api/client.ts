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
    // Check if the response follows our standard format
    const apiResponse = response.data as StandardApiResponse;
    if (apiResponse && typeof apiResponse.success === 'boolean') {
      if (apiResponse.success) {
        // Return just the data for successful requests
        return apiResponse.data;
      } else if (apiResponse.error) {
        // For unsuccessful responses with 2xx status, create and throw an error
        const error = new Error(apiResponse.error.message || 'Unknown error') as ApiError;
        error.code = apiResponse.error.code || 'UNKNOWN_ERROR';
        error.details = apiResponse.error.details || null;
        error.response = response;
        return Promise.reject(error);
      }
    }
    
    // For responses not following our format, return as is
    return response.data;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Unable to connect to the server. Please check your internet connection.') as ApiError;
      networkError.code = 'NETWORK_ERROR';
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    
    // Handle API errors with error response format
    const responseData = error.response.data as any;
    if (responseData && responseData.error) {
      const apiError = new Error(responseData.error.message || 'An error occurred') as ApiError;
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
    
    const response = await apiClient.post('/upload-temp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // The response interceptor will extract data
  },
  
  getSession: (sessionId: string) => apiClient.get(`/session/${sessionId}`),
  
  submitEmail: (data: { email: string, sessionId: string }) => apiClient.post('/submit-email', data),
  
  runVisualSearch: (sessionId: string) => apiClient.post(`/visual-search/${sessionId}`),
  
  getOriginAnalysis: (sessionId: string) => apiClient.get(`/origin-analysis/${sessionId}`),

  analyzeWithOpenAI: (sessionId: string) => apiClient.post(`/openai-analysis/${sessionId}`),
};

export default api; 
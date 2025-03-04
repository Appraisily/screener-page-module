import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../../hooks/useErrorHandler';

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
      // Remove Content-Type header to let the browser set it with boundary parameter
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[Debug] Request interceptor error:', error);
    return Promise.reject(error);
  }
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

// Define types for error response structures
interface ApiErrorDetails {
  code?: string;
  message?: string;
  details?: Record<string, any>;
  [key: string]: any;
}

// Adding a type guard for checking object with string properties
function isObjectWithStringProps(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object';
}

// Response interceptor to standardize API responses
apiClient.interceptors.response.use(
  (response) => {
    // Check if the response is in our API format {success, data, error}
    const responseData = response.data;
    
    console.debug('[Debug] API Response (' + response.config.url + '):', response.status, responseData);
    
    // Return the original response data - we'll handle specific formatting in each method
    return responseData;
  },
  (error: AxiosError) => {
    console.error('[Debug] API request failed:', error);
    
    // Extract response data with proper type checking
    const responseData = error.response?.data as any;
    
    // Create a standard error format
    const fallbackError = new Error(
      (isObjectWithStringProps(responseData) && responseData.message) || 
      error.message || 
      'Network Error'
    );
    
    (fallbackError as any).code = error.response?.status 
      ? `HTTP_${error.response.status}` 
      : 'NETWORK_ERROR';
      
    (fallbackError as any).details = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText
    };
    
    // Try to extract more meaningful error info from response
    if (responseData) {
      // Check for our API error format first
      if (isObjectWithStringProps(responseData) && 
          'error' in responseData && 
          isObjectWithStringProps(responseData.error)) {
        
        (fallbackError as any).message = responseData.error.message || (fallbackError as any).message;
        (fallbackError as any).code = responseData.error.code || (fallbackError as any).code;
        
        if (isObjectWithStringProps(responseData.error) && responseData.error.details) {
          (fallbackError as any).details = {
            ...(fallbackError as any).details,
            ...(responseData.error.details as Record<string, any>)
          };
        }
      }
      // Try to find error messages in other formats
      else if (isObjectWithStringProps(responseData)) {
        // Look for common error message fields
        for (const field of ['message', 'error', 'errorMessage', 'error_message', 'description']) {
          if (field in responseData && typeof responseData[field] === 'string') {
            (fallbackError as any).message = responseData[field];
            break;
          }
        }
      }
      // If it's just a string error
      else if (typeof responseData === 'string' && responseData.trim()) {
        (fallbackError as any).message = responseData;
      }
    }
    
    (fallbackError as any).originalError = error;
    return Promise.reject(fallbackError);
  }
);

// API method wrappers
const api = {
  get: <T = any>(url: string, config?: any): Promise<T> => apiClient.get(url, config),
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> => apiClient.post(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> => apiClient.put(url, data, config),
  delete: <T = any>(url: string, config?: any): Promise<T> => apiClient.delete(url, config),
  
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
      
      console.debug('[Debug] Raw upload response:', response);
      
      // If the response is null or undefined, throw an error
      if (response === undefined || response === null) {
        console.error('[Debug] Response is null or undefined');
        throw new Error('Empty response from server');
      }
      
      // CASE 1: Standard API response format with success/data/error
      if (isObjectWithStringProps(response) && 'success' in response) {
        console.debug('[Debug] Found standard API response format');
        
        if (response.success === true && 'data' in response && isObjectWithStringProps(response.data)) {
          console.debug('[Debug] Success response with data:', response.data);
          
          const data = response.data;
          // Check if data contains our required fields directly
          if ('imageUrl' in data && 'sessionId' in data) {
            console.debug('[Debug] Found imageUrl and sessionId in data');
            return {
              imageUrl: data.imageUrl as string,
              sessionId: data.sessionId as string
            };
          }
        } else if (!response.success && 'error' in response && response.error) {
          console.error('[Debug] API error response:', response.error);
          throw new Error(
            isObjectWithStringProps(response.error) && 'message' in response.error
              ? response.error.message as string
              : 'API Error'
          );
        }
      }
      
      // CASE 2: Direct fields in response
      if (isObjectWithStringProps(response) && 'imageUrl' in response && 'sessionId' in response) {
        console.debug('[Debug] Found imageUrl and sessionId directly in response');
        return {
          imageUrl: response.imageUrl as string,
          sessionId: response.sessionId as string
        };
      }
      
      // CASE 3: Flexible field search in response or nested objects
      if (isObjectWithStringProps(response)) {
        console.debug('[Debug] Searching for fields in response structure');
        
        // Extract potential data object
        let dataObject = response;
        
        // If there's a data field, focus on that
        if ('data' in response && isObjectWithStringProps(response.data)) {
          dataObject = response.data;
          console.debug('[Debug] Focusing on data object:', dataObject);
        }
        
        // Try to find fields with various naming conventions
        let imageUrl = '';
        let sessionId = '';
        
        // Find imageUrl field
        for (const key of ['imageUrl', 'image_url', 'url', 'image', 'path', 'file_url']) {
          if (key in dataObject && typeof dataObject[key] === 'string') {
            imageUrl = dataObject[key] as string;
            console.debug(`[Debug] Found image URL in field "${key}": ${imageUrl}`);
            break;
          }
        }
        
        // Find sessionId field
        for (const key of ['sessionId', 'session_id', 'id', 'session', 'uuid']) {
          if (key in dataObject && typeof dataObject[key] === 'string') {
            sessionId = dataObject[key] as string;
            console.debug(`[Debug] Found session ID in field "${key}": ${sessionId}`);
            break;
          }
        }
        
        // If we found both required fields
        if (imageUrl && sessionId) {
          console.debug('[Debug] Successfully extracted fields:', { imageUrl, sessionId });
          return { imageUrl, sessionId };
        }
        
        // Deep search in nested objects
        const deepFind = (obj: Record<string, any>, target: string): string | null => {
          if (!isObjectWithStringProps(obj)) return null;
          
          // Direct match
          for (const key of Object.keys(obj)) {
            if (key.toLowerCase().includes(target.toLowerCase()) && typeof obj[key] === 'string') {
              return obj[key] as string;
            }
          }
          
          // Recursive search
          for (const key of Object.keys(obj)) {
            if (isObjectWithStringProps(obj[key])) {
              const result = deepFind(obj[key], target);
              if (result) return result;
            }
          }
          
          return null;
        };
        
        // Try deep search if we couldn't find them directly
        if (!imageUrl) {
          const found = deepFind(response, 'image');
          if (found) {
            imageUrl = found;
            console.debug(`[Debug] Deep found image URL: ${imageUrl}`);
          }
        }
        
        if (!sessionId) {
          const found = deepFind(response, 'session');
          if (found) {
            sessionId = found;
            console.debug(`[Debug] Deep found session ID: ${sessionId}`);
          }
        }
        
        // If we found both required fields via deep search
        if (imageUrl && sessionId) {
          console.debug('[Debug] Successfully extracted fields via deep search:', { imageUrl, sessionId });
          return { imageUrl, sessionId };
        }
      }
      
      // Log the full response for debugging
      console.error('[Debug] Could not extract required fields from response:', response);
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('[Debug] Upload request failed:', error);
      throw error;
    }
  },
  
  getSession: <T = any>(sessionId: string): Promise<T> => apiClient.get(`/session/${sessionId}`),
  
  submitEmail: <T = any>(data: { email: string, sessionId: string, name?: string, subscribeToNewsletter?: boolean }): Promise<T> => 
    apiClient.post('/submit-email', data),
  
  runVisualSearch: <T = any>(sessionId: string): Promise<T> => 
    apiClient.post('/visual-search', { sessionId }),
  
  getOriginAnalysis: <T = any>(sessionId: string): Promise<T> => 
    apiClient.post('/origin-analysis', { sessionId }),

  analyzeWithOpenAI: <T = any>(sessionId: string): Promise<T> => 
    apiClient.post('/full-analysis', { sessionId }),
  
  findValue: <T = any>(sessionId: string): Promise<T> => 
    apiClient.post('/find-value', { sessionId }),
};

export default api; 
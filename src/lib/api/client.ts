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
    
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      // Return standardized response data
      if (responseData.success === true) {
        console.debug('[Debug] Extracted data from standardized response:', responseData.data);
        return responseData.data;
      } else if (responseData.error) {
        console.error('[Debug] API Error:', responseData.error);
        
        // Create standardized API error
        const apiError = new Error(responseData.error?.message || 'Unknown API Error');
        (apiError as any).code = responseData.error?.code || 'API_ERROR';
        (apiError as any).details = responseData.error?.details || {};
        (apiError as any).originalData = responseData;
        
        return Promise.reject(apiError);
      }
    }
    
    // If not in our API format, just return the data as-is
    return response.data;
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
      
      console.debug('[Debug] Upload response status:', response.status);
      console.debug('[Debug] Raw response data:', JSON.stringify(response.data));
      console.debug('[Debug] Response type:', typeof response.data);
      
      // If the response is null or undefined, throw an error
      if (!response.data) {
        console.error('[Debug] Response data is null or undefined');
        throw new Error('Empty response from server');
      }
      
      const responseData = response.data as Record<string, any>;
      
      // Log all available keys in the response for debugging
      if (isObjectWithStringProps(responseData)) {
        console.debug('[Debug] Response keys:', Object.keys(responseData));
      }
      
      // Check for our specific API response format {success: true, data: {...}, error: null}
      if (isObjectWithStringProps(responseData) && 
          'success' in responseData && responseData.success === true && 
          'data' in responseData && isObjectWithStringProps(responseData.data)) {
        console.debug('[Debug] Found standardized API response format');
        
        // Extract data from the nested data object
        const data = responseData.data;
        console.debug('[Debug] Data keys:', Object.keys(data));
        
        if ('imageUrl' in data && 'sessionId' in data) {
          console.debug('[Debug] Successfully extracted fields from data object');
          return {
            imageUrl: data.imageUrl as string,
            sessionId: data.sessionId as string
          };
        }
      }
      
      // If we have direct access to the expected fields, return them
      if (isObjectWithStringProps(responseData) && 
          'imageUrl' in responseData && 'sessionId' in responseData) {
        console.debug('[Debug] Found direct imageUrl and sessionId in response');
        return {
          imageUrl: responseData.imageUrl as string,
          sessionId: responseData.sessionId as string
        };
      }
      
      console.debug('[Debug] Direct fields not found, trying to extract from nested structure');
      
      // Try an even more flexible approach to find the fields
      if (isObjectWithStringProps(responseData)) {
        // Try to find the data in different possible locations based on the response structure
        let extractedData = responseData;
        
        // Handle nested data structure
        if ('data' in responseData && isObjectWithStringProps(responseData.data)) {
          console.debug('[Debug] Found nested data object, extracting from there');
          extractedData = responseData.data;
        }
        
        // Try to find image URL with various key formats
        let imageUrl = '';
        for (const key of ['imageUrl', 'image_url', 'url', 'image', 'path', 'file_url']) {
          if (key in extractedData && typeof extractedData[key] === 'string') {
            imageUrl = extractedData[key] as string;
            console.debug(`[Debug] Found image URL in field "${key}": ${imageUrl}`);
            break;
          }
        }
        
        // Try to find session ID with various key formats
        let sessionId = '';
        for (const key of ['sessionId', 'session_id', 'id', 'session', 'uuid']) {
          if (key in extractedData && typeof extractedData[key] === 'string') {
            sessionId = extractedData[key] as string;
            console.debug(`[Debug] Found session ID in field "${key}": ${sessionId}`);
            break;
          }
        }
        
        // If we still can't find the fields, try recursively searching in nested objects
        if ((!imageUrl || !sessionId) && extractedData) {
          console.debug('[Debug] Trying deep search for fields in nested objects');
          for (const key in extractedData) {
            const value = extractedData[key];
            if (isObjectWithStringProps(value)) {
              // Check this nested object for our fields
              if (!imageUrl) {
                for (const imgKey of ['imageUrl', 'image_url', 'url', 'image', 'path']) {
                  if (imgKey in value && typeof value[imgKey] === 'string') {
                    imageUrl = value[imgKey] as string;
                    console.debug(`[Debug] Found nested image URL in ${key}.${imgKey}: ${imageUrl}`);
                    break;
                  }
                }
              }
              
              if (!sessionId) {
                for (const sidKey of ['sessionId', 'session_id', 'id', 'session', 'uuid']) {
                  if (sidKey in value && typeof value[sidKey] === 'string') {
                    sessionId = value[sidKey] as string;
                    console.debug(`[Debug] Found nested session ID in ${key}.${sidKey}: ${sessionId}`);
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (imageUrl && sessionId) {
          console.debug('[Debug] Successfully extracted values using flexible search');
          return { imageUrl, sessionId };
        }
      }
      
      // As a last resort, if we only have a session ID but no image URL, 
      // we could construct the image URL from the session ID if we know the pattern
      if (isObjectWithStringProps(responseData)) {
        let sessionId = '';
        
        // Try to find session ID anywhere in the response
        const findSessionId = (obj: Record<string, any>, prefix = ''): void => {
          if (!isObjectWithStringProps(obj)) return;
          
          for (const key in obj) {
            const path = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            
            if (key.toLowerCase().includes('session') && typeof value === 'string') {
              console.debug(`[Debug] Potential session ID found at ${path}: ${value}`);
              sessionId = value;
              return;
            } else if (isObjectWithStringProps(value)) {
              findSessionId(value, path);
            }
          }
        };
        
        findSessionId(responseData);
        
        if (sessionId) {
          // If we have a session ID but no image URL, we might be able to construct one
          console.debug('[Debug] Found session ID but no image URL. Attempting to construct URL.');
          // This is just an example pattern - adjust based on your actual URL structure
          const constructedImageUrl = `${apiClient.defaults.baseURL}/images/${sessionId}`;
          console.debug(`[Debug] Constructed image URL: ${constructedImageUrl}`);
          
          return {
            sessionId,
            imageUrl: constructedImageUrl
          };
        }
      }
      
      console.error('[Debug] Failed to extract required data from response:', responseData);
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
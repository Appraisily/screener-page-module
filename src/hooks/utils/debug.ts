/**
 * Simple debug utility for logging messages with structured data
 */

interface DebugOptions {
  type?: 'info' | 'warn' | 'error';
  data?: any;
}

/**
 * Debug utility function for consistent logging across the application
 * 
 * @param message The debug message to log
 * @param options Optional configuration or data to include with the message
 */
export const debug = (message: string, options?: DebugOptions | Record<string, any>) => {
  // Only log in development mode or if explicitly enabled
  if (import.meta.env.MODE !== 'production' || import.meta.env.VITE_DEBUG === 'true') {
    // If options is just a data object (not DebugOptions)
    if (options && !('type' in options) && !('data' in options)) {
      console.log(`[Debug] ${message}`, options || '');
      return;
    }
    
    // Handle as DebugOptions
    const { type = 'info', data } = (options as DebugOptions) || {};
    
    switch (type) {
      case 'warn':
        console.warn(`[Debug] ${message}`, data);
        break;
      case 'error':
        console.error(`[Debug] ${message}`, data);
        break;
      default:
        console.log(`[Debug] ${message}`, data);
    }
  }
};

/**
 * Safely stringify an object for debugging
 * Works for circular references and handles large objects
 */
export const safeStringify = (obj: any, indent: number = 2): string => {
  let cache: any[] = [];
  const stringified = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Handle circular references
        if (cache.indexOf(value) !== -1) {
          return '[Circular Reference]';
        }
        cache.push(value);
      }
      return value;
    },
    indent
  );
  cache = []; // Enable garbage collection
  return stringified;
};
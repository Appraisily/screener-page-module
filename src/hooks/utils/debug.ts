/**
 * Simple debug utility for logging messages with structured data
 */

interface DebugOptions {
  type?: 'info' | 'warn' | 'error';
  data?: any;
}

export const debug = (message: string, options?: DebugOptions) => {
  if (import.meta.env.MODE !== 'production') {
    const { type = 'info', data } = options || {};
    
    switch (type) {
      case 'warn':
        console.warn(`[Debug] ${message}`, data);
        break;
      case 'error':
        console.error(`[Debug] ${message}`, data);
        break;
      default:
        console.debug(`[Debug] ${message}`, data);
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
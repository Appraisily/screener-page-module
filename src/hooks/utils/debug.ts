/**
 * Simple debug utility for logging messages with structured data
 */

interface DebugOptions {
  type?: 'info' | 'warn' | 'error';
  data?: any;
  sessionId?: string;
  processedResults?: any;
}

export function debug(message: string, options: DebugOptions = {}) {
  const { type = 'info', data, sessionId, processedResults } = options;
  
  // Only log in development environment
  if (import.meta.env.MODE !== 'production') {
    const formattedTime = new Date().toISOString().split('T')[1].substring(0, 8);
    const prefix = `[${formattedTime}]`;
    
    const logData = {
      ...(data && { data }),
      ...(sessionId && { sessionId }),
      ...(processedResults && { processedResults })
    };
    
    switch (type) {
      case 'info':
        console.log(`${prefix} ${message}`, Object.keys(logData).length ? logData : '');
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, Object.keys(logData).length ? logData : '');
        break;
      case 'error':
        console.error(`${prefix} ${message}`, Object.keys(logData).length ? logData : '');
        break;
      default:
        console.log(`${prefix} ${message}`, Object.keys(logData).length ? logData : '');
    }
  }
}
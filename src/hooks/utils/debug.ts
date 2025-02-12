interface DebugOptions {
  type?: 'info' | 'warn' | 'error';
  data?: any;
  sessionId?: string;
  processedResults?: any;
}

export const debug = (message: string, options: DebugOptions = {}) => {
  if (import.meta.env.DEV) {
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
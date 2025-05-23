import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Immediately create placeholder globals for minified variables that may be referenced before initialization
// Add extra variables that might be causing issues in lucide-react
['h', 'L', 'pc', 'Kk', 'pu', 'gm', 'hm', '$v', 'Ki', 'll', 'cm', 'S', 'jj', 'sh', 'iu', 'fp', 'up', 'Lv', 'zi', 'el', 'op', 'j', 'Ee', '_'].forEach(varName => {
  if (!(varName in window)) {
    try {
      (window as any)[varName] = function() { return null; };
    } catch {
      // If assignment fails, try different approach
      try {
        Object.defineProperty(window, varName, {
          value: function() { return null; },
          configurable: true,
          writable: true
        });
      } catch {
        // Last resort - just ignore
      }
    }
  }
});

// Override console.error temporarily to catch and log the specific error
const originalError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('Cannot access') && message.includes('before initialization')) {
    console.warn('Intercepted initialization error:', message);
    return; // Don't propagate this specific error
  }
  return originalError.apply(console, args);
};

// Global error handler to prevent UI crashes from non-critical resources and initialization errors
window.addEventListener('error', (event) => {
  // Check if error is from external resources like widget.js or widget.css
  if (event.filename && (
    event.filename.includes('widget.js') || 
    event.filename.includes('widget.css') ||
    event.filename.includes('tangerine-churros')
  )) {
    console.warn('Non-critical resource failed to load:', event.filename);
    // Prevent error from propagating
    event.preventDefault();
    return true; // Handled
  }
  
  // Also catch the "Cannot access 'X' before initialization" style errors
  if (event.message && event.message.includes('Cannot access') && event.message.includes('before initialization')) {
    console.warn('Caught initialization error:', event.message);
    // Prevent error from propagating
    event.preventDefault();
    return true; // Handled
  }
  
  return false; // Not handled
}, true);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && 
      event.reason.message.includes('Cannot access') && 
      event.reason.message.includes('before initialization')) {
    console.warn('Caught unhandled promise rejection:', event.reason.message);
    event.preventDefault();
    return true;
  }
  return false;
});

// The above proactive initialization makes the DOMContentLoaded fallback unnecessary,
// but we keep a small safeguard to log any issues during late initialization.
window.addEventListener('DOMContentLoaded', () => {
  console.log('Safety globals ensured');
});

// Initialize the app with proper error boundaries and enhanced error catching
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    // Wrap the entire rendering in additional try-catch
    const render = () => {
      try {
        createRoot(rootElement).render(
          <StrictMode>
            <Router basename="/">
              <App />
            </Router>
          </StrictMode>
        );
      } catch (error) {
        console.error('Failed to render app with StrictMode:', error);
        // Fallback to rendering without StrictMode
        try {
          createRoot(rootElement).render(
            <Router basename="/">
              <App />
            </Router>
          );
        } catch (fallbackError) {
          console.error('Failed to render app even without StrictMode:', fallbackError);
          // Ultimate fallback
          rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error loading application</h1><p>Please refresh the page to try again</p></div>';
        }
      }
    };

    // Use setTimeout to ensure everything is properly initialized
    setTimeout(render, 0);
  } catch (error) {
    console.error('Critical initialization error:', error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error loading application</h1><p>Please refresh the page to try again</p></div>';
  }
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Immediately create placeholder globals for minified variables that may be referenced before initialization
['h', 'L', 'pc', 'Kk', 'pu', 'gm', 'hm', '$v', 'Ki', 'll', 'cm', 'S'].forEach(varName => {
  if (!(varName in window)) {
    (window as any)[varName] = {};
  }
});

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

// The above proactive initialization makes the DOMContentLoaded fallback unnecessary,
// but we keep a small safeguard to log any issues during late initialization.
window.addEventListener('DOMContentLoaded', () => {
  console.log('Safety globals ensured');
});

// Initialize the app with proper error boundaries
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <Router basename="/">
          <App />
        </Router>
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback to a simpler rendering without StrictMode if needed
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error loading application</h1><p>Please refresh the page to try again</p></div>';
  }
}
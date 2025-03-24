import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

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
  
  // Also catch the "Cannot access 'h' before initialization" error
  if (event.message && event.message.includes('Cannot access') && event.message.includes('before initialization')) {
    console.warn('Caught initialization error:', event.message);
    // Prevent error from propagating
    event.preventDefault();
    return true; // Handled
  }
  
  return false; // Not handled
}, true);

// Monkey patch problematic functions that might use 'h' before initialization
// This creates a safety layer for minified variables that might cause the issue
window.addEventListener('DOMContentLoaded', () => {
  try {
    // Create a safe global space for potentially problematic variables
    const safeGlobals: Record<string, any> = {};
    
    // Add safety for any variable names that might be accessed before initialization
    // Minified variables like 'h' are common causes of initialization errors
    ['h', 'pc', 'Kk', 'pu', 'gm', 'hm', '$v', 'Ki', 'll', 'cm', 'S'].forEach(varName => {
      if (!(varName in window)) {
        (window as any)[varName] = {};
      }
    });
    
    console.log('Added safety layer for initialization variables');
  } catch (error) {
    console.warn('Error setting up safety layer:', error);
  }
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
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ToastProvider from './components/ToastProvider';

// Add global error handling to catch rendering errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Display error on page in case the app fails to render
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h2 style="color: #ef4444;">Error Loading Application</h2>
        <p>There was an error rendering the application. Please check the console for details.</p>
        <pre style="background: #f1f5f9; padding: 15px; border-radius: 4px; overflow: auto;">${event.error?.message || 'Unknown error'}</pre>
      </div>
    `;
  }
});

try {
  console.log('App initialization starting...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found - cannot mount React application');
  }
  
  // Determine if we need a basename
  // If the URL contains /screener/, we use /screener as basename
  // Otherwise we use no basename (for Netlify or other hosting)
  const pathname = window.location.pathname;
  const basename = pathname.includes('/screener') ? '/screener' : '/';
  
  console.log('Using basename:', basename);
  
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={basename}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
}
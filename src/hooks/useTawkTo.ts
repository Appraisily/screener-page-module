import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

/**
 * A hook to integrate Tawk.to live chat widget.
 * This was ported from the alternative implementation for future use if needed.
 * 
 * To use this hook:
 * 1. Import it in your App or layout component
 * 2. Call it once: `useTawkTo();`
 * 3. The chat widget will automatically be loaded with a 3 second delay
 */
export const useTawkTo = () => {
  useEffect(() => {
    const loadTawkTo = () => {
      try {
        const s1 = document.createElement("script");
        s1.async = true;
        s1.src = 'https://embed.tawk.to/63a083dbb0d6371309d528e2/1gklg645r';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s1.onerror = () => {
          console.warn('Tawk.to chat widget failed to load');
          // Remove the failed script
          s1.remove();
        };
        
        document.head.appendChild(s1);
        
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
      } catch (error) {
        console.warn('Error loading Tawk.to chat:', error);
      }
    };

    // Delay loading of chat widget to prioritize core content
    const timer = setTimeout(loadTawkTo, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
}; 
#!/usr/bin/env node

// Cloud Run specific build script
import { execSync } from 'child_process';

console.log('🚀 Starting Cloud Run build process...');

// Set environment variables for Cloud Run
process.env.NODE_ENV = 'production';

try {
  // Build with Vite
  console.log('📦 Building with Vite...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_API_URL: process.env.VITE_API_URL || 'https://appraisals-web-services-backend-856401495068.us-central1.run.app',
      GENERATE_SOURCEMAP: 'false'
    }
  });
  
  // Create widget files for backward compatibility
  console.log('🔧 Creating widget files for backward compatibility...');
  execSync('mkdir -p dist/assets', { stdio: 'inherit' });
  
  // Create widget.js with basic content
  const widgetJsContent = `
// Placeholder widget.js to prevent 404 errors
console.log('Widget script loaded successfully');
window.widgetLoaded = true;
`;
  
  // Create widget.css with basic content
  const widgetCssContent = `
/* Placeholder widget.css to prevent 404 errors */
.widget-loaded { display: none; }
`;
  
  // Write widget files
  execSync(`echo '${widgetJsContent}' > dist/widget.js`, { stdio: 'inherit' });
  execSync(`echo '${widgetCssContent}' > dist/widget.css`, { stdio: 'inherit' });
  
  // Also create in assets directory
  execSync(`echo '${widgetJsContent}' > dist/assets/widget.js`, { stdio: 'inherit' });
  execSync(`echo '${widgetCssContent}' > dist/assets/widget.css`, { stdio: 'inherit' });
  
  // Create placeholder for legacy Netlify paths
  execSync(`mkdir -p dist/tangerine-churros-e587f4.netlify.app`, { stdio: 'inherit' });
  execSync(`echo '${widgetJsContent}' > dist/tangerine-churros-e587f4.netlify.app/widget.js`, { stdio: 'inherit' });
  
  console.log('✅ Cloud Run build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 
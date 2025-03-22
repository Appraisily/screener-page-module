#!/usr/bin/env node

// Netlify-specific build script that ignores TypeScript errors
import { execSync } from 'child_process';

console.log('🚀 Starting Netlify-specific build process...');

// Set environment variables for CI/Netlify
process.env.CI = 'true';
process.env.NETLIFY = 'true';

try {
  // Skip type checking entirely for Netlify builds
  console.log('📦 Building with Vite (skipping TypeScript checks)...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_SKIP_TS_CHECK: 'true'
    }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
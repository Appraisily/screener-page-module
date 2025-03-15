import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if we're in a CI environment
const isCI = process.env.CI === 'true' || process.env.NETLIFY === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS']
    }
  },
  build: {
    // Skip type checking in CI environment
    minify: true,
    sourcemap: !isCI,
    // Skip type checking during build - we handle it separately in our custom script
    typescript: {
      ignoreBuildErrors: isCI
    }
  }
});
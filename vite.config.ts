import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS']
    }
  }
});
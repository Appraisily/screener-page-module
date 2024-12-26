import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodeResolve(),
    typescript({
      target: 'es2020',
      rootDir: resolve('src'),
      declaration: true,
      declarationDir: resolve('dist'),
      exclude: ['**/__tests__/**', 'node_modules/**'],
      allowSyntheticDefaultImports: true
    })
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      name: 'ArtScreener',
      formats: ['es', 'cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'lucide-react'],
      output: {
        preserveModules: true,
        preserveModuleFilenames: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lucide-react': 'Lucide'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
});

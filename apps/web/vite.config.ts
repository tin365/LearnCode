import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['monaco-editor'],
  },
  worker: {
    format: 'es',
  },
  build: {
    // Generates source maps without referencing them in the bundle, so
    // they aren't served publicly. Upload to Sentry at deploy time via
    // @sentry/vite-plugin once a Sentry project + auth token exist.
    sourcemap: 'hidden',
  },
});

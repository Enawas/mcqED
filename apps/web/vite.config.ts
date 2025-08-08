import { defineConfig } from 'vite';

export default defineConfig({
  // Purpose: Configure Vite for the QCM web application.
  // Inputs: n/a (uses defaults)
  // Outputs: compiled assets in dist directory
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
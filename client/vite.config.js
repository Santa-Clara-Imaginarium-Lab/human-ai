import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', 
  plugins: [react()],
  server: {
    port: 5173, // Local development
  },
  preview: {
    port: 5173, // Production preview
  }
});

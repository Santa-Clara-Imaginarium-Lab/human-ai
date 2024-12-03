import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Development server configuration
    port: 5173,
  },
  preview: { // Production server configuration
    port: 5173,
  }
})

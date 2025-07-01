import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Fix for direct route refresh issues in SPA (Single Page App)
  base: '/',

  build: {
    outDir: 'dist', // Output folder
  },
})

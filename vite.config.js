import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    // ✅ ensures SPA fallback: unknown routes -> index.html
    historyApiFallback: true,
  },
})

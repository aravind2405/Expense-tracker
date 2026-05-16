// i added the proxy here so the frontend can talk to the backend
// without this the browser would block requests to a different port
// any request starting with /api gets forwarded to FastAPI on port 8000
// this way i only need to run two servers and they work together automatically

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})

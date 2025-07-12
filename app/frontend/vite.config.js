import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5998,
    host: true,
    watch: {
      usePolling: true, // forces Docker to detect changes to frontend and auto update.
    },
  },
})

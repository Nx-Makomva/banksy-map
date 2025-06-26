import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ['./src/test-setup.js']
  },
    coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    reportsDirectory: './coverage',
    enabled: true,  
  }
})

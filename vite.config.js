import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'sql.js': path.resolve(__dirname, 'node_modules/sql.js'),
    }
  },
  optimizeDeps: {
    include: ['sql.js']
  }
})

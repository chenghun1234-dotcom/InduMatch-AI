import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  plugins: [],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
})

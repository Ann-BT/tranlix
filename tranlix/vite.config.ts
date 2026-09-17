import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  server: {
    // Vite blocks dev-server requests whose Host header isn't localhost by
    // default (DNS-rebinding protection) -- needed here since the dev
    // server is reached through this domain (e.g. via a tunnel/reverse
    // proxy), not directly at localhost.
    allowedHosts: ['tranlix.andrewphung.id.vn'],
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})

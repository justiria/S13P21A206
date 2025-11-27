import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  assetsInclude: ['**/*.glb'],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true, // ✅ WebSocket 프록시 설정
      }
    }
  }
})

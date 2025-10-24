import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    // CORS 프록시
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // 번들 크기 제한
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 코드 스플리팅
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@headlessui/react'],
        },
      },
    },
  },

  // 환경변수 접두사
  envPrefix: 'VITE_',
})

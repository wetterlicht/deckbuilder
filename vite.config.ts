import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/lorcana-api': {
        target: 'https://qdqauljbsttstpolacua.supabase.co/functions/v1/lorcanajson-proxy',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lorcana-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcWF1bGpic3R0c3Rwb2xhY3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTAzNjMsImV4cCI6MjA3Njk4NjM2M30.euW_DhGdeEy1UbXxY-GsRhBPieEC68g1OArVk9a1biI');
          });
        },
      },
    },
  },
})

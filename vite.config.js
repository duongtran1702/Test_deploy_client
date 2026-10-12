import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/orders': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/api/payment': {
        target: 'http://localhost:8082',
        changeOrigin: true
      },
      '/api/chaos': {
        target: 'http://localhost:8082',
        changeOrigin: true
      },
      '/order-actuator': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/order-actuator/, '/actuator')
      },
      '/payment-actuator': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/payment-actuator/, '/actuator')
      }
    }
  }
});

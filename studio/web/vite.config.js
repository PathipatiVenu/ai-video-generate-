import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {mockApi} from './mock/mockApi.js';

// MOCK=0 npm run dev  -> forward /api to a real backend at BACKEND_URL (default http://127.0.0.1:8000)
const useMock = process.env.MOCK !== '0';
const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react(), useMock ? mockApi() : null].filter(Boolean),
  server: {
    port: 5173,
    proxy: useMock ? undefined : {'/api': {target: backend, changeOrigin: true}},
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://exercisedb.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
  optimizeDeps: {
    include: ['dayjs', '@mui/material', '@mui/x-date-pickers'],
  },
});

import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        attendanceList: path.resolve(__dirname, 'attendance-list.html'),
      }
    },
    outDir: 'dist',
  },
  server: {
    open: '/index.html'
  }
});

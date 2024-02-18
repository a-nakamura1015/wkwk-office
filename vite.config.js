import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        attendanceList: 'attendance-list.html'
      }
    },
    outDir: 'dist',
  },
  server: {
    open: '/index.html' // サーバー起動時に自動で開くページを指定
  }
});

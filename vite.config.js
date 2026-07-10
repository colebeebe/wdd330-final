import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        books: resolve(__dirname, 'src/books/index.html'),
        request: resolve(__dirname, 'src/request/index.html'),
        login: resolve(__dirname, 'src/login/index.html'),
      },
    },
  },
});

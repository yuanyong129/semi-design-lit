import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 8888,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@web-lit': resolve(__dirname, '../web-lit'),
    }
  }
});

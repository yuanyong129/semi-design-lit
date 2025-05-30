import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  server: {
    port: 8888,
  },
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@web-lit': resolve(__dirname, '../web-lit'),
    }
  }
});

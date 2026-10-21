import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 18888,
  },
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@semi-ui': resolve(__dirname, '../semi-ui/index.ts'),
      '@semi-icons': resolve(__dirname, '../semi-icons/index.ts'),
      '@semi-foundation': resolve(__dirname, '../semi-foundation'),
    }
  }
});

import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup.ts'],
    include: ['*.test.ts'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
  },
});

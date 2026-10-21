import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['lit'],
    },
  },
});

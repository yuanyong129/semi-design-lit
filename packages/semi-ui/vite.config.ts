import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'SemiDesignUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'lit',
        /^lit\//,
        '@lit/context',
        '@lit-labs/signals',
        'resize-observer-polyfill',
        'dayjs',
      ],
    },
  },
});

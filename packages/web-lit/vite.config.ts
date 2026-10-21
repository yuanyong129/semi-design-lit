import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
        icon: resolve(__dirname, 'icon/index.ts'),
        semi: resolve(__dirname, 'components/style/index.css'),
      },
      name: 'SemiDesignWebLit',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'semi',
    },
    cssCodeSplit: true,
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

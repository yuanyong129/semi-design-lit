import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'web-lit': resolve(__dirname, 'index.ts'),
        'icon': resolve(__dirname, 'icon/index.ts'),
        'themes': resolve(__dirname, 'components/style/index.css'), // CSS 入口文件
      },
      name: '@acro-design/web-lit',
      fileName: 'index',
      cssFileName: 'index.css',
    },
    cssCodeSplit: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  }
})
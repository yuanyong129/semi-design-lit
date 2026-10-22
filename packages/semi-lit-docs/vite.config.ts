import { defineConfig } from 'vite';
import { resolve } from 'path';

// GitHub Pages project sites serve the docs from a sub-path (/<repo>/), so the
// deploy job sets DOCS_BASE. Local dev/build keeps the site at the domain root.
const docsBase = process.env.DOCS_BASE?.trim();
const base = docsBase ? `${docsBase.replace(/\/+$/, '')}/` : '/';

export default defineConfig({
  base,
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

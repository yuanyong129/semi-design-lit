import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await Promise.all([
  cp('index.css', 'dist/index.css'),
  cp('tokens.css', 'dist/tokens.css'),
  cp('normalize.css', 'dist/normalize.css'),
]);

console.log('Built @semi-design/semi-theme-default');

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// Resolve the build output from this file's location so the server works from any cwd.
const root = path.resolve(import.meta.dirname, '../packages/semi-lit-docs/dist');
const port = Number(process.env.PORT || 18888);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname);

  fs.readFile(file, (error, data) => {
    if (!error) {
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
      return;
    }

    fs.readFile(path.join(root, 'index.html'), (fallbackError, html) => {
      if (fallbackError) {
        res.writeHead(404).end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': types['.html'] }).end(html);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});

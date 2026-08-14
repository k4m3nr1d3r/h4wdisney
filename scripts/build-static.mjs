import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

// Generate the gallery manifest from Vernissages/ and Obras/.
const generator = new URL('./generate-gallery.mjs', import.meta.url);
await import(generator);

const files = [
  'index.html',
  'style.css',
  'script.js',
  'gallery-index.json',
  'gallery-data.js'
];

for (const file of files) {
  const src = path.join(ROOT, file);
  const dest = path.join(DIST, file);
  await fs.cp(src, dest, { recursive: true });
}

for (const dir of ['assets', 'Obras', 'Vernissages']) {
  const src = path.join(ROOT, dir);
  const dest = path.join(DIST, dir);
  try {
    await fs.cp(src, dest, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

console.log(`Static site prepared in ${path.relative(ROOT, DIST)}/`);

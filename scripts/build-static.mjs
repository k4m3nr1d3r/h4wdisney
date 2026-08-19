import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

// Tenta gerar a galeria antiga, mas não trava se der erro
try {
  const generator = new URL('./generate-gallery.mjs', import.meta.url);
  await import(generator);
} catch (e) {
  console.log('Ignorando gerador antigo. Usando manifesto interno do script.js');
}

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
  try {
    await fs.cp(src, dest, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

// A lista do porteiro atualizada com 'archives'
for (const dir of ['assets', 'ACERVO', 'exhibiti0ns', 'archives']) {
  const src = path.join(ROOT, dir);
  const dest = path.join(DIST, dir);
  try {
    await fs.cp(src, dest, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

console.log(`Static site prepared in ${path.relative(ROOT, DIST)}/`);
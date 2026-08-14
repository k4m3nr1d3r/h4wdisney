import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IMAGE_EXTS = new Set(['.png','.jpg','.jpeg','.webp','.gif','.avif','.svg']);
const exhibitionsOrder = [
  ['utopias_piratas_2021', 2021],
  ['hyperlinks, distorção e mormaço', 2022],
  ['RAW 2025 (HOA+FDAG)', 2025],
];

async function walk(dir, relative='') {
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const abs = path.join(dir, entry.name);
    const rel = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) out.push(...await walk(abs, rel));
    else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) out.push(rel);
  }
  return out;
}

function title(file) {
  return path.basename(file, path.extname(file)).replaceAll('_', ' ');
}

const vernissagesDir = path.join(ROOT, 'Vernissages');
const obrasDir = path.join(ROOT, 'Obras');
const exhibitions = [];
for (const [name, year] of exhibitionsOrder) {
  const files = (await walk(path.join(vernissagesDir, name), `Vernissages/${name}`))
    .sort((a,b) => title(a).localeCompare(title(b), 'pt-BR'));
  exhibitions.push({
    id: `vernissage:${name}`,
    name,
    year,
    items: files.map(file => ({
      id: file,
      file,
      title: title(file),
      year,
      note: ''
    }))
  });
}

const known = new Set(exhibitionsOrder.map(([name]) => name));
try {
  const entries = await fs.readdir(vernissagesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || known.has(entry.name) || entry.name.startsWith('.')) continue;
    const files = (await walk(path.join(vernissagesDir, entry.name), `Vernissages/${entry.name}`))
      .sort((a,b) => title(a).localeCompare(title(b), 'pt-BR'));
    const yearMatch = entry.name.match(/(?:19|20)\d{2}/);
    exhibitions.push({
      id: `vernissage:${entry.name}`,
      name: entry.name,
      year: yearMatch ? Number(yearMatch[0]) : 9999,
      items: files.map(file => ({ id:file, file, title:title(file), year: yearMatch?.[0] || '', note:'' }))
    });
  }
} catch {}

exhibitions.sort((a,b) => a.year - b.year || a.name.localeCompare(b.name, 'pt-BR'));

const works = (await walk(obrasDir, 'Obras'))
  .sort((a,b) => title(a).localeCompare(title(b), 'pt-BR'))
  .map(file => ({ id:file, file, title:title(file), year:'', note:'' }));

const manifest = { version: 1, generatedAt: new Date().toISOString(), exhibitions, works };
await fs.writeFile(path.join(ROOT, 'gallery-index.json'), JSON.stringify(manifest, null, 2) + '\n');
await fs.writeFile(path.join(ROOT, 'gallery-data.js'), `window.__GALLERY_MANIFEST__ = ${JSON.stringify(manifest)};\n`);
console.log(`Gallery generated: ${works.length} obras, ${exhibitions.reduce((n,g)=>n+g.items.length,0)} vernissages.`);

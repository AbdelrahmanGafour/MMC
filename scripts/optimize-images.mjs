// Source JPGs live in assets-src/; output WebP (800/1600w) goes to public/images/.
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const src = 'assets-src';
const out = 'public/images';
for (const f of await readdir(src)) {
  if (!f.endsWith('.jpg')) continue;
  const name = f.replace('.jpg', '');
  for (const w of [800, 1600]) {
    await sharp(join(src, f)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(join(out, `${name}-${w}.webp`));
  }
  console.log('optimized', f);
}

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function render(svgPath, outPath, size) {
  const svg = readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  writeFileSync(outPath, png);
  console.log(`  ✓ ${outPath} (${size}×${size})`);
}

console.log('Rendering icon assets...');
render(`${root}/resources/icon-source.svg`, `${root}/assets/icon.png`, 1024);
render(`${root}/resources/icon-foreground.svg`, `${root}/assets/icon-foreground.png`, 1024);
render(`${root}/resources/icon-background.svg`, `${root}/assets/icon-background.png`, 1024);
render(`${root}/resources/splash-source.svg`, `${root}/assets/splash.png`, 2732);
render(`${root}/resources/splash-source.svg`, `${root}/assets/splash-dark.png`, 2732);
console.log('Done.');

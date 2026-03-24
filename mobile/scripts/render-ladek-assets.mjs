/**
 * LadeK Academy — app icon / splash / favicon PNG (sharp + SVG).
 * Tasarım: koyu lacivert zemin, cyan→navy dijital ağaç, açık kitap, üst parıltı.
 * node scripts/render-ladek-assets.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '../assets/images');

const NAVY = '#002B5B';
const CYAN = '#00E5FF';
const CYAN_DIM = '#06b6d4';
const WHITE = '#ffffff';

/** Merkez (cx,cy), ölçek size — kitap + PCB ağaç + düğümler */
function emblemSvg(size, { pad = 0 } = {}) {
  const s = size - pad * 2;
  const cx = size / 2;
  const cy = size * 0.52;
  const sc = s / 420;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${NAVY}"/>
      <stop offset="100%" style="stop-color:#0a2540"/>
    </linearGradient>
    <linearGradient id="tree" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" style="stop-color:${CYAN}"/>
      <stop offset="55%" style="stop-color:${CYAN_DIM}"/>
      <stop offset="100%" style="stop-color:${NAVY}"/>
    </linearGradient>
    <linearGradient id="cover" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${CYAN}"/>
      <stop offset="50%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:${NAVY}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="28%" r="50%">
      <stop offset="0%" style="stop-color:${CYAN};stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:${NAVY};stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="star" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${WHITE};stop-opacity:1"/>
      <stop offset="40%" style="stop-color:#a7f3d0;stop-opacity:0.85"/>
      <stop offset="100%" style="stop-color:${CYAN};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${size * 0.33}" r="${size * 0.38}" fill="url(#halo)"/>
  <g transform="translate(${cx}, ${cy}) scale(${sc})">
    <path d="M -8 -35 L -125 -20 L -130 95 L -8 88 Z" fill="#f8fafc" stroke="${CYAN_DIM}" stroke-width="3"/>
    <path d="M 8 -35 L 125 -20 L 130 95 L 8 88 Z" fill="#e0f2fe" stroke="${CYAN_DIM}" stroke-width="3"/>
    <path d="M -8 -35 L 8 -35 L 8 88 L -8 88 Z" fill="url(#cover)"/>
    <line x1="0" y1="-35" x2="0" y2="88" stroke="${WHITE}" stroke-width="2" opacity="0.35"/>
    <g stroke="url(#tree)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 0 -38 L 0 -195" stroke-width="10"/>
      <path d="M 0 -120 L -85 -155 M 0 -120 L 85 -155" stroke-width="8"/>
      <path d="M 0 -85 L -100 -95 M 0 -85 L 100 -95" stroke-width="7"/>
      <path d="M 0 -55 L -75 -45 M 0 -55 L 75 -45" stroke-width="6"/>
      <path d="M -85 -155 L -120 -185 M 85 -155 L 120 -185" stroke-width="6"/>
      <path d="M -100 -95 L -135 -125 M 100 -95 L 135 -125" stroke-width="5"/>
    </g>
    <circle cx="0" cy="-205" r="12" fill="${CYAN}" stroke="${WHITE}" stroke-width="3"/>
    <circle cx="-120" cy="-185" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="120" cy="-185" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-85" cy="-155" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="85" cy="-155" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-100" cy="-95" r="9" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="100" cy="-95" r="9" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-75" cy="-45" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="75" cy="-45" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-135" cy="-125" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="135" cy="-125" r="8" fill="${CYAN}" stroke="${CYAN}" stroke-width="2"/>
    <circle cx="0" cy="-198" r="42" fill="url(#star)"/>
  </g>
</svg>`;
}

const fgOnlySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="tree" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" style="stop-color:${CYAN}"/>
      <stop offset="55%" style="stop-color:${CYAN_DIM}"/>
      <stop offset="100%" style="stop-color:${NAVY}"/>
    </linearGradient>
    <linearGradient id="cover" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${CYAN}"/>
      <stop offset="50%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:${NAVY}"/>
    </linearGradient>
    <radialGradient id="star" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${WHITE};stop-opacity:1"/>
      <stop offset="40%" style="stop-color:#a7f3d0;stop-opacity:0.85"/>
      <stop offset="100%" style="stop-color:${CYAN};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <g transform="translate(512, 540) scale(1.15)">
    <path d="M -8 -35 L -125 -20 L -130 95 L -8 88 Z" fill="#f8fafc" stroke="${CYAN_DIM}" stroke-width="3"/>
    <path d="M 8 -35 L 125 -20 L 130 95 L 8 88 Z" fill="#e0f2fe" stroke="${CYAN_DIM}" stroke-width="3"/>
    <path d="M -8 -35 L 8 -35 L 8 88 L -8 88 Z" fill="url(#cover)"/>
    <line x1="0" y1="-35" x2="0" y2="88" stroke="${WHITE}" stroke-width="2" opacity="0.35"/>
    <g stroke="url(#tree)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 0 -38 L 0 -195" stroke-width="10"/>
      <path d="M 0 -120 L -85 -155 M 0 -120 L 85 -155" stroke-width="8"/>
      <path d="M 0 -85 L -100 -95 M 0 -85 L 100 -95" stroke-width="7"/>
      <path d="M 0 -55 L -75 -45 M 0 -55 L 75 -45" stroke-width="6"/>
      <path d="M -85 -155 L -120 -185 M 85 -155 L 120 -185" stroke-width="6"/>
      <path d="M -100 -95 L -135 -125 M 100 -95 L 135 -125" stroke-width="5"/>
    </g>
    <circle cx="0" cy="-205" r="12" fill="${CYAN}" stroke="${WHITE}" stroke-width="3"/>
    <circle cx="-120" cy="-185" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="120" cy="-185" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-85" cy="-155" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="85" cy="-155" r="10" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-100" cy="-95" r="9" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="100" cy="-95" r="9" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-75" cy="-45" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="75" cy="-45" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="-135" cy="-125" r="8" fill="${CYAN}" stroke="${WHITE}" stroke-width="2"/>
    <circle cx="135" cy="-125" r="8" fill="${CYAN}" stroke="${CYAN}" stroke-width="2"/>
    <circle cx="0" cy="-198" r="42" fill="url(#star)"/>
  </g>
</svg>`;

async function main() {
  const buf1024 = await sharp(Buffer.from(emblemSvg(1024))).png().toBuffer();
  writeFileSync(join(ASSETS, 'icon.png'), buf1024);
  writeFileSync(join(ASSETS, 'splash-icon.png'), buf1024);

  const buf48 = await sharp(Buffer.from(emblemSvg(48))).png().toBuffer();
  writeFileSync(join(ASSETS, 'favicon.png'), buf48);

  const fgBuf = await sharp(Buffer.from(fgOnlySvg)).png().toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-foreground.png'), fgBuf);

  const bgBuf = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 43, b: 91, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-background.png'), bgBuf);

  const monoBuf = await sharp(Buffer.from(fgOnlySvg)).greyscale().png().toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-monochrome.png'), monoBuf);

  console.log('LadeK Academy görselleri yazıldı:', ASSETS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Ladek ACADEMY — app icon / splash / favicon PNG üretimi (sharp + SVG).
 * node scripts/render-ladek-assets.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '../assets/images');

const iconSvg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1628"/>
      <stop offset="100%" style="stop-color:#0f2744"/>
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#67e8f9"/>
      <stop offset="100%" style="stop-color:#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="22%" r="45%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
      <stop offset="50%" style="stop-color:#a7f3d0;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#22d3ee;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <g transform="translate(${size * 0.5}, ${size * 0.52})">
    <path d="M ${-size * 0.22} ${-size * 0.08} L ${-size * 0.26} ${size * 0.2} L ${size * 0.26} ${size * 0.2} L ${size * 0.22} ${-size * 0.08} Z" fill="#f8fafc" stroke="#06b6d4" stroke-width="${size * 0.008}"/>
    <line x1="0" y1="${-size * 0.08}" x2="0" y2="${size * 0.2}" stroke="#152a45" stroke-width="${size * 0.004}" opacity="0.35"/>
    <path d="M 0 ${-size * 0.08} L 0 ${-size * 0.38} M 0 ${-size * 0.22} L ${-size * 0.14} ${-size * 0.32} M 0 ${-size * 0.22} L ${size * 0.14} ${-size * 0.32} M 0 ${-size * 0.12} L ${-size * 0.17} ${-size * 0.16} M 0 ${-size * 0.12} L ${size * 0.17} ${-size * 0.16}" stroke="url(#line)" stroke-width="${size * 0.014}" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="${-size * 0.42}" r="${size * 0.028}" fill="#22d3ee" stroke="#fff" stroke-width="${size * 0.004}"/>
    <circle cx="${-size * 0.14}" cy="${-size * 0.32}" r="${size * 0.028}" fill="#22d3ee" stroke="#fff" stroke-width="${size * 0.004}"/>
    <circle cx="${size * 0.14}" cy="${-size * 0.32}" r="${size * 0.028}" fill="#22d3ee" stroke="#fff" stroke-width="${size * 0.004}"/>
    <circle cx="${-size * 0.17}" cy="${-size * 0.16}" r="${size * 0.028}" fill="#22d3ee" stroke="#fff" stroke-width="${size * 0.004}"/>
    <circle cx="${size * 0.17}" cy="${-size * 0.16}" r="${size * 0.028}" fill="#22d3ee" stroke="#fff" stroke-width="${size * 0.004}"/>
    <circle cx="0" cy="${-size * 0.38}" r="${size * 0.1}" fill="url(#glow)"/>
  </g>
</svg>`;

async function main() {
  const buf1024 = await sharp(Buffer.from(iconSvg(1024))).png().toBuffer();
  writeFileSync(join(ASSETS, 'icon.png'), buf1024);
  writeFileSync(join(ASSETS, 'splash-icon.png'), buf1024);

  const buf48 = await sharp(Buffer.from(iconSvg(48))).png().toBuffer();
  writeFileSync(join(ASSETS, 'favicon.png'), buf48);

  // Android adaptive: ön plan şeffaf arka planlı (sadece logo, güvenli alan)
  const fgSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#67e8f9"/>
      <stop offset="100%" style="stop-color:#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="40%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95"/>
      <stop offset="100%" style="stop-color:#22d3ee;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <g transform="translate(512, 520)">
    <path d="M -220 -40 L -260 200 L 260 200 L 220 -40 Z" fill="#f8fafc" stroke="#06b6d4" stroke-width="8"/>
    <line x1="0" y1="-40" x2="0" y2="200" stroke="#152a45" stroke-width="4" opacity="0.35"/>
    <path d="M 0 -40 L 0 -400 M 0 -220 L -140 -320 M 0 -220 L 140 -320 M 0 -120 L -170 -160 M 0 -120 L 170 -160" stroke="url(#line)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-430" r="28" fill="#22d3ee" stroke="#fff" stroke-width="4"/>
    <circle cx="-140" cy="-320" r="28" fill="#22d3ee" stroke="#fff" stroke-width="4"/>
    <circle cx="140" cy="-320" r="28" fill="#22d3ee" stroke="#fff" stroke-width="4"/>
    <circle cx="-170" cy="-160" r="28" fill="#22d3ee" stroke="#fff" stroke-width="4"/>
    <circle cx="170" cy="-160" r="28" fill="#22d3ee" stroke="#fff" stroke-width="4"/>
    <circle cx="0" cy="-400" r="100" fill="url(#glow)"/>
  </g>
</svg>`;
  const fgBuf = await sharp(Buffer.from(fgSvg)).png().toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-foreground.png'), fgBuf);

  // Arka plan: düz lacivert (adaptive)
  const bgBuf = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 10, g: 22, b: 40, alpha: 1 } },
  })
    .png()
    .toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-background.png'), bgBuf);

  const monoBuf = await sharp(Buffer.from(fgSvg)).greyscale().png().toBuffer();
  writeFileSync(join(ASSETS, 'android-icon-monochrome.png'), monoBuf);

  console.log('Ladek görselleri yazıldı:', ASSETS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

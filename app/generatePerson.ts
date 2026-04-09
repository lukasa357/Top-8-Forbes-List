// =============================================================
// generatePerson.ts — Cartoon Person Generator
// =============================================================
// USAGE:
// import { generatePerson } from './generatePerson';
// const imageUrl = generatePerson("Maria Garcia", 200);
// // Returns a data URL you can use as an <img> src
//
// HOW IT WORKS:
// Feed it any name and a size in pixels.
// It returns a unique cartoon face — same name always gives
// the same face. Different names give different faces.
// Think of it like a black box: input → output. You don't
// need to understand the code inside to use it.
// =============================================================

function cyrb128(s: string): number[] {
  let h1 = 1779033703,
  h2 = 3144134277,
  h3 = 1013904242,
  h4 = 2773480762;
  for (let i = 0; i < s.length; i++) {
  const k = s.charCodeAt(i);
  h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
  h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
  h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
  h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
  (h1 ^ h2 ^ h3 ^ h4) >>> 0,
  (h2 ^ h1) >>> 0,
  (h3 ^ h1) >>> 0,
  (h4 ^ h1) >>> 0,
  ];
  }
  
  function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function () {
  a |= 0;
  b |= 0;
  c |= 0;
  d |= 0;
  let t = (((a + b) | 0) + d) | 0;
  d = (d + 1) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  c = (c + t) | 0;
  return (t >>> 0) / 4294967296;
  };
  }
  
  export function generatePerson(name: string, sz: number): string {
  const h = cyrb128(name.toLowerCase().trim());
  const r = sfc32(h[0], h[1], h[2], h[3]);
  
  const C = document.createElement('canvas');
  C.width = sz;
  C.height = sz;
  const X = C.getContext('2d')!;
  const S = sz / 100;
  
  const skins = [
  '#FDDCB5',
  '#F5C5A3',
  '#E8AA85',
  '#D4956B',
  '#C07A50',
  '#9B6440',
  '#7B4B2D',
  '#5C3A24',
  '#3D2517',
  '#F6D5C0',
  '#E6BFA5',
  '#D49E7B',
  ];
  const hairColors = [
  '#1A1110',
  '#2C1B0E',
  '#4A3016',
  '#6B4423',
  '#8B5E34',
  '#3D2B1F',
  '#1C1008',
  '#C4A47B',
  '#E8C07A',
  '#A0522D',
  '#D2691E',
  '#8B0000',
  '#2F1B14',
  '#0D0D0D',
  '#4B3621',
  '#F5DEB3',
  '#DEB887',
  '#D2B48C',
  ];
  const shirtColors = [
  '#378ADD',
  '#1D9E75',
  '#D85A30',
  '#7F77DD',
  '#D4537E',
  '#BA7517',
  '#639922',
  '#E24B4A',
  '#185FA5',
  '#0F6E56',
  '#993C1D',
  '#534AB7',
  '#5F5E5A',
  '#2C5F8A',
  '#8B4513',
  '#2E8B57',
  '#4682B4',
  '#6A5ACD',
  '#DB7093',
  '#3CB371',
  ];
  const bgColors = [
  '#E6F1FB',
  '#E1F5EE',
  '#FAEEDA',
  '#EEEDFE',
  '#FBEAF0',
  '#FAECE7',
  '#EAF3DE',
  '#F1EFE8',
  '#FFF5E6',
  '#F0F8FF',
  '#FFF0F5',
  '#F5FFFA',
  ];
  
  const skin = skins[Math.floor(r() * skins.length)];
  const hair = hairColors[Math.floor(r() * hairColors.length)];
  const shirt = shirtColors[Math.floor(r() * shirtColors.length)];
  const bg = bgColors[Math.floor(r() * bgColors.length)];
  const hairType = Math.floor(r() * 8);
  const faceShape = Math.floor(r() * 3);
  const eyeType = Math.floor(r() * 4);
  const mouthType = Math.floor(r() * 5);
  const noseType = Math.floor(r() * 3);
  const browType = Math.floor(r() * 3);
  const accessory = Math.floor(r() * 8);
  const earSize = 2.5 + r() * 2;
  
  X.fillStyle = bg;
  X.fillRect(0, 0, sz, sz);
  
  X.fillStyle = shirt;
  X.beginPath();
  X.ellipse(50 * S, 95 * S, 28 * S, 18 * S, 0, Math.PI, 0, true);
  X.fill();
  X.fillRect(22 * S, 85 * S, 56 * S, 20 * S);
  
  const collarV = r() > 0.5;
  if (collarV) {
  X.fillStyle = bg;
  X.beginPath();
  X.moveTo(44 * S, 78 * S);
  X.lineTo(50 * S, 88 * S);
  X.lineTo(56 * S, 78 * S);
  X.closePath();
  X.fill();
  } else {
  X.strokeStyle = bg;
  X.lineWidth = 1.5 * S;
  X.beginPath();
  X.arc(50 * S, 82 * S, 6 * S, 0.15 * Math.PI, 0.85 * Math.PI);
  X.stroke();
  }
  
  const fw = faceShape === 0 ? 18 : faceShape === 1 ? 17 : 19;
  const fh = faceShape === 0 ? 22 : faceShape === 1 ? 24 : 21;
  X.fillStyle = skin;
  X.beginPath();
  X.ellipse(50 * S, 52 * S, fw * S, fh * S, 0, 0, Math.PI * 2);
  X.fill();
  
  X.fillStyle = skin;
  X.beginPath();
  X.ellipse(
  (50 - fw + 1) * S,
  50 * S,
  earSize * S,
  (earSize + 1) * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  X.beginPath();
  X.ellipse(
  (50 + fw - 1) * S,
  50 * S,
  earSize * S,
  (earSize + 1) * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  
  const neckW = 6;
  X.fillStyle = skin;
  X.fillRect((50 - neckW) * S, (52 + fh - 4) * S, neckW * 2 * S, 12 * S);
  
  X.fillStyle = hair;
  if (hairType === 0) {
  X.beginPath();
  X.ellipse(50 * S, 40 * S, (fw + 2) * S, 16 * S, 0, Math.PI, 0, true);
  X.fill();
  X.fillRect((50 - fw - 1) * S, 33 * S, 6 * S, 14 * S);
  } else if (hairType === 1) {
  X.beginPath();
  X.ellipse(50 * S, 38 * S, (fw + 3) * S, 17 * S, 0, Math.PI, 0, true);
  X.fill();
  X.beginPath();
  X.ellipse(50 * S, 35 * S, (fw + 1) * S, 8 * S, 0, 0, Math.PI * 2);
  X.fill();
  } else if (hairType === 2) {
  X.beginPath();
  X.ellipse(50 * S, 40 * S, (fw + 2) * S, 14 * S, 0, Math.PI, 0, true);
  X.fill();
  X.fillRect((50 - fw - 2) * S, 35 * S, (fw * 2 + 4) * S, 6 * S);
  } else if (hairType === 3) {
  X.beginPath();
  X.ellipse(50 * S, 38 * S, (fw + 4) * S, 18 * S, 0, Math.PI, 0, true);
  X.fill();
  X.fillRect((50 - fw - 3) * S, 36 * S, 8 * S, 22 * S);
  X.fillRect((50 + fw - 5) * S, 36 * S, 8 * S, 22 * S);
  } else if (hairType === 4) {
  X.beginPath();
  X.ellipse(50 * S, 39 * S, (fw + 2) * S, 15 * S, 0, Math.PI, 0, true);
  X.fill();
  for (let i = 0; i < 7; i++) {
  const ax = (36 + i * 4) * S;
  const ay = (32 - Math.sin(i * 0.8) * 3) * S;
  X.beginPath();
  X.ellipse(ax, ay, 3 * S, 5 * S, 0.2 * i, 0, Math.PI * 2);
  X.fill();
  }
  } else if (hairType === 5) {
  X.beginPath();
  X.ellipse(50 * S, 36 * S, (fw + 5) * S, 20 * S, 0, Math.PI, 0, true);
  X.fill();
  X.beginPath();
  X.ellipse(50 * S, 36 * S, (fw + 5) * S, 20 * S, 0, 0, Math.PI);
  X.fill();
  X.fillStyle = skin;
  X.beginPath();
  X.ellipse(50 * S, 52 * S, (fw - 1) * S, (fh - 1) * S, 0, 0, Math.PI * 2);
  X.fill();
  X.fillStyle = hair;
  } else if (hairType === 6) {
  X.beginPath();
  X.ellipse(50 * S, 40 * S, (fw + 1) * S, 13 * S, 0, Math.PI, 0, true);
  X.fill();
  } else {
  X.beginPath();
  X.ellipse(50 * S, 39 * S, (fw + 3) * S, 16 * S, 0, Math.PI, 0, true);
  X.fill();
  X.beginPath();
  X.moveTo((50 - fw) * S, 36 * S);
  X.lineTo((50 - fw - 2) * S, 28 * S);
  X.lineTo((50 - fw + 6) * S, 34 * S);
  X.fill();
  }
  
  const eyeY = 49;
  const eyeSpacing = faceShape === 2 ? 8 : 7;
  X.fillStyle = '#fff';
  X.beginPath();
  X.ellipse(
  (50 - eyeSpacing) * S,
  eyeY * S,
  3.5 * S,
  eyeType < 2 ? 2.8 * S : 3.2 * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  X.beginPath();
  X.ellipse(
  (50 + eyeSpacing) * S,
  eyeY * S,
  3.5 * S,
  eyeType < 2 ? 2.8 * S : 3.2 * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  
  const pupilR =
  eyeType === 0 ? 1.8 : eyeType === 1 ? 2.2 : eyeType === 2 ? 1.5 : 2;
  const irisColor =
  eyeType === 3 ? '#2E5940' : eyeType === 2 ? '#4A6FA5' : '#3D2B1F';
  X.fillStyle = irisColor;
  X.beginPath();
  X.arc((50 - eyeSpacing) * S, eyeY * S, pupilR * S, 0, Math.PI * 2);
  X.fill();
  X.beginPath();
  X.arc((50 + eyeSpacing) * S, eyeY * S, pupilR * S, 0, Math.PI * 2);
  X.fill();
  X.fillStyle = '#111';
  X.beginPath();
  X.arc((50 - eyeSpacing) * S, eyeY * S, 0.9 * S, 0, Math.PI * 2);
  X.fill();
  X.beginPath();
  X.arc((50 + eyeSpacing) * S, eyeY * S, 0.9 * S, 0, Math.PI * 2);
  X.fill();
  X.fillStyle = '#fff';
  X.beginPath();
  X.arc((50 - eyeSpacing - 0.5) * S, (eyeY - 0.6) * S, 0.5 * S, 0, Math.PI * 2);
  X.fill();
  X.beginPath();
  X.arc((50 + eyeSpacing - 0.5) * S, (eyeY - 0.6) * S, 0.5 * S, 0, Math.PI * 2);
  X.fill();
  
  X.strokeStyle = '#3D2B1F';
  X.lineWidth = 1.2 * S;
  X.lineCap = 'round';
  if (browType === 0) {
  X.beginPath();
  X.moveTo((50 - eyeSpacing - 3) * S, (eyeY - 4.5) * S);
  X.lineTo((50 - eyeSpacing + 3) * S, (eyeY - 5) * S);
  X.stroke();
  X.beginPath();
  X.moveTo((50 + eyeSpacing - 3) * S, (eyeY - 5) * S);
  X.lineTo((50 + eyeSpacing + 3) * S, (eyeY - 4.5) * S);
  X.stroke();
  } else if (browType === 1) {
  X.beginPath();
  X.moveTo((50 - eyeSpacing - 3) * S, (eyeY - 5.5) * S);
  X.quadraticCurveTo(
  (50 - eyeSpacing) * S,
  (eyeY - 6.5) * S,
  (50 - eyeSpacing + 3) * S,
  (eyeY - 5) * S
  );
  X.stroke();
  X.beginPath();
  X.moveTo((50 + eyeSpacing - 3) * S, (eyeY - 5) * S);
  X.quadraticCurveTo(
  (50 + eyeSpacing) * S,
  (eyeY - 6.5) * S,
  (50 + eyeSpacing + 3) * S,
  (eyeY - 5.5) * S
  );
  X.stroke();
  } else {
  X.lineWidth = 1.6 * S;
  X.beginPath();
  X.moveTo((50 - eyeSpacing - 3) * S, (eyeY - 4) * S);
  X.lineTo((50 - eyeSpacing + 3.5) * S, (eyeY - 5.5) * S);
  X.stroke();
  X.beginPath();
  X.moveTo((50 + eyeSpacing - 3.5) * S, (eyeY - 5.5) * S);
  X.lineTo((50 + eyeSpacing + 3) * S, (eyeY - 4) * S);
  X.stroke();
  }
  
  X.fillStyle = skin;
  X.strokeStyle = 'rgba(0,0,0,0.15)';
  X.lineWidth = 0.5 * S;
  if (noseType === 0) {
  X.beginPath();
  X.moveTo(50 * S, 52 * S);
  X.lineTo(48 * S, 57 * S);
  X.lineTo(52 * S, 57 * S);
  X.closePath();
  X.fill();
  X.stroke();
  } else if (noseType === 1) {
  X.beginPath();
  X.arc(50 * S, 56 * S, 2 * S, 0, Math.PI);
  X.fill();
  X.stroke();
  } else {
  X.beginPath();
  X.moveTo(50 * S, 51 * S);
  X.quadraticCurveTo(53 * S, 56 * S, 50 * S, 57 * S);
  X.stroke();
  }
  
  const mouthY = 62;
  X.strokeStyle = '#9B4D3A';
  X.lineWidth = 1.2 * S;
  X.lineCap = 'round';
  if (mouthType === 0) {
  X.beginPath();
  X.arc(50 * S, (mouthY - 2) * S, 4 * S, 0.15 * Math.PI, 0.85 * Math.PI);
  X.stroke();
  } else if (mouthType === 1) {
  X.fillStyle = '#C0504D';
  X.beginPath();
  X.ellipse(50 * S, mouthY * S, 5 * S, 3 * S, 0, 0, Math.PI);
  X.fill();
  X.fillStyle = '#fff';
  X.beginPath();
  X.ellipse(50 * S, (mouthY - 0.5) * S, 3.5 * S, 1.5 * S, 0, 0, Math.PI);
  X.fill();
  } else if (mouthType === 2) {
  X.beginPath();
  X.moveTo(46 * S, mouthY * S);
  X.lineTo(54 * S, mouthY * S);
  X.stroke();
  } else if (mouthType === 3) {
  X.fillStyle = '#C0504D';
  X.beginPath();
  X.ellipse(50 * S, mouthY * S, 3 * S, 2 * S, 0, 0, Math.PI * 2);
  X.fill();
  } else {
  X.beginPath();
  X.moveTo(46 * S, (mouthY + 1) * S);
  X.quadraticCurveTo(50 * S, (mouthY - 2) * S, 54 * S, (mouthY + 1) * S);
  X.stroke();
  }
  
  if (accessory === 0) {
  X.strokeStyle = '#C4A47B';
  X.lineWidth = 1.5 * S;
  X.beginPath();
  X.arc((50 - eyeSpacing) * S, eyeY * S, 5 * S, 0, Math.PI * 2);
  X.stroke();
  X.beginPath();
  X.arc((50 + eyeSpacing) * S, eyeY * S, 5 * S, 0, Math.PI * 2);
  X.stroke();
  X.beginPath();
  X.moveTo((50 - eyeSpacing + 5) * S, eyeY * S);
  X.lineTo((50 + eyeSpacing - 5) * S, eyeY * S);
  X.stroke();
  } else if (accessory === 1) {
  X.fillStyle = '#E24B4A';
  const bx = (50 + fw - 2) * S;
  const by = 42 * S;
  const bs = 3 * S;
  X.beginPath();
  X.arc(bx, by - bs * 0.4, bs * 0.5, 0, Math.PI * 2);
  X.fill();
  X.beginPath();
  X.arc(bx - bs * 0.4, by - bs * 0.1, bs * 0.5, 0, Math.PI * 2);
  X.fill();
  X.beginPath();
  X.moveTo(bx, by + bs * 0.8);
  X.lineTo(bx - bs * 0.6, by - bs * 0.2);
  X.lineTo(bx + bs * 0.5, by - bs * 0.3);
  X.closePath();
  X.fill();
  }
  
  X.fillStyle = skin;
  X.beginPath();
  X.ellipse(
  (50 - fw + 1) * S,
  50 * S,
  earSize * S,
  (earSize + 1) * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  X.beginPath();
  X.ellipse(
  (50 + fw - 1) * S,
  50 * S,
  earSize * S,
  (earSize + 1) * S,
  0,
  0,
  Math.PI * 2
  );
  X.fill();
  
  if (accessory === 2) {
  X.fillStyle = '#FFD700';
  X.beginPath();
  X.arc((50 - fw + 1) * S, 54 * S, 1.5 * S, 0, Math.PI * 2);
  X.fill();
  }
  
  return C.toDataURL();
  }
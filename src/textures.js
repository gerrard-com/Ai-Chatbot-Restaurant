export function createWoodCanvas() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#28161b');
  base.addColorStop(0.48, '#4b2420');
  base.addColorStop(1, '#21131d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let v = 0; v < 170; v++) {
    const y = Math.random() * size;
    const x = Math.random() * size * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 220, y + (Math.random() - 0.5) * 14, x + 620, y + (Math.random() - 0.5) * 22, x + size, y + (Math.random() - 0.5) * 20);
    ctx.strokeStyle = v % 7 === 0 ? 'rgba(255, 190, 110, 0.15)' : `rgba(15, 5, 12, ${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = v % 7 === 0 ? 2 : 1 + Math.random() * 5;
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = 'rgba(239, 177, 105, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(Math.random() * size, Math.random() * size, 20 + Math.random() * 95, 4 + Math.random() * 10, 0.1, 0, Math.PI * 2);
    ctx.stroke();
  }
  return canvas;
}

const STEAK_TYPES = ['wagyu', 'tomahawk', 'filet', 'truffle', 'royal_experience'];

export function createPlateCanvas(dishType) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;

  const bg = ctx.createRadialGradient(c, c, 25, c, c, c);
  bg.addColorStop(0, '#FFF5E5');
  bg.addColorStop(0.76, '#FFE0B5');
  bg.addColorStop(0.92, '#F78B47');
  bg.addColorStop(1, '#A82433');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#FFF1CE';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.43, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#7A1640';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.405, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineCap = 'round';
  if (STEAK_TYPES.includes(dishType)) {
    ctx.fillStyle = '#542019';
    ctx.beginPath();
    ctx.ellipse(c, c, 125, 92, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#211016';
    ctx.lineWidth = 11;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(c - 85 + i * 18, c - 68);
      ctx.lineTo(c + 55 + i * 18, c + 72);
      ctx.stroke();
    }
    ctx.fillStyle = '#167547';
    [[155, 315, 7], [178, 338, 5], [345, 205, 6]].forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (dishType === 'fondant' || dishType === 'pistachio') {
    ctx.strokeStyle = '#A82433';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(c, c, 110, 0.6, 2.6);
    ctx.stroke();
  }
  return canvas;
}

export function createSearCanvas() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const crust = ctx.createRadialGradient(210, 180, 20, 256, 256, 320);
  crust.addColorStop(0, '#9a4522');
  crust.addColorStop(0.42, '#642516');
  crust.addColorStop(0.8, '#391712');
  crust.addColorStop(1, '#1b0b0b');
  ctx.fillStyle = crust;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 190; i++) {
    ctx.strokeStyle = i % 4 === 0 ? 'rgba(255, 220, 156, 0.15)' : 'rgba(190, 76, 35, 0.18)';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    const sx = Math.random() * size;
    const sy = Math.random() * size;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + 30, sy - 20, sx + 60, sy + 35, sx + 95, sy + 5);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(20, 8, 8, 0.82)';
  ctx.lineWidth = 20;
  for (let i = -size; i < size * 2; i += 86) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size * 0.65, size);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255, 195, 106, 0.1)';
  ctx.lineWidth = 4;
  for (let i = -size; i < size * 2; i += 86) {
    ctx.beginPath();
    ctx.moveTo(i - 6, 0);
    ctx.lineTo(i + size * 0.65 - 6, size);
    ctx.stroke();
  }
  return canvas;
}

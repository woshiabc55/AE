// 像素精灵绘制 - 异想体

import type { Anomaly } from '../../data/anomalies';

// 在 32x32 画布上绘制异想体轮廓
export function drawAnomaly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  anomaly: Anomaly,
  tick: number,
  panic: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 32, size / 32);
  ctx.imageSmoothingEnabled = false;

  // 底色光晕
  const haloColor = panic ? '#ff0033' : anomaly.peColor;
  ctx.fillStyle = haloColor + '33';
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  ctx.fill();

  // 阴影 / 主体
  ctx.fillStyle = anomaly.peColor;
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 1;

  const breathe = Math.sin(tick / 20) * 1.5;

  switch (anomaly.shape) {
    case 'blob': {
      ctx.beginPath();
      const r = 9 + breathe;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const noise = Math.sin(ang * 3 + tick / 30) * 2;
        const x0 = 16 + Math.cos(ang) * (r + noise);
        const y0 = 16 + Math.sin(ang) * (r + noise);
        if (i === 0) ctx.moveTo(x0, y0);
        else ctx.lineTo(x0, y0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // 眼睛
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(13, 14, 2, 2);
      ctx.fillRect(18, 14, 2, 2);
      break;
    }
    case 'spike': {
      ctx.beginPath();
      ctx.moveTo(16, 5);
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const x0 = 16 + Math.cos(ang) * 12;
        const y0 = 16 + Math.sin(ang) * 12;
        ctx.lineTo(x0, y0);
        const x1 = 16 + Math.cos(ang + Math.PI / 5) * 6;
        const y1 = 16 + Math.sin(ang + Math.PI / 5) * 6;
        ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'ring': {
      const t = tick / 30;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + t;
        const x0 = 16 + Math.cos(ang) * 10;
        const y0 = 16 + Math.sin(ang) * 10;
        const r = 3 + Math.sin(ang * 2 + t) * 1.5;
        if (i === 0) ctx.moveTo(x0 + r, y0);
        else ctx.lineTo(x0 + r, y0);
        ctx.arc(x0, y0, r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
      // 中心空洞
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath();
      ctx.arc(16, 16, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cross': {
      // 白夜：神圣十字
      ctx.save();
      ctx.translate(16, 16);
      const t = tick / 25;
      ctx.rotate(t * 0.1);
      ctx.fillStyle = anomaly.peColor;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fillRect(-2, -12, 4, 24);
      ctx.fillRect(-12, -2, 24, 4);
      // 外环
      ctx.beginPath();
      ctx.arc(0, 0, 10 + Math.sin(t) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case 'pillar': {
      ctx.fillRect(11, 4, 10, 24);
      ctx.strokeRect(11, 4, 10, 24);
      // 眼睛（纵向）
      ctx.fillStyle = panic ? '#ff0033' : '#0a0a0a';
      ctx.fillRect(15, 12, 2, 2);
      ctx.fillRect(15, 18, 2, 2);
      // 顶部
      ctx.fillStyle = anomaly.peColor;
      ctx.beginPath();
      ctx.moveTo(11, 4);
      ctx.lineTo(16, 0);
      ctx.lineTo(21, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'box': {
      ctx.fillRect(8, 8, 16, 16);
      ctx.strokeRect(8, 8, 16, 16);
      // 锁
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(14, 14, 4, 4);
      break;
    }
    case 'gear': {
      const t = tick / 20;
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(t);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const r = i % 2 === 0 ? 11 : 7;
        const x0 = Math.cos(ang) * r;
        const y0 = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(x0, y0);
        else ctx.lineTo(x0, y0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.restore();
      break;
    }
  }

  ctx.restore();
}

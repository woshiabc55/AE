// 员工像素精灵 - 16x16

export function drawEmployee(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  state: 'NORMAL' | 'PANIC' | 'DEAD' | 'WORKING' = 'NORMAL',
  tick: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 16, size / 16);
  ctx.imageSmoothingEnabled = false;

  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(8, 15, 4, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (state === 'DEAD') {
    // 倒地姿态
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(2, 9, 12, 4);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(3, 7, 4, 4);
    ctx.restore();
    return;
  }

  if (state === 'PANIC') {
    // 抖动效果
    const shake = Math.sin(tick / 2) * 1;
    ctx.translate(shake, 0);
    // 红色描边
    ctx.fillStyle = '#ff0033';
    ctx.fillRect(0, 4, 16, 12);
    // 角色
    ctx.fillStyle = color;
    ctx.fillRect(2, 6, 12, 10);
    // 头部
    ctx.fillStyle = '#e8e6df';
    ctx.fillRect(5, 2, 6, 6);
    // 恐慌眼睛
    ctx.fillStyle = '#ff0033';
    ctx.fillRect(6, 4, 1, 1);
    ctx.fillRect(9, 4, 1, 1);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(6, 4, 1, 1);
    // 嘴
    ctx.fillRect(7, 6, 2, 1);
    ctx.restore();
    return;
  }

  if (state === 'WORKING') {
    // 工作中：举起手
    const t = Math.sin(tick / 8) * 1;
    ctx.fillStyle = color;
    ctx.fillRect(2, 6, 12, 9);
    // 头
    ctx.fillStyle = '#e8e6df';
    ctx.fillRect(5, 2, 6, 6);
    // 眼
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(6, 4, 1, 1);
    ctx.fillRect(9, 4, 1, 1);
    // 工作手臂
    ctx.fillStyle = color;
    ctx.fillRect(13 + t, 4, 2, 4);
    ctx.restore();
    return;
  }

  // NORMAL
  const t = Math.sin(tick / 10);
  // 身体
  ctx.fillStyle = color;
  ctx.fillRect(3, 7, 10, 8);
  // 头
  ctx.fillStyle = '#e8e6df';
  ctx.fillRect(5, 2, 6, 6);
  // 头发 / 头巾
  ctx.fillStyle = color;
  ctx.fillRect(5, 2, 6, 1);
  // 眼
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(6, 4, 1, 1);
  ctx.fillRect(9, 4, 1, 1);
  // 腿
  ctx.fillStyle = '#3a3a45';
  ctx.fillRect(4, 15 - t, 3, 1);
  ctx.fillRect(9, 15 + t, 3, 1);
  // 手臂
  ctx.fillStyle = color;
  ctx.fillRect(1, 8, 2, 5);
  ctx.fillRect(13, 8, 2, 5);
  ctx.restore();
}

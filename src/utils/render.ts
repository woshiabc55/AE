import type {
  GameState,
  Mecha,
  Particle,
  FloatingText,
  SlashTrail,
  Projectile,
} from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WORLD_WIDTH,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  COLORS,
  ELEMENT_CONFIG,
  SKILL_CONFIG,
} from './constants';
import {
  getMechaTypeColor,
  getMechaTypeDarkColor,
  getMechaTypeAccentColor,
  getElementColor,
} from './skills';

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#0A1020';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
): void {
  // 天空渐变
  const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  skyGradient.addColorStop(0, '#0A1020');
  skyGradient.addColorStop(0.5, '#182540');
  skyGradient.addColorStop(1, '#2A3A55');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 远山（最慢）
  ctx.fillStyle = '#0D1425';
  for (let i = 0; i < 8; i++) {
    const baseW = 300 + (i % 3) * 120;
    const baseH = 120 + (i % 4) * 40;
    const x = i * 350 - cameraX * 0.05;
    const wrappedX = ((x % (CANVAS_WIDTH + baseW)) + (CANVAS_WIDTH + baseW)) % (CANVAS_WIDTH + baseW) - baseW;
    ctx.beginPath();
    ctx.moveTo(wrappedX, GROUND_Y);
    ctx.lineTo(wrappedX + baseW / 2, GROUND_Y - baseH);
    ctx.lineTo(wrappedX + baseW, GROUND_Y);
    ctx.fill();
  }

  // 中景山脉
  ctx.fillStyle = '#14203A';
  for (let i = 0; i < 10; i++) {
    const baseW = 200 + (i % 3) * 60;
    const baseH = 70 + (i % 4) * 25;
    const x = i * 280 - cameraX * 0.1;
    const wrappedX = ((x % (CANVAS_WIDTH + baseW)) + (CANVAS_WIDTH + baseW)) % (CANVAS_WIDTH + baseW) - baseW;
    ctx.beginPath();
    ctx.moveTo(wrappedX, GROUND_Y);
    ctx.lineTo(wrappedX + baseW / 2, GROUND_Y - baseH);
    ctx.lineTo(wrappedX + baseW, GROUND_Y);
    ctx.fill();
  }

  // 星星
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 40; i++) {
    const x = ((i * 137) % (CANVAS_WIDTH + 100)) - cameraX * 0.02;
    const wrappedX = ((x % (CANVAS_WIDTH + 100)) + (CANVAS_WIDTH + 100)) % (CANVAS_WIDTH + 100) - 50;
    const y = (i * 53) % (GROUND_Y / 2);
    if (i % 7 === 0) ctx.fillRect(wrappedX, y, 2, 2);
  }
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
): void {
  // 草地
  const grassGradient = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
  grassGradient.addColorStop(0, '#1A2E20');
  grassGradient.addColorStop(0.4, '#0F1A14');
  grassGradient.addColorStop(1, '#0A120D');
  ctx.fillStyle = grassGradient;
  ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  // 草地纹理
  ctx.fillStyle = 'rgba(46, 125, 50, 0.25)';
  for (let x = 0; x < WORLD_WIDTH; x += 24) {
    const h = 6 + (x % 3) * 3;
    ctx.fillRect(x, GROUND_Y, 3, h);
  }

  // 地面装饰石块
  ctx.fillStyle = 'rgba(100, 100, 110, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = (i * 137) % WORLD_WIDTH;
    const y = GROUND_Y + 20 + (i * 23) % (CANVAS_HEIGHT - GROUND_Y - 30);
    const size = 4 + (i % 3) * 2;
    ctx.fillRect(x, y, size, size);
  }

  // 地面高光线
  ctx.fillStyle = 'rgba(80, 160, 90, 0.4)';
  ctx.fillRect(0, GROUND_Y - 2, WORLD_WIDTH, 3);
}

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawElementalAura(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  frameCount: number,
): void {
  const cfg = ELEMENT_CONFIG[mecha.element];
  const centerX = mecha.x + MECHA_WIDTH / 2;
  const centerY = mecha.y + MECHA_HEIGHT / 2;

  ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.15) * 0.08;
  ctx.fillStyle = cfg.auraColor;
  ctx.fillRect(mecha.x - 6, mecha.y - 6, MECHA_WIDTH + 12, MECHA_HEIGHT + 12);

  if (mecha.element === 'fire') {
    // 火焰余烬
    ctx.fillStyle = cfg.secondary;
    for (let i = 0; i < 3; i++) {
      const ox = (Math.sin(frameCount * 0.2 + i * 2) * 14);
      const oy = -Math.abs(Math.cos(frameCount * 0.15 + i)) * 18 - 10;
      ctx.fillRect(centerX + ox, centerY + oy, 3, 4);
    }
  } else if (mecha.element === 'ice') {
    // 冰霜结晶
    ctx.fillStyle = cfg.bright;
    for (let i = 0; i < 4; i++) {
      const angle = frameCount * 0.08 + i * (Math.PI / 2);
      const r = 22 + Math.sin(frameCount * 0.12 + i) * 4;
      const ox = Math.cos(angle) * r;
      const oy = Math.sin(angle) * r - 8;
      const size = 2 + (i % 2);
      ctx.fillRect(centerX + ox - size / 2, centerY + oy - size / 2, size, size);
    }
  } else {
    // 电光
    ctx.strokeStyle = cfg.bright;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
      const sx = centerX + (i === 0 ? -22 : 22);
      const sy = centerY - 20 + Math.sin(frameCount * 0.4 + i * 3) * 10;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 20);
      ctx.lineTo(sx + (Math.random() - 0.5) * 16, sy + (Math.random() - 0.5) * 30);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function drawCharacterBody(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  color: string,
  darkColor: string,
  accentColor: string,
  frameCount: number,
): void {
  const x = Math.floor(mecha.x);
  const y = Math.floor(mecha.y);
  const f = mecha.facing;
  const t = mecha.type;

  let bodyOffsetX = 0;
  let bodyOffsetY = 0;
  let bodyTilt = 0;

  if (mecha.state === 'idle') {
    bodyOffsetY = Math.sin(frameCount * 0.12) * 1.5;
  } else if (mecha.state === 'hurt' || mecha.state === 'ko') {
    bodyOffsetX = -f * 6;
    bodyTilt = -f * 0.15;
  }

  ctx.save();
  ctx.translate(x + MECHA_WIDTH / 2, y + MECHA_HEIGHT / 2 + bodyOffsetY);
  ctx.rotate(bodyTilt);
  ctx.translate(-(x + MECHA_WIDTH / 2), -(y + MECHA_HEIGHT / 2));

  const bx = x + bodyOffsetX;
  const by = y + bodyOffsetY;

  // 腿部动画
  let leftLegH = 16;
  let rightLegH = 16;
  let leftLegY = by + 48;
  let rightLegY = by + 48;

  if (mecha.state === 'run') {
    const runFrame = Math.floor(frameCount / 4) % 2;
    if (runFrame === 0) {
      leftLegH = 12;
      rightLegY = by + 44;
    } else {
      rightLegH = 12;
      leftLegY = by + 44;
    }
  } else if (mecha.state === 'jump') {
    leftLegY = by + 52;
    rightLegY = by + 52;
    leftLegH = 10;
    rightLegH = 10;
  } else if (mecha.state === 'hurt' || mecha.state === 'ko') {
    leftLegY = by + 54;
    rightLegY = by + 50;
  }

  // 通用腿部
  const legColor = darkColor;
  drawPixelRect(ctx, bx + 10, leftLegY, 10, leftLegH, legColor);
  drawPixelRect(ctx, bx + 28, rightLegY, 10, rightLegH, legColor);

  // 身体与装备按职业绘制
  if (t === 'mage') {
    // 黑魔：长袍 + 法杖
    drawPixelRect(ctx, bx + 6, by + 18, 36, 34, color);
    drawPixelRect(ctx, bx + 10, by + 24, 28, 4, accentColor);
    // 兜帽头部
    drawPixelRect(ctx, bx + 12, by + 2, 24, 20, color);
    drawPixelRect(ctx, bx + 14, by + 8, 20, 4, '#111111');
    // 法杖
    const staffX = f === 1 ? bx + 40 : bx - 6;
    drawPixelRect(ctx, staffX, by + 10, 4, 46, '#5A4A3A');
    drawPixelRect(ctx, staffX - 2, by + 6, 8, 6, accentColor);
  } else if (t === 'tank') {
    // 骑士：重甲 + 大盾
    drawPixelRect(ctx, bx + 4, by + 18, 40, 34, color);
    drawPixelRect(ctx, bx + 8, by + 22, 32, 6, accentColor);
    // 头盔
    drawPixelRect(ctx, bx + 10, by + 4, 28, 18, color);
    drawPixelRect(ctx, bx + 14, by + 10, 20, 4, '#111111');
    // 盾牌
    const shieldX = f === 1 ? bx - 6 : bx + MECHA_WIDTH - 6;
    drawPixelRect(ctx, shieldX, by + 18, 10, 32, '#7A7A8A');
    drawPixelRect(ctx, shieldX + 2, by + 28, 6, 10, accentColor);
  } else if (t === 'speed') {
    // 盗贼：紧身衣 + 双匕首
    drawPixelRect(ctx, bx + 8, by + 20, 32, 30, color);
    drawPixelRect(ctx, bx + 12, by + 26, 24, 4, accentColor);
    // 头巾
    drawPixelRect(ctx, bx + 12, by + 4, 24, 18, darkColor);
    drawPixelRect(ctx, bx + 14, by + 12, 20, 4, '#111111');
    // 围巾
    drawPixelRect(ctx, bx + 10, by + 20, 28, 5, accentColor);
  } else {
    // 战士：铠甲 + 大剑
    drawPixelRect(ctx, bx + 6, by + 18, 36, 34, color);
    drawPixelRect(ctx, bx + 10, by + 24, 28, 6, accentColor);
    // 头盔
    drawPixelRect(ctx, bx + 12, by + 4, 24, 18, color);
    drawPixelRect(ctx, bx + 16, by + 10, 16, 4, '#111111');
    // 大剑背/持
    const swordX = f === 1 ? bx - 4 : bx + MECHA_WIDTH - 4;
    drawPixelRect(ctx, swordX, by + 6, 6, 44, '#8A8A9A');
    drawPixelRect(ctx, swordX - 2, by + 46, 10, 4, '#5A5A6A');
  }

  // 眼睛
  const eyeColor = mecha.state === 'ko' ? '#333333' : '#FFFFFF';
  drawPixelRect(ctx, bx + (f === 1 ? 24 : 8), by + 12, 8, 4, eyeColor);

  // 手臂
  let armX = f === 1 ? bx + 36 : bx - 8;
  let armY = by + 28;

  if (mecha.state === 'run') {
    armY = by + 24 + Math.sin(frameCount * 0.3) * 4;
  } else if (mecha.state === 'jump') {
    armY = by + 18;
    armX = f === 1 ? bx + 34 : bx - 6;
  } else if (mecha.state === 'attack' || mecha.state === 'skill') {
    armX = f === 1 ? bx + 42 : bx - 14;
  } else if (mecha.state === 'throw') {
    armX = f === 1 ? bx + 40 : bx - 12;
    armY = by + 22;
  }

  drawPixelRect(ctx, armX, armY, 16, 8, darkColor);

  // 攻击 / 技能拖尾
  if (mecha.state === 'attack' || mecha.state === 'skill' || mecha.state === 'throw') {
    const gradient = ctx.createLinearGradient(
      f === 1 ? bx + MECHA_WIDTH : bx,
      by + 16,
      f === 1 ? bx + MECHA_WIDTH + 48 : bx - 48,
      by + 48,
    );
    gradient.addColorStop(0, getElementColor(mecha.element));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;
    const slashX = f === 1 ? bx + MECHA_WIDTH : bx - 48;
    ctx.fillRect(slashX, by + 16, 48, 32);
    ctx.globalAlpha = 1;
  }

  // 防御护盾 / 骑士举盾
  if (mecha.state === 'defend') {
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.25 + Math.sin(mecha.defendFlash * 0.8) * 0.1;
    const shieldX = f === 1 ? bx + MECHA_WIDTH - 4 : bx - 8;
    ctx.fillRect(shieldX, by + 8, 12, 48);
    ctx.globalAlpha = 1;
  }

  // 反击架势
  if (mecha.state === 'counter') {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6 + Math.sin(frameCount * 0.5) * 0.3;
    ctx.strokeRect(bx - 6, by - 6, MECHA_WIDTH + 12, MECHA_HEIGHT + 12);
    ctx.globalAlpha = 1;
  }

  // 受击 / KO 闪烁
  if (mecha.state === 'hurt' || mecha.state === 'ko') {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx, by, MECHA_WIDTH, MECHA_HEIGHT);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

export function drawMecha(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  frameCount: number,
): void {
  const color = getMechaTypeColor(mecha.type);
  const darkColor = getMechaTypeDarkColor(mecha.type);
  const accentColor = getMechaTypeAccentColor(mecha.type);

  // 影子
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(mecha.x + 4, GROUND_Y - 4, MECHA_WIDTH - 8, 4);

  // 冲刺残影
  if (mecha.state === 'dash') {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    for (let i = 1; i <= 4; i++) {
      const ghostX = mecha.x - mecha.facing * i * 16;
      ctx.fillRect(ghostX, mecha.y, MECHA_WIDTH, MECHA_HEIGHT);
    }
    ctx.globalAlpha = 1;
  }

  // 元素光晕
  if (mecha.state !== 'ko') {
    drawElementalAura(ctx, mecha, frameCount);
  }

  drawCharacterBody(ctx, mecha, color, darkColor, accentColor, frameCount);
}

export function drawSlashTrails(
  ctx: CanvasRenderingContext2D,
  slashes: SlashTrail[],
): void {
  slashes.forEach((s) => {
    const alpha = s.life / s.maxLife;
    const gradient = ctx.createLinearGradient(
      s.facing === 1 ? s.x : s.x + s.width,
      s.y,
      s.facing === 1 ? s.x + s.width : s.x,
      s.y,
    );
    gradient.addColorStop(0, s.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.width, s.height);
  });
  ctx.globalAlpha = 1;
}

export function drawProjectiles(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[],
): void {
  projectiles.forEach((p) => {
    // 轨道子弹绘制外圈轨迹
    if (p.behavior === 'orbit') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(
        Math.floor(p.orbitCenterX ?? p.x),
        Math.floor(p.orbitCenterY ?? p.y),
        p.orbitRadius ?? 20,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 核心亮点
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 尾焰
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.5;
    if (p.behavior === 'wave') {
      const tailDir = p.vx > 0 ? -1 : 1;
      ctx.fillRect(
        Math.floor(p.x + tailDir * 18),
        Math.floor(p.y - 3),
        18,
        6,
      );
    } else if (p.behavior === 'linear') {
      ctx.fillRect(
        Math.floor(p.x - (p.vx > 0 ? 22 : -22)),
        Math.floor(p.y - 4),
        22,
        8,
      );
    }
    ctx.globalAlpha = 1;
  });
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
): void {
  particles.forEach((p) => {
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

export function drawFloatingTexts(
  ctx: CanvasRenderingContext2D,
  texts: FloatingText[],
): void {
  ctx.font = 'bold 16px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  texts.forEach((t) => {
    const alpha = t.life / t.maxLife;
    ctx.fillStyle = t.color;
    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.translate(Math.floor(t.x), Math.floor(t.y));
    ctx.scale(t.scale, t.scale);
    ctx.fillText(t.text, 0, 0);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

function drawSkillTelegraph(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
): void {
  if (mecha.state !== 'skill' && mecha.state !== 'throw') return;
  if (!mecha.skillId) return;
  const cfg = SKILL_CONFIG[mecha.skillId];
  if (!cfg || cfg.range <= 0) return;

  const f = mecha.facing;
  const x = mecha.x + (f === 1 ? MECHA_WIDTH : -cfg.range);
  const y = mecha.y + MECHA_HEIGHT * 0.25;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(x, y, cfg.range, MECHA_HEIGHT * 0.5);
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
): void {
  // 相机跟随两位机甲的中点，限制在世界范围内
  const midX = (state.red.x + state.blue.x + MECHA_WIDTH) / 2;
  const rawCameraX = midX - CANVAS_WIDTH / 2;
  const cameraX = Math.max(0, Math.min(rawCameraX, WORLD_WIDTH - CANVAS_WIDTH));

  ctx.save();

  // 必杀特写缩放
  if (state.ultimateCinematic > 0) {
    const progress = 1 - state.ultimateCinematic / 40;
    const scale = 1 + progress * 0.3;
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
  }

  // 屏幕震动
  if (state.shake > 0) {
    const dx = (Math.random() - 0.5) * state.shake;
    const dy = (Math.random() - 0.5) * state.shake;
    ctx.translate(dx, dy);
  }

  clearCanvas(ctx);
  drawBackground(ctx, cameraX);

  // 进入世界坐标系
  ctx.translate(-cameraX, 0);

  drawGround(ctx);
  drawProjectiles(ctx, state.projectiles);
  drawParticles(ctx, state.particles);
  drawSlashTrails(ctx, state.slashes);

  drawSkillTelegraph(ctx, state.red);
  drawSkillTelegraph(ctx, state.blue);

  drawMecha(ctx, state.red, state.frameCount);
  drawMecha(ctx, state.blue, state.frameCount);

  drawFloatingTexts(ctx, state.texts);

  ctx.restore();

  // 屏幕闪光
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${state.flash / 12})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // 命中定格时压暗画面增强冲击感
  if (state.hitStop > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${state.hitStop / 30})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

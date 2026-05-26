export type CharacterState = 'idle' | 'walk' | 'jump';
export type Direction = 'left' | 'right';

export interface CharacterConfig {
  x: number;
  y: number;
}

const SPRITE_COLORS = {
  skin: '#FFCC99',
  hair: '#4A2800',
  shirt: '#CE1126',
  pants: '#003F87',
  shoes: '#4A2800',
  eye: '#000000',
  outline: '#1A1A2E',
};

export class CharacterSystem {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  state: CharacterState = 'idle';
  direction: Direction = 'right';
  frameIndex: number = 0;
  frameTimer: number = 0;
  private grounded: boolean = false;
  private readonly gravity: number = 0.5;
  private readonly jumpForce: number = -6;
  private readonly moveSpeed: number = 1.5;
  private readonly friction: number = 0.85;

  constructor(config: CharacterConfig) {
    this.x = config.x;
    this.y = config.y;
  }

  update(dt: number, keys: Set<string>, getGroundY: (x: number) => number) {
    const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
    const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
    const jump = keys.has('ArrowUp') || keys.has('w') || keys.has('W') || keys.has(' ');

    if (left) {
      this.vx = -this.moveSpeed;
      this.direction = 'left';
    } else if (right) {
      this.vx = this.moveSpeed;
      this.direction = 'right';
    } else {
      this.vx *= this.friction;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    if (jump && this.grounded) {
      this.vy = this.jumpForce;
      this.grounded = false;
      this.state = 'jump';
    }

    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    const groundY = getGroundY(this.x);
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.grounded = true;
    }

    if (this.grounded) {
      if (Math.abs(this.vx) > 0.3) {
        this.state = 'walk';
      } else {
        this.state = 'idle';
      }
    } else {
      this.state = 'jump';
    }

    this.frameTimer += dt;
    if (this.frameTimer > 0.15) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % 4;
    }
  }

  render(ctx: CanvasRenderingContext2D, pixelSize: number) {
    const scale = Math.max(1, Math.floor(pixelSize * 0.8));
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);

    ctx.save();
    if (this.direction === 'left') {
      ctx.translate(px, py);
      ctx.scale(-1, 1);
      ctx.translate(-px, 0);
    }

    const bounce = this.state === 'walk' ? Math.sin(this.frameIndex * Math.PI / 2) * 1 : 0;
    const squash = this.state === 'jump' ? (this.vy < 0 ? -1 : 1) : 0;

    this.drawCharacter(ctx, px, py - bounce + squash, scale);

    ctx.restore();
  }

  private drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
    const C = SPRITE_COLORS;
    const o = C.outline;

    this.rect(ctx, x - 3*s, y - 14*s, 6*s, 2*s, C.hair);
    this.rect(ctx, x - 4*s, y - 12*s, 8*s, 4*s, C.skin);
    this.rect(ctx, x - 4*s, y - 12*s, 8*s, 1*s, C.hair);
    this.rect(ctx, x + 1*s, y - 10*s, 1*s, 1*s, C.eye);
    this.rect(ctx, x - 4*s, y - 8*s, 8*s, 1*s, o);
    this.rect(ctx, x - 3*s, y - 7*s, 6*s, 4*s, C.shirt);
    this.rect(ctx, x - 3*s, y - 3*s, 3*s, 4*s, C.pants);
    this.rect(ctx, x + 0*s, y - 3*s, 3*s, 4*s, C.pants);
    this.rect(ctx, x - 3*s, y + 1*s, 2*s, 2*s, C.shoes);
    this.rect(ctx, x + 1*s, y + 1*s, 2*s, 2*s, C.shoes);

    if (this.state === 'walk') {
      const legOffset = this.frameIndex % 2 === 0 ? 1 : -1;
      this.rect(ctx, x - 3*s, y - 3*s, 2*s, 4*s, C.pants);
      this.rect(ctx, x + 1*s + legOffset*s, y - 3*s, 2*s, 4*s, C.pants);
    }

    if (this.state === 'idle') {
      const breathe = Math.sin(Date.now() * 0.003) * 0.5;
      this.rect(ctx, x - 3*s, y - 7*s - breathe, 6*s, 4*s, C.shirt);
    }
  }

  private rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.max(1, Math.floor(w)), Math.max(1, Math.floor(h)));
  }
}

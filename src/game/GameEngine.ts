import { PixelRenderer } from './PixelRenderer';
import { WaveSystem, WaveConfig } from './WaveSystem';
import { BelizeEffect, BelizeConfig } from './BelizeEffect';
import { CharacterSystem } from './CharacterSystem';
import { FrameRateController } from './FrameRateController';

export interface GameEngineConfig {
  pixelSize: number;
  targetFps: number;
  wave: WaveConfig;
  belize: BelizeConfig;
}

export class GameEngine {
  private renderer!: PixelRenderer;
  private waveSystem: WaveSystem;
  private belizeEffect: BelizeEffect;
  private character: CharacterSystem;
  private fpsController: FrameRateController;
  private animFrameId: number = 0;
  private keys: Set<string> = new Set();
  private lastTime: number = 0;
  private running: boolean = false;
  private onFpsUpdate?: (fps: number) => void;
  private stars: Array<{ x: number; y: number; brightness: number; speed: number }> = [];

  private cleanupFn: (() => void) | null = null;

  constructor(private canvas: HTMLCanvasElement, private config: GameEngineConfig) {
    this.fpsController = new FrameRateController(config.targetFps);
    this.waveSystem = new WaveSystem(config.wave);
    this.belizeEffect = new BelizeEffect(config.belize);
    this.character = new CharacterSystem({ x: 0, y: 0 });

    this.initRenderer();
    this.initStars();
    this.initInput();
  }

  private initRenderer() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.renderer = new PixelRenderer(this.canvas, {
      pixelSize: this.config.pixelSize,
      width: rect.width,
      height: rect.height,
    });

    this.character.x = this.renderer.virtualW / 2;
    this.character.y = this.renderer.virtualH * 0.4;
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * 320,
        y: Math.random() * 100,
        brightness: Math.random(),
        speed: 0.5 + Math.random() * 2,
      });
    }
  }

  private initInput() {
    const onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.key);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    this.cleanupFn = () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }

  setFpsCallback(cb: (fps: number) => void) {
    this.onFpsUpdate = cb;
  }

  updateConfig(config: Partial<GameEngineConfig>) {
    if (config.pixelSize !== undefined) {
      this.config.pixelSize = config.pixelSize;
      this.renderer.updatePixelSize(config.pixelSize);
    }
    if (config.targetFps !== undefined) {
      this.config.targetFps = config.targetFps;
      this.fpsController.setTargetFps(config.targetFps);
    }
    if (config.wave !== undefined) {
      this.config.wave = config.wave;
      this.waveSystem.rebuildLayers(config.wave);
    }
    if (config.belize !== undefined) {
      this.config.belize = config.belize;
      this.belizeEffect.updateConfig(config.belize);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.fpsController.reset();
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.cleanupFn) this.cleanupFn();
  }

  private loop = (timestamp: number) => {
    if (!this.running) return;

    this.animFrameId = requestAnimationFrame(this.loop);

    if (!this.fpsController.shouldRender(timestamp)) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    if (this.onFpsUpdate) {
      this.onFpsUpdate(this.fpsController.getCurrentFps());
    }
  };

  private update(dt: number) {
    this.waveSystem.update(dt);
    this.belizeEffect.update(dt);

    const getGroundY = (x: number) => {
      return this.waveSystem.getSurfaceY(x, this.renderer.virtualH) - 3;
    };

    this.character.update(dt, this.keys, getGroundY);

    if (this.character.x < 4) this.character.x = 4;
    if (this.character.x > this.renderer.virtualW - 4) {
      this.character.x = this.renderer.virtualW - 4;
    }

    for (const star of this.stars) {
      star.brightness = 0.3 + Math.sin(performance.now() * 0.001 * star.speed + star.x) * 0.7;
    }
  }

  private render() {
    const ctx = this.renderer.ctx;
    const w = this.renderer.virtualW;
    const h = this.renderer.virtualH;

    this.renderer.clear('#0A1628');

    this.renderStars(ctx, w, h);
    this.belizeEffect.render(ctx, w, h);
    this.waveSystem.render(ctx, w, h);
    this.character.render(ctx, this.config.pixelSize);

    this.renderFpsOverlay(ctx);

    this.renderer.render();
  }

  private renderStars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (const star of this.stars) {
      if (star.x > w || star.y > h * 0.5) continue;
      const alpha = Math.max(0, Math.min(1, star.brightness));
      const gray = Math.floor(150 + alpha * 105);
      ctx.fillStyle = `rgb(${gray},${gray},${Math.min(255, gray + 50)})`;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 1, 1);
    }
  }

  private renderFpsOverlay(ctx: CanvasRenderingContext2D) {
    const fps = this.fpsController.getCurrentFps();
    ctx.fillStyle = '#FFD100';
    ctx.font = '6px monospace';
    ctx.fillText(`FPS:${fps}`, 2, 8);
    ctx.fillText(`PX:${this.config.pixelSize}`, 2, 16);
  }

  resize(width: number, height: number) {
    this.renderer.resize(width, height);
  }

  getCharacterState() {
    return {
      x: this.character.x,
      y: this.character.y,
      state: this.character.state,
      direction: this.character.direction,
    };
  }
}

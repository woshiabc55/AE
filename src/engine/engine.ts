import { Analyser } from '@/audio/analyser';
import { StarField } from './sky';
import { Sun } from './sun';
import { GridPlane } from './gridPlane';
import { Orb } from './orb';
import { ParticleField } from './particles';
import { WaveRibbon } from './waveRibbon';
import { SpectrumColumns } from './spectrumColumns';
import { Shockwave } from './shockwave';
import { PostFx } from './postFx';
import type { Theme } from '@/themes/themes';
import { themes } from '@/themes/themes';

export interface EngineCallbacks {
  onHud: (hud: {
    fps: number;
    rms: number;
    bpm: number;
    beat: number;
    mode: string;
    resolution: string;
  }) => void;
  getSettings: () => {
    sensitivity: number;
    density: number;
    speed: number;
    glow: number;
    ripple: boolean;
    paused: boolean;
    themeId: keyof typeof themes;
  };
}

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyser: Analyser;
  private stars = new StarField();
  private sun = new Sun();
  private grid = new GridPlane();
  private orb = new Orb();
  private particles = new ParticleField();
  private wave = new WaveRibbon();
  private spectrum = new SpectrumColumns();
  private shock = new Shockwave();
  private post = new PostFx();
  private raf = 0;
  private last = performance.now();
  private fpsAcc = 0;
  private fpsCount = 0;
  private fpsTimer = 0;
  private t = 0;
  private running = false;
  private cb: EngineCallbacks;
  private width = 0;
  private height = 0;
  private dpr = 1;
  // 地平线高度（屏幕高度的 0.55）
  private horizonY = 0;
  // 拖尾衰减层
  private trailCanvas: HTMLCanvasElement | null = null;
  private trailCtx: CanvasRenderingContext2D | null = null;

  private pointerHandler = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.particles.setPointer(e.clientX - rect.left, e.clientY - rect.top);
  };
  private pointerLeave = () => this.particles.setPointer(-9999, -9999);

  constructor(canvas: HTMLCanvasElement, analyser: Analyser, cb: EngineCallbacks) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D 不可用');
    this.ctx = ctx;
    this.analyser = analyser;
    this.cb = cb;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = dpr;
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.horizonY = rect.height * 0.58;
    this.stars.setSize(rect.width, rect.height);
    this.particles.setSize(rect.width, rect.height);
    if (!this.trailCanvas) {
      this.trailCanvas = document.createElement('canvas');
    }
    this.trailCanvas.width = Math.floor(rect.width * dpr);
    this.trailCanvas.height = Math.floor(rect.height * dpr);
    this.trailCtx = this.trailCanvas.getContext('2d');
    if (this.trailCtx) this.trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.canvas.addEventListener('pointermove', this.pointerHandler);
    this.canvas.addEventListener('pointerleave', this.pointerLeave);
    this.resize();
    window.addEventListener('resize', this.resize);
    const loop = () => {
      if (!this.running) return;
      this.frame();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.canvas.removeEventListener('pointermove', this.pointerHandler);
    this.canvas.removeEventListener('pointerleave', this.pointerLeave);
  }

  applyDensity(value: number) {
    // 0..1 -> 300..1100
    const n = Math.floor(300 + value * 800);
    this.particles.setCount(n);
  }

  private frame() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt;

    const settings = this.cb.getSettings();
    const theme: Theme = themes[settings.themeId];

    // 拉取音频数据
    const freqData = this.analyser.getFrequencyData();
    const timeData = this.analyser.getTimeDomainData();
    const bands = this.analyser.getBands();
    const { beat, bpm } = this.analyser.detectBeat();
    const rms = this.analyser.getRMS();

    if (!settings.paused) {
      this.particles.update(
        bands,
        beat,
        dt,
        settings.sensitivity,
        settings.speed,
        this.horizonY,
      );
      this.shock.update(dt);
      this.shock.trigger(this.width / 2, this.horizonY, beat);
    }

    // 计算帧率
    this.fpsAcc += 1 / Math.max(dt, 0.001);
    this.fpsCount++;
    this.fpsTimer += dt;
    let fps = 0;
    if (this.fpsTimer >= 0.5) {
      fps = this.fpsAcc / this.fpsCount;
      this.fpsAcc = 0;
      this.fpsCount = 0;
      this.fpsTimer = 0;
      this.cb.onHud({
        fps: Math.round(fps),
        rms,
        bpm: Math.round(bpm),
        beat,
        mode: beat > 0.45 ? 'PEAK' : rms > 0.08 ? 'LIVE' : 'IDLE',
        resolution: `${Math.round(this.width)} x ${Math.round(this.height)}`,
      });
    }

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const hy = this.horizonY;

    // ========== 1. 天空层（每帧不重绘背景渐变，先用 trail 画布做"轻拖尾"）==========
    // 直接绘制底色（不做 trail，避免叠色）
    const skyGrad = ctx.createLinearGradient(0, 0, 0, hy);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, hy);

    // 远星
    this.stars.draw(ctx, theme, w, h, this.t, beat);

    // ========== 2. 日盘 ==========
    this.sun.draw(ctx, theme, w, h, this.t, beat, hy);

    // ========== 3. 地平面（远山 + 网格 + 反射）==========
    this.grid.draw(ctx, theme, w, h, this.t, bands.low, beat, hy);

    // ========== 4. 频谱柱（从地平线拔起）==========
    this.spectrum.draw(ctx, freqData, theme, w, h, beat, settings.sensitivity, hy);

    // ========== 5. 波形带（悬浮在日盘上方）==========
    this.wave.draw(ctx, freqData, timeData, theme, w, h, this.t, beat, settings.sensitivity, hy);

    // ========== 6. 中央球 ==========
    this.orb.draw(ctx, theme, w, h, this.t, beat, rms, bands, hy);

    // ========== 7. 粒子 ==========
    this.particles.draw(ctx, theme, beat, settings.glow, settings.ripple);

    // ========== 8. 冲击波 ==========
    this.shock.draw(ctx, theme, w, h, Math.max(w, h) * 0.8);

    // ========== 9. 后期：扫描线 + 暗角 + 颗粒 + 色差 ==========
    this.post.draw(ctx, theme, w, h, this.t, beat);
  }
}

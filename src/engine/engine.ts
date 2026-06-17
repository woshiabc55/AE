import { Analyser } from '@/audio/analyser';
import { ParticleField } from './particles';
import { Spectrum } from './spectrum';
import { Waveform } from './waveform';
import { CenterGlow } from './glow';
import { Grid } from './grid';
import type { Theme } from '@/themes/themes';
import { themes } from '@/themes/themes';

export interface EngineCallbacks {
  onHud: (hud: { fps: number; rms: number; bpm: number; beat: number; mode: string; resolution: string }) => void;
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
  private particles = new ParticleField();
  private spectrum = new Spectrum();
  private waveform = new Waveform();
  private glowC = new CenterGlow();
  private grid = new Grid();
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
    this.particles.setSize(rect.width, rect.height, dpr);
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
    // 0..1 -> 200..1000
    const n = Math.floor(200 + value * 800);
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
      this.particles.update(bands, beat, dt, settings.sensitivity, settings.speed);
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
        mode: beat > 0.4 ? 'BEAT' : rms > 0.08 ? 'LIVE' : 'IDLE',
        resolution: `${Math.round(this.width)} x ${Math.round(this.height)}`,
      });
    }

    // 绘制
    const ctx = this.ctx;
    // 背景（带轻微拖尾衰减，形成波纹轨迹）
    const trail = 0.18;
    const bg = theme.background;
    // 由背景色派生一个带 alpha 的 rgba
    ctx.fillStyle = `rgba(${hexToRgb(bg)}, ${trail})`;
    ctx.fillRect(0, 0, this.width, this.height);
    // 第一次绘制时直接全填充以建立底色
    if (this.t < 0.05) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    // 网格
    this.grid.draw(ctx, theme, this.width, this.height, this.t);
    // 中心辉光（在波形下、粒子上）
    this.glowC.draw(ctx, theme, this.width, this.height, beat, rms, this.t, settings.glow);
    // 波形
    this.waveform.draw(ctx, timeData, theme, this.width, this.height, beat, rms);
    // 频谱柱
    this.spectrum.draw(ctx, freqData, theme, this.width, this.height, beat, settings.sensitivity);
    // 粒子
    this.particles.draw(ctx, theme, beat, settings.glow, settings.ripple);
  }
}

function hexToRgb(hex: string): string {
  // 支持 #RRGGBB / #RGB
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

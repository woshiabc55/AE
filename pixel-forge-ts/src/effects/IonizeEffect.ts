import type { EventBus } from '../core/EventBus';
import type { Effect, EffectParam } from './Effect';

export class IonizeEffect implements Effect {
  readonly id = 'ionize';
  readonly name = 'Ionize';
  readonly description = 'Dissolves pixels into scattered ion-like particles';
  readonly params: EffectParam[] = [
    {
      name: 'intensity',
      label: 'Intensity',
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.5,
    },
    {
      name: 'scatter',
      label: 'Scatter',
      type: 'range',
      min: 1,
      max: 20,
      step: 0.5,
      default: 5,
    },
    {
      name: 'threshold',
      label: 'Threshold',
      type: 'range',
      min: 0,
      max: 255,
      step: 1,
      default: 30,
    },
    {
      name: 'colorShift',
      label: 'Color Shift',
      type: 'boolean',
      default: true,
    },
  ];

  private paramValues: Map<string, number | boolean | string> = new Map();
  private bus: EventBus | null = null;
  private seed = 42;

  constructor() {
    for (const p of this.params) {
      this.paramValues.set(p.name, p.default);
    }
  }

  init(bus: EventBus): void {
    this.bus = bus;
  }

  private seededRandom(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  render(ctx: CanvasRenderingContext2D, sourceData: ImageData, time: number): void {
    const { width, height, data } = sourceData;
    const intensity = this.paramValues.get('intensity') as number;
    const scatter = this.paramValues.get('scatter') as number;
    const threshold = this.paramValues.get('threshold') as number;
    const colorShift = this.paramValues.get('colorShift') as boolean;

    this.seed = 42;

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    for (let i = 0; i < data.length; i += 4) {
      out[i] = data[i]!;
      out[i + 1] = data[i + 1]!;
      out[i + 2] = data[i + 2]!;
      out[i + 3] = data[i + 3]!;
    }

    const pixelCount = width * height;
    const ionsToScatter = Math.floor(pixelCount * intensity * 0.3);

    for (let i = 0; i < ionsToScatter; i++) {
      const px = Math.floor(this.seededRandom() * width);
      const py = Math.floor(this.seededRandom() * height);
      const srcIdx = (py * width + px) * 4;

      const r = data[srcIdx]!;
      const g = data[srcIdx + 1]!;
      const b = data[srcIdx + 2]!;
      const a = data[srcIdx + 3]!;

      const brightness = (r + g + b) / 3;
      if (brightness < threshold && a < 128) continue;

      const angle = this.seededRandom() * Math.PI * 2 + time * (0.5 + this.seededRandom());
      const dist = this.seededRandom() * scatter * intensity * 10;

      const dx = Math.round(Math.cos(angle) * dist);
      const dy = Math.round(Math.sin(angle) * dist);
      const destX = Math.max(0, Math.min(width - 1, px + dx));
      const destY = Math.max(0, Math.min(height - 1, py + dy));
      const destIdx = (destY * width + destX) * 4;

      let or = r, og = g, ob = b;
      if (colorShift) {
        const shift = Math.sin(time * 3 + this.seededRandom() * 6.28) * 40;
        or = Math.max(0, Math.min(255, r + shift));
        og = Math.max(0, Math.min(255, g + shift * 0.5));
        ob = Math.max(0, Math.min(255, b - shift * 0.3));
      }

      out[destIdx] = Math.min(255, out[destIdx]! + or * 0.5);
      out[destIdx + 1] = Math.min(255, out[destIdx + 1]! + og * 0.5);
      out[destIdx + 2] = Math.min(255, out[destIdx + 2]! + ob * 0.5);
      out[destIdx + 3] = Math.min(255, Math.max(out[destIdx + 3]!, a));

      const fadeAlpha = 1 - (dist / (scatter * intensity * 10 + 1));
      out[srcIdx] = Math.round(r * fadeAlpha);
      out[srcIdx + 1] = Math.round(g * fadeAlpha);
      out[srcIdx + 2] = Math.round(b * fadeAlpha);
      out[srcIdx + 3] = Math.round(a * fadeAlpha);
    }

    ctx.putImageData(outData, 0, 0);
  }

  setParam(name: string, value: number | boolean | string): void {
    this.paramValues.set(name, value);
    this.bus?.emit('param:change', { effectId: this.id, param: name, value });
  }

  getParam(name: string): number | boolean | string {
    return this.paramValues.get(name) ?? this.params.find(p => p.name === name)!.default;
  }

  reset(): void {
    for (const p of this.params) {
      this.paramValues.set(p.name, p.default);
    }
    this.bus?.emit('effect:reset', { effectId: this.id });
  }

  dispose(): void {
    this.bus?.emit('effect:dispose', { effectId: this.id });
    this.bus = null;
    this.paramValues.clear();
  }
}

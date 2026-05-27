import type { EventBus } from '../core/EventBus';
import type { Effect, EffectParam } from './Effect';

export class GlitchEffect implements Effect {
  readonly id = 'glitch';
  readonly name = 'Glitch';
  readonly description = 'Digital glitch distortion with scanlines and color channel displacement';
  readonly params: EffectParam[] = [
    {
      name: 'intensity',
      label: 'Intensity',
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.3,
    },
    {
      name: 'sliceCount',
      label: 'Slice Count',
      type: 'range',
      min: 1,
      max: 30,
      step: 1,
      default: 8,
    },
    {
      name: 'channelOffset',
      label: 'Channel Offset',
      type: 'range',
      min: 0,
      max: 30,
      step: 1,
      default: 5,
    },
    {
      name: 'scanlines',
      label: 'Scanlines',
      type: 'boolean',
      default: true,
    },
  ];

  private paramValues: Map<string, number | boolean | string> = new Map();
  private bus: EventBus | null = null;
  private glitchTimer = 0;
  private activeSlices: { y: number; h: number; offset: number }[] = [];

  constructor() {
    for (const p of this.params) {
      this.paramValues.set(p.name, p.default);
    }
  }

  init(bus: EventBus): void {
    this.bus = bus;
  }

  private regenerateSlices(height: number): void {
    const sliceCount = this.paramValues.get('sliceCount') as number;
    const intensity = this.paramValues.get('intensity') as number;
    this.activeSlices = [];
    const numSlices = Math.floor(sliceCount * intensity);
    for (let i = 0; i < numSlices; i++) {
      const y = Math.floor(Math.random() * height);
      const h = Math.floor(Math.random() * (height * 0.15 * intensity)) + 1;
      const offset = Math.floor((Math.random() - 0.5) * 40 * intensity);
      this.activeSlices.push({ y, h, offset });
    }
  }

  render(ctx: CanvasRenderingContext2D, sourceData: ImageData, _time: number): void {
    const { width, height, data } = sourceData;
    const intensity = this.paramValues.get('intensity') as number;
    const channelOffset = this.paramValues.get('channelOffset') as number;
    const scanlines = this.paramValues.get('scanlines') as boolean;

    this.glitchTimer += 1;
    if (this.glitchTimer % Math.max(1, Math.floor(6 - intensity * 5)) === 0) {
      this.regenerateSlices(height);
    }

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    for (let y = 0; y < height; y++) {
      let rowOffset = 0;
      for (const slice of this.activeSlices) {
        if (y >= slice.y && y < slice.y + slice.h) {
          rowOffset = slice.offset;
          break;
        }
      }

      for (let x = 0; x < width; x++) {
        const dstIdx = (y * width + x) * 4;

        const srcXr = Math.max(0, Math.min(width - 1, x + rowOffset));
        const srcXg = Math.max(0, Math.min(width - 1, x + rowOffset + channelOffset));
        const srcXb = Math.max(0, Math.min(width - 1, x + rowOffset - channelOffset));

        const idxR = (y * width + srcXr) * 4;
        const idxG = (y * width + srcXg) * 4;
        const idxB = (y * width + srcXb) * 4;

        out[dstIdx] = data[idxR]!;
        out[dstIdx + 1] = data[idxG + 1]!;
        out[dstIdx + 2] = data[idxB + 2]!;
        out[dstIdx + 3] = data[idxR + 3]!;
      }
    }

    if (scanlines) {
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          out[idx] = Math.floor(out[idx]! * 0.85);
          out[idx + 1] = Math.floor(out[idx + 1]! * 0.85);
          out[idx + 2] = Math.floor(out[idx + 2]! * 0.85);
        }
      }
    }

    if (Math.random() < intensity * 0.15) {
      const noiseCount = Math.floor(width * height * intensity * 0.01);
      for (let i = 0; i < noiseCount; i++) {
        const nx = Math.floor(Math.random() * width);
        const ny = Math.floor(Math.random() * height);
        const idx = (ny * width + nx) * 4;
        out[idx] = Math.floor(Math.random() * 255);
        out[idx + 1] = Math.floor(Math.random() * 255);
        out[idx + 2] = Math.floor(Math.random() * 255);
        out[idx + 3] = 255;
      }
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
    this.activeSlices = [];
    this.glitchTimer = 0;
    this.bus?.emit('effect:reset', { effectId: this.id });
  }

  dispose(): void {
    this.bus?.emit('effect:dispose', { effectId: this.id });
    this.bus = null;
    this.paramValues.clear();
    this.activeSlices = [];
  }
}

import type { EventBus } from '../core/EventBus';
import type { Effect, EffectParam } from './Effect';

export class PixelateEffect implements Effect {
  readonly id = 'pixelate';
  readonly name = 'Pixelate';
  readonly description = 'Reduces image resolution by pixelating into larger blocks';
  readonly params: EffectParam[] = [
    {
      name: 'blockSize',
      label: 'Block Size',
      type: 'range',
      min: 2,
      max: 64,
      step: 1,
      default: 8,
    },
    {
      name: 'animate',
      label: 'Animate',
      type: 'boolean',
      default: false,
    },
    {
      name: 'minBlock',
      label: 'Min Block',
      type: 'range',
      min: 1,
      max: 32,
      step: 1,
      default: 2,
    },
    {
      name: 'maxBlock',
      label: 'Max Block',
      type: 'range',
      min: 4,
      max: 64,
      step: 1,
      default: 32,
    },
  ];

  private paramValues: Map<string, number | boolean | string> = new Map();
  private bus: EventBus | null = null;

  constructor() {
    for (const p of this.params) {
      this.paramValues.set(p.name, p.default);
    }
  }

  init(bus: EventBus): void {
    this.bus = bus;
  }

  render(ctx: CanvasRenderingContext2D, sourceData: ImageData, time: number): void {
    const { width, height, data } = sourceData;
    let blockSize = this.paramValues.get('blockSize') as number;

    const animate = this.paramValues.get('animate') as boolean;
    if (animate) {
      const minB = this.paramValues.get('minBlock') as number;
      const maxB = this.paramValues.get('maxBlock') as number;
      blockSize = Math.round(minB + (maxB - minB) * (0.5 + 0.5 * Math.sin(time * 2)));
    }

    blockSize = Math.max(1, Math.round(blockSize));

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    for (let by = 0; by < height; by += blockSize) {
      for (let bx = 0; bx < width; bx += blockSize) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        const endY = Math.min(by + blockSize, height);
        const endX = Math.min(bx + blockSize, width);

        for (let y = by; y < endY; y++) {
          for (let x = bx; x < endX; x++) {
            const idx = (y * width + x) * 4;
            r += data[idx]!;
            g += data[idx + 1]!;
            b += data[idx + 2]!;
            a += data[idx + 3]!;
            count++;
          }
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);

        for (let y = by; y < endY; y++) {
          for (let x = bx; x < endX; x++) {
            const idx = (y * width + x) * 4;
            out[idx] = r;
            out[idx + 1] = g;
            out[idx + 2] = b;
            out[idx + 3] = a;
          }
        }
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
    this.bus?.emit('effect:reset', { effectId: this.id });
  }

  dispose(): void {
    this.bus?.emit('effect:dispose', { effectId: this.id });
    this.bus = null;
    this.paramValues.clear();
  }
}

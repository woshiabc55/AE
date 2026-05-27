import type { EventBus } from '../core/EventBus';
import type { Effect, EffectParam } from './Effect';

export class WaveEffect implements Effect {
  readonly id = 'wave';
  readonly name = 'Wave';
  readonly description = 'Applies line-based sinusoidal wave distortion to the image';
  readonly params: EffectParam[] = [
    {
      name: 'amplitude',
      label: 'Amplitude',
      type: 'range',
      min: 0,
      max: 50,
      step: 0.5,
      default: 10,
    },
    {
      name: 'frequency',
      label: 'Frequency',
      type: 'range',
      min: 0.01,
      max: 0.5,
      step: 0.01,
      default: 0.1,
    },
    {
      name: 'speed',
      label: 'Speed',
      type: 'range',
      min: 0,
      max: 10,
      step: 0.1,
      default: 2,
    },
    {
      name: 'direction',
      label: 'Direction',
      type: 'select',
      default: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Both', value: 'both' },
      ],
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
    const amplitude = this.paramValues.get('amplitude') as number;
    const frequency = this.paramValues.get('frequency') as number;
    const speed = this.paramValues.get('speed') as number;
    const direction = this.paramValues.get('direction') as string;

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let srcX = x;
        let srcY = y;

        if (direction === 'horizontal' || direction === 'both') {
          srcX = x + Math.sin(y * frequency + time * speed) * amplitude;
        }
        if (direction === 'vertical' || direction === 'both') {
          srcY = y + Math.sin(x * frequency + time * speed) * amplitude;
        }

        srcX = Math.round(srcX);
        srcY = Math.round(srcY);

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const srcIdx = (srcY * width + srcX) * 4;
          const dstIdx = (y * width + x) * 4;
          out[dstIdx] = data[srcIdx]!;
          out[dstIdx + 1] = data[srcIdx + 1]!;
          out[dstIdx + 2] = data[srcIdx + 2]!;
          out[dstIdx + 3] = data[srcIdx + 3]!;
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

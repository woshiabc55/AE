import type { EventBus } from '../core/EventBus';
import type { Effect, EffectParam } from './Effect';

export class ChromaticEffect implements Effect {
  readonly id = 'chromatic';
  readonly name = 'Chromatic Aberration';
  readonly description = 'Simulates lens chromatic aberration by separating RGB channels with offset';
  readonly params: EffectParam[] = [
    {
      name: 'offset',
      label: 'Offset',
      type: 'range',
      min: 0,
      max: 20,
      step: 0.5,
      default: 4,
    },
    {
      name: 'animate',
      label: 'Animate',
      type: 'boolean',
      default: true,
    },
    {
      name: 'radial',
      label: 'Radial',
      type: 'boolean',
      default: false,
    },
    {
      name: 'angle',
      label: 'Angle',
      type: 'range',
      min: 0,
      max: 360,
      step: 1,
      default: 0,
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
    let offset = this.paramValues.get('offset') as number;
    const animate = this.paramValues.get('animate') as boolean;
    const radial = this.paramValues.get('radial') as boolean;
    const angleDeg = this.paramValues.get('angle') as number;

    if (animate) {
      offset *= 0.5 + 0.5 * Math.sin(time * 1.5);
    }

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    const cx = width / 2;
    const cy = height / 2;
    const angleRad = (angleDeg * Math.PI) / 180;
    const dirX = Math.cos(angleRad);
    const dirY = Math.sin(angleRad);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dstIdx = (y * width + x) * 4;

        if (radial) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(cx * cx + cy * cy);
          const factor = (dist / maxDist) * offset;
          const ndx = dx / (dist || 1);
          const ndy = dy / (dist || 1);

          const srcXr = Math.max(0, Math.min(width - 1, Math.round(x + ndx * factor)));
          const srcYr = Math.max(0, Math.min(height - 1, Math.round(y + ndy * factor)));
          const srcXb = Math.max(0, Math.min(width - 1, Math.round(x - ndx * factor)));
          const srcYb = Math.max(0, Math.min(height - 1, Math.round(y - ndy * factor)));

          const idxR = (srcYr * width + srcXr) * 4;
          const idxG = dstIdx;
          const idxB = (srcYb * width + srcXb) * 4;

          out[dstIdx] = data[idxR]!;
          out[dstIdx + 1] = data[idxG + 1]!;
          out[dstIdx + 2] = data[idxB + 2]!;
          out[dstIdx + 3] = data[idxG + 3]!;
        } else {
          const offRx = Math.round(offset * dirX);
          const offRy = Math.round(offset * dirY);
          const offBx = Math.round(-offset * dirX);
          const offBy = Math.round(-offset * dirY);

          const srcXr = Math.max(0, Math.min(width - 1, x + offRx));
          const srcYr = Math.max(0, Math.min(height - 1, y + offRy));
          const srcXb = Math.max(0, Math.min(width - 1, x + offBx));
          const srcYb = Math.max(0, Math.min(height - 1, y + offBy));

          const idxR = (srcYr * width + srcXr) * 4;
          const idxB = (srcYb * width + srcXb) * 4;

          out[dstIdx] = data[idxR]!;
          out[dstIdx + 1] = data[dstIdx + 1]!;
          out[dstIdx + 2] = data[idxB + 2]!;
          out[dstIdx + 3] = data[dstIdx + 3]!;
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

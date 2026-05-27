import type { EventBus } from '../core/EventBus';

export interface EffectParam {
  name: string;
  label: string;
  type: 'range' | 'boolean' | 'select';
  min?: number;
  max?: number;
  step?: number;
  default: number | boolean | string;
  options?: { label: string; value: string }[];
}

export interface Effect {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly params: EffectParam[];

  init(bus: EventBus): void;
  render(ctx: CanvasRenderingContext2D, sourceData: ImageData, time: number): void;
  setParam(name: string, value: number | boolean | string): void;
  getParam(name: string): number | boolean | string;
  reset(): void;
  dispose(): void;
}

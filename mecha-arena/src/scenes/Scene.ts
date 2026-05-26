import { InputManager } from '../engine/InputManager';

export abstract class Scene {
  abstract enter(): void;
  abstract exit(): void;
  abstract update(input: InputManager): Scene | null;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

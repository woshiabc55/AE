import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { InputManager } from './InputManager';
import type { Scene } from '../scenes/Scene';
import { TitleScene } from '../scenes/TitleScene';

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private input: InputManager;
  private currentScene: Scene;
  private animFrameId = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.input = new InputManager();
    this.currentScene = new TitleScene();
    this.currentScene.enter();
  }

  start() {
    this.loop();
  }

  private loop = () => {
    const nextScene = this.currentScene.update(this.input);
    if (nextScene) {
      this.currentScene.exit();
      this.currentScene = nextScene;
      this.currentScene.enter();
    }

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.currentScene.draw(this.ctx);

    this.input.update();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  stop() {
    cancelAnimationFrame(this.animFrameId);
  }
}

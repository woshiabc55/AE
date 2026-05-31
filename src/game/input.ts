import { P1_KEYS, P2_KEYS } from './types';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  defend: boolean;
  attackPressed: boolean;
  defendPressed: boolean;
}

export class InputManager {
  private keys: Set<string> = new Set();
  private justPressed: Set<string> = new Set();
  private prevKeys: Set<string> = new Set();

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  start() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  stop() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.keys.has(e.code)) {
      this.justPressed.add(e.code);
    }
    this.keys.add(e.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.code);
  }

  update() {
    this.prevKeys = new Set(this.keys);
  }

  postUpdate() {
    this.justPressed.clear();
  }

  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  isJustPressed(code: string): boolean {
    return this.justPressed.has(code);
  }

  getPlayerInput(player: 1 | 2): InputState {
    const keys = player === 1 ? P1_KEYS : P2_KEYS;
    return {
      left: this.isDown(keys.left),
      right: this.isDown(keys.right),
      up: this.isDown(keys.up),
      down: this.isDown(keys.down),
      attack: this.isDown(keys.attack),
      defend: this.isDown(keys.defend),
      attackPressed: this.isJustPressed(keys.attack),
      defendPressed: this.isJustPressed(keys.defend),
    };
  }
}

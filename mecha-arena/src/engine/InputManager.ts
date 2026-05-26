export class InputManager {
  private keys: Set<string> = new Set();
  private justPressed: Set<string> = new Set();
  private prevKeys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
      if (!this.prevKeys.has(e.key.toLowerCase())) {
        this.justPressed.add(e.key.toLowerCase());
      }
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }

  isDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  wasPressed(key: string): boolean {
    return this.justPressed.has(key.toLowerCase());
  }

  anyPressed(): boolean {
    return this.justPressed.size > 0;
  }

  update() {
    this.prevKeys = new Set(this.keys);
    this.justPressed.clear();
  }
}

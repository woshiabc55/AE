// 键鼠输入管理 + 指针锁定

export class Input {
  private keys = new Set<string>();
  private locked = false;
  private el: HTMLElement;
  public mouseDX = 0;
  public mouseDY = 0;
  public sensitivity = 1.0;
  public onLockChange?: (locked: boolean) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.bind();
  }

  private bind() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("pointerlockchange", this.handleLockChange);
    this.el.addEventListener("mousemove", this.handleMouseMove);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
    // 阻止方向键滚动
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.mouseDX += e.movementX * this.sensitivity;
    this.mouseDY += e.movementY * this.sensitivity;
  };

  private handleLockChange = () => {
    this.locked = document.pointerLockElement === this.el;
    this.onLockChange?.(this.locked);
  };

  requestLock() {
    if (!this.locked) {
      this.el.requestPointerLock?.();
    }
  }

  exitLock() {
    if (this.locked) document.exitPointerLock?.();
  }

  isLocked() {
    return this.locked;
  }

  isDown(code: string) {
    return this.keys.has(code);
  }

  // 移动输入：返回归一化方向 [-1,1]
  getMove(): { x: number; z: number } {
    let x = 0;
    let z = 0;
    if (this.isDown("KeyW") || this.isDown("ArrowUp")) z -= 1;
    if (this.isDown("KeyS") || this.isDown("ArrowDown")) z += 1;
    if (this.isDown("KeyA") || this.isDown("ArrowLeft")) x -= 1;
    if (this.isDown("KeyD") || this.isDown("ArrowRight")) x += 1;
    const len = Math.hypot(x, z);
    if (len > 0) {
      x /= len;
      z /= len;
    }
    return { x, z };
  }

  // 消费并清零鼠标增量
  consumeMouseDelta(): { dx: number; dy: number } {
    const dx = this.mouseDX;
    const dy = this.mouseDY;
    this.mouseDX = 0;
    this.mouseDY = 0;
    return { dx, dy };
  }

  dispose() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("pointerlockchange", this.handleLockChange);
    this.el.removeEventListener("mousemove", this.handleMouseMove);
  }
}

// 输入管理：键鼠状态 + 边沿触发

import type { InputState } from "@/types";

export class Input {
  private keys = new Set<string>();
  private pressedThisFrame = new Set<string>();
  private active = true;

  constructor() {
    window.addEventListener("keydown", this.onDown);
    window.addEventListener("keyup", this.onUp);
    window.addEventListener("blur", this.onBlur);
  }

  private onDown = (e: KeyboardEvent) => {
    // 阻止方向键 / 空格滚动页面
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Space",
      ].includes(e.code)
    ) {
      e.preventDefault();
    }
    if (!this.keys.has(e.code)) this.pressedThisFrame.add(e.code);
    this.keys.add(e.code);
  };

  private onUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onBlur = () => {
    this.keys.clear();
  };

  /** 读取当前帧输入 */
  poll(): InputState {
    const k = this.keys;
    const p = this.pressedThisFrame;
    const has = (...codes: string[]) => codes.some((c) => k.has(c));
    const pressed = (...codes: string[]) => codes.some((c) => p.has(c));
    return {
      left: has("KeyA", "ArrowLeft"),
      right: has("KeyD", "ArrowRight"),
      up: has("KeyW", "ArrowUp"),
      down: has("KeyS", "ArrowDown"),
      jumpHeld: has("Space", "KeyW", "ArrowUp"),
      attackHeld: has("KeyJ"),
      dashHeld: has("ShiftLeft", "ShiftRight", "KeyK"),
      blockHeld: has("KeyL"),
      jumpPressed: pressed("Space", "KeyW", "ArrowUp"),
      attackPressed: pressed("KeyJ"),
      dashPressed: pressed("ShiftLeft", "ShiftRight", "KeyK"),
      blockPressed: pressed("KeyL"),
    };
  }

  /** 帧末清除边沿 */
  endFrame() {
    this.pressedThisFrame.clear();
  }

  setActive(v: boolean) {
    this.active = v;
    if (!v) this.keys.clear();
  }

  destroy() {
    window.removeEventListener("keydown", this.onDown);
    window.removeEventListener("keyup", this.onUp);
    window.removeEventListener("blur", this.onBlur);
  }
}

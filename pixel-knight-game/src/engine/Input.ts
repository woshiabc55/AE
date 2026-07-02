// 输入管理：键鼠状态 + 边沿触发 + 技能键

import type { InputState, SkillId } from "@/types";
import { SKILL_ORDER, SKILLS } from "@/config";

export const SKILL_KEY_MAP: Record<SkillId, string> = Object.fromEntries(
  SKILL_ORDER.map((id) => [id, SKILLS[id].key]),
) as Record<SkillId, string>;

export class Input {
  private keys = new Set<string>();
  private pressedThisFrame = new Set<string>();

  constructor() {
    window.addEventListener("keydown", this.onDown);
    window.addEventListener("keyup", this.onUp);
    window.addEventListener("blur", this.onBlur);
  }

  private onDown = (e: KeyboardEvent) => {
    if (
      [
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space",
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

  poll(): InputState {
    const k = this.keys;
    const p = this.pressedThisFrame;
    const has = (...codes: string[]) => codes.some((c) => k.has(c));
    const pressed = (...codes: string[]) => codes.some((c) => p.has(c));

    const skillPressed = {} as Record<SkillId, boolean>;
    for (const id of SKILL_ORDER) {
      // 通过动态查表获取每个技能的按键
      skillPressed[id] = false;
    }
    // 直接按下技能键
    for (const id of SKILL_ORDER) {
      const key = SKILL_KEY_MAP[id];
      if (key && p.has(key)) skillPressed[id] = true;
    }

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
      skillPressed,
    };
  }

  endFrame() {
    this.pressedThisFrame.clear();
  }

  setActive(v: boolean) {
    if (!v) this.keys.clear();
  }

  destroy() {
    window.removeEventListener("keydown", this.onDown);
    window.removeEventListener("keyup", this.onUp);
    window.removeEventListener("blur", this.onBlur);
  }
}

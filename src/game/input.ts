import type { InputState } from './engine';

export type TouchStickState = {
  active: boolean;
  touchId: number | null;
  origin: { x: number; y: number };
  current: { x: number; y: number };
};

export function setupKeyboard(input: InputState) {
  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        input.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        input.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        input.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        input.right = true;
        break;
      case ' ':
      case 'Shift':
      case 'j':
      case 'J':
        input.dashQueued = true;
        break;
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        input.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        input.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        input.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        input.right = false;
        break;
    }
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}

export function setupTouch(stick: TouchStickState, input: InputState, getCanvasRect: () => DOMRect) {
  const onStart = (e: TouchEvent) => {
    if (stick.active) return;
    const t = e.changedTouches[0];
    const rect = getCanvasRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    // 仅在屏幕下半部分响应
    if (y < rect.height * 0.55) return;
    stick.active = true;
    stick.touchId = t.identifier;
    stick.origin = { x, y };
    stick.current = { x, y };
    e.preventDefault();
  };
  const onMove = (e: TouchEvent) => {
    if (!stick.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === stick.touchId) {
        const rect = getCanvasRect();
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        stick.current = { x, y };
        const dx = stick.current.x - stick.origin.x;
        const dy = stick.current.y - stick.origin.y;
        const mag = Math.hypot(dx, dy);
        const dead = 12;
        input.up = dy < -dead;
        input.down = dy > dead;
        input.left = dx < -dead;
        input.right = dx > dead;
        e.preventDefault();
        return;
      }
    }
  };
  const onEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === stick.touchId) {
        stick.active = false;
        stick.touchId = null;
        input.up = input.down = input.left = input.right = false;
      }
    }
  };
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);
    canvas.addEventListener('touchcancel', onEnd);
  }
  return () => {
    if (canvas) {
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onEnd);
      canvas.removeEventListener('touchcancel', onEnd);
    }
  };
}

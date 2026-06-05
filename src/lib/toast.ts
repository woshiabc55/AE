type ToastLevel = 'OK' | 'WARN' | 'CRIT' | 'INFO';

let pushToastExt: ((m: string, l?: ToastLevel) => void) | null = null;

export function setToastHandler(handler: typeof pushToastExt) {
  pushToastExt = handler;
}

export function toast(message: string, level: ToastLevel = 'OK') {
  pushToastExt?.(message, level);
}

export type { ToastLevel };

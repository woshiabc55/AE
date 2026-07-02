// localStorage 存档封装：设置、进度、关卡进度

export interface GameSettings {
  pixelScale: number; // 1=高(细) 2=中 3=低(粗像素)
  sensitivity: number; // 0.5~2.0
  fogDensity: number; // 0.06~0.18
  sound: boolean;
}

export interface SaveData {
  levelReached: number;
  updatedAt: number;
}

export interface ProgressData {
  totalEchoes: number;
  bestTimeSec: number | null;
}

const KEY_SAVE = "voidwalker_save";
const KEY_SETTINGS = "voidwalker_settings";
const KEY_PROGRESS = "voidwalker_progress";

export const DEFAULT_SETTINGS: GameSettings = {
  pixelScale: 3,
  sensitivity: 1.0,
  fogDensity: 0.12,
  sound: true,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export const storage = {
  loadSettings(): GameSettings {
    return read<GameSettings>(KEY_SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(s: GameSettings) {
    write(KEY_SETTINGS, s);
  },
  loadSave(): SaveData {
    return read<SaveData>(KEY_SAVE, { levelReached: 1, updatedAt: 0 });
  },
  saveSave(data: SaveData) {
    write(KEY_SAVE, data);
  },
  hasSave(): boolean {
    return localStorage.getItem(KEY_SAVE) !== null;
  },
  clearSave() {
    localStorage.removeItem(KEY_SAVE);
  },
  loadProgress(): ProgressData {
    return read<ProgressData>(KEY_PROGRESS, { totalEchoes: 0, bestTimeSec: null });
  },
  saveProgress(p: ProgressData) {
    write(KEY_PROGRESS, p);
  },
};

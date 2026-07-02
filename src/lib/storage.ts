// localStorage 存档封装：设置 + 生涯战绩（DELTA PROTOCOL）

export interface GameSettings {
  pixelScale: number; // 1=高(细) 2=中 3=低(粗像素)
  sensitivity: number; // 0.5~2.0
  fogDensity: number; // 0.04~0.14
  sound: boolean;
}

export interface CareerStats {
  totalKills: number;
  totalDeaths: number;
  matchesWon: number;
  matchesPlayed: number;
  bestRoundKills: number;
}

const KEY_SETTINGS = "delta_settings";
const KEY_CAREER = "delta_career";

export const DEFAULT_SETTINGS: GameSettings = {
  pixelScale: 3,
  sensitivity: 1.0,
  fogDensity: 0.075,
  sound: true,
};

const DEFAULT_CAREER: CareerStats = {
  totalKills: 0,
  totalDeaths: 0,
  matchesWon: 0,
  matchesPlayed: 0,
  bestRoundKills: 0,
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
  loadCareer(): CareerStats {
    return read<CareerStats>(KEY_CAREER, DEFAULT_CAREER);
  },
  saveCareer(c: CareerStats) {
    write(KEY_CAREER, c);
  },
};

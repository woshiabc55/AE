/**
 * 共享类型定义
 */
export type Palette = {
  ink: string;
  paper: string;
  rust: string;
  volt: string;
  lime: string;
};

export type Theme = {
  id: string;
  palette: Palette;
  font: { titleSize: number; weight: number; family: string };
  ring: { speed: number; thickness: number };
  panel: { gridCols: string; gridRows: string };
};

export type AppState = {
  intensity: number;
  mode: 'live' | 'paused';
  lastWheelAt: number;
};

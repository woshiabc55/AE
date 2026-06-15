export type Chapter = {
  id: string;
  title: string;
  start: number;
  end: number;
  color: string;
};

export type FacialControl =
  | "jaw"
  | "mouth_l"
  | "mouth_r"
  | "brow_l"
  | "brow_r"
  | "brow_inner_l"
  | "brow_inner_r"
  | "eye_l"
  | "eye_r"
  | "pupil_l"
  | "pupil_r"
  | "nose_tip"
  | "cheek_l"
  | "cheek_r"
  | "lip_top"
  | "lip_bot"
  | "lip_corner_l"
  | "lip_corner_r"
  | "ear_l"
  | "ear_r"
  | "tongue"
  | "chin";

export type Annotation =
  | {
      id: string;
      kind: "bone";
      label: string;
      x: number; // 0-1
      y: number;
      t: number; // 时间
      tailTo?: { x: number; y: number };
      color?: string;
    }
  | {
      id: string;
      kind: "facial";
      control: FacialControl;
      x: number;
      y: number;
      t: number;
    };

export type ThemeConfig = {
  primary: string;
  accent: string;
  font: "Inter" | "Space Grotesk" | "JetBrains Mono";
  brand: string;
  showWatermark: boolean;
};

export type Project = {
  id: string;
  name: string;
  video: {
    src: string; // objectURL / dataURL / 文件名
    fileName?: string;
    mime?: string;
    duration: number;
    width: number;
    height: number;
    fps: number;
  };
  chapters: Chapter[];
  annotations: Annotation[];
  theme: ThemeConfig;
  updatedAt: number;
};

export const DEFAULT_THEME: ThemeConfig = {
  primary: "#7CFFB2",
  accent: "#FF5DA2",
  font: "Space Grotesk",
  brand: "RigReel",
  showWatermark: true,
};

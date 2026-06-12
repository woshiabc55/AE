// 业务类型定义

export type ProjectType = 'short-film' | 'commercial' | 'animation' | 'doc' | 'social';

export type ShotType = 'ECU' | 'CU' | 'MCU' | 'MS' | 'MLS' | 'LS' | 'ELS';

export type CameraMove = 'static' | 'pan' | 'tilt' | 'dolly' | 'track' | 'crane' | 'handheld';

export type Theme = 'cream' | 'midnight';

export type Panel = {
  id: string;
  shotType: ShotType;
  cameraMove: CameraMove;
  duration: number; // 秒
  description: string;
  dialogue: string;
  sound: string;
  imageUrl: string;
};

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  description: string;
  color: string;
  panels: Panel[];
  createdAt: number;
  updatedAt: number;
};

export type SaveState = {
  version: 1;
  projects: Project[];
  activeProjectId: string | null;
  theme: Theme;
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'short-film': '短片',
  'commercial': '广告',
  'animation': '动画',
  'doc': '纪录',
  'social': '社媒',
};

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  'short-film': '#7A1F1F',
  'commercial': '#B8741A',
  'animation': '#1F2D5C',
  'doc': '#2F4A2D',
  'social': '#5A2A82',
};

export const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  'ECU': '大特写',
  'CU': '特写',
  'MCU': '中特写',
  'MS': '中景',
  'MLS': '中远景',
  'LS': '远景',
  'ELS': '大远景',
};

export const CAMERA_MOVE_LABELS: Record<CameraMove, string> = {
  'static': '固定',
  'pan': '横摇',
  'tilt': '俯仰',
  'dolly': '推拉',
  'track': '横移',
  'crane': '升降',
  'handheld': '手持',
};

export type ModuleCategory = 'subject' | 'style' | 'scene' | 'mood' | 'technique' | 'custom';

export interface ConceptModule {
  id: string;
  name: string;
  category: ModuleCategory;
  icon: string;
  color: string;
  description: string;
  variants: string[];
}

export interface CanvasBlock {
  id: string;
  moduleId: string;
  x: number;
  y: number;
  weight: number;
  customText: string;
  selectedVariant: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewImage: string;
  blocks: Omit<CanvasBlock, 'id'>[];
}

export interface PromptHistory {
  id: string;
  text: string;
  timestamp: number;
  templateId?: string;
}

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  subject: '主体',
  style: '风格',
  scene: '场景',
  mood: '情绪',
  technique: '技术',
  custom: '自定义',
};

export const CATEGORY_COLORS: Record<ModuleCategory, string> = {
  subject: '#00ffd5',
  style: '#ff6b35',
  scene: '#a855f7',
  mood: '#f43f5e',
  technique: '#3b82f6',
  custom: '#eab308',
};

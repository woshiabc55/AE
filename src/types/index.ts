export type CategoryId = 'short-video' | 'feature' | 'ad' | 'podcast' | 'game';

export interface Variable {
  key: string; // e.g. "title"
  label: string; // e.g. "剧本标题"
  defaultValue: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
}

export type SceneType = 'opening' | 'conflict' | 'climax' | 'ending' | 'custom';

export interface Scene {
  id: string;
  order: number;
  title: string;
  type: SceneType;
  prompt: string;
  duration?: number; // seconds
}

export interface Template {
  id: string;
  title: string;
  category: CategoryId;
  author: string;
  coverGradient: [string, string, string]; // 3-stop gradient
  description: string;
  rating: number;
  usageCount: number;
  variables: Variable[];
  scenes: Scene[];
  tags: string[];
  createdAt: string;
}

export interface Script {
  id: string;
  title: string;
  templateId?: string;
  variables: Record<string, string>;
  scenes: Scene[];
  tags: string[];
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  count: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  fontSize: 'sm' | 'md' | 'lg';
  autoSaveInterval: number; // seconds
  defaultModel: 'gpt-4' | 'claude' | 'gemini' | 'deepseek' | 'custom';
  apiKey: string;
  editorMode: 'split' | 'preview' | 'edit';
}

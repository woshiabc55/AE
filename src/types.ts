// 剧幕 · PromptStage 核心类型

export type Category =
  | 'short-video'   // 短视频
  | 'ad'            // 广告种草
  | 'livestream'    // 直播口播
  | 'novel'         // 小说/故事
  | 'storyboard';   // 分镜脚本

export type VariableType = 'text' | 'textarea' | 'enum' | 'number' | 'slider';

export interface Variable {
  key: string;
  label: string;
  type: VariableType;
  defaultValue?: string;
  options?: string[];
  required: boolean;
  hint?: string;
  group?: string;
}

export interface Example {
  id: string;
  name: string;
  values: Record<string, string>;
}

export interface Version {
  id: string;
  createdAt: string;
  snapshot: string;
  note?: string;
}

export interface TemplateStats {
  uses: number;
  favorites: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  author: Author;
  cover: string;            // 渐变 seed，用于生成程序化封面
  body: string;             // 含 {{变量}} 的剧本内容
  variables: Variable[];
  examples: Example[];
  versions: Version[];
  stats: TemplateStats;
  isPublic: boolean;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface TemplateFilter {
  category?: Category | 'all';
  search?: string;
  tags?: string[];
  variableCount?: [number, number];
  sort?: 'newest' | 'popular' | 'favorites';
}

export interface TemplateInput {
  title: string;
  description: string;
  category: Category;
  tags: string[];
  body: string;
  variables: Variable[];
  examples?: Example[];
  isPublic?: boolean;
  folderId?: string;
  cover?: string;
}

// 剧本片段库
export interface ScriptFragment {
  id: string;
  label: string;
  category: 'opening' | 'character' | 'scene' | 'conflict' | 'twist' | 'closing';
  body: string;
  tags: string[];
}

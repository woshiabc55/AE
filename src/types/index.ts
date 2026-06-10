// 萤幕 Lumière — 核心类型定义

export type Genre = "movie" | "short" | "video" | "interactive";

export type BeatModel =
  | "three-act"
  | "hero-journey"
  | "save-the-cat"
  | "short-form"
  | "interactive";

export type FieldType = "text" | "longtext" | "list" | "struct" | "code";

export interface ScriptFieldDef {
  key: string;
  label: string;
  helper?: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
}

export interface TemplateRecord {
  id: string;
  title: string;
  slug: string;
  logline: string;
  genre: Genre;
  beatModel: BeatModel;
  tone: string;
  cover: string; // 渐变色方案
  authorId: string;
  authorName: string;
  isPublic: 1 | 0;
  usageCount: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  // 模板的字段定义
  fields: ScriptFieldDef[];
  // 提示词模板，使用 {{key}} 引用字段
  promptTpl: string;
  // 系统提示词
  systemPrompt: string;
  tags: string[];
  description: string;
}

export interface VersionRecord {
  id: string;
  templateId: string;
  versionNo: number;
  snapshot: Omit<TemplateRecord, "id" | "createdAt" | "updatedAt">;
  changelog: string;
  createdAt: number;
}

export interface CallLogRecord {
  id: string;
  templateId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: "ok" | "fail";
  error?: string;
  createdAt: number;
}

export interface FavoriteRecord {
  id: string;
  templateId: string;
  createdAt: number;
}

export interface AppSettings {
  llmBaseUrl: string;
  llmApiKey: string;
  llmModel: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  theme: "dark" | "light";
  retryCount: number;
  retryDelay: number;
  customProviders: Array<{ label: string; baseUrl: string; model: string }>;
}

export interface CommentRecord {
  id: string;
  templateId: string;
  fieldKey?: string; // 关联字段
  author: string;
  body: string;
  createdAt: number;
}

export interface RatingRecord {
  id: string;
  templateId: string;
  stars: number; // 1-5
  reviewer: string;
  body?: string;
  createdAt: number;
}

export interface DraftRecord {
  key: string;
  data: any;
  updatedAt: number;
}

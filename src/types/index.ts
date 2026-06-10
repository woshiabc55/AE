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
  // v1: 全局默认风格
  activeStyleKey?: string;
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

// ====== v1 新增：Skill 剧本技能 ======
export type SkillCategory =
  | "hook" // 开场钩子
  | "character" // 人物塑造
  | "scene" // 场景描写
  | "twist" // 反转 / 转折
  | "climax" // 高潮 / 决斗
  | "ending" // 收束
  | "monologue" // 独白 / 旁白
  | "dialogue" // 对话
  | "world" // 世界观
  | "pacing" // 节奏
  | "other";

export interface SkillRecord {
  id: string;
  name: string; // 中文名
  key: string; // 唯一标识，宏调用用，如 opening-hook
  category: SkillCategory;
  type: "fragment" | "macro"; // fragment=纯文本块；macro=可含变量的动态模板
  content: string; // 文本内容，可用 {{var}} 引用字段
  description?: string;
  tags: string[];
  isBuiltin: 1 | 0; // 系统内置 vs 用户自定义
  createdAt: number;
  updatedAt: number;
}

// ====== v1 新增：Style 全局风格预设 ======
export interface StyleVisual {
  primary: string; // 主色（琥珀 / 翠绿 / 蓝紫等）
  secondary?: string;
  font: string; // 字体族
  vibe: string; // 简短描述
}

export interface StylePreset {
  id: string;
  name: string; // 中文名：硬汉派 / 王家卫风 / 赛博朋克
  key: string; // 唯一标识
  visual: StyleVisual;
  // 剧本风格：注入到 system prompt 的指令
  scriptDirective: string;
  // 自动追加的提示词后缀
  promptSuffix: string;
  isBuiltin: 1 | 0;
  createdAt: number;
}

// ====== v1 新增：画布节拍节点 ======
export interface BeatNodeRecord {
  id: string;
  templateId: string;
  // 父节点 id（根节点为 null）
  parentId: string | null;
  // 节拍名（开场钩子 / 触发事件 / …）
  label: string;
  // 绑定的字段 key（可选）
  fieldKey?: string;
  // 节点备注
  note?: string;
  // 节点在画布中的位置（百分比，0-100）
  x: number;
  y: number;
  // 树中的深度
  depth: number;
  // 在同级中的排序
  order: number;
  // 是否折叠
  collapsed?: 1 | 0;
  createdAt: number;
}

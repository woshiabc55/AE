// 萤幕 Lumière — Zod 校验工具
// 用于：草稿保存、模板发布、分享导入、自定义 Provider、JSON 导入
import { z } from "zod";

// ---------- 基础枚举 ----------
export const GenreEnum = z.enum(["movie", "short", "video", "interactive"]);
export const BeatModelEnum = z.enum([
  "three-act",
  "hero-journey",
  "save-the-cat",
  "short-form",
  "interactive",
]);
export const FieldTypeEnum = z.enum(["text", "longtext", "list", "struct", "code"]);

// ---------- 字段定义 ----------
export const ScriptFieldDefSchema = z.object({
  key: z
    .string()
    .min(1, "字段 key 不能为空")
    .max(40, "字段 key 太长")
    .regex(/^[a-zA-Z_][\w-]*$/, "字段 key 必须以字母或下划线开头"),
  label: z.string().min(1, "字段标签不能为空").max(40),
  helper: z.string().max(200).optional(),
  type: FieldTypeEnum,
  placeholder: z.string().max(120).optional(),
  required: z.boolean().optional(),
});

// ---------- 模板（完整） ----------
export const TemplateRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "标题必填").max(80, "标题过长"),
  slug: z
    .string()
    .min(1, "slug 必填")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "slug 仅允许小写字母、数字、横线"),
  logline: z.string().max(280, "logline 过长"),
  genre: GenreEnum,
  beatModel: BeatModelEnum,
  tone: z.string().max(60),
  cover: z.string().max(80),
  authorId: z.string(),
  authorName: z.string(),
  isPublic: z.union([z.literal(0), z.literal(1)]),
  usageCount: z.number().int().nonnegative(),
  version: z.number().int().positive(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  fields: z.array(ScriptFieldDefSchema).max(40, "字段数过多"),
  promptTpl: z.string().min(1, "提示词模板不能为空").max(20_000),
  systemPrompt: z.string().max(8_000),
  tags: z.array(z.string().max(30)).max(20),
  description: z.string().max(800),
});

// ---------- 模板（草稿，字段更宽松） ----------
export const TemplateDraftSchema = z.object({
  title: z.string().min(1, "请填写标题").max(80, "标题过长"),
  slug: z
    .string()
    .min(1, "请填写 slug")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "slug 仅允许小写字母、数字、横线"),
  logline: z.string().max(280),
  genre: GenreEnum,
  beatModel: BeatModelEnum,
  tone: z.string().max(60),
  cover: z.string().max(80),
  fields: z.array(ScriptFieldDefSchema).max(40),
  promptTpl: z.string().min(1, "提示词模板不能为空").max(20_000),
  systemPrompt: z.string().max(8_000),
  tags: z.array(z.string().max(30)).max(20),
  description: z.string().max(800),
});

// ---------- 评论 ----------
export const CommentDraftSchema = z.object({
  templateId: z.string().min(1),
  body: z
    .string()
    .min(1, "评论内容不能为空")
    .max(2000, "评论过长（最多 2000 字）"),
  fieldKey: z.string().optional(),
});

// ---------- 评分 ----------
export const RatingDraftSchema = z.object({
  templateId: z.string().min(1),
  stars: z
    .number()
    .int()
    .min(1, "至少 1 星")
    .max(5, "最多 5 星"),
  body: z.string().max(2000).optional(),
});

// ---------- 自定义 Provider ----------
export const CustomProviderSchema = z.object({
  label: z.string().min(1, "请填写名称").max(40),
  baseUrl: z
    .string()
    .url("Base URL 必须以 http(s):// 开头")
    .max(200)
    .refine((s) => /^https?:\/\//i.test(s), "需要 http(s):// 开头"),
  model: z.string().min(1, "请填写模型名").max(80),
});

// ---------- 分享导入 ----------
export const SharePayloadSchema = z.object({
  title: z.string().min(1).max(80),
  promptTpl: z.string().min(1).max(20_000),
  systemPrompt: z.string().max(8_000),
  fields: z.array(ScriptFieldDefSchema).max(40),
  description: z.string().max(800),
  tags: z.array(z.string().max(30)).max(20),
  genre: GenreEnum,
  beatModel: BeatModelEnum,
  tone: z.string().max(60),
});

// ---------- JSON 导入（整包） ----------
export const ImportBundleSchema = z.object({
  templates: z.array(z.any()).optional(),
  favorites: z.array(z.any()).optional(),
  versions: z.array(z.any()).optional(),
  callLogs: z.array(z.any()).optional(),
  comments: z.array(z.any()).optional(),
  ratings: z.array(z.any()).optional(),
  exportedAt: z.number().optional(),
});

// ---------- Skill / Style / Resource Pack（v1.2 资源包） ----------
export const SkillCategoryEnum = z.enum([
  "hook",
  "character",
  "scene",
  "twist",
  "climax",
  "ending",
  "monologue",
  "dialogue",
  "world",
  "pacing",
  "other",
]);

export const SkillTypeEnum = z.enum(["fragment", "macro"]);

export const SkillRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "技能名必填").max(60),
  key: z
    .string()
    .min(1, "key 必填")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "key 仅允许小写字母、数字、横线"),
  category: SkillCategoryEnum,
  type: SkillTypeEnum,
  content: z.string().min(1, "内容不能为空").max(20_000),
  description: z.string().max(400).optional(),
  tags: z.array(z.string().max(30)).max(20).optional(),
  isBuiltin: z.union([z.literal(0), z.literal(1)]).optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const StyleVisualSchema = z.object({
  primary: z.string().min(1).max(40),
  secondary: z.string().max(40).optional(),
  font: z.string().min(1).max(120),
  vibe: z.string().max(200),
});

export const StylePresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "风格名必填").max(40),
  key: z
    .string()
    .min(1, "key 必填")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "key 仅允许小写字母、数字、横线"),
  visual: StyleVisualSchema,
  scriptDirective: z.string().min(1).max(8_000),
  promptSuffix: z.string().min(1).max(8_000),
  isBuiltin: z.union([z.literal(0), z.literal(1)]).optional(),
  createdAt: z.number().int().optional(),
});

export const ResourcePackMetaSchema = z.object({
  name: z.string().min(1, "Pack 名必填").max(60),
  source: z.literal("lumiere-v1"),
  version: z.literal(1),
  exportedAt: z.number().int(),
  description: z.string().max(400).optional(),
});

export const ResourcePackSchema = z.object({
  meta: ResourcePackMetaSchema,
  skills: z.array(SkillRecordSchema).max(200).optional(),
  styles: z.array(StylePresetSchema).max(50).optional(),
});

// ---------- 便利函数 ----------
// 使用重载让 TypeScript 精确推断 ok: true / ok: false
export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: string[] };

export function validate<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T>;
export function validate(schema: z.ZodType<any>, data: unknown): ValidationResult<any> {
  const r = schema.safeParse(data);
  if (r.success) return { ok: true as const, data: r.data };
  const errors = r.error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
  );
  return { ok: false as const, errors };
}

export function firstError<T>(schema: z.ZodType<T>, data: unknown): string | null {
  const r = validate(schema, data);
  if (r.ok === true) return null;
  return r.errors[0] ?? "校验失败";
}

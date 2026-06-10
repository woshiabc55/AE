// 萤幕 Lumière — 资源包（Resource Pack）工具
// 用来：把 Skill + Style 打包成 JSON 文件，分享 / 备份 / 跨设备同步
import { nanoid } from "nanoid";
import type { SkillRecord, StylePreset } from "@/types";
import {
  ResourcePackSchema,
  validate,
  type ValidationResult,
} from "@/utils/validate";

// ---------- Pack 数据结构 ----------
export interface ResourcePack {
  meta: {
    name: string;
    source: "lumiere-v1";
    version: 1;
    exportedAt: number;
    description?: string;
  };
  skills?: SkillRecord[];
  styles?: StylePreset[];
}

// ---------- 冲突分析结果 ----------
export interface PackConflict<T> {
  key: string;
  incoming: T;
  existing?: T;
  kind: "new" | "same" | "different" | "builtin-shadow";
}

export interface PackAnalysis {
  meta: ResourcePack["meta"];
  skills: {
    newItems: PackConflict<SkillRecord>[];
    sameItems: PackConflict<SkillRecord>[];
    differentItems: PackConflict<SkillRecord>[];
    builtinShadow: PackConflict<SkillRecord>[];
  };
  styles: {
    newItems: PackConflict<StylePreset>[];
    sameItems: PackConflict<StylePreset>[];
    differentItems: PackConflict<StylePreset>[];
    builtinShadow: PackConflict<StylePreset>[];
  };
  totalIncoming: number;
  totalWillImport: number;
  totalWillSkip: number;
}

export type MergePolicy = "skip" | "overwrite" | "duplicate";

// ---------- 构造 ----------
export function buildPack(input: {
  name: string;
  description?: string;
  skills?: SkillRecord[];
  styles?: StylePreset[];
}): ResourcePack {
  return {
    meta: {
      name: input.name.trim() || "未命名资源包",
      source: "lumiere-v1",
      version: 1,
      exportedAt: Date.now(),
      description: input.description?.trim() || undefined,
    },
    skills: input.skills?.length ? input.skills : undefined,
    styles: input.styles?.length ? input.styles : undefined,
  };
}

// ---------- 序列化 ----------
export function serializePack(pack: ResourcePack): string {
  return JSON.stringify(pack, null, 2);
}

// ---------- 解析（带 Zod 校验） ----------
export function parsePack(
  text: string
): ValidationResult<ResourcePack> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return {
      ok: false as const,
      errors: ["JSON 解析失败：" + (e as Error).message],
    };
  }
  const r = validate(ResourcePackSchema, raw);
  if (r.ok === false) return r;
  // 显式断言为 ResourcePack：Schema 的 z.infer 与手写 interface 形状一致
  return { ok: true as const, data: r.data as ResourcePack };
}

// ---------- 冲突分析 ----------
export function analyzePack(
  pack: ResourcePack,
  existing: { skills: SkillRecord[]; styles: StylePreset[] }
): PackAnalysis {
  const analyzeList = <T extends { key: string }>(
    incoming: T[] | undefined,
    list: T[]
  ): {
    newItems: PackConflict<T>[];
    sameItems: PackConflict<T>[];
    differentItems: PackConflict<T>[];
    builtinShadow: PackConflict<T>[];
  } => {
    const newItems: PackConflict<T>[] = [];
    const sameItems: PackConflict<T>[] = [];
    const differentItems: PackConflict<T>[] = [];
    const builtinShadow: PackConflict<T>[] = [];
    for (const item of incoming ?? []) {
      const exist = list.find((x) => x.key === item.key);
      if (!exist) {
        newItems.push({ key: item.key, incoming: item, kind: "new" });
      } else {
        // 内置项不让覆盖
        if ((exist as any).isBuiltin === 1) {
          builtinShadow.push({
            key: item.key,
            incoming: item,
            existing: exist,
            kind: "builtin-shadow",
          });
          continue;
        }
        if (JSON.stringify(stripMeta(exist)) === JSON.stringify(stripMeta(item))) {
          sameItems.push({ key: item.key, incoming: item, existing: exist, kind: "same" });
        } else {
          differentItems.push({
            key: item.key,
            incoming: item,
            existing: exist,
            kind: "different",
          });
        }
      }
    }
    return { newItems, sameItems, differentItems, builtinShadow };
  };

  const s = analyzeList(pack.skills, existing.skills);
  const t = analyzeList(pack.styles, existing.styles);

  const totalIncoming =
    (pack.skills?.length ?? 0) + (pack.styles?.length ?? 0);
  const totalWillImport = s.newItems.length + s.differentItems.length + t.newItems.length + t.differentItems.length;
  const totalWillSkip = s.sameItems.length + s.builtinShadow.length + t.sameItems.length + t.builtinShadow.length;

  return {
    meta: pack.meta,
    skills: s,
    styles: t,
    totalIncoming,
    totalWillImport,
    totalWillSkip,
  };
}

// 去掉时间戳与内置标识，只比较"内容"
function stripMeta<T extends Record<string, any>>(o: T): Partial<T> {
  const c: any = { ...o };
  delete c.id;
  delete c.createdAt;
  delete c.updatedAt;
  delete c.isBuiltin;
  return c;
}

// ---------- 合并（执行导入） ----------
export interface MergeResult {
  addedSkills: number;
  updatedSkills: number;
  addedStyles: number;
  updatedStyles: number;
  skipped: number;
  builtinProtected: number;
}

export async function mergePack(input: {
  pack: ResourcePack;
  analysis: PackAnalysis;
  policy: MergePolicy;
  // 实际写入方法
  upsertSkill: (s: SkillRecord) => Promise<void> | void;
  upsertStyle: (s: StylePreset) => Promise<void> | void;
}): Promise<MergeResult> {
  const { pack, analysis, policy, upsertSkill, upsertStyle } = input;
  let addedSkills = 0;
  let updatedSkills = 0;
  let addedStyles = 0;
  let updatedStyles = 0;
  let skipped = 0;
  let builtinProtected = 0;
  const now = Date.now();

  const runOne = async <T extends { key: string; id: string; isBuiltin?: 0 | 1 }>(
    item: PackConflict<T>,
    upsert: (x: T) => Promise<void> | void,
    kind: "skill" | "style"
  ) => {
    if (item.kind === "builtin-shadow") {
      builtinProtected++;
      return;
    }
    if (item.kind === "same") {
      if (policy === "duplicate") {
        const dup: T = {
          ...item.incoming,
          id: (kind === "skill" ? "sk_" : "st_") + nanoid(8),
          createdAt: now,
        } as T;
        await upsert(dup);
        if (kind === "skill") addedSkills++;
        else addedStyles++;
      } else {
        skipped++;
      }
      return;
    }
    if (item.kind === "different") {
      if (policy === "skip") {
        skipped++;
        return;
      }
      const target: T =
        policy === "overwrite"
          ? { ...item.incoming, id: item.existing!.id }
          : {
              ...item.incoming,
              id: (kind === "skill" ? "sk_" : "st_") + nanoid(8),
              createdAt: now,
            };
      await upsert(target);
      if (kind === "skill") {
        policy === "overwrite" ? updatedSkills++ : addedSkills++;
      } else {
        policy === "overwrite" ? updatedStyles++ : addedStyles++;
      }
      return;
    }
    if (item.kind === "new") {
      const fresh: T = {
        ...item.incoming,
        id: (kind === "skill" ? "sk_" : "st_") + nanoid(8),
        createdAt: now,
      } as T;
      await upsert(fresh);
      if (kind === "skill") addedSkills++;
      else addedStyles++;
    }
  };

  // 技能
  for (const c of analysis.skills.newItems) {
    await runOne(c, upsertSkill as any, "skill");
  }
  for (const c of analysis.skills.sameItems) {
    await runOne(c, upsertSkill as any, "skill");
  }
  for (const c of analysis.skills.differentItems) {
    await runOne(c, upsertSkill as any, "skill");
  }
  for (const c of analysis.skills.builtinShadow) {
    await runOne(c, upsertSkill as any, "skill");
  }
  // 风格
  for (const c of analysis.styles.newItems) {
    await runOne(c, upsertStyle as any, "style");
  }
  for (const c of analysis.styles.sameItems) {
    await runOne(c, upsertStyle as any, "style");
  }
  for (const c of analysis.styles.differentItems) {
    await runOne(c, upsertStyle as any, "style");
  }
  for (const c of analysis.styles.builtinShadow) {
    await runOne(c, upsertStyle as any, "style");
  }

  return {
    addedSkills,
    updatedSkills,
    addedStyles,
    updatedStyles,
    skipped,
    builtinProtected,
  };
}

// ---------- 触发浏览器下载 ----------
export function packFilename(pack: ResourcePack): string {
  const safe = pack.meta.name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const d = new Date(pack.meta.exportedAt);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
  return `lumiere-pack-${safe}-${ymd}.json`;
}

export function downloadPack(pack: ResourcePack): void {
  const text = serializePack(pack);
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = packFilename(pack);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 模板分享：把模板压缩为 URL 可携带的 base64 字符串
import type { TemplateRecord, ScriptFieldDef } from "@/types";

const PREFIX = "lum1:";

export interface SharePayload {
  title: string;
  slug?: string;
  logline: string;
  genre: TemplateRecord["genre"];
  beatModel: TemplateRecord["beatModel"];
  tone: string;
  description: string;
  authorName: string;
  fields: ScriptFieldDef[];
  promptTpl: string;
  systemPrompt: string;
  tags: string[];
}

export function encodeTemplate(tpl: TemplateRecord): string {
  const minimal = {
    t: tpl.title,
    s: tpl.slug,
    l: tpl.logline,
    g: tpl.genre,
    b: tpl.beatModel,
    n: tpl.tone,
    d: tpl.description,
    a: tpl.authorName,
    f: tpl.fields,
    p: tpl.promptTpl,
    y: tpl.systemPrompt,
    g2: tpl.tags,
  };
  const json = JSON.stringify(minimal);
  return PREFIX + btoa(unescape(encodeURIComponent(json)));
}

export function decodeTemplate(encoded: string): Partial<SharePayload> | null {
  if (!encoded.startsWith(PREFIX)) return null;
  try {
    const json = decodeURIComponent(escape(atob(encoded.slice(PREFIX.length))));
    const o = JSON.parse(json);
    return {
      title: o.t,
      slug: o.s,
      logline: o.l,
      genre: o.g,
      beatModel: o.b,
      tone: o.n,
      description: o.d,
      authorName: o.a,
      fields: o.f,
      promptTpl: o.p,
      systemPrompt: o.y,
      tags: o.g2 ?? [],
    };
  } catch {
    return null;
  }
}

// 萤幕 v1 — 内置 Style 全局风格预设
import type { StylePreset } from "@/types";

function st(
  id: string,
  key: string,
  name: string,
  primary: string,
  font: string,
  vibe: string,
  scriptDirective: string,
  promptSuffix: string
): StylePreset {
  return {
    id,
    key,
    name,
    isBuiltin: 1,
    createdAt: 1,
    visual: { primary, font, vibe },
    scriptDirective,
    promptSuffix,
  };
}

export const SEED_STYLES: StylePreset[] = [
  st(
    "st_film_noir",
    "film-noir",
    "黑色电影",
    "#C8102E",
    "Playfair Display, serif",
    "低照度、阴影、雨夜、城市孤独",
    `你是一位黑色电影（Film Noir）编剧。语言简洁冷峻，旁白常带自嘲与宿命论。
画面风格：低照度、高对比、雨夜与霓虹、阴影切割人物。
人物：道德灰区的反英雄；女性角色常是致命诱惑（femme fatale）或自我救赎的镜像。
对白：快节奏、话中有话、潜台词多于明面。`,
    "\n\n---\n## 风格检查清单\n- [ ] 至少一场雨戏\n- [ ] 至少一句画外旁白\n- [ ] 阴影切割人物至少一次\n- [ ] 主角做出道德妥协且无完美救赎"
  ),
  st(
    "st_wongkarwai",
    "wong-karwai",
    "王家卫风",
    "#0EA5A5",
    "Noto Serif SC, serif",
    "暧昧的独白、被抽帧的时间、暧昧的距离感",
    `你是一位王家卫式的编剧：暧昧、孤独、用时间抽帧制造情感错位。
常用手法：独白、字幕卡、慢镜头、特定配乐情绪、暧昧的对话、错位的相遇。
台词：不直说情绪，用物件、距离、动作暗示。`,
    "\n\n---\n## 风格检查清单\n- [ ] 至少 3 句第一人称独白\n- [ ] 至少 1 个反复出现的物件 / 时间点\n- [ ] 至少 1 场错位相遇\n- [ ] 字幕卡至少 2 张"
  ),
  st(
    "st_cyberpunk",
    "cyberpunk",
    "赛博朋克",
    "#7C3AED",
    "JetBrains Mono, monospace",
    "霓虹、雨、巨型企业、底层与上层的对立",
    `你是一位赛博朋克编剧。世界设定：高技术低生活（High Tech, Low Life）；巨型企业与底层街区的对立。
主题：身份、人机界限、记忆的可篡改性、反抗与被收编。
视觉：高饱和霓虹、雨、玻璃幕墙与贫民窟的对比。`,
    "\n\n---\n## 风格检查清单\n- [ ] 至少 1 场雨中霓虹戏\n- [ ] 至少 1 个底层街区 + 1 个上层空间\n- [ ] 至少 1 次身份 / 记忆主题\n- [ ] 反派不是纯粹恶人，是系统的具象化"
  ),
  st(
    "st_realist",
    "realist",
    "现实主义",
    "#D4A857",
    "Noto Serif SC, serif",
    "克制、白描、人物在日常中显形",
    `你是一位现实主义编剧。拒绝戏剧化巧合，冲突源于人物性格与具体处境。
对白：口语化、留白多、不解释潜台词。
场景：用具体的物件 / 食物 / 天气折射人物关系。`,
    "\n\n---\n## 风格检查清单\n- [ ] 至少 1 场吃饭 / 做饭戏\n- [ ] 至少 1 场没解决的冲突（开放式结局）\n- [ ] 至少 1 个具体小物件承载情绪\n- [ ] 没有巧合推动剧情，全部由人物选择推动"
  ),
];

export const STYLE_KEY_TO_VARS: Record<string, { primary: string; font: string }> = {
  default: { primary: "#D4A857", font: '"Playfair Display", "Noto Serif SC", serif' },
  amber: { primary: "#D4A857", font: '"Playfair Display", serif' },
  ink: { primary: "#3F3F46", font: '"Noto Serif SC", serif' },
  reel: { primary: "#C8102E", font: '"Playfair Display", serif' },
  cyan: { primary: "#0EA5A5", font: '"Noto Serif SC", serif' },
  violet: { primary: "#7C3AED", font: '"JetBrains Mono", monospace' },
  forest: { primary: "#4D7C0F", font: '"Lora", serif' },
};

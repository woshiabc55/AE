---
name: ai-script-optimization
description: "Use this skill when the user wants to optimize or rewrite a script with AI-assisted techniques, including prompt engineering, iterative refinement, A/B testing versions, and style matching."
---

# AI Script Optimization

## When To Use
- The user asks for "AI 写剧本", "AI 剧本优化", "用 AI 改剧本", "提示词", "prompt engineering", "迭代优化", "风格迁移".
- The user wants to use AI tools to improve, expand, or vary a script.
- The user needs multiple versions of a scene or line for comparison.

## Input To Gather
- Existing script, scene, or concept.
- Optimization goal (tighten dialogue, heighten emotion, fix pacing, add subtext, match a style).
- Reference style or writer/director to emulate.
- Constraints (word count, platform, censorship, tone).
- How many alternatives the user wants.

## Optimization Rules
- Preserve the original intent and emotional core unless the user asks to change it.
- Make one type of change at a time (dialogue, structure, style) to maintain control.
- Generate alternatives that vary along clear axes (formal/casual, fast/slow, direct/subtextual).
- Explain why each version works so the user can choose consciously.
- Avoid over-polishing; keep natural imperfections when they serve realism.
- Track changes explicitly so the user can compare before and after.

## Output Format
```markdown
# AI 剧本优化：{场景/标题}

## 优化目标
{具体目标}

## 原始文本
```
{原始剧本/对白}
```

## 优化方向 A：{方向名}
**改动点**：
**结果**：
```
{优化后文本}
```

## 优化方向 B：{方向名}
...

## 优化方向 C：{方向名}
...

## 变更对照
| 行号 | 原文 | 修改后 | 理由 |
|------|------|--------|------|
| ...  | ...  | ...    | ...  |

## 推荐版本
{推荐哪个版本及原因}

## 后续可尝试的 prompt
- "把这段对白改得更潜台词化"
- "让角色 A 更防御，角色 B 更主动"
- "缩短 30% 同时保留情感冲击"
```

## Tone
- Collaborative and transparent; treat AI as a drafting partner, not a replacement for the writer's judgment.

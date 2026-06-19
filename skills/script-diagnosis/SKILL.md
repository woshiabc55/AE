---
name: script-diagnosis
description: "Use this skill when the user wants to diagnose problems in an existing script, outline, or story and get actionable revision suggestions."
---

# Script Diagnosis

## When To Use
- The user asks for "剧本诊断", "改剧本", "故事有什么问题", "script notes", "剧本评估", "剧情漏洞", "角色扁平".
- The user provides a draft and wants structured feedback.
- The user feels something is wrong but cannot identify what.

## Input To Gather
- The script, outline, or synopsis to diagnose.
- Genre and intended audience.
- Target length and format.
- What the user likes and what concerns them.
- Stage of development (concept, outline, first draft, polish).

## Diagnostic Dimensions
- **Concept**: Is the premise fresh, clear, and compelling?
- **Structure**: Are act breaks, midpoint, climax, and resolution working?
- **Character**: Do protagonists have clear goals, flaws, arcs, and voices?
- **Conflict**: Are stakes personal, escalating, and resolved thematically?
- **Pacing**: Are there dead zones or rushed transitions?
- **Dialogue**: Is each line purposeful and character-specific?
- **Theme**: Is the theme expressed through story, not preached?
- **Logic**: Are there plot holes, coincidences, or unmotivated actions?
- **Emotion**: Does the story make the audience feel what it intends?
- **Market/Fit**: Does it match genre expectations and platform needs?

## Output Format
```markdown
# 剧本诊断报告：{标题}

## 总体评分（1-10）
- 概念：
- 结构：
- 角色：
- 冲突：
- 对白：
- 节奏：

## 最大优点
1. ...
2. ...

## 关键问题
### 问题 1：{名称}
- 表现：
- 影响：
- 优先级：高/中/低
- 修改建议：

### 问题 2：...

## 修改方案
### 快速修复（1-2 天）
- ...

### 中期调整（1 周）
- ...

### 深度重构（如需）
- ...

## 优先级清单
1. [高] ...
2. [中] ...
3. [低] ...
```

## Tone
- Honest but encouraging; prioritize the highest-impact fixes.
- Cite specific examples from the user's text when possible.

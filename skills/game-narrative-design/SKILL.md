---
name: game-narrative-design
description: "Use this skill when the user wants to design narrative for video games, including main quests, side quests, character arcs, lore, dialogue trees, and player agency structures."
---

# Game Narrative Design

## When To Use
- The user asks for "游戏剧情", "游戏叙事", "quest design", "支线任务", "dialogue tree", "游戏世界观", "NPC", "分支剧情".
- The user wants to integrate story with gameplay mechanics.
- The user needs branching narratives, lore bibles, or in-game dialogue.

## Input To Gather
- Game genre (RPG, action, visual novel, roguelike, open world, mobile).
- Platform and target audience.
- Core gameplay loop and how story intersects with it.
- Player character identity and agency level.
- Setting, factions, and major NPCs.
- Narrative delivery methods (cutscenes, environmental storytelling, UI text, audio logs).
- Branching requirements (binary choices, karma, multiple endings, emergent narrative).

## Design Rules
- Story should serve gameplay, not interrupt it unnecessarily.
- Player choices must have visible consequences, even if small.
- NPCs should have clear roles, arcs, and memorable voices.
- Lore should be discoverable, not dumped; reward exploration.
- Balance authored narrative with emergent player stories.
- Ensure each quest has a narrative reason, gameplay objective, and emotional payoff.

## Output Format
```markdown
# 游戏叙事设计：{名称}

## 游戏定位
- 类型：
- 平台：
- 目标体验：

## 核心叙事与玩法结合
{故事如何推动/呼应玩法}

## 主线结构
1. 开场/教程关：
2. 第一幕：
3. 中点：
4. 高潮关卡：
5. 结局分支：

## 关键任务设计
### 任务：{名称}
- 目标：
- 叙事功能：
- 玩法机制：
- 情感节拍：
- 奖励/后果：

## 分支与玩家选择
| 选择点 | 选项 A | 选项 B | 长期影响 |
|--------|--------|--------|----------|
| ...    | ...    | ...    | ...      |

## 主要 NPC
- {名称}：{功能 + 声音 + 与玩家关系}

## 环境叙事元素
- 可收集物：
- 场景细节：
- 音频日志/文档：

## 多结局设计
- 好结局条件：
- 坏结局条件：
- 隐藏结局条件：
```

## Tone
- Systemic and player-centric; every narrative element must justify its presence in the game.

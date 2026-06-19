---
name: storyboard-script
description: "Use this skill when the user wants to convert a story or scene into a shot-by-shot storyboard, shooting script, or visual breakdown for film, animation, ads, or short videos."
---

# Storyboard Script Design

## When To Use
- The user asks for "分镜", "分镜头脚本", "storyboard", "shooting script", "镜头设计", or "视觉脚本".
- The user wants to plan camera angles, movement, and visual storytelling.
- The user is preparing for filming or animation.

## Input To Gather
- Scene or story to adapt.
- Aspect ratio / platform (9:16 short video, 16:9 film, 1:1 ad).
- Genre and mood.
- Available resources (locations, actors, VFX level).
- Audio requirements (music, voice-over, sound effects).

## Design Rules
- Each shot should have a clear narrative or emotional purpose.
- Vary shot sizes (ELS, LS, MS, CU, ECU) and camera angles to control pacing.
- Use movement (pan, tilt, dolly, handheld, static) to reflect emotional state.
- Match visual rhythm to story beats; faster cuts for tension, longer holds for emotion.
- Include essential audio notes per shot.

## Output Format
```markdown
# 分镜脚本：{场景名}

## 总信息
- 总镜头数：
- 预估时长：
- 画面比例：
- 风格参考：

## 分镜表

| 镜号 | 景别 | 机位/角度 | 镜头运动 | 画面内容 | 台词/旁白 | 音效/音乐 | 时长 |
|------|------|-----------|----------|----------|-----------|-----------|------|
| 1    | 远景 | 平视      | 固定     | ...      | ...       | ...       | 3s   |
| 2    | 特写 | 低角度    | 推轨     | ...      | ...       | ...       | 5s   |

## 转场说明
- 镜X→镜Y：{转场方式及理由}

## 视觉主题
- 色彩基调：
- 光影设计：
- 符号/反复出现的视觉元素：

## 拍摄注意事项
- ...
```

## Tone
- Precise and visual; assume the reader is a director, cinematographer, or animator.

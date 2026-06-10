/**
 * 动画模板与关键帧插值
 * 模板 -> 关键帧列表
 * 时间轴 -> 当前帧各节点参数
 */
import type { AnimationClip, KeyFrame, MeshNode } from "@/types";
import { uid } from "@/store/projectStore";

const cubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number) => {
  // 简化：用 sin 缓动做替代，输出 0~1
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // 近似 bezier，使用隐式方程牛顿法（简化版：直接返回 sin 曲线）
    const k = 0.5; // 平滑度
    return Math.sin(t * Math.PI) * k + t * (1 - k);
  };
};

const easeInOut = cubicBezier(0.4, 0, 0.2, 1);
const easeOut = cubicBezier(0, 0, 0.2, 1);

export const interpolate = (
  from: { x: number; y: number; rotation: number; scale: number },
  to: { x: number; y: number; rotation: number; scale: number },
  t: number
) => {
  const e = easeInOut(t);
  return {
    x: from.x + (to.x - from.x) * e,
    y: from.y + (to.y - from.y) * e,
    rotation: from.rotation + (to.rotation - from.rotation) * e,
    scale: from.scale + (to.scale - from.scale) * e,
  };
};

/**
 * 在指定时间计算所有节点状态
 */
export const sampleClip = (
  clip: AnimationClip,
  nodes: MeshNode[],
  time: number
): Record<string, { x: number; y: number; rotation: number; scale: number }> => {
  if (clip.keyframes.length === 0) {
    const out: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
    nodes.forEach((n) => {
      out[n.id] = { x: 0, y: 0, rotation: 0, scale: 1 };
    });
    return out;
  }
  const sorted = [...clip.keyframes].sort((a, b) => a.time - b.time);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (time <= first.time) return first.nodeStates;
  if (time >= last.time) return clip.loop ? sampleClip(clip, nodes, ((time - first.time) % (last.time - first.time)) + first.time) : last.nodeStates;

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const t = (time - a.time) / (b.time - a.time);
      const out: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
      const allIds = new Set([...Object.keys(a.nodeStates), ...Object.keys(b.nodeStates)]);
      allIds.forEach((id) => {
        const fa = a.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
        const fb = b.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
        out[id] = interpolate(fa, fb, t);
      });
      return out;
    }
  }
  return last.nodeStates;
};

/* ============= 模板工厂 ============= */

const makeFrame = (time: number, states: Record<string, { x: number; y: number; rotation: number; scale: number }>): KeyFrame => ({
  id: uid(),
  time,
  nodeStates: states,
});

/** 眨眼模板：影响 eye_L/eye_R 节点的 y 缩放 */
export const blinkTemplate = (nodes: MeshNode[]): AnimationClip => {
  const eyeL = nodes.find((n) => n.name === "eye_L");
  const eyeR = nodes.find((n) => n.name === "eye_R");
  const blank = (scale: number) => {
    const out: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
    nodes.forEach((n) => (out[n.id] = { x: 0, y: 0, rotation: 0, scale }));
    return out;
  };
  const kf1 = makeFrame(0, blank(1));
  const kf2 = makeFrame(0.18, blank(1));
  // 闭合帧：仅 eye 节点 y 方向不影响（因为我们只能缩放），用 scale 模拟
  if (eyeL) kf2.nodeStates[eyeL.id] = { x: 0, y: 0, rotation: 0, scale: 0.05 };
  if (eyeR) kf2.nodeStates[eyeR.id] = { x: 0, y: 0, rotation: 0, scale: 0.05 };
  const kf3 = makeFrame(0.32, blank(1));
  if (eyeL) kf3.nodeStates[eyeL.id] = { x: 0, y: 0, rotation: 0, scale: 1 };
  if (eyeR) kf3.nodeStates[eyeR.id] = { x: 0, y: 0, rotation: 0, scale: 1 };
  return {
    id: uid(),
    name: "眨眼",
    duration: 4.0,
    loop: true,
    keyframes: [kf1, kf2, kf3],
    fromTemplate: "blink",
  };
};

/** 呼吸模板：影响 body 节点的 y 方向 */
export const breatheTemplate = (nodes: MeshNode[]): AnimationClip => {
  const body = nodes.find((n) => n.name === "body") ?? nodes[0];
  if (!body) {
    return { id: uid(), name: "呼吸", duration: 3, loop: true, keyframes: [] };
  }
  const kf1 = makeFrame(0, { [body.id]: { x: 0, y: 0, rotation: 0, scale: 1 } });
  const kf2 = makeFrame(1.5, { [body.id]: { x: 0, y: -3, rotation: 0, scale: 1.01 } });
  const kf3 = makeFrame(3.0, { [body.id]: { x: 0, y: 0, rotation: 0, scale: 1 } });
  return { id: uid(), name: "呼吸", duration: 3, loop: true, keyframes: [kf1, kf2, kf3], fromTemplate: "breathe" };
};

/** 转头模板：影响 head/face 节点的 rotation */
export const headTurnTemplate = (nodes: MeshNode[]): AnimationClip => {
  const head = nodes.find((n) => n.name === "head" || n.name === "face");
  if (!head) return { id: uid(), name: "转头", duration: 4, loop: true, keyframes: [] };
  const kf1 = makeFrame(0, { [head.id]: { x: 0, y: 0, rotation: -8, scale: 1 } });
  const kf2 = makeFrame(2, { [head.id]: { x: 0, y: 0, rotation: 8, scale: 1 } });
  const kf3 = makeFrame(4, { [head.id]: { x: 0, y: 0, rotation: -8, scale: 1 } });
  return { id: uid(), name: "转头", duration: 4, loop: true, keyframes: [kf1, kf2, kf3], fromTemplate: "headTurn" };
};

/** 摆臂模板 */
export const swingArmTemplate = (nodes: MeshNode[]): AnimationClip => {
  const l = nodes.find((n) => n.name === "arm_L");
  const r = nodes.find((n) => n.name === "arm_R");
  const states: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
  nodes.forEach((n) => (states[n.id] = { x: 0, y: 0, rotation: 0, scale: 1 }));
  if (l) states[l.id].rotation = -10;
  if (r) states[r.id].rotation = 10;
  const kf1 = makeFrame(0, { ...states });
  const swapped: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
  nodes.forEach((n) => (swapped[n.id] = { x: 0, y: 0, rotation: 0, scale: 1 }));
  if (l) swapped[l.id].rotation = 10;
  if (r) swapped[r.id].rotation = -10;
  const kf2 = makeFrame(1, swapped);
  const kf3 = makeFrame(2, { ...states });
  return { id: uid(), name: "摆臂", duration: 2, loop: true, keyframes: [kf1, kf2, kf3], fromTemplate: "swingArm" };
};

/** 说话模板：mouth 节点随机抖动 */
export const talkTemplate = (nodes: MeshNode[]): AnimationClip => {
  const mouth = nodes.find((n) => n.name === "mouth");
  const base: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
  nodes.forEach((n) => (base[n.id] = { x: 0, y: 0, rotation: 0, scale: 1 }));
  const keyframes: KeyFrame[] = [];
  const times = [0, 0.18, 0.4, 0.6, 0.85, 1.1, 1.4, 1.7];
  times.forEach((t, i) => {
    const s = { ...base };
    if (mouth) s[mouth.id] = { x: 0, y: i % 2 === 0 ? -1 : 1, rotation: 0, scale: i % 3 === 0 ? 0.6 : 1 };
    keyframes.push(makeFrame(t, s));
  });
  return { id: uid(), name: "说话", duration: 1.8, loop: true, keyframes, fromTemplate: "talk" };
};

export const TEMPLATE_LIST = [
  { id: "blink", name: "眨眼 Blink", desc: "自然的眼睛闭合动画", factory: blinkTemplate, emoji: "👁️" },
  { id: "breathe", name: "呼吸 Breathe", desc: "身体轻微起伏，模拟呼吸", factory: breatheTemplate, emoji: "🌬️" },
  { id: "headTurn", name: "转头 Turn", desc: "头部左右小幅度转动", factory: headTurnTemplate, emoji: "🔄" },
  { id: "swingArm", name: "摆臂 Swing", desc: "左右手交替摆动", factory: swingArmTemplate, emoji: "💪" },
  { id: "talk", name: "说话 Talk", desc: "嘴部随机开合", factory: talkTemplate, emoji: "💬" },
] as const;

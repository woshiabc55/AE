/**
 * 动画 clip 批量优化引擎
 *
 * 提供三类无依赖的优化算子，可独立或组合使用：
 *  1. compressKeyframes  —— Ramer-Douglas-Peucker 风格的曲线简化
 *  2. resampleClip       —— 把关键帧重采样到目标帧率（关键帧降密度）
 *  3. pruneStaticChannels —— 移除整条不变的通道（与 base 关键帧相同的节点）
 *
 *  +  batchOptimize 批量 API + diff 报告
 */
import type { AnimationClip, KeyFrame, MeshNode } from "@/types";

type NodeState = { x: number; y: number; rotation: number; scale: number };
type Channel = Record<string, NodeState>;

/* ============================================================
 * 1) 关键帧压缩（RDP）
 * ========================================================== */

const dist = (a: NodeState, b: NodeState): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dr = a.rotation - b.rotation;
  const ds = a.scale - b.scale;
  return Math.sqrt(dx * dx + dy * dy + dr * dr + ds * ds);
};

/**
 * 对单个通道做 RDP 简化。返回保留的关键帧下标。
 * - 始终保留首尾关键帧
 * - 距离阈值越大，保留帧越少
 */
const rdpForChannel = (values: NodeState[], epsilon: number): boolean[] => {
  const n = values.length;
  if (n <= 2) return values.map(() => true);
  const keep = new Array<boolean>(n).fill(false);
  keep[0] = true;
  keep[n - 1] = true;
  const stack: [number, number][] = [[0, n - 1]];
  while (stack.length) {
    const [s, e] = stack.pop()!;
    if (e - s < 2) continue;
    const a = values[s];
    const b = values[e];
    let maxD = 0;
    let maxI = -1;
    for (let i = s + 1; i < e; i++) {
      // 用线性插值做基准线
      const t = (i - s) / (e - s);
      const proj: NodeState = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        rotation: a.rotation + (b.rotation - a.rotation) * t,
        scale: a.scale + (b.scale - a.scale) * t,
      };
      const d = dist(values[i], proj);
      if (d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    if (maxI >= 0 && maxD > epsilon) {
      keep[maxI] = true;
      stack.push([s, maxI], [maxI, e]);
    }
  }
  return keep;
};

/**
 * 压缩单个 clip：每个节点通道独立做 RDP。
 * @param epsilon 距离阈值（建议 0.01 ~ 0.5，值越大压缩越狠）
 */
export const compressKeyframes = (clip: AnimationClip, epsilon = 0.05): AnimationClip => {
  if (clip.keyframes.length <= 2) return clip;
  const sorted = [...clip.keyframes].sort((a, b) => a.time - b.time);
  // 收集所有出现过的 nodeId
  const nodeIds = new Set<string>();
  sorted.forEach((k) => Object.keys(k.nodeStates).forEach((id) => nodeIds.add(id)));
  // 对每个 nodeId 计算 keep 集合
  const globalKeep = new Array<boolean>(sorted.length).fill(false);
  nodeIds.forEach((id) => {
    const series = sorted.map((k) => k.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 });
    const keep = rdpForChannel(series, epsilon);
    keep.forEach((v, i) => {
      if (v) globalKeep[i] = true;
    });
  });
  // 首尾强制保留
  globalKeep[0] = true;
  globalKeep[globalKeep.length - 1] = true;
  const newKeyframes = sorted.filter((_, i) => globalKeep[i]);
  return { ...clip, keyframes: newKeyframes };
};

/* ============================================================
 * 2) 重采样到目标帧率
 * ========================================================== */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const sampleAtTime = (
  sorted: KeyFrame[],
  nodeIds: string[],
  time: number
): Channel => {
  if (sorted.length === 0) {
    const o: Channel = {};
    nodeIds.forEach((id) => (o[id] = { x: 0, y: 0, rotation: 0, scale: 1 }));
    return o;
  }
  if (time <= sorted[0].time) {
    const o: Channel = {};
    nodeIds.forEach((id) => (o[id] = sorted[0].nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 }));
    return o;
  }
  const last = sorted[sorted.length - 1];
  if (time >= last.time) {
    const o: Channel = {};
    nodeIds.forEach((id) => (o[id] = last.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 }));
    return o;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const t = (time - a.time) / Math.max(1e-6, b.time - a.time);
      const o: Channel = {};
      nodeIds.forEach((id) => {
        const sa = a.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
        const sb = b.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
        o[id] = {
          x: lerp(sa.x, sb.x, t),
          y: lerp(sa.y, sb.y, t),
          rotation: lerp(sa.rotation, sb.rotation, t),
          scale: lerp(sa.scale, sb.scale, t),
        };
      });
      return o;
    }
  }
  const o: Channel = {};
  nodeIds.forEach((id) => (o[id] = last.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 }));
  return o;
};

/**
 * 把 clip 重采样到目标帧率：保留首尾 + 间隔 1/fps 秒的中间关键帧。
 */
export const resampleClip = (clip: AnimationClip, fps = 30): AnimationClip => {
  if (clip.keyframes.length === 0) return clip;
  const sorted = [...clip.keyframes].sort((a, b) => a.time - b.time);
  const start = sorted[0].time;
  const end = sorted[sorted.length - 1].time;
  if (end <= start) return clip;
  const step = 1 / fps;
  const nodeIds = Array.from(
    new Set(sorted.flatMap((k) => Object.keys(k.nodeStates)))
  );
  const out: KeyFrame[] = [];
  for (let t = start; t <= end + 1e-6; t += step) {
    out.push({
      id: `kf-${Math.round(t * 1000)}`,
      time: t,
      nodeStates: sampleAtTime(sorted, nodeIds, t),
    });
  }
  // 强制保留原始末帧
  const last = sorted[sorted.length - 1];
  if (out.length === 0 || Math.abs(out[out.length - 1].time - last.time) > 1e-4) {
    const states: Channel = {};
    nodeIds.forEach((id) => (states[id] = last.nodeStates[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 }));
    out.push({ id: `kf-end`, time: last.time, nodeStates: states });
  }
  return { ...clip, duration: end - start, keyframes: out };
};

/* ============================================================
 * 3) 通道剪枝：移除相对 base 完全不变的节点
 * ========================================================== */

const EQUAL_STATE = (a: NodeState, b: NodeState) =>
  Math.abs(a.x - b.x) < 1e-4 &&
  Math.abs(a.y - b.y) < 1e-4 &&
  Math.abs(a.rotation - b.rotation) < 1e-4 &&
  Math.abs(a.scale - b.scale) < 1e-4;

/**
 * 移除关键帧中相对 base（首帧）没有任何变化的节点通道。
 */
export const pruneStaticChannels = (clip: AnimationClip): AnimationClip => {
  if (clip.keyframes.length === 0) return clip;
  const sorted = [...clip.keyframes].sort((a, b) => a.time - b.time);
  const base = sorted[0].nodeStates;
  const baseIds = Object.keys(base);
  // 收集所有出现过的 id
  const allIds = new Set<string>();
  sorted.forEach((k) => Object.keys(k.nodeStates).forEach((id) => allIds.add(id)));
  const movable: string[] = [];
  allIds.forEach((id) => {
    if (!baseIds.includes(id)) {
      movable.push(id);
      return;
    }
    const bv = base[id];
    const hasChange = sorted.slice(1).some((k) => {
      const v = k.nodeStates[id];
      if (!v) return false;
      return !EQUAL_STATE(v, bv);
    });
    if (hasChange) movable.push(id);
  });
  const newKeyframes: KeyFrame[] = sorted.map((k) => {
    const next: Channel = {};
    movable.forEach((id) => {
      next[id] = k.nodeStates[id] ?? base[id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
    });
    return { ...k, nodeStates: next };
  });
  return { ...clip, keyframes: newKeyframes };
};

/* ============================================================
 * 4) LOD 简化：按 influence 排序丢弃低权重节点
 * ========================================================== */

/**
 * 简化 clip：把低于 influence 阈值的节点的关键帧状态抹零。
 * 用于对低端机/移动端预生成低细节版本。
 */
export const simplifyLOD = (clip: AnimationClip, nodes: MeshNode[], threshold = 0.1): AnimationClip => {
  if (clip.keyframes.length === 0) return clip;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const newKeyframes: KeyFrame[] = clip.keyframes.map((k) => {
    const next: Channel = {};
    Object.entries(k.nodeStates).forEach(([id, st]) => {
      const n = nodeMap.get(id);
      if (!n || n.influence >= threshold) {
        next[id] = st;
      } else {
        // 还原到 base（无位移/旋转，scale=1）
        next[id] = { x: 0, y: 0, rotation: 0, scale: 1 };
      }
    });
    return { ...k, nodeStates: next };
  });
  return { ...clip, keyframes: newKeyframes };
};

/* ============================================================
 * 5) 批量入口
 * ========================================================== */

export interface ClipOptimizeOptions {
  compress?: { epsilon: number } | false;
  resample?: { fps: number } | false;
  pruneStatic?: boolean;
  lod?: { threshold: number } | false;
}

export interface ClipDiff {
  id: string;
  name: string;
  before: { keyframes: number; channels: number };
  after: { keyframes: number; channels: number };
  ratio: number; // after / before
}

const countChannels = (clip: AnimationClip): number => {
  const set = new Set<string>();
  clip.keyframes.forEach((k) => Object.keys(k.nodeStates).forEach((id) => set.add(id)));
  return set.size;
};

export const optimizeClip = (clip: AnimationClip, opt: ClipOptimizeOptions): AnimationClip => {
  let out = clip;
  if (opt.pruneStatic) out = pruneStaticChannels(out);
  if (opt.compress) out = compressKeyframes(out, opt.compress.epsilon);
  if (opt.resample) out = resampleClip(out, opt.resample.fps);
  if (opt.lod) out = simplifyLOD(out, opt.lod.threshold ? [] as MeshNode[] : [], opt.lod.threshold);
  return out;
};

/**
 * LOD 简化需要节点列表，独立暴露以避免循环依赖
 */
export const optimizeClipFull = (
  clip: AnimationClip,
  nodes: MeshNode[],
  opt: ClipOptimizeOptions
): AnimationClip => {
  let out = clip;
  if (opt.pruneStatic) out = pruneStaticChannels(out);
  if (opt.compress) out = compressKeyframes(out, opt.compress.epsilon);
  if (opt.resample) out = resampleClip(out, opt.resample.fps);
  if (opt.lod) out = simplifyLOD(out, nodes, opt.lod.threshold);
  return out;
};

export const batchOptimize = (
  clips: AnimationClip[],
  nodes: MeshNode[],
  opt: ClipOptimizeOptions
): { optimized: AnimationClip[]; diffs: ClipDiff[] } => {
  const optimized: AnimationClip[] = [];
  const diffs: ClipDiff[] = [];
  clips.forEach((c) => {
    const before = { keyframes: c.keyframes.length, channels: countChannels(c) };
    const next = optimizeClipFull(c, nodes, opt);
    optimized.push(next);
    diffs.push({
      id: c.id,
      name: c.name,
      before,
      after: { keyframes: next.keyframes.length, channels: countChannels(next) },
      ratio: before.keyframes === 0 ? 1 : next.keyframes.length / before.keyframes,
    });
  });
  return { optimized, diffs };
};

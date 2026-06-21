import { create } from "zustand";
import type {
  Project,
  HalfModule,
  SkeletonData,
  Keyframe,
  AnimationData,
  Bead,
  Joint,
  Bone,
  Pose,
  Tool,
  Side,
} from "@/types";
import { DEFAULT_PALETTE } from "@/types";
import { uid, saveFullProject, loadFullProject } from "@/db/db";
import { dragJointInPose } from "@/engine/skeletonEngine";
import { mirrorBeads } from "@/utils/templates";

interface HistorySnapshot {
  modules: HalfModule[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
}

interface StudioState {
  // 项目元数据
  projectId: string | null;
  projectName: string;
  gridSize: number;
  palette: string[];

  // 内容
  modules: HalfModule[]; // 通常 [left, right]
  skeleton: SkeletonData | null;
  keyframes: Keyframe[];
  animation: AnimationData | null;

  // 编辑状态
  activeSide: Side;
  tool: Tool;
  currentColor: number;
  selectedJointId: string | null;
  currentFrame: number;
  isPlaying: boolean;
  showGrid: boolean;
  showHalfDivider: boolean;
  showSkeleton: boolean;
  showOnionSkin: boolean;
  fps: number;
  loop: boolean;
  animLength: number;

  // 历史
  history: HistorySnapshot[];
  historyIndex: number;
  dirty: boolean;

  // 动作
  newProject: (name: string, gridSize: number) => void;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<void>;
  setTool: (t: Tool) => void;
  setColor: (c: number) => void;
  setActiveSide: (s: Side) => void;
  toggleGrid: () => void;
  toggleHalfDivider: () => void;
  toggleSkeleton: () => void;
  toggleOnionSkin: () => void;

  // 拼豆编辑
  paintBead: (x: number, y: number) => void;
  eraseBead: (x: number, y: number) => void;
  fillArea: (x: number, y: number) => void;
  pickColor: (x: number, y: number) => void;
  mirrorActiveToOther: () => void;
  clearActiveSide: () => void;

  // 骨架
  addJoint: (x: number, y: number, parentId?: string | null) => void;
  removeJoint: (id: string) => void;
  selectJoint: (id: string | null) => void;
  connectJoints: (fromId: string, toId: string) => void;
  dragJoint: (jointId: string, newX: number, newY: number) => void;

  // 关键帧
  addKeyframe: () => void;
  removeKeyframe: (id: string) => void;
  goToFrame: (frame: number) => void;
  setPlaying: (p: boolean) => void;
  setFps: (f: number) => void;
  setAnimLength: (l: number) => void;
  toggleLoop: () => void;
  updateCurrentFramePoses: (poses: Pose[]) => void;

  // 历史
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

function makeEmptyProject(name: string, gridSize: number): {
  project: Project;
  modules: HalfModule[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
  animation: AnimationData;
} {
  const pid = uid("proj");
  const now = Date.now();
  return {
    project: {
      id: pid,
      name,
      gridSize,
      palette: [...DEFAULT_PALETTE],
      createdAt: now,
      updatedAt: now,
    },
    modules: [
      {
        id: uid("mod"),
        projectId: pid,
        side: "left",
        label: "左半面",
        beads: [],
      },
      {
        id: uid("mod"),
        projectId: pid,
        side: "right",
        label: "右半面",
        beads: [],
      },
    ],
    skeleton: {
      id: uid("sk"),
      projectId: pid,
      joints: [],
      bones: [],
    },
    keyframes: [],
    animation: {
      id: uid("an"),
      projectId: pid,
      fps: 12,
      loop: true,
      length: 24,
    },
  };
}

export const useStudioStore = create<StudioState>((set, get) => ({
  projectId: null,
  projectName: "未命名作品",
  gridSize: 16,
  palette: [...DEFAULT_PALETTE],

  modules: [],
  skeleton: null,
  keyframes: [],
  animation: null,

  activeSide: "left",
  tool: "brush",
  currentColor: 2,
  selectedJointId: null,
  currentFrame: 0,
  isPlaying: false,
  showGrid: true,
  showHalfDivider: true,
  showSkeleton: true,
  showOnionSkin: false,
  fps: 12,
  loop: true,
  animLength: 24,

  history: [],
  historyIndex: -1,
  dirty: false,

  newProject: (name, gridSize) => {
    const data = makeEmptyProject(name, gridSize);
    set({
      projectId: data.project.id,
      projectName: data.project.name,
      gridSize: data.project.gridSize,
      palette: data.project.palette,
      modules: data.modules,
      skeleton: data.skeleton,
      keyframes: data.keyframes,
      animation: data.animation,
      fps: data.animation.fps,
      loop: data.animation.loop,
      animLength: data.animation.length,
      activeSide: "left",
      tool: "brush",
      currentColor: 2,
      selectedJointId: null,
      currentFrame: 0,
      isPlaying: false,
      history: [],
      historyIndex: -1,
      dirty: false,
    });
  },

  loadProject: async (projectId) => {
    const data = await loadFullProject(projectId);
    if (!data) return;
    set({
      projectId: data.project.id,
      projectName: data.project.name,
      gridSize: data.project.gridSize,
      palette: data.project.palette,
      modules: data.modules,
      skeleton: data.skeleton,
      keyframes: data.keyframes,
      animation: data.animation,
      fps: data.animation?.fps ?? 12,
      loop: data.animation?.loop ?? true,
      animLength: data.animation?.length ?? 24,
      activeSide: "left",
      currentFrame: 0,
      isPlaying: false,
      history: [],
      historyIndex: -1,
      dirty: false,
    });
  },

  saveProject: async () => {
    const s = get();
    if (!s.projectId || !s.skeleton || !s.animation) return;
    const project: Project = {
      id: s.projectId,
      name: s.projectName,
      gridSize: s.gridSize,
      palette: s.palette,
      createdAt: s.history[0] ? Date.now() : Date.now(),
      updatedAt: Date.now(),
    };
    await saveFullProject({
      project,
      modules: s.modules,
      skeleton: s.skeleton,
      keyframes: s.keyframes,
      animation: s.animation,
    });
    set({ dirty: false });
  },

  setTool: (t) => set({ tool: t, selectedJointId: t === "skeleton" ? get().selectedJointId : null }),
  setColor: (c) => set({ currentColor: c }),
  setActiveSide: (s) => set({ activeSide: s }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleHalfDivider: () => set((s) => ({ showHalfDivider: !s.showHalfDivider })),
  toggleSkeleton: () => set((s) => ({ showSkeleton: !s.showSkeleton })),
  toggleOnionSkin: () => set((s) => ({ showOnionSkin: !s.showOnionSkin })),

  paintBead: (x, y) => {
    const s = get();
    const mod = s.modules.find((m) => m.side === s.activeSide);
    if (!mod) return;
    const existing = mod.beads.find((b) => b.x === x && b.y === y);
    if (existing && existing.color === s.currentColor) return;
    const newBeads = existing
      ? mod.beads.map((b) =>
          b.x === x && b.y === y ? { ...b, color: s.currentColor } : b,
        )
      : [...mod.beads, { x, y, color: s.currentColor }];
    set({
      modules: s.modules.map((m) =>
        m.id === mod.id ? { ...m, beads: newBeads } : m,
      ),
      dirty: true,
    });
  },

  eraseBead: (x, y) => {
    const s = get();
    const mod = s.modules.find((m) => m.side === s.activeSide);
    if (!mod) return;
    set({
      modules: s.modules.map((m) =>
        m.id === mod.id
          ? { ...m, beads: mod.beads.filter((b) => !(b.x === x && b.y === y)) }
          : m,
      ),
      dirty: true,
    });
  },

  fillArea: (x, y) => {
    const s = get();
    const mod = s.modules.find((m) => m.side === s.activeSide);
    if (!mod) return;
    const target = mod.beads.find((b) => b.x === x && b.y === y);
    const targetColor = target?.color ?? -1;
    if (targetColor === s.currentColor) return;
    const visited = new Set<string>();
    const queue: Array<[number, number]> = [[x, y]];
    const newBeads = [...mod.beads];
    const beadMap = new Map(newBeads.map((b) => [`${b.x},${b.y}`, b]));
    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (cx < 0 || cx >= s.gridSize || cy < 0 || cy >= s.gridSize) continue;
      const cur = beadMap.get(key);
      const curColor = cur?.color ?? -1;
      if (curColor !== targetColor) continue;
      if (cur) {
        cur.color = s.currentColor;
      } else {
        const newBead: Bead = { x: cx, y: cy, color: s.currentColor };
        newBeads.push(newBead);
        beadMap.set(key, newBead);
      }
      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    set({
      modules: s.modules.map((m) =>
        m.id === mod.id ? { ...m, beads: newBeads } : m,
      ),
      dirty: true,
    });
  },

  pickColor: (x, y) => {
    const s = get();
    const mod = s.modules.find((m) => m.side === s.activeSide);
    if (!mod) return;
    const bead = mod.beads.find((b) => b.x === x && b.y === y);
    if (bead) {
      set({ currentColor: bead.color, tool: "brush" });
    }
  },

  mirrorActiveToOther: () => {
    const s = get();
    const active = s.modules.find((m) => m.side === s.activeSide);
    if (!active) return;
    const otherSide: Side = s.activeSide === "left" ? "right" : "left";
    const mirrored = mirrorBeads(active.beads, s.gridSize);
    set({
      modules: s.modules.map((m) =>
        m.side === otherSide ? { ...m, beads: mirrored } : m,
      ),
      dirty: true,
    });
  },

  clearActiveSide: () => {
    const s = get();
    set({
      modules: s.modules.map((m) =>
        m.side === s.activeSide ? { ...m, beads: [] } : m,
      ),
      dirty: true,
    });
  },

  addJoint: (x, y, parentId = null) => {
    const s = get();
    if (!s.skeleton) return;
    const id = uid("j");
    const joint: Joint = { id, x, y, parent: parentId };
    const newJoints = [...s.skeleton.joints, joint];
    const newBones =
      parentId && s.skeleton.joints.find((j) => j.id === parentId)
        ? [...s.skeleton.bones, { from: parentId, to: id, influence: 0.6 }]
        : s.skeleton.bones;
    set({
      skeleton: { ...s.skeleton, joints: newJoints, bones: newBones },
      selectedJointId: id,
      dirty: true,
    });
  },

  removeJoint: (id) => {
    const s = get();
    if (!s.skeleton) return;
    set({
      skeleton: {
        ...s.skeleton,
        joints: s.skeleton.joints
          .filter((j) => j.id !== id)
          .map((j) => (j.parent === id ? { ...j, parent: null } : j)),
        bones: s.skeleton.bones.filter(
          (b) => b.from !== id && b.to !== id,
        ),
      },
      selectedJointId: null,
      dirty: true,
    });
  },

  selectJoint: (id) => set({ selectedJointId: id }),

  connectJoints: (fromId, toId) => {
    const s = get();
    if (!s.skeleton) return;
    if (fromId === toId) return;
    const exists = s.skeleton.bones.some(
      (b) =>
        (b.from === fromId && b.to === toId) ||
        (b.from === toId && b.to === fromId),
    );
    if (exists) return;
    const newBones: Bone[] = [...s.skeleton.bones, { from: fromId, to: toId, influence: 0.6 }];
    // 同时设置 parent
    const newJoints = s.skeleton.joints.map((j) =>
      j.id === toId ? { ...j, parent: fromId } : j,
    );
    set({
      skeleton: { ...s.skeleton, joints: newJoints, bones: newBones },
      dirty: true,
    });
  },

  dragJoint: (jointId, newX, newY) => {
    const s = get();
    if (!s.skeleton) return;
    // 在当前帧的 poses 上拖拽
    const currentKf = s.keyframes.find((k) => k.frame === s.currentFrame);
    let newKeyframes: Keyframe[];
    if (currentKf) {
      const newPoses = dragJointInPose(
        s.skeleton.joints,
        currentKf.poses,
        jointId,
        newX,
        newY,
      );
      newKeyframes = s.keyframes.map((k) =>
        k.id === currentKf.id ? { ...k, poses: newPoses } : k,
      );
    } else {
      // 没有关键帧则创建一个
      const poses = dragJointInPose(
        s.skeleton.joints,
        s.skeleton.joints.map((j) => ({ joint: j.id, x: j.x, y: j.y })),
        jointId,
        newX,
        newY,
      );
      const newKf: Keyframe = {
        id: uid("kf"),
        projectId: s.projectId ?? "",
        frame: s.currentFrame,
        poses,
      };
      newKeyframes = [...s.keyframes, newKf];
    }
    set({ keyframes: newKeyframes, dirty: true });
  },

  addKeyframe: () => {
    const s = get();
    if (!s.skeleton) return;
    // 用当前帧的插值结果作为新关键帧的 poses
    const existing = s.keyframes.find((k) => k.frame === s.currentFrame);
    if (existing) return; // 已存在
    const poses: Pose[] = s.skeleton.joints.map((j) => ({
      joint: j.id,
      x: j.x,
      y: j.y,
    }));
    const newKf: Keyframe = {
      id: uid("kf"),
      projectId: s.projectId ?? "",
      frame: s.currentFrame,
      poses,
    };
    const sorted = [...s.keyframes, newKf].sort((a, b) => a.frame - b.frame);
    set({ keyframes: sorted, dirty: true });
  },

  removeKeyframe: (id) => {
    set((s) => ({ keyframes: s.keyframes.filter((k) => k.id !== id), dirty: true }));
  },

  goToFrame: (frame) => set({ currentFrame: Math.max(0, Math.min(get().animLength, frame)) }),
  setPlaying: (p) => set({ isPlaying: p }),
  setFps: (f) => {
    const s = get();
    set({ fps: f, animation: s.animation ? { ...s.animation, fps: f } : s.animation });
  },
  setAnimLength: (l) => {
    const s = get();
    set({
      animLength: l,
      animation: s.animation ? { ...s.animation, length: l } : s.animation,
    });
  },
  toggleLoop: () => {
    const s = get();
    set({
      loop: !s.loop,
      animation: s.animation ? { ...s.animation, loop: !s.loop } : s.animation,
    });
  },

  updateCurrentFramePoses: () => {
    // 播放时更新预览（不写入 keyframes）
    // 这里通过 currentFrame + 临时 poses 实现，组件层处理
  },

  pushHistory: () => {
    const s = get();
    const snapshot: HistorySnapshot = {
      modules: JSON.parse(JSON.stringify(s.modules)),
      skeleton: JSON.parse(JSON.stringify(s.skeleton)),
      keyframes: JSON.parse(JSON.stringify(s.keyframes)),
    };
    const newHistory = s.history.slice(0, s.historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const s = get();
    if (s.historyIndex < 0) return;
    const snapshot = s.history[s.historyIndex];
    if (!snapshot) return;
    set({
      modules: JSON.parse(JSON.stringify(snapshot.modules)),
      skeleton: JSON.parse(JSON.stringify(snapshot.skeleton)),
      keyframes: JSON.parse(JSON.stringify(snapshot.keyframes)),
      historyIndex: s.historyIndex - 1,
      dirty: true,
    });
  },

  redo: () => {
    const s = get();
    if (s.historyIndex >= s.history.length - 1) return;
    const snapshot = s.history[s.historyIndex + 1];
    if (!snapshot) return;
    set({
      modules: JSON.parse(JSON.stringify(snapshot.modules)),
      skeleton: JSON.parse(JSON.stringify(snapshot.skeleton)),
      keyframes: JSON.parse(JSON.stringify(snapshot.keyframes)),
      historyIndex: s.historyIndex + 1,
      dirty: true,
    });
  },
}));

import type { Keyframe, Joint, Pose } from "@/types";

// 缓动函数
export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut";

export function applyEasing(t: number, easing: Easing): number {
  switch (easing) {
    case "linear":
      return t;
    case "easeIn":
      return t * t;
    case "easeOut":
      return 1 - (1 - t) * (1 - t);
    case "easeInOut":
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default:
      return t;
  }
}

// 在两个关键帧之间插值，返回指定帧的 pose
export function interpolateFrame(
  keyframes: Keyframe[],
  frame: number,
  easing: Easing = "linear",
): Pose[] {
  if (keyframes.length === 0) return [];
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  if (frame <= sorted[0].frame) return sorted[0].poses;
  if (frame >= sorted[sorted.length - 1].frame)
    return sorted[sorted.length - 1].poses;

  // 找到包围 frame 的两个关键帧
  let prev = sorted[0];
  let next = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].frame <= frame && sorted[i + 1].frame >= frame) {
      prev = sorted[i];
      next = sorted[i + 1];
      break;
    }
  }

  const span = next.frame - prev.frame;
  if (span === 0) return prev.poses;
  const t = applyEasing((frame - prev.frame) / span, easing);

  // 合并所有关节 id
  const jointIds = new Set<string>();
  prev.poses.forEach((p) => jointIds.add(p.joint));
  next.poses.forEach((p) => jointIds.add(p.joint));

  const prevMap = new Map(prev.poses.map((p) => [p.joint, p]));
  const nextMap = new Map(next.poses.map((p) => [p.joint, p]));

  const result: Pose[] = [];
  for (const jid of jointIds) {
    const p = prevMap.get(jid);
    const n = nextMap.get(jid);
    if (p && n) {
      result.push({
        joint: jid,
        x: p.x + (n.x - p.x) * t,
        y: p.y + (n.y - p.y) * t,
      });
    } else if (p) {
      result.push(p);
    } else if (n) {
      result.push(n);
    }
  }
  return result;
}

// 动画播放器
export class AnimationPlayer {
  private keyframes: Keyframe[] = [];
  private fps = 12;
  private length = 24;
  private loop = true;
  private easing: Easing = "linear";
  private currentFrame = 0;
  private lastTime = 0;
  private playing = false;
  private speed = 1;
  private onUpdate?: (frame: number, poses: Pose[]) => void;

  setConfig(config: {
    keyframes: Keyframe[];
    fps: number;
    length: number;
    loop: boolean;
    easing?: Easing;
  }) {
    this.keyframes = config.keyframes;
    this.fps = config.fps;
    this.length = config.length;
    this.loop = config.loop;
    this.easing = config.easing ?? "linear";
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  setOnUpdate(cb: (frame: number, poses: Pose[]) => void) {
    this.onUpdate = cb;
  }

  play() {
    if (this.keyframes.length === 0) return;
    this.playing = true;
    this.lastTime = performance.now();
    this.tick();
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.playing = false;
    this.currentFrame = 0;
    this.emit();
  }

  seek(frame: number) {
    this.currentFrame = Math.max(0, Math.min(this.length, frame));
    this.emit();
  }

  getFrame() {
    return this.currentFrame;
  }

  isPlaying() {
    return this.playing;
  }

  private tick = () => {
    if (!this.playing) return;
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.currentFrame += dt * this.fps * this.speed;
    if (this.currentFrame >= this.length) {
      if (this.loop) {
        this.currentFrame = this.currentFrame % this.length;
      } else {
        this.currentFrame = this.length;
        this.playing = false;
      }
    }
    this.emit();
    if (this.playing) {
      requestAnimationFrame(this.tick);
    }
  };

  private emit() {
    if (this.onUpdate) {
      const poses = interpolateFrame(this.keyframes, this.currentFrame, this.easing);
      this.onUpdate(this.currentFrame, poses);
    }
  }
}

// 生成默认关键帧（起始姿势 + 结束姿势）
export function createDefaultKeyframes(
  projectId: string,
  joints: Joint[],
  length: number,
): Keyframe[] {
  const startPoses: Pose[] = joints.map((j) => ({
    joint: j.id,
    x: j.x,
    y: j.y,
  }));
  // 结束姿势：每个关节轻微偏移
  const endPoses: Pose[] = joints.map((j) => ({
    joint: j.id,
    x: j.x + (j.parent ? 1.5 : 0),
    y: j.y + (j.parent ? -1 : 0),
  }));
  return [
    {
      id: `kf_${projectId}_0`,
      projectId,
      frame: 0,
      poses: startPoses,
    },
    {
      id: `kf_${projectId}_1`,
      projectId,
      frame: length,
      poses: endPoses,
    },
  ];
}

/**
 * Live2D Cubism 原生风格导出器
 *
 * 出于教学与离线工具的目的，我们输出一份 Cubism 3+ 兼容描述的 JSON
 * （moc3.json + 每条动画一份 mtn.json + textures/），并打成 ZIP。
 *
 * 这份描述可以在第三方运行时（如 pixi-live2d-display、cubism web sdk）
 * 加载，关键字段命名参照官方 moc3 / mtn 规范：
 *   - Version / FileReferences / Layout
 *   - MeshNode / Drawable / Parameter
 *   - Curve（贝塞尔/线性/阶梯）
 *
 * 注：非官方 Cubism 二进制 moc3 解析，由消费端根据此 JSON 自行渲染。
 */
import type { AnimationClip, Layer, MeshNode, Project } from "@/types";
import { dataUrlToBytes, downloadZip, strToBytes, type ZipEntry } from "@/lib/zip";

interface CubismNode {
  Id: string;
  Name: string;
  /** 父节点 Id，根节点为 null */
  Parent: string | null;
  Position: { X: number; Y: number };
  Rotation: number;
  Scale: number;
  /** 关联 Drawable（贴图层）Id */
  Drawable?: string;
}

interface CubismDrawable {
  Id: string;
  Name: string;
  Texture: string;
  /** 在源贴图中的归一化 UV（仅占位） */
  UV: { u0: number; v0: number; u1: number; v1: number };
}

interface CubismCurve {
  Type: "Linear" | "Bezier" | "Step";
  /** 贝塞尔控制点 [x0,y0,x1,y1] */
  ControlPoints?: number[];
}

interface CubismKeyframe {
  Time: number;
  Value: number;
  Curve: CubismCurve;
}

interface CubismMotionSegment {
  Parameter: string;
  Keyframes: CubismKeyframe[];
}

interface CubismMotion {
  Version: 3;
  Meta: { Duration: number; Fps: number; Loop: boolean; CurveCount: number; UserData: Record<string, unknown> };
  Curves: CubismMotionSegment[];
}

const buildNodeTree = (nodes: MeshNode[], layers: Layer[]): CubismNode[] => {
  return nodes.map((n) => {
    const layer = n.boundLayerId ? layers.find((l) => l.id === n.boundLayerId) : null;
    return {
      Id: n.id,
      Name: n.name,
      Parent: n.parentId,
      Position: { X: n.x, Y: n.y },
      Rotation: n.rotation,
      Scale: n.scale,
      Drawable: layer ? layer.id : undefined,
    };
  });
};

const buildDrawables = (layers: Layer[]): CubismDrawable[] =>
  layers.map((l, i) => ({
    Id: l.id,
    Name: l.name,
    Texture: `textures/${i.toString().padStart(2, "0")}_${slug(l.name)}.png`,
    UV: { u0: 0, v0: 0, u1: 1, v1: 1 },
  }));

/** 把一个 AnimationClip 转成 mtn 描述 */
const clipToMotion = (clip: AnimationClip, nodes: MeshNode[]): CubismMotion => {
  // 对每个节点的 x/y/rotation/scale 各开一个 segment（Cubism 风格）
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const channels: Array<{ param: string; series: Array<{ time: number; value: number }> }> = [];
  const channelOf = (nodeId: string, attr: "x" | "y" | "rotation" | "scale") => {
    const node = nodeMap.get(nodeId);
    if (!node) return null;
    const baseValue = attr === "scale" ? 1 : 0;
    return {
      param: `${node.name}.${attr}`,
      series: clip.keyframes
        .slice()
        .sort((a, b) => a.time - b.time)
        .map((k) => ({
          time: k.time,
          value: (k.nodeStates[nodeId]?.[attr] ?? baseValue),
        })),
    };
  };
  const allIds = new Set<string>();
  clip.keyframes.forEach((k) => Object.keys(k.nodeStates).forEach((id) => allIds.add(id)));
  allIds.forEach((id) => {
    (["x", "y", "rotation", "scale"] as const).forEach((attr) => {
      const c = channelOf(id, attr);
      if (c) channels.push(c);
    });
  });
  const curves: CubismMotionSegment[] = channels.map((c) => ({
    Parameter: c.param,
    Keyframes: c.series.map((s, i) => ({
      Time: s.time,
      Value: s.value,
      Curve:
        i === 0 || i === c.series.length - 1
          ? { Type: "Linear" as const }
          : { Type: "Bezier" as const, ControlPoints: [0.0, 0.0, 1.0, 1.0] },
    })),
  }));
  return {
    Version: 3,
    Meta: {
      Duration: clip.duration,
      Fps: 30,
      Loop: clip.loop,
      CurveCount: curves.length,
      UserData: { fromTemplate: clip.fromTemplate ?? null, name: clip.name },
    },
    Curves: curves,
  };
};

const slug = (s: string) => s.replace(/[^a-z0-9_\-]+/gi, "_").toLowerCase();

/**
 * 导出 Live2D Cubism 风格包（moc3.json + mtn/*.mtn.json + textures/*.png）
 */
export const exportLive2DBundle = (project: Project) => {
  const nodes = buildNodeTree(project.nodes, project.layers);
  const drawables = buildDrawables(project.layers);
  const moc3 = {
    Version: 3,
    FileReferences: {
      Moc: `${slug(project.name)}.moc3`,
      Textures: drawables.map((d) => d.Texture),
      Motions: project.animations.map((a) => ({
        File: `mtn/${slug(a.name)}.mtn.json`,
        Name: a.name,
        FadeInTime: 0.5,
        FadeOutTime: 0.5,
      })),
    },
    Layout: {
      Width: project.canvasWidth,
      Height: project.canvasHeight,
      CenterX: 0,
      CenterY: 0,
      PixelPerUnit: 1,
    },
    MeshNode: nodes,
    Drawable: drawables,
  };
  const entries: ZipEntry[] = [];
  entries.push({ name: `${slug(project.name)}.moc3.json`, data: strToBytes(JSON.stringify(moc3, null, 2)) });
  project.animations.forEach((a) => {
    const mtn = clipToMotion(a, project.nodes);
    entries.push({ name: `mtn/${slug(a.name)}.mtn.json`, data: strToBytes(JSON.stringify(mtn, null, 2)) });
  });
  project.layers.forEach((l, i) => {
    const fname = `textures/${i.toString().padStart(2, "0")}_${slug(l.name)}.png`;
    if (l.pngDataUrl.startsWith("data:image")) {
      entries.push({ name: fname, data: dataUrlToBytes(l.pngDataUrl) });
    }
  });
  entries.push({
    name: "README.json",
    data: strToBytes(
      JSON.stringify(
        {
          format: "mochi-live.cubism3-bundle",
          version: 1,
          generatedAt: new Date().toISOString(),
          project: project.name,
          counts: {
            layers: project.layers.length,
            nodes: project.nodes.length,
            animations: project.animations.length,
          },
        },
        null,
        2
      )
    ),
  });
  downloadZip(entries, `${slug(project.name)}_live2d.zip`);
};

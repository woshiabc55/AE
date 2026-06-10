/**
 * 动画预览渲染：根据关键帧状态把图层画到 canvas 上
 */
import type { AnimationClip, Layer, MeshNode } from "@/types";
import { sampleClip } from "@/engine/animator/template";

export interface RenderedFrame {
  time: number;
  layerTransforms: Record<string, { dx: number; dy: number; rot: number; scale: number }>;
}

export const computeFrame = (
  clip: AnimationClip,
  nodes: MeshNode[],
  layers: Layer[],
  time: number
): RenderedFrame => {
  const states = sampleClip(clip, nodes, time);
  const transforms: Record<string, { dx: number; dy: number; rot: number; scale: number }> = {};
  layers.forEach((l) => {
    const boundNode = nodes.find((n) => n.boundLayerId === l.id);
    if (!boundNode) {
      transforms[l.id] = { dx: 0, dy: 0, rot: 0, scale: 1 };
      return;
    }
    const st = states[boundNode.id] ?? { x: 0, y: 0, rotation: 0, scale: 1 };
    // 节点 x/y 是 0~1 归一化，乘以画布宽度再转换
    transforms[l.id] = {
      dx: st.x,
      dy: st.y,
      rot: st.rotation,
      scale: st.scale,
    };
  });
  return { time, layerTransforms: transforms };
};

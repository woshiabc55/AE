import type { SvgLayer, SvgProjectData, SvgTrack } from '@/types';
import { sampleKeyframes } from '@/engine/easing';

// 给定一个 layer 和当前时间,返回实时计算后的属性(用于渲染)
export interface ResolvedTransform {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export function resolveTransform(layer: SvgLayer, tracks: SvgTrack[], time: number): ResolvedTransform {
  const base: ResolvedTransform = {
    x: layer.transform.x,
    y: layer.transform.y,
    rotate: layer.transform.rotate,
    scaleX: layer.transform.scaleX,
    scaleY: layer.transform.scaleY,
    opacity: layer.transform.opacity,
  };
  for (const track of tracks) {
    if (track.layerId !== layer.id) continue;
    const v = sampleKeyframes(track.keyframes, time);
    if (v === undefined) continue;
    if (track.property === 'x') base.x = Number(v);
    else if (track.property === 'y') base.y = Number(v);
    else if (track.property === 'rotate') base.rotate = Number(v);
    else if (track.property === 'scaleX') base.scaleX = Number(v);
    else if (track.property === 'scaleY') base.scaleY = Number(v);
    else if (track.property === 'opacity') base.opacity = Number(v);
  }
  return base;
}

export function resolveFill(layer: SvgLayer, tracks: SvgTrack[], time: number): string {
  for (const track of tracks) {
    if (track.layerId !== layer.id || track.property !== 'fill') continue;
    const v = sampleKeyframes(track.keyframes, time);
    if (typeof v === 'string') return v;
  }
  return String(layer.style.fill ?? '#7CF9FF');
}

export function resolveD(layer: SvgLayer, tracks: SvgTrack[], time: number): string | undefined {
  for (const track of tracks) {
    if (track.layerId !== layer.id || track.property !== 'd') continue;
    const v = sampleKeyframes(track.keyframes, time);
    if (typeof v === 'string') return v;
  }
  return layer.d;
}

// 将图层 + 实时变换 渲染为 SVG 元素
export function renderLayer(layer: SvgLayer, t: ResolvedTransform, data: SvgProjectData, tracks: SvgTrack[]): JSX.Element {
  const fill = resolveFill(layer, tracks, 0);
  const baseStyle = { ...layer.style, fill };
  const transform = `translate(${t.x} ${t.y}) rotate(${t.rotate}) scale(${t.scaleX} ${t.scaleY})`;
  const opacity = t.opacity;
  const common = {
    style: { ...baseStyle, opacity, transformOrigin: 'center' } as React.CSSProperties,
    transform,
  };
  switch (layer.kind) {
    case 'rect': {
      const { x = 0, y = 0, width = 100, height = 100, rx = 0 } = layer.attrs as Record<string, number>;
      return (
        <rect
          key={layer.id}
          x={x}
          y={y}
          width={width}
          height={height}
          rx={rx}
          transform={transform}
          style={{ ...baseStyle, opacity }}
        />
      );
    }
    case 'circle': {
      const { cx = 0, cy = 0, r = 50 } = layer.attrs as Record<string, number>;
      return (
        <circle
          key={layer.id}
          cx={cx}
          cy={cy}
          r={r}
          transform={transform}
          style={{ ...baseStyle, opacity }}
        />
      );
    }
    case 'ellipse': {
      const { cx = 0, cy = 0, rx = 60, ry = 30 } = layer.attrs as Record<string, number>;
      return (
        <ellipse
          key={layer.id}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={transform}
          style={{ ...baseStyle, opacity }}
        />
      );
    }
    case 'path': {
      const d = resolveD(layer, tracks, 0) || 'M 0 0 L 100 100';
      return (
        <path
          key={layer.id}
          d={d}
          transform={transform}
          style={{ ...baseStyle, opacity }}
        />
      );
    }
    case 'text': {
      const { x = 0, y = 0, fontSize = 32 } = layer.attrs as Record<string, number>;
      return (
        <text
          key={layer.id}
          x={x}
          y={y}
          fontSize={fontSize}
          fontFamily='"Space Grotesk", "Noto Sans SC", sans-serif'
          transform={transform}
          style={{ ...baseStyle, opacity, fontWeight: 600 }}
        >
          {layer.text || 'Text'}
        </text>
      );
    }
    case 'polygon': {
      const { points = '0,0 100,0 100,100' } = layer.attrs as Record<string, string>;
      return (
        <polygon
          key={layer.id}
          points={points}
          transform={transform}
          style={{ ...baseStyle, opacity }}
        />
      );
    }
    default:
      return <g key={layer.id} />;
  }
}

export function getProjectDuration(data: SvgProjectData): number {
  let max = data.duration;
  for (const t of data.tracks) {
    for (const k of t.keyframes) {
      if (k.time > max) max = k.time;
    }
  }
  return Math.max(max, 1);
}

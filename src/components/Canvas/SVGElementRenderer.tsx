import type { SVGElement as SVGEl, FillStyle, StrokeStyle } from '../../types';

interface Props {
  element: SVGEl;
  isSelected?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  isExtrude?: boolean; // 伪3D 挤压层，不响应交互
}

function resolveFill(fill: FillStyle): string {
  if (fill.type === 'none') return 'none';
  if (fill.type === 'solid') return fill.color;
  return fill.color;
}

function resolveStroke(stroke: StrokeStyle): string {
  return stroke.width > 0 ? stroke.color : 'none';
}

function buildTransform(el: SVGEl): string {
  const { translateX, translateY, rotate, scaleX, scaleY, skewX, skewY, originX, originY } = el.transform;
  const cx = getBBoxCenter(el).cx * originX;
  const cy = getBBoxCenter(el).cy * originY;
  const parts: string[] = [];
  if (translateX !== 0 || translateY !== 0) parts.push(`translate(${translateX},${translateY})`);
  if (rotate !== 0) parts.push(`rotate(${rotate},${cx},${cy})`);
  if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX},${scaleY})`);
  if (skewX !== 0) parts.push(`skewX(${skewX})`);
  if (skewY !== 0) parts.push(`skewY(${skewY})`);
  return parts.length > 0 ? parts.join(' ') : '';
}

function getBBoxCenter(el: SVGEl): { cx: number; cy: number } {
  const a = el.attrs;
  switch (el.type) {
    case 'rect':
      return { cx: (Number(a.x) || 0) + (Number(a.width) || 0) / 2, cy: (Number(a.y) || 0) + (Number(a.height) || 0) / 2 };
    case 'circle':
      return { cx: Number(a.cx) || 0, cy: Number(a.cy) || 0 };
    case 'ellipse':
      return { cx: Number(a.cx) || 0, cy: Number(a.cy) || 0 };
    case 'line':
      return { cx: ((Number(a.x1) || 0) + (Number(a.x2) || 0)) / 2, cy: ((Number(a.y1) || 0) + (Number(a.y2) || 0)) / 2 };
    case 'text':
      return { cx: Number(a.x) || 0, cy: Number(a.y) || 0 };
    case 'image':
      return { cx: (Number(a.x) || 0) + (Number(a.width) || 0) / 2, cy: (Number(a.y) || 0) + (Number(a.height) || 0) / 2 };
    default:
      return { cx: 0, cy: 0 };
  }
}

export function getElementBBox(el: SVGEl): { x: number; y: number; width: number; height: number } {
  const a = el.attrs;
  switch (el.type) {
    case 'rect':
    case 'image': {
      const x = Number(a.x) || 0, y = Number(a.y) || 0;
      return { x, y, width: Number(a.width) || 0, height: Number(a.height) || 0 };
    }
    case 'circle': {
      const cx = Number(a.cx) || 0, cy = Number(a.cy) || 0, r = Number(a.r) || 0;
      return { x: cx - r, y: cy - r, width: r * 2, height: r * 2 };
    }
    case 'ellipse': {
      const cx = Number(a.cx) || 0, cy = Number(a.cy) || 0, rx = Number(a.rx) || 0, ry = Number(a.ry) || 0;
      return { x: cx - rx, y: cy - ry, width: rx * 2, height: ry * 2 };
    }
    case 'line': {
      const x1 = Number(a.x1) || 0, y1 = Number(a.y1) || 0, x2 = Number(a.x2) || 0, y2 = Number(a.y2) || 0;
      const minX = Math.min(x1, x2), minY = Math.min(y1, y2);
      return { x: minX, y: minY, width: Math.abs(x2 - x1) || 1, height: Math.abs(y2 - y1) || 1 };
    }
    case 'text':
      return { x: Number(a.x) || 0, y: (Number(a.y) || 0) - (Number(a.fontSize) || 24), width: 80, height: Number(a.fontSize) || 24 };
    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
}

export default function SVGElementRenderer({ element, isSelected, onSelect, isExtrude }: Props) {
  const a = element.attrs;
  const fill = resolveFill(element.fill);
  const stroke = resolveStroke(element.stroke);
  const strokeWidth = element.stroke.width;
  const strokeDasharray = element.stroke.dasharray;
  const opacity = element.fill.opacity;
  const transform = buildTransform(element);

  const commonProps: Record<string, unknown> = {
    fill,
    stroke,
    strokeWidth,
    strokeDasharray,
    opacity,
    transform: transform || undefined,
    style: isExtrude
      ? { pointerEvents: 'none' }
      : { cursor: isSelected ? 'move' : 'pointer' },
    onClick: isExtrude
      ? undefined
      : (e: React.MouseEvent) => {
          e.stopPropagation();
          onSelect?.(element.id, e);
        },
  };

  switch (element.type) {
    case 'rect':
      return <rect x={a.x} y={a.y} width={a.width} height={a.height} rx={a.rx} {...commonProps} />;
    case 'circle':
      return <circle cx={a.cx} cy={a.cy} r={a.r} {...commonProps} />;
    case 'ellipse':
      return <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} {...commonProps} />;
    case 'line':
      return <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} {...commonProps} />;
    case 'path':
      return <path d={String(a.d ?? '')} {...commonProps} />;
    case 'text':
      return (
        <text x={a.x} y={a.y} fontSize={a.fontSize} fontFamily="IBM Plex Sans, sans-serif" {...commonProps}>
          {String(a.textContent || '')}
        </text>
      );
    case 'image':
      return (
        <image
          x={a.x}
          y={a.y}
          width={a.width}
          height={a.height}
          href={String(a.href || '')}
          preserveAspectRatio="xMidYMid slice"
          {...commonProps}
        />
      );
    default:
      return null;
  }
}

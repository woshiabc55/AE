import type { SVGElement as SVGEl } from '../../types';
import { getElementBBox } from './SVGElementRenderer';

interface Props {
  element: SVGEl;
  zoom: number;
}

const HANDLE_SIZE = 7;

export default function SelectionBox({ element, zoom }: Props) {
  const { x, y, width, height } = getElementBBox(element);
  const hs = HANDLE_SIZE / zoom;

  const half = hs / 2;
  const positions = [
    { x: x - half, y: y - half }, // tl
    { x: x + width / 2 - half, y: y - half }, // t
    { x: x + width - half, y: y - half }, // tr
    { x: x + width - half, y: y + height / 2 - half }, // r
    { x: x + width - half, y: y + height - half }, // br
    { x: x + width / 2 - half, y: y + height - half }, // b
    { x: x - half, y: y + height - half }, // bl
    { x: x - half, y: y + height / 2 - half }, // l
  ];

  return (
    <g pointerEvents="none">
      {/* 外框 - 虚线 */}
      <rect
        x={x} y={y}
        width={width} height={height}
        fill="none"
        stroke="#00e5ff"
        strokeWidth={1.2 / zoom}
        strokeDasharray={`${6 / zoom} ${3 / zoom}`}
        opacity={0.9}
        style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.5))' }}
      />

      {/* 8个手柄 - 3D 球体效果 */}
      {positions.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x + 1 / zoom}
            y={p.y + 1 / zoom}
            width={hs}
            height={hs}
            rx={1.5 / zoom}
            fill="rgba(0,0,0,0.4)"
          />
          <rect
            x={p.x}
            y={p.y}
            width={hs}
            height={hs}
            rx={1.5 / zoom}
            fill="#1a1d27"
            stroke="#00e5ff"
            strokeWidth={1 / zoom}
          />
          <rect
            x={p.x}
            y={p.y}
            width={hs}
            height={hs / 2}
            rx={1.5 / zoom}
            fill="rgba(255,255,255,0.12)"
          />
        </g>
      ))}
    </g>
  );
}

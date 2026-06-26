import type { SVGElement as SVGEl } from '../../types';
import { getElementBBox } from './SVGElementRenderer';

interface Props {
  element: SVGEl;
  zoom: number;
}

const HANDLE_SIZE = 8;
const HANDLE_OFFSET = HANDLE_SIZE / 2;

// 8 个手柄位置: 四角 + 四边中点
const HANDLE_POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
] as const;

type HandlePos = (typeof HANDLE_POSITIONS)[number];

function getHandleCoords(pos: HandlePos, bbox: { x: number; y: number; width: number; height: number }) {
  const { x, y, width, height } = bbox;
  const mx = x + width / 2, my = y + height / 2;
  switch (pos) {
    case 'top-left': return { cx: x, cy: y };
    case 'top-center': return { cx: mx, cy: y };
    case 'top-right': return { cx: x + width, cy: y };
    case 'middle-left': return { cx: x, cy: my };
    case 'middle-right': return { cx: x + width, cy: my };
    case 'bottom-left': return { cx: x, cy: y + height };
    case 'bottom-center': return { cx: mx, cy: y + height };
    case 'bottom-right': return { cx: x + width, cy: y + height };
  }
}

function getCursorForHandle(pos: HandlePos): string {
  switch (pos) {
    case 'top-left': case 'bottom-right': return 'nwse-resize';
    case 'top-right': case 'bottom-left': return 'nesw-resize';
    case 'top-center': case 'bottom-center': return 'ns-resize';
    case 'middle-left': case 'middle-right': return 'ew-resize';
  }
}

export default function SelectionBox({ element, zoom }: Props) {
  const bbox = getElementBBox(element);
  const scaledHandle = HANDLE_SIZE / zoom;

  return (
    <g>
      {/* 选中虚线边框 */}
      <rect
        x={bbox.x}
        y={bbox.y}
        width={bbox.width}
        height={bbox.height}
        fill="none"
        stroke="#00e5ff"
        strokeWidth={1.5 / zoom}
        strokeDasharray={`${6 / zoom} ${3 / zoom}`}
        pointerEvents="none"
      />

      {/* 8 个缩放手柄 */}
      {HANDLE_POSITIONS.map((pos) => {
        const { cx, cy } = getHandleCoords(pos, bbox);
        return (
          <rect
            key={pos}
            x={cx - scaledHandle / 2}
            y={cy - scaledHandle / 2}
            width={scaledHandle}
            height={scaledHandle}
            fill="#0f1117"
            stroke="#00e5ff"
            strokeWidth={1.5 / zoom}
            style={{ cursor: getCursorForHandle(pos) }}
          />
        );
      })}
    </g>
  );
}

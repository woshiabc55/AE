import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image as ImageIcon, MessageSquare, Volume2, Camera, Clock } from 'lucide-react';
import type { Panel } from '@/lib/types';
import { SHOT_TYPE_LABELS, CAMERA_MOVE_LABELS } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

type Props = {
  panel: Panel;
  index: number;
  selected: boolean;
  color: string;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

export default function PanelCard({ panel, index, selected, color, onSelect, onDelete, onDuplicate }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: panel.id,
  });
  const [confirmDel, setConfirmDel] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={[
        'group relative card overflow-hidden transition-all animate-slideUp cursor-pointer',
        selected ? 'ring-2 ring-ink-900 shadow-paper' : 'hover:shadow-paper hover:-translate-y-0.5',
      ].join(' ')}
    >
      {/* 顶部编号 + 景别条 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-ink-900/10">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="text-ink-400 hover:text-ink-900 cursor-grab active:cursor-grabbing p-0.5 -ml-1"
            aria-label="拖拽重排"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span
            className="serif text-lg font-semibold leading-none"
            style={{ color }}
          >
            №{(index + 1).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider">
          <span className="tag" style={{ color }}>{panel.shotType}</span>
          <span className="tag text-ink-500">{panel.cameraMove.toUpperCase()}</span>
        </div>
      </div>

      {/* 画面占位 */}
      <div className="relative aspect-[4/3] bg-paper-200 overflow-hidden">
        {panel.imageUrl ? (
          <img
            src={panel.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-400 gap-1.5">
            <ImageIcon className="w-7 h-7" strokeWidth={1.25} />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase">No Frame</span>
          </div>
        )}
        {/* 装饰边框 */}
        <div className="absolute inset-2 border border-ink-900/10 pointer-events-none" />
      </div>

      {/* 描述 */}
      <div className="px-3.5 py-3 space-y-2">
        <p className="text-sm text-ink-900 leading-relaxed line-clamp-3 min-h-[3.6em]">
          {panel.description || <span className="text-ink-400 italic">未填写画面描述...</span>}
        </p>

        {/* 元数据行 */}
        <div className="flex items-center gap-3 text-[10px] text-ink-500 font-mono tracking-wider">
          {panel.dialogue && (
            <span className="flex items-center gap-1 truncate">
              <MessageSquare className="w-3 h-3" />
              <span className="truncate max-w-[120px]">"{panel.dialogue}"</span>
            </span>
          )}
          {panel.sound && (
            <span className="flex items-center gap-1 truncate">
              <Volume2 className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{panel.sound}</span>
            </span>
          )}
        </div>

        {/* 底部条 */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-ink-900/15">
          <div className="flex items-center gap-1 text-[10px] text-ink-500 font-mono">
            <Camera className="w-3 h-3" />
            {SHOT_TYPE_LABELS[panel.shotType]}
            <span className="text-ink-400/40">·</span>
            {CAMERA_MOVE_LABELS[panel.cameraMove]}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-ink-500 font-mono num">
            <Clock className="w-3 h-3" />
            {formatDuration(panel.duration)}
          </div>
        </div>
      </div>

      {/* 悬浮操作 */}
      <div
        className={[
          'absolute right-2 top-2 flex items-center gap-1 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <SmallBtn title="复制" onClick={onDuplicate}>⎘</SmallBtn>
        <SmallBtn
          title="删除"
          danger
          onClick={() => {
            if (confirmDel) {
              onDelete();
            } else {
              setConfirmDel(true);
              setTimeout(() => setConfirmDel(false), 2000);
            }
          }}
        >
          {confirmDel ? '?' : '×'}
        </SmallBtn>
      </div>
    </div>
  );
}

function SmallBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        'w-6 h-6 rounded-sm border text-xs flex items-center justify-center transition-colors backdrop-blur-sm',
        danger
          ? 'border-ink-900/30 bg-paper-50/90 text-ink-500 hover:bg-oxblood-500 hover:text-paper-50 hover:border-oxblood-500'
          : 'border-ink-900/30 bg-paper-50/90 text-ink-500 hover:bg-ink-900 hover:text-paper-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

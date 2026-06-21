// 作品卡片

import { Trash2, Download, FolderOpen } from "lucide-react";
import type { ArtworkRecord } from "@/types";
import { PixelButton } from "@/components/common/PixelButton";

interface ArtworkCardProps {
  artwork: ArtworkRecord;
  onLoad: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function ArtworkCard({ artwork, onLoad, onDelete, onExport }: ArtworkCardProps) {
  const date = new Date(artwork.updatedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div className="bg-ink-800/80 border border-ink-600/60 rounded-xl overflow-hidden hover:border-ember-500/50 transition-all duration-200 group">
      {/* 缩略图 */}
      <div className="relative aspect-square bg-ink-900 overflow-hidden">
        {artwork.thumbnail ? (
          <img
            src={artwork.thumbnail}
            alt={artwork.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-500 text-xs font-mono">
            无预览
          </div>
        )}
        <div className="absolute top-2 right-2 bg-ink-900/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-ember-400">
          {artwork.gridSize}×{artwork.gridSize}
        </div>
      </div>

      {/* 信息 */}
      <div className="p-3">
        <div className="font-mono text-sm text-ink-100 truncate">{artwork.name}</div>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-ink-400 font-mono">
          <span>{dateStr}</span>
          <span>·</span>
          <span>{artwork.pixels.length} 豆</span>
          {artwork.skeleton.joints.length > 0 && (
            <>
              <span>·</span>
              <span>{artwork.skeleton.joints.length} 关节</span>
            </>
          )}
          {artwork.keyframes.length > 0 && (
            <>
              <span>·</span>
              <span>{artwork.keyframes.length} 帧</span>
            </>
          )}
        </div>

        {/* 操作 */}
        <div className="flex gap-1.5 mt-3">
          <PixelButton variant="mint" size="sm" className="flex-1" onClick={onLoad}>
            <span className="flex items-center justify-center gap-1">
              <FolderOpen size={12} />
              加载
            </span>
          </PixelButton>
          <PixelButton variant="ghost" size="sm" onClick={onExport} title="导出 JSON">
            <Download size={12} />
          </PixelButton>
          <PixelButton variant="ghost" size="sm" onClick={onDelete} title="删除">
            <Trash2 size={12} />
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

// 作品列表

import { useEffect, useState } from "react";
import { Plus, Upload, RefreshCw, FolderOpen } from "lucide-react";
import type { ArtworkRecord } from "@/types";
import { listArtworks, deleteArtwork, saveArtwork, exportArtwork, importArtwork } from "@/db/artworkRepo";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useUIStore } from "@/store/useUIStore";
import { ArtworkCard } from "./ArtworkCard";
import { PixelButton } from "@/components/common/PixelButton";

export function ArtworkList() {
  const [artworks, setArtworks] = useState<ArtworkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArtwork = useArtworkStore((s) => s.loadArtwork);
  const setShowGallery = useUIStore((s) => s.setShowGallery);
  const newArtwork = useArtworkStore((s) => s.newArtwork);

  const refresh = async () => {
    setLoading(true);
    const list = await listArtworks();
    setArtworks(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLoad = (artwork: ArtworkRecord) => {
    loadArtwork(artwork);
    setShowGallery(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这个作品？此操作不可撤销。")) return;
    await deleteArtwork(id);
    refresh();
  };

  const handleExport = (artwork: ArtworkRecord) => {
    const json = exportArtwork(artwork);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artwork.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const record = importArtwork(text);
        // 重新生成 ID 避免冲突
        record.id = `art_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        record.createdAt = Date.now();
        record.updatedAt = Date.now();
        await saveArtwork(record);
        refresh();
      } catch (err) {
        alert("导入失败：" + (err as Error).message);
      }
    };
    input.click();
  };

  const handleNew = () => {
    newArtwork();
    setShowGallery(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/95 backdrop-blur-md flex flex-col animate-fade-in">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600/60">
        <div className="flex items-center gap-3">
          <FolderOpen className="text-ember-400" size={24} />
          <h2 className="font-pixel text-sm text-ink-100 tracking-wider">作品存档</h2>
          <span className="font-mono text-xs text-ink-400">({artworks.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <PixelButton variant="ghost" size="sm" onClick={refresh}>
            <span className="flex items-center gap-1.5">
              <RefreshCw size={12} />
              刷新
            </span>
          </PixelButton>
          <PixelButton variant="ghost" size="sm" onClick={handleImport}>
            <span className="flex items-center gap-1.5">
              <Upload size={12} />
              导入
            </span>
          </PixelButton>
          <PixelButton variant="mint" size="sm" onClick={handleNew}>
            <span className="flex items-center gap-1.5">
              <Plus size={12} />
              新建
            </span>
          </PixelButton>
          <PixelButton variant="ghost" size="sm" onClick={() => setShowGallery(false)}>
            关闭
          </PixelButton>
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-ink-400 font-mono text-sm">
            加载中...
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-24 h-24 rounded-2xl bg-ink-800 border-2 border-dashed border-ink-600 flex items-center justify-center">
              <FolderOpen size={40} className="text-ink-500" />
            </div>
            <div className="text-center">
              <div className="font-pixel text-xs text-ink-300 mb-2">还没有作品</div>
              <div className="font-mono text-xs text-ink-500">
                点击「新建」开始创作你的第一个拼豆角色
              </div>
            </div>
            <PixelButton variant="primary" size="md" onClick={handleNew}>
              <span className="flex items-center gap-2">
                <Plus size={16} />
                创建第一个作品
              </span>
            </PixelButton>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onLoad={() => handleLoad(artwork)}
                onDelete={() => handleDelete(artwork.id)}
                onExport={() => handleExport(artwork)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

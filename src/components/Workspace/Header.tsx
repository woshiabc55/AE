// 顶部栏

import { useState } from "react";
import { Save, FolderOpen, FilePlus2, Circle, Gamepad2 } from "lucide-react";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useUIStore } from "@/store/useUIStore";
import { ModeSwitcher } from "@/components/Workspace/ModeSwitcher";
import { useNavigate } from "react-router-dom";
import { PixelButton } from "@/components/common/PixelButton";
import { generateThumbnail } from "@/engine/renderer";
import { saveArtwork } from "@/db/artworkRepo";
import { cn } from "@/lib/utils";

export function Header() {
  const name = useArtworkStore((s) => s.name);
  const setName = useArtworkStore((s) => s.setName);
  const dirty = useArtworkStore((s) => s.dirty);
  const toRecord = useArtworkStore((s) => s.toRecord);
  const markSaved = useArtworkStore((s) => s.markSaved);
  const newArtwork = useArtworkStore((s) => s.newArtwork);
  const setShowGallery = useUIStore((s) => s.setShowGallery);

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    try {
      const pixels = useArtworkStore.getState().pixels;
      const gridSize = useArtworkStore.getState().gridSize;
      const thumbnail = generateThumbnail(pixels, gridSize, 160);
      const record = toRecord(thumbnail);
      await saveArtwork(record);
      markSaved();
    } catch (err) {
      alert("保存失败：" + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-3 bg-ink-800/90 backdrop-blur-md border-b border-ink-600/60">
      {/* 左：Logo + 名称 */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center shadow-glow">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ink-900" />
              <div className="w-1.5 h-1.5 rounded-full bg-ink-900" />
              <div className="w-1.5 h-1.5 rounded-full bg-ink-900" />
              <div className="w-1.5 h-1.5 rounded-full bg-ink-900" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="font-pixel text-[10px] text-ember-400 text-glow-ember leading-none">
              PERLER BEAD
            </div>
            <div className="font-pixel text-[10px] text-ink-200 leading-none mt-0.5">
              半面工坊
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-ink-600/60" />

        <div className="flex items-center gap-2 min-w-0">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-ink-600 focus:border-ember-500 focus:outline-none px-1 py-1 font-mono text-sm text-ink-100 min-w-0 max-w-[200px]"
            placeholder="作品名称"
          />
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-mono",
              dirty ? "text-sun-500" : "text-mint-500",
            )}
          >
            <Circle size={8} className={cn(dirty ? "fill-sun-500" : "fill-mint-500")} />
            {dirty ? "未保存" : "已保存"}
          </span>
        </div>
      </div>

      {/* 中：模式切换 */}
      <ModeSwitcher />

      {/* 右：操作 */}
      <div className="flex items-center gap-2">
        <PixelButton variant="ghost" size="sm" onClick={() => navigate("/minecraft")}>
          <span className="flex items-center gap-1.5">
            <Gamepad2 size={14} />
            <span className="hidden sm:inline">我的世界</span>
          </span>
        </PixelButton>
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => {
            if (dirty && !confirm("当前作品未保存，确定新建？")) return;
            newArtwork();
          }}
        >
          <span className="flex items-center gap-1.5">
            <FilePlus2 size={14} />
            <span className="hidden sm:inline">新建</span>
          </span>
        </PixelButton>
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => setShowGallery(true)}
        >
          <span className="flex items-center gap-1.5">
            <FolderOpen size={14} />
            <span className="hidden sm:inline">存档</span>
          </span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          <span className="flex items-center gap-1.5">
            <Save size={14} />
            <span className="hidden sm:inline">{saving ? "保存中..." : "保存"}</span>
          </span>
        </PixelButton>
      </div>
    </header>
  );
}

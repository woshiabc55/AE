// 快捷键帮助面板
import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useShortcuts } from "@/hooks/useShortcuts";
import { cn } from "@/utils/format";

interface ShortcutItem {
  combo: string;
  description: string;
  category: "全局" | "Studio" | "Library";
}

const SHORTCUTS: ShortcutItem[] = [
  { combo: "Mod+K", description: "打开 / 关闭命令面板", category: "全局" },
  { combo: "Mod+S", description: "保存当前模板", category: "Studio" },
  { combo: "Mod+Shift+S", description: "保存为新版本快照", category: "Studio" },
  { combo: "Mod+Enter", description: "开拍 / 发送评论", category: "Studio" },
  { combo: "Mod+/", description: "打开 / 关闭快捷键帮助", category: "全局" },
  { combo: "Esc", description: "关闭弹窗 / 退出全屏", category: "全局" },
  { combo: "↑ / ↓", description: "在命令面板中上下选择", category: "Library" },
  { combo: "↵", description: "在命令面板中确认选择", category: "Library" },
];

export function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  useShortcuts([
    {
      combo: "Mod+/",
      description: "快捷键帮助",
      handler: () => setOpen((s) => !s),
    },
  ]);
  // 阻止冒泡到全局
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.stopPropagation();
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  }, [open]);

  const groups = ["全局", "Studio", "Library"] as const;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 panel p-2 hover:border-amber text-ink-300 hover:text-amber transition-colors"
        aria-label="快捷键帮助"
        title="快捷键 (⌘/)"
      >
        <Keyboard size={14} />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="键盘快捷键"
        subtitle="按 ⌘/ 在任何页面打开"
        size="md"
      >
        <div className="p-5 space-y-5">
          {groups.map((g) => (
            <div key={g}>
              <div className="label-overline mb-2">▸ {g}</div>
              <div className="panel divide-y divide-ink-700">
                {SHORTCUTS.filter((s) => s.category === g).map((s) => (
                  <div
                    key={s.combo}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <span className="font-serif text-[14px] text-paper-100">
                      {s.description}
                    </span>
                    <kbd className="font-mono text-[10.5px] uppercase tracking-widest2 px-2 py-1 border border-ink-500 text-amber bg-ink-900">
                      {s.combo}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

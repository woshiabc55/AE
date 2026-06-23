// 键盘快捷键

import { useEffect } from "react";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useToolStore } from "@/store/useToolStore";
import { useUIStore } from "@/store/useUIStore";

export function useKeyboardShortcuts() {
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);
  const rigTool = useUIStore((s) => s.rigTool);
  const setRigTool = useUIStore((s) => s.setRigTool);
  const tool = useToolStore((s) => s.tool);
  const setTool = useToolStore((s) => s.setTool);
  const undo = useArtworkStore((s) => s.undo);
  const redo = useArtworkStore((s) => s.redo);
  const canUndo = useArtworkStore((s) => s.canUndo);
  const canRedo = useArtworkStore((s) => s.canRedo);
  const addLayer = useArtworkStore((s) => s.addLayer);
  const clearGrid = useArtworkStore((s) => s.clearGrid);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 输入框内不处理快捷键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      // 撤销/重做
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // 模式切换
      if (e.key === "1") {
        setMode("draw");
        return;
      }
      if (e.key === "2") {
        setMode("rig");
        return;
      }
      if (e.key === "3") {
        setMode("animate");
        return;
      }

      // 绘制工具切换（仅在 draw 模式）
      if (mode === "draw") {
        if (e.key === "p" || e.key === "P") {
          setTool("brush");
          return;
        }
        if (e.key === "e" || e.key === "E") {
          setTool("eraser");
          return;
        }
        if (e.key === "g" || e.key === "G") {
          setTool("fill");
          return;
        }
        if (e.key === "i" || e.key === "I") {
          setTool("picker");
          return;
        }
        if (ctrl && e.key === "n") {
          e.preventDefault();
          addLayer();
          return;
        }
        if (e.key === "Delete" && ctrl) {
          clearGrid();
          return;
        }
      }

      // 骨架工具切换（仅在 rig 模式）
      if (mode === "rig") {
        if (e.key === "a" || e.key === "A") {
          setRigTool("add");
          return;
        }
        if (e.key === "c" || e.key === "C") {
          setRigTool("connect");
          return;
        }
        if (e.key === "m" || e.key === "M") {
          setRigTool("move");
          return;
        }
        if (e.key === "s" || e.key === "S") {
          setRigTool("assign");
          return;
        }
        if (e.key === "t" || e.key === "T") {
          setRigTool("stretch");
          return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    mode,
    tool,
    rigTool,
    setMode,
    setTool,
    setRigTool,
    undo,
    redo,
    canUndo,
    canRedo,
    addLayer,
    clearGrid,
  ]);
}
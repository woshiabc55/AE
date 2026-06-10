// 键盘快捷键 hook
import { useEffect } from "react";

export interface Shortcut {
  combo: string; // e.g. "Mod+S", "Mod+K", "Shift+?"
  description: string;
  handler: (e: KeyboardEvent) => void;
  allowInInputs?: boolean;
}

function match(e: KeyboardEvent, combo: string): boolean {
  const parts = combo.split("+").map((p) => p.trim());
  const key = parts[parts.length - 1].toLowerCase();
  const wantMod = parts.includes("Mod") || parts.includes("CmdOrCtrl");
  const wantShift = parts.includes("Shift");
  const wantAlt = parts.includes("Alt");
  const hasMod = e.metaKey || e.ctrlKey;
  if (wantMod !== hasMod) return false;
  if (wantShift !== e.shiftKey) return false;
  if (wantAlt !== e.altKey) return false;
  if (e.key.toLowerCase() !== key) return false;
  return true;
}

export function useShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        if (match(e, s.combo)) {
          if (!s.allowInInputs) {
            const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea") continue;
          }
          e.preventDefault();
          s.handler(e);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);
}

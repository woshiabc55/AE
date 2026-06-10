// 网络状态指示器 + 离线检测
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/format";

export function useOnline() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  useEffect(() => {
    const onUp = () => setOnline(true);
    const onDown = () => setOnline(false);
    window.addEventListener("online", onUp);
    window.addEventListener("offline", onDown);
    return () => {
      window.removeEventListener("online", onUp);
      window.removeEventListener("offline", onDown);
    };
  }, []);
  return online;
}

export function NetworkStatus() {
  const online = useOnline();
  const [justOnline, setJustOnline] = useState(false);
  useEffect(() => {
    if (online) {
      setJustOnline(true);
      const t = setTimeout(() => setJustOnline(false), 2200);
      return () => clearTimeout(t);
    }
  }, [online]);

  return (
    <div
      className="fixed top-12 left-1/2 -translate-x-1/2 z-[80] pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {!online && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="panel border-reel bg-ink-900 px-4 py-2 flex items-center gap-2 shadow-[0_20px_60px_-20px_rgba(200,16,46,0.5)]"
            role="status"
          >
            <WifiOff size={13} className="text-reel" />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-reel">
              离线模式 · 你的更改已暂存本地
            </span>
          </motion.div>
        )}
        {online && justOnline && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="panel border-amber bg-ink-900 px-4 py-2 flex items-center gap-2"
          >
            <Wifi size={13} className="text-amber" />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
              网络已恢复
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 极小的角落小点
export function NetworkDot() {
  const online = useOnline();
  return (
    <span
      className={cn(
        "w-1.5 h-1.5 rounded-full transition-colors",
        online ? "bg-amber animate-pulse" : "bg-reel"
      )}
      title={online ? "在线" : "离线"}
      aria-label={online ? "在线" : "离线"}
    />
  );
}

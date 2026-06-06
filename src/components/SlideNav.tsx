import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { shots } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface SlideNavProps {
  activeShotId: ShotId;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
}

// PPT 风格的左右翻页箭头 + 计数
export default function SlideNav({ activeShotId, onPrev, onNext, onFirst, onLast }: SlideNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const idx = shots.findIndex((s) => s.id === activeShotId);
  const isFirst = idx === 0;
  const isLast = idx === shots.length - 1;
  const shotNumber = idx + 1;
  const total = shots.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-16 left-0 right-0 z-30 pointer-events-none"
    >
      <div className="px-12 flex items-center justify-between">
        {/* 左侧 — 上一页 */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onFirst}
            disabled={isFirst}
            className="nav-arrow !w-8 !h-8"
            title="First slide"
          >
            <div className="flex">
              <ChevronLeft className="w-3 h-3" />
              <ChevronLeft className="w-3 h-3 -ml-2" />
            </div>
          </button>
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="nav-arrow group"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* 中间 — 计数器 */}
        <div className="flex items-center gap-3 pointer-events-auto bg-abyss/80 backdrop-blur-sm border border-bone/15 px-4 py-1.5">
          <span className="font-mono text-[10px] text-fog tracking-widest">SLIDE</span>
          <span className="numeral text-bone text-lg">
            {String(shotNumber).padStart(2, "0")}
          </span>
          <span className="text-fog/40">/</span>
          <span className="font-mono text-xs text-fog">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* 右侧 — 下一页 */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onNext}
            disabled={isLast}
            className="nav-arrow group"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={onLast}
            disabled={isLast}
            className="nav-arrow !w-8 !h-8"
            title="Last slide"
          >
            <div className="flex">
              <ChevronRight className="w-3 h-3" />
              <ChevronRight className="w-3 h-3 -ml-2" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { shots } from "@/data/shots";

interface DepthRulerProps {
  activeShotId: string;
}

export default function DepthRuler({ activeShotId }: DepthRulerProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Calculate camera position in depth
  const getCameraDepth = (): number => {
    const idx = shots.findIndex((s) => s.id === activeShotId);
    if (idx === -1) return 0;
    return shots[idx].depth;
  };

  const cameraDepth = getCameraDepth();
  const maxDepth = 3800;

  // Map depth to vertical position (0 = top, 1 = bottom)
  const cameraY = cameraDepth < 0 ? Math.min(1, Math.abs(cameraDepth) / maxDepth) * 0.85 + 0.1 : 0.1;

  // Scale the ruler so deepest point is at bottom
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center"
      style={{ height: "70vh" }}
    >
      {/* Top label */}
      <div className="font-mono text-[9px] text-fog/60 tracking-widest mb-2 vertical">SURFACE · 0m</div>

      {/* The ruler line */}
      <div className="relative w-px flex-1 depth-bar">
        {/* Shot markers */}
        {shots.map((shot) => {
          const yPct = shot.depth < 0 ? (Math.abs(shot.depth) / maxDepth) * 100 : (shot.altitude ? 0 : 0);
          return (
            <div
              key={shot.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${yPct}%` }}
            >
              <div
                className={`w-3 h-3 -ml-[5px] rotate-45 border ${
                  shot.id === activeShotId ? "border-blood bg-blood" : "border-fog/50 bg-abyss"
                } transition-colors`}
              />
              <div
                className={`absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest whitespace-nowrap ${
                  shot.id === activeShotId ? "text-blood" : "text-fog/50"
                }`}
              >
                {shot.index} · {shot.depth}m
              </div>
            </div>
          );
        })}

        {/* Camera position indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-5 h-5"
          style={{ top: `${cameraY * 100}%` }}
          animate={{ top: `${cameraY * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 rounded-full bg-bone shadow-[0_0_12px_rgba(232,232,232,0.6)]" />
          <div className="absolute inset-0 rounded-full border border-bone/40 animate-ping" />
        </motion.div>

        {/* Camera label */}
        <div
          className="absolute -left-16 font-mono text-[9px] text-bone tracking-widest"
          style={{ top: `${cameraY * 100}%`, transform: "translateY(-50%)" }}
        >
          ◀ CAM
        </div>
      </div>

      {/* Bottom label */}
      <div className="font-mono text-[9px] text-fog/60 tracking-widest mt-2 vertical">MARIANA · -3800m</div>
    </motion.aside>
  );
}

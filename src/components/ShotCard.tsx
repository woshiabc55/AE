import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Shot, LayerKey } from "@/data/shots";
import ShotCanvas from "./ShotCanvas";

interface ShotCardProps {
  shot: Shot;
  isActive: boolean;
  layer: LayerKey;
  onEnter: () => void;
}

export default function ShotCard({ shot, isActive, layer, onEnter }: ShotCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          onEnter();
        }
      },
      { threshold: [0, 0.5, 0.9] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onEnter]);

  return (
    <section
      ref={ref}
      id={shot.id}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Canvas on left ~60% */}
      <div className="absolute inset-0 lg:left-0 lg:right-[44%]">
        <ShotCanvas shot={shot} isActive={isActive} />
      </div>

      {/* Right info panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[44%] flex flex-col justify-center px-8 lg:px-12 bg-gradient-to-l from-abyss via-abyss/95 to-transparent">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Shot number block */}
          <div className="flex items-baseline gap-6">
            <div className="numeral text-[140px] leading-none" style={{ color: shot.palette.accent }}>
              {shot.index}
            </div>
            <div className="flex-1">
              <div className="label">SHOT</div>
              <div className="font-mono text-bone text-sm tracking-widest mt-1">
                {shot.timecode.start} — {shot.timecode.end}
              </div>
              <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
                DURATION · {shot.timecode.duration}s
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl text-bone tracking-wide">
              {shot.title}
            </h2>
            <div className="font-mono text-fog text-xs tracking-[0.3em] mt-1">
              {shot.subtitle}
            </div>
          </div>

          {/* Layer content */}
          <LayerContent shot={shot} layer={layer} />

          {/* Camera note */}
          <div className="pt-4 border-t border-bone/10">
            <div className="label">CAMERA NOTE</div>
            <div className="font-serif text-bone/70 text-sm mt-2 leading-relaxed">
              {shot.cameraNote}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shot motif vertical on far right */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 vertical text-fog/20 numeral text-[60px] hidden lg:block">
        {shot.motif}
      </div>
    </section>
  );
}

function LayerContent({ shot, layer }: { shot: Shot; layer: LayerKey }) {
  const data = {
    narrative: shot.visual,
    camera: [shot.shotSize, shot.movement, shot.focalNote, shot.lighting.from + " → " + shot.lighting.to],
    audio: shot.audio,
    vfx: [...shot.vfx, shot.motionBlur],
  }[layer];

  const heading = {
    narrative: "画面内容",
    camera: "镜头规格",
    audio: "音效设计",
    vfx: "特效与运动模糊",
  }[layer];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-1 h-1 rounded-full" style={{ background: shot.palette.accent }} />
        <span className="label">{heading}</span>
      </div>
      <ul className="space-y-2 font-serif text-bone/80 text-sm leading-relaxed">
        {data.map((line, i) => (
          <motion.li
            key={`${shot.id}-${layer}-${i}`}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex gap-3"
          >
            <span className="font-mono text-[10px] text-fog/50 mt-1 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{line}</span>
          </motion.li>
        ))}
      </ul>
      {layer === "camera" && (
        <div className="pt-3 mt-3 border-t border-bone/5 grid grid-cols-2 gap-3 font-mono text-[10px] text-fog/70">
          <Spec k="景别" v={shot.shotSize} />
          <Spec k="运动" v={shot.movement} />
          <Spec k="对焦" v={shot.focalNote} />
          <Spec k="光线" v={shot.lighting.from} />
        </div>
      )}
      {layer === "vfx" && (
        <div className="pt-3 mt-3 border-t border-bone/5">
          <div className="label mb-1">运动模糊</div>
          <div className="font-mono text-[11px] text-bone/70">{shot.motionBlur}</div>
        </div>
      )}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="label">{k}</div>
      <div className="mt-1">{v}</div>
    </div>
  );
}

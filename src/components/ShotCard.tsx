import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Shot, LayerKey } from "@/data/shots";
import ShotCanvas from "./ShotCanvas";
import DotNumber from "./DotNumber";

interface ShotCardProps {
  shot: Shot;
  index: number;
  total: number;
  isActive: boolean;
  layer: LayerKey;
  onEnter: () => void;
}

export default function ShotCard({ shot, index, total, isActive, layer, onEnter }: ShotCardProps) {
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
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 背景点阵 + 暗角 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-50" />
      <div className="absolute inset-0 dot-grid-vignette opacity-70" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/30 to-transparent" />

      {/* PPT 风格 — 顶部条 */}
      <SlideTopBar shot={shot} index={index} total={total} isActive={isActive} />

      {/* PPT 风格 — 左侧栏：shot number + dot matrix */}
      <SlideLeftCol shot={shot} index={index} isActive={isActive} />

      {/* PPT 风格 — 右侧主区：visual + content */}
      <SlideMainArea shot={shot} isActive={isActive} layer={layer} />

      {/* PPT 风格 — 右侧条：场次信息 */}
      <SlideRightCol shot={shot} isActive={isActive} />

      {/* 角落定位标记 */}
      <CornerMarks />
    </section>
  );
}

function SlideTopBar({ shot, index, total, isActive }: { shot: Shot; index: number; total: number; isActive: boolean }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 px-12 py-4 flex items-center justify-between border-b border-bone/8">
      <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blood animate-pulse" : "bg-fog/40"}`} />
          <span className={isActive ? "text-bone" : "text-fog/50"}>深渊恐惧</span>
        </div>
        <span className="text-fog/40">/</span>
        <span className="text-fog">SEQ 21-25</span>
        <span className="text-fog/40">/</span>
        <span className="text-fog">SHOT {String(index).padStart(2, "0")}</span>
      </div>

      <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest">
        <span className="text-fog">TC {shot.timecode.start} – {shot.timecode.end}</span>
        <span className="text-fog/40">|</span>
        <span className="text-bone">{shot.timecode.duration}.00s</span>
        <span className="text-fog/40">|</span>
        <span className="text-fog">IMAX 3D</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="font-mono text-[10px] tracking-widest text-fog">
          {String(index).padStart(2, "0")} <span className="text-fog/40">/</span> {String(total).padStart(2, "0")}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === index - 1 ? "bg-blood w-6" : "bg-fog/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideLeftCol({ shot, index }: { shot: Shot; index: number; isActive: boolean }) {
  return (
    <div className="absolute left-0 top-16 bottom-16 w-72 z-10 px-8 flex flex-col justify-between border-r border-bone/8">
      <div>
        <div className="label">SHOT</div>
        {/* 大号点阵数字 — 镜号 */}
        <div className="mt-3">
          <DotNumber num={String(index)} size={20} onColor={shot.palette.accent} />
        </div>
        <div className="font-mono text-[10px] text-fog/60 tracking-widest mt-2">
          OF 05 SHOTS
        </div>
      </div>

      {/* 中部 — 深度信息 */}
      <div className="space-y-3">
        <div>
          <div className="label">DEPTH</div>
          <div className="numeral text-bone text-2xl mt-1">
            {shot.altitude ? `+${shot.altitude}` : shot.depth}
            <span className="text-sm text-fog/60 ml-1">M</span>
          </div>
        </div>
        <div>
          <div className="label">ZONE</div>
          <div className="font-mono text-xs text-bone/80 tracking-widest mt-1">
            {zoneLabel(shot)}
          </div>
        </div>
      </div>

      {/* 底部 — 镜头标记 */}
      <div>
        <div className="label">MOTIF</div>
        <div
          className="numeral text-4xl mt-2"
          style={{ color: shot.palette.accent }}
        >
          {shot.motif}
        </div>
      </div>
    </div>
  );
}

function SlideMainArea({ shot, isActive, layer }: { shot: Shot; isActive: boolean; layer: LayerKey }) {
  return (
    <div className="absolute left-72 right-64 top-16 bottom-16 z-10 flex">
      {/* Visual canvas — 占 60% */}
      <div className="flex-[3] relative border-r border-bone/8">
        <div className="absolute inset-6">
          <ShotCanvas shot={shot} isActive={isActive} />
        </div>
        {/* 角落标签 */}
        <div className="absolute top-2 left-2 font-mono text-[9px] text-fog/60 tracking-widest">
          FRAME PREVIEW
        </div>
        <div className="absolute top-2 right-2 font-mono text-[9px] text-fog/60 tracking-widest">
          {shot.shotType}
        </div>
      </div>

      {/* Content panels — 占 40% */}
      <div className="flex-[2] p-8 flex flex-col gap-6 overflow-hidden">
        {/* 标题区 */}
        <div>
          <div className="label">TITLE</div>
          <h2 className="font-serif text-bone text-3xl mt-2 leading-tight">{shot.title}</h2>
          <div className="font-mono text-fog text-xs tracking-[0.3em] mt-1">
            {shot.subtitle}
          </div>
        </div>

        {/* 信息层内容 */}
        <div className="flex-1 overflow-hidden">
          <LayerContent shot={shot} layer={layer} />
        </div>

        {/* 底部 camera note */}
        <div className="border-t border-bone/10 pt-3">
          <div className="label">CAMERA</div>
          <div className="font-mono text-[11px] text-bone/70 mt-1 leading-relaxed">
            {shot.cameraNote}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideRightCol({ shot }: { shot: Shot; isActive: boolean }) {
  return (
    <div className="absolute right-0 top-16 bottom-16 w-64 z-10 px-6 flex flex-col gap-4 border-l border-bone/8 bg-abyss/30">
      <div>
        <div className="label">SHOT SIZE</div>
        <div className="font-mono text-xs text-bone mt-1 tracking-widest">
          {shot.shotSize}
        </div>
      </div>
      <div>
        <div className="label">MOVEMENT</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.movement}
        </div>
      </div>
      <div>
        <div className="label">FOCUS</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.focalNote}
        </div>
      </div>
      <div>
        <div className="label">LIGHTING</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.lighting.from} → {shot.lighting.to}
        </div>
      </div>
      <div className="mt-auto">
        <div className="label">MOTION BLUR</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.motionBlur}
        </div>
      </div>
    </div>
  );
}

function LayerContent({ shot, layer }: { shot: Shot; layer: LayerKey }) {
  const data = {
    narrative: shot.visual,
    camera: [shot.shotSize, shot.movement, shot.focalNote, shot.lighting.from + " → " + shot.lighting.to],
    audio: shot.audio,
    vfx: shot.vfx,
  }[layer];

  const heading = {
    narrative: "画面内容 / NARRATIVE",
    camera: "镜头规格 / CAMERA",
    audio: "音效设计 / AUDIO",
    vfx: "视觉特效 / VFX",
  }[layer];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full" style={{ background: shot.palette.accent }} />
        <span className="label">{heading}</span>
      </div>
      <ul className="space-y-2 font-serif text-bone/80 text-sm leading-relaxed flex-1 overflow-y-auto pr-2">
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
    </div>
  );
}

function CornerMarks() {
  const cls = "absolute w-2 h-2 border-bone/20 z-20";
  return (
    <>
      <div className={`${cls} top-2 left-2 border-l border-t`} />
      <div className={`${cls} top-2 right-2 border-r border-t`} />
      <div className={`${cls} bottom-2 left-2 border-l border-b`} />
      <div className={`${cls} bottom-2 right-2 border-r border-b`} />
    </>
  );
}

function zoneLabel(shot: Shot): string {
  if (shot.altitude) return "AIR · SUNSET";
  if (shot.depth === 0) return "OCEAN SURFACE";
  if (shot.depth > -100) return "PHOTIC ZONE";
  if (shot.depth > -1000) return "TWILIGHT ZONE";
  if (shot.depth > -3000) return "BATHYAL";
  return "ABYSSAL · TRENCH";
}

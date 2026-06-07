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

// 立体感镜头卡 — 玻璃面板 + 3D 倾斜 + 铁锈边光
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
      {/* 多层点阵背景 */}
      <div className="absolute inset-0 dot-grid-dense dot-drift-fast opacity-30" />
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-40" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rust/40 to-transparent z-20" />

      {/* 顶部条 — 玻璃质感 */}
      <SlideTopBar shot={shot} index={index} total={total} isActive={isActive} />

      {/* 左栏 — 镜号（3D 倾斜巨型） */}
      <SlideLeftCol shot={shot} index={index} isActive={isActive} />

      {/* 中部主区 */}
      <SlideMainArea shot={shot} isActive={isActive} layer={layer} />

      {/* 右栏 — 镜头规格 */}
      <SlideRightCol shot={shot} />

      {/* 角落标记 */}
      <CornerMarks />
    </section>
  );
}

function SlideTopBar({ shot, index, total, isActive }: { shot: Shot; index: number; total: number; isActive: boolean }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 px-12 py-3.5 flex items-center justify-between">
      <div className="pill-3d rounded-md px-3 py-1.5 flex items-center gap-3 font-mono text-[10px] tracking-widest">
        <div className={`dot-3d ${isActive ? "active" : ""}`} style={{ width: "8px", height: "8px" }} />
        <span className={isActive ? "text-bone" : "text-fog/60"}>深渊恐惧</span>
        <span className="text-fog/30">/</span>
        <span className="text-fog">SEQ 21-25</span>
        <span className="text-fog/30">/</span>
        <span className="text-rust">SHOT {String(index).padStart(2, "0")}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="pill-3d rounded-md px-3 py-1.5 font-mono text-[10px] text-bone tracking-widest">
          {shot.timecode.start} — {shot.timecode.end}
        </div>
        <div className="pill-3d rounded-md px-3 py-1.5 font-mono text-[10px] text-fog tracking-widest">
          {shot.timecode.duration}.00s
        </div>
        <div className="pill-3d rounded-md px-3 py-1.5 font-mono text-[10px] text-rust tracking-widest">
          IMAX 3D
        </div>
      </div>

      <div className="pill-3d rounded-md px-3 py-1.5 flex items-center gap-3">
        <span className="font-mono text-[10px] text-fog tracking-widest">
          {String(index).padStart(2, "0")} <span className="text-fog/30">/</span> {String(total).padStart(2, "0")}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`dot-3d ${i === index - 1 ? "active" : ""}`}
              style={{ width: i === index - 1 ? "20px" : "6px", height: "6px", borderRadius: i === index - 1 ? "3px" : "50%" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideLeftCol({ shot, index }: { shot: Shot; index: number; isActive: boolean }) {
  return (
    <div
      className="absolute left-0 top-20 bottom-20 w-80 z-10 px-8 flex flex-col justify-between"
      style={{ perspective: "1500px" }}
    >
      <div>
        <div className="label text-rust/80">SHOT</div>
        {/* 3D 倾斜巨型镜号 */}
        <div
          className="mt-4"
          style={{
            transform: "perspective(1500px) rotateY(-8deg) rotateX(2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <DotNumber num={String(index)} size={16} onColor={shot.palette.accent} />
        </div>
        <div className="font-mono text-[9px] text-fog/60 tracking-widest mt-3">
          OF {String(5).padStart(2, "0")} SHOTS
        </div>
      </div>

      {/* 深度信息 — 玻璃面板 */}
      <div
        className="glass rounded-lg p-4 rust-texture"
        style={{ transform: "perspective(1500px) rotateY(-3deg)" }}
      >
        <div>
          <div className="label text-rust/80">DEPTH</div>
          <div className="numeral text-bone text-3xl mt-1">
            {shot.altitude ? `+${shot.altitude}` : shot.depth}
            <span className="text-sm text-fog/60 ml-1">M</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-bone/10">
          <div className="label">ZONE</div>
          <div className="font-mono text-[10px] text-bone/80 tracking-widest mt-1">
            {zoneLabel(shot)}
          </div>
        </div>
      </div>

      <div>
        <div className="label">MOTIF</div>
        <div
          className="numeral text-5xl mt-2"
          style={{
            color: shot.palette.accent,
            textShadow: `0 1px 0 rgba(0,0,0,0.4), 0 2px 12px ${shot.palette.accent}40`,
          }}
        >
          {shot.motif}
        </div>
      </div>
    </div>
  );
}

function SlideMainArea({ shot, isActive, layer }: { shot: Shot; isActive: boolean; layer: LayerKey }) {
  return (
    <div className="absolute left-80 right-72 top-20 bottom-20 z-10 flex gap-4" style={{ perspective: "2000px" }}>
      {/* Visual canvas — 3D 倾斜玻璃面板 */}
      <div
        className="flex-[3] relative glass rounded-xl overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0">
          <ShotCanvas shot={shot} isActive={isActive} />
        </div>
        {/* 角落标签 */}
        <div className="absolute top-3 left-3 pill-3d rounded px-2 py-0.5 font-mono text-[9px] text-fog tracking-widest z-10">
          FRAME · {shot.shotType}
        </div>
        <div className="absolute top-3 right-3 pill-3d rounded px-2 py-0.5 font-mono text-[9px] text-rust tracking-widest z-10">
          DEPTH · {shot.depth === 0 && shot.altitude ? `+${shot.altitude}m` : `${shot.depth}m`}
        </div>
        <div className="absolute bottom-3 left-3 pill-3d rounded px-2 py-0.5 font-mono text-[9px] text-bone tracking-widest z-10">
          {shot.timecode.start} — {shot.timecode.end}
        </div>
        <div className="absolute bottom-3 right-3 pill-3d rounded px-2 py-0.5 font-mono text-[9px] text-rust tracking-widest z-10">
          IMAX 3D
        </div>
      </div>

      {/* Content panels */}
      <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
        {/* 标题区 — 玻璃 */}
        <div className="glass rounded-xl p-5">
          <div className="label text-rust/80">TITLE</div>
          <h2 className="font-serif text-bone text-3xl mt-2 leading-tight">{shot.title}</h2>
          <div className="font-mono text-fog text-xs tracking-[0.3em] mt-1">
            {shot.subtitle}
          </div>
        </div>

        {/* 信息层内容 — 玻璃 */}
        <div className="flex-1 glass rounded-xl p-5 overflow-hidden">
          <LayerContent shot={shot} layer={layer} />
        </div>

        {/* 底部 camera note — 金属面板 */}
        <div className="metal rounded-xl p-4">
          <div className="label text-rust/80">CAMERA NOTE</div>
          <div className="font-serif text-bone/80 text-sm mt-2 leading-relaxed">
            {shot.cameraNote}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideRightCol({ shot }: { shot: Shot }) {
  return (
    <div
      className="absolute right-0 top-20 bottom-20 w-72 z-10 px-5 flex flex-col gap-3"
      style={{ perspective: "1500px" }}
    >
      <div className="glass rounded-xl p-4" style={{ transform: "perspective(1500px) rotateY(3deg)" }}>
        <div className="label text-rust/80">SHOT SIZE</div>
        <div className="font-mono text-xs text-bone mt-1 tracking-widest">
          {shot.shotSize}
        </div>
      </div>
      <div className="glass rounded-xl p-4" style={{ transform: "perspective(1500px) rotateY(3deg)" }}>
        <div className="label text-rust/80">MOVEMENT</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.movement}
        </div>
      </div>
      <div className="glass rounded-xl p-4" style={{ transform: "perspective(1500px) rotateY(3deg)" }}>
        <div className="label text-rust/80">FOCUS</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.focalNote}
        </div>
      </div>
      <div className="glass rounded-xl p-4" style={{ transform: "perspective(1500px) rotateY(3deg)" }}>
        <div className="label text-rust/80">LIGHTING</div>
        <div className="font-mono text-[11px] text-bone/80 mt-1 leading-relaxed">
          {shot.lighting.from} → {shot.lighting.to}
        </div>
      </div>
      <div className="glass rounded-xl p-4 mt-auto" style={{ transform: "perspective(1500px) rotateY(3deg)" }}>
        <div className="label text-rust/80">MOTION BLUR</div>
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
        <div className="dot-3d active" style={{ width: "8px", height: "8px" }} />
        <span className="label text-rust/80">{heading}</span>
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
            <span className="font-mono text-[10px] text-fog/50 mt-1 shrink-0 tabular-nums">
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

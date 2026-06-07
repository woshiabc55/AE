import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta, shots } from "@/data/shots";
import DotNumber from "./DotNumber";

// 终场 — 黑屏之后
// 立体字 + 金属面 + 面包屏（contact sheet 形态）
export default function EndScreen({ visible }: EndScreenProps) {
  const [showText, setShowText] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowText(false);
      setShowCredits(false);
      setShowSheet(false);
      return;
    }
    const t1 = setTimeout(() => setShowText(true), 400);
    const t2 = setTimeout(() => setShowCredits(true), 1400);
    const t3 = setTimeout(() => setShowSheet(true), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [visible]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-abyss">
      {/* 多层点阵背景 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-50" />
      <div className="absolute inset-0 dot-grid-vignette" />
      <div className="absolute inset-0 dot-grid-blood opacity-20 dot-drift-fast" />

      {/* 锈色光斑 — 左上 */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-rust/8 blur-[120px] pointer-events-none" />
      {/* 血色光斑 — 右下 */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blood/6 blur-[120px] pointer-events-none" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/60 to-transparent z-20" />
      {/* 底部血线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rust/40 to-transparent z-20" />

      {/* 角落标记 */}
      <CornerMarks />

      {visible && (
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-10 py-12" style={{ perspective: "2500px" }}>
          {/* 顶部场次信息 — 金属面板 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-12 gap-6 mb-10"
          >
            <div className="col-span-2 metal rounded-lg p-3">
              <div className="label text-rust/80">FIN</div>
              <div className="numeral text-bone text-2xl mt-1 glow-rust">END</div>
            </div>
            <div className="col-span-4 glass-rust rounded-lg p-3">
              <div className="label text-rust/80">SEQUENCE</div>
              <div className="mt-1">
                <DotNumber num="21-25" size={5} onColor="#E63946" />
              </div>
            </div>
            <div className="col-span-3 metal rounded-lg p-3">
              <div className="label text-rust/80">TIMECODE</div>
              <div className="font-mono text-bone text-sm tracking-widest mt-1">
                {projectMeta.timecode}
              </div>
            </div>
            <div className="col-span-3 metal-blood rounded-lg p-3 text-right">
              <div className="label text-blood/80">DURATION</div>
              <div className="font-mono text-bone text-sm tracking-widest mt-1">
                {projectMeta.duration}.00 SEC
              </div>
            </div>
          </motion.div>

          {/* 主标题 — 立体字诗意收尾 */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 12 }}
            animate={{
              opacity: showText ? 1 : 0,
              y: showText ? 0 : 30,
              rotateX: showText ? 0 : 12,
            }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center my-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="label text-rust/80 tracking-[0.5em]">深渊恐惧 · ABYSS FEAR</div>
            <h2
              className="numeral text-bone mt-4"
              style={{
                fontSize: "clamp(64px, 9vw, 144px)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              <span className="block text-3d-rust">黑屏之后</span>
              <span className="block text-3d-blood glow-blood mt-2">铁铮仍在海底</span>
            </h2>
            <p className="font-serif text-bone/60 text-lg leading-relaxed italic mt-6 max-w-2xl mx-auto">
              "After the black screen,<br />
              Tiezheng remains on the seafloor."
            </p>
          </motion.div>

          {/* 面包屏 / Contact Sheet — 5 个镜头缩略 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showSheet ? 1 : 0, y: showSheet ? 0 : 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
            style={{ perspective: "2000px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="dot-3d active" style={{ width: "10px", height: "10px" }} />
                <div className="label text-rust/80">CONTACT SHEET · 5 FRAMES</div>
              </div>
              <div className="font-mono text-[10px] text-fog/50 tracking-widest">
                35MM · 5 PERFORATIONS / FRAME
              </div>
            </div>

            {/* 胶片条带 + 5 格 */}
            <div className="relative metal rounded-2xl p-4 overflow-hidden">
              {/* 上下胶片孔 */}
              <div className="flex justify-between mb-3 px-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={`top-${i}`}
                    className="w-3 h-2 rounded-sm bg-abyss/80 border border-bone/20"
                    style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.5)" }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3">
                {shots.map((shot, i) => (
                  <ContactFrame key={shot.id} shot={shot} index={i + 21} delay={i * 0.1} />
                ))}
              </div>

              <div className="flex justify-between mt-3 px-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={`bot-${i}`}
                    className="w-3 h-2 rounded-sm bg-abyss/80 border border-bone/20"
                    style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.5)" }}
                  />
                ))}
              </div>

              {/* 角落胶片号 */}
              <div className="absolute top-2 left-3 font-mono text-[8px] text-rust/60 tracking-widest">
                KODAK 5219 · 35MM
              </div>
              <div className="absolute top-2 right-3 font-mono text-[8px] text-rust/60 tracking-widest">
                MPT · 250 ISO
              </div>
            </div>
          </motion.div>

          {/* 制作名单 — 三栏玻璃 + 金属 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showCredits ? 1 : 0, y: showCredits ? 0 : 20 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-12 gap-6 mt-10 pt-6 border-t border-bone/10"
          >
            {/* 左 — 主创 */}
            <div className="col-span-4 glass rounded-xl p-5" style={{ transform: "perspective(2000px) rotateY(2deg)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="dot-3d active" style={{ width: "8px", height: "8px" }} />
                <div className="label text-rust/80">PRINCIPAL CREW</div>
              </div>
              <div className="space-y-2.5 font-mono text-[11px]">
                <Credit k="DIRECTOR" v={projectMeta.director} />
                <Credit k="DOP" v={projectMeta.dop} />
                <Credit k="VFX SUPERVISOR" v={projectMeta.vfxSupervisor} />
                <Credit k="EDITOR" v="（虚构）" />
                <Credit k="PRODUCTION DESIGN" v="（虚构）" />
                <Credit k="COSTUME DESIGN" v="（虚构）" />
              </div>
            </div>

            {/* 中 — 技术规格 */}
            <div
              className="col-span-4 glass-rust rounded-xl p-5"
              style={{ transform: "perspective(2000px) rotateY(0deg) translateZ(8px)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="dot-3d active" style={{ width: "8px", height: "8px" }} />
                <div className="label text-rust/80">TECHNICAL</div>
              </div>
              <div className="space-y-2.5 font-mono text-[11px]">
                <Credit k="FORMAT" v={projectMeta.format} />
                <Credit k="ASPECT RATIO" v="1.43 : 1" />
                <Credit k="CAMERA" v="IMAX MSM 9802" />
                <Credit k="LENS" v="HAWK V-LITE 40MM" />
                <Credit k="STEREO RIG" v="IMAX 3D" />
                <Credit k="POST" v="4K DI · HDR" />
              </div>
            </div>

            {/* 右 — Logo + 收尾符号 */}
            <div
              className="col-span-4 metal-blood rounded-xl p-5 flex flex-col items-center justify-center"
              style={{ transform: "perspective(2000px) rotateY(-2deg)" }}
            >
              <div className="label text-blood/80 mb-3">PROJECT MARK</div>
              <div
                className="numeral text-bone"
                style={{
                  fontSize: "64px",
                  lineHeight: 1,
                  background: "linear-gradient(180deg, #E63946 0%, #8B1A20 60%, #2A0808 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 16px rgba(230, 57, 70, 0.4))",
                }}
              >
                深渊
              </div>
              <div
                className="numeral text-rust mt-1"
                style={{
                  fontSize: "28px",
                  letterSpacing: "0.3em",
                  textShadow: "0 2px 8px rgba(201, 90, 43, 0.4)",
                }}
              >
                ABYSS
              </div>
              <div className="w-16 h-px bg-blood/40 my-3" />
              <div className="font-mono text-[9px] text-fog/60 tracking-widest text-center">
                SCRIPT DRAFT
                <br />
                REV 0.1 · INTERNAL
              </div>
            </div>
          </motion.div>

          {/* 底部收尾 — 滚动字幕感 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showCredits ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-4 w-full max-w-3xl">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent" />
              <div className="numeral text-rust/60 text-xl">◇</div>
              <div className="font-mono text-[10px] text-fog/50 tracking-[0.4em]">
                " 沉 没 是 一 种 抵 达 "
              </div>
              <div className="numeral text-rust/60 text-xl">◇</div>
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent" />
            </div>
            <div className="font-mono text-[9px] text-fog/40 tracking-widest">
              © 2026 · 深渊恐惧工作室 · ALL RIGHTS RESERVED
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

interface EndScreenProps {
  visible: boolean;
}

// 单个面包屏小格 — 镜头缩略
function ContactFrame({ shot, index, delay }: { shot: typeof shots[number]; index: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative aspect-[3/2] rounded overflow-hidden border border-bone/10"
        style={{
          background: `linear-gradient(135deg, ${shot.palette.bg} 0%, #050810 100%)`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        {/* 缩略图 — 几何示意 */}
        <div className="absolute inset-0 opacity-60">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${shot.gpsMark.x * 100}% ${shot.gpsMark.y * 100}%, ${shot.palette.accent}40 0%, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 dot-grid-dense opacity-30" />
        </div>

        {/* motif 字符 */}
        <div
          className="absolute inset-0 flex items-center justify-center numeral"
          style={{
            color: shot.palette.accent,
            fontSize: "48px",
            textShadow: `0 0 16px ${shot.palette.accent}80, 0 2px 0 rgba(0,0,0,0.5)`,
          }}
        >
          {shot.motif}
        </div>

        {/* 顶部镜号 */}
        <div className="absolute top-1.5 left-1.5 font-mono text-[8px] text-bone/80 tracking-widest bg-abyss/60 px-1 rounded">
          {String(index).padStart(2, "0")}
        </div>
        {/* 底部时间码 */}
        <div className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-fog/70 tracking-widest bg-abyss/60 px-1 rounded">
          {shot.timecode.start}
        </div>
        {/* 顶部右侧深度 */}
        <div className="absolute top-1.5 right-1.5 font-mono text-[8px] text-rust/90 tracking-widest">
          {shot.altitude ? `+${shot.altitude}` : shot.depth}M
        </div>
      </div>

      {/* 标题区 — 玻璃 */}
      <div className="mt-2 glass rounded px-2 py-1.5">
        <div className="font-mono text-[9px] text-rust/80 tracking-widest">
          SHOT {String(index).padStart(2, "0")}
        </div>
        <div className="font-serif text-bone text-[11px] leading-tight mt-0.5 truncate">
          {shot.title}
        </div>
      </div>
    </motion.div>
  );
}

function Credit({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-bone/5 pb-1.5">
      <span className="text-fog/70 tracking-widest">{k}</span>
      <span className="text-bone tracking-widest">{v}</span>
    </div>
  );
}

function CornerMarks() {
  const cls = "absolute w-2 h-2 border-bone/30 z-20";
  return (
    <>
      <div className={`${cls} top-3 left-3 border-l border-t`} />
      <div className={`${cls} top-3 right-3 border-r border-t`} />
      <div className={`${cls} bottom-3 left-3 border-l border-b`} />
      <div className={`${cls} bottom-3 right-3 border-r border-b`} />
    </>
  );
}

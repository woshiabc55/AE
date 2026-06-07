import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta, shots } from "@/data/shots";
import DotNumber from "./DotNumber";

interface EndScreenProps {
  visible: boolean;
}

export default function EndScreen({ visible }: EndScreenProps) {
  const [showText, setShowText] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowText(false);
      setShowCredits(false);
      return;
    }
    const t1 = setTimeout(() => setShowText(true), 400);
    const t2 = setTimeout(() => setShowCredits(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-abyss">
      {/* 背景点阵 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-50" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/50 to-transparent" />

      {/* 角落标记 */}
      <CornerMarks />

      {visible && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-12 py-16">
          {/* 顶部场次信息 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showText ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-12 gap-8 mb-16"
          >
            <div className="col-span-2">
              <div className="label">FIN</div>
              <div className="numeral text-bone text-3xl mt-1">END</div>
            </div>
            <div className="col-span-4">
              <div className="label">SEQUENCE</div>
              <DotNumber num="21-25" size={5} onColor="#E63946" />
            </div>
            <div className="col-span-3">
              <div className="label">TIMECODE</div>
              <div className="font-mono text-bone text-sm tracking-widest mt-1">
                {projectMeta.timecode}
              </div>
            </div>
            <div className="col-span-3 text-right">
              <div className="label">DURATION</div>
              <div className="font-mono text-bone text-sm tracking-widest mt-1">
                {projectMeta.duration}.00 SEC
              </div>
            </div>
          </motion.div>

          {/* 主标题 — 诗意收尾 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-center my-16"
          >
            <div className="label">深渊恐惧 · ABYSS FEAR</div>
            <h2 className="font-serif text-bone text-[100px] md:text-[140px] leading-[0.9] tracking-tight mt-6">
              <span className="block">黑屏之后</span>
              <span className="block text-blood glow-blood">铁铮仍在海底</span>
            </h2>
            <p className="font-serif text-bone/60 text-lg leading-relaxed italic mt-8 max-w-2xl mx-auto">
              "After the black screen,<br />
              Tiezheng remains on the seafloor."
            </p>
          </motion.div>

          {/* 制作名单 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showCredits ? 1 : 0, y: showCredits ? 0 : 20 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-12 gap-8 mt-20 pt-8 border-t border-bone/10"
          >
            {/* 左 — 主创 */}
            <div className="col-span-4">
              <div className="label">PRINCIPAL CREW</div>
              <div className="space-y-3 mt-4 font-mono text-[11px]">
                <Credit k="DIRECTOR" v={projectMeta.director} />
                <Credit k="DOP" v={projectMeta.dop} />
                <Credit k="VFX SUPERVISOR" v={projectMeta.vfxSupervisor} />
                <Credit k="EDITOR" v="（虚构）" />
                <Credit k="PRODUCTION DESIGN" v="（虚构）" />
                <Credit k="COSTUME DESIGN" v="（虚构）" />
              </div>
            </div>

            {/* 中 — 技术规格 */}
            <div className="col-span-4">
              <div className="label">TECHNICAL</div>
              <div className="space-y-3 mt-4 font-mono text-[11px]">
                <Credit k="FORMAT" v={projectMeta.format} />
                <Credit k="ASPECT RATIO" v="1.43 : 1" />
                <Credit k="CAMERA" v="IMAX MSM 9802" />
                <Credit k="LENS" v="HAWK V-LITE 40MM" />
                <Credit k="STEREO RIG" v="IMAX 3D" />
                <Credit k="POST" v="4K DI · HDR" />
              </div>
            </div>

            {/* 右 — 5 镜头回顾 */}
            <div className="col-span-4">
              <div className="label">SEQUENCE 21 — 25</div>
              <div className="space-y-1.5 mt-4 font-mono text-[10px]">
                {shots.map((shot) => (
                  <div key={shot.id} className="flex items-center gap-2 text-fog/80">
                    <span className="text-blood w-6 tabular-nums">
                      {String(shot.index).padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate">{shot.title}</span>
                    <span className="text-fog/40 text-[9px] tabular-nums">
                      {shot.timecode.start}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 底部 — 收尾符号 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showCredits ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-6"
          >
            <span className="w-24 h-px bg-bone/20" />
            <div className="numeral text-fog/40 text-2xl">◇</div>
            <div className="font-mono text-[10px] text-fog/50 tracking-widest">
              SCRIPT DRAFT · REV 0.1 · INTERNAL
            </div>
            <div className="numeral text-fog/40 text-2xl">◇</div>
            <span className="w-24 h-px bg-bone/20" />
          </motion.div>
        </div>
      )}
    </section>
  );
}

function Credit({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-bone/5 pb-2">
      <span className="text-fog/70 tracking-widest">{k}</span>
      <span className="text-bone tracking-widest">{v}</span>
    </div>
  );
}

function CornerMarks() {
  const cls = "absolute w-2 h-2 border-bone/30";
  return (
    <>
      <div className={`${cls} top-3 left-3 border-l border-t`} />
      <div className={`${cls} top-3 right-3 border-r border-t`} />
      <div className={`${cls} bottom-3 left-3 border-l border-b`} />
      <div className={`${cls} bottom-3 right-3 border-r border-b`} />
    </>
  );
}

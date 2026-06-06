import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta } from "@/data/shots";
import DotNumber from "./DotNumber";

interface EndScreenProps {
  visible: boolean;
}

export default function EndScreen({ visible }: EndScreenProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowText(false);
      return;
    }
    const t = setTimeout(() => setShowText(true), 600);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-abyss">
      {/* 背景点阵 + 暗角 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-40" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/40 to-transparent" />

      {/* 角落标记 */}
      <CornerMarks />

      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 max-w-6xl w-full px-12"
        >
          <div className="grid grid-cols-12 gap-8">
            {/* 左侧 — END 标识 */}
            <div className="col-span-4 flex flex-col gap-4">
              <div>
                <div className="label">END OF</div>
                <div className="numeral text-bone text-7xl leading-none mt-2">END</div>
              </div>
              <div>
                <div className="label">SEQUENCE</div>
                <DotNumber num="21-25" size={8} onColor="#E63946" />
              </div>
            </div>

            {/* 中间 — 标题区 */}
            <div className="col-span-5 flex flex-col items-center text-center justify-center">
              <div className="label mb-3">PRODUCTION STORYBOARD</div>
              <div className="numeral text-bone text-[100px] leading-none glow-cyan">CHIXIAO</div>
              <div className="font-mono text-fog text-xs tracking-[0.4em] mt-3">
                {projectMeta.timecode} · {projectMeta.duration}s
              </div>
              <div className="w-32 h-px bg-blood/40 my-6" />
              <p className="font-serif text-bone/80 text-sm leading-relaxed max-w-xs">
                铁铮的身体陷在马里亚纳海沟的软泥里。<br />
                没有人知道他在那里。
              </p>
            </div>

            {/* 右侧 — 制作字段表 */}
            <div className="col-span-3 flex flex-col gap-4">
              <div className="label">PRODUCTION</div>
              <Field k="DIRECTOR" v={projectMeta.director} />
              <Field k="DOP" v={projectMeta.dop} />
              <Field k="VFX SUPERVISOR" v={projectMeta.vfxSupervisor} />
              <Field k="FORMAT" v={projectMeta.format} />
              <Field k="ASPECT" v="1.43 : 1" />
              <Field k="FRAME" v="65mm · 5 PERF" />
            </div>
          </div>

          {/* 底部 — 收尾语句 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showText ? 1 : 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex items-center justify-center gap-4 font-mono text-[10px] text-fog/60 tracking-widest"
          >
            <span className="w-16 h-px bg-fog/30" />
            <span>AFTER THE BLACK SCREEN, TIEZHENG REMAINS ON THE SEAFLOOR</span>
            <span className="w-16 h-px bg-fog/30" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-bone/10 pt-2">
      <div className="label">{k}</div>
      <div className="text-bone/80 text-[11px] mt-1 tracking-widest font-mono">{v}</div>
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

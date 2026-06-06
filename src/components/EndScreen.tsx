import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projectMeta } from "@/data/shots";

interface EndScreenProps {
  visible: boolean;
}

export default function EndScreen({ visible }: EndScreenProps) {
  const [showText, setShowText] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowText(true), 600);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-abyss"
    >
      {/* Fade in from black */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: visible ? 0 : 1, background: "black" }}
      />

      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 max-w-3xl w-full px-8"
        >
          {/* Title block */}
          <div className="text-center mb-16">
            <div className="label mb-4">END OF SEQUENCE</div>
            <div className="numeral text-[80px] md:text-[120px] text-bone/80 glow-cyan">CHIXIAO</div>
            <div className="font-mono text-fog text-xs tracking-[0.4em] mt-2">
              {projectMeta.sequence} · {projectMeta.timecode} · {projectMeta.duration}s
            </div>
          </div>

          {/* Production fields */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono text-xs">
            <Field k="DIRECTOR" v={projectMeta.director} />
            <Field k="DOP" v={projectMeta.dop} />
            <Field k="VFX SUPERVISOR" v={projectMeta.vfxSupervisor} />
            <Field k="FORMAT" v={projectMeta.format} />
            <Field k="ASPECT" v="1.43 : 1" />
            <Field k="FRAME" v="65mm · 5 PERF" />
          </div>

          {/* Footer mark */}
          <div className="mt-20 flex items-center justify-center gap-3 font-mono text-[10px] text-fog/50 tracking-widest">
            <span className="w-12 h-px bg-fog/30" />
            <span>黑屏之后，铁铮仍在海底</span>
            <span className="w-12 h-px bg-fog/30" />
          </div>
        </motion.div>
      )}
    </section>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-bone/10 pt-3">
      <div className="label">{k}</div>
      <div className="text-bone/80 mt-1 tracking-widest">{v}</div>
    </div>
  );
}

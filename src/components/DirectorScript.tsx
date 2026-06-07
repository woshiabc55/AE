import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, BookOpen, FileText } from "lucide-react";
import { shots, projectMeta } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface DirectorScriptProps {
  activeShotId: ShotId;
  onJump: (id: ShotId) => void;
}

// 导演脚本面板 — 可折叠的右侧抽屉
// 顶部 REC 提示 + 5 镜头的完整脚本文本
export default function DirectorScript({ activeShotId, onJump }: DirectorScriptProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 触发按钮 — 固定右侧 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-3 z-30 top-1/2 -translate-y-1/2 metal rounded-l-lg p-2.5 hover:brightness-125 transition-all pointer-events-auto"
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.4em",
        }}
        title="导演脚本"
      >
        <div className="flex items-center gap-2 font-mono text-[9px] text-rust tracking-widest">
          <BookOpen className="w-3 h-3" style={{ writingMode: "horizontal-tb" }} />
          <span>DIRECTOR SCRIPT</span>
        </div>
      </button>

      {/* 抽屉面板 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 背景 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-abyss/60 backdrop-blur-sm"
            />

            {/* 面板 */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[640px] max-w-[90vw] bg-iron border-l border-rust/30 overflow-y-auto"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 60% 40% at 100% 0%, rgba(201,90,43,0.1), transparent 70%),
                  radial-gradient(ellipse 60% 40% at 100% 100%, rgba(230,57,70,0.08), transparent 70%),
                  linear-gradient(180deg, var(--bg-iron) 0%, #050810 100%)
                `,
              }}
            >
              {/* 顶部 */}
              <div className="sticky top-0 z-10 bg-iron/95 backdrop-blur-sm border-b border-rust/20 px-8 py-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-3 h-3 text-rust" />
                    <div className="label text-rust/80">DIRECTOR SCRIPT</div>
                  </div>
                  <h3 className="numeral text-bone text-2xl">{projectMeta.title}</h3>
                  <div className="font-mono text-[10px] text-fog/70 tracking-widest mt-1">
                    {projectMeta.titleEn} · {projectMeta.sequence} · {projectMeta.timecode}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="pill-3d rounded p-2 hover:brightness-125 transition-all"
                >
                  <X className="w-4 h-4 text-bone" />
                </button>
              </div>

              {/* 脚本内容 */}
              <div className="px-8 py-6 space-y-8">
                {/* 标题页 */}
                <div className="text-center py-6 border-y border-bone/10">
                  <div className="font-mono text-[9px] text-fog/50 tracking-widest mb-2">A FILM BY （虚构）</div>
                  <h1 className="font-serif text-bone text-4xl leading-tight">{projectMeta.title}</h1>
                  <div className="font-mono text-[10px] text-rust/80 tracking-[0.4em] mt-2">{projectMeta.titleEn}</div>
                  <div className="font-serif italic text-bone/60 text-base mt-4">
                    "海面给出一个物体。<br />海沟收走一具身体。<br /><span className="text-rust">中间是水。</span>"
                  </div>
                </div>

                {/* 5 镜头脚本 */}
                {shots.map((shot) => {
                  const isActive = shot.id === activeShotId;
                  return (
                    <div
                      key={shot.id}
                      onClick={() => onJump(shot.id)}
                      className={`relative border-l-2 pl-6 py-2 cursor-pointer transition-all ${
                        isActive ? "border-blood bg-rust/5" : "border-bone/15 hover:border-rust/40"
                      }`}
                    >
                      {/* 镜号大字 */}
                      <div className="absolute -left-3 top-0 numeral text-rust text-3xl opacity-60">
                        {String(shot.index).padStart(2, "0")}
                      </div>
                      {/* TC 标 */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`pill-3d rounded px-2 py-0.5 font-mono text-[9px] tracking-widest ${isActive ? "text-blood" : "text-fog"}`}>
                          {shot.timecode.start} → {shot.timecode.end}
                        </div>
                        <div className="font-mono text-[9px] text-fog/50 tracking-widest">
                          {shot.timecode.duration}.00s
                        </div>
                        <div className="flex-1 h-px bg-bone/10" />
                        <div className="font-mono text-[9px] text-rust/70 tracking-widest">
                          {shot.altitude ? `+${shot.altitude}M` : `${shot.depth}M`}
                        </div>
                      </div>

                      {/* 标题 */}
                      <h4 className="font-serif text-bone text-xl leading-tight">
                        {shot.title}
                      </h4>
                      <div className="font-mono text-[10px] text-fog tracking-[0.3em] mt-1">
                        {shot.subtitle}
                      </div>

                      {/* 内容 */}
                      <div className="mt-4 space-y-2.5 font-serif text-bone/85 text-sm leading-relaxed">
                        {shot.visual.map((line, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="font-mono text-[9px] text-fog/40 mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>

                      {/* 导演注释 */}
                      <div className="mt-4 metal rounded p-3">
                        <div className="label text-rust/80 mb-1.5">DIRECTOR NOTE</div>
                        <p className="font-serif italic text-bone/80 text-xs leading-relaxed">
                          {shot.cameraNote}
                        </p>
                      </div>

                      {/* 活动指示 */}
                      {isActive && (
                        <div className="absolute -right-3 top-2 numeral text-blood text-2xl">
                          ▸
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 收尾 */}
                <div className="text-center py-6 border-t border-bone/10">
                  <div className="font-mono text-[9px] text-fog/40 tracking-widest mb-2">END OF SEQUENCE 21-25</div>
                  <div className="font-serif italic text-bone/60 text-sm">
                    黑屏之后，铁铮仍在海底。
                  </div>
                  <div className="font-mono text-[9px] text-fog/30 tracking-widest mt-3">
                    SCRIPT DRAFT · REV 0.1 · INTERNAL
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

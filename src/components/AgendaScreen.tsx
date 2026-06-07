import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { shots, projectMeta } from "@/data/shots";
import type { ShotId } from "@/data/shots";
import DotNumber from "./DotNumber";

interface AgendaScreenProps {
  onEnter: (id: ShotId) => void;
  onVisible: () => void;
}

// 目录页 — 5 镜头全览 + 深度曲线
// 展示整个序列的"垂直下沉"轨迹
export default function AgendaScreen({ onEnter, onVisible }: AgendaScreenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          setVisible(true);
          onVisible();
        }
      },
      { threshold: [0, 0.4, 0.8] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <section
      ref={ref}
      id="agenda"
      className="relative h-screen w-full overflow-hidden flex items-center"
    >
      {/* 背景点阵 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-50" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/30 to-transparent" />

      {/* 角落标记 */}
      <CornerMarks />

      {/* 顶部条 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-12 py-4 flex items-center justify-between border-b border-bone/8">
        <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest">
          <span className="text-bone">{projectMeta.titleEn}</span>
          <span className="text-fog/40">/</span>
          <span className="text-fog">SEQ 21-25</span>
          <span className="text-fog/40">/</span>
          <span className="text-fog">OVERVIEW</span>
        </div>
        <div className="font-mono text-[10px] text-fog tracking-widest">
          AGENDA · 01 / 02
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 grid grid-cols-12 gap-8">
        {/* 左侧 — 标题与说明 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-4 space-y-6"
        >
          <div>
            <div className="label">PART ONE</div>
            <h2 className="numeral text-bone text-6xl mt-2 leading-none">AGENDA</h2>
            <div className="font-mono text-fog text-xs tracking-[0.3em] mt-2">
              {projectMeta.timecode} · {projectMeta.duration}S · 5 SHOTS
            </div>
          </div>

          <div className="border-t border-bone/10 pt-4 space-y-3">
            <p className="font-serif text-bone/80 text-sm leading-relaxed">
              一具身体从海面下沉到海沟。<br />
              十五秒，五个镜头。<br />
              <span className="text-fog/70">它经过空气、水、软泥，最后回到空气——</span><br />
              <span className="text-blood">而观众留下的，是空海面。</span>
            </p>
          </div>

          <div className="border-t border-bone/10 pt-4 font-mono text-[10px] text-fog space-y-1">
            <div>DEPTH RANGE · 0M → -3800M</div>
            <div>VERTICAL DESCENT · 3800M</div>
            <div>SUBJECT · 铁铮 · DECEASED</div>
            <div>MOOD · FORGETTING</div>
          </div>
        </motion.div>

        {/* 中部 — 5 镜头列表 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-5"
        >
          <div className="space-y-0">
            {shots.map((shot, i) => (
              <motion.button
                key={shot.id}
                onClick={() => onEnter(shot.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="group w-full text-left border-t border-bone/10 py-3 flex items-center gap-4 hover:bg-blood/5 transition-colors -mx-2 px-2"
              >
                {/* 镜号点阵 */}
                <DotNumber num={String(shot.index)} size={4} onColor="#E63946" />
                {/* TC */}
                <div className="font-mono text-[10px] text-fog/60 tracking-widest w-20 shrink-0">
                  {shot.timecode.start}
                </div>
                {/* 标题 */}
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-bone text-sm truncate group-hover:text-blood transition-colors">
                    {shot.title}
                  </div>
                  <div className="font-mono text-[9px] text-fog/50 tracking-widest truncate mt-0.5">
                    {shot.subtitle}
                  </div>
                </div>
                {/* 深度 */}
                <div className="font-mono text-[10px] text-fog tracking-widest text-right shrink-0 w-20">
                  {shot.altitude ? `+${shot.altitude}M` : `${shot.depth}M`}
                </div>
                {/* 箭头 */}
                <div className="text-fog/40 group-hover:text-blood group-hover:translate-x-1 transition-all">
                  →
                </div>
              </motion.button>
            ))}
            {/* 收尾 — EndScreen */}
            <div className="border-t border-bone/10 py-3 flex items-center gap-4 -mx-2 px-2 opacity-60">
              <div className="font-mono text-[10px] text-fog/40 tracking-widest w-12">END</div>
              <div className="font-mono text-[10px] text-fog/40 tracking-widest w-20 shrink-0">
                3:15
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-bone/60 text-sm">收尾·黑屏</div>
                <div className="font-mono text-[9px] text-fog/40 tracking-widest mt-0.5">
                  END SCREEN / BLACK
                </div>
              </div>
              <div className="font-mono text-[10px] text-fog/40 tracking-widest w-20 text-right">—</div>
              <div className="text-fog/20">○</div>
            </div>
          </div>
        </motion.div>

        {/* 右侧 — 深度曲线 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="col-span-3 flex flex-col"
        >
          <div className="label">DEPTH CURVE</div>
          <div className="mt-3 flex-1 relative" style={{ minHeight: "320px" }}>
            <DepthCurve visible={visible} />
          </div>
          <div className="font-mono text-[9px] text-fog/50 tracking-widest mt-2">
            M ABOVE SEA LEVEL
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 深度曲线 — 5 镜头从海面到海床的下降曲线
function DepthCurve({ visible }: { visible: boolean }) {
  const maxDepth = 3800;
  const w = 240;
  const h = 320;

  const points = shots.map((shot, i) => {
    const x = 20 + (i / (shots.length - 1)) * (w - 40);
    let y: number;
    if (shot.altitude) y = 10;
    else if (shot.depth === 0) y = 60;
    else y = 60 + (Math.abs(shot.depth) / maxDepth) * (h - 80);
    return { x, y, shot, i };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      {/* 水平参考线 */}
      {[0, 100, 200, 300].map((y) => (
        <line key={y} x1="20" y1={y} x2={w - 20} y2={y} stroke="rgba(122,139,153,0.1)" strokeWidth="0.5" />
      ))}

      {/* 深度标签 */}
      <text x="2" y="12" fill="#7A8B99" fontSize="8" fontFamily="JetBrains Mono">+100M</text>
      <text x="2" y="62" fill="#7A8B99" fontSize="8" fontFamily="JetBrains Mono">0</text>
      <text x="2" y="142" fill="#7A8B99" fontSize="8" fontFamily="JetBrains Mono">-1K</text>
      <text x="2" y="222" fill="#7A8B99" fontSize="8" fontFamily="JetBrains Mono">-2K</text>
      <text x="2" y="302" fill="#7A8B99" fontSize="8" fontFamily="JetBrains Mono">-3.8K</text>

      {/* 主曲线 */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#E63946"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />

      {/* 5 个镜头点 */}
      {points.map((p, i) => (
        <motion.g
          key={p.shot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
        >
          <circle cx={p.x} cy={p.y} r="5" fill="#050810" stroke="#E63946" strokeWidth="1.5" />
          <circle cx={p.x} cy={p.y} r="2" fill="#E63946" />
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fill="#E8E8E8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            fontWeight="500"
          >
            {String(p.shot.index).padStart(2, "0")}
          </text>
        </motion.g>
      ))}
    </svg>
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

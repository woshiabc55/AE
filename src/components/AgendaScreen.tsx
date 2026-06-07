import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { shots, projectMeta } from "@/data/shots";
import type { ShotId } from "@/data/shots";
import DotNumber from "./DotNumber";

interface AgendaScreenProps {
  onEnter: (id: ShotId) => void;
  onVisible: () => void;
}

// Bento 网格目录页 — 不规则 5-6 块布局
// 巨型 + 中型 + 小型数据块混合，立体玻璃面板
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
      className="relative min-h-screen w-full overflow-hidden flex items-center py-12"
    >
      {/* 多层背景 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-40" />
      <div className="absolute inset-0 dot-grid-vignette" />
      {/* 锈色光斑 */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 90, 43, 0.1) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rust/40 to-transparent z-10" />
      <div className="absolute top-6 left-6 w-3 h-3 border-l border-t border-bone/30 z-10" />
      <div className="absolute top-6 right-6 w-3 h-3 border-r border-t border-bone/30 z-10" />
      <div className="absolute bottom-6 left-6 w-3 h-3 border-l border-b border-bone/30 z-10" />
      <div className="absolute bottom-6 right-6 w-3 h-3 border-r border-b border-bone/30 z-10" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-12" style={{ perspective: "2000px" }}>
        {/* 顶部标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="label text-rust/80">PART 01</div>
              <div className="flex-1 h-px bg-bone/20 max-w-md" />
            </div>
            <h2 className="numeral text-bone text-7xl leading-none">
              AGENDA
            </h2>
            <div className="font-mono text-fog text-xs tracking-[0.3em] mt-2">
              镜头全览 · DEPTH OVERVIEW
            </div>
          </div>
          <div className="text-right">
            <div className="label">SECTION</div>
            <div className="numeral text-rust text-4xl mt-1">01/02</div>
          </div>
        </motion.div>

        {/* Bento 网格 — 6 块不规则布局 */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4" style={{ minHeight: "640px" }}>
          {/* 1. 大块 — 左侧大标题 + 描述 */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30, rotateX: visible ? 0 : 5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-5 row-span-4 glass rounded-xl p-8 rust-texture flex flex-col justify-between"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="dot-3d active" style={{ width: "8px", height: "8px" }} />
                <div className="label text-rust/80">CONCEPT</div>
              </div>
              <h3 className="font-serif text-bone text-3xl leading-tight">
                一具身体从海面下沉到海沟。
              </h3>
              <p className="font-serif text-bone/70 text-base leading-relaxed mt-4">
                十五秒，五个镜头。<br />
                它经过空气、水、软泥，最后回到空气——<br />
                <span className="text-rust">而观众留下的，是空海面。</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-bone/10">
              <Metric k="DURATION" v={`${projectMeta.duration}s`} />
              <Metric k="SHOTS" v="05" />
              <Metric k="DEPTH" v="-3800M" />
            </div>
          </motion.div>

          {/* 2. 右上 — 深度曲线图（3D 倾斜） */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateY: 5 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30, rotateY: visible ? 0 : 5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-7 row-span-3 glass-rust rounded-xl p-6 overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="dot-3d" style={{ width: "8px", height: "8px" }} />
                <div className="label">DEPTH CURVE</div>
              </div>
              <div className="font-mono text-[9px] text-rust/80 tracking-widest">
                M ABOVE SEA LEVEL
              </div>
            </div>
            <DepthCurve visible={visible} />
          </motion.div>

          {/* 3. 右中 — 5 镜头列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-7 row-span-3 glass rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="dot-3d" style={{ width: "8px", height: "8px" }} />
              <div className="label">5 SHOTS</div>
            </div>
            <div className="space-y-0">
              {shots.map((shot, i) => (
                <motion.button
                  key={shot.id}
                  onClick={() => onEnter(shot.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="group w-full text-left border-b border-bone/8 py-2.5 flex items-center gap-4 hover:bg-rust/5 transition-colors -mx-2 px-2"
                >
                  <div className="dot-3d" style={{ width: "10px", height: "10px" }} />
                  <div className="font-mono text-[10px] text-rust tracking-widest w-8 tabular-nums">
                    {String(shot.index).padStart(2, "0")}
                  </div>
                  <div className="font-mono text-[10px] text-fog/60 tracking-widest w-16">
                    {shot.timecode.start}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-bone text-sm truncate group-hover:text-rust transition-colors">
                      {shot.title}
                    </div>
                    <div className="font-mono text-[9px] text-fog/50 tracking-widest truncate mt-0.5">
                      {shot.subtitle}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-fog tracking-widest text-right shrink-0 w-20">
                    {shot.altitude ? `+${shot.altitude}M` : `${shot.depth}M`}
                  </div>
                  <div className="text-fog/40 group-hover:text-rust group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 4. 左下 — 时长点阵巨号 */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -5 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20, rotateX: visible ? 0 : -5 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-3 row-span-2 metal rounded-xl p-6 flex flex-col justify-center items-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="label text-rust/80 mb-2">DURATION</div>
            <DotNumber num="3:15" size={6} onColor="#FFB280" />
            <div className="font-mono text-[9px] text-fog/70 tracking-widest mt-2">
              15.00 SEC · 360 FRAMES
            </div>
          </motion.div>

          {/* 5. 中下 — 深度数字 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="col-span-2 row-span-2 glass rounded-xl p-4 flex flex-col justify-center"
          >
            <div className="label text-[8px] text-rust/80">DEPTH</div>
            <div className="numeral text-bone text-3xl mt-1">3.8K</div>
            <div className="font-mono text-[8px] text-fog/60 tracking-widest mt-1">
              METERS DOWN
            </div>
          </motion.div>

          {/* 6. 右下 — 关键词标签 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="col-span-7 row-span-2 glass rounded-xl p-4"
          >
            <div className="label text-[8px] mb-2">MOOD · TAGS</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {["FORGETTING", "DESCENT", "MECHANICAL", "VOID", "DREAD", "ABSENCE"].map((tag, i) => (
                <span
                  key={tag}
                  className="pill-3d rounded-full px-3 py-1 font-mono text-[9px] text-bone/80 tracking-widest"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="label text-[8px] text-fog/60">{k}</div>
      <div className="numeral text-bone text-lg mt-0.5">{v}</div>
    </div>
  );
}

// 深度曲线 — SVG 绘制，5 节点路径
function DepthCurve({ visible }: { visible: boolean }) {
  const maxDepth = 3800;
  const w = 700;
  const h = 200;

  const points = shots.map((shot, i) => {
    const x = 40 + (i / (shots.length - 1)) * (w - 80);
    let y: number;
    if (shot.altitude) y = 10;
    else if (shot.depth === 0) y = 30;
    else y = 30 + (Math.abs(shot.depth) / maxDepth) * (h - 50);
    return { x, y, shot, i };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="curve-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C95A2B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C95A2B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="stroke-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4A261" />
          <stop offset="50%" stopColor="#C95A2B" />
          <stop offset="100%" stopColor="#8B5A3C" />
        </linearGradient>
      </defs>

      {/* 网格线 */}
      {[20, 60, 100, 140, 180].map((y) => (
        <line key={y} x1="40" y1={y} x2={w - 40} y2={y} stroke="rgba(122,139,153,0.08)" strokeWidth="0.5" />
      ))}

      {/* 深度标签 */}
      <text x="2" y="14" fill="#F4A261" fontSize="9" fontFamily="JetBrains Mono">+100M</text>
      <text x="2" y="34" fill="#7A8B99" fontSize="9" fontFamily="JetBrains Mono">0</text>
      <text x="2" y="84" fill="#7A8B99" fontSize="9" fontFamily="JetBrains Mono">-1K</text>
      <text x="2" y="134" fill="#7A8B99" fontSize="9" fontFamily="JetBrains Mono">-2K</text>
      <text x="2" y="184" fill="#7A8B99" fontSize="9" fontFamily="JetBrains Mono">-3.8K</text>

      {/* 区域填充 */}
      <motion.path
        d={`${pathD} L ${w - 40} ${h - 10} L 40 ${h - 10} Z`}
        fill="url(#curve-grad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* 主曲线 */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#stroke-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />

      {/* 5 个镜头点 — 立体圆球 */}
      {points.map((p, i) => (
        <motion.g
          key={p.shot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
        >
          {/* 投影 */}
          <ellipse cx={p.x} cy={p.y + 8} rx="6" ry="2" fill="rgba(0,0,0,0.5)" />
          {/* 球体 */}
          <circle cx={p.x} cy={p.y} r="6" fill="url(#stroke-grad)" />
          <circle cx={p.x - 1.5} cy={p.y - 1.5} r="2" fill="rgba(255,200,150,0.5)" />
          {/* 镜号 */}
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fill="#E8E8E8"
            fontSize="10"
            fontFamily="JetBrains Mono"
            fontWeight="600"
          >
            {String(p.shot.index).padStart(2, "0")}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

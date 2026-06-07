import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projectMeta } from "@/data/shots";

interface RunningTCProps {
  scrollProgress: number;
}

// 顶部跑马灯 TC 条 — 持续向右滚动的项目信息带
// 实时显示 24fps 跑码 + 项目名 + 场次
export default function RunningTC({ scrollProgress }: RunningTCProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 / 12); // 12fps for smoothness
    return () => clearInterval(t);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const ff = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, "0");

  const recT = `${hh}:${mm}:${ss}:${ff}`;

  // 滚动位置对应的 TC
  const totalSecs = scrollProgress * projectMeta.duration;
  const tcH = Math.floor(totalSecs / 60) + 3; // 起始 3 分钟
  const tcM = Math.floor(totalSecs % 60);
  const tcS = String(tcM).padStart(2, "0");
  const tcF = String(Math.floor((totalSecs % 1) * 24)).padStart(2, "0");
  const sceneTC = `0${tcH}:${tcS}:${tcF}`;

  const items = [
    "深渊恐惧 / ABYSS FEAR",
    `SEQ ${projectMeta.sequence.replace("SEQ ", "")}`,
    "IMAX 3D · 65mm",
    "TC " + sceneTC,
    "REC ●",
    "DIR.（虚构）",
    "DOP.（虚构）",
    "VFX.（虚构）",
    `DURATION ${projectMeta.duration}s`,
    "PACIFIC OCEAN",
    "MARIANA TRENCH",
    "FORGETTING",
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 h-7 glass-blood border-b border-blood/20 overflow-hidden pointer-events-none">
      {/* 左 — REC 标记 */}
      <div className="absolute top-0 left-0 h-full flex items-center gap-2 px-3 bg-blood/20 border-r border-blood/30 z-10">
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-blood shadow-[0_0_8px_rgba(230,57,70,0.8)]"
        />
        <span className="font-mono text-[9px] text-bone tracking-widest font-bold">REC</span>
      </div>

      {/* 跑马灯 */}
      <div className="flex items-center h-full pl-24">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-blood text-[8px]">●</span>
              <span className="font-mono text-[9px] text-bone/80 tracking-widest">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 右 — 系统时间 */}
      <div className="absolute top-0 right-0 h-full flex items-center gap-3 px-3 bg-abyss/60 border-l border-bone/10 z-10">
        <span className="font-mono text-[9px] text-fog tracking-widest">SYS</span>
        <span className="font-mono text-[9px] text-bone tracking-widest tabular-nums">
          {recT}
        </span>
      </div>
    </div>
  );
}

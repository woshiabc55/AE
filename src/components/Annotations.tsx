import type { Shot } from "@/data/shots";

interface AnnotationsProps {
  shot: Shot;
  index: number;
  total: number;
  isActive: boolean;
}

// 大量技术标注 — 电影监视器预览质感
// 包含：框线 / 十字准星 / 主体引线 / 深度刻度 / FOV / 颜色卡 / 摄像机参数盒 / 动作矢量 / 轴标 / 安全框 / 标题牌
export default function Annotations({ shot, index, total, isActive }: AnnotationsProps) {
  const sectionLabel = `SECTION ${String.fromCharCode(64 + (index % 26 || 26))}-${String.fromCharCode(64 + ((index + 1) % 26 || 26))}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* 1. 4 角金属框 — 电影取景器 */}
      <FrameCorners active={isActive} />

      {/* 2. 安全框 — 三层（title / action / safe） */}
      <SafeAreaRects />

      {/* 3. 中心十字准星 */}
      <CenterCrosshair active={isActive} />

      {/* 4. 主体引线标签 + 圆角框 */}
      <SubjectCallout shot={shot} isActive={isActive} />

      {/* 5. 左侧深度刻度尺 */}
      <DepthScale shot={shot} />

      {/* 6. 底部 FOV 横向刻度 */}
      <FovScale />

      {/* 7. 右上 — 摄像机参数盒 */}
      <CameraInfoBox shot={shot} />

      {/* 8. 左上 — 时间码 + 帧号 */}
      <TimecodeStrip shot={shot} index={index} />

      {/* 9. 右上小 — 颜色卡 / 调色参考 */}
      <ColorPaletteSwatch shot={shot} />

      {/* 10. 右下 — 动作矢量 + 速度 */}
      <MotionVector shot={shot} />

      {/* 11. 左下 — 截切线 + 截切点编号 */}
      <CutMarkers index={index} total={total} />

      {/* 12. 顶部中心 — 标题牌 */}
      <TitleCartouche shot={shot} />

      {/* 13. 中心偏下 — 段标签 */}
      <SectionLabel label={sectionLabel} />

      {/* 14. 4 边中点 — 中心刻度点 */}
      <EdgeTicks />

      {/* 15. 3D 轴标（右下角） */}
      <AxisIndicator />
    </div>
  );
}

// ---------- 子组件 ----------

function FrameCorners({ active }: { active: boolean }) {
  const color = active ? "border-blood" : "border-bone/40";
  const tick = "absolute w-3 h-3";
  return (
    <>
      <div className={`${tick} top-1 left-1 border-l border-t ${color}`} />
      <div className={`${tick} top-1 right-1 border-r border-t ${color}`} />
      <div className={`${tick} bottom-1 left-1 border-l border-b ${color}`} />
      <div className={`${tick} bottom-1 right-1 border-r border-b ${color}`} />
    </>
  );
}

function SafeAreaRects() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <rect x="3%" y="3%" width="94%" height="94%" stroke="rgba(232,232,232,0.08)" strokeWidth="0.5" fill="none" />
      <rect x="5%" y="5%" width="90%" height="90%" stroke="rgba(232,232,232,0.12)" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
      <rect x="10%" y="10%" width="80%" height="80%" stroke="rgba(232,232,232,0.18)" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

function CenterCrosshair({ active }: { active: boolean }) {
  const c = active ? "rgba(230,57,70,0.8)" : "rgba(232,232,232,0.4)";
  return (
    <svg className="absolute inset-0 w-full h-full">
      <line x1="50%" y1="48%" x2="50%" y2="49%" stroke={c} strokeWidth="0.5" />
      <line x1="50%" y1="51%" x2="50%" y2="52%" stroke={c} strokeWidth="0.5" />
      <line x1="48%" y1="50%" x2="49%" y2="50%" stroke={c} strokeWidth="0.5" />
      <line x1="51%" y1="50%" x2="52%" y2="50%" stroke={c} strokeWidth="0.5" />
      <circle cx="50%" cy="50%" r="1" fill={c} />
    </svg>
  );
}

function SubjectCallout({ shot, isActive }: { shot: Shot; isActive: boolean }) {
  const x = shot.gpsMark.x * 100;
  const y = shot.gpsMark.y * 100;
  const accent = shot.palette.accent;
  const labelColor = isActive ? accent : "rgba(232,232,232,0.7)";

  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      {/* 主体圆环 */}
      <circle cx={`${x}%`} cy={`${y}%`} r="20" stroke={labelColor} strokeWidth="0.5" fill="none" />
      <circle cx={`${x}%`} cy={`${y}%`} r="26" stroke={labelColor} strokeWidth="0.3" strokeDasharray="2 2" fill="none" />
      {/* 主体十字 */}
      <line x1={`${x - 1.5}%`} y1={`${y}%`} x2={`${x + 1.5}%`} y2={`${y}%`} stroke={labelColor} strokeWidth="0.5" />
      <line x1={`${x}%`} y1={`${y - 1.5}%`} x2={`${x}%`} y2={`${y + 1.5}%`} stroke={labelColor} strokeWidth="0.5" />
      {/* 引线 */}
      <line
        x1={`${x}%`}
        y1={`${y}%`}
        x2="78%"
        y2="20%"
        stroke={labelColor}
        strokeWidth="0.5"
        strokeDasharray="1 1"
      />
      {/* 标签框 */}
      <rect x="78%" y="14%" width="20%" height="6%" stroke={labelColor} strokeWidth="0.5" fill="rgba(10,14,20,0.5)" />
      <text x="79%" y="17.5%" fill={labelColor} fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">
        SUBJECT · {shot.motif}
      </text>
      <text x="79%" y="19.2%" fill={labelColor} fontSize="6" fontFamily="JetBrains Mono" letterSpacing="1" opacity="0.7">
        X:{Math.round(x)}%  Y:{Math.round(y)}%  Z:0
      </text>
    </svg>
  );
}

function DepthScale({ shot }: { shot: Shot }) {
  const marks = shot.id === "shot-25"
    ? [0, 20, 40, 60, 80, 100]
    : shot.id === "shot-23" || shot.id === "shot-24"
    ? [0, 950, 1900, 2850, 3800]
    : shot.id === "shot-22"
    ? [0, 2, 4, 6, 8]
    : [0, 50, 100, 150, 200];

  const unit = shot.id === "shot-25" ? "M↑" : shot.id === "shot-22" ? "M↓" : "M";
  const label = shot.id === "shot-25" ? "ALT" : "DEPTH";

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
      <div className="font-mono text-[7px] text-fog/50 tracking-widest">{label}</div>
      <div className="relative w-px h-32 bg-gradient-to-b from-fog/30 via-bone/30 to-rust/40">
        {marks.map((m, i) => (
          <div
            key={i}
            className="absolute -left-1 flex items-center gap-1"
            style={{ top: `${(i / (marks.length - 1)) * 100}%` }}
          >
            <div className="w-2 h-px bg-bone/50" />
            <div className="font-mono text-[6px] text-fog/60 tracking-widest tabular-nums">
              {m}
            </div>
          </div>
        ))}
        <div
          className="absolute -left-2 w-3 h-px bg-blood"
          style={{
            top: shot.id === "shot-25" ? `${(shot.altitude! / 100) * 100}%` : `${(Math.abs(shot.depth) / marks[marks.length - 1]) * 100}%`,
          }}
        />
      </div>
      <div className="font-mono text-[6px] text-fog/40 tracking-widest">{unit}</div>
    </div>
  );
}

function FovScale() {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1 w-32">
        {[0, 25, 50, 75, 100].map((m, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-px h-1.5 bg-bone/50" />
            <div className="font-mono text-[6px] text-fog/60 tracking-widest tabular-nums">
              {m}
            </div>
          </div>
        ))}
      </div>
      <div className="w-32 h-px bg-gradient-to-r from-fog/30 via-bone/30 to-fog/30" />
      <div className="font-mono text-[6px] text-fog/40 tracking-widest">FOV · 40MM</div>
    </div>
  );
}

function CameraInfoBox({ shot }: { shot: Shot }) {
  return (
    <div className="absolute top-2 right-2 w-32 glass rounded px-2 py-1.5">
      <div className="flex items-center gap-1 mb-1">
        <div className="w-1 h-1 bg-blood rounded-full animate-glow" />
        <div className="font-mono text-[7px] text-rust/80 tracking-widest">CAM · MSM 9802</div>
      </div>
      <div className="font-mono text-[7px] text-bone/80 tracking-widest">
        {shot.shotSize}
      </div>
      <div className="font-mono text-[6px] text-fog/70 tracking-widest mt-0.5 truncate">
        {shot.movement}
      </div>
      <div className="mt-1 pt-1 border-t border-bone/10 flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">FOCAL</div>
        <div className="font-mono text-[6px] text-bone/80 tabular-nums">40MM</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">T-STOP</div>
        <div className="font-mono text-[6px] text-bone/80 tabular-nums">2.8</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">ISO</div>
        <div className="font-mono text-[6px] text-bone/80 tabular-nums">800</div>
      </div>
    </div>
  );
}

function TimecodeStrip({ shot, index }: { shot: Shot; index: number }) {
  const totalFrames = shot.timecode.duration * 24;
  return (
    <div className="absolute top-2 left-2 w-44 glass rounded px-2 py-1.5">
      <div className="flex items-center justify-between mb-1">
        <div className="font-mono text-[7px] text-rust/80 tracking-widest">TC IN/OUT</div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-blood rounded-full" />
          <div className="font-mono text-[6px] text-fog/60 tracking-widest">REC</div>
        </div>
      </div>
      <div className="font-mono text-[8px] text-bone tabular-nums tracking-widest">
        {shot.timecode.start} <span className="text-fog/40">→</span> {shot.timecode.end}
      </div>
      <div className="mt-1 flex gap-0.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 ${i % 4 === 0 ? "bg-rust/60" : "bg-bone/15"}`}
            style={{ opacity: i < totalFrames ? 0.8 : 0.3 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="font-mono text-[6px] text-fog/60 tracking-widest">
          FRAME {String(index).padStart(3, "0")}/{String(5 * 24).padStart(3, "0")}
        </div>
        <div className="font-mono text-[6px] text-fog/60 tracking-widest">24 FPS</div>
      </div>
    </div>
  );
}

function ColorPaletteSwatch({ shot }: { shot: Shot }) {
  const colors = [shot.palette.bg, shot.palette.accent, shot.palette.text];
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 glass rounded p-1.5 flex flex-col gap-1">
      <div className="font-mono text-[6px] text-fog/60 tracking-widest">COLOR</div>
      {colors.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm border border-bone/15"
            style={{ background: c, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
          />
          <div className="font-mono text-[6px] text-fog/70 tabular-nums">
            {c.toUpperCase()}
          </div>
        </div>
      ))}
      <div className="font-mono text-[6px] text-fog/40 tracking-widest mt-0.5">
        {i18nPalette()}
      </div>
    </div>
  );
}

let paletteIdx = 0;
function i18nPalette(): string {
  const labels = ["BG · 底色", "AC · 主色", "TX · 字色"];
  const label = labels[paletteIdx % labels.length] || "";
  paletteIdx++;
  return label;
}

function MotionVector({ shot }: { shot: Shot }) {
  const speed = shot.timecode.duration;
  const isDescent = shot.id === "shot-22" || shot.id === "shot-25";
  return (
    <div className="absolute bottom-2 right-2 w-32 glass rounded px-2 py-1.5">
      <div className="flex items-center gap-1 mb-1">
        <div className="w-1 h-1 bg-rust rounded-full" />
        <div className="font-mono text-[7px] text-rust/80 tracking-widest">MOTION VEC</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">DIR</div>
        <div className="font-mono text-[6px] text-bone/80">
          {isDescent ? "↓ VERT" : shot.id === "shot-23" || shot.id === "shot-24" ? "○ STATIC" : "→ PUSH"}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">SPEED</div>
        <div className="font-mono text-[6px] text-bone/80 tabular-nums">
          {isDescent ? "0.8M/S" : "STATIC"}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[6px] text-fog/60">DUR</div>
        <div className="font-mono text-[6px] text-bone/80 tabular-nums">
          {String(speed).padStart(2, "0")}.00S
        </div>
      </div>
      <svg className="w-full h-3 mt-1" viewBox="0 0 100 12">
        <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(232,232,232,0.2)" strokeWidth="0.5" strokeDasharray="2 2" />
        <polygon points="0,3 10,3 10,0 18,6 10,12 10,9 0,9" fill="rgba(201,90,43,0.7)" />
      </svg>
    </div>
  );
}

function CutMarkers({ index, total }: { index: number; total: number }) {
  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-0.5 font-mono text-[6px] text-fog/60 tracking-widest">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-blood rounded-full" />
        <span>CUT {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-rust rounded-full" />
        <span>SEQ 21-25</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-bone/40 rounded-full" />
        <span>SCENE 14 / EXT</span>
      </div>
    </div>
  );
}

function TitleCartouche({ shot }: { shot: Shot }) {
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
      <div className="font-mono text-[6px] text-fog/40 tracking-widest">
        ── {shot.subtitle} ──
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[6px] text-fog/30 tracking-[0.4em]">
      [{label}]
    </div>
  );
}

function EdgeTicks() {
  return (
    <svg className="absolute inset-0 w-full h-full">
      {/* 上 */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`t-${i}`}
          x1={`${i * 10}%`}
          y1="0"
          x2={`${i * 10}%`}
          y2={i % 5 === 0 ? "8" : "4"}
          stroke="rgba(232,232,232,0.2)"
          strokeWidth="0.5"
        />
      ))}
      {/* 下 */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`b-${i}`}
          x1={`${i * 10}%`}
          y1="100%"
          x2={`${i * 10}%`}
          y2={i % 5 === 0 ? "calc(100% - 8px)" : "calc(100% - 4px)"}
          stroke="rgba(232,232,232,0.2)"
          strokeWidth="0.5"
        />
      ))}
      {/* 左 */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`l-${i}`}
          x1="0"
          y1={`${i * 10}%`}
          x2={i % 5 === 0 ? "8" : "4"}
          y2={`${i * 10}%`}
          stroke="rgba(232,232,232,0.2)"
          strokeWidth="0.5"
        />
      ))}
      {/* 右 */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`r-${i}`}
          x1="100%"
          y1={`${i * 10}%`}
          x2={i % 5 === 0 ? "calc(100% - 8px)" : "calc(100% - 4px)"}
          y2={`${i * 10}%`}
          stroke="rgba(232,232,232,0.2)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

function AxisIndicator() {
  return (
    <div className="absolute right-2 bottom-2 w-16 h-16 glass rounded-lg p-1.5">
      <div className="font-mono text-[6px] text-fog/60 tracking-widest mb-1">AXIS</div>
      <svg className="w-full h-12" viewBox="0 0 60 48">
        {/* X — 锈 */}
        <line x1="6" y1="24" x2="54" y2="24" stroke="#C95A2B" strokeWidth="1" />
        <polygon points="54,24 50,22 50,26" fill="#C95A2B" />
        <text x="46" y="20" fill="#C95A2B" fontSize="5" fontFamily="JetBrains Mono">X</text>
        {/* Y — 血 */}
        <line x1="6" y1="24" x2="6" y2="2" stroke="#E63946" strokeWidth="1" />
        <polygon points="6,2 4,6 8,6" fill="#E63946" />
        <text x="9" y="6" fill="#E63946" fontSize="5" fontFamily="JetBrains Mono">Y</text>
        {/* Z — 铜绿 */}
        <line x1="6" y1="24" x2="20" y2="38" stroke="#4A6741" strokeWidth="1" />
        <polygon points="20,38 16,36 18,32" fill="#4A6741" />
        <text x="22" y="40" fill="#4A6741" fontSize="5" fontFamily="JetBrains Mono">Z</text>
        {/* 原点 */}
        <circle cx="6" cy="24" r="1.5" fill="#E8E8E8" />
      </svg>
    </div>
  );
}

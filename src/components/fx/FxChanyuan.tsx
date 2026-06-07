// 特殊效果 4：澶渊之盟
// SVG 黄河 + 双岸对峙 + 落款朱印同步落定
export function FxChanyuan() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f5ecd5 0%, #ead7a8 100%)",
      }}
    >
      <svg
        viewBox="0 0 400 240"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="yellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c89a2a" />
            <stop offset="50%" stopColor="#e6c25a" />
            <stop offset="100%" stopColor="#9b7517" />
          </linearGradient>
          <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5ecd5" />
            <stop offset="100%" stopColor="#dcbf78" />
          </linearGradient>
        </defs>
        {/* 天空 */}
        <rect x="0" y="0" width="400" height="60" fill="#fbf6ea" />
        {/* 远山 */}
        <path
          d="M0 60 L60 35 L120 55 L180 30 L260 50 L340 30 L400 45 L400 80 L0 80 Z"
          fill="rgba(58,44,32,0.25)"
        />
        {/* 北岸（辽） */}
        <path
          d="M0 80 L400 80 L400 110 Q200 130 0 105 Z"
          fill="rgba(58,44,32,0.5)"
        />
        {/* 黄河 */}
        <rect x="0" y="110" width="400" height="60" fill="url(#yellow)" />
        {/* 流水 */}
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 40} 115 Q${i * 40 + 20} 130 ${i * 40} 145`}
            stroke="rgba(245,236,213,0.7)"
            strokeWidth="1.5"
            fill="none"
          >
            <animate
              attributeName="d"
              values={`M${i * 40} 115 Q${i * 40 + 20} 130 ${i * 40} 145;
                       M${i * 40 + 400} 115 Q${i * 40 + 420} 130 ${i * 40 + 400} 145;
                       M${i * 40 + 800} 115 Q${i * 40 + 820} 130 ${i * 40 + 800} 145`}
              dur={`${4 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
        {/* 南岸（宋） */}
        <path
          d="M0 170 Q200 180 400 175 L400 240 L0 240 Z"
          fill="rgba(125,31,16,0.4)"
        />
        {/* 中线 */}
        <line
          x1="0"
          y1="140"
          x2="400"
          y2="140"
          stroke="rgba(58,44,32,0.4)"
          strokeDasharray="4 6"
        />
        {/* 宋营 */}
        <g transform="translate(60 130)">
          <rect x="-10" y="-2" width="20" height="14" fill="#7d1f10" />
          <path d="M-12 -4 L0 -10 L12 -4 Z" fill="#5d160a" />
          <line x1="0" y1="-22" x2="0" y2="-2" stroke="#1a1410" strokeWidth="1" />
          <path d="M0 -20 L14 -16 L10 -8 L14 -2 L0 -2 Z" fill="#a23420" />
        </g>
        {/* 辽营 */}
        <g transform="translate(320 130)">
          <rect x="-10" y="-2" width="20" height="14" fill="#33493b" />
          <path d="M-12 -4 L0 -10 L12 -4 Z" fill="#1a2630" />
          <line x1="0" y1="-22" x2="0" y2="-2" stroke="#1a1410" strokeWidth="1" />
          <path d="M0 -20 L14 -16 L10 -8 L14 -2 L0 -2 Z" fill="#4a6852" />
        </g>
        {/* 两枚印章同步落定 */}
        <g style={{ animation: "chanyuanStamp 3.5s ease-out infinite" }}>
          <rect
            x="135"
            y="138"
            width="50"
            height="22"
            fill="#a23420"
            stroke="#5d160a"
            strokeWidth="2"
          />
          <text
            x="160"
            y="154"
            textAnchor="middle"
            fontFamily="ZCOOL XiaoWei, serif"
            fontSize="14"
            fill="#f5ecd5"
          >
            宋
          </text>
        </g>
        <g style={{ animation: "chanyuanStamp 3.5s ease-out 0.2s infinite" }}>
          <rect
            x="215"
            y="138"
            width="50"
            height="22"
            fill="#a23420"
            stroke="#5d160a"
            strokeWidth="2"
          />
          <text
            x="240"
            y="154"
            textAnchor="middle"
            fontFamily="ZCOOL XiaoWei, serif"
            fontSize="14"
            fill="#f5ecd5"
          >
            辽
          </text>
        </g>
        {/* 笔触扫光 */}
        <rect
          x="0"
          y="0"
          width="40"
          height="240"
          fill="rgba(245,236,213,0.6)"
          style={{ animation: "chanyuanBrush 3.5s linear infinite" }}
        />
      </svg>
      <div className="absolute left-4 top-3 seal text-[10px]">澶渊之盟</div>
      <div className="absolute right-4 top-3 font-mono text-[10px] tracking-[0.2em] text-mo-700/80">
        FX · SVG · 3.5s LOOP
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 font-brush text-xl text-mo-900/85">
        宋辽约为兄弟之国
      </div>
      <style>{`
        @keyframes chanyuanStamp {
          0%   { transform: translateY(-60px) scale(1.4); opacity: 0; }
          30%  { transform: translateY(0) scale(1); opacity: 1; }
          90%  { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0; }
        }
        @keyframes chanyuanBrush {
          0%   { transform: translateX(-50px); }
          50%  { transform: translateX(420px); }
          100% { transform: translateX(420px); }
        }
      `}</style>
    </div>
  );
}

// 特殊效果 2：岐沟关溃败
// SVG 河流 + 飞溅血点 + 战马阵列
export function FxQigou() {
  // 动态生成 SVG 飞溅点
  const splatters = Array.from({ length: 18 }).map((_, i) => ({
    x: 80 + Math.random() * 320,
    y: 140 + Math.random() * 40,
    r: 1.5 + Math.random() * 3.5,
    delay: Math.random() * 2,
  }));
  const horses = Array.from({ length: 6 }).map((_, i) => ({
    x: 100 + i * 50,
    y: 80 + (i % 2) * 12,
    delay: i * 0.1,
  }));

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #5d160a 0%, #2a2018 60%, #1a1410 100%)",
      }}
    >
      <svg
        viewBox="0 0 400 240"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 沙河 */}
        <defs>
          <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d1f10" />
            <stop offset="60%" stopColor="#a23420" />
            <stop offset="100%" stopColor="#5b4634" />
          </linearGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2c20" />
            <stop offset="100%" stopColor="#5d160a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="140" fill="url(#sky)" />
        {/* 远山 */}
        <path
          d="M0 120 L60 90 L120 110 L180 80 L260 100 L340 80 L400 95 L400 140 L0 140 Z"
          fill="rgba(14,10,7,0.5)"
        />
        {/* 沙河 */}
        <rect x="0" y="160" width="400" height="80" fill="url(#river)" />
        {/* 流水波纹 */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={i * 70}
            y1={170 + (i % 2) * 10}
            x2={i * 70 + 50}
            y2={170 + (i % 2) * 10}
            stroke="rgba(245,236,213,0.4)"
            strokeWidth="1.5"
          >
            <animate
              attributeName="x1"
              values={`${i * 70};${i * 70 + 400}`}
              dur={`${3 + i * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values={`${i * 70 + 50};${i * 70 + 450}`}
              dur={`${3 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
        {/* 血点 */}
        {splatters.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#c8523f" opacity="0.8">
            <animate
              attributeName="r"
              values={`${s.r};${s.r * 2};${s.r * 0.5}`}
              dur="1.5s"
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0"
              dur="1.5s"
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        {/* 战马阵列（由右向左冲） */}
        {horses.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${h.y})`}>
            <g>
              <ellipse cx="0" cy="0" rx="18" ry="6" fill="rgba(14,10,7,0.85)" />
              <circle cx="-14" cy="-2" r="4" fill="rgba(14,10,7,0.85)" />
              <line x1="-2" y1="6" x2="-2" y2="14" stroke="rgba(14,10,7,0.85)" strokeWidth="1.5" />
              <line x1="6" y1="6" x2="6" y2="14" stroke="rgba(14,10,7,0.85)" strokeWidth="1.5" />
              <line x1="14" y1="6" x2="14" y2="14" stroke="rgba(14,10,7,0.85)" strokeWidth="1.5" />
              <line x1="2" y1="-6" x2="2" y2="-12" stroke="rgba(14,10,7,0.85)" strokeWidth="1.2" />
              <line x1="-4" y1="-7" x2="-10" y2="-14" stroke="#a23420" strokeWidth="1.4" />
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`${h.x + 200} ${h.y};${h.x - 80} ${h.y}`}
                dur={`${2 + i * 0.2}s`}
                begin={`${h.delay}s`}
                repeatCount="indefinite"
              />
            </g>
          </g>
        ))}
        {/* 落水小兵 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`drown-${i}`}>
            <circle
              cx={50 + i * 40}
              cy={170 + (i % 3) * 6}
              r="3"
              fill="rgba(14,10,7,0.85)"
            >
              <animate
                attributeName="cy"
                values={`${150 + (i % 3) * 6};180`
              }
                dur="1s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0"
                dur="1s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
      <div className="absolute left-4 top-3 seal text-[10px]">岐沟关</div>
      <div className="absolute right-4 top-3 font-mono text-[10px] tracking-[0.2em] text-xuan-100/80">
        FX · SVG · LOOP
      </div>
      <div className="absolute right-4 bottom-3 font-brush text-lg text-xuan-100/90">
        沙河为之不流
      </div>
    </div>
  );
}

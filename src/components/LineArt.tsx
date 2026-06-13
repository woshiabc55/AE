/**
 * 线条绘制纹化层
 * - SVG 几何图案（嵌套方框、十字刻度、同心圆）
 * - 路径通过 stroke-dasharray / stroke-dashoffset 实现"绘制"动效
 * - 叠加颗粒滤镜，让线条带有"工业蓝图"般的纹理感
 */
export default function LineArt() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0.5 }}
      >
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="grainStrong" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.4"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* 左上：嵌套方框 + 刻度 */}
        <g
          stroke="#7CF6FF"
          strokeWidth="0.18"
          fill="none"
          style={{ mixBlendMode: "screen" }}
        >
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            strokeDasharray="1 1"
            className="animate-spin120"
            style={{ transformOrigin: "10px 10px" }}
          />
          <rect
            x="5"
            y="5"
            width="10"
            height="10"
            strokeDasharray="3 0.6"
            className="animate-spin60"
            style={{ transformOrigin: "10px 10px", animationDirection: "reverse" }}
          />
          <rect
            x="6.5"
            y="6.5"
            width="7"
            height="7"
            stroke="#FF2A2A"
            strokeWidth="0.12"
            strokeDasharray="0.4 0.4"
            className="animate-spin60"
            style={{ transformOrigin: "10px 10px" }}
          />
        </g>

        {/* 右上：圆 + 十字 */}
        <g
          stroke="#FF8A2A"
          strokeWidth="0.18"
          fill="none"
          style={{ mixBlendMode: "screen" }}
        >
          <circle
            cx="90"
            cy="10"
            r="5"
            strokeDasharray="0.6 0.4"
            className="animate-spin60"
            style={{ transformOrigin: "90px 10px" }}
          />
          <circle
            cx="90"
            cy="10"
            r="2.4"
            strokeDasharray="0.2 0.4"
            className="animate-spin120"
            style={{ transformOrigin: "90px 10px", animationDirection: "reverse" }}
          />
          <line x1="82" y1="10" x2="98" y2="10" strokeWidth="0.08" />
          <line x1="90" y1="2" x2="90" y2="18" strokeWidth="0.08" />
        </g>

        {/* 左下：水平刻度 */}
        <g
          stroke="#7CF6FF"
          strokeWidth="0.12"
          fill="none"
          style={{ mixBlendMode: "screen" }}
        >
          <line x1="3" y1="92" x2="22" y2="92" />
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={i}
              x1={3 + i * 1}
              y1={i % 5 === 0 ? 90.5 : 91.4}
              x2={3 + i * 1}
              y2={92}
            />
          ))}
        </g>

        {/* 右下：三角与对角线 */}
        <g
          stroke="#FF2A2A"
          strokeWidth="0.18"
          fill="none"
          style={{ mixBlendMode: "screen" }}
        >
          <polygon
            points="83,93 95,93 89,84"
            strokeDasharray="0.5 0.3"
            className="animate-spin60"
            style={{ transformOrigin: "89px 90px" }}
          />
          <line x1="80" y1="84" x2="98" y2="96" strokeWidth="0.08" />
        </g>

        {/* 顶部细线（沿顶部） */}
        <g
          stroke="#7CF6FF"
          strokeWidth="0.08"
          fill="none"
          opacity="0.4"
        >
          <line x1="22" y1="6" x2="78" y2="6" strokeDasharray="2 0.6" />
        </g>

        {/* 底部细线 */}
        <g
          stroke="#FF8A2A"
          strokeWidth="0.08"
          fill="none"
          opacity="0.4"
        >
          <line x1="22" y1="86" x2="78" y2="86" strokeDasharray="2 0.6" />
        </g>

        {/* 中心微光：六芒星（淡） */}
        <g
          stroke="#FF2A2A"
          strokeWidth="0.06"
          fill="none"
          opacity="0.35"
          className="animate-spin120"
          style={{ transformOrigin: "50px 50px" }}
        >
          <polygon
            points="50,38 56,50 50,62 44,50"
            strokeDasharray="0.3 0.2"
          />
          <polygon
            points="38,50 50,44 62,50 50,56"
            strokeDasharray="0.3 0.2"
          />
        </g>

        {/* 颗粒纹理覆盖 */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          filter="url(#grain)"
          opacity="0.18"
        />
      </svg>
    </div>
  );
}

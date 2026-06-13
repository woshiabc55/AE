/**
 * 综合纹理层：
 * 1. 蓝图网格（major + minor）
 * 2. 镂空金属网孔（六边形点阵）
 * 3. 拉丝金属（水平划痕）
 * 4. 半色调点阵（vintage print）
 * 5. 混凝土 / 纸质颗粒
 * 6. 胶片颗粒（动态 turbulence）
 * 7. 工业刻度（边缘角标）
 *
 * 各层均低透明度叠加，blend-mode: screen / overlay
 */
export default function TextureLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* 1. 蓝图双层网格 */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          mixBlendMode: "screen",
          backgroundImage: [
            "linear-gradient(to right, #7CF6FF 1px, transparent 1px)",
            "linear-gradient(to bottom, #7CF6FF 1px, transparent 1px)",
            "linear-gradient(to right, rgba(124,246,255,0.4) 0.5px, transparent 0.5px)",
            "linear-gradient(to bottom, rgba(124,246,255,0.4) 0.5px, transparent 0.5px)",
          ].join(","),
          backgroundSize: "96px 96px, 96px 96px, 12px 12px, 12px 12px",
        }}
      />

      {/* 2. 镂空金属网孔（圆形冲孔） */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          mixBlendMode: "screen",
          backgroundImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.95) 1.6px, transparent 2.4px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />

      {/* 3. 拉丝金属（水平划痕） */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.5) 3px,
            rgba(255,255,255,0.5) 3.4px,
            transparent 3.4px,
            transparent 7px
          )`,
        }}
      />

      {/* 4. 半色调点阵（vintage print 渐变） */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          mixBlendMode: "screen",
          backgroundImage:
            "radial-gradient(circle, rgba(255,42,42,0.7) 0.8px, transparent 1.2px)",
          backgroundSize: "10px 10px",
        }}
      />

      {/* 5. 混凝土 / 纸纹（静态 turbulence，颗粒更细） */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        style={{ opacity: 0.35, mixBlendMode: "overlay" }}
      >
        <filter id="paper-tex">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.25 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-tex)" />
      </svg>

      {/* 6. 胶片颗粒（动态 turbulence） */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        style={{ opacity: 0.18, mixBlendMode: "screen" }}
      >
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            stitchTiles="stitch"
            seed="3"
          >
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.55;0.95;0.55"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>

      {/* 7. 工业刻度（边缘角标 + 像素化数字） */}
      <IndustrialRulers />
    </div>
  );
}

function IndustrialRulers() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      style={{ opacity: 0.35, mixBlendMode: "screen" }}
    >
      {/* 顶部刻度 */}
      <g stroke="#7CF6FF" strokeWidth="0.4" fill="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <line
            key={`t-${i}`}
            x1={i * 2.5}
            y1={i % 5 === 0 ? 0 : 0.6}
            x2={i * 2.5}
            y2={i % 5 === 0 ? 1.4 : 0.9}
          />
        ))}
      </g>
      {/* 底部刻度 */}
      <g stroke="#FF8A2A" strokeWidth="0.4" fill="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <line
            key={`b-${i}`}
            x1={i * 2.5}
            y1={i % 5 === 0 ? 98.6 : 99.1}
            x2={i * 2.5}
            y2={i % 5 === 0 ? 100 : 99.4}
          />
        ))}
      </g>
      {/* 左侧刻度 */}
      <g stroke="#7CF6FF" strokeWidth="0.4" fill="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`l-${i}`}
            x1={i % 4 === 0 ? 0 : 0.6}
            y1={i * 4.17}
            x2={i % 4 === 0 ? 1.4 : 0.9}
            y2={i * 4.17}
          />
        ))}
      </g>
      {/* 右侧刻度 */}
      <g stroke="#FF2A2A" strokeWidth="0.4" fill="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`r-${i}`}
            x1={i % 4 === 0 ? 98.6 : 99.1}
            y1={i * 4.17}
            x2={i % 4 === 0 ? 100 : 99.4}
            y2={i * 4.17}
          />
        ))}
      </g>
      {/* 工业坐标小标签 */}
      <g
        fill="#7CF6FF"
        fontFamily="JetBrains Mono, monospace"
        fontSize="1.6"
        opacity="0.6"
      >
        <text x="1" y="3.4">X:00</text>
        <text x="92" y="3.4">Y:00</text>
        <text x="1" y="99">Z:00</text>
        <text x="92" y="99">M-09</text>
      </g>
    </svg>
  );
}

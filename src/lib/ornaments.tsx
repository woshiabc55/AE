import { type ReactNode } from "react";

/* 青铜回纹分隔线 · 用于段落之间 */
export function BronzeDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-bronze-500" />
      <svg
        width="42"
        height="14"
        viewBox="0 0 42 14"
        fill="none"
        className="text-bronze-500"
        aria-hidden
      >
        <path
          d="M0 7 H8 M12 7 H30 M34 7 H42 M21 0 V14 M14 2 L14 12 M28 2 L28 12"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="21" cy="7" r="2" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-bronze-500" />
    </div>
  );
}

/* 青铜回纹圆盘 · 用于页脚/标题装饰 */
export function BronzeRoundel({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className="text-bronze-500"
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="0.6" />
      <path
        d="M32 4 L32 14 M32 50 L32 60 M4 32 L14 32 M50 32 L60 32 M14 14 L20 20 M44 44 L50 50 M14 50 L20 44 M44 20 L50 14"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M22 22 Q32 18 42 22 Q46 32 42 42 Q32 46 22 42 Q18 32 22 22 Z"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

/* 楔形站位剪影 · 用于 Hero */
export function WedgeSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 360"
      className={className}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="wedgeFade" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#0A0612" stopOpacity="0" />
          <stop offset="40%" stopColor="#3A2A6B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0A0612" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A5C2E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D4A24C" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9ED1FF" stopOpacity="1" />
          <stop offset="60%" stopColor="#4FA8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4FA8FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 远景光晕（穿界门洞） */}
      <circle cx="300" cy="120" r="60" fill="url(#coreGlow)" opacity="0.5" />

      {/* 楔形五条剪影（最前→最末） */}
      {[
        { x: 300, scale: 1, id: 1 },
        { x: 240, scale: 0.92, id: 9 },
        { x: 360, scale: 0.92, id: 10 },
        { x: 180, scale: 0.82, id: 2 },
        { x: 420, scale: 0.82, id: 3 },
      ].map((p) => (
        <g key={p.id} transform={`translate(${p.x} 280) scale(${p.scale})`}>
          <path
            d="M0 0 C -10 -50 -8 -80 -2 -100 C 0 -110 0 -110 2 -100 C 8 -80 10 -50 0 0 Z"
            fill="url(#wedgeFade)"
          />
          <circle cx="0" cy="-110" r="6" fill="#0A0612" stroke="#D4A24C" strokeWidth="0.6" />
          {p.id === 10 && (
            <>
              <path
                d="M-2 -95 L -50 -120 M2 -95 L 50 -120 M-2 -90 L -45 -110 M2 -90 L 45 -110"
                stroke="url(#wingGrad)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M-50 -120 L -42 -118 M50 -120 L 42 -118 M-45 -110 L -38 -109 M45 -110 L 38 -109"
                stroke="#D4A24C"
                strokeWidth="0.4"
                opacity="0.6"
              />
            </>
          )}
          {p.id === 9 && (
            <circle cx="2" cy="-78" r="3" fill="url(#coreGlow)">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="3.6s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}

      {/* 地面剪影 */}
      <path d="M0 280 L 600 280 L 600 360 L 0 360 Z" fill="#0A0612" />
      <path
        d="M0 280 L 600 280 M120 290 L 480 290 M200 305 L 400 305"
        stroke="#3A2A6B"
        strokeWidth="0.4"
        opacity="0.6"
      />
    </svg>
  );
}

/* 体积云 SVG */
export function VolumetricCloud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#1B1233" stopOpacity="0" />
          <stop offset="20%" stopColor="#2A1B47" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#3A2A6B" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#1B1233" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0A0612" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 100 Q 60 60 120 90 T 240 100 Q 300 70 360 95 T 480 100 Q 540 65 600 90 T 720 100 Q 780 75 840 95 T 960 100 Q 1020 70 1080 95 T 1200 100 L 1200 200 L 0 200 Z"
        fill="url(#cloudGrad)"
      />
      <path
        d="M0 130 Q 80 100 160 125 T 320 135 Q 400 110 480 130 T 640 140 Q 720 115 800 135 T 960 140 Q 1040 120 1120 135 T 1200 140 L 1200 200 L 0 200 Z"
        fill="url(#cloudGrad)"
        opacity="0.6"
      />
    </svg>
  );
}

/* 光柱 */
export function LightPillar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`light-pillar absolute top-0 h-full w-16 ${className}`}
      aria-hidden
    />
  );
}

/* 能量核心 SVG · 含呼吸节律 */
export function CoreOrb({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="30%" stopColor="#9ED1FF" stopOpacity="1" />
          <stop offset="65%" stopColor="#4FA8FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2A7DD6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4FA8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4FA8FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#orbAura)">
        <animate
          attributeName="r"
          values="32;42;32"
          dur="3.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="3.6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="40" cy="40" r="14" fill="url(#orbCore)" />
      <circle
        cx="40"
        cy="40"
        r="20"
        fill="none"
        stroke="#9ED1FF"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <circle
        cx="40"
        cy="40"
        r="26"
        fill="none"
        stroke="#4FA8FF"
        strokeWidth="0.4"
        opacity="0.4"
        strokeDasharray="2 4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 40 40"
          to="360 40 40"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/* 穿界门 SVG · 含 2Hz 涟漪 */
export function GatePortal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="gateBronze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A88652" />
          <stop offset="100%" stopColor="#5A4220" />
        </linearGradient>
        <radialGradient id="gateTunnel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A24C" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#3A2A6B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0A0612" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* 内部隧道 */}
      <ellipse
        cx="100"
        cy="140"
        rx="70"
        ry="110"
        fill="url(#gateTunnel)"
      />

      {/* 涟漪环（2Hz） */}
      <ellipse
        cx="100"
        cy="140"
        rx="55"
        ry="90"
        fill="none"
        stroke="#D4A24C"
        strokeWidth="0.6"
        opacity="0.5"
      >
        <animate
          attributeName="rx"
          values="55;75;55"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="90;115;90"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse
        cx="100"
        cy="140"
        rx="50"
        ry="85"
        fill="none"
        stroke="#9ED1FF"
        strokeWidth="0.5"
        opacity="0.4"
      >
        <animate
          attributeName="rx"
          values="50;72;50"
          dur="0.5s"
          begin="0.25s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="85;110;85"
          dur="0.5s"
          begin="0.25s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="0.5s"
          begin="0.25s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* 门框（青铜回纹） */}
      <path
        d="M30 20 L 30 260 L 50 260 L 50 40 L 150 40 L 150 260 L 170 260 L 170 20 Z"
        fill="url(#gateBronze)"
        opacity="0.95"
      />
      <path
        d="M50 40 L 60 50 L 60 250 L 70 250 L 70 50 L 130 50 L 130 250 L 140 250 L 140 50 L 150 40"
        stroke="#D4A24C"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M30 20 L 50 40 M 170 20 L 150 40 M 30 260 L 50 240 M 170 260 L 150 240"
        stroke="#D4A24C"
        strokeWidth="0.8"
      />
      {/* 顶部装饰 */}
      <path
        d="M85 20 L 100 0 L 115 20 Z"
        fill="url(#gateBronze)"
        stroke="#D4A24C"
        strokeWidth="0.4"
      />
      <path
        d="M40 100 L 50 100 M 40 130 L 50 130 M 40 160 L 50 160 M 40 190 L 50 190 M 150 100 L 160 100 M 150 130 L 160 130 M 150 160 L 160 160 M 150 190 L 160 190"
        stroke="#D4A24C"
        strokeWidth="0.4"
      />
    </svg>
  );
}

/* 通用 section header */
export function SectionHeader({
  index,
  en,
  zh,
  intro,
}: {
  index: string;
  en: string;
  zh: string;
  intro?: string;
}) {
  return (
    <div className="mb-10 flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest2 text-bronze-400">
          {index}
        </span>
        <span className="h-px w-10 bg-bronze-500" />
        <span className="font-display text-xs uppercase italic tracking-widest text-bronze-300/80">
          {en}
        </span>
      </div>
      <h2 className="font-serif text-3xl font-bold text-gold-200 md:text-4xl">
        {zh}
      </h2>
      {intro && (
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200/70 md:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}

export function Reveal({ children }: { children: ReactNode }) {
  return (
    <div className="opacity-0 animate-rise [animation-delay:0.15s]">
      {children}
    </div>
  );
}

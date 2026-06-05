// 龙纹 SVG 装饰组件
import type { SVGProps } from "react";

export function DragonScalePattern(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <pattern id="scales" x="0" y="0" width="40" height="34" patternUnits="userSpaceOnUse">
          <path
            d="M0 17 Q 10 0 20 17 Q 30 34 40 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M-10 0 Q 0 -17 10 0 Q 20 17 30 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M10 34 Q 20 17 30 34 Q 40 51 50 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#scales)" />
    </svg>
  );
}

// 抽象龙形侧影（用于 Hero 区背景）
export function DragonSilhouette(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="dragonFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#0a8aaa" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff2d4a" stopOpacity="0.85" />
        </linearGradient>
        <filter id="dragonBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <g filter="url(#dragonBlur)" stroke="url(#dragonFade)" strokeWidth="1.4" fill="none">
        {/* 龙身主体曲线 */}
        <path d="M60 420 C 180 380, 240 360, 320 320 S 460 220, 560 200 S 720 220, 760 280" />
        {/* 龙脊刺 */}
        <path d="M120 410 l 10 -22 l 10 22" />
        <path d="M170 400 l 10 -22 l 10 22" />
        <path d="M220 380 l 10 -22 l 10 22" />
        <path d="M270 360 l 10 -22 l 10 22" />
        <path d="M320 332 l 10 -22 l 10 22" />
        <path d="M370 305 l 10 -22 l 10 22" />
        <path d="M420 275 l 10 -22 l 10 22" />
        <path d="M470 245 l 10 -22 l 10 22" />
        <path d="M520 222 l 10 -22 l 10 22" />
        <path d="M570 210 l 10 -22 l 10 22" />
        <path d="M620 210 l 10 -22 l 10 22" />
        <path d="M670 220 l 10 -22 l 10 22" />
        {/* 龙头 */}
        <path d="M755 275 c 10 -10, 22 -16, 30 -8 c 5 5, 0 12 -8 14 c -10 2 -18 0 -22 -6 z" />
        <path d="M780 252 l 6 -10 l 4 8 l -6 8 z" />
        <circle cx="780" cy="265" r="2" fill="#ff2d4a" />
        {/* 龙须 */}
        <path d="M770 280 c -10 8, -20 18, -28 26" />
        <path d="M770 282 c -8 14, -14 26, -16 38" />
        {/* 鳞片纹路 */}
        <path d="M150 410 q 8 -10 16 0" />
        <path d="M200 395 q 8 -10 16 0" />
        <path d="M250 375 q 8 -10 16 0" />
        <path d="M300 350 q 8 -10 16 0" />
        <path d="M350 320 q 8 -10 16 0" />
        <path d="M400 290 q 8 -10 16 0" />
        <path d="M450 260 q 8 -10 16 0" />
        <path d="M500 235 q 8 -10 16 0" />
        <path d="M550 218 q 8 -10 16 0" />
        <path d="M600 212 q 8 -10 16 0" />
        <path d="M650 220 q 8 -10 16 0" />
        <path d="M700 240 q 8 -10 16 0" />
      </g>
    </svg>
  );
}

// 印章/篆刻风 SVG
export function SealStamp({ char, color = "#ff2d4a" }: { char: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        fill="none"
        stroke={color}
        strokeWidth="4"
        rx="2"
      />
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        rx="1"
      />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily='"Noto Serif SC", serif'
        fontSize="40"
        fontWeight="900"
        fill={color}
        letterSpacing="2"
      >
        {char}
      </text>
    </svg>
  );
}

// 菱形 HUD 元素
export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 0 L 16 8 L 8 16 L 0 8 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * 英雄肖像 SVG
 * 每个职业的英雄都有独特的精细 SVG 头像
 */

export const HERO_PORTRAITS = {
  paladin: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hero-pala-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="60%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#3a2a08"/>
        </radialGradient>
        <linearGradient id="hero-pala-armor" x1="0" x2="1">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="100%" stop-color="#d4af37"/>
        </linearGradient>
        <radialGradient id="hero-pala-aura" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#hero-pala-bg)"/>
      <!-- 神圣光环 -->
      <circle cx="50" cy="50" r="48" fill="url(#hero-pala-aura)"/>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff5d0" stroke-width="0.6" opacity="0.6"/>
      <!-- 肩甲 -->
      <path d="M14 50 Q18 36 30 38 L30 70 Q18 72 14 78 Z" fill="url(#hero-pala-armor)" stroke="#8a6d1f" stroke-width="0.6"/>
      <path d="M86 50 Q82 36 70 38 L70 70 Q82 72 86 78 Z" fill="url(#hero-pala-armor)" stroke="#8a6d1f" stroke-width="0.6"/>
      <!-- 头部 -->
      <ellipse cx="50" cy="42" rx="18" ry="20" fill="#f0c898" stroke="#8a6d1f" stroke-width="0.5"/>
      <!-- 头盔 -->
      <path d="M32 32 Q32 18 50 16 Q68 18 68 32 L66 38 L34 38 Z" fill="url(#hero-pala-armor)" stroke="#8a6d1f" stroke-width="0.6"/>
      <path d="M36 22 Q50 16 64 22" fill="none" stroke="#fff5d0" stroke-width="0.8"/>
      <!-- 头冠 -->
      <path d="M44 18 L48 8 L52 18 Z" fill="#fff5d0" stroke="#8a6d1f" stroke-width="0.4"/>
      <!-- 眼睛 -->
      <ellipse cx="44" cy="44" rx="1.5" ry="2" fill="#1a1a2a"/>
      <ellipse cx="56" cy="44" rx="1.5" ry="2" fill="#1a1a2a"/>
      <!-- 眉毛 -->
      <path d="M40 40 L48 41 M52 41 L60 40" stroke="#fff" stroke-width="0.6" fill="none"/>
      <!-- 鼻 -->
      <path d="M50 46 L48 51 L52 51 Z" fill="#d4a878" opacity="0.6"/>
      <!-- 嘴 -->
      <path d="M46 56 Q50 58 54 56" stroke="#8a6d1f" stroke-width="0.5" fill="none"/>
      <!-- 胡须 -->
      <path d="M44 60 Q50 70 56 60 L54 65 Q50 72 46 65 Z" fill="#fff5d0" stroke="#8a6d1f" stroke-width="0.4"/>
      <!-- 胸甲 -->
      <path d="M30 60 L70 60 L68 96 L32 96 Z" fill="url(#hero-pala-armor)" stroke="#8a6d1f" stroke-width="0.6"/>
      <!-- 十字 -->
      <rect x="46" y="68" width="8" height="20" fill="#fff5d0"/>
      <rect x="40" y="74" width="20" height="8" fill="#fff5d0"/>
      <rect x="48" y="66" width="4" height="24" fill="#d4af37"/>
      <rect x="38" y="76" width="24" height="4" fill="#d4af37"/>
      <!-- 圣光 -->
      <g stroke="#fff" stroke-width="0.6" opacity="0.7">
        <line x1="50" y1="0" x2="50" y2="6"/>
        <line x1="20" y1="20" x2="24" y2="24"/>
        <line x1="80" y1="20" x2="76" y2="24"/>
      </g>
    </svg>
  `,

  warlock: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hero-lock-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#5a8a4a"/>
          <stop offset="50%" stop-color="#3a1a5a"/>
          <stop offset="100%" stop-color="#0a0420"/>
        </radialGradient>
        <radialGradient id="hero-lock-eye" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#ff6b81"/>
          <stop offset="100%" stop-color="#6b0f1d"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#hero-lock-bg)"/>
      <!-- 虚空符文 -->
      <g opacity="0.5" stroke="#a51c2e" stroke-width="0.4" fill="none">
        <circle cx="50" cy="50" r="46"/>
        <path d="M50 4 L52 12 L48 12 Z" fill="#a51c2e"/>
        <path d="M50 96 L48 88 L52 88 Z" fill="#a51c2e"/>
        <path d="M4 50 L12 52 L12 48 Z" fill="#a51c2e"/>
        <path d="M96 50 L88 48 L88 52 Z" fill="#a51c2e"/>
      </g>
      <!-- 头巾 / 兜帽 -->
      <path d="M18 50 Q18 24 50 18 Q82 24 82 50 L78 60 Q70 50 50 50 Q30 50 22 60 Z" fill="#2a0a1a" stroke="#5a0a14" stroke-width="0.6"/>
      <!-- 脸 -->
      <ellipse cx="50" cy="56" rx="20" ry="22" fill="#5a8a4a" stroke="#2a4a2a" stroke-width="0.6"/>
      <!-- 眼眶 -->
      <ellipse cx="42" cy="52" rx="5" ry="6" fill="#1a0408"/>
      <ellipse cx="58" cy="52" rx="5" ry="6" fill="#1a0408"/>
      <!-- 炽热之眼 -->
      <ellipse cx="42" cy="52" rx="3" ry="4" fill="url(#hero-lock-eye)"/>
      <ellipse cx="58" cy="52" rx="3" ry="4" fill="url(#hero-lock-eye)"/>
      <circle cx="42" cy="52" r="1" fill="#fff"/>
      <circle cx="58" cy="52" r="1" fill="#fff"/>
      <!-- 嘴 -->
      <path d="M44 70 L48 75 L52 75 L56 70" stroke="#1a0408" stroke-width="0.6" fill="#1a0408"/>
      <!-- 牙 -->
      <path d="M48 75 L49 78 L51 78 L52 75" fill="#fff" stroke="none"/>
      <!-- 护肩 -->
      <path d="M20 78 Q24 70 30 72 L30 90 L20 92 Z" fill="#3a1a2a" stroke="#5a0a14" stroke-width="0.5"/>
      <path d="M80 78 Q76 70 70 72 L70 90 L80 92 Z" fill="#3a1a2a" stroke="#5a0a14" stroke-width="0.5"/>
      <!-- 胸甲 -->
      <path d="M30 78 L70 78 L68 98 L32 98 Z" fill="#2a0a1a" stroke="#5a0a14" stroke-width="0.5"/>
      <!-- 法阵符号 -->
      <circle cx="50" cy="88" r="4" fill="none" stroke="#a51c2e" stroke-width="0.6"/>
      <circle cx="50" cy="88" r="2" fill="#a51c2e"/>
      <!-- 角 -->
      <path d="M28 24 L18 14 L24 22 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.4"/>
      <path d="M72 24 L82 14 L76 22 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.4"/>
    </svg>
  `,

  druid: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hero-dru-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#a0d4a0"/>
          <stop offset="50%" stop-color="#3a6e4e"/>
          <stop offset="100%" stop-color="#0a1a08"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#hero-dru-bg)"/>
      <!-- 树纹 -->
      <g opacity="0.4" stroke="#2d6e4e" fill="none" stroke-width="0.4">
        <path d="M0 80 Q20 70 30 75 Q40 65 50 70 Q60 60 70 70 Q80 65 100 75"/>
        <path d="M20 90 Q30 80 40 85"/>
        <path d="M60 88 Q70 80 80 85"/>
      </g>
      <!-- 鹿角 -->
      <g stroke="#5a3a1a" stroke-width="2.5" fill="#5a3a1a" stroke-linecap="round">
        <path d="M30 28 L24 18 L20 22 M30 28 L26 14 L30 18 M30 28 L18 10"/>
        <path d="M70 28 L76 18 L80 22 M70 28 L74 14 L70 18 M70 28 L82 10"/>
      </g>
      <!-- 头部 -->
      <ellipse cx="50" cy="50" rx="20" ry="22" fill="#5a8a4a" stroke="#2d4e2e" stroke-width="0.5"/>
      <!-- 头发（藤蔓） -->
      <g stroke="#2d6e4e" stroke-width="1" fill="none" stroke-linecap="round">
        <path d="M32 38 Q30 28 34 22"/>
        <path d="M40 34 Q38 24 42 18"/>
        <path d="M60 34 Q62 24 58 18"/>
        <path d="M68 38 Q70 28 66 22"/>
      </g>
      <!-- 叶子 -->
      <g fill="#5a8a4a" stroke="#2d4e2e" stroke-width="0.3">
        <ellipse cx="34" cy="20" rx="2" ry="3" transform="rotate(-30 34 20)"/>
        <ellipse cx="42" cy="16" rx="2" ry="3" transform="rotate(-15 42 16)"/>
        <ellipse cx="58" cy="16" rx="2" ry="3" transform="rotate(15 58 16)"/>
        <ellipse cx="66" cy="20" rx="2" ry="3" transform="rotate(30 66 20)"/>
      </g>
      <!-- 眼睛（琥珀色） -->
      <ellipse cx="44" cy="50" rx="2" ry="2.5" fill="#ffd76b"/>
      <ellipse cx="56" cy="50" rx="2" ry="2.5" fill="#ffd76b"/>
      <ellipse cx="44" cy="50" rx="0.8" ry="1" fill="#1a1a1a"/>
      <ellipse cx="56" cy="50" rx="0.8" ry="1" fill="#1a1a1a"/>
      <!-- 鼻 -->
      <ellipse cx="50" cy="58" rx="1.5" ry="1" fill="#3a5a3a"/>
      <!-- 嘴 -->
      <path d="M46 64 Q50 66 54 64" stroke="#2d4e2e" stroke-width="0.5" fill="none"/>
      <!-- 纹身 -->
      <g stroke="#1a3a1a" stroke-width="0.4" fill="none" opacity="0.7">
        <path d="M30 60 Q35 58 38 62"/>
        <path d="M62 62 Q65 58 70 60"/>
        <path d="M30 70 L70 70"/>
        <path d="M32 76 L68 76"/>
      </g>
      <!-- 肩膀（树叶披风） -->
      <path d="M20 76 Q24 70 32 72 L32 96 L20 96 Z" fill="#2d6e4e" stroke="#1a3a1a" stroke-width="0.4"/>
      <path d="M80 76 Q76 70 68 72 L68 96 L80 96 Z" fill="#2d6e4e" stroke="#1a3a1a" stroke-width="0.4"/>
      <!-- 胸甲（皮） -->
      <path d="M32 76 L68 76 L66 98 L34 98 Z" fill="#5a3a1a" stroke="#3a1a08" stroke-width="0.4"/>
      <!-- 自然宝石 -->
      <circle cx="50" cy="86" r="3" fill="#a0d4a0" stroke="#2d6e4e" stroke-width="0.4"/>
      <circle cx="50" cy="86" r="1.2" fill="#fff" opacity="0.7"/>
    </svg>
  `,

  mage: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hero-mage-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#a8e0ff"/>
          <stop offset="50%" stop-color="#3a5a8a"/>
          <stop offset="100%" stop-color="#0a1a3a"/>
        </radialGradient>
        <radialGradient id="hero-mage-orb" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#fff"/>
          <stop offset="50%" stop-color="#5fd1ff"/>
          <stop offset="100%" stop-color="#1a3a5a"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#hero-mage-bg)"/>
      <!-- 法阵 -->
      <g stroke="#5fd1ff" fill="none" opacity="0.5">
        <circle cx="50" cy="50" r="46" stroke-width="0.4"/>
        <circle cx="50" cy="50" r="40" stroke-width="0.3"/>
        <path d="M50 6 L52 14 L48 14 Z" fill="#5fd1ff"/>
        <path d="M50 94 L48 86 L52 86 Z" fill="#5fd1ff"/>
        <path d="M6 50 L14 52 L14 48 Z" fill="#5fd1ff"/>
        <path d="M94 50 L86 48 L86 52 Z" fill="#5fd1ff"/>
      </g>
      <!-- 兜帽 -->
      <path d="M22 48 Q22 22 50 16 Q78 22 78 48 L74 56 Q66 46 50 46 Q34 46 26 56 Z" fill="#3a2a5a" stroke="#1a0a3a" stroke-width="0.6"/>
      <!-- 兜帽纹 -->
      <g stroke="#5fd1ff" fill="none" opacity="0.5" stroke-width="0.3">
        <path d="M28 30 Q35 22 50 22"/>
        <path d="M50 22 Q65 22 72 30"/>
        <circle cx="35" cy="32" r="0.6" fill="#5fd1ff"/>
        <circle cx="65" cy="32" r="0.6" fill="#5fd1ff"/>
      </g>
      <!-- 脸 -->
      <ellipse cx="50" cy="50" rx="18" ry="20" fill="#f0c898" stroke="#8a6d1f" stroke-width="0.4"/>
      <!-- 头发（银蓝） -->
      <path d="M34 40 Q34 26 50 24 Q66 26 66 40" fill="none" stroke="#a8e0ff" stroke-width="2" stroke-linecap="round"/>
      <path d="M36 42 L36 48 M64 42 L64 48" stroke="#a8e0ff" stroke-width="1.2" stroke-linecap="round"/>
      <!-- 眼睛（蓝宝石） -->
      <ellipse cx="44" cy="50" rx="1.5" ry="2" fill="#5fd1ff"/>
      <ellipse cx="56" cy="50" rx="1.5" ry="2" fill="#5fd1ff"/>
      <ellipse cx="44" cy="50" rx="0.5" ry="0.7" fill="#fff"/>
      <ellipse cx="56" cy="50" rx="0.5" ry="0.7" fill="#fff"/>
      <!-- 鼻 -->
      <path d="M50 52 L48 56 L52 56 Z" fill="#d4a878" opacity="0.5"/>
      <!-- 嘴 -->
      <path d="M47 60 Q50 61 53 60" stroke="#a51c2e" stroke-width="0.5" fill="none"/>
      <!-- 法袍 -->
      <path d="M24 70 L76 70 L82 98 L18 98 Z" fill="#3a2a5a" stroke="#1a0a3a" stroke-width="0.5"/>
      <!-- 法袍纹路 -->
      <g stroke="#5fd1ff" fill="none" stroke-width="0.3" opacity="0.6">
        <path d="M40 70 L40 98 M50 70 L50 98 M60 70 L60 98"/>
        <path d="M30 84 L70 84"/>
      </g>
      <!-- 胸前法球 -->
      <circle cx="50" cy="86" r="6" fill="url(#hero-mage-orb)"/>
      <circle cx="50" cy="86" r="9" fill="none" stroke="#5fd1ff" stroke-width="0.4" opacity="0.6"/>
      <!-- 漂浮符文 -->
      <g fill="#5fd1ff" opacity="0.7">
        <circle cx="20" cy="30" r="0.8"/>
        <circle cx="80" cy="28" r="0.8"/>
        <circle cx="15" cy="55" r="0.6"/>
        <circle cx="85" cy="58" r="0.6"/>
        <circle cx="22" cy="78" r="0.5"/>
        <circle cx="78" cy="80" r="0.5"/>
      </g>
    </svg>
  `,
};

/**
 * 技能图标 SVG
 */
export const SKILL_ICONS = {
  shield: (color = '#ffd76b') => `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L4 5 L4 12 Q4 18 12 22 Q20 18 20 12 L20 5 Z" fill="#1a0a2a" stroke="${color}" stroke-width="1.5"/>
      <path d="M12 4 L6 6 L6 12 Q6 16 12 19 Q18 16 18 12 L18 6 Z" fill="#3a1a4a" stroke="${color}" stroke-width="0.5"/>
      <path d="M9 10 L11 12 L15 8" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  drain: (color = '#a51c2e') => `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#1a0a2a" stroke="${color}" stroke-width="1.5"/>
      <path d="M12 6 L12 12 L16 16" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="2" fill="${color}"/>
    </svg>
  `,
  claw: (color = '#5a8a4a') => `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 Q8 14 12 12 Q16 10 20 6" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 18 L9 14 M10 16 L13 12 M14 14 L17 10" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 8 L22 4" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  flame: (color = '#ffaa30') => `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 Q8 8 10 12 Q6 10 6 14 Q6 18 12 22 Q18 18 18 14 Q18 10 14 12 Q16 8 12 2 Z" fill="#1a0a2a" stroke="${color}" stroke-width="1.5"/>
      <path d="M12 8 Q10 11 11 14 Q9 13 9 15 Q9 18 12 20 Q15 18 15 15 Q15 13 13 14 Q14 11 12 8 Z" fill="${color}"/>
    </svg>
  `,
};

/**
 * 职业选择大立绘
 */
export const CLASS_PORTRAITS = {
  paladin: () => `
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cls-pala-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="50%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#3a2a08"/>
        </radialGradient>
        <linearGradient id="cls-pala-armor" x1="0" x2="1">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="100%" stop-color="#d4af37"/>
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill="url(#cls-pala-bg)"/>
      <!-- 神圣光柱 -->
      <g opacity="0.4">
        <ellipse cx="100" cy="50" rx="80" ry="20" fill="#fff"/>
        <line x1="100" y1="0" x2="100" y2="40" stroke="#fff" stroke-width="2"/>
        <line x1="60" y1="0" x2="70" y2="40" stroke="#fff" stroke-width="1" opacity="0.6"/>
        <line x1="140" y1="0" x2="130" y2="40" stroke="#fff" stroke-width="1" opacity="0.6"/>
      </g>
      <!-- 肩膀 -->
      <path d="M30 130 Q40 100 70 100 L70 200 L30 220 Z" fill="url(#cls-pala-armor)" stroke="#8a6d1f" stroke-width="1"/>
      <path d="M170 130 Q160 100 130 100 L130 200 L170 220 Z" fill="url(#cls-pala-armor)" stroke="#8a6d1f" stroke-width="1"/>
      <!-- 头 -->
      <ellipse cx="100" cy="90" rx="32" ry="36" fill="#f0c898" stroke="#8a6d1f" stroke-width="0.6"/>
      <!-- 头盔 -->
      <path d="M68 70 Q68 36 100 32 Q132 36 132 70 L128 80 L72 80 Z" fill="url(#cls-pala-armor)" stroke="#8a6d1f" stroke-width="0.8"/>
      <!-- 头盔金边 -->
      <path d="M70 70 Q70 38 100 34 Q130 38 130 70" fill="none" stroke="#fff5d0" stroke-width="1.5"/>
      <!-- 冠 -->
      <path d="M88 32 L94 12 L106 12 L112 32 Z" fill="#fff5d0" stroke="#8a6d1f" stroke-width="0.6"/>
      <circle cx="100" cy="14" r="3" fill="#fff" stroke="#d4af37" stroke-width="0.4"/>
      <!-- 眼睛 -->
      <ellipse cx="88" cy="90" rx="2.5" ry="3.5" fill="#1a1a2a"/>
      <ellipse cx="112" cy="90" rx="2.5" ry="3.5" fill="#1a1a2a"/>
      <path d="M82 84 L94 86 M106 86 L118 84" stroke="#fff" stroke-width="0.8" fill="none"/>
      <!-- 鼻 -->
      <path d="M100 95 L96 105 L104 105 Z" fill="#d4a878" opacity="0.6"/>
      <!-- 胡须 -->
      <path d="M86 122 Q100 145 114 122 L110 130 Q100 148 90 130 Z" fill="#fff5d0" stroke="#8a6d1f" stroke-width="0.4"/>
      <!-- 胸甲 -->
      <path d="M60 130 L140 130 L138 280 L62 280 Z" fill="url(#cls-pala-armor)" stroke="#8a6d1f" stroke-width="0.8"/>
      <!-- 胸甲细节 -->
      <path d="M70 150 L130 150 L128 270 L72 270 Z" fill="none" stroke="#8a6d1f" stroke-width="0.5" opacity="0.6"/>
      <!-- 巨十字 -->
      <rect x="92" y="170" width="16" height="60" fill="#fff5d0"/>
      <rect x="76" y="190" width="48" height="20" fill="#fff5d0"/>
      <rect x="96" y="166" width="8" height="68" fill="#d4af37"/>
      <rect x="72" y="194" width="56" height="12" fill="#d4af37"/>
      <!-- 圣剑 -->
      <line x1="160" y1="240" x2="180" y2="60" stroke="#d4af37" stroke-width="6"/>
      <line x1="160" y1="240" x2="180" y2="60" stroke="#fff5d0" stroke-width="2"/>
      <rect x="156" y="240" width="14" height="6" fill="#8a6d1f"/>
      <circle cx="180" cy="60" r="6" fill="#fff"/>
      <circle cx="180" cy="60" r="10" fill="#fff" opacity="0.4"/>
      <circle cx="180" cy="60" r="14" fill="#fff" opacity="0.2"/>
    </svg>
  `,

  warlock: () => `
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cls-lock-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#5a8a4a"/>
          <stop offset="50%" stop-color="#3a1a5a"/>
          <stop offset="100%" stop-color="#0a0420"/>
        </radialGradient>
        <radialGradient id="cls-lock-eye" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#ff6b81"/>
          <stop offset="100%" stop-color="#6b0f1d"/>
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill="url(#cls-lock-bg)"/>
      <!-- 虚空裂隙 -->
      <g opacity="0.5" stroke="#a51c2e" fill="none" stroke-width="0.6">
        <path d="M20 60 L40 80 M30 70 L50 90 M40 65 L60 85"/>
        <path d="M180 60 L160 80 M170 70 L150 90 M160 65 L140 85"/>
        <path d="M10 200 L30 220 M20 210 L40 230"/>
        <path d="M190 200 L170 220 M180 210 L160 230"/>
      </g>
      <!-- 头巾 -->
      <path d="M40 110 Q40 50 100 40 Q160 50 160 110 L150 130 Q130 110 100 110 Q70 110 50 130 Z" fill="#2a0a1a" stroke="#5a0a14" stroke-width="0.8"/>
      <!-- 脸 -->
      <ellipse cx="100" cy="120" rx="36" ry="40" fill="#5a8a4a" stroke="#2a4a2a" stroke-width="0.8"/>
      <!-- 眼眶 -->
      <ellipse cx="84" cy="110" rx="9" ry="11" fill="#1a0408"/>
      <ellipse cx="116" cy="110" rx="9" ry="11" fill="#1a0408"/>
      <!-- 炽热之眼 -->
      <ellipse cx="84" cy="110" rx="5" ry="7" fill="url(#cls-lock-eye)"/>
      <ellipse cx="116" cy="110" rx="5" ry="7" fill="url(#cls-lock-eye)"/>
      <circle cx="84" cy="110" r="1.5" fill="#fff"/>
      <circle cx="116" cy="110" r="1.5" fill="#fff"/>
      <!-- 鼻 -->
      <ellipse cx="100" cy="128" rx="3" ry="2" fill="#3a5a3a"/>
      <!-- 嘴 -->
      <path d="M90 150 L96 158 L104 158 L110 150" stroke="#1a0408" stroke-width="1" fill="#1a0408"/>
      <path d="M96 158 L98 162 L102 162 L104 158" fill="#fff"/>
      <!-- 护肩 -->
      <path d="M30 180 Q40 160 60 165 L60 240 L30 250 Z" fill="#3a1a2a" stroke="#5a0a14" stroke-width="0.6"/>
      <path d="M170 180 Q160 160 140 165 L140 240 L170 250 Z" fill="#3a1a2a" stroke="#5a0a14" stroke-width="0.6"/>
      <!-- 胸甲 -->
      <path d="M60 180 L140 180 L138 280 L62 280 Z" fill="#2a0a1a" stroke="#5a0a14" stroke-width="0.8"/>
      <!-- 法阵 -->
      <g stroke="#a51c2e" fill="none" stroke-width="0.6">
        <circle cx="100" cy="230" r="14"/>
        <circle cx="100" cy="230" r="10"/>
        <path d="M100 218 L102 226 L98 226 Z" fill="#a51c2e"/>
        <path d="M100 242 L98 234 L102 234 Z" fill="#a51c2e"/>
        <path d="M88 230 L96 232 L96 228 Z" fill="#a51c2e"/>
        <path d="M112 230 L104 228 L104 232 Z" fill="#a51c2e"/>
      </g>
      <!-- 角 -->
      <path d="M56 50 L36 28 L48 44 L40 20 L60 38 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.4"/>
      <path d="M144 50 L164 28 L152 44 L160 20 L140 38 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.4"/>
      <!-- 法杖 -->
      <line x1="40" y1="270" x2="60" y2="80" stroke="#3a1a08" stroke-width="3"/>
      <circle cx="60" cy="80" r="6" fill="#a51c2e"/>
      <circle cx="60" cy="80" r="9" fill="#a51c2e" opacity="0.4"/>
      <circle cx="60" cy="80" r="14" fill="#a51c2e" opacity="0.2"/>
    </svg>
  `,

  druid: () => `
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cls-dru-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#a0d4a0"/>
          <stop offset="50%" stop-color="#3a6e4e"/>
          <stop offset="100%" stop-color="#0a1a08"/>
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill="url(#cls-dru-bg)"/>
      <!-- 树纹 -->
      <g opacity="0.4" stroke="#2d6e4e" fill="none" stroke-width="0.6">
        <path d="M0 230 Q40 210 70 220 Q100 200 130 220 Q160 210 200 230"/>
        <path d="M20 250 Q60 240 90 250 Q130 240 180 250"/>
      </g>
      <!-- 鹿角 -->
      <g stroke="#5a3a1a" stroke-width="4" fill="#5a3a1a" stroke-linecap="round">
        <path d="M64 60 L48 30 L40 38 M64 60 L52 22 L58 30 M64 60 L36 14"/>
        <path d="M136 60 L152 30 L160 38 M136 60 L148 22 L142 30 M136 60 L164 14"/>
      </g>
      <!-- 头部 -->
      <ellipse cx="100" cy="110" rx="36" ry="40" fill="#5a8a4a" stroke="#2d4e2e" stroke-width="0.8"/>
      <!-- 头发（藤蔓） -->
      <g stroke="#2d6e4e" stroke-width="1.5" fill="none" stroke-linecap="round">
        <path d="M68 80 Q60 50 70 30"/>
        <path d="M84 70 Q78 40 88 18"/>
        <path d="M116 70 Q122 40 112 18"/>
        <path d="M132 80 Q140 50 130 30"/>
      </g>
      <!-- 叶子 -->
      <g fill="#5a8a4a" stroke="#2d4e2e" stroke-width="0.4">
        <ellipse cx="70" cy="26" rx="3" ry="5" transform="rotate(-30 70 26)"/>
        <ellipse cx="88" cy="14" rx="3" ry="5" transform="rotate(-15 88 14)"/>
        <ellipse cx="112" cy="14" rx="3" ry="5" transform="rotate(15 112 14)"/>
        <ellipse cx="130" cy="26" rx="3" ry="5" transform="rotate(30 130 26)"/>
      </g>
      <!-- 眼睛（琥珀） -->
      <ellipse cx="86" cy="108" rx="3" ry="4" fill="#ffd76b"/>
      <ellipse cx="114" cy="108" rx="3" ry="4" fill="#ffd76b"/>
      <ellipse cx="86" cy="108" rx="1.2" ry="1.5" fill="#1a1a1a"/>
      <ellipse cx="114" cy="108" rx="1.2" ry="1.5" fill="#1a1a1a"/>
      <!-- 鼻 -->
      <ellipse cx="100" cy="125" rx="2" ry="1.5" fill="#3a5a3a"/>
      <!-- 嘴 -->
      <path d="M92 138 Q100 142 108 138" stroke="#2d4e2e" stroke-width="1" fill="none"/>
      <!-- 纹身 -->
      <g stroke="#1a3a1a" fill="none" stroke-width="0.6" opacity="0.8">
        <path d="M64 130 Q72 126 78 132"/>
        <path d="M122 132 Q128 126 136 130"/>
        <path d="M68 145 L132 145"/>
        <path d="M70 160 L130 160"/>
      </g>
      <!-- 披风（树叶） -->
      <path d="M30 180 Q40 170 60 175 L60 280 L30 280 Z" fill="#2d6e4e" stroke="#1a3a1a" stroke-width="0.6"/>
      <path d="M170 180 Q160 170 140 175 L140 280 L170 280 Z" fill="#2d6e4e" stroke="#1a3a1a" stroke-width="0.6"/>
      <!-- 胸甲（皮） -->
      <path d="M60 180 L140 180 L138 280 L62 280 Z" fill="#5a3a1a" stroke="#3a1a08" stroke-width="0.6"/>
      <!-- 自然宝石 -->
      <circle cx="100" cy="230" r="8" fill="#a0d4a0" stroke="#2d6e4e" stroke-width="0.6"/>
      <circle cx="100" cy="230" r="4" fill="#fff" opacity="0.7"/>
      <circle cx="98" cy="228" r="1.5" fill="#fff"/>
    </svg>
  `,

  mage: () => `
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cls-mage-bg" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#a8e0ff"/>
          <stop offset="50%" stop-color="#3a5a8a"/>
          <stop offset="100%" stop-color="#0a1a3a"/>
        </radialGradient>
        <radialGradient id="cls-mage-orb" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#fff"/>
          <stop offset="50%" stop-color="#5fd1ff"/>
          <stop offset="100%" stop-color="#1a3a5a"/>
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill="url(#cls-mage-bg)"/>
      <!-- 法阵 -->
      <g stroke="#5fd1ff" fill="none" opacity="0.5">
        <circle cx="100" cy="140" r="92" stroke-width="0.5"/>
        <circle cx="100" cy="140" r="80" stroke-width="0.4"/>
        <path d="M100 48 L104 64 L96 64 Z" fill="#5fd1ff"/>
        <path d="M100 232 L96 216 L104 216 Z" fill="#5fd1ff"/>
        <path d="M8 140 L24 144 L24 136 Z" fill="#5fd1ff"/>
        <path d="M192 140 L176 136 L176 144 Z" fill="#5fd1ff"/>
      </g>
      <!-- 兜帽 -->
      <path d="M44 110 Q44 40 100 30 Q156 40 156 110 L148 130 Q132 110 100 110 Q68 110 52 130 Z" fill="#3a2a5a" stroke="#1a0a3a" stroke-width="0.8"/>
      <!-- 兜帽纹 -->
      <g stroke="#5fd1ff" fill="none" opacity="0.5" stroke-width="0.4">
        <path d="M56 70 Q70 50 100 50"/>
        <path d="M100 50 Q130 50 144 70"/>
        <circle cx="70" cy="68" r="1" fill="#5fd1ff"/>
        <circle cx="130" cy="68" r="1" fill="#5fd1ff"/>
        <circle cx="100" cy="58" r="1.2" fill="#5fd1ff"/>
      </g>
      <!-- 脸 -->
      <ellipse cx="100" cy="110" rx="32" ry="36" fill="#f0c898" stroke="#8a6d1f" stroke-width="0.5"/>
      <!-- 头发（银蓝） -->
      <path d="M68 90 Q68 60 100 56 Q132 60 132 90" fill="none" stroke="#a8e0ff" stroke-width="3" stroke-linecap="round"/>
      <path d="M72 96 L72 110 M128 96 L128 110" stroke="#a8e0ff" stroke-width="2" stroke-linecap="round"/>
      <!-- 眼睛 -->
      <ellipse cx="88" cy="110" rx="2.5" ry="3.5" fill="#5fd1ff"/>
      <ellipse cx="112" cy="110" rx="2.5" ry="3.5" fill="#5fd1ff"/>
      <ellipse cx="88" cy="110" rx="0.8" ry="1.2" fill="#fff"/>
      <ellipse cx="112" cy="110" rx="0.8" ry="1.2" fill="#fff"/>
      <!-- 鼻 -->
      <path d="M100 116 L96 124 L104 124 Z" fill="#d4a878" opacity="0.5"/>
      <!-- 嘴 -->
      <path d="M94 132 Q100 134 106 132" stroke="#a51c2e" stroke-width="0.6" fill="none"/>
      <!-- 法袍 -->
      <path d="M40 170 L160 170 L172 280 L28 280 Z" fill="#3a2a5a" stroke="#1a0a3a" stroke-width="0.6"/>
      <!-- 法袍纹路 -->
      <g stroke="#5fd1ff" fill="none" stroke-width="0.4" opacity="0.7">
        <path d="M80 170 L80 280 M100 170 L100 280 M120 170 L120 280"/>
        <path d="M50 220 L150 220"/>
        <circle cx="80" cy="200" r="2"/>
        <circle cx="120" cy="200" r="2"/>
      </g>
      <!-- 胸前法球 -->
      <circle cx="100" cy="230" r="14" fill="url(#cls-mage-orb)"/>
      <circle cx="100" cy="230" r="20" fill="none" stroke="#5fd1ff" stroke-width="0.5" opacity="0.6"/>
      <circle cx="100" cy="230" r="26" fill="none" stroke="#5fd1ff" stroke-width="0.3" opacity="0.4"/>
      <!-- 法杖 -->
      <line x1="40" y1="270" x2="60" y2="40" stroke="#3a2a1a" stroke-width="3"/>
      <circle cx="60" cy="40" r="6" fill="#5fd1ff"/>
      <circle cx="60" cy="40" r="10" fill="#5fd1ff" opacity="0.4"/>
      <circle cx="60" cy="40" r="16" fill="#5fd1ff" opacity="0.2"/>
    </svg>
  `,
};

/**
 * 卡牌 SVG 肖像库
 * 所有卡牌的插画均由 SVG 绘制，根据 id 返回不同图案
 */

export const portraits = {
  // ====== 随从肖像 ======
  soldier: (color = '#5fd1ff') => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-soldier" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#5a4a8a"/>
          <stop offset="100%" stop-color="#1a1230"/>
        </radialGradient>
        <linearGradient id="armor" x1="0" x2="1">
          <stop offset="0%" stop-color="#d4d4e8"/>
          <stop offset="100%" stop-color="#8888a8"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-soldier)"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.4"/>
      <!-- 头盔 -->
      <path d="M30 40 Q30 25 50 22 Q70 25 70 40 L68 55 L32 55 Z" fill="url(#armor)" stroke="#5a5a6a" stroke-width="0.8"/>
      <!-- 面甲 -->
      <path d="M37 40 L37 50 L63 50 L63 40 Z" fill="#2a2a3a" stroke="#1a1a2a" stroke-width="0.5"/>
      <line x1="42" y1="45" x2="58" y2="45" stroke="${color}" stroke-width="0.8"/>
      <!-- 眼睛 -->
      <circle cx="44" cy="45" r="1.5" fill="${color}"/>
      <circle cx="56" cy="45" r="1.5" fill="${color}"/>
      <!-- 护肩 -->
      <path d="M28 60 Q30 50 38 55 L38 70 L28 72 Z" fill="url(#armor)" stroke="#5a5a6a" stroke-width="0.5"/>
      <path d="M72 60 Q70 50 62 55 L62 70 L72 72 Z" fill="url(#armor)" stroke="#5a5a6a" stroke-width="0.5"/>
      <!-- 胸甲 -->
      <path d="M38 55 L62 55 L60 78 L40 78 Z" fill="url(#armor)" stroke="#5a5a6a" stroke-width="0.6"/>
      <!-- 十字徽章 -->
      <rect x="46" y="60" width="8" height="8" fill="${color}" opacity="0.9"/>
      <rect x="48" y="58" width="4" height="12" fill="${color}" opacity="0.9"/>
      <rect x="44" y="62" width="12" height="4" fill="${color}" opacity="0.9"/>
    </svg>
  `,

  paladin: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-paladin" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="100%" stop-color="#8a6d1f"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-paladin)"/>
      <!-- 神圣光环 -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="#ffd76b" stroke-width="1" opacity="0.5"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#fff" stroke-width="0.5" opacity="0.7"/>
      <!-- 头部 -->
      <ellipse cx="50" cy="38" rx="14" ry="16" fill="#f0c898"/>
      <!-- 头发 / 头盔 -->
      <path d="M36 32 Q38 22 50 20 Q62 22 64 32 L62 35 L38 35 Z" fill="#a0a0c0"/>
      <!-- 眼睛 -->
      <ellipse cx="45" cy="40" rx="1.5" ry="2" fill="#1a1a2a"/>
      <ellipse cx="55" cy="40" rx="1.5" ry="2" fill="#1a1a2a"/>
      <!-- 胡须 -->
      <path d="M44 48 Q50 56 56 48 L55 52 Q50 58 45 52 Z" fill="#d4d4e8"/>
      <!-- 胸甲 -->
      <path d="M32 56 L68 56 L66 85 L34 85 Z" fill="#d4af37" stroke="#8a6d1f" stroke-width="1"/>
      <path d="M36 60 L64 60 L62 78 L38 78 Z" fill="#fff5d0" opacity="0.7"/>
      <!-- 圣光剑 -->
      <line x1="72" y1="20" x2="80" y2="6" stroke="#d4af37" stroke-width="3"/>
      <line x1="70" y1="22" x2="78" y2="8" stroke="#fff5d0" stroke-width="1.5"/>
      <circle cx="80" cy="6" r="3" fill="#fff5d0" opacity="0.9"/>
      <circle cx="80" cy="6" r="6" fill="#fff5d0" opacity="0.3"/>
    </svg>
  `,

  voidwalker: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-void" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#5a2a8a"/>
          <stop offset="100%" stop-color="#0a0420"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-void)"/>
      <!-- 虚空裂痕 -->
      <g opacity="0.6">
        <path d="M20 30 L30 35 L25 40 L35 45" stroke="#8a3ffc" stroke-width="0.8" fill="none"/>
        <path d="M70 25 L78 32 L72 38 L82 45" stroke="#8a3ffc" stroke-width="0.8" fill="none"/>
        <path d="M15 70 L25 72 L20 78 L30 82" stroke="#8a3ffc" stroke-width="0.8" fill="none"/>
      </g>
      <!-- 主体 -->
      <ellipse cx="50" cy="55" rx="28" ry="32" fill="#3a1a5a" stroke="#8a3ffc" stroke-width="1"/>
      <ellipse cx="50" cy="55" rx="22" ry="26" fill="#1a0a3a" opacity="0.6"/>
      <!-- 头部 -->
      <ellipse cx="50" cy="32" rx="16" ry="14" fill="#5a2a8a" stroke="#8a3ffc" stroke-width="0.8"/>
      <!-- 角 -->
      <path d="M36 24 L28 14 L34 22 Z" fill="#8a3ffc"/>
      <path d="M64 24 L72 14 L66 22 Z" fill="#8a3ffc"/>
      <!-- 眼睛 -->
      <ellipse cx="44" cy="32" rx="2" ry="3" fill="#ff3a8a"/>
      <ellipse cx="56" cy="32" rx="2" ry="3" fill="#ff3a8a"/>
      <circle cx="44" cy="32" r="0.8" fill="#fff"/>
      <circle cx="56" cy="32" r="0.8" fill="#fff"/>
      <!-- 嘴 -->
      <path d="M44 40 L48 38 L52 38 L56 40" stroke="#1a0a3a" stroke-width="1" fill="none"/>
      <!-- 爪子 -->
      <path d="M28 60 L24 70 L30 68 L26 76 L32 72" stroke="#8a3ffc" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M72 60 L76 70 L70 68 L74 76 L68 72" stroke="#8a3ffc" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `,

  doomguard: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-doom" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#a51c2e"/>
          <stop offset="100%" stop-color="#1a0408"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-doom)"/>
      <!-- 火焰 -->
      <g opacity="0.6">
        <path d="M10 85 Q15 70 12 55 Q20 65 18 80 Z" fill="#ff6b30"/>
        <path d="M85 85 Q90 70 88 55 Q95 65 92 80 Z" fill="#ff6b30"/>
        <path d="M50 90 Q55 75 52 60 Q60 70 58 88 Z" fill="#ffaa30"/>
      </g>
      <!-- 翅膀 -->
      <path d="M20 35 Q5 50 12 70 L28 60 L22 75 L35 65 Z" fill="#3a0a14" stroke="#a51c2e" stroke-width="0.8"/>
      <path d="M80 35 Q95 50 88 70 L72 60 L78 75 L65 65 Z" fill="#3a0a14" stroke="#a51c2e" stroke-width="0.8"/>
      <!-- 主体 -->
      <ellipse cx="50" cy="55" rx="22" ry="28" fill="#6b0f1d" stroke="#a51c2e" stroke-width="1"/>
      <!-- 头部 -->
      <ellipse cx="50" cy="30" rx="14" ry="12" fill="#4a0a14" stroke="#a51c2e" stroke-width="0.8"/>
      <!-- 角 -->
      <path d="M38 22 L30 10 L36 18 L32 8 L40 18 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.5"/>
      <path d="M62 22 L70 10 L64 18 L68 8 L60 18 Z" fill="#1a0408" stroke="#a51c2e" stroke-width="0.5"/>
      <!-- 眼睛 -->
      <ellipse cx="44" cy="30" rx="2" ry="3" fill="#ffaa30"/>
      <ellipse cx="56" cy="30" rx="2" ry="3" fill="#ffaa30"/>
      <!-- 嘴 -->
      <path d="M42 36 L50 42 L58 36 L52 40 L48 40 Z" fill="#1a0408" stroke="#ffaa30" stroke-width="0.4"/>
      <!-- 爪子 -->
      <path d="M30 60 L26 72 L32 70 L28 80 L34 76" stroke="#a51c2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M70 60 L74 72 L68 70 L72 80 L66 76" stroke="#a51c2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  `,

  wolf: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-wolf" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#6a8aaa"/>
          <stop offset="100%" stop-color="#1a2230"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-wolf)"/>
      <!-- 雪山 -->
      <path d="M0 70 L20 50 L35 60 L55 45 L75 60 L100 50 L100 100 L0 100 Z" fill="#3a4a5a" opacity="0.6"/>
      <path d="M0 80 L25 65 L50 75 L75 65 L100 78 L100 100 L0 100 Z" fill="#2a3a4a" opacity="0.7"/>
      <!-- 狼身体 -->
      <ellipse cx="50" cy="68" rx="20" ry="14" fill="#7a8a9a"/>
      <!-- 头 -->
      <path d="M30 50 L25 38 L30 30 L38 28 L42 32 L50 30 L58 32 L62 28 L70 30 L75 38 L70 50 L62 55 L55 60 L45 60 L38 55 Z" fill="#8a9aaa"/>
      <!-- 耳朵 -->
      <path d="M30 30 L25 18 L34 26 Z" fill="#5a6a7a"/>
      <path d="M70 30 L75 18 L66 26 Z" fill="#5a6a7a"/>
      <path d="M28 26 L26 20 L31 25 Z" fill="#ff8aa0"/>
      <path d="M72 26 L74 20 L69 25 Z" fill="#ff8aa0"/>
      <!-- 眼睛 -->
      <ellipse cx="40" cy="40" rx="2" ry="2.5" fill="#ffd76b"/>
      <ellipse cx="60" cy="40" rx="2" ry="2.5" fill="#ffd76b"/>
      <ellipse cx="40" cy="40" rx="0.8" ry="1.2" fill="#1a1a1a"/>
      <ellipse cx="60" cy="40" rx="0.8" ry="1.2" fill="#1a1a1a"/>
      <!-- 鼻 -->
      <ellipse cx="50" cy="46" rx="2" ry="1.5" fill="#1a1a1a"/>
      <!-- 嘴 -->
      <path d="M50 48 L46 53 L48 55 M50 48 L54 53 L52 55" stroke="#1a1a1a" stroke-width="0.8" fill="none"/>
      <!-- 爪 -->
      <ellipse cx="35" cy="82" rx="3" ry="2" fill="#5a6a7a"/>
      <ellipse cx="65" cy="82" rx="3" ry="2" fill="#5a6a7a"/>
      <!-- 尾巴 -->
      <path d="M70 65 Q88 50 90 35 Q85 38 80 45 Q88 38 92 30" fill="#7a8a9a" stroke="#5a6a7a" stroke-width="0.5"/>
    </svg>
  `,

  dragon: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-dragon" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#8a3a1a"/>
          <stop offset="100%" stop-color="#1a0408"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-dragon)"/>
      <!-- 翅膀 -->
      <path d="M20 30 Q5 50 8 75 L25 60 L20 80 L35 65 Q30 50 35 35 Z" fill="#a51c2e" stroke="#5a0a14" stroke-width="0.5" opacity="0.9"/>
      <path d="M80 30 Q95 50 92 75 L75 60 L80 80 L65 65 Q70 50 65 35 Z" fill="#a51c2e" stroke="#5a0a14" stroke-width="0.5" opacity="0.9"/>
      <!-- 身体 -->
      <ellipse cx="50" cy="60" rx="20" ry="22" fill="#3a1a0a" stroke="#a51c2e" stroke-width="0.8"/>
      <!-- 鳞片 -->
      <g fill="#a51c2e" opacity="0.5">
        <path d="M40 50 Q45 45 50 50 Q45 55 40 50"/>
        <path d="M50 50 Q55 45 60 50 Q55 55 50 50"/>
        <path d="M42 58 Q47 53 52 58 Q47 63 42 58"/>
        <path d="M52 58 Q57 53 62 58 Q57 63 52 58"/>
      </g>
      <!-- 头 -->
      <path d="M35 30 Q30 18 50 14 Q70 18 65 30 L60 38 L55 32 L50 38 L45 32 L40 38 Z" fill="#3a1a0a" stroke="#a51c2e" stroke-width="0.8"/>
      <!-- 角 -->
      <path d="M36 22 L30 10 L40 18 Z" fill="#1a0408"/>
      <path d="M64 22 L70 10 L60 18 Z" fill="#1a0408"/>
      <!-- 眼睛 -->
      <circle cx="43" cy="28" r="2.5" fill="#ffd76b"/>
      <circle cx="43" cy="28" r="1.2" fill="#1a1a1a"/>
      <circle cx="57" cy="28" r="2.5" fill="#ffd76b"/>
      <circle cx="57" cy="28" r="1.2" fill="#1a1a1a"/>
      <!-- 嘴喷火 -->
      <path d="M50 38 L48 50 L52 50 Z" fill="#ff6b30"/>
      <path d="M50 50 L46 60 L54 60 Z" fill="#ffaa30" opacity="0.8"/>
    </svg>
  `,

  treant: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-treant" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#5a8a4a"/>
          <stop offset="100%" stop-color="#0a1a08"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-treant)"/>
      <!-- 树冠 -->
      <circle cx="50" cy="35" r="28" fill="#2d6e4e" stroke="#1a4030" stroke-width="0.8"/>
      <circle cx="35" cy="40" r="18" fill="#3a7a5a" opacity="0.7"/>
      <circle cx="65" cy="40" r="18" fill="#3a7a5a" opacity="0.7"/>
      <circle cx="50" cy="25" r="16" fill="#4a8a6a" opacity="0.8"/>
      <!-- 树干 -->
      <path d="M40 55 L42 80 L58 80 L60 55 Q55 60 50 60 Q45 60 40 55 Z" fill="#5a3a1a" stroke="#3a1a08" stroke-width="0.8"/>
      <!-- 眼睛 -->
      <ellipse cx="44" cy="62" rx="2.5" ry="3" fill="#d4af37"/>
      <ellipse cx="56" cy="62" rx="2.5" ry="3" fill="#d4af37"/>
      <ellipse cx="44" cy="62" rx="1" ry="1.2" fill="#1a1a1a"/>
      <ellipse cx="56" cy="62" rx="1" ry="1.2" fill="#1a1a1a"/>
      <!-- 嘴 -->
      <path d="M44 72 Q50 76 56 72" stroke="#1a1a1a" stroke-width="1" fill="none"/>
      <!-- 根 -->
      <path d="M30 80 L24 88 L34 85 Z" fill="#5a3a1a"/>
      <path d="M70 80 L76 88 L66 85 Z" fill="#5a3a1a"/>
      <!-- 枝 -->
      <path d="M30 50 L20 45 L25 50" stroke="#3a1a08" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M70 50 L80 45 L75 50" stroke="#3a1a08" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `,

  mage: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-mage" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#3a8aaa"/>
          <stop offset="100%" stop-color="#0a1a3a"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-mage)"/>
      <!-- 魔法阵 -->
      <circle cx="50" cy="55" r="38" fill="none" stroke="#5fd1ff" stroke-width="0.5" opacity="0.4"/>
      <circle cx="50" cy="55" r="32" fill="none" stroke="#5fd1ff" stroke-width="0.3" opacity="0.6"/>
      <g opacity="0.7" stroke="#5fd1ff" stroke-width="0.3" fill="none">
        <path d="M50 23 L52 35 L50 33 L48 35 Z"/>
        <path d="M77 55 L65 53 L67 55 L65 57 Z"/>
        <path d="M50 87 L52 75 L50 77 L48 75 Z"/>
        <path d="M23 55 L35 53 L33 55 L35 57 Z"/>
      </g>
      <!-- 头 -->
      <ellipse cx="50" cy="38" rx="13" ry="14" fill="#f0c898"/>
      <!-- 头发 -->
      <path d="M37 32 Q35 18 50 18 Q65 18 63 32 L60 35 L55 30 L50 32 L45 30 L40 35 Z" fill="#5fd1ff" stroke="#3a8aaa" stroke-width="0.5"/>
      <!-- 眼睛 -->
      <ellipse cx="45" cy="40" rx="1.5" ry="2" fill="#1a1a2a"/>
      <ellipse cx="55" cy="40" rx="1.5" ry="2" fill="#1a1a2a"/>
      <!-- 法袍 -->
      <path d="M30 56 L70 56 L75 88 L25 88 Z" fill="#3a2a5a" stroke="#5fd1ff" stroke-width="0.6"/>
      <path d="M40 56 L40 88 M60 56 L60 88" stroke="#5fd1ff" stroke-width="0.4" opacity="0.5"/>
      <!-- 胸前宝石 -->
      <circle cx="50" cy="70" r="3" fill="#5fd1ff" opacity="0.9"/>
      <circle cx="50" cy="70" r="5" fill="#5fd1ff" opacity="0.3"/>
      <!-- 法杖 -->
      <line x1="75" y1="80" x2="85" y2="15" stroke="#3a2a1a" stroke-width="2"/>
      <circle cx="85" cy="15" r="4" fill="#5fd1ff"/>
      <circle cx="85" cy="15" r="7" fill="#5fd1ff" opacity="0.3"/>
    </svg>
  `,

  // ====== 法术肖像 ======
  holy: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-holy" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#fff5d0"/>
          <stop offset="60%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#5a3a08"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-holy)"/>
      <!-- 神圣之光 -->
      <g opacity="0.9">
        <circle cx="50" cy="50" r="32" fill="none" stroke="#fff" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="22" fill="none" stroke="#fff" stroke-width="0.8"/>
        <circle cx="50" cy="50" r="14" fill="#fff" opacity="0.4"/>
      </g>
      <!-- 光线 -->
      <g stroke="#fff" stroke-width="1" opacity="0.7">
        <line x1="50" y1="10" x2="50" y2="22"/>
        <line x1="50" y1="78" x2="50" y2="90"/>
        <line x1="10" y1="50" x2="22" y2="50"/>
        <line x1="78" y1="50" x2="90" y2="50"/>
        <line x1="22" y1="22" x2="30" y2="30"/>
        <line x1="78" y1="22" x2="70" y2="30"/>
        <line x1="22" y1="78" x2="30" y2="70"/>
        <line x1="78" y1="78" x2="70" y2="70"/>
      </g>
      <!-- 中心十字 -->
      <rect x="46" y="30" width="8" height="40" fill="#fff" stroke="#d4af37" stroke-width="0.5"/>
      <rect x="30" y="46" width="40" height="8" fill="#fff" stroke="#d4af37" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="6" fill="#ffd76b" stroke="#d4af37" stroke-width="0.5"/>
    </svg>
  `,

  drain: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-drain" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#5a8a3a"/>
          <stop offset="100%" stop-color="#0a1a08"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-drain)"/>
      <!-- 漩涡 -->
      <g stroke="#a0ff60" fill="none" opacity="0.8">
        <path d="M50 50 Q30 40 35 25 Q55 30 60 15" stroke-width="2"/>
        <path d="M50 50 Q70 60 65 75 Q45 70 40 85" stroke-width="2"/>
        <path d="M50 50 Q40 30 50 15 M50 50 Q60 70 50 85 M50 50 Q30 60 15 50 M50 50 Q70 40 85 50" stroke-width="1" opacity="0.6"/>
      </g>
      <!-- 中央骷髅 -->
      <ellipse cx="50" cy="48" rx="14" ry="16" fill="#1a1a1a" stroke="#a0ff60" stroke-width="0.5"/>
      <ellipse cx="45" cy="45" rx="2.5" ry="3" fill="#a0ff60"/>
      <ellipse cx="55" cy="45" rx="2.5" ry="3" fill="#a0ff60"/>
      <path d="M47 50 L48 56 L50 54 L52 56 L53 50" stroke="#a0ff60" stroke-width="0.6" fill="none"/>
      <line x1="44" y1="55" x2="56" y2="55" stroke="#a0ff60" stroke-width="0.5"/>
      <line x1="44" y1="58" x2="56" y2="58" stroke="#a0ff60" stroke-width="0.5"/>
      <!-- 血滴 -->
      <path d="M20 30 Q22 25 24 30 Q22 32 20 30 Z" fill="#a51c2e"/>
      <path d="M78 70 Q80 65 82 70 Q80 72 78 70 Z" fill="#a51c2e"/>
    </svg>
  `,

  arcane: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-arcane" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#5fd1ff"/>
          <stop offset="100%" stop-color="#0a1a3a"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-arcane)"/>
      <!-- 法阵 -->
      <g stroke="#fff" fill="none" opacity="0.6">
        <circle cx="50" cy="50" r="36" stroke-width="0.8"/>
        <circle cx="50" cy="50" r="28" stroke-width="0.5"/>
        <path d="M50 14 L53 26 L47 26 Z" fill="#fff" opacity="0.7"/>
        <path d="M86 50 L74 53 L74 47 Z" fill="#fff" opacity="0.7"/>
        <path d="M50 86 L47 74 L53 74 Z" fill="#fff" opacity="0.7"/>
        <path d="M14 50 L26 47 L26 53 Z" fill="#fff" opacity="0.7"/>
      </g>
      <!-- 符文 -->
      <g fill="#fff" opacity="0.9">
        <circle cx="50" cy="50" r="3"/>
        <circle cx="50" cy="32" r="1.5"/>
        <circle cx="50" cy="68" r="1.5"/>
        <circle cx="32" cy="50" r="1.5"/>
        <circle cx="68" cy="50" r="1.5"/>
      </g>
      <!-- 卷轴 -->
      <rect x="36" y="42" width="28" height="16" fill="#e8d4a2" stroke="#5a3a08" stroke-width="0.6" rx="1"/>
      <line x1="36" y1="46" x2="64" y2="46" stroke="#5a3a08" stroke-width="0.3"/>
      <line x1="36" y1="50" x2="64" y2="50" stroke="#5a3a08" stroke-width="0.3"/>
      <line x1="36" y1="54" x2="64" y2="54" stroke="#5a3a08" stroke-width="0.3"/>
    </svg>
  `,

  flame: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-flame" cx="50%" cy="60%">
          <stop offset="0%" stop-color="#ffaa30"/>
          <stop offset="60%" stop-color="#a51c2e"/>
          <stop offset="100%" stop-color="#1a0408"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-flame)"/>
      <!-- 火焰 -->
      <g>
        <path d="M50 90 Q20 75 25 50 Q30 60 35 55 Q30 35 45 20 Q40 35 50 30 Q50 12 55 12 Q55 30 60 28 Q70 38 65 55 Q70 60 75 50 Q80 75 50 90 Z" fill="#ff6b30" stroke="#a51c2e" stroke-width="0.6"/>
        <path d="M50 90 Q30 78 35 60 Q40 65 42 60 Q40 45 50 35 Q50 55 55 50 Q60 38 65 50 Q70 60 65 75 Q60 85 50 90 Z" fill="#ffaa30" opacity="0.9"/>
        <path d="M50 90 Q40 80 42 70 Q45 73 46 70 Q45 60 50 55 Q55 60 54 70 Q55 73 58 70 Q60 80 50 90 Z" fill="#fff5a0" opacity="0.9"/>
      </g>
      <!-- 火星 -->
      <g fill="#ffd76b">
        <circle cx="30" cy="20" r="1"/>
        <circle cx="75" cy="25" r="1.2"/>
        <circle cx="20" cy="40" r="0.8"/>
        <circle cx="80" cy="45" r="0.8"/>
        <circle cx="25" cy="60" r="0.6"/>
        <circle cx="78" cy="65" r="0.6"/>
      </g>
    </svg>
  `,

  frost: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-frost" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#bce8ff"/>
          <stop offset="100%" stop-color="#1a3a5a"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-frost)"/>
      <!-- 雪花 -->
      <g stroke="#fff" stroke-width="1.2" fill="none" opacity="0.9">
        <line x1="50" y1="14" x2="50" y2="86"/>
        <line x1="14" y1="50" x2="86" y2="50"/>
        <line x1="25" y1="25" x2="75" y2="75"/>
        <line x1="75" y1="25" x2="25" y2="75"/>
        <path d="M50 14 L45 19 M50 14 L55 19"/>
        <path d="M50 86 L45 81 M50 86 L55 81"/>
        <path d="M14 50 L19 45 M14 50 L19 55"/>
        <path d="M86 50 L81 45 M86 50 L81 55"/>
        <path d="M25 25 L30 22 M25 25 L28 30"/>
        <path d="M75 75 L70 78 M75 75 L72 70"/>
        <path d="M75 25 L70 22 M75 25 L72 30"/>
        <path d="M25 75 L30 78 M25 75 L28 70"/>
      </g>
      <circle cx="50" cy="50" r="6" fill="#bce8ff" stroke="#fff" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="3" fill="#fff"/>
    </svg>
  `,

  // ====== 默认 ======
  default: () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-default" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#5a4a8a"/>
          <stop offset="100%" stop-color="#0a0420"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-default)"/>
      <text x="50" y="60" text-anchor="middle" font-family="serif" font-size="50" fill="#d4af37" opacity="0.7">?</text>
    </svg>
  `,
};

import type { Skill } from "@/data/skills";

interface SkillIconProps {
  seed: number;
  color: string;
  size?: number;
  rarity?: number;
  active?: boolean;
}

/**
 * SkillIcon —— 基于 iconSeed 的几何 SVG 图标
 * 在六边形底上叠加独特图形（剑/盾/环/三角阵等）
 */
export function SkillIcon({ seed, color, size = 56, rarity = 5, active = false }: SkillIconProps) {
  const id = `g-${seed}`;
  const inner = (() => {
    const s = seed % 16;
    switch (s) {
      // 0: 双三角
      case 0:
        return (
          <g>
            <polygon points="32,8 52,40 12,40" fill="none" stroke={color} strokeWidth="2" />
            <polygon points="32,52 12,20 52,20" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
          </g>
        );
      // 1: 三横线（机械条）
      case 1:
        return (
          <g>
            <rect x="12" y="14" width="40" height="4" fill={color} />
            <rect x="12" y="28" width="40" height="4" fill={color} fillOpacity="0.6" />
            <rect x="12" y="42" width="40" height="4" fill={color} fillOpacity="0.3" />
            <line x1="32" y1="6" x2="32" y2="54" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
          </g>
        );
      // 2: 旋转双刃
      case 2:
        return (
          <g>
            <path d="M32 6 L48 30 L32 54 L16 30 Z" fill="none" stroke={color} strokeWidth="2" />
            <path d="M32 6 L32 54" stroke={color} strokeWidth="1.5" />
            <circle cx="32" cy="30" r="4" fill={color} />
          </g>
        );
      // 3: 旗
      case 3:
        return (
          <g>
            <line x1="20" y1="10" x2="20" y2="54" stroke={color} strokeWidth="2.5" />
            <path d="M20 12 L48 18 L40 26 L48 34 L20 30 Z" fill={color} fillOpacity="0.7" stroke={color} strokeWidth="1.5" />
          </g>
        );
      // 4: 箭
      case 4:
        return (
          <g>
            <line x1="14" y1="46" x2="42" y2="18" stroke={color} strokeWidth="2.5" />
            <polygon points="42,18 36,20 40,24" fill={color} />
            <polygon points="14,46 18,40 22,44" fill={color} />
            <line x1="42" y1="18" x2="50" y2="10" stroke={color} strokeWidth="2" />
          </g>
        );
      // 5: 双盾
      case 5:
        return (
          <g>
            <path d="M32 6 L48 14 L48 36 Q48 50 32 56 Q16 50 16 36 L16 14 Z" fill="none" stroke={color} strokeWidth="2" />
            <path d="M32 14 L42 18 L42 36 Q42 44 32 50" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2" />
          </g>
        );
      // 6: 十字
      case 6:
        return (
          <g>
            <rect x="26" y="10" width="12" height="44" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <rect x="10" y="26" width="44" height="12" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
          </g>
        );
      // 7: 闪电
      case 7:
        return (
          <g>
            <polygon points="34,6 18,32 30,32 26,54 46,26 34,26" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.8" />
          </g>
        );
      // 8: 八角星
      case 8:
        return (
          <g>
            <polygon
              points="32,6 38,22 56,24 42,36 48,54 32,44 16,54 22,36 8,24 26,22"
              fill="none"
              stroke={color}
              strokeWidth="1.8"
            />
            <circle cx="32" cy="30" r="4" fill={color} />
          </g>
        );
      // 9: 弧斩
      case 9:
        return (
          <g>
            <path d="M12 46 Q12 14 46 14" fill="none" stroke={color} strokeWidth="2.5" />
            <path d="M18 50 Q18 22 50 22" fill="none" stroke={color} strokeWidth="1.4" strokeOpacity="0.6" />
            <circle cx="46" cy="14" r="3" fill={color} />
          </g>
        );
      // 10: 网格
      case 10:
        return (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <line key={`h${i}`} x1="12" y1={14 + i * 12} x2="52" y2={14 + i * 12} stroke={color} strokeWidth="1.2" />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <line key={`v${i}`} x1={14 + i * 12} y1="10" x2={14 + i * 12} y2="50" stroke={color} strokeWidth="1.2" />
            ))}
          </g>
        );
      // 11: 双环
      case 11:
        return (
          <g>
            <circle cx="32" cy="30" r="22" fill="none" stroke={color} strokeWidth="2" />
            <circle cx="32" cy="30" r="14" fill="none" stroke={color} strokeWidth="1.4" />
            <circle cx="32" cy="30" r="5" fill={color} />
          </g>
        );
      // 12: 火
      case 12:
        return (
          <g>
            <path d="M32 6 Q20 22 24 38 Q24 50 32 54 Q40 50 40 38 Q44 22 32 6 Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.6" />
            <path d="M32 18 Q26 28 30 40" fill="none" stroke={color} strokeWidth="1" />
          </g>
        );
      // 13: 全屏
      case 13:
        return (
          <g>
            <rect x="10" y="14" width="44" height="32" fill="none" stroke={color} strokeWidth="1.6" />
            <line x1="10" y1="22" x2="54" y2="22" stroke={color} strokeWidth="0.8" />
            <line x1="10" y1="30" x2="54" y2="30" stroke={color} strokeWidth="0.8" />
            <line x1="10" y1="38" x2="54" y2="38" stroke={color} strokeWidth="0.8" />
            <circle cx="14" cy="18" r="1.5" fill={color} />
            <circle cx="14" cy="26" r="1.5" fill={color} />
            <circle cx="14" cy="34" r="1.5" fill={color} />
            <circle cx="14" cy="42" r="1.5" fill={color} />
          </g>
        );
      // 14: 棱形
      case 14:
        return (
          <g>
            <polygon points="32,6 50,30 32,54 14,30" fill="none" stroke={color} strokeWidth="2" />
            <polygon points="32,16 42,30 32,44 22,30" fill={color} fillOpacity="0.4" />
          </g>
        );
      // 15: 雪花
      case 15:
        return (
          <g>
            <line x1="32" y1="8" x2="32" y2="52" stroke={color} strokeWidth="2" />
            <line x1="12" y1="30" x2="52" y2="30" stroke={color} strokeWidth="2" />
            <line x1="18" y1="16" x2="46" y2="44" stroke={color} strokeWidth="1.5" />
            <line x1="46" y1="16" x2="18" y2="44" stroke={color} strokeWidth="1.5" />
            <circle cx="32" cy="30" r="3" fill={color} />
          </g>
        );
      default:
        return (
          <g>
            <polygon points="32,10 52,30 32,50 12,30" fill="none" stroke={color} strokeWidth="2" />
          </g>
        );
    }
  })();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 60"
      className={active ? "animate-float" : undefined}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-r`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 六边形底 */}
      <path
        d="M32 2 L60 17 L60 43 L32 58 L4 43 L4 17 Z"
        fill={`url(#${id})`}
        stroke={color}
        strokeOpacity={rarity >= 6 ? 0.9 : 0.45}
        strokeWidth={rarity >= 6 ? 1.4 : 1}
      />
      {/* 内描边 */}
      <path
        d="M32 8 L54 20 L54 40 L32 52 L10 40 L10 20 Z"
        fill="none"
        stroke={color}
        strokeOpacity="0.18"
        strokeWidth="0.8"
      />
      {/* 中心圆 */}
      <circle cx="32" cy="30" r="22" fill={`url(#${id}-r)`} />

      {inner}
    </svg>
  );
}

/** 用于详情面板的更大尺寸 */
export function SkillIconLarge({ skill }: { skill: Skill }) {
  return (
    <div className="relative">
      <SkillIcon seed={skill.iconSeed} color={skill.color} size={128} rarity={skill.rarity} />
      <div
        className="absolute inset-0 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${skill.color}55, transparent 60%)`,
        }}
      />
    </div>
  );
}

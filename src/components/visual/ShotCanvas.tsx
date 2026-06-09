import { useMemo } from 'react';
import type { Shot } from '@/data/types';
import { DotMatrix } from './DotMatrix';
import { LightArc } from './LightArc';
import { CrackleField } from './CrackleField';
import { FlameSilhouette } from './FlameSilhouette';

interface ShotCanvasProps {
  shot: Shot;
  /** 字幕文字 */
  subtitle?: string;
}

/**
 * 单镜画布：根据 shot 的类型与 motif 组合视觉元素
 */
export function ShotCanvas({ shot, subtitle }: ShotCanvasProps) {
  const seed = `c${shot.chapter}-s${shot.sub}-${shot.id}`;

  // 根据 motif 决定视觉风格
  const palette = useMemo(() => {
    if (shot.motif.includes('fire') && shot.mood !== 'grief') {
      return { bg: '#0E0A08', primary: '#C2502A', secondary: '#E8893A', accent: '#FFD4A0' };
    }
    if (shot.motif.includes('snow')) {
      return { bg: '#0B1014', primary: '#A8B8C4', secondary: '#EFE7D6', accent: '#6FA39B' };
    }
    if (shot.motif.includes('sea')) {
      return { bg: '#08111A', primary: '#3A6B8A', secondary: '#6FA39B', accent: '#C9A972' };
    }
    if (shot.motif.includes('gold')) {
      return { bg: '#0E1116', primary: '#C9A972', secondary: '#E8D5A0', accent: '#C2502A' };
    }
    if (shot.motif.includes('crackle')) {
      return { bg: '#0A0E11', primary: '#C9A972', secondary: '#6FA39B', accent: '#EFE7D6' };
    }
    if (shot.motif.includes('mist')) {
      return { bg: '#0F1418', primary: '#6FA39B', secondary: '#A8B8C4', accent: '#EFE7D6' };
    }
    if (shot.motif.includes('ruin')) {
      return { bg: '#0B0907', primary: '#7A4030', secondary: '#C2502A', accent: '#C9A972' };
    }
    return { bg: '#0E1116', primary: '#C9A972', secondary: '#EFE7D6', accent: '#C2502A' };
  }, [shot.motif, shot.mood]);

  // 字幕位置
  const subtitlePos = shot.type === 'closeup' || shot.type === 'macro' ? 'bottom' : 'middle';

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-fade"
      style={{ background: palette.bg }}
      key={shot.id}
    >
      {/* 背景渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${palette.primary}22 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${palette.accent}18 0%, transparent 60%)`,
        }}
      />

      {/* 噪点 */}
      <div className="grain absolute inset-0" />

      {/* 暗角 */}
      <div className="vignette absolute inset-0" />

      {/* 视觉元素层 */}
      {renderVisualLayers(shot, seed, palette)}

      {/* 字幕 */}
      {subtitle && (
        <div
          className={`absolute left-0 right-0 flex justify-center pointer-events-none px-8 ${
            subtitlePos === 'middle' ? 'top-1/2 -translate-y-1/2' : 'bottom-24'
          }`}
        >
          <div
            className="subtitle text-paper text-xl md:text-2xl lg:text-3xl text-center max-w-4xl leading-relaxed"
            style={{ fontWeight: 400 }}
          >
            {subtitle}
          </div>
        </div>
      )}

      {/* 角落印章 */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-1 pointer-events-none">
        <div className="text-gold/40 text-xs shot-num">SHOT {String(shot.id).padStart(2, '0')}</div>
        <div className="text-gold/30 text-[10px] tracking-widest uppercase">
          {shot.type}
        </div>
      </div>
    </div>
  );
}

function renderVisualLayers(shot: Shot, seed: string, palette: { bg: string; primary: string; secondary: string; accent: string }) {
  // 黑场：只显示点阵 + 中心光弧
  if (shot.type === 'black') {
    return (
      <>
        <DotMatrix seed={seed + 'dm'} cols={60} rows={34} color={palette.primary} density={0.25} scale={0.7} />
        <div className="absolute inset-0 flex items-center justify-center">
          <LightArc rotate={0} arc={Math.PI * 1.4} radius={36} color={palette.accent} width={1.4} blur={10} />
          <LightArc rotate={120} arc={Math.PI * 0.8} radius={28} color={palette.primary} width={0.8} blur={8} reverse />
        </div>
      </>
    );
  }

  // 远景：天空 + 地平线 + 点阵
  if (shot.type === 'wide') {
    return (
      <>
        {/* 天空 */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.primary}11 60%, ${palette.primary}22 100%)`,
          }}
        />
        {/* 地平线 */}
        <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: palette.primary, opacity: 0.4 }} />
        {/* 远景点阵 */}
        <DotMatrix seed={seed + 'far'} cols={100} rows={20} color={palette.primary} density={0.18} scale={0.5} />
        {/* 中景点阵 */}
        <DotMatrix seed={seed + 'mid'} cols={60} rows={20} color={palette.secondary} density={0.45} scale={0.7} />
        {/* 光弧 */}
        {shot.motif.includes('fire') && (
          <LightArc rotate={0} radius={45} color={palette.accent} width={1.2} blur={12} />
        )}
      </>
    );
  }

  // 中景：人物剪影 + 火焰
  if (shot.type === 'medium') {
    return (
      <>
        <DotMatrix seed={seed} cols={60} rows={34} color={palette.primary} density={0.3} scale={0.6} />
        {/* 人物剪影（简化） */}
        <div className="absolute inset-0 flex items-end justify-center pb-12">
          <div
            className="w-32 h-48 md:w-40 md:h-56 rounded-t-full"
            style={{
              background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.primary}33 100%)`,
              filter: 'blur(2px)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>
        {shot.motif.includes('fire') && (
          <FlameSilhouette count={4} intensity={0.6} />
        )}
        {shot.motif.includes('crackle') && (
          <CrackleField seed={seed + 'c'} count={8} color={palette.secondary} width={0.7} />
        )}
      </>
    );
  }

  // 近景：眼睛 / 面孔
  if (shot.type === 'closeup' || shot.type === 'over-shoulder') {
    return (
      <>
        <DotMatrix seed={seed} cols={80} rows={45} color={palette.primary} density={0.55} scale={0.7} />
        {shot.motif.includes('fire') && <LightArc rotate={20} color={palette.accent} width={1.5} blur={8} />}
        {shot.motif.includes('rain') && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-8"
                style={{
                  left: `${(i * 53) % 100}%`,
                  top: `${(i * 31) % 100}%`,
                  background: `linear-gradient(180deg, transparent, ${palette.secondary}88)`,
                  animation: `rainFall ${0.6 + (i % 5) * 0.15}s linear infinite`,
                  animationDelay: `${(i * 0.07) % 1}s`,
                  opacity: 0.4,
                }}
              />
            ))}
            <style>{`@keyframes rainFall { from { transform: translateY(-20px); } to { transform: translateY(100vh); } }`}</style>
          </>
        )}
      </>
    );
  }

  // 特写：裂纹场 + 点阵
  if (shot.type === 'macro') {
    return (
      <>
        <DotMatrix seed={seed + 'bg'} cols={60} rows={34} color={palette.primary} density={0.35} scale={0.5} />
        <CrackleField seed={seed} count={shot.motif.includes('crackle') ? 18 : 6} color={palette.accent} width={1.2} />
        {shot.motif.includes('fire') && <LightArc rotate={45} color={palette.primary} width={1.5} blur={10} />}
      </>
    );
  }

  // 闪回：白色闪白 + 点阵
  if (shot.type === 'flashback') {
    return (
      <>
        <div className="absolute inset-0" style={{ background: 'rgba(239, 231, 214, 0.12)' }} />
        <DotMatrix seed={seed} cols={80} rows={45} color={palette.secondary} density={0.4} scale={0.8} />
        <CrackleField seed={seed} count={10} color={palette.primary} width={0.8} />
        {shot.motif.includes('fire') && <LightArc rotate={0} color={palette.accent} width={1.4} blur={10} />}
      </>
    );
  }

  // 定格：金色边框
  if (shot.type === 'freeze') {
    return (
      <>
        <DotMatrix seed={seed} cols={60} rows={34} color={palette.primary} density={0.5} scale={0.7} />
        <div className="absolute inset-8 border" style={{ borderColor: `${palette.accent}88`, boxShadow: `0 0 32px ${palette.accent}44` }} />
        <CrackleField seed={seed} count={6} color={palette.accent} width={1} />
      </>
    );
  }

  // 分屏
  if (shot.type === 'split') {
    return (
      <>
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <DotMatrix seed={seed + 'L'} cols={40} rows={45} color={palette.primary} density={0.5} />
          {shot.motif.includes('hand') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2" style={{ borderColor: palette.secondary }} />
            </div>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <DotMatrix seed={seed + 'R'} cols={40} rows={45} color={palette.accent} density={0.5} />
          {shot.motif.includes('crackle') && <CrackleField seed={seed + 'cR'} count={8} color={palette.secondary} width={0.8} />}
        </div>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ background: palette.accent, opacity: 0.6 }} />
        <FlameSilhouette count={6} intensity={0.8} />
      </>
    );
  }

  // 蒙太奇：多块色块 + 快切点阵
  if (shot.type === 'montage') {
    const blocks = 3;
    return (
      <>
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${i * (100 / blocks)}%`,
              top: 0,
              width: `${100 / blocks}%`,
              height: '100%',
              borderRight: i < blocks - 1 ? `1px solid ${palette.primary}44` : 'none',
            }}
          >
            <DotMatrix
              seed={seed + 'b' + i}
              cols={25}
              rows={40}
              color={i % 2 === 0 ? palette.primary : palette.accent}
              density={0.5}
              scale={0.6}
            />
            {i === 1 && shot.motif.includes('fire') && <FlameSilhouette count={3} intensity={0.5} />}
          </div>
        ))}
      </>
    );
  }

  // POV：分叉路径
  if (shot.type === 'pov') {
    return (
      <>
        <DotMatrix seed={seed} cols={60} rows={34} color={palette.primary} density={0.3} scale={0.5} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 50 100 L 20 30" stroke={palette.secondary} strokeWidth="0.6" fill="none" opacity="0.7" />
          <path d="M 50 100 L 80 30" stroke={palette.accent} strokeWidth="0.6" fill="none" opacity="0.7" />
          <circle cx="20" cy="30" r="2" fill={palette.secondary} />
          <circle cx="80" cy="30" r="2" fill={palette.accent} />
        </svg>
      </>
    );
  }

  // 默认
  return <DotMatrix seed={seed} cols={60} rows={34} color={palette.primary} density={0.4} scale={0.7} />;
}

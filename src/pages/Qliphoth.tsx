// 逆卡巴拉生命之树可视化页面

import { Link } from 'react-router-dom';
import { sephirot, qliphoth, sephirahById, qliphahBySephirah } from '../data/qliphoth';
import { useState } from 'react';
import { ArrowLeft, Eye, Skull, Sparkles, TreePine } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Qliphoth() {
  const [selectedId, setSelectedId] = useState<string>('control');

  const sel = sephirahById(selectedId);
  const qli = qliphahBySephirah(selectedId);

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-hidden">
      {/* 顶部 */}
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">逆卡巴拉生命之树</h1>
        <span className="text-text-dim font-mono text-[10px]">10 Sephirot · 10 Qliphoth</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 树形可视化 */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,#1a1a2a,#060608)] overflow-auto">
          <svg viewBox="0 0 700 700" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="halo">
                <stop offset="0%" stopColor="#ffe600" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffe600" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="path" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00ffd5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00ffd5" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* 三大路径（22 通道） */}
            {/* 中央垂直（Kether-Malkuth） */}
            <line x1="350" y1="50" x2="350" y2="650" stroke="url(#path)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Mercy 之柱（Kether → Chokhmah → Tiphareth → Netzach → Yesod → Malkuth） */}
            <path d="M 350 50 Q 200 150 350 250 Q 200 350 250 450 Q 200 550 350 650" fill="none" stroke="#4dff88" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />

            {/* Severity 之柱（Kether → Binah → Tiphareth → Geburah → Hod → Malkuth） */}
            <path d="M 350 50 Q 500 150 350 250 Q 500 350 450 450 Q 500 550 350 650" fill="none" stroke="#ff0033" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />

            {/* 通道（10 × 22）部分高亮 */}
            {sephirot.map((s, i) => {
              const next = sephirot[(i + 1) % sephirot.length];
              return (
                <line
                  key={s.id}
                  x1={s.position.x * 80 + 350}
                  y1={s.position.y * 130 + 80}
                  x2={next.position.x * 80 + 350}
                  y2={next.position.y * 130 + 80}
                  stroke="#2a2a35"
                  strokeWidth="1"
                />
              );
            })}

            {/* 质点圆球 */}
            {sephirot.map((s) => {
              const isSel = s.id === selectedId;
              const x = s.position.x * 80 + 350;
              const y = s.position.y * 130 + 80;
              return (
                <g
                  key={s.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(s.id)}
                >
                  {/* 光晕 */}
                  {isSel && (
                    <circle r="40" fill="url(#halo)" />
                  )}
                  {/* 主圆 */}
                  <circle
                    r={isSel ? 28 : 22}
                    fill="#16161c"
                    stroke={s.color}
                    strokeWidth={isSel ? 3 : 2}
                  />
                  {/* 字符 */}
                  <text
                    textAnchor="middle"
                    dy="6"
                    fontSize="22"
                    fontFamily="serif"
                    fill={s.color}
                    style={{ fontFamily: 'serif' }}
                  >
                    {s.glyph}
                  </text>
                  {/* 序号 */}
                  <text
                    y="-32"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#5a5a5a"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {String(s.order).padStart(2, '0')}
                  </text>
                  {/* 名称 */}
                  <text
                    y="44"
                    textAnchor="middle"
                    fontSize="10"
                    fill={isSel ? '#ffe600' : '#e8e6df'}
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {s.name}
                  </text>
                  <text
                    y="56"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#5a5a5a"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {s.english}
                  </text>
                </g>
              );
            })}

            {/* 三柱说明 */}
            <text x="100" y="30" fill="#4dff88" fontSize="10" style={{ fontFamily: 'Orbitron, sans-serif' }}>慈悲之柱 (Mercy)</text>
            <text x="600" y="30" fill="#ff0033" fontSize="10" style={{ fontFamily: 'Orbitron, sans-serif' }}>严厉之柱 (Severity)</text>
            <text x="350" y="30" textAnchor="middle" fill="#ffe600" fontSize="10" style={{ fontFamily: 'Orbitron, sans-serif' }}>平衡之柱 (Balance)</text>
          </svg>
        </div>

        {/* 详情面板 */}
        <div className="w-96 bg-obsidian border-l border-panel-light overflow-y-auto p-4 font-mono text-xs space-y-4">
          {sel && (
            <>
              {/* Sephirah 标题 */}
              <div className="border-l-4 pl-3" style={{ borderColor: sel.color }}>
                <div className="text-text-mute text-[10px]">Sephirah {String(sel.order).padStart(2, '0')}</div>
                <h2 className="font-display text-2xl font-bold" style={{ color: sel.color }}>
                  {sel.name} · <span className="text-bone">{sel.english}</span>
                </h2>
                <div className="text-text-dim font-serif text-base mt-1" dir="rtl">{sel.hebrew}</div>
              </div>

              {/* 关键属性 */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <Cell label="所属之柱" value={sel.pillar} valueColor={sel.pillar === 'MERCY' ? '#4dff88' : sel.pillar === 'SEVERITY' ? '#ff0033' : '#ffe600'} />
                <Cell label="所属世界" value={sel.world} />
                <Cell label="神名" value={sel.godName} valueColor="#c08aff" />
                <Cell label="大天使" value={sel.archangel} valueColor="#c08aff" />
                <Cell label="行星" value={sel.planet} />
                <Cell label="解锁日" value={`第 ${sel.unlockedDay} 天`} />
              </div>

              <div className="border-t border-panel-light/40 pt-3 space-y-1">
                <Cell label="至高美德" value={sel.virtue} valueColor="#4dff88" />
                <Cell label="对应罪孽" value={sel.vice} valueColor="#ff0033" />
              </div>
            </>
          )}

          {qli && (
            <>
              {/* 分割 */}
              <div className="border-t-2 border-alert/40 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Skull className="w-4 h-4 text-alert" />
                  <span className="font-display text-alert font-bold tracking-widest text-sm">QLIPHOTH</span>
                  <span className="text-text-mute text-[10px] ml-auto">阴影面</span>
                </div>
                <h3 className="font-display text-amber text-lg font-bold">
                  {qli.name} · <span className="text-bone">{qli.english}</span>
                </h3>
                <div className="text-text-dim font-serif text-base mt-1" dir="rtl">{qli.hebrew}</div>
              </div>

              <div className="space-y-1 text-[10px]">
                <Cell label="阴影实体" value={qli.demon} valueColor="#ff0033" />
                <Cell label="阴影原型" value={qli.archetype} valueColor="#c08aff" />
                <Cell label="代表之罪" value={qli.sin} valueColor="#ff0033" />
                <Cell label="核心异想体" value={qli.coreAbnormality} valueColor="#ffe600" />
              </div>

              <div className="text-bone/80 text-[11px] leading-relaxed border-l-2 border-alert/40 pl-3 italic">
                {qli.description}
              </div>

              <div className="text-[10px] text-text-dim">
                <span className="text-alert font-bold">阴影特质：</span>{qli.shadowTrait}
              </div>

              {/* 5 天核心抑制剧情节拍 */}
              <div className="border-t border-panel-light/40 pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TreePine className="w-3 h-3 text-amber" />
                  <span className="font-display text-amber text-xs tracking-widest">核心抑制 · 5 天节拍</span>
                </div>
                <div className="space-y-1.5">
                  {qli.suppressionPhases.map((p) => (
                    <div key={p.day} className="bg-panel/40 border-l-2 border-amber/40 p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display text-amber text-[10px]">D{p.day}</span>
                        <span className="text-bone text-[11px] font-bold">「{p.title}」</span>
                      </div>
                      <div className="text-text-mute text-[10px] leading-relaxed">{p.narrative}</div>
                      <div className="text-enkephalin text-[10px] mt-1">▸ {p.choice}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-text-mute text-[9px] uppercase tracking-wider">{label}</span>
      <span className="text-bone" style={valueColor ? { color: valueColor } : undefined}>{value}</span>
    </div>
  );
}

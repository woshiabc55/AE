// 设计方案库：8 种截然不同的视觉主题
import { useState } from 'react';

interface Scheme {
  id: string;
  name: string;
  cn: string;
  era: string;
  desc: string;
  fonts: { display: string; body: string };
  colors: { bg: string; fg: string; accent: string; accent2: string };
  motifs: string[];
  sample: string; // 样张
  preview: React.CSSProperties;
}

const SCHEMES: Scheme[] = [
  {
    id: 'bauhaus', name: 'Bauhaus', cn: '包豪斯', era: '1919–1933',
    desc: '功能至上，红黄蓝三原色，几何原型，sans-serif 主导。',
    fonts: { display: '"Fraunces", serif', body: '"Inter Tight", sans-serif' },
    colors: { bg: '#f5f1e8', fg: '#0a0a0a', accent: '#d63b1f', accent2: '#1f4ed6' },
    motifs: ['Circle', 'Square', 'Triangle'],
    sample: 'FORM FOLLOWS FUNCTION',
    preview: { background: '#f5f1e8', color: '#0a0a0a' },
  },
  {
    id: 'brutalist', name: 'Brutalist', cn: '粗野主义', era: '1950s–70s',
    desc: '裸混凝土，巨型无衬线，硬切角，单色调。',
    fonts: { display: '"Inter Tight", sans-serif', body: '"JetBrains Mono", monospace' },
    colors: { bg: '#0a0a0a', fg: '#f5f1e8', accent: '#f5f1e8', accent2: '#666' },
    motifs: ['Concrete', 'Block', 'Grid'],
    sample: 'RAW · UNFINISHED · TRUE',
    preview: { background: '#0a0a0a', color: '#f5f1e8' },
  },
  {
    id: 'cyberpunk', name: 'Cyberpunk', cn: '赛博朋克', era: '1980s–',
    desc: '霓虹紫粉，CRT 扫描线，等宽数字，故障美学。',
    fonts: { display: '"JetBrains Mono", monospace', body: '"JetBrains Mono", monospace' },
    colors: { bg: '#0a0014', fg: '#ff71ce', accent: '#01cdfe', accent2: '#b967ff' },
    motifs: ['Neon', 'Glitch', 'Hologram'],
    sample: 'WAKE UP · SAMURAI',
    preview: { background: 'linear-gradient(180deg,#0a0014,#1a0033)', color: '#ff71ce' },
  },
  {
    id: 'swiss', name: 'Swiss / Intl.', cn: '瑞士国际', era: '1950s–',
    desc: '网格 + Helvetica + 红黑白 + 摄影，可读性第一。',
    fonts: { display: '"Inter Tight", sans-serif', body: '"Inter Tight", sans-serif' },
    colors: { bg: '#fafafa', fg: '#0a0a0a', accent: '#d9020d', accent2: '#0050b5' },
    motifs: ['Grid', 'Helvetica', 'Asymmetry'],
    sample: 'TYPOPHOTO · KLINGE',
    preview: { background: '#fafafa', color: '#0a0a0a' },
  },
  {
    id: 'editorial', name: 'Editorial', cn: '杂志编辑', era: '1960s–',
    desc: '大字号衬线，慷慨留白，黑白照片，多栏排版。',
    fonts: { display: '"Fraunces", serif', body: '"Fraunces", serif' },
    colors: { bg: '#f5f1e8', fg: '#0a0a0a', accent: '#0a0a0a', accent2: '#888' },
    motifs: ['Drop cap', 'Margin', 'Column'],
    sample: 'The Saturday Essay',
    preview: { background: '#f5f1e8', color: '#0a0a0a' },
  },
  {
    id: 'memphis', name: 'Memphis', cn: '孟菲斯', era: '1981–1987',
    desc: '粉绿黄黑对比，几何拼贴，瑞士点阵，戏谑感。',
    fonts: { display: '"Fraunces", serif', body: '"Inter Tight", sans-serif' },
    colors: { bg: '#fff5e1', fg: '#0a0a0a', accent: '#ff3da5', accent2: '#00e5ff' },
    motifs: ['Squiggle', 'Dots', 'Confetti'],
    sample: 'PLAYFUL · POSTMODERN',
    preview: { background: '#fff5e1', color: '#0a0a0a' },
  },
  {
    id: 'terminal', name: 'Terminal', cn: '终端', era: '1970s–',
    desc: '黑底绿字，等宽字体，闪烁光标，最少装饰。',
    fonts: { display: '"JetBrains Mono", monospace', body: '"JetBrains Mono", monospace' },
    colors: { bg: '#000', fg: '#0f0', accent: '#0f0', accent2: '#fff' },
    motifs: ['Cursor', 'Prompt', 'Boot'],
    sample: '$ whoami',
    preview: { background: '#000', color: '#0f0' },
  },
  {
    id: 'vaporwave', name: 'Vaporwave', cn: '蒸汽波', era: '2010s',
    desc: '粉青紫渐变，希腊雕塑，Windows 95，故障 VHS。',
    fonts: { display: '"Fraunces", serif', body: '"Inter Tight", sans-serif' },
    colors: { bg: 'linear-gradient(180deg,#ff71ce,#01cdfe,#b967ff)', fg: '#fff', accent: '#f0ff00', accent2: '#ff71ce' },
    motifs: ['Grid floor', 'Bust', 'Chrome'],
    sample: 'AESTHETIC · 201X',
    preview: { background: 'linear-gradient(180deg,#ff71ce,#01cdfe,#b967ff)', color: '#fff' },
  },
];

export default function Schemes() {
  const [active, setActive] = useState<Scheme>(SCHEMES[0]);
  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-volt mb-4">// DESIGN SCHEMES / 设计方案</div>
          <h1 className="font-display font-black text-7xl md:text-9xl leading-[0.85] tracking-tighter">
            <span className="block">{SCHEMES.length}</span>
            <span className="block text-volt italic">visual</span>
            <span className="block">schemes.</span>
          </h1>
          <p className="mt-8 text-bone/70 max-w-2xl text-lg leading-relaxed">
            从包豪斯到蒸汽波——8 种截然不同的设计语言，每一种都自成一个完整的设计宇宙。
            点击下方任一样张可放大预览。
          </p>
        </div>
      </section>

      {/* 主对比区 */}
      <section className="border-b-2 border-bone/20 grid lg:grid-cols-2">
        {/* 左：样张墙 */}
        <div className="grid grid-cols-2 gap-0 border-r-2 border-bone/20">
          {SCHEMES.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`aspect-[4/5] p-4 text-left relative group border-r-2 border-b-2 border-bone/20 ${active.id === s.id ? 'ring-2 ring-volt ring-inset' : ''}`}
              style={s.preview}
            >
              <div className="font-mono text-[9px] opacity-60 absolute top-2 left-2">{s.era}</div>
              <div className="font-mono text-[10px] absolute top-2 right-2 opacity-60">{s.id.toUpperCase()}</div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-mono text-[10px] opacity-70">{s.cn}</div>
                <div className="font-display font-black text-2xl md:text-3xl leading-tight tracking-tight">{s.name}</div>
                <div className="font-mono text-[10px] opacity-60 mt-1">{s.motifs.join(' · ')}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 右：详情 */}
        <div className="p-8 md:p-12">
          <div className="flex items-baseline gap-3 mb-4 font-mono text-xs">
            <span className="text-bone/40">ERA</span>
            <span className="text-volt">{active.era}</span>
            <span className="text-bone/40">/</span>
            <span className="text-bone/40">MOTIFS</span>
            <span className="text-bone">{active.motifs.join(' · ')}</span>
          </div>
          <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none">
            {active.name}
            <span className="text-bone/40 text-2xl md:text-3xl ml-3">/ {active.cn}</span>
          </h2>
          <p className="text-bone/70 mt-6 max-w-xl text-lg leading-relaxed">{active.desc}</p>

          {/* 配色 */}
          <div className="mt-8">
            <div className="font-mono text-[10px] text-bone/40 mb-2">COLOR · {active.colors.bg.length > 20 ? 'GRADIENT' : 'SOLID'}</div>
            <div className="grid grid-cols-4 gap-2">
              <ColorSwatch label="BG" value={active.colors.bg} />
              <ColorSwatch label="FG" value={active.colors.fg} />
              <ColorSwatch label="AC1" value={active.colors.accent} />
              <ColorSwatch label="AC2" value={active.colors.accent2} />
            </div>
          </div>

          {/* 字体 */}
          <div className="mt-6">
            <div className="font-mono text-[10px] text-bone/40 mb-2">TYPOGRAPHY</div>
            <div className="font-mono text-xs">
              <div>DISPLAY: <span style={{ fontFamily: active.fonts.display }}>{active.fonts.display.split(',')[0].replace(/"/g, '')}</span></div>
              <div>BODY: <span style={{ fontFamily: active.fonts.body }}>{active.fonts.body.split(',')[0].replace(/"/g, '')}</span></div>
            </div>
          </div>

          {/* 样张 */}
          <div className="mt-8 border-2 p-6 md:p-8" style={{ ...active.preview, borderColor: 'currentColor' }}>
            <div className="font-mono text-[10px] opacity-60 mb-3">// SAMPLE TYPOGRAPHY</div>
            <div className="text-3xl md:text-5xl font-black leading-none tracking-tight" style={{ fontFamily: active.fonts.display }}>
              {active.sample}
            </div>
            <div className="mt-4 text-sm leading-relaxed opacity-80" style={{ fontFamily: active.fonts.body }}>
              The quick brown fox jumps over the lazy dog. 1234567890
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="border-2 p-2" style={{ borderColor: 'currentColor' }}>BUTTON</div>
              <div className="border-2 p-2" style={{ borderColor: 'currentColor' }}>CARD</div>
              <div className="border-2 p-2" style={{ borderColor: 'currentColor' }}>TAG</div>
            </div>
          </div>
        </div>
      </section>

      {/* 全部方案速览 */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
            <span className="font-mono text-xs text-bone/40">ALL</span>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">所有方案</h2>
            <span className="font-mono text-xs text-bone/60 ml-2">/ {SCHEMES.length} 视觉主题</span>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEMES.map(s => (
              <div key={s.id} className="border-2 border-bone/30 overflow-hidden group hover:border-bone transition-colors">
                <div className="aspect-video relative p-4 flex items-center justify-center text-center" style={s.preview}>
                  <div>
                    <div className="font-mono text-[9px] opacity-60">{s.era}</div>
                    <div className="font-display font-black text-2xl leading-tight">{s.name}</div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-mono text-[10px] text-bone/40">{s.cn}</div>
                  <div className="text-sm mt-1 line-clamp-2 text-bone/70">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  const isGrad = value.length > 20;
  return (
    <div className="border-2 border-bone/30">
      <div className="aspect-square" style={{ background: value }} />
      <div className="p-2 font-mono text-[10px]">
        <div className="text-bone/40">{label}</div>
        <div className="text-bone truncate">{isGrad ? 'gradient' : value}</div>
      </div>
    </div>
  );
}

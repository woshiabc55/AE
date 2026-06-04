import { useState } from 'react';

// 12 种 IP / 游戏类型设计
interface GameScheme {
  id: string;
  ip: string;
  cn: string;
  genre: string;
  desc: string;
  colors: { bg: string; fg: string; ac1: string; ac2: string; ac3?: string };
  fonts: { d: string; b: string };
  signature: string; // 该 IP 的招牌视觉元素
  tags: string[];
}

const GAMES: GameScheme[] = [
  {
    id: 'genshin', ip: 'Genshin Impact', cn: '原神', genre: 'Anime Fantasy',
    desc: 'Teyvat 奇幻世界，金色琉璃、碧空、翠绿森林与水晶质感。',
    colors: { bg: '#0d4a6e', fg: '#fff5d6', ac1: '#f0c860', ac2: '#5fc4d4', ac3: '#a8d8a8' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: '✦',
    tags: ['Open World', 'Gacha', 'Anime'],
  },
  {
    id: 'hsr', ip: 'Honkai: Star Rail', cn: '星穹铁道', genre: 'Sci-Fi Anime',
    desc: '紫粉蓝渐变宇宙，等宽数据，未来主义 HUD 元素。',
    colors: { bg: '#1a0a3a', fg: '#e8d8ff', ac1: '#b967ff', ac2: '#ff71ce', ac3: '#01cdfe' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: '✦',
    tags: ['Turn-based', 'Sci-Fi', 'Space'],
  },
  {
    id: 'persona5', ip: 'Persona 5', cn: '女神异闻录 5', genre: 'Stylish Comic',
    desc: '红黑白三色，斜切对话框，漫画速度线，反叛感。',
    colors: { bg: '#0a0a0a', fg: '#fff', ac1: '#d9020d', ac2: '#fff', ac3: '#000' },
    fonts: { d: '"Inter Tight", sans-serif', b: '"Inter Tight", sans-serif' },
    signature: '!',
    tags: ['JRPG', 'Stylish', 'Comic'],
  },
  {
    id: 'hades', ip: 'Hades', cn: '哈迪斯', genre: 'Greek Myth',
    desc: '冥界橙红 + 爱琴海青绿，纹饰与火焰，墨色人物剪影。',
    colors: { bg: '#1a0a14', fg: '#f5d8a0', ac1: '#ff5e2b', ac2: '#2ba4a4', ac3: '#d4a05f' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: 'Ω',
    tags: ['Roguelike', 'Action', 'Greek'],
  },
  {
    id: 'zelda', ip: 'Zelda: BotW / TotK', cn: '塞尔达传说', genre: 'Cel-shaded',
    desc: '水彩天空，绿原黄沙，褪色羊皮纸地图，日系童话。',
    colors: { bg: '#a8c8a0', fg: '#2a3a28', ac1: '#d4a05f', ac2: '#5fa4d4', ac3: '#f0d860' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: '✧',
    tags: ['Open World', 'Adventure', 'Fairy'],
  },
  {
    id: 'ff7', ip: 'Final Fantasy', cn: '最终幻想', genre: 'Crystal Fantasy',
    desc: '水晶蓝紫渐变，星点繁复，金色花纹边框，史诗交响。',
    colors: { bg: 'linear-gradient(180deg,#0a1a4a,#1a3a8a,#4a2a8a)', fg: '#fff5d6', ac1: '#f0c860', ac2: '#5fc4d4', ac3: '#fff' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: '✦',
    tags: ['JRPG', 'Fantasy', 'Cinematic'],
  },
  {
    id: 'pokemon', ip: 'Pokémon', cn: '精灵宝可梦', genre: 'Classic Anime',
    desc: '黄红蓝三原色，圆润卡通风，红色徽章，星形 UI。',
    colors: { bg: '#f0d860', fg: '#1a2856', ac1: '#d63b1f', ac2: '#1f4ed6', ac3: '#fff' },
    fonts: { d: '"Inter Tight", sans-serif', b: '"Inter Tight", sans-serif' },
    signature: '◉',
    tags: ['RPG', 'Creature', 'Casual'],
  },
  {
    id: 'minecraft', ip: 'Minecraft', cn: '我的世界', genre: 'Voxel',
    desc: '像素方块、草地泥土、像素 UI、8-bit 字体与蓝天。',
    colors: { bg: '#5fb3d4', fg: '#3a2a1a', ac1: '#5fa84a', ac2: '#a87a4a', ac3: '#f0c860' },
    fonts: { d: '"JetBrains Mono", monospace', b: '"JetBrains Mono", monospace' },
    signature: '▣',
    tags: ['Sandbox', 'Voxel', 'Survival'],
  },
  {
    id: 'darksouls', ip: 'Dark Souls', cn: '黑暗之魂', genre: 'Gothic',
    desc: '深褐灰黑，熔金，米色羊皮纸，雕刻花纹，庄严绝望。',
    colors: { bg: '#1a1410', fg: '#d4c4a0', ac1: '#a08440', ac2: '#5a4830', ac3: '#f0d860' },
    fonts: { d: '"Fraunces", serif', b: '"Fraunces", serif' },
    signature: '✠',
    tags: ['Souls-like', 'Gothic', 'Hard'],
  },
  {
    id: 'hollow', ip: 'Hollow Knight', cn: '空洞骑士', genre: '2D Ink',
    desc: '墨黑 + 古金，简洁手绘线条，昆虫剪影，幽深洞穴。',
    colors: { bg: '#0a0a14', fg: '#a8a8c4', ac1: '#f0c860', ac2: '#5a6a8a', ac3: '#fff' },
    fonts: { d: '"Fraunces", serif', b: '"Inter Tight", sans-serif' },
    signature: '✦',
    tags: ['Metroidvania', '2D', 'Ink'],
  },
  {
    id: 'disco', ip: 'Disco Elysium', cn: '极乐迪斯科', genre: 'Oil Painting',
    desc: '油画质感，棕黄灰绿，磨损皮革，弹孔纸张，意识流。',
    colors: { bg: '#2a2418', fg: '#d4c4a0', ac1: '#a8483a', ac2: '#5a8a4a', ac3: '#c0a050' },
    fonts: { d: '"Fraunces", serif', b: '"Fraunces", serif' },
    signature: '✎',
    tags: ['RPG', 'Detective', 'Narrative'],
  },
  {
    id: 'death', ip: 'Death Stranding', cn: '死亡搁浅', genre: 'Neon Sci-Fi',
    desc: '霓虹黄 + 漆黑，山地荒凉，扫描线，全息数据带。',
    colors: { bg: '#0a0a0a', fg: '#d4c4a0', ac1: '#f0ff00', ac2: '#1a1a1a', ac3: '#a8a8a8' },
    fonts: { d: '"Inter Tight", sans-serif', b: '"JetBrains Mono", monospace' },
    signature: '◈',
    tags: ['Sci-Fi', 'Walking Sim', 'Cinematic'],
  },
];

export default function GameSchemes() {
  const [active, setActive] = useState(0);
  const a = GAMES[active];

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-volt mb-4">// IP GAME SCHEMES / 游戏类型设计 · 12</div>
          <h1 className="font-display font-black text-7xl md:text-9xl leading-[0.85] tracking-tighter">
            <span className="block">{GAMES.length}</span>
            <span className="block text-volt italic">game</span>
            <span className="block">aesthetics.</span>
          </h1>
          <p className="mt-8 text-bone/70 max-w-2xl text-lg leading-relaxed">
            12 种具有代表性的游戏视觉语言——从《原神》的琉璃到《空洞骑士》的墨黑，从《最终幻想》的水晶到《死亡搁浅》的霓虹。
            点击任一样张可深入查看配色、字体、招牌元素。
          </p>
        </div>
      </section>

      {/* 主对比区 */}
      <section className="border-b-2 border-bone/20">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          {/* 左：当前方案详情 */}
          <div className="p-6 md:p-10 border-r-2 border-bone/20">
            <div className="flex items-baseline gap-3 mb-4 font-mono text-[10px]">
              <span className="text-bone/40">№ {String(active+1).padStart(2,'0')} / {GAMES.length}</span>
              <span className="text-volt">{a.genre}</span>
            </div>
            <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none">
              {a.ip}
            </h2>
            <div className="font-display text-2xl mt-2 text-bone/60">{a.cn}</div>
            <p className="text-bone/70 mt-6 text-base leading-relaxed">{a.desc}</p>

            <div className="mt-8 grid grid-cols-5 gap-2">
              {(['bg','fg','ac1','ac2','ac3'] as const).map(k => {
                const v = a.colors[k];
                if (!v) return <div key={k} className="aspect-square bg-bone/5 border-2 border-bone/10" />;
                const isGrad = v.length > 20;
                return (
                  <div key={k} className="border-2 border-bone/30">
                    <div className="aspect-square" style={{ background: v }} />
                    <div className="p-1.5 font-mono text-[8px] text-center text-bone/50 uppercase">{k}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 font-mono text-xs space-y-1">
              <div>DISPLAY · <span style={{ fontFamily: a.fonts.d }}>{a.fonts.d.split(',')[0].replace(/"/g, '')}</span></div>
              <div>BODY · <span style={{ fontFamily: a.fonts.b }}>{a.fonts.b.split(',')[0].replace(/"/g, '')}</span></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {a.tags.map(t => (
                <span key={t} className="px-2 py-0.5 border-2 border-bone/40 text-[10px] font-mono">#{t}</span>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setActive((active - 1 + GAMES.length) % GAMES.length)} className="flex-1 px-4 py-2 border-2 border-bone/40 font-mono text-xs hover:border-volt hover:text-volt">← PREV</button>
              <button onClick={() => setActive((active + 1) % GAMES.length)} className="flex-1 px-4 py-2 bg-volt text-ink border-2 border-volt font-mono text-xs font-bold">NEXT →</button>
            </div>
          </div>

          {/* 右：样张（按 active 切换） */}
          <div className="p-6 md:p-10 relative" style={{ background: a.colors.bg, color: a.colors.fg, transition: 'all 0.4s' }}>
            <GameMockup game={a} />
          </div>
        </div>
      </section>

      {/* 全部 12 方案网格 */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
            <span className="font-mono text-xs text-bone/40">ALL</span>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">所有 IP 方案</h2>
            <span className="font-mono text-xs text-bone/60 ml-2">/ 12 视觉主题</span>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GAMES.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setActive(i)}
                className={`text-left border-2 ${active === i ? 'border-volt' : 'border-bone/30'} hover:border-bone transition-colors overflow-hidden group`}
              >
                <div className="aspect-[4/5] relative p-3 flex flex-col justify-between" style={{ background: g.colors.bg, color: g.colors.fg, transition: 'background 0.3s' }}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] opacity-60">№ {String(i+1).padStart(2,'0')}</span>
                    <span className="text-2xl" style={{ color: g.colors.ac1 }}>{g.signature}</span>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] opacity-60">{g.genre}</div>
                    <div className="font-display font-black text-2xl leading-tight tracking-tight">{g.ip}</div>
                    <div className="text-xs opacity-70 mt-1">{g.cn}</div>
                  </div>
                  {/* 配色色条 */}
                  <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
                    <div className="flex-1" style={{ background: g.colors.ac1 }} />
                    <div className="flex-1" style={{ background: g.colors.ac2 }} />
                    {g.colors.ac3 && <div className="flex-1" style={{ background: g.colors.ac3 }} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* 每种 IP 都有专属的 mockup 样张 */
function GameMockup({ game }: { game: GameScheme }) {
  if (game.id === 'persona5') return <Persona5Mockup g={game} />;
  if (game.id === 'hollow') return <HollowMockup g={game} />;
  if (game.id === 'minecraft') return <MinecraftMockup g={game} />;
  if (game.id === 'darksouls') return <DarkSoulsMockup g={game} />;
  if (game.id === 'pokemon') return <PokemonMockup g={game} />;
  if (game.id === 'hades') return <HadesMockup g={game} />;
  if (game.id === 'zelda') return <ZeldaMockup g={game} />;
  if (game.id === 'genshin') return <GenshinMockup g={game} />;
  if (game.id === 'hsr') return <HSRMockup g={game} />;
  if (game.id === 'ff7') return <FFMockup g={game} />;
  if (game.id === 'disco') return <DiscoMockup g={game} />;
  return <DeathMockup g={game} />;
}

function Frame({ g, children, badge }: { g: GameScheme; children: React.ReactNode; badge?: string }) {
  return (
    <div className="space-y-4" style={{ fontFamily: g.fonts.b }}>
      <div className="font-mono text-[10px] opacity-60 flex items-center gap-2">
        <span style={{ color: g.colors.ac1 }}>{g.signature}</span>
        <span>// SAMPLE MOCKUP</span>
        {badge && <span className="ml-auto px-2 py-0.5 border opacity-80" style={{ borderColor: g.colors.ac1, color: g.colors.ac1 }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Persona5Mockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="TAKE YOUR HEART">
      <div className="text-6xl md:text-8xl font-black italic tracking-tighter" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, transform: 'skewX(-8deg)', textShadow: '4px 0 #fff, -4px 0 #000' }}>
        PHANTOM
      </div>
      <div className="text-3xl italic font-black tracking-tighter" style={{ transform: 'skewX(-8deg)' }}>THIEVES</div>
      <div className="border-2 border-current p-4 mt-4 relative" style={{ transform: 'skewX(-8deg)' }}>
        <div className="text-2xl font-black">「 WAKE UP 」</div>
        <div className="text-xs mt-1 opacity-80">"A bizarre adventure is about to begin—!"</div>
      </div>
      <div className="flex gap-2">
        {['FIGHT','SKILL','ITEM','ESCAPE'].map((s,i) => (
          <div key={s} className="flex-1 border-2 p-2 text-center font-black text-sm" style={{ borderColor: i===0 ? g.colors.ac1 : g.colors.fg, background: i===0 ? g.colors.ac1 : 'transparent', color: i===0 ? '#000' : g.colors.fg, transform: 'skewX(-8deg)' }}>{s}</div>
        ))}
      </div>
    </Frame>
  );
}

function HollowMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="HALLOWNEST">
      <div className="flex items-end gap-3">
        <div className="text-7xl md:text-9xl font-black leading-[0.8]" style={{ fontFamily: g.fonts.d, color: g.colors.ac1 }}>HK</div>
        <div className="pb-3">
          <div className="text-sm">a lonely kingdom</div>
          <div className="text-2xl font-black">Hallownest</div>
        </div>
      </div>
      <div className="border-2 p-3 mt-4" style={{ borderColor: g.colors.ac1 }}>
        <div className="text-[10px] font-mono opacity-60">SOUL · {Math.floor(Math.random()*99)}/99</div>
        <div className="h-2 mt-1 bg-black/30 border" style={{ borderColor: g.colors.fg }}>
          <div className="h-full" style={{ background: g.colors.ac1, width: '60%' }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['V','F','D'].map(s => (
          <div key={s} className="border-2 p-2 text-center font-black" style={{ borderColor: g.colors.ac1 }}>{s}</div>
        ))}
      </div>
    </Frame>
  );
}

function MinecraftMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="1.20.4">
      <div className="border-4 bg-black/30" style={{ borderColor: g.colors.fg, padding: '2px' }}>
        <div className="grid grid-cols-8 gap-0">
          {Array.from({length: 32}).map((_, i) => {
            const c = [g.colors.ac1, g.colors.ac2, g.colors.ac3!, g.colors.fg, '#a8d4e8'][i%5];
            return <div key={i} className="aspect-square" style={{ background: c, imageRendering: 'pixelated' as any }} />;
          })}
        </div>
      </div>
      <div className="font-mono text-3xl tracking-tight" style={{ fontFamily: g.fonts.d, textShadow: '3px 3px 0 #000' }}>MINECRAFT</div>
      <div className="grid grid-cols-2 gap-1">
        {['SINGLEPLAYER','MULTIPLAYER','OPTIONS','QUIT'].map(s => (
          <div key={s} className="border-2 p-2 text-center font-mono text-xs" style={{ borderColor: g.colors.fg, background: 'rgba(0,0,0,.4)' }}>{s}</div>
        ))}
      </div>
    </Frame>
  );
}

function DarkSoulsMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="DARK SOULS III">
      <div className="font-display text-5xl md:text-7xl font-black leading-[0.85] tracking-tight" style={{ fontFamily: g.fonts.d }}>DARK<br/>SOULS</div>
      <div className="border-y-2 py-2 mt-4 flex justify-between" style={{ borderColor: g.colors.ac1 }}>
        <span>HP</span><span style={{ color: g.colors.ac1 }}>◆ ◆ ◆ ◇</span>
      </div>
      <div className="border-y-2 py-2 flex justify-between" style={{ borderColor: g.colors.ac1 }}>
        <span>FP</span><span style={{ color: g.colors.ac2 }}>◆ ◆ ◇ ◇</span>
      </div>
      <div className="mt-4 text-sm italic opacity-80">"To die, to be reborn..."</div>
      <div className="text-xs mt-2 font-mono opacity-50">HOLLOW · 0 ESTUS</div>
    </Frame>
  );
}

function PokemonMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="GEN IX">
      <div className="bg-white border-4 p-4" style={{ borderColor: g.colors.ac1, color: g.colors.fg }}>
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white" style={{ background: g.colors.ac2 }}>P</div>
          <div>
            <div className="font-black text-xl" style={{ color: g.colors.fg }}>PIKACHU</div>
            <div className="text-[10px]">No. 025 · MOUSE</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: g.colors.ac1 }}>♀</div>
            <div className="text-[10px]">Lv 42</div>
          </div>
        </div>
        <div className="mt-3 space-y-1 font-mono text-xs">
          <div className="flex"><span className="w-16 opacity-60">HP</span><div className="flex-1 h-3 bg-gray-300"><div className="h-full bg-green-500" style={{ width: '85%' }} /></div><span className="w-12 text-right">142</span></div>
          <div className="flex"><span className="w-16 opacity-60">ATK</span><div className="flex-1 h-3 bg-gray-300"><div className="h-full" style={{ width: '60%', background: g.colors.ac1 }} /></div><span className="w-12 text-right">88</span></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {['THUNDERBOLT','QUICK ATTACK','IRON TAIL','SWIFT'].map(m => (
          <div key={m} className="text-center text-[10px] font-mono border-2 p-1" style={{ borderColor: g.colors.ac2, background: 'rgba(255,255,255,.2)' }}>{m}</div>
        ))}
      </div>
    </Frame>
  );
}

function HadesMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="EARLY ACCESS">
      <div className="font-display text-7xl md:text-9xl font-black leading-[0.8]" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, textShadow: '0 0 30px #ff5e2b' }}>HADES</div>
      <div className="font-mono text-sm opacity-80 mt-1">A rogue-like dungeon crawler</div>
      <div className="mt-4 border-2 p-3" style={{ borderColor: g.colors.ac1 }}>
        <div className="text-2xl font-black">ZAGREUS</div>
        <div className="text-xs opacity-80">PRINCE OF THE UNDERWORLD</div>
        <div className="mt-2 flex gap-2">
          {['EXAGRYPH','VARATHA','MALPHON','CORONACHT'].map(w => (
            <span key={w} className="text-[10px] font-mono border px-1.5 py-0.5" style={{ borderColor: g.colors.ac2 }}>{w}</span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ZeldaMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="TEARS OF THE KINGDOM">
      <div className="text-5xl md:text-7xl font-black leading-[0.85]" style={{ fontFamily: g.fonts.d, color: g.colors.fg }}>TEARS</div>
      <div className="text-2xl font-black">of the KINGDOM</div>
      <div className="mt-4 border-2 p-3 bg-white/40" style={{ borderColor: g.colors.ac1, color: g.colors.fg }}>
        <div className="text-sm font-mono">SKY · DEPTHS · SURFACE</div>
        <div className="mt-2 h-2 bg-black/20"><div className="h-full" style={{ width: '70%', background: g.colors.ac1 }} /></div>
        <div className="text-[10px] mt-1">HEARTS × 14</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['▲ ULTRAHAND','✦ ASCEND'].map(s => (
          <div key={s} className="border-2 p-2 text-center text-xs font-mono" style={{ borderColor: g.colors.ac2, background: 'rgba(255,255,255,.3)' }}>{s}</div>
        ))}
      </div>
    </Frame>
  );
}

function GenshinMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="VER 5.0">
      <div className="font-display text-5xl md:text-7xl font-black leading-[0.85]" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, textShadow: '0 4px 0 #000' }}>GENSHIN</div>
      <div className="text-2xl font-black">IMPACT</div>
      <div className="mt-4 border-2 p-3 backdrop-blur-sm" style={{ borderColor: g.colors.ac1, background: 'rgba(255,255,255,.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl" style={{ background: g.colors.ac1, color: g.colors.fg }}>★</div>
          <div>
            <div className="font-black">Traveler</div>
            <div className="text-xs opacity-80">ADVENTURE RANK 60</div>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-mono">
          <span>原石: 12,480</span>
          <span>创世结晶: 0</span>
        </div>
      </div>
    </Frame>
  );
}

function HSRMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="v2.0">
      <div className="font-display text-5xl md:text-7xl font-black leading-[0.85]" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, textShadow: '0 0 20px #b967ff' }}>HONKAI</div>
      <div className="text-2xl font-black" style={{ color: g.colors.ac2 }}>STAR RAIL</div>
      <div className="mt-4 border-2 p-3" style={{ borderColor: g.colors.ac1, background: 'rgba(0,0,0,.3)' }}>
        <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-mono">
          {['DESTINY','PRESERVATION','THE_HUNT','ERUDITION','HARMONY','NIHILITY','ABUNDANCE'].map(p => (
            <div key={p} className="border p-1" style={{ borderColor: g.colors.ac2, background: p==='DESTINY' ? g.colors.ac2 : 'transparent' }}>{p}</div>
          ))}
        </div>
        <div className="mt-2 text-xs">TRAILBLAZE POWER 240</div>
      </div>
    </Frame>
  );
}

function FFMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="FF XVI">
      <div className="font-display text-6xl md:text-8xl font-black leading-[0.85] tracking-tight" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, textShadow: '0 0 20px #f0c860' }}>FINAL FANTASY</div>
      <div className="mt-3 font-mono text-sm opacity-80">An Epic Tale of Mothercrystals</div>
      <div className="mt-4 border-2 p-3" style={{ borderColor: g.colors.ac1 }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black" style={{ background: g.colors.ac1, color: g.colors.bg }}>C</div>
          <div>
            <div className="font-black">CLIVE</div>
            <div className="text-xs opacity-80">HP 8420 / 8420</div>
          </div>
        </div>
        <div className="mt-2 h-2 bg-black/30"><div className="h-full" style={{ width: '78%', background: g.colors.ac2 }} /></div>
      </div>
    </Frame>
  );
}

function DiscoMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="DETECTIVE">
      <div className="font-display text-4xl md:text-6xl font-black italic leading-[0.85]" style={{ fontFamily: g.fonts.d, color: g.colors.ac1 }}>DISCO<br/>ELYSIUM</div>
      <div className="mt-3 border-2 p-3" style={{ borderColor: g.colors.ac1, background: 'rgba(0,0,0,.3)' }}>
        <div className="text-xs font-mono opacity-70">SKILLS</div>
        <div className="mt-1 space-y-1 text-xs">
          {['LOGIC 12','EMPATHY 14','AUTHORITY 8','ELECTROCHEMISTRY 11'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <span className="w-32 font-mono">{s.split(' ')[0]}</span>
              <div className="flex-1 h-1 bg-black/40"><div className="h-full" style={{ width: `${parseInt(s.split(' ')[1])*6}%`, background: g.colors.ac2 }} /></div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function DeathMockup({ g }: { g: GameScheme }) {
  return (
    <Frame g={g} badge="KOJIMA PRODUCTIONS">
      <div className="font-display text-5xl md:text-7xl font-black leading-[0.85] tracking-tight" style={{ fontFamily: g.fonts.d, color: g.colors.ac1, textShadow: '4px 0 #f0ff00' }}>DEATH</div>
      <div className="text-2xl font-black">STRANDING</div>
      <div className="mt-4 border-2 p-3 font-mono text-xs" style={{ borderColor: g.colors.ac1 }}>
        <div className="opacity-60">CARGO STATUS</div>
        <div className="mt-1 space-y-1">
          {['WEIGHT 84.2kg','LIKES 12480','PORT KNOT CITY'].map(s => (
            <div key={s}>{s}</div>
          ))}
        </div>
        <div className="mt-3 h-1" style={{ background: g.colors.ac1 }} />
        <div className="text-[10px] opacity-60 mt-1">CONNECTION ESTABLISHED</div>
      </div>
    </Frame>
  );
}

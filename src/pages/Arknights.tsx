import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 明日方舟典型 UI 调色板
const AK = {
  bg: '#0E1116',
  surface: '#181D24',
  surface2: '#1F242C',
  border: '#2A3340',
  border2: '#3A4452',
  accent: '#F5A623',
  accentBright: '#FFB841',
  blue: '#5BA3F5',
  blueDark: '#2C5282',
  text: '#E8E8E8',
  textDim: '#8A95A5',
  success: '#5DD39E',
  danger: '#E15A4D',
  gold: '#FFD700',
  purple: '#B084EB',
};

type Class = 'Guard' | 'Medic' | 'Sniper' | 'Caster' | 'Defender' | 'Supporter' | 'Specialist' | 'Vanguard';
type Rarity = 3 | 4 | 5 | 6;

interface Operator {
  id: string;
  name: string;
  class: Class;
  rarity: Rarity;
  title: string;
  faction: string;
  hp: number;
  atk: number;
  def: number;
  res: number;
  redeploy: number;
  cost: number;
  block: number;
  range: '近战' | '中距' | '远距';
  tags: string[];
  quote: string;
  color: string;
}

const OPERATORS: Operator[] = [
  { id: 'amiya', name: '阿米娅', title: 'Ch\'en / 守望者', class: 'Caster', rarity: 5, faction: '罗德岛',
    hp: 1653, atk: 723, def: 126, res: 15, redeploy: 70, cost: 18, block: 1, range: '远距',
    tags: ['输出', '法术', 'DPS'], quote: '"为了这片大地，我会战斗到最后一刻。"', color: AK.blue },
  { id: 'chen', name: '陈', title: 'Stormwatch / 近卫', class: 'Guard', rarity: 6, faction: '龙门近卫局',
    hp: 2415, atk: 882, def: 387, res: 10, redeploy: 70, cost: 25, block: 2, range: '近战',
    tags: ['群攻', '爆发', '连击'], quote: '"你的剑，我来接。"', color: AK.danger },
  { id: 'silver', name: '银灰', title: 'Karlan Trade / 领主', class: 'Guard', rarity: 6, faction: '喀兰贸易',
    hp: 2105, atk: 763, def: 412, res: 15, redeploy: 70, cost: 23, block: 2, range: '近战',
    tags: ['支援', '控场', '召唤'], quote: '"无需多言，喀兰的旗帜在风中飘扬。"', color: AK.purple },
  { id: 'exu', name: '能天使', title: 'Laterano / 速射', class: 'Sniper', rarity: 6, faction: '企鹅物流',
    hp: 1845, atk: 654, def: 154, res: 0, redeploy: 70, cost: 21, block: 1, range: '远距',
    tags: ['速射', '输出', '空'], quote: '"Gift… 配送中~"', color: AK.accent },
  { id: 'skadi', name: '斯卡蒂', title: 'Abyssal / 处决者', class: 'Guard', rarity: 6, faction: '深海猎人',
    hp: 2845, atk: 945, def: 502, res: 20, redeploy: 70, cost: 28, block: 3, range: '近战',
    tags: ['单体', '高DPS', '生存'], quote: '"海潮之下，无人得见。"', color: AK.purple },
  { id: 'shining', name: '闪灵', title: 'Rhodes / 医疗', class: 'Medic', rarity: 6, faction: '罗德岛',
    hp: 1655, atk: 480, def: 145, res: 15, redeploy: 70, cost: 19, block: 1, range: '远距',
    tags: ['治疗', '光环', '防御'], quote: '"愿光芒庇护你。"', color: AK.gold },
];

const MISSIONS = [
  { code: '1-7', name: '黑暗时代·下', diff: 4, cost: 18, drop: ['固源岩', '源岩'],  open: true },
  { code: '4-8', name: '风暴瞭望', diff: 5, cost: 21, drop: ['糖', '聚酸酯'], open: true },
  { code: '6-16', name: '冰原之歌', diff: 6, cost: 25, drop: ['聚合剂', '晶体元件'], open: true },
  { code: 'S5-3', name: '黄铁峡谷·II', diff: 7, cost: 30, drop: ['高级凭证'], open: true },
  { code: 'H6-4', name: '切尔诺柏格', diff: 8, cost: 36, drop: ['芯片助剂'], open: false },
  { code: 'M-8', name: '龙门·外环', diff: 9, cost: 40, drop: ['寻访凭证'], open: false },
];

const FACTION_LOGOS = ['★', '◆', '◇', '▲', '●', '■'];

function Star({ rarity }: { rarity: Rarity }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rarity }).map((_, i) => (
        <span key={i} className="text-xs leading-none" style={{ color: AK.gold }}>★</span>
      ))}
    </div>
  );
}

function StatBar({ label, val, max, color = AK.accent, unit = '' }: { label: string; val: number; max: number; color?: string; unit?: string }) {
  const pct = Math.min(100, (val / max) * 100);
  return (
    <div className="flex items-center gap-2 text-[11px] font-mono">
      <span className="w-8 text-bone/40">{label}</span>
      <div className="flex-1 h-2 bg-black/50 border" style={{ borderColor: AK.border2 }}>
        <div className="h-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <span className="w-12 text-right tabular-nums" style={{ color }}>{val}{unit}</span>
    </div>
  );
}

function ClassIcon({ className }: { className: string }) {
  const icon: Record<string, string> = {
    Guard: '⚔', Medic: '✚', Sniper: '⊕', Caster: '✦',
    Defender: '⛨', Supporter: '✺', Specialist: '✧', Vanguard: '➤',
  };
  return <span className="text-base">{icon[className] || '○'}</span>;
}

export default function Arknights() {
  const [active, setActive] = useState(OPERATORS[0]);
  const [tab, setTab] = useState<'home' | 'agent' | 'mission' | 'shop' | 'recruit'>('agent');
  const [bootProgress, setBootProgress] = useState(0);
  const [booting, setBooting] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (bootProgress < 100) {
      const t = setTimeout(() => setBootProgress(p => Math.min(100, p + 4 + Math.random() * 8)), 50);
      return () => clearTimeout(t);
    } else if (booting) {
      const t = setTimeout(() => setBooting(false), 200);
      return () => clearTimeout(t);
    }
  }, [bootProgress, booting]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: AK.bg, color: AK.text, fontFamily: '"Rajdhani", "Inter Tight", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');
        .ak-font { font-family: 'Rajdhani', 'Noto Sans SC', system-ui, sans-serif; }
        .ak-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes ak-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes ak-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .ak-clip-corners { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
        .ak-clip-tag { clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%); }
        .ak-scanline::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent, ${AK.accent}22, transparent);
          animation: ak-scan 6s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {booting ? (
        <BootScreen progress={bootProgress} />
      ) : (
        <>
          {/* TOP BAR */}
          <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(14,17,22,0.95)', borderColor: AK.border, backdropFilter: 'blur(8px)' }}>
            <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center font-black text-lg" style={{ background: AK.accent, color: AK.bg }}>RH</div>
                  <div className="ak-font leading-none">
                    <div className="text-sm font-bold tracking-wider">RHODES ISLAND</div>
                    <div className="text-[9px] tracking-[0.2em]" style={{ color: AK.textDim }}>OPERATOR TERMINAL · V8.4.1</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 ak-mono text-[10px]" style={{ color: AK.textDim }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: AK.success }} />
                  SYSTEM ONLINE · CONN STABLE
                </div>
              </div>
              <div className="flex items-center gap-3 ak-mono text-[11px]">
                <div className="hidden md:flex items-center gap-3 px-3 py-1 border" style={{ borderColor: AK.border }}>
                  <span style={{ color: AK.accent }}>◆</span>
                  <span>HQ LV. 187</span>
                </div>
                <div className="px-3 py-1 border flex items-center gap-2" style={{ borderColor: AK.border }}>
                  <span style={{ color: AK.accent }}>⌬</span>
                  <span className="font-bold tabular-nums">12,486</span>
                </div>
                <div className="px-3 py-1 border flex items-center gap-2" style={{ borderColor: AK.border }}>
                  <span style={{ color: AK.gold }}>●</span>
                  <span className="font-bold tabular-nums">999</span>
                </div>
                <div className="px-3 py-1 border" style={{ borderColor: AK.border, color: AK.textDim }}>
                  {now.toLocaleTimeString('en-GB', { hour12: false })}
                </div>
                <Link to="/" className="px-3 py-1 border-2 ak-font font-bold" style={{ borderColor: AK.accent, color: AK.accent }}>
                  ← EXIT
                </Link>
              </div>
            </div>
          </header>

          {/* TAB BAR */}
          <nav className="border-b" style={{ borderColor: AK.border, background: AK.surface }}>
            <div className="max-w-[1600px] mx-auto px-6 flex">
              {([
                { id: 'home', label: 'HQ', en: 'HEADQUARTERS' },
                { id: 'agent', label: '干员', en: 'OPERATORS' },
                { id: 'mission', label: '作战', en: 'OPERATIONS' },
                { id: 'recruit', label: '公开招募', en: 'RECRUITMENT' },
                { id: 'shop', label: '采购中心', en: 'STORE' },
              ] as const).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-5 py-3 ak-font text-sm font-bold tracking-wider transition-colors ${tab === t.id ? '' : 'hover:text-white'}`}
                  style={{ color: tab === t.id ? AK.accent : AK.textDim }}
                >
                  {t.label}
                  <span className="block text-[9px] tracking-[0.2em] mt-0.5" style={{ color: tab === t.id ? AK.accentBright : AK.textDim, opacity: 0.6 }}>{t.en}</span>
                  {tab === t.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: AK.accent, boxShadow: `0 0 8px ${AK.accent}` }} />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <main className="max-w-[1600px] mx-auto px-6 py-6">
            {tab === 'agent' && <AgentPanel active={active} setActive={setActive} />}
            {tab === 'mission' && <MissionPanel />}
            {tab === 'home' && <HomePanel />}
            {tab === 'recruit' && <RecruitPanel />}
            {tab === 'shop' && <ShopPanel />}
          </main>

          {/* BOTTOM */}
          <footer className="border-t mt-12" style={{ borderColor: AK.border, background: AK.surface }}>
            <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between ak-mono text-[10px]" style={{ color: AK.textDim }}>
              <div className="flex items-center gap-3">
                <span>RODO INDUSTRIES · RHODES ISLAND A.R.</span>
                <span style={{ color: AK.accent }}>// 明日方舟风格 · 演示界面</span>
              </div>
              <div className="flex items-center gap-4">
                <span>FPS 60</span>
                <span>MEM 1.2GB</span>
                <span>NET 24ms</span>
                <span>UID 1008624</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

/* BOOT SCREEN */
function BootScreen({ progress }: { progress: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: AK.bg }}>
      <div className="ak-font text-center">
        <div className="text-xs tracking-[0.3em]" style={{ color: AK.textDim }}>RHODES ISLAND OPERATOR TERMINAL</div>
        <div className="text-4xl font-black tracking-widest mt-2" style={{ color: AK.accent }}>INITIALIZING</div>
        <div className="ak-mono text-[10px] mt-2" style={{ color: AK.textDim }}>V8.4.1 · BUILD 20260408</div>
        <div className="mt-12 w-80 h-1.5 border" style={{ borderColor: AK.border2, background: AK.surface }}>
          <div className="h-full" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${AK.accent}, ${AK.accentBright})`, boxShadow: `0 0 12px ${AK.accent}` }} />
        </div>
        <div className="ak-mono text-[10px] mt-3" style={{ color: AK.accent }}>{progress.toFixed(0)}% · LOADING CORE SYSTEMS</div>
        <div className="ak-mono text-[10px] mt-12 max-w-md text-left space-y-1" style={{ color: AK.textDim }}>
          {['[OK] NEURAL NETWORK', '[OK] COMBAT SIMULATOR', '[OK] OPERATOR DATABASE', `[${progress > 60 ? 'OK' : '..'}] PRTS LINK`, `[${progress > 85 ? 'OK' : '..'}] CACHE WARMUP`].map((l, i) => (
            <div key={i} className={progress > (i + 1) * 18 ? '' : 'opacity-40'}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* OPERATOR PANEL */
function AgentPanel({ active, setActive }: { active: Operator; setActive: (o: Operator) => void }) {
  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-4">
      {/* LEFT: Operator List */}
      <aside className="border" style={{ borderColor: AK.border, background: AK.surface }}>
        <div className="px-4 py-3 border-b ak-mono text-[10px] flex items-center justify-between" style={{ borderColor: AK.border, color: AK.textDim }}>
          <span>// OPERATOR ROSTER</span>
          <span style={{ color: AK.accent }}>{OPERATORS.length} / 247</span>
        </div>
        <div className="p-2 space-y-1.5 max-h-[700px] overflow-y-auto">
          {OPERATORS.map(o => (
            <button
              key={o.id}
              onClick={() => setActive(o)}
              className={`w-full text-left p-2 border transition-all flex items-center gap-3 ${active.id === o.id ? '' : 'hover:border-current'}`}
              style={{
                borderColor: active.id === o.id ? AK.accent : AK.border,
                background: active.id === o.id ? `${AK.accent}11` : 'transparent',
                color: active.id === o.id ? AK.accent : AK.text,
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center ak-font font-black text-lg" style={{ background: o.color, color: AK.bg }}>
                {o.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="ak-font font-bold text-sm truncate">{o.name}</span>
                  <Star rarity={o.rarity} />
                </div>
                <div className="flex items-center gap-2 ak-mono text-[10px]" style={{ color: AK.textDim }}>
                  <ClassIcon className={o.class} />
                  <span>{o.class}</span>
                  <span>·</span>
                  <span>{o.faction}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT: Detail */}
      <section>
        <div className="border relative ak-scanline overflow-hidden" style={{ borderColor: AK.border, background: `linear-gradient(135deg, ${active.color}22, ${AK.surface} 70%)` }}>
          <div className="grid md:grid-cols-[260px_1fr] gap-6 p-6 relative">
            <div>
              <div className="aspect-[3/4] border-2 flex items-center justify-center ak-font font-black text-9xl relative overflow-hidden" style={{ borderColor: active.color, background: `linear-gradient(180deg, ${active.color}33, ${AK.surface})`, color: active.color }}>
                {active.name[0]}
                <div className="absolute top-2 left-2 ak-mono text-[10px]" style={{ color: active.color }}>OPR · {active.id.toUpperCase()}</div>
                <div className="absolute bottom-2 right-2 ak-mono text-[10px]" style={{ color: active.color }}>TIER {active.rarity}</div>
              </div>
              <div className="mt-3 flex justify-between ak-mono text-[10px]" style={{ color: AK.textDim }}>
                <span>E0 · Lv 1</span>
                <span>MAX</span>
                <span>E2 · Lv 90</span>
              </div>
              <div className="mt-1 h-1 bg-black/50 border" style={{ borderColor: AK.border2 }}>
                <div className="h-full" style={{ width: '45%', background: active.color, boxShadow: `0 0 6px ${active.color}` }} />
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="ak-mono text-[10px] tracking-wider" style={{ color: active.color }}>// {active.faction.toUpperCase()}</div>
                  <h2 className="ak-font font-black text-5xl tracking-wide leading-none mt-1" style={{ color: AK.text }}>{active.name}</h2>
                  <div className="ak-font text-sm tracking-wider mt-1" style={{ color: AK.textDim }}>{active.title}</div>
                </div>
                <Star rarity={active.rarity} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="ak-clip-tag px-3 py-1 ak-mono text-[10px] font-bold" style={{ background: AK.accent, color: AK.bg }}>
                  {active.class.toUpperCase()}
                </span>
                {active.tags.map(t => (
                  <span key={t} className="ak-clip-tag px-2 py-0.5 ak-mono text-[10px] border" style={{ borderColor: AK.border2, color: AK.textDim }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5">
                <StatBar label="HP" val={active.hp} max={3000} color={AK.success} />
                <StatBar label="ATK" val={active.atk} max={1000} color={AK.danger} />
                <StatBar label="DEF" val={active.def} max={600} color={AK.blue} />
                <StatBar label="RES" val={active.res} max={50} color={AK.purple} unit="" />
                <StatBar label="COST" val={active.cost} max={40} color={AK.accent} />
                <StatBar label="BLOCK" val={active.block} max={3} color={AK.gold} />
              </div>

              <div className="mt-6 border p-3 relative" style={{ borderColor: AK.border, background: 'rgba(0,0,0,0.3)' }}>
                <div className="ak-mono text-[9px] mb-1" style={{ color: AK.accent }}>// ARCHIVE VOICE</div>
                <div className="ak-font italic text-base" style={{ color: AK.text }}>{active.quote}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 ak-clip-corners px-4 py-2.5 ak-font font-bold text-sm tracking-wider" style={{ background: AK.accent, color: AK.bg }}>
                  编入队伍 ▸
                </button>
                <button className="ak-clip-corners px-4 py-2.5 ak-font font-bold text-sm tracking-wider border-2" style={{ borderColor: AK.accent, color: AK.accent }}>
                  ♡ 关注
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: ARCHIVE / BATTLE / SKILLS */}
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            { t: '基础档案', en: 'ARCHIVE', lines: ['种族：不明', '出身：罗德岛', '生日：6月2日', '身高：162cm'] },
            { t: '战斗属性', en: 'BATTLE', lines: ['物理强度：标准', '战场机动：标准', '生理耐受：标准', '战术规划：优良'] },
            { t: '履历', en: 'HISTORY', lines: ['感染者', '原职业：学生', '加入时间：1096.4.18', '授权范围：S'] },
          ].map(card => (
            <div key={card.t} className="border" style={{ borderColor: AK.border, background: AK.surface }}>
              <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: AK.border }}>
                <span className="ak-font font-bold text-sm" style={{ color: AK.accent }}>{card.t}</span>
                <span className="ak-mono text-[10px]" style={{ color: AK.textDim }}>// {card.en}</span>
              </div>
              <div className="p-3 space-y-1.5 ak-mono text-xs">
                {card.lines.map(l => (
                  <div key={l} className="flex items-center gap-2">
                    <span style={{ color: AK.accent }}>›</span>
                    <span style={{ color: AK.text }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* MISSION PANEL */
function MissionPanel() {
  return (
    <div>
      <div className="ak-mono text-[10px] mb-3 flex items-center gap-2" style={{ color: AK.textDim }}>
        <span style={{ color: AK.accent }}>//</span> AVAILABLE OPERATIONS · {MISSIONS.filter(m => m.open).length} OPEN
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MISSIONS.map(m => (
          <div
            key={m.code}
            className={`border p-4 relative ${m.open ? 'cursor-pointer hover:border-current' : 'opacity-50'}`}
            style={{ borderColor: AK.border, background: AK.surface }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="ak-mono text-[10px] tracking-widest" style={{ color: AK.accent }}>{m.code}</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: m.diff }).map((_, i) => (
                  <span key={i} className="text-xs" style={{ color: AK.danger }}>●</span>
                ))}
              </div>
            </div>
            <h3 className="ak-font font-bold text-xl" style={{ color: AK.text }}>{m.name}</h3>
            <div className="ak-mono text-[10px] mt-2" style={{ color: AK.textDim }}>理智消耗</div>
            <div className="ak-font text-2xl font-black tabular-nums" style={{ color: AK.accent }}>{m.cost}</div>
            <div className="ak-mono text-[10px] mt-3 mb-1" style={{ color: AK.textDim }}>PRIMARY DROPS</div>
            <div className="flex flex-wrap gap-1">
              {m.drop.map(d => (
                <span key={d} className="ak-clip-tag px-2 py-0.5 ak-mono text-[10px] border" style={{ borderColor: AK.border2, color: AK.text }}>
                  {d}
                </span>
              ))}
            </div>
            {m.open ? (
              <button className="w-full mt-3 ak-clip-corners py-2 ak-font font-bold text-sm tracking-widest" style={{ background: AK.accent, color: AK.bg }}>
                行动开始 ▸
              </button>
            ) : (
              <div className="ak-mono text-[10px] mt-3 text-center py-2 border" style={{ borderColor: AK.border, color: AK.textDim }}>
                🔒 未解锁
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* HOME / HQ */
function HomePanel() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 border p-6 relative overflow-hidden" style={{ borderColor: AK.border, background: `linear-gradient(135deg, ${AK.accent}11, ${AK.surface})` }}>
        <div className="ak-mono text-[10px] mb-2" style={{ color: AK.accent }}>// DAILY ANNOUNCEMENT</div>
        <h2 className="ak-font font-black text-3xl tracking-wide" style={{ color: AK.text }}>WELCOME BACK, DOCTOR.</h2>
        <p className="ak-mono text-xs mt-3 leading-relaxed" style={{ color: AK.textDim }}>
          {'>'} 今日作战建议：高难副本「冰原之歌」掉落糖与聚酸酯。
          {'\n'}{'>'} 公开招募刷新倒计时：04:32:18
          {'\n'}{'>'} 新干员池：限定寻访 ·「风暴瞭望」
        </p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { l: '任务', v: '12/20' },
            { l: '周常', v: '4/7' },
            { l: '签到', v: 'D 26' },
            { l: '体力', v: '240' },
          ].map(s => (
            <div key={s.l} className="border p-3" style={{ borderColor: AK.border, background: 'rgba(0,0,0,0.3)' }}>
              <div className="ak-mono text-[10px]" style={{ color: AK.textDim }}>{s.l}</div>
              <div className="ak-font font-black text-2xl tabular-nums mt-1" style={{ color: AK.accent }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border p-4" style={{ borderColor: AK.border, background: AK.surface }}>
        <div className="ak-mono text-[10px] mb-3" style={{ color: AK.accent }}>// FACTION INDEX</div>
        <div className="space-y-2">
          {FACTION_LOGOS.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2 border" style={{ borderColor: AK.border }}>
              <div className="w-8 h-8 flex items-center justify-center ak-font font-black" style={{ background: AK.accent, color: AK.bg }}>{f}</div>
              <div className="flex-1">
                <div className="ak-font text-sm font-bold">派系 {i + 1}</div>
                <div className="ak-mono text-[10px]" style={{ color: AK.textDim }}>{12 + i} OPERATORS</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* RECRUIT */
function RecruitPanel() {
  const [tags, setTags] = useState<string[]>(['输出', '群攻']);
  const all = ['输出', '群攻', '单体', '治疗', '控场', '支援', '生存', '减速', '法术', '物理'];
  const toggle = (t: string) => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  return (
    <div className="max-w-3xl">
      <div className="ak-mono text-[10px] mb-3" style={{ color: AK.textDim }}>
        <span style={{ color: AK.accent }}>//</span> SELECT TAGS TO RECRUIT
      </div>
      <div className="border p-6" style={{ borderColor: AK.border, background: AK.surface }}>
        <div className="ak-font text-sm mb-3" style={{ color: AK.textDim }}>TAG POOL</div>
        <div className="flex flex-wrap gap-2">
          {all.map(t => (
            <button
              key={t}
              onClick={() => toggle(t)}
              className="ak-clip-tag px-3 py-1.5 ak-mono text-xs font-bold"
              style={{
                background: tags.includes(t) ? AK.accent : 'transparent',
                color: tags.includes(t) ? AK.bg : AK.text,
                border: `1px solid ${tags.includes(t) ? AK.accent : AK.border2}`,
              }}
            >{tags.includes(t) ? '✓ ' : ''}{t}</button>
          ))}
        </div>
        <div className="mt-6 border p-4" style={{ borderColor: AK.accent, background: 'rgba(245,166,35,0.05)' }}>
          <div className="ak-mono text-[10px]" style={{ color: AK.accent }}>// PREDICTED RARITY</div>
          <div className="ak-font font-black text-3xl mt-1" style={{ color: AK.gold }}>★★★★★ &nbsp;UP</div>
          <div className="ak-mono text-xs mt-2" style={{ color: AK.textDim }}>基于当前标签组合：{tags.join(' + ') || '无'}</div>
        </div>
        <button
          disabled={tags.length === 0}
          className="mt-6 w-full ak-clip-corners py-3 ak-font font-bold text-base tracking-widest disabled:opacity-30"
          style={{ background: AK.accent, color: AK.bg }}
        >开始招聘 · {Math.max(1, 9 - tags.length * 2)}H ⟲</button>
      </div>
    </div>
  );
}

/* SHOP */
function ShopPanel() {
  const items = [
    { n: '高级凭证', c: 88, d: '用于限定寻访' },
    { n: '芯片助剂', c: 30, d: '突破干员潜能上限' },
    { n: '家具零件', c: 5, d: '基地建设用' },
    { n: '招聘许可', c: 1, d: '每日免费送' },
  ];
  return (
    <div>
      <div className="ak-mono text-[10px] mb-3" style={{ color: AK.textDim }}><span style={{ color: AK.accent }}>//</span> STORE · WEEKLY ROTATION</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(it => (
          <div key={it.n} className="border p-4" style={{ borderColor: AK.border, background: AK.surface }}>
            <div className="aspect-square border mb-3 flex items-center justify-center ak-font text-5xl font-black" style={{ borderColor: AK.accent, color: AK.accent, background: `${AK.accent}11` }}>◆</div>
            <div className="ak-font font-bold">{it.n}</div>
            <div className="ak-mono text-[10px] mt-1" style={{ color: AK.textDim }}>{it.d}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="ak-font font-black text-2xl" style={{ color: AK.gold }}>×{it.c}</span>
              <button className="ak-clip-corners px-3 py-1.5 ak-font text-xs font-bold" style={{ background: AK.accent, color: AK.bg }}>兑换</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon, BookOpen, Check, X, Sparkles, Hammer, Compass, ScrollText,
  FileCode, GitBranch, GitMerge, GitPullRequest, Package, Rocket, ShieldCheck,
  ArrowRight, Layers, Hash, Component, Pencil, Eye, FlaskConical, Beaker,
  Tag as TagIcon, ClipboardCheck, ListChecks, Box, Wrench, CircleDot,
} from 'lucide-react';
import { Tag, TAG_META, TAG_KEYS, type TagCategory } from '../components/Tag';

/* ====================================================================
   CODEX STUDIO · 守则制作方案 / PRODUCTION SCHEME
   ─────────────────────────────────────────────────────────────
   9 步制作管线 × 9 宫守则模板 × 9 道质量门 × 9 守则范式 × 3×3 看板
   = 一座工坊如何从「灵感」→「入库」的标准工艺
   ==================================================================== */

type StageStatus = 'todo' | 'wip' | 'done';

/* ---------- 9 步制作管线 ---------- */
const STAGES: {
  n: string; t: string; en: string; role: string; input: string; output: string; gate: string;
  tag: TagCategory; icon: React.ReactNode;
}[] = [
  { n: '01', t: 'SPEC',     en: 'SPECIFY',    role: '规约',  input: '问题 / 用户 / 场景',  output: '一句话命题 + 9 标签候选', gate: '问题可被一句话陈述',        tag: 'visual',  icon: <FlaskConical size={12} /> },
  { n: '02', t: 'TAG',      en: 'CLASSIFY',   role: '标类',  input: '9 类目',                output: '主标签 + 2 副标签',         gate: '主标签属于 9 类目之一',     tag: 'type',    icon: <TagIcon size={12} /> },
  { n: '03', t: 'DRAFT',    en: 'DRAFT',      role: '起草',  input: '9 宫母格',              output: '可运行 demo 源码',          gate: '在 3×3 母格内能成立',       tag: 'layout',  icon: <Pencil size={12} /> },
  { n: '04', t: 'PEER',     en: 'PEER REVIEW',role: '互校',  input: 'demo + 说明',            output: '3 条修改意见',              gate: '≥ 1 位同伴签字',            tag: 'interact',icon: <Eye size={12} /> },
  { n: '05', t: 'SCORE',    en: 'RUBRIC',     role: '评分',  input: '9 维度',                 output: '1-5 分 × 9',                 gate: '总均分 ≥ 4.0',               tag: 'perf',    icon: <ListChecks size={12} /> },
  { n: '06', t: 'A11Y',     en: 'ACCESSIBLE', role: '无障',  input: '键盘 + 屏幕阅读',        output: 'tab 顺序 / aria 表',         gate: '对比度 ≥ 4.5 + 键盘可达',   tag: 'a11y',    icon: <ShieldCheck size={12} /> },
  { n: '07', t: 'PERF',     en: 'PERFORM',    role: '性能',  input: 'gzip / fps / raf',       output: '≤ 20KB / 60fps',             gate: '动画仅用 transform/opacity',tag: 'perf',    icon: <Beaker size={12} /> },
  { n: '08', t: 'LIB',      en: 'LIBRARY',    role: '入库',  input: '完整源码 + props',       output: '@forge/codex 卡片',         gate: '可独立运行无 TODO',         tag: 'compat',  icon: <Package size={12} /> },
  { n: '09', t: 'SHIP',     en: 'PUBLISH',    role: '发布',  input: 'PR + 100 字说明',         output: '合入主分支 + 索引页',        gate: '通过 9 道门',                tag: 'motion',  icon: <Rocket size={12} /> },
];

/* ---------- 9 宫守则模板 (每条守则的 9 个必备字段) ---------- */
const TEMPLATE: {
  cell: string; field: string; type: string; required: boolean; example: string;
  tag: TagCategory;
}[] = [
  { cell: '01', field: 'ID',         type: 'P01 - P99',     required: true,  example: 'P09',         tag: 'compat'  },
  { cell: '02', field: 'NAME',       type: 'string',         required: true,  example: 'OBSESS',       tag: 'type'    },
  { cell: '03', field: 'CN',         type: 'string',         required: true,  example: '字距强迫',     tag: 'type'    },
  { cell: '04', field: 'EN',         type: 'string',         required: true,  example: 'OVER DETAILS', tag: 'type'    },
  { cell: '05', field: 'TAG',        type: 'TagCategory',    required: true,  example: 'visual',       tag: 'color'   },
  { cell: '06', field: 'DESC',       type: 'string ≤ 80',    required: true,  example: '字距、阴影…',  tag: 'visual'  },
  { cell: '07', field: 'DO',         type: 'string[]',       required: true,  example: '["…", "…"]',   tag: 'interact'},
  { cell: '08', field: 'DONT',       type: 'string[]',       required: true,  example: '["…"]',        tag: 'motion'  },
  { cell: '09', field: 'PROPS',      type: 'PropsTable',     required: false, example: '{n, tag}',    tag: 'layout'  },
];

/* ---------- 9 道质量门 ---------- */
const GATES: { n: string; t: string; en: string; check: string; fail: string; tag: TagCategory }[] = [
  { n: '01', t: 'NARROW',  en: 'CAN STATE',   check: '用一句话说清问题',           fail: '若需要 2 句,需重写',     tag: 'visual'  },
  { n: '02', t: 'TAG',     en: 'IN 9',        check: '主标签属于 9 类目之一',       fail: '若不属于,新开类目',     tag: 'type'    },
  { n: '03', t: 'GRID',    en: '3x3 FIT',     check: '在 3x3 母格 + 1/2/3 跨格内',  fail: '若超出,拆为多条',       tag: 'layout'  },
  { n: '04', t: 'DEMO',    en: 'RUNS',        check: '源码可直接复制运行',         fail: '若有 TODO,需先删除',    tag: 'compat'  },
  { n: '05', t: 'PEER',    en: 'SIGNED',      check: '≥ 1 位同伴签字',             fail: '若 0 签字,需 1 轮重审', tag: 'interact'},
  { n: '06', t: 'SCORE',   en: '≥ 4.0',       check: '9 维度均分 ≥ 4.0',            fail: '若 < 4.0,需补做',        tag: 'perf'    },
  { n: '07', t: 'A11Y',    en: '4.5 / KBD',   check: '对比度 ≥ 4.5 + 键盘可达',    fail: '若未达,需修 a11y',      tag: 'a11y'    },
  { n: '08', t: 'PERF',    en: '≤ 20KB / 60', check: 'gzip ≤ 20KB / 60fps',         fail: '若未达,需拆 chunk',     tag: 'perf'    },
  { n: '09', t: 'SHIPS',   en: '9 GATES',     check: '通过前 8 道 + 100 字说明',    fail: '任一未过则不入库',      tag: 'motion'  },
];

/* ---------- 9 守则范式 (范例) ---------- */
const ARCHETYPES: { n: string; title: string; cn: string; en: string; tag: TagCategory; ascii: string }[] = [
  { n: 'A1', title: 'OBSESS',    cn: '字距强迫', en: 'OVER DETAILS', tag: 'visual',  ascii: '─ ─ ─ ─\n│ . │ . │ . │\n─ ─ ─ ─\n│ . │ . │ . │\n─ ─ ─ ─' },
  { n: 'A2', title: 'BOLD',      cn: '鲜明主张', en: 'BY DEFAULT',   tag: 'color',   ascii: '█████████\n█       █\n█  USE  █\n█ COLOR █\n█████████' },
  { n: 'A3', title: 'COPY-PASTE',cn: '可复制',   en: 'READY',        tag: 'compat',  ascii: '<Copy/>\n─ paste\n─ run\n─ ship' },
  { n: 'A4', title: 'OPEN',      cn: '开源可改', en: '& FORKABLE',   tag: 'interact',ascii: 'git fork\n   ↓\n   ★' },
  { n: 'A5', title: 'MOTION',    cn: '有目的动', en: 'WITH PURPOSE', tag: 'motion',  ascii: 't=0  ▶ \nt=200▶ ◯\nt=400▶ ◉' },
  { n: 'A6', title: 'TYPE',      cn: '字体声音', en: 'AS VOICE',     tag: 'type',    ascii: 'Aa Bb Cc\nSerif → role\nSans  → ui' },
  { n: 'A7', title: 'PERFORM',   cn: '性能底线', en: 'OR PERISH',    tag: 'perf',    ascii: '60fps\n  ↓\ntransform\nopacity' },
  { n: 'A8', title: 'INCLUDE',   cn: '包容万物', en: 'EVERYONE',     tag: 'a11y',    ascii: 'Tab ⇥\nEnter ↵\nEsc ⎋\nArrows ←→' },
  { n: 'A9', title: 'MODULAR',   cn: '九宫母格', en: '9 GRID',       tag: 'layout',  ascii: '┌─┬─┬─┐\n├─┼─┼─┤\n├─┼─┼─┤\n└─┴─┴─┘' },
];

/* ---------- 3×3 制作看板 (示例) ---------- */
const BOARD: { id: string; title: string; cn: string; tag: TagCategory; stage: number; owner: string; days: number }[] = [
  { id: 'B1',  title: 'GRID-FIT',      cn: '母格自适应',   tag: 'layout',  stage: 1, owner: '海拉',   days: 2 },
  { id: 'B2',  title: 'TYPE-CHOICE',   cn: '字体选择器',   tag: 'type',    stage: 2, owner: '阿米娅', days: 3 },
  { id: 'B3',  title: 'A11Y-AUDIT',    cn: '无障碍审计',   tag: 'a11y',    stage: 6, owner: '杜林',   days: 5 },
  { id: 'B4',  title: 'PERF-RAF',      cn: '动效 raf',     tag: 'perf',    stage: 7, owner: '能天使', days: 1 },
  { id: 'B5',  title: 'MOTION-CHOREO', cn: '入场编排',     tag: 'motion',  stage: 9, owner: '星熊',   days: 0 },
  { id: 'B6',  title: 'COLOR-CONTRAST',cn: '对比度检查',   tag: 'color',   stage: 5, owner: '银灰',   days: 4 },
  { id: 'B7',  title: 'INTERACT-KBD',  cn: '键盘交互',     tag: 'interact',stage: 3, owner: '塞壬',   days: 2 },
  { id: 'B8',  title: 'LIB-CARD',      cn: '入库卡',       tag: 'compat',  stage: 8, owner: '凯尔希', days: 1 },
  { id: 'B9',  title: 'VISUAL-IMPACT', cn: '视觉冲击',     tag: 'visual',  stage: 4, owner: 'W',      days: 6 },
];

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

export default function CodexStudio() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [activeGate, setActiveGate] = useState<number | null>(null);
  const [activeArch, setActiveArch] = useState<number | null>(null);

  const stagesDone = STAGES.length;     // 全 9 步
  const gatesPass = GATES.length;        // 全 9 道
  const archetypesReady = ARCHETYPES.length; // 9 范式

  return (
    <div>
      {/* ============== HERO · 守则制作方案 ============== */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Hexagon size={12} />
              <span>// CODEX STUDIO · 守则制作方案 / PRODUCTION SCHEME / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">CODEX</span>
              <span className="block relative">
                <span className="relative z-10">STUDIO.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-cyan -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              一条守则如何从<Link to="/codex" className="text-volt font-bold">「灵感」</Link>走到
              <span className="text-cyan font-bold">「入库」</span>?
              <span className="text-pink font-bold">9 步管线</span> ×
              <span className="text-pink font-bold">9 宫模板</span> ×
              <span className="text-pink font-bold">9 道门</span> ×
              <span className="text-pink font-bold">9 范式</span> ×
              <span className="text-pink font-bold">3×3 看板</span>——给每条守则一条可追溯的工艺。
            </p>

            {/* 9 类目色板条 */}
            <div className="mt-8 grid grid-cols-9 gap-1 max-w-2xl">
              {TAG_KEYS.map((k, i) => {
                const m = SAFE(k);
                return (
                  <div key={k} className="border-2 p-1.5" style={{ borderColor: m.hex, background: m.hex + '10' }}>
                    <div className="font-mono text-[8px] opacity-60">0{i + 1}</div>
                    <div className="font-display font-black text-xs leading-none mt-0.5" style={{ color: m.hex }}>{m.en}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9+9+9+9+3×3 / 守则生产工艺</div>
            <div className="space-y-1.5">
              {[
                { l: '9 步管线',     en: 'STAGES',      n: 9,  c: 'volt'  },
                { l: '9 宫模板',     en: 'TEMPLATE',    n: 9,  c: 'pink'  },
                { l: '9 道质量门',   en: 'GATES',       n: 9,  c: 'cyan'  },
                { l: '9 守则范式',   en: 'ARCHETYPES',  n: 9,  c: 'plum'  },
                { l: '3×3 看板',     en: 'BOARD',       n: 9,  c: 'volt'  },
              ].map(x => (
                <div key={x.en} className="flex items-center justify-between border-2 border-bone/20 p-2">
                  <div>
                    <div className="font-display font-black text-sm">{x.l}</div>
                    <div className="font-mono text-[9px] text-bone/50">{x.en}</div>
                  </div>
                  <div className="font-display font-black text-2xl text-volt">{x.n}</div>
                </div>
              ))}
            </div>
            <div className="font-mono text-[9px] text-bone/40 pt-1 border-t border-bone/20">
              // 共 9+9+9+9+9 = 45 项 / 守则制作方案
            </div>
          </aside>
        </div>
      </section>

      {/* ============== 9 步制作管线 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9-STAGE PIPELINE / 9 步制作管线</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                从 SPEC 到 SHIP · <span className="text-volt">9 步</span>
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">点格放大 / 步与步之间可跳过</div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
            {STAGES.map((s, i) => {
              const m = SAFE(s.tag);
              const active = activeStage === i;
              return (
                <button
                  key={s.n}
                  onClick={() => setActiveStage(active ? null : i)}
                  className={`group text-left border-2 p-2 transition-all hover:-translate-y-0.5 ${active ? 'border-volt shadow-lg' : 'border-bone/30 hover:border-bone'}`}
                  style={{ background: m.hex + (active ? '20' : '08') }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{s.n}</span>
                    <span className="text-bone/40 group-hover:text-volt">{s.icon}</span>
                  </div>
                  <div className="font-display font-black text-base leading-none" style={{ color: m.hex }}>{s.t}</div>
                  <div className="font-mono text-[9px] text-bone/50 mt-0.5">{s.en}</div>
                  <div className="text-bone/70 text-[10px] mt-1 leading-snug">{s.role}</div>
                  {active && (
                    <div className="mt-2 pt-2 border-t border-bone/20 space-y-1 font-mono text-[9px] text-bone/80">
                      <div><span className="text-bone/40">IN:  </span>{s.input}</div>
                      <div><span className="text-bone/40">OUT: </span>{s.output}</div>
                      <div><span className="text-volt">▸ GATE: </span>{s.gate}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {/* 流向箭头 */}
          <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-bone/40">
            {STAGES.map((s, i) => (
              <div key={s.n} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: SAFE(s.tag).hex }} />
                <span className="hidden md:inline">{s.t}</span>
                {i < STAGES.length - 1 && <ArrowRight size={9} className="text-bone/30 ml-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 9 宫守则模板 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9-CELL TEMPLATE / 9 宫守则模板</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                每条守则的 9 个 <span className="text-pink">必备字段</span>
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">// JSON Schema 等价</div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {TEMPLATE.map((t) => {
              const m = SAFE(t.tag);
              return (
                <div key={t.cell} className="border-2 border-bone/30 p-3 bg-ink relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{t.cell}</span>
                      <span className="font-display font-black text-base">{t.field}</span>
                    </div>
                    {t.required ? (
                      <span className="font-mono text-[8px] font-bold text-pink">REQ</span>
                    ) : (
                      <span className="font-mono text-[8px] text-bone/40">OPT</span>
                    )}
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="text-bone/50">type: <span className="text-bone/80">{t.type}</span></div>
                    <div className="text-bone/50">e.g. <code className="text-volt">{t.example}</code></div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* JSON 摘要 */}
          <pre className="mt-4 border-2 border-bone/30 bg-ink p-3 font-mono text-[10px] leading-relaxed text-bone/80 overflow-x-auto">
{`interface CodexEntry {
  id:    string;         // P01 - P99
  name:  string;         // OBSESS
  cn:    string;         // 字距强迫
  en:    string;         // OVER DETAILS
  tag:   TagCategory;    // 'visual' | 'motion' | 'type' | 'color' | 'layout' | 'interact' | 'perf' | 'a11y' | 'compat'
  desc:  string;         // ≤ 80 字
  do:    string[];       // 至少 1 条
  dont:  string[];       // 至少 1 条
  props?: Record<string, unknown>;
}`}
          </pre>
        </div>
      </section>

      {/* ============== 9 道质量门 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9 QUALITY GATES / 9 道质量门</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                一道 <span className="text-cyan">未过</span>,不入库
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">// 9×1 fail = 整条重审</div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {GATES.map((g, i) => {
              const m = SAFE(g.tag);
              const active = activeGate === i;
              const pass = i < 7; // 前 7 道算已过 (示范状态)
              return (
                <button
                  key={g.n}
                  onClick={() => setActiveGate(active ? null : i)}
                  className={`group text-left border-2 p-3 transition-all hover:-translate-y-0.5 ${active ? 'border-volt' : pass ? 'border-perf/60' : 'border-pink/60'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{g.n}</span>
                      <span className="font-display font-black text-sm">{g.t}</span>
                    </div>
                    {pass ? (
                      <Check size={12} className="text-perf" />
                    ) : (
                      <X size={12} className="text-pink" />
                    )}
                  </div>
                  <div className="font-mono text-[9px] text-bone/50">{g.en}</div>
                  <div className="text-bone/80 text-[11px] mt-1 leading-snug">{g.check}</div>
                  {active && (
                    <div className="mt-2 pt-2 border-t border-bone/20 font-mono text-[9px] text-pink">
                      ▸ FAIL → {g.fail}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== 9 守则范式 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9 ARCHETYPES / 9 守则范式</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                9 条既有 <span className="text-plum">范式</span> (覆盖 9 类目)
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">点格展开 / ASCII 是灵魂</div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {ARCHETYPES.map((a, i) => {
              const m = SAFE(a.tag);
              const active = activeArch === i;
              return (
                <button
                  key={a.n}
                  onClick={() => setActiveArch(active ? null : i)}
                  className={`group text-left border-2 p-3 transition-all hover:-translate-y-0.5 ${active ? 'border-volt' : 'border-bone/30 hover:border-bone'}`}
                  style={{ background: m.hex + '08' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{a.n}</span>
                      <span className="font-display font-black text-base leading-none">{a.title}</span>
                    </div>
                    <Tag cat={a.tag} size="xs" variant="dot" showId />
                  </div>
                  <div className="font-mono text-[10px] text-bone/60">{a.cn} · {a.en}</div>
                  <pre className={`mt-2 font-mono text-[10px] leading-[1.15] whitespace-pre ${active ? 'text-bone' : 'text-bone/50'} overflow-hidden`}>
{a.ascii}
                  </pre>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== 3×3 制作看板 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 3×3 PRODUCTION BOARD / 在制看板</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                当前 <span className="text-volt">9 条</span> 正在被锻造
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">// 看板拖动示意 — 真版将由 Sanity / Notion 同步</div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {BOARD.map(b => {
              const m = SAFE(b.tag);
              const stg = STAGES[b.stage - 1] ?? STAGES[0];
              const stgM = SAFE(stg.tag);
              return (
                <div key={b.id} className="border-2 border-bone/30 p-3 hover:border-volt transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{b.id}</span>
                      <span className="font-display font-black text-sm">{b.title}</span>
                    </div>
                    <Tag cat={b.tag} size="xs" variant="dot" showId />
                  </div>
                  <div className="text-bone/70 text-[11px] mb-2">{b.cn}</div>
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: stgM.hex }} />
                      <span className="text-bone/60">S{b.stage}</span>
                      <span className="text-bone/40">/ {stg.t}</span>
                    </div>
                    <div className="text-bone/40">@{b.owner} · D{b.days}</div>
                  </div>
                  {/* 9 步进度条 */}
                  <div className="mt-2 flex items-center gap-0.5">
                    {STAGES.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1"
                        style={{
                          background: i < b.stage ? stgM.hex : 'rgba(245,241,232,0.12)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-9 gap-0.5 font-mono text-[9px] text-bone/40 text-center">
            {STAGES.map(s => (
              <div key={s.n} className="truncate">{s.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 工艺图 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ PROCESS MAP / 工艺图</div>
          <div className="border-2 border-bone/30 p-4 bg-ink">
            <pre className="font-mono text-[10px] md:text-[11px] leading-[1.4] text-bone/80 overflow-x-auto">
{`┌──────────────────────────────────────────────────────────────────────────────┐
│  CODEX STUDIO · 守则制作方案                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─ 9 步管线 ─────────────────────┐   ┌─ 9 宫模板 ──────────────────────┐    │
│   │ 01 SPEC → 02 TAG → 03 DRAFT    │   │ ID  NAME  CN  EN  TAG  DESC …  │    │
│   │ → 04 PEER → 05 SCORE → 06 A11Y │   │ DO  DONT  PROPS  (共 9 字段)   │    │
│   │ → 07 PERF → 08 LIB → 09 SHIP   │   └─────────────────────────────────┘    │
│   └─────────────────────────────────┘                                         │
│              │                              │                                │
│              ▼                              ▼                                │
│   ┌─ 9 道质量门 ────────────────┐   ┌─ 9 守则范式 ──────────────────┐         │
│   │ NARROW·TAG·GRID·DEMO·PEER   │   │ OBSESS·BOLD·COPY·OPEN·MOTION │         │
│   │ ·SCORE·A11Y·PERF·SHIPS     │   │ ·TYPE·PERFORM·INCLUDE·MODULAR│         │
│   └─────────────────────────────┘   └────────────────────────────────┘         │
│              │                              │                                │
│              └──────────────┬───────────────┘                                │
│                             ▼                                                │
│              ┌── 3×3 制作看板 ─────────────────┐                            │
│              │ 9 条在制条目 · 阶段 + 负责人    │                            │
│              │ S1 → S2 → … → S9               │                            │
│              └────────────────────────────────┘                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 9 应当 · 守则制作</div>
            <ol className="font-mono text-xs space-y-1 text-bone/80">
              <li>01 · 一条守则只做一件事</li>
              <li>02 · 9 步管线不允许跳步</li>
              <li>03 · 9 宫模板字段不可缺</li>
              <li>04 · 9 道门任一未过则重审</li>
              <li>05 · 9 范式覆盖 9 类目</li>
              <li>06 · 3×3 看板是唯一的进度源</li>
              <li>07 · 1 范式 = 1 类目 1 主题</li>
              <li>08 · 9 步全部签字才可 SHIP</li>
              <li>09 · 看板上的进度是公开的</li>
            </ol>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想参与锻造一条守则?</h3>
            <p className="text-bone/70 text-sm mt-2">
              整页就是一份<Link to="/codex" className="text-volt font-bold">「工艺说明书」</Link>。
              任何字段修改都会反映在 9 步管线 / 9 宫模板 / 9 道门上。
              复制源码即可在你的工坊里跑同一套生产线。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/codex" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 81 组件 / CODEX BOARD
              </Link>
              <Link to="/standards" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                工坊守则
              </Link>
              <Link to="/manifesto" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                法典
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // CODEX STUDIO V.10 · 9 STAGES · 9 CELLS · 9 GATES · 9 ARCHETYPES · 3×3 BOARD
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

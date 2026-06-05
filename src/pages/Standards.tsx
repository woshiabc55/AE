import { Link } from 'react-router-dom';
import { Check, X, BookOpen, Hexagon, Hash, Layers, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Tag, TagLegend, TAG_KEYS, type TagCategory, TAG_META } from '../components/Tag';

/* ====================================================================
   模块化9 - 9 原则 / 9 DO / 9 DONT / 9 维度 / 9 模块 / 9 标签
   所有内容按 3x3 基础网格 + 1/2/3 跨格 编排
==================================================================== */

const PRINCIPLES: { n: string; t: string; en: string; d: string; tag: TagCategory }[] = [
  { n: '01', t: 'OBSESS',         en: 'OVER DETAILS',     d: '字距、阴影偏移、border-radius 都不是 0.5 的倍数，每一个数值都为设计服务。', tag: 'visual' },
  { n: '02', t: 'BOLD',           en: 'BY DEFAULT',       d: '要么极简到极致，要么热闹到极致。中间地带不属于 Skill Forge。',                 tag: 'color'   },
  { n: '03', t: 'COPY-PASTE',     en: 'READY',            d: '源码应当可以无修改地运行在用户的项目中，不留 TODO，不引入构建依赖。',           tag: 'compat'  },
  { n: '04', t: 'OPEN',           en: '& FORKABLE',       d: 'MIT 协议。拆解、改造、二次发布都是被鼓励的。',                                 tag: 'interact'},
  { n: '05', t: 'MOTION',         en: 'WITH PURPOSE',     d: '每个动效都讲述一个状态变化。1 个 200ms 缓动 > 30 个 hover 抖动。',              tag: 'motion'  },
  { n: '06', t: 'TYPE',           en: 'AS VOICE',         d: '字体是声音，不是装饰。允许 1-2 种 family，但每种必须有清晰的角色定位。',        tag: 'type'    },
  { n: '07', t: 'PERFORM',        en: 'OR PERISH',        d: '60fps 是底线。动画用 transform / opacity，回调用 requestAnimationFrame。',    tag: 'perf'    },
  { n: '08', t: 'INCLUDE',        en: 'EVERYONE',         d: '键盘可达、屏幕阅读可读、对比度 ≥ 4.5。可访问不是附加项。',                       tag: 'a11y'    },
  { n: '09', t: 'MODULAR',        en: '9 GRID',           d: '一切按 3x3 母格 + 1/2/3 跨格编排。九宫是工坊的呼吸法。',                         tag: 'layout'  },
];

const DO_RULES: { t: string; d: string; tag: TagCategory }[] = [
  { t: '纯前端实现',         d: '所有工具只使用 HTML / CSS / 原生 JS 或 React，不引入服务端依赖。',                tag: 'compat'  },
  { t: '可独立运行',         d: '每个工具的源码必须可单独复制粘贴后直接运行，不依赖外部资源。',                    tag: 'compat'  },
  { t: '语义化结构',         d: '使用正确的 HTML5 语义标签，便于无障碍阅读与 SEO。',                              tag: 'a11y'    },
  { t: '明确的设计意图',     d: '在动效、颜色、排版上做出清晰可被识别的设计选择，避免"AI 平均感"。',               tag: 'visual'  },
  { t: '响应式优先',         d: '在 360px ~ 1920px 的视口下都能保持视觉完整性。',                                  tag: 'layout'  },
  { t: '性能预算内',         d: '单工具首屏体积不超过 20KB（gzip 后），动画使用 transform / opacity 优先。',     tag: 'perf'    },
  { t: '键盘可达',           d: '所有交互元素支持 Tab 聚焦 + Enter / Space 触发 + focus-visible 反馈。',         tag: 'a11y'    },
  { t: '3x3 母格',           d: '所有布局可拆解为 3x3 母格 + 1/2/3 跨格的组合。便于推导和复用。',                 tag: 'layout'  },
  { t: '标签自描述',         d: '使用 9 类目标签（visual/motion/type/...）标注工具的强项与适用场景。',             tag: 'interact'},
];

const DONT_RULES: { t: string; d: string; tag: TagCategory }[] = [
  { t: '避免通用字体陷阱',   d: '不要使用 Inter / Roboto / Arial / system-ui 作为唯一显示字体。',                  tag: 'type'    },
  { t: '避免紫色渐变',       d: '白底 + 紫色渐变是 AI 视觉的典型，请使用真正符合主题的对比色。',                    tag: 'color'   },
  { t: '不要堆砌微交互',     d: '一次精心编排的入场动画胜过 30 个 hover 抖动。',                                    tag: 'motion'  },
  { t: '不要为了多而多',     d: '功能密度应服务于清晰度，而非展示"我能做很多事"。',                                tag: 'layout'  },
  { t: '不要 Date.now() in render', d: '在 React 渲染函数中调用 Date.now() 会触发 60Hz 重渲染，必须用 CSS 动画。', tag: 'perf' },
  { t: '不要裸用 onClick 在 div', d: '按钮必须用 <button>，并提供 aria-label。无障碍是底线。',                   tag: 'a11y'    },
  { t: '不要 inline 100+ 行',   d: '可复用样式抽 tailwind 工具类或 CSS 变量，避免重复定义。',                    tag: 'compat'  },
  { t: '不要随机 seed',      d: '生成式组件使用 LCG 等可重现伪随机，便于书签和分享。',                              tag: 'interact'},
  { t: '不要无视 prefers-reduced-motion', d: '尊重操作系统的减少动画偏好，对应降级为无动画版本。',                 tag: 'motion'  },
];

const RUBRIC: { l: string; d: string; score: number; tag: TagCategory }[] = [
  { l: '视觉冲击力', d: 'VISUAL IMPACT',    score: 5, tag: 'visual'  },
  { l: '动效编排',   d: 'MOTION CHOREO',    score: 4, tag: 'motion'  },
  { l: '代码简洁度', d: 'CODE BREVITY',     score: 5, tag: 'compat'  },
  { l: '可复用性',   d: 'REUSABILITY',      score: 5, tag: 'layout'  },
  { l: '性能',       d: 'PERFORMANCE',      score: 4, tag: 'perf'    },
  { l: '可读性',     d: 'READABILITY',      score: 5, tag: 'type'    },
  { l: '可访问性',   d: 'ACCESSIBILITY',    score: 4, tag: 'a11y'    },
  { l: '响应式',     d: 'RESPONSIVE',       score: 5, tag: 'layout'  },
  { l: '趣味性',     d: 'DELIGHT',          score: 4, tag: 'interact'},
];

const MODULES: { id: string; t: string; span: 1 | 2 | 3; tag: TagCategory; desc: string }[] = [
  { id: 'M1', t: 'Hero / HERO',     span: 3, tag: 'visual',  desc: '页面第一印象，占 3 列满宽' },
  { id: 'M2', t: 'Codex / 守则',     span: 2, tag: 'layout',  desc: '3x3 网格的多条目索引' },
  { id: 'M3', t: 'Tags / 标签',     span: 1, tag: 'interact',desc: '9 类目过滤' },
  { id: 'M4', t: 'Preview / 预览',  span: 2, tag: 'motion',  desc: '可交互 demo 区' },
  { id: 'M5', t: 'Source / 源码',   span: 1, tag: 'compat',  desc: '可复制片段' },
  { id: 'M6', t: 'Rubric / 评分',   span: 3, tag: 'perf',    desc: '9 维度对照' },
  { id: 'M7', t: 'CTA / 召唤',      span: 2, tag: 'color',   desc: '行动按钮组' },
  { id: 'M8', t: 'Footer / 页脚',   span: 1, tag: 'type',    desc: '辅助信息' },
  { id: 'M9', t: 'A11y / 无障碍',   span: 1, tag: 'a11y',    desc: '旁路导航' },
];

const CONTRIBUTE = [
  { n: '01', t: 'FORK',    d: '在 GitHub 上 fork skill-forge 仓库。' },
  { n: '02', t: 'TAG',     d: '为你的工具选择 1-3 个标签（9 类目之一）。' },
  { n: '03', t: 'LAYOUT',  d: '在 3x3 母格 + 1/2/3 跨格的网格中设计你的展示面。' },
  { n: '04', t: 'PUSH',    d: '提交 PR，附上 100 字以内的设计说明 + 标签理由。' },
];

/* ====================================================================
   PAGE
==================================================================== */
export default function Standards() {
  return (
    <div>
      {/* HERO - 3x3 母格 + 标题占 2 + 标签预览占 1 */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Hexagon size={12} />
              <span>// THE FORGE CODEX / 工坊守则 / V.09</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.82] tracking-tighter">
              <span className="block">THE</span>
              <span className="block text-volt">FORGE</span>
              <span className="block">CODEX.</span>
            </h1>
            <p className="mt-6 text-bone/70 max-w-2xl text-base leading-relaxed">
              关于什么应该被锻造，什么应该被丢弃。
              <span className="text-volt font-bold">模块化 9</span> + <span className="text-cyan font-bold">9 类目标签</span> + <span className="text-pink font-bold">9 评分维度</span>——三套九宫，统御所有页面的呼吸。
            </p>
          </div>
          <aside className="border-2 border-bone/30 p-4 h-fit bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-3 flex items-center gap-2">
              <BookOpen size={12} /> INDEX / 9 SECTIONS
            </div>
            <ul className="space-y-1.5 font-mono text-xs">
              {[
                ['A', '9 原则', 'PRINCIPLES'],
                ['B', '9 应当', 'DO'],
                ['C', '9 避免', "DON'T"],
                ['D', '9 维度', 'RUBRIC'],
                ['E', '9 模块', 'MODULES'],
                ['F', '9 标签', 'TAGS'],
                ['G', '投稿流', 'CONTRIBUTE'],
                ['H', '版本',   'VERSIONS'],
                ['I', '签名',   'SIGNOFF'],
              ].map(([n, t, en]) => (
                <li key={n} className="flex items-center gap-2 hover:text-volt">
                  <span className="text-bone/40 w-5">{n}.</span>
                  <a href={`#s-${n}`} className="flex-1">{t}</a>
                  <span className="text-bone/30 text-[9px]">{en}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* A. 9 PRINCIPLES - 3x3 母格 */}
      <section id="s-A" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="A" t="9 原则" en="9 PRINCIPLES" color="text-volt" />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">九项不可妥协的工坊法则。每条都配对一个 9 类目标签，便于检索与对齐。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {PRINCIPLES.map(p => (
              <div key={p.n} className="border-2 border-bone/30 p-5 hover:border-volt transition-colors group bg-ink">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-display font-black text-4xl text-volt group-hover:rotate-3 transition-transform">{p.n}</span>
                  <Tag cat={p.tag} size="xs" variant="dot" showId />
                </div>
                <div className="font-display font-black text-lg tracking-tight">{p.t} <span className="text-bone/40 text-sm font-normal">{p.en}</span></div>
                <p className="text-bone/70 text-xs mt-2 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B. 9 DO - 3x3 母格 + 标签 */}
      <section id="s-B" className="border-b-2 border-bone/20 px-6 py-12 bg-cyan/5">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="B" t="9 应当" en="9 DO" color="text-cyan" />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">应当做、值得做、被推荐做。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {DO_RULES.map((r, i) => (
              <div key={i} className="border-2 border-cyan/40 p-4 flex gap-3 bg-ink">
                <div className="shrink-0 w-7 h-7 bg-cyan text-ink flex items-center justify-center">
                  <Check size={16} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-sm">{r.t}</span>
                    <Tag cat={r.tag} size="xs" variant="outline" showId />
                  </div>
                  <p className="text-bone/70 text-xs mt-1.5 leading-relaxed">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C. 9 DONT */}
      <section id="s-C" className="border-b-2 border-bone/20 px-6 py-12 bg-pink/5">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="C" t="9 避免" en="9 DON'T" color="text-pink" />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">绝对不要做。看到下面任意一条，请直接驳回该 PR。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {DONT_RULES.map((r, i) => (
              <div key={i} className="border-2 border-pink/40 p-4 flex gap-3 bg-ink">
                <div className="shrink-0 w-7 h-7 bg-pink text-ink flex items-center justify-center">
                  <X size={16} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-sm">{r.t}</span>
                    <Tag cat={r.tag} size="xs" variant="outline" showId />
                  </div>
                  <p className="text-bone/70 text-xs mt-1.5 leading-relaxed">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. 9 RUBRIC - 评分维度 */}
      <section id="s-D" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="D" t="9 评分维度" en="9 RUBRIC DIMENSIONS" color="text-volt" />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">每个被收录的工具都按以下 9 个维度评分，1-5 分。9 个维度的均值是工坊总分。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {RUBRIC.map(d => {
              const meta = TAG_META[d.tag];
              return (
                <div key={d.l} className="border-2 border-bone/30 p-4 hover:border-volt transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] flex items-center gap-1.5" style={{ color: meta.hex }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.hex }} />
                      {d.d}
                    </span>
                    <span className="font-display font-black text-2xl text-volt">{d.score}.0</span>
                  </div>
                  <div className="font-display font-black text-base">{d.l}</div>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: 9 }).map((_, k) => (
                      <div
                        key={k}
                        className="h-1 flex-1 transition-colors"
                        style={{
                          backgroundColor: k < d.score
                            ? (k < 3 ? '#39ff14' : k < 6 ? '#f0ff00' : '#ff3da5')
                            : 'rgba(245,241,232,0.15)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 font-mono text-[9px] text-bone/40">标尺：1-3 绿 / 4-6 黄 / 7-9 粉</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* E. 9 MODULES - 模块化9 视觉法典 */}
      <section id="s-E" className="border-b-2 border-bone/20 px-6 py-12 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="E" t="9 模块" en="9 MODULES" color="text-cyan" icon={<Layers size={14} />} />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">工坊的九块预制砖。任何页面都是这 9 个模块的拼装。1 列 = 1/3 宽，2 列 = 2/3 宽，3 列 = 满宽。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-1.5 auto-rows-[minmax(120px,auto)]">
            {MODULES.map(m => (
              <div
                key={m.id}
                className="border-2 border-bone/40 p-4 hover:border-volt transition-colors bg-ink"
                style={{ gridColumn: `span ${m.span}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-bone/40">{m.id} · SPAN {m.span}</span>
                  <Tag cat={m.tag} size="xs" variant="dot" showId />
                </div>
                <div className="font-display font-black text-xl">{m.t}</div>
                <p className="text-bone/60 text-xs mt-1.5">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. 9 TAGS - 标签体系 */}
      <section id="s-F" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="F" t="9 标签" en="9 TAGS" color="text-pink" icon={<Hash size={14} />} />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">每个工具、每条原则、每条规则、每个评分维度都会被分配到 9 个类目之一。这是工坊的语言表。</p>

          <div className="mt-8 border-2 border-bone/30 bg-ink p-5">
            <div className="font-mono text-[10px] text-bone/60 mb-3">▸ LEGEND / 色板总览</div>
            <TagLegend size="sm" />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {TAG_KEYS.map((k, i) => {
              const m = TAG_META[k];
              return (
                <div key={k} className="border-2 border-bone/30 p-4" style={{ borderColor: m.hex + '60' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-3xl" style={{ color: m.hex }}>{m.id}</span>
                      <span className="font-mono text-[10px] text-bone/40">TAG.{k.toUpperCase()}</span>
                    </div>
                    <Tag cat={k} size="md" />
                  </div>
                  <div className="font-display font-black text-lg">{m.cn}</div>
                  <div className="font-mono text-[10px] text-bone/50 mb-2">{m.en}</div>
                  <p className="text-bone/60 text-xs leading-relaxed">{TAG_DESC[k]}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Tag cat={k} size="xs" variant="solid" showId>SOLID</Tag>
                    <Tag cat={k} size="xs" variant="outline" showId>OUTLINE</Tag>
                    <Tag cat={k} size="xs" variant="dot" showId>DOT</Tag>
                    <Tag cat={k} size="xs" variant="ghost" showId>GHOST</Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* G. CONTRIBUTE - 投稿流 */}
      <section id="s-G" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="G" t="投稿流" en="CONTRIBUTE" color="text-volt" icon={<Workflow size={14} />} />
          <p className="mt-3 text-sm text-bone/60 max-w-2xl">来为工坊添一件工具。4 步流程，从 fork 到 merge。</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-1.5">
            {CONTRIBUTE.map(s => (
              <div key={s.n} className="border-2 border-bone/30 p-4 hover:border-volt transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-black text-3xl text-volt">{s.n}</span>
                  <span className="font-mono text-[10px] text-bone/40">STEP {s.n}</span>
                </div>
                <div className="font-display font-black text-lg tracking-tight">{s.t}</div>
                <p className="text-bone/70 text-xs mt-2 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H. VERSIONS - 版本谱系 */}
      <section id="s-H" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="H" t="版本谱系" en="VERSIONS" color="text-cyan" icon={<Sparkles size={14} />} />
          <div className="mt-8 font-mono text-xs space-y-1.5">
            {[
              { v: 'V.09', date: '2026.06.05', what: '新增 9 标签体系 + 模块化 9 母格', status: 'current' },
              { v: 'V.08', date: '2026.05.20', what: '8 主题色板 + 38 UI 预制件',              status: 'past' },
              { v: 'V.07', date: '2026.05.10', what: '9 问题清单 + 4 段式 QA 文档',               status: 'past' },
              { v: 'V.06', date: '2026.04.30', what: '24 节长卷视觉法典',                          status: 'past' },
              { v: 'V.05', date: '2026.04.20', what: '9 梅花布局 + 12 背景 + 程序化生成器',        status: 'past' },
            ].map(e => (
              <div key={e.v} className={`flex items-center gap-3 px-3 py-2 border-l-4 ${e.status === 'current' ? 'border-volt bg-volt/5' : 'border-bone/20'}`}>
                <span className={`font-display font-black text-base ${e.status === 'current' ? 'text-volt' : 'text-bone/50'}`}>{e.v}</span>
                <span className="text-bone/40 w-20">{e.date}</span>
                <span className="flex-1 text-bone/80">{e.what}</span>
                {e.status === 'current' && <span className="text-volt font-bold">● LIVE</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I. SIGNOFF - 守则收束 */}
      <section id="s-I" className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader n="I" t="签名" en="SIGNOFF" color="text-pink" icon={<ShieldCheck size={14} />} />
          <div className="mt-8 border-2 border-volt p-6 grid md:grid-cols-3 gap-6 bg-volt/5">
            <div className="md:col-span-2">
              <div className="font-display font-black text-3xl md:text-4xl tracking-tight">READY TO FORGE?</div>
              <p className="mt-3 text-bone/80 text-sm leading-relaxed">
                守则不是束缚，是为你的作品配上<span className="text-volt font-bold">9 类目光环</span>——
                让访问者一眼读懂你的设计语言，让同侪工匠有据可依地引用你的代码。
                <br /><br />
                <span className="text-bone/60">来为工坊添一件工具，或通读 28 个现有工具寻找灵感。每一件都标注 1-3 个 9 类目标签。</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-3 bg-bone text-ink font-mono font-bold border-2 border-bone hover:bg-volt text-center">
                浏览 28 工具 →
              </Link>
              <Link to="/plum" className="px-4 py-3 bg-ink text-bone font-mono font-bold border-2 border-bone hover:border-volt text-center">
                9 梅花布局 ↗
              </Link>
              <a href="https://github.com" className="px-4 py-3 bg-ink text-bone font-mono font-bold border-2 border-bone hover:border-pink text-center">
                GITHUB ↗
              </a>
            </div>
          </div>
          <div className="mt-6 text-center font-mono text-[10px] text-bone/40">
            // CODEX V.09 · 9 原则 · 9 应当 · 9 避免 · 9 维度 · 9 模块 · 9 标签 · 9 签名 · 模块化9 已上线
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====================================================================
   9 类目标签语义描述（用于 F 节色板说明）
==================================================================== */
const TAG_DESC: Record<TagCategory, string> = {
  visual:   '视觉相关：图形、版式、装饰元素、构图张力。',
  motion:   '动效相关：缓动曲线、入场、状态过渡、滚动驱动。',
  type:     '字体相关：family 选择、字重、字距、行高。',
  color:    '颜色相关：色板、对比度、配色规则、情绪。',
  layout:   '布局相关：栅格、3x3 母格、跨格策略、断点。',
  interact: '交互相关：hover / focus / 键盘 / 手势 / 反馈。',
  perf:     '性能相关：体积、FPS、重绘、reflow、缓存。',
  a11y:     '可访问性：键盘、屏幕阅读、对比度、reduced-motion。',
  compat:   '兼容性：跨浏览器、独立运行、零依赖。',
};

/* ====================================================================
   段头
==================================================================== */
function SectionHeader({ n, t, en, color = 'text-volt', icon }: { n: string; t: string; en: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
      <span className={`font-display font-black text-3xl ${color}`}>{n}</span>
      <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight flex items-center gap-2">
        {icon}{t}
      </h2>
      <span className="font-mono text-xs text-bone/60 ml-2">/ {en}</span>
    </div>
  );
}

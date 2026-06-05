import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, LayoutGrid, ArrowRight } from 'lucide-react';
import { Tag, TAG_META, TAG_KEYS, type TagCategory } from '../components/Tag';

/* ====================================================================
   PATTERN FORGE · 模式工坊
   ─────────────────────────────────────────────────────────────
   9 模式族 × 9 变体 = 81 设计模式
   每族是一类设计意图,每变体是一种实现策略
==================================================================== */

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

interface PatVariant {
  n: string; name: string; cn: string; en: string;
  ascii: string;
  pros: string; cons: string;
}

interface PatFamily {
  id: string; n: string; name: string; cn: string; en: string; tag: TagCategory;
  variants: PatVariant[];
}

const FAMILIES: PatFamily[] = [
  {
    id: 'F1', n: '01', name: 'CONTAINER', cn: '容器', en: 'WRAP', tag: 'layout',
    variants: [
      { n: '01', name: 'PLAIN',     cn: '纯',     en: 'PLAIN',     ascii: '┌────┐\n│    │\n└────┘',              pros: '0 样式',     cons: '0 区分' },
      { n: '02', name: 'BORDERED',  cn: '描边',   en: 'BORDERED',  ascii: '┏━━━━┓\n┃    ┃\n┗━━━━┛',              pros: '清晰',       cons: '视觉重' },
      { n: '03', name: 'ELEVATED',  cn: '阴影',   en: 'ELEVATED',  ascii: '┌────┐\n│ ▓▓ │\n└────┘',              pros: '层级',       cons: '算阴影' },
      { n: '04', name: 'GLASS',     cn: '玻璃',   en: 'GLASS',     ascii: '≈≈≈≈≈\n≈ ▢  ≈',                  pros: '现代',       cons: '兼容差' },
      { n: '05', name: 'OUTLINED',  cn: '外描',   en: 'OUTLINE',   ascii: '┌──┐\n│  │\n│▓ │\n└──┘',              pros: '焦点',       cons: '双层' },
      { n: '06', name: 'TILED',     cn: '拼贴',   en: 'TILED',     ascii: '┌┬┬┐\n├┼┼┤\n└┴┴┘',                  pros: '密度高',     cons: '难对齐' },
      { n: '07', name: 'STRIP',     cn: '条带',   en: 'STRIP',     ascii: '─────\n ░░░ \n─────',              pros: '节奏',       cons: '易碎' },
      { n: '08', name: 'LAYER',     cn: '叠层',   en: 'LAYER',     ascii: '┌────┐\n│┌──┐│\n│└──┘│\n└────┘',              pros: 'Z 感',       cons: '交互复杂' },
      { n: '09', name: 'BENTO',     cn: '便当',   en: 'BENTO',     ascii: '┌──┬┐\n│  ││\n├──┘│\n└───┘',              pros: '信息密',     cons: '需设计' },
    ],
  },
  {
    id: 'F2', n: '02', name: 'NAVIGATION', cn: '导航', en: 'WAYFIND', tag: 'layout',
    variants: [
      { n: '01', name: 'TOP',    cn: '顶',     en: 'TOP',    ascii: '┌──────┐\n│ ▣ ⌘ │\n├──────┤',   pros: '可见',     cons: '抢空间' },
      { n: '02', name: 'SIDE',   cn: '侧',     en: 'SIDE',   ascii: '┌─┬────┐\n│▣│    │',         pros: '常驻',     cons: '窄屏换位' },
      { n: '03', name: 'BOTTOM', cn: '底',     en: 'BOTTOM', ascii: '├──────┤\n│ ▣ ⌘ │\n└──────┘',   pros: '拇指区',   cons: '桌面怪' },
      { n: '04', name: 'HUB',    cn: '枢纽',   en: 'HUB',    ascii: '   ▣\n  ╱│╲\n ◢ ◣ ◤',         pros: '中央辐射', cons: '多级' },
      { n: '05', name: 'WIZARD', cn: '向导',   en: 'WIZARD', ascii: '① ② ③',                       pros: '线性',     cons: '难跳' },
      { n: '06', name: 'MEGA',   cn: '超级',   en: 'MEGA',   ascii: '┌─┬─┬─┐\n│A│B│C│',         pros: '多维',     cons: '重' },
      { n: '07', name: 'BREAD',  cn: '面包屑', en: 'BREAD',  ascii: 'A / B / C',                    pros: '历史',     cons: '占行' },
      { n: '08', name: 'SEARCH', cn: '搜索',   en: 'SEARCH', ascii: '🔍 ____',                      pros: '直达',     cons: '需索引' },
      { n: '09', name: 'TOC',    cn: '目录',   en: 'TOC',    ascii: '1.\n2.\n3.',                  pros: '长文友好', cons: '占边' },
    ],
  },
  {
    id: 'F3', n: '03', name: 'DATA', cn: '数据', en: 'DISPLAY', tag: 'visual',
    variants: [
      { n: '01', name: 'TABLE',   cn: '表',   en: 'TABLE',   ascii: 'A B C\n─ ─ ─\n1 2 3',  pros: '密集',     cons: '小屏差' },
      { n: '02', name: 'LIST',    cn: '列',   en: 'LIST',    ascii: '─ A\n─ B\n─ C',        pros: '流式',     cons: '无对比' },
      { n: '03', name: 'CARD',    cn: '卡',   en: 'CARD',    ascii: '┌─┐┌─┐',                pros: '视觉',     cons: '占用' },
      { n: '04', name: 'TIMELINE',cn: '时序', en: 'TIME',    ascii: '• t1\n• t2\n• t3',    pros: '时间',     cons: '单维' },
      { n: '05', name: 'KANBAN',  cn: '看板', en: 'KANBAN',  ascii: 'T|D|O',                pros: '工作流',   cons: '状态多' },
      { n: '06', name: 'TREE',    cn: '树',   en: 'TREE',    ascii: '├ A\n│ ├ A1',           pros: '层级',     cons: '深' },
      { n: '07', name: 'CHART',   cn: '图',   en: 'CHART',   ascii: '▁▂▃▄▅',                pros: '趋势',     cons: '失精' },
      { n: '08', name: 'GALLERY', cn: '廊',   en: 'GALLERY', ascii: '▓ ▓ ▓',                pros: '媒体',     cons: '单列长' },
      { n: '09', name: 'CAL',     cn: '日历', en: 'CAL',     ascii: 'Mo Tu We\n 1  2  3',   pros: '日期',     cons: '空间' },
    ],
  },
  {
    id: 'F4', n: '04', name: 'FEEDBACK', cn: '反馈', en: 'SIGNAL', tag: 'a11y',
    variants: [
      { n: '01', name: 'TOAST',   cn: '吐司', en: 'TOAST',   ascii: '┌─toast┐\n│  ✓  │\n└──────┘', pros: '不打断', cons: '错过' },
      { n: '02', name: 'INLINE',  cn: '内联', en: 'INLINE',  ascii: 'field\n⚠ err',                pros: '上下文',  cons: '占空间' },
      { n: '03', name: 'MODAL',   cn: '模态', en: 'MODAL',   ascii: '┌─?┐\n│OK│',                   pros: '必看',    cons: '打断' },
      { n: '04', name: 'SOUND',   cn: '音',   en: 'SOUND',   ascii: '♪ beep',                      pros: '无需看',  cons: 'a11y 慎' },
      { n: '05', name: 'VIBRATE', cn: '振',   en: 'VIBE',    ascii: '∼∼∼',                         pros: '触感',    cons: '移动专属' },
      { n: '06', name: 'HAPTIC',  cn: '触',   en: 'HAPTIC',  ascii: '│tap│',                       pros: '确认',    cons: '需设备' },
      { n: '07', name: 'NUDGE',   cn: '推',   en: 'NUDGE',   ascii: '→ →',                         pros: '引导',    cons: '勿扰' },
      { n: '08', name: 'PULSE',   cn: '脉冲', en: 'PULSE',   ascii: '● · ●',                       pros: '提示',    cons: '动画' },
      { n: '09', name: 'CELEBRATE',cn: '庆',  en: 'WIN',     ascii: '★ ✦ ✺',                       pros: '奖励',    cons: '勿泛用' },
    ],
  },
  {
    id: 'F5', n: '05', name: 'INPUT', cn: '输入', en: 'DATA IN', tag: 'interact',
    variants: [
      { n: '01', name: 'TYPE',   cn: '键入', en: 'TYPE',   ascii: '┌──┐\n│ │\n└──┘', pros: '自由',  cons: '易错' },
      { n: '02', name: 'PICK',   cn: '选取', en: 'PICK',   ascii: '▾ A B C',                pros: '可控',  cons: '需列举' },
      { n: '03', name: 'SLIDE',  cn: '滑动', en: 'SLIDE',  ascii: '─●─────',                pros: '范围',  cons: '精难' },
      { n: '04', name: 'TAP',    cn: '点选', en: 'TAP',    ascii: '①②③',                   pros: '快',    cons: '选项少' },
      { n: '05', name: 'DRAG',   cn: '拖拽', en: 'DRAG',   ascii: '┌─┐→',                   pros: '空间',  cons: '移动' },
      { n: '06', name: 'VOICE',  cn: '语音', en: 'VOICE',  ascii: '🎙 ___',                 pros: '免手',  cons: '噪' },
      { n: '07', name: 'OCR',    cn: '扫',   en: 'OCR',    ascii: '📷 ▓▓',                  pros: '现实',  cons: '识别' },
      { n: '08', name: 'GESTURE',cn: '手势', en: 'GEST',   ascii: '⇄ ⇅',                   pros: '自然',  cons: '学习' },
      { n: '09', name: 'AI',     cn: 'AI',   en: 'AI',     ascii: '🤖 ___',                 pros: '智能',  cons: '黑箱' },
    ],
  },
  {
    id: 'F6', n: '06', name: 'LAYOUT', cn: '布局', en: 'GRID', tag: 'layout',
    variants: [
      { n: '01', name: '1COL',  cn: '单列', en: '1COL',  ascii: '│\n│\n│',                pros: '阅读',  cons: '浪费' },
      { n: '02', name: '2COL',  cn: '双列', en: '2COL',  ascii: '│ │\n│ │\n│ │',           pros: '对比',  cons: '主次' },
      { n: '03', name: '3COL',  cn: '三列', en: '3COL',  ascii: '│││\n│││',                pros: '工坊',  cons: '碎' },
      { n: '04', name: 'BENTO', cn: '便当', en: 'BENTO', ascii: '┌┬┐\n├┼┤\n└┴┘',           pros: '信息',  cons: '需设计' },
      { n: '05', name: 'ASYMM', cn: '非对', en: 'ASYMM', ascii: '┌──┐\n│  └──┐\n└────┘',   pros: '动',    cons: '不稳' },
      { n: '06', name: 'MAGAZ', cn: '杂志', en: 'MAG',   ascii: '┌──┐\n│▓ │ ▓│\n│  └──┘',   pros: '编辑',  cons: '维护' },
      { n: '07', name: 'GRID9', cn: '九宫', en: 'GRID9', ascii: '┌─┬─┬─┐\n├─┼─┼─┤\n└─┴─┴─┘', pros: '呼吸',  cons: '工整' },
      { n: '08', name: 'STACK', cn: '叠',   en: 'STACK', ascii: '┌─┐\n├─┤\n├─┤\n└─┘',     pros: '深度',  cons: '无尽' },
      { n: '09', name: 'FULL',  cn: '满屏', en: 'FULL',  ascii: '████\n████',              pros: '沉浸',  cons: '框架' },
    ],
  },
  {
    id: 'F7', n: '07', name: 'MEDIA', cn: '媒体', en: 'CONTENT', tag: 'visual',
    variants: [
      { n: '01', name: 'IMG',    cn: '图',   en: 'IMG',    ascii: '▓▓▓▓\n▓▓▓▓',                pros: '直观',   cons: '重' },
      { n: '02', name: 'GALLERY',cn: '廊',   en: 'GAL',    ascii: '▓ ▓ ▓',                    pros: '多',     cons: '长' },
      { n: '03', name: 'CARD',   cn: '卡',   en: 'CARD',   ascii: '┌─┐\n│▓│\n└─┘',                pros: '元数据', cons: '重复' },
      { n: '04', name: 'CAROUSEL',cn: '轮播',en: 'CAR',    ascii: '▓→▓→▓',                    pros: '省空',   cons: '自动' },
      { n: '05', name: 'LIGHTBOX',cn: '灯箱',en: 'LIGHT',  ascii: '▓ ← ▓ →',                  pros: '聚焦',   cons: '打断' },
      { n: '06', name: 'MOCKUP', cn: '样机', en: 'MOCK',   ascii: '┌─┐\n│▓│\n└─┘',               pros: '现实',   cons: '拟物' },
      { n: '07', name: 'ASCII',  cn: '字符', en: 'ASCII',  ascii: '+-+/-\\',                    pros: '轻',     cons: '不美' },
      { n: '08', name: 'CANVAS', cn: '画布', en: 'CANVAS', ascii: '░▒▓',                       pros: '动态',   cons: '难 SEO' },
      { n: '09', name: 'CODE',   cn: '码',   en: 'CODE',   ascii: '<div/>',                    pros: '准',     cons: '门槛' },
    ],
  },
  {
    id: 'F8', n: '08', name: 'TYPE', cn: '排印', en: 'TYPE', tag: 'type',
    variants: [
      { n: '01', name: 'DISPLAY',cn: '展示', en: 'DISP',   ascii: 'AAAA\nAAAA',                  pros: '冲击',   cons: '少' },
      { n: '02', name: 'HEAD',   cn: '标题', en: 'HEAD',   ascii: '## Title',                    pros: '结构',   cons: '需层级' },
      { n: '03', name: 'BODY',   cn: '正文', en: 'BODY',   ascii: 'The quick\nbrown fox',        pros: '读',     cons: '无个性' },
      { n: '04', name: 'CAPTION',cn: '说明', en: 'CAP',    ascii: '  caption',                   pros: '辅助',   cons: '小' },
      { n: '05', name: 'MONO',   cn: '等宽', en: 'MONO',   ascii: 'code 1 2 3',                 pros: '对齐',   cons: '冷' },
      { n: '06', name: 'LABEL',  cn: '标签', en: 'LABEL',  ascii: 'lbl:',                        pros: '表单',   cons: '小' },
      { n: '07', name: 'QUOTE',  cn: '引文', en: 'QUOTE',  ascii: '" … "',                       pros: '强调',   cons: '装饰' },
      { n: '08', name: 'NUMBER', cn: '数字', en: 'NUM',    ascii: '0 1 2 3 4',                   pros: '数据',   cons: '字体' },
      { n: '09', name: 'SPECIAL',cn: '特殊', en: 'SPEC',   ascii: '※✦★',                        pros: '个性',   cons: '慎用' },
    ],
  },
  {
    id: 'F9', n: '09', name: 'MOTION', cn: '动效', en: 'MOTION', tag: 'motion',
    variants: [
      { n: '01', name: 'FADE',   cn: '淡',   en: 'FADE',   ascii: 'A → ·',                       pros: '柔和',   cons: '无方向' },
      { n: '02', name: 'SLIDE',  cn: '滑',   en: 'SLIDE',  ascii: 'A ─→ B',                      pros: '空间',   cons: '算位移' },
      { n: '03', name: 'SCALE',  cn: '缩',   en: 'SCALE',  ascii: 'A ·→◉',                       pros: '强调',   cons: '慎用' },
      { n: '04', name: 'ROTATE', cn: '转',   en: 'ROT',    ascii: '↻ A',                         pros: '加载',   cons: '眩' },
      { n: '05', name: 'MORPH',  cn: '形变', en: 'MORPH',  ascii: 'A → B',                       pros: '连贯',   cons: '算力' },
      { n: '06', name: 'PARALLAX',cn:'视差', en: 'PARA',   ascii: 'A B\nA  B',                   pros: '深度',   cons: '复杂' },
      { n: '07', name: 'STAGGER',cn: '错位', en: 'STAG',   ascii: 'A B C\nA B C',                pros: '节奏',   cons: '序' },
      { n: '08', name: 'SPRING', cn: '弹',   en: 'SPR',    ascii: '╲╱╲',                          pros: '物理',   cons: '调参' },
      { n: '09', name: 'FLIP',   cn: '翻',   en: 'FLIP',   ascii: 'A → ⊥ A',                      pros: '重排',   cons: 'math' },
    ],
  },
];

export default function PatternForge() {
  const [activeFamily, setActiveFamily] = useState<string>('all');
  const filtered = activeFamily === 'all' ? FAMILIES : FAMILIES.filter(f => f.id === activeFamily);

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-pink mb-3 flex items-center gap-2">
              <LayoutGrid size={12} />
              <span>// PATTERN FORGE · 模式工坊 / 9 FAMILIES × 9 VARIANTS / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">PATTERN</span>
              <span className="block relative">
                <span className="relative z-10">FORGE.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-pink -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              9 模式族 · 9 变体 ·<span className="text-pink font-bold"> 81 模式</span>。
              每种模式都有<Link to="/standards" className="text-cyan font-bold"> 优劣对比</Link> —
              选择就是放弃。
            </p>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9 模式族 / 81 件</div>
            <div className="space-y-1.5">
              {FAMILIES.map(f => {
                const m = SAFE(f.tag);
                return (
                  <div key={f.id} className="flex items-center gap-2 p-1.5 border border-bone/20">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{f.n}</span>
                    <div className="flex-1">
                      <div className="font-display font-black text-sm">{f.name}</div>
                      <div className="font-mono text-[9px] text-bone/50">{f.cn} · {f.en}</div>
                    </div>
                    <span className="font-mono text-[9px] text-bone/40">{f.variants.length}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* 筛选条 */}
      <section className="px-6 py-3 border-b-2 border-bone/20 sticky top-[108px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[9px] text-bone/40 shrink-0">FAMILY</span>
          <button
            onClick={() => setActiveFamily('all')}
            className={`px-2 py-1 font-mono text-[10px] border-2 ${activeFamily === 'all' ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}
          >ALL (81)</button>
          {FAMILIES.map(f => {
            const m = SAFE(f.tag);
            return (
              <button
                key={f.id}
                onClick={() => setActiveFamily(f.id)}
                className={`px-2 py-1 font-mono text-[10px] border-2 flex items-center gap-1 ${activeFamily === f.id ? 'border-volt' : 'border-bone/30 hover:border-bone'}`}
                style={activeFamily === f.id ? { background: m.hex, color: m.ink, borderColor: m.hex } : {}}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 9 族展示 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {filtered.map(f => {
            const m = SAFE(f.tag);
            return (
              <div key={f.id}>
                <div className="flex items-end justify-between mb-3 pb-2 border-b-2 border-bone/20">
                  <div>
                    <div className="font-mono text-[10px] text-bone/50 flex items-center gap-1.5">
                      <span className="font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{f.n}</span>
                      FAMILY · 9 VARIANTS
                    </div>
                    <h3 className="font-display font-black text-2xl mt-1">
                      <span style={{ color: m.hex }}>{f.name}</span>
                      <span className="text-bone/40 text-base ml-2">{f.cn} · {f.en}</span>
                    </h3>
                  </div>
                  <Tag cat={f.tag} size="sm" variant="outline" showId showEn />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                  {f.variants.map(v => (
                    <div key={v.n} className="border-2 border-bone/30 p-3 hover:border-volt transition-colors group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 border border-bone/30">{v.n}</span>
                          <span className="font-display font-black text-sm">{v.name}</span>
                        </div>
                      </div>
                      <div className="font-mono text-[9px] text-bone/50 mb-2">{v.cn} · {v.en}</div>
                      <pre className="font-mono text-[9px] leading-[1.2] text-bone/70 overflow-hidden whitespace-pre">
{v.ascii}
                      </pre>
                      <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[9px]">
                        <div className="text-perf">+ {v.pros}</div>
                        <div className="text-pink">− {v.cons}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 81 模式 · 决策矩阵</div>
            <p className="text-bone/70 text-sm">
              每种模式都标了<kbd className="px-1 bg-perf/30 text-perf">+ 优</kbd>和
              <kbd className="px-1 bg-pink/30 text-pink">− 劣</kbd>。
              没有银弹,只有<Link to="/standards" className="text-volt font-bold"> 权衡</Link>。
            </p>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想替换一族模式?</h3>
            <p className="text-bone/70 text-sm mt-2">
              任何族变体都可整组复制。Filter 切换可只看一族 9 件。
              返回<Link to="/productions" className="text-pink font-bold"> 制作中心</Link>可看其他 8 座工坊。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/productions" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 制作中心 / PRODUCTIONS
              </Link>
              <Link to="/forge/components" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                组件工坊
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // PATTERN FORGE V.10 · 9 FAMILIES · 9 VARIANTS · 81 PATTERNS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

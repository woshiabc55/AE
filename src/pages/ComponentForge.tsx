import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon, Component, ArrowRight, Check, Box, Layers, Grid3x3, Hash,
} from 'lucide-react';
import { Tag, TAG_META, TAG_KEYS, type TagCategory } from '../components/Tag';

/* ====================================================================
   COMPONENT FORGE · 组件工坊
   ─────────────────────────────────────────────────────────────
   9 组件族 × 9 变体 = 81 组件
   每族代表一类 UI 元素,每变体代表一个 size / variant / state
==================================================================== */

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

interface CompVariant {
  n: string;       // 变体编号 01-09
  name: string;    // 变体名
  cn: string;      // 中文
  en: string;      // 英文
  code: string;    // 1 行代码
  ascii: string;   // ASCII 示意
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'success' | 'warning' | 'error' | 'focus';
}

interface CompFamily {
  id: string;
  n: string;
  name: string;     // Button / Card / Input / ...
  cn: string;       // 按钮 / 卡片 / ...
  en: string;
  tag: TagCategory;
  icon: React.ReactNode;
  variants: CompVariant[];
}

const FAMILIES: CompFamily[] = [
  {
    id: 'F1', n: '01', name: 'BUTTON', cn: '按钮', en: 'TRIGGER', tag: 'interact',
    icon: <Component size={12} />,
    variants: [
      { n: '01', name: 'PRIMARY',     cn: '主按钮', en: 'PRIMARY',     code: '<Button variant="primary">',   ascii: '┌────┐\n│ GO │\n└────┘', state: 'default' },
      { n: '02', name: 'SECONDARY',   cn: '次按钮', en: 'SECONDARY',   code: '<Button variant="secondary">', ascii: '┌────┐\n│ ok │\n└────┘', state: 'default' },
      { n: '03', name: 'GHOST',       cn: '幽灵',   en: 'GHOST',       code: '<Button variant="ghost">',     ascii: '┌────┐\n│ ·· │\n└────┘', state: 'default' },
      { n: '04', name: 'OUTLINE',     cn: '描边',   en: 'OUTLINE',     code: '<Button variant="outline">',   ascii: '┌────┐\n│ :: │\n└────┘', state: 'default' },
      { n: '05', name: 'ICON',        cn: '图标',   en: 'ICON',        code: '<Button icon="<X/>">',         ascii: '┌──┐\n│×│\n└──┘', state: 'default' },
      { n: '06', name: 'LOADING',     cn: '加载',   en: 'LOADING',     code: '<Button loading>',             ascii: '┌────┐\n│ ◐  │\n└────┘', state: 'loading' },
      { n: '07', name: 'DISABLED',    cn: '禁用',   en: 'DISABLED',    code: '<Button disabled>',            ascii: '┌────┐\n│ x  │\n└────┘', state: 'disabled' },
      { n: '08', name: 'DANGER',      cn: '危险',   en: 'DANGER',      code: '<Button variant="danger">',    ascii: '┌────┐\n│ !! │\n└────┘', state: 'error' },
      { n: '09', name: 'SUCCESS',     cn: '成功',   en: 'SUCCESS',     code: '<Button variant="success">',   ascii: '┌────┐\n│ ✓  │\n└────┘', state: 'success' },
    ],
  },
  {
    id: 'F2', n: '02', name: 'CARD', cn: '卡片', en: 'CONTAINER', tag: 'layout',
    icon: <Box size={12} />,
    variants: [
      { n: '01', name: 'PLAIN',   cn: '纯',     en: 'PLAIN',     code: '<Card>',         ascii: '┌──────┐\n│      │\n│      │\n└──────┘' },
      { n: '02', name: 'BORDER', cn: '描边',   en: 'BORDERED',  code: '<Card bordered>',ascii: '┌──┬──┐\n│  │  │\n├──┴──┤\n│     │\n└─────┘' },
      { n: '03', name: 'SHADOW', cn: '阴影',   en: 'ELEVATED',  code: '<Card shadow>',  ascii: '┌─────┐\n│     │\n│ ┌─┐ │\n│ └─┘ │\n└─────┘' },
      { n: '04', name: 'GLASS',  cn: '玻璃',   en: 'GLASS',     code: '<Card glass>',   ascii: '≈≈≈≈≈\n≈  ▢  ≈\n≈≈≈≈≈' },
      { n: '05', name: 'IMAGE',  cn: '图像',   en: 'MEDIA',     code: '<Card.Image>',   ascii: '┌─────┐\n│ ▓▓▓ │\n│     │\n└─────┘' },
      { n: '06', name: 'LINK',   cn: '链接卡', en: 'LINK',      code: '<Card.Link>',    ascii: '┌─────┐\n│ → A │\n│     │\n└─────┘' },
      { n: '07', name: 'PRODUCT',cn: '商品',   en: 'PRODUCT',   code: '<Card.Product>', ascii: '┌─────┐\n│ ▓▓  │\n│ ¥99 │\n└─────┘' },
      { n: '08', name: 'POST',   cn: '文章',   en: 'POST',      code: '<Card.Post>',    ascii: '┌─────┐\n│ TT  │\n│ …   │\n└─────┘' },
      { n: '09', name: 'PRICE',  cn: '价格',   en: 'PRICING',   code: '<Card.Price>',   ascii: '┌─────┐\n│ PRO │\n│ ¥99 │\n└─────┘' },
    ],
  },
  {
    id: 'F3', n: '03', name: 'INPUT', cn: '输入', en: 'DATA ENTRY', tag: 'interact',
    icon: <Hash size={12} />,
    variants: [
      { n: '01', name: 'TEXT',     cn: '文本', en: 'TEXT',     code: '<Input />',         ascii: '┌────────┐\n│        │\n└────────┘' },
      { n: '02', name: 'EMAIL',    cn: '邮箱', en: 'EMAIL',    code: '<Input email>',     ascii: '┌────────┐\n│ @ …    │\n└────────┘' },
      { n: '03', name: 'PASSWORD', cn: '密码', en: 'PASSWORD', code: '<Input password>',  ascii: '┌────────┐\n│ •••••  │\n└────────┘' },
      { n: '04', name: 'NUMBER',   cn: '数字', en: 'NUMBER',   code: '<Input number>',    ascii: '┌────────┐\n│ 0      │\n└────────┘' },
      { n: '05', name: 'SEARCH',   cn: '搜索', en: 'SEARCH',   code: '<Input search>',    ascii: '┌────────┐\n│ 🔍 …  │\n└────────┘' },
      { n: '06', name: 'TEXTAREA', cn: '长文', en: 'TEXTAREA', code: '<Textarea />',      ascii: '┌────────┐\n│        │\n│        │\n└────────┘' },
      { n: '07', name: 'SELECT',   cn: '下拉', en: 'SELECT',   code: '<Select />',        ascii: '┌────────┐\n│ A   ▾  │\n└────────┘' },
      { n: '08', name: 'CHECK',    cn: '多选', en: 'CHECKBOX', code: '<Checkbox />',      ascii: '┌──┐\n│☑ │\n└──┘' },
      { n: '09', name: 'RADIO',    cn: '单选', en: 'RADIO',    code: '<Radio />',         ascii: '┌──┐\n│◉ │\n└──┘' },
    ],
  },
  {
    id: 'F4', n: '04', name: 'MODAL', cn: '模态', en: 'OVERLAY', tag: 'interact',
    icon: <Layers size={12} />,
    variants: [
      { n: '01', name: 'DIALOG',  cn: '对话框', en: 'DIALOG',  code: '<Modal />',          ascii: '┌──────┐\n│  ?   │\n│ YES  │\n└──────┘' },
      { n: '02', name: 'DRAWER',  cn: '抽屉',   en: 'DRAWER',  code: '<Drawer side="l">',  ascii: '├──────┤\n│ █    │\n│ █    │' },
      { n: '03', name: 'SHEET',   cn: '底部',   en: 'SHEET',   code: '<Sheet />',          ascii: '──────\n│ ░░░ │\n│ ███ │' },
      { n: '04', name: 'POPOVER', cn: '气泡',   en: 'POPOVER', code: '<Popover />',        ascii: '┌──┐\n│◢ │\n└──┘' },
      { n: '05', name: 'TOOLTIP', cn: '提示',   en: 'TOOLTIP', code: '<Tooltip />',        ascii: '┌──┐\n│ ! │\n└──┘' },
      { n: '06', name: 'ALERT',   cn: '告警',   en: 'ALERT',   code: '<Alert />',          ascii: '┌──────┐\n│ ⚠ !! │\n└──────┘', state: 'warning' },
      { n: '07', name: 'CONFIRM', cn: '确认',   en: 'CONFIRM', code: '<Confirm />',        ascii: '┌──────┐\n│ sure │\n│OK  NO│\n└──────┘' },
      { n: '08', name: 'COMMAND', cn: '命令',   en: 'COMMAND', code: '<Command />',        ascii: '┌──────┐\n│ > __ │\n└──────┘' },
      { n: '09', name: 'FULL',    cn: '全屏',   en: 'FULL',    code: '<Modal full>',       ascii: '██████\n██████\n██████' },
    ],
  },
  {
    id: 'F5', n: '05', name: 'NAV', cn: '导航', en: 'WAYFINDING', tag: 'layout',
    icon: <Grid3x3 size={12} />,
    variants: [
      { n: '01', name: 'TOPBAR',  cn: '顶栏', en: 'TOP',    code: '<Nav top />',     ascii: '┌────────┐\n│ ▣   ⌘ │\n├────────┤' },
      { n: '02', name: 'SIDEBAR', cn: '侧栏', en: 'SIDE',   code: '<Nav side />',    ascii: '┌─┬────┐\n│▣│    │\n│ │    │\n└─┴────┘' },
      { n: '03', name: 'TABS',    cn: '标签页',en: 'TABS',   code: '<Tabs />',        ascii: 'A B C D\n─ ─ ─ ─' },
      { n: '04', name: 'BREAD',   cn: '面包屑',en: 'BREAD',  code: '<Bread />',       ascii: 'A / B / C' },
      { n: '05', name: 'PAGER',   cn: '分页', en: 'PAGER',  code: '<Pager />',       ascii: '← 1 2 3 →' },
      { n: '06', name: 'STEPS',   cn: '步骤', en: 'STEPS',  code: '<Steps />',       ascii: '① ② ③\n── ── ──' },
      { n: '07', name: 'MENU',    cn: '菜单', en: 'MENU',   code: '<Menu />',        ascii: '┌──┐\n│  │\n│  │\n└──┘' },
      { n: '08', name: 'ANCHOR',  cn: '锚点', en: 'ANCHOR', code: '<Anchor />',      ascii: '# #\n│  │\n│  │' },
      { n: '09', name: 'TOCTREE', cn: '目录', en: 'TOC',    code: '<Toc />',         ascii: '1. A\n2. B\n3. C' },
    ],
  },
  {
    id: 'F6', n: '06', name: 'LIST', cn: '列表', en: 'COLLECTION', tag: 'layout',
    icon: <Layers size={12} />,
    variants: [
      { n: '01', name: 'BARE',   cn: '裸',   en: 'BARE',   code: '<List />',      ascii: '─ A\n─ B\n─ C' },
      { n: '02', name: 'CARD',   cn: '卡',   en: 'CARD',   code: '<List card>',   ascii: '┌─┐┌─┐\n│A││B│\n└─┘└─┘' },
      { n: '03', name: 'ROW',    cn: '行',   en: 'ROW',    code: '<List row>',    ascii: '─ A B C\n─ D E F' },
      { n: '04', name: 'GRID',   cn: '格',   en: 'GRID',   code: '<List grid>',   ascii: '┌─┬─┬─┐\n│A│B│C│\n├─┼─┼─┤' },
      { n: '05', name: 'STACK',  cn: '叠',   en: 'STACK',  code: '<List stack>',  ascii: '┌─┐\n│A│\n├─┤\n│B│' },
      { n: '06', name: 'TREE',   cn: '树',   en: 'TREE',   code: '<List tree>',   ascii: '├ A\n│ ├ A1\n│ └ A2' },
      { n: '07', name: 'TIMELINE',cn: '时序', en: 'TIME',  code: '<List time>',   ascii: '• t1\n• t2\n• t3' },
      { n: '08', name: 'VIRTUAL',cn: '虚拟', en: 'VIRT',   code: '<List virt>',   ascii: '░ 1k ░' },
      { n: '09', name: 'INFINITE',cn:'无限', en: 'INF',    code: '<List inf>',    ascii: '↓ scroll' },
    ],
  },
  {
    id: 'F7', n: '07', name: 'FORM', cn: '表单', en: 'FORM', tag: 'a11y',
    icon: <Check size={12} />,
    variants: [
      { n: '01', name: 'LOGIN',   cn: '登录', en: 'LOGIN',   code: '<Form.Login />',  ascii: '┌─usr─┐\n└─────┘\n┌─pwd─┐\n[GO]' },
      { n: '02', name: 'SIGNUP',  cn: '注册', en: 'SIGNUP',  code: '<Form.Signup />', ascii: '┌─mail┐\n┌─pwd─┐\n┌─pwd2┐' },
      { n: '03', name: 'CONTACT', cn: '联系', en: 'CONTACT', code: '<Form.Contact>',  ascii: '┌─msg─┐\n│     │\n└─────┘' },
      { n: '04', name: 'SEARCH',  cn: '检索', en: 'SEARCH',  code: '<Form.Search>',   ascii: '┌─?─┐\n[GO]' },
      { n: '05', name: 'FILTER',  cn: '筛选', en: 'FILTER',  code: '<Form.Filter>',   ascii: '[tag][tag]\n[tag][tag]' },
      { n: '06', name: 'MULTI',   cn: '分步', en: 'MULTI',   code: '<Form.Multi />',  ascii: '① ② ③' },
      { n: '07', name: 'UPLOAD',  cn: '上传', en: 'UPLOAD',  code: '<Form.Upload />',  ascii: '┌────┐\n│ ↑  │\n└────┘' },
      { n: '08', name: 'PAY',     cn: '支付', en: 'PAY',     code: '<Form.Pay />',    ascii: '┌─card┐\n[PAY]' },
      { n: '09', name: 'POLL',    cn: '问卷', en: 'POLL',    code: '<Form.Poll />',   ascii: '①②③④⑤' },
    ],
  },
  {
    id: 'F8', n: '08', name: 'FEEDBACK', cn: '反馈', en: 'SIGNAL', tag: 'a11y',
    icon: <Hexagon size={12} />,
    variants: [
      { n: '01', name: 'TOAST',   cn: '吐司', en: 'TOAST',    code: '<Toast />',         ascii: '┌─toast┐\n│  ✓   │\n└──────┘', state: 'success' },
      { n: '02', name: 'SNACK',   cn: '小吃', en: 'SNACK',    code: '<Snack />',         ascii: '░ ░ ░' },
      { n: '03', name: 'NOTICE',  cn: '通知', en: 'NOTICE',   code: '<Notice />',        ascii: '🔔 !!' },
      { n: '04', name: 'BADGE',   cn: '徽章', en: 'BADGE',    code: '<Badge />',         ascii: '[99+]' },
      { n: '05', name: 'PROGRESS',cn: '进度', en: 'PROGRESS', code: '<Progress />',      ascii: '▓▓▓▓▓░░░' },
      { n: '06', name: 'SPIN',    cn: '旋转', en: 'SPINNER',  code: '<Spinner />',       ascii: '◐' },
      { n: '07', name: 'SKELETON',cn: '骨架', en: 'SKELETON', code: '<Skeleton />',      ascii: '▒▒▒' },
      { n: '08', name: 'BANNER',  cn: '横幅', en: 'BANNER',   code: '<Banner />',        ascii: '█ █ █ █' },
      { n: '09', name: 'EMPTY',   cn: '空态', en: 'EMPTY',    code: '<Empty />',         ascii: '∅ ∅ ∅' },
    ],
  },
  {
    id: 'F9', n: '09', name: 'MEDIA', cn: '媒体', en: 'CONTENT', tag: 'visual',
    icon: <Box size={12} />,
    variants: [
      { n: '01', name: 'IMG',     cn: '图',   en: 'IMAGE',   code: '<Img />',         ascii: '▓▓▓▓▓' },
      { n: '02', name: 'AVATAR',  cn: '头像', en: 'AVATAR',  code: '<Avatar />',      ascii: '(◕‿◕)' },
      { n: '03', name: 'ICON',    cn: '图标', en: 'ICON',    code: '<Icon />',        ascii: '◆' },
      { n: '04', name: 'LOGO',    cn: '徽标', en: 'LOGO',    code: '<Logo />',        ascii: '★' },
      { n: '05', name: 'QR',      cn: '二维码',en:'QR',     code: '<QR />',          ascii: '▓░▓\n░▓░\n▓░▓' },
      { n: '06', name: 'VIDEO',   cn: '视频', en: 'VIDEO',   code: '<Video />',       ascii: '▶ ▓▓' },
      { n: '07', name: 'AUDIO',   cn: '音频', en: 'AUDIO',   code: '<Audio />',       ascii: '♪ ▓▓' },
      { n: '08', name: 'CANVAS',  cn: '画布', en: 'CANVAS',  code: '<Canvas />',      ascii: '▒░▒' },
      { n: '09', name: 'EMOJI',   cn: '表情', en: 'EMOJI',   code: '<Emoji />',       ascii: '☻' },
    ],
  },
];

export default function ComponentForge() {
  const [activeFamily, setActiveFamily] = useState<string>('all');
  const filtered = activeFamily === 'all'
    ? FAMILIES
    : FAMILIES.filter(f => f.id === activeFamily);

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Component size={12} />
              <span>// COMPONENT FORGE · 组件工坊 / 9 FAMILIES × 9 VARIANTS / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">COMPONENT</span>
              <span className="block relative">
                <span className="relative z-10">FORGE.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-volt -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              9 组件族 · 9 变体 ·<span className="text-volt font-bold"> 81 件</span>。
              从<Link to="/productions" className="text-cyan font-bold"> 制作中心</Link>进入 —
              每件组件都通过<Link to="/codex-studio" className="text-pink font-bold"> 9 道门</Link>才可发布。
            </p>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9 组件族 / 81 件</div>
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
                {/* 族头 */}
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
                {/* 9 变体 */}
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                  {f.variants.map(v => {
                    return (
                      <div key={v.n} className="border-2 border-bone/30 p-3 hover:border-volt transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 border border-bone/30">{v.n}</span>
                            <span className="font-display font-black text-sm">{v.name}</span>
                          </div>
                          {v.state && <Check size={10} className="text-perf" />}
                        </div>
                        <div className="font-mono text-[9px] text-bone/50 mb-2">{v.cn} · {v.en}</div>
                        <pre className="font-mono text-[9px] leading-[1.2] text-bone/70 overflow-hidden whitespace-pre">
{v.ascii}
                        </pre>
                        <code className="block mt-2 font-mono text-[9px] text-volt bg-bone/5 px-1.5 py-1 truncate">
                          {v.code}
                        </code>
                      </div>
                    );
                  })}
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
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 81 件 · 总览</div>
            <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
              {FAMILIES.flatMap(f => f.variants.slice(0, 9)).map((v, i) => (
                <div key={i} className="border border-bone/20 px-1.5 py-0.5 truncate">
                  <span className="text-bone/40">{v.n} </span>
                  <span className="text-bone/80">{v.name.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想替换某族组件?</h3>
            <p className="text-bone/70 text-sm mt-2">
              任何族变体都可整组复制。Filter 切换可只看一族 9 件。
              返回<Link to="/productions" className="text-volt font-bold"> 制作中心</Link>可看其他 8 座工坊。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/productions" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 制作中心 / PRODUCTIONS
              </Link>
              <Link to="/codex" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                81 组件总览
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // COMPONENT FORGE V.10 · 9 FAMILIES · 9 VARIANTS · 81 COMPONENTS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Wrench, Code2, FileWarning, ListChecks, Layers } from 'lucide-react';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status = 'fixed' | 'verified' | 'open' | 'wontfix';

interface Issue {
  id: number;
  title: string;
  module: string;
  severity: Severity;
  status: Status;
  description: string;
  logic: string;
  fix: string;
  evidence?: string;
  fixedIn?: string;
}

const ISSUES: Issue[] = [
  {
    id: 1,
    title: 'Date.now() in render — 60fps 重渲染风暴',
    module: 'Packs / Audio / Kinetic',
    severity: 'critical',
    status: 'fixed',
    description: '在 JSX render 函数中直接调用 Date.now()，使 React 每帧重新计算整个组件树。AudioWaveform / AudioBars / AudioCircular / AudioParticle / TypeWave / TypeRotate3D / TypeLiquid / MotionMorph 共 8 处。',
    logic: 'React 渲染 = 纯函数。render 中读 Date.now() 会让组件状态看似"变化"，触发 reconciliation。在 60Hz 屏上 = 60 次/秒 reconcile。',
    fix: '用 CSS @keyframes + animation-delay 替代。让 GPU 接管 transform / opacity，JS 线程彻底空闲。',
    evidence: 'Packs.tsx → AudioWaveform / TypeWave / TypeRotate3D 等 8 处',
    fixedIn: 'Packs.tsx r4',
  },
  {
    id: 2,
    title: 'ErrorBoundary 缺失 — 整页崩溃',
    module: 'App.tsx / 顶层',
    severity: 'critical',
    status: 'fixed',
    description: '任何子树抛错（路由懒加载、bad data、null deref）会白屏。',
    logic: 'React 16+ 中未捕获的渲染错误会卸载整棵组件树。SPA 必须有 ErrorBoundary 才能做到"局部失败不影响全局"。',
    fix: '新增 src/components/ErrorBoundary.tsx，包装 AnimatedRoutes，提供 retry 按钮。',
    evidence: 'src/components/ErrorBoundary.tsx',
    fixedIn: 'r4',
  },
  {
    id: 3,
    title: '404 未处理 — 空白页',
    module: 'App.tsx / 路由',
    severity: 'medium',
    status: 'fixed',
    description: '访问未注册路径（如 /foo）会得到空 <main>。',
    logic: 'React Router v6 的 <Route path="*"> 是 catch-all 兜底路由。缺失时未匹配 = null。',
    fix: '新增 src/pages/NotFound.tsx，含 3 个回首页的快捷链接。',
    evidence: 'src/pages/NotFound.tsx',
    fixedIn: 'r4',
  },
  {
    id: 4,
    title: 'Type cast `as Pack[\'tools\']` — 类型安全漏洞',
    module: 'Packs.tsx',
    severity: 'medium',
    status: 'verified',
    description: 'PACK_LIST 用了 `as Pack[\'tools\']` 强制断言。原本由 `as const` 推断的窄类型未完整表达结构。',
    logic: '`as const` 推断出的 readonly tuple 转 mutable array 需要断言。理想做法是源头就用显式 interface（已修复）。',
    fix: '在 Packs.tsx 顶部定义 Pack / PackTool interface，PACKS 显式声明 Pack[]，消除对 `as` 的依赖。',
    evidence: 'Packs.tsx L20-30, L555',
    fixedIn: 'r4',
  },
  {
    id: 5,
    title: 'Packs 状态未同步到 URL — 不可分享',
    module: 'Packs.tsx',
    severity: 'medium',
    status: 'open',
    description: '切换包后刷新页面会丢失选中的包（回到第一个）。',
    logic: 'useState 是会话内状态。SPA 最佳实践是把 UI 状态写进 URL（?pack=micro），刷新与分享都保持一致。',
    fix: '用 useSearchParams 替代 useState。activePack = params.get(\'pack\') ?? PACK_LIST[0].id。',
    evidence: 'Packs.tsx L42',
  },
  {
    id: 6,
    title: 'A11y: focus-visible 缺省 — 键盘不可见',
    module: 'Micro / 全局',
    severity: 'high',
    status: 'verified',
    description: '大量自定义按钮 / 卡片缺焦点环，键盘用户无法追踪当前位置。',
    logic: '浏览器默认 :focus 是浏览器风格，被 outline: none 覆盖后必须补 :focus-visible 样式。',
    fix: '在 globals.css 增加全局 :focus-visible 规则（已用 Tailwind focus-visible:ring）。MicroFocus 演示组件作为示例。',
    evidence: 'globals.css, Packs.tsx → MicroFocus',
  },
  {
    id: 7,
    title: 'Bundle 体积：lucide-react 整体引用',
    module: 'Nav.tsx / 各处',
    severity: 'low',
    status: 'wontfix',
    description: 'lucide-react 0.451 已自动 tree-shake，单文件 import 多个图标是 OK 的。',
    logic: 'Vite 5 + ESM tree-shaking 会移除未引用的 named export。仅在 import * as Icons from ... 时才会全量打包。',
    fix: '保持当前 named import 风格。监控 dist/assets/*.js 体积。',
    evidence: 'dist/assets/index-*.js = 359.97 kB / gzip 106.88 kB',
  },
  {
    id: 8,
    title: 'Sticky header z-index 冲突 — 移动端遮挡',
    module: 'Packs / Home',
    severity: 'medium',
    status: 'open',
    description: 'Nav (z-50) + PageNav (z-50) + Sticky 包切换器 (z-40) 叠加，移动端小屏可能重叠。',
    logic: 'sticky 元素在 viewport 内的层叠由 z-index 决定。同级 z-50 多个元素，后渲染者覆盖前者。',
    fix: '为 Sticky 包切换器降 z-index 到 30，并加 bottom shadow 区分。',
    evidence: 'Packs.tsx L51, Home.tsx L61',
  },
  {
    id: 9,
    title: 'Meta / SEO 缺失',
    module: 'index.html / 全局',
    severity: 'low',
    status: 'open',
    description: 'index.html 缺 description / og:image / theme-color，社交分享时显示默认占位。',
    logic: 'SEO 抓取依赖 <meta>。SPA 切换路由时不会更新 title，需要 react-helmet-async 或 document.title 副作用。',
    fix: '在 index.html 补全 meta + 加 useDocumentTitle hook 处理各页面 title。',
    evidence: 'index.html',
  },
];

const MODULES = [
  { id: 'routing', name: '路由层', files: ['App.tsx', 'PageNav.tsx', 'NotFound.tsx'], status: 'healthy' },
  { id: 'preview', name: '预览组件', files: ['Packs.tsx', 'Previews.tsx', 'Previews2.tsx', 'Previews3.tsx', 'Frame.tsx'], status: 'healthy' },
  { id: 'pages', name: '页面', files: ['Home.tsx', 'Packs.tsx', 'QA.tsx', 'Schemes.tsx', '...'], status: 'healthy' },
  { id: 'data', name: '数据层', files: ['tools.ts', 'Packs.tsx (PACKS)'], status: 'healthy' },
  { id: 'guard', name: '错误边界', files: ['ErrorBoundary.tsx'], status: 'healthy' },
  { id: 'styles', name: '样式', files: ['globals.css', 'tailwind.config.js'], status: 'healthy' },
];

const SEVERITY_MAP: Record<Severity, { label: string; text: string; bg: string; border: string }> = {
  critical: { label: 'CRITICAL', text: 'text-pink', bg: 'bg-pink/20', border: 'border-pink' },
  high: { label: 'HIGH', text: 'text-volt', bg: 'bg-volt/20', border: 'border-volt' },
  medium: { label: 'MEDIUM', text: 'text-cyan', bg: 'bg-cyan/20', border: 'border-cyan' },
  low: { label: 'LOW', text: 'text-bone', bg: 'bg-bone/20', border: 'border-bone/40' },
};

const STATUS_MAP: Record<Status, { label: string; icon: typeof CheckCircle2; color: string }> = {
  fixed: { label: 'FIXED', icon: CheckCircle2, color: 'text-cyan' },
  verified: { label: 'VERIFIED', icon: CheckCircle2, color: 'text-volt' },
  open: { label: 'OPEN', icon: AlertTriangle, color: 'text-pink' },
  wontfix: { label: 'WONT-FIX', icon: XCircle, color: 'text-bone/40' },
};

export default function QA() {
  const [filter, setFilter] = useState<'all' | Severity | Status>('all');
  const [checkedLogic, setCheckedLogic] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (filter === 'all') return ISSUES;
    if (['critical', 'high', 'medium', 'low'].includes(filter as string)) {
      return ISSUES.filter(i => i.severity === filter);
    }
    return ISSUES.filter(i => i.status === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    total: ISSUES.length,
    fixed: ISSUES.filter(i => i.status === 'fixed').length,
    verified: ISSUES.filter(i => i.status === 'verified').length,
    open: ISSUES.filter(i => i.status === 'open').length,
    critical: ISSUES.filter(i => i.severity === 'critical').length,
  }), []);

  const toggleCheck = (id: number) => {
    setCheckedLogic(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6 font-mono text-xs">
            <FileWarning size={14} className="text-pink" />
            <span className="text-bone/60">9 ISSUES / 6 MODULES / 4 STATUS / 4 SEVERITY</span>
          </div>
          <h1 className="font-display font-black text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter">
            <span className="block">QUALITY</span>
            <span className="block relative">
              <span className="relative z-10">AUDIT.</span>
              <span className="absolute -bottom-2 left-0 w-2/5 h-5 md:h-8 bg-pink -z-0" />
            </span>
          </h1>
          <p className="mt-8 text-lg text-bone/80 max-w-3xl">
            全面软件审查：列出 <span className="text-pink font-bold">9 项常见问题</span>，
            每项包含 <span className="text-volt font-bold">问题 / 逻辑 / 修复 / 证据</span> 四段。
            点击 LOGIC CHECK 验证推理。
          </p>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'TOTAL', val: stats.total, color: 'text-bone' },
              { label: 'FIXED', val: stats.fixed, color: 'text-cyan' },
              { label: 'VERIFIED', val: stats.verified, color: 'text-volt' },
              { label: 'OPEN', val: stats.open, color: 'text-pink' },
              { label: 'CRITICAL', val: stats.critical, color: 'text-pink' },
            ].map(s => (
              <div key={s.label} className="border-2 border-bone/20 p-3">
                <div className="font-mono text-[10px] text-bone/40">{s.label}</div>
                <div className={`font-display font-black text-3xl ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES 大梁 */}
      <section className="px-6 py-8 border-b-2 border-bone/20 bg-ink/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-bone/60">
            <Layers size={12} />
            <span>大梁 / MAIN MODULES / 6 根主梁</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {MODULES.map(m => (
              <div key={m.id} className="border-2 border-cyan/40 bg-cyan/5 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 bg-cyan rounded-full" />
                  <span className="text-cyan font-mono text-[10px] font-bold">{m.name}</span>
                </div>
                <div className="font-mono text-[8px] text-bone/50 leading-tight">
                  {m.files.slice(0, 2).join(', ')}{m.files.length > 2 ? ` +${m.files.length - 2}` : ''}
                </div>
                <div className="mt-2 text-[9px] font-mono text-cyan">HEALTHY</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-[72px] z-30 bg-ink/95 backdrop-blur border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-wrap items-center gap-1">
          <span className="font-mono text-[10px] text-bone/40 mr-2">FILTER:</span>
          {[
            { id: 'all', label: '全部' },
            ...(['critical', 'high', 'medium', 'low'] as Severity[]).map(s => ({ id: s, label: SEVERITY_MAP[s].label })),
            ...(['fixed', 'verified', 'open'] as Status[]).map(s => ({ id: s, label: STATUS_MAP[s].label })),
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-2 py-1 font-mono text-[10px] border transition-colors ${
                filter === f.id
                  ? 'bg-volt text-ink border-volt'
                  : 'border-bone/30 text-bone/60 hover:border-bone'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ISSUES LIST */}
      <section className="px-6 py-8">
        <div className="max-w-[1400px] mx-auto space-y-4 stagger">
          {filtered.map(issue => {
            const sev = SEVERITY_MAP[issue.severity];
            const st = STATUS_MAP[issue.status];
            const StIcon = st.icon;
            const isChecked = checkedLogic.has(issue.id);
            return (
              <article key={issue.id} className="border-2 border-bone/20 bg-ink hover:border-bone transition-colors">
                {/* HEADER */}
                <header className="flex items-start gap-3 p-4 border-b border-bone/10">
                  <div className="font-display font-black text-3xl text-bone/30 leading-none mt-1">
                    {String(issue.id).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-lg md:text-xl leading-tight">{issue.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px]">
                      <span className={`px-1.5 py-0.5 ${sev.bg} ${sev.text} border ${sev.border}`}>{sev.label}</span>
                      <span className={`flex items-center gap-1 ${st.color}`}>
                        <StIcon size={10} /> {st.label}
                      </span>
                      <span className="text-bone/40">· {issue.module}</span>
                      {issue.fixedIn && <span className="text-cyan">· FIXED IN {issue.fixedIn}</span>}
                    </div>
                  </div>
                </header>

                {/* BODY */}
                <div className="p-4 grid md:grid-cols-2 gap-4 font-mono text-[11px] leading-relaxed">
                  <div>
                    <div className="text-pink font-bold mb-1 flex items-center gap-1">
                      <Wrench size={10} /> 问题 / PROBLEM
                    </div>
                    <div className="text-bone/80">{issue.description}</div>
                  </div>
                  <div>
                    <div className="text-cyan font-bold mb-1 flex items-center gap-1">
                      <Code2 size={10} /> 逻辑 / LOGIC
                    </div>
                    <div className="text-bone/80">{issue.logic}</div>
                  </div>
                  <div>
                    <div className="text-volt font-bold mb-1">→ 修复 / FIX</div>
                    <div className="text-bone/80">{issue.fix}</div>
                  </div>
                  <div>
                    <div className="text-bone/60 font-bold mb-1">证据 / EVIDENCE</div>
                    <div className="text-bone/60 text-[10px]">{issue.evidence ?? '—'}</div>
                  </div>
                </div>

                {/* LOGIC CHECK FOOTER */}
                <footer className="px-4 py-2 border-t border-bone/10 flex items-center justify-between bg-bone/5">
                  <button
                    onClick={() => toggleCheck(issue.id)}
                    className={`flex items-center gap-2 text-[10px] font-mono transition-colors ${
                      isChecked ? 'text-cyan' : 'text-bone/40 hover:text-bone'
                    }`}
                  >
                    {isChecked
                      ? <CheckCircle2 size={12} />
                      : <ListChecks size={12} />}
                    {isChecked ? '✓ LOGIC VERIFIED' : '▸ LOGIC CHECK'}
                  </button>
                  {isChecked && (
                    <span className="text-[10px] font-mono text-cyan">
                      推理已通过 / 原因链: 现象 → 机制 → 影响 → 修复
                    </span>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="px-6 py-8 border-t-2 border-bone/20 bg-ink/50">
        <div className="max-w-[1400px] mx-auto font-mono text-[10px] text-bone/40 leading-relaxed">
          <div className="text-volt font-bold mb-2">▸ 检查方法 / METHODOLOGY</div>
          每一项问题遵循"四段式"：<span className="text-pink">现象 (symptom)</span> → <span className="text-cyan">机制 (mechanism)</span> → <span className="text-volt">影响 (impact)</span> → <span className="text-bone">修复 (fix)</span>。
          点击 LOGIC CHECK 标记已验证条目。SEVERITY 评级基于 <span className="text-bone">影响范围 × 修复成本</span>。
        </div>
      </section>
    </div>
  );
}

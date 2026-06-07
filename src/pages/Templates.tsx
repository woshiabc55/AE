import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Cuboid, Filter, Wand2, MousePointerClick } from 'lucide-react';
import Live2DAutoDemo from '@/components/live2d/Live2DAutoDemo';
import { SVG_TEMPLATES, LIVE2D_TEMPLATES } from '@/lib/templates';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export default function Templates() {
  const [tab, setTab] = useState<'all' | 'svg' | 'live2d'>('all');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const createSvgProject = useProjectStore((s) => s.createSvgProject);
  const createLive2DProject = useProjectStore((s) => s.createLive2DProject);
  const updateSvgData = useProjectStore((s) => s.updateSvgData);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return SVG_TEMPLATES.filter((t) => {
      if (tab === 'live2d') return false;
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== 'all' && t.category !== cat) return false;
      return true;
    });
  }, [tab, q, cat]);

  const filteredL2D = useMemo(() => {
    return LIVE2D_TEMPLATES.filter((t) => {
      if (tab === 'svg') return false;
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  return (
    <div className="relative">
      <div className="grid-bg absolute inset-0 opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-[1480px] px-6 py-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-neon-cyan mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 模板库
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">挑一个起点,改一改就是你的</h1>
            <p className="mt-3 text-fog max-w-2xl">从 SVG 关键帧到 Live2D 角色,所有模板都自带动画时间线、参数绑定与导出配置,载入后即可继续微调。</p>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="mt-8 glass border border-white/10 rounded-2xl p-3 flex items-center gap-3 flex-wrap">
          <div className="flex bg-ink-700 rounded-lg border border-white/10 p-0.5">
            {[
              { k: 'all', label: '全部' },
              { k: 'svg', label: 'SVG 动画' },
              { k: 'live2d', label: 'Live2D 角色' },
            ].map((it) => (
              <button
                key={it.k}
                onClick={() => setTab(it.k as any)}
                className={cn(
                  'h-8 px-4 rounded-md text-[13px] font-medium transition',
                  tab === it.k ? 'bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-900' : 'text-fog hover:text-cream',
                )}
              >
                {it.label}
              </button>
            ))}
          </div>
          {tab !== 'live2d' && (
            <div className="flex bg-ink-700 rounded-lg border border-white/10 p-0.5 text-[12px]">
              {[
                { k: 'all', label: '全部' },
                { k: 'loop', label: '循环' },
                { k: 'intro', label: '片头' },
                { k: 'transition', label: '转场' },
                { k: 'character', label: '角色' },
                { k: 'data', label: '数据' },
              ].map((it) => (
                <button
                  key={it.k}
                  onClick={() => setCat(it.k)}
                  className={cn('h-7 px-2.5 rounded transition', cat === it.k ? 'bg-white/10 text-cream' : 'text-fog hover:text-cream')}
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex-1" />
          <div className="relative">
            <Search className="w-4 h-4 text-fog-dim absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索模板…"
              className="h-9 pl-9 pr-3 bg-ink-700 border border-white/10 rounded-lg text-[12px] outline-none focus:border-neon-cyan w-64"
            />
          </div>
        </div>

        {/* SVG 模板 */}
        {filtered.length > 0 && (
          <section className="mt-10">
            <SectionTitle icon={Wand2} title="SVG 关键帧动画" subtitle="时间线 + 缓动 + 多属性" />
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((t) => (
                <TemplateSvgCard
                  key={t.id}
                  template={t}
                  onUse={async () => {
                    const p = await createSvgProject(t.name);
                    updateSvgData(t.build().data);
                    pushToast('success', `已载入「${t.name}」`);
                    navigate(`/editor/svg/${p.id}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Live2D 模板 */}
        {filteredL2D.length > 0 && (
          <section className="mt-12">
            <SectionTitle icon={Cuboid} title="Live2D 角色" subtitle="参数绑定 + 网格形变 + 动作" />
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredL2D.map((t) => (
                <TemplateLive2DCard
                  key={t.id}
                  template={t}
                  onUse={async () => {
                    const p = await createLive2DProject(t.name);
                    useProjectStore.setState({
                      current: { ...p, data: t.build() },
                      isDirty: true,
                    });
                    pushToast('success', `已载入「${t.name}」`);
                    navigate(`/editor/live2d/${p.id}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && filteredL2D.length === 0 && (
          <div className="mt-20 text-center text-fog-dim">未找到匹配模板,试试切换分类或清空搜索</div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: any) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-neon-cyan" />
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <span className="text-[12px] font-mono text-fog-dim">{subtitle}</span>
      </div>
    </div>
  );
}

function TemplateSvgCard({ template, onUse }: any) {
  const { data, thumbnail } = template.build();
  return (
    <div className="card-elevate glass border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="aspect-video relative" style={{ background: thumbnail }}>
        <TemplateAnimationPreview data={data} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="font-display font-semibold">{template.name}</div>
          <span className="text-[10px] font-mono text-fog-dim">{template.duration}s</span>
        </div>
        <div className="text-[12px] text-fog mt-1.5 line-clamp-2 leading-relaxed">{template.description}</div>
        <button
          onClick={onUse}
          className="btn-press mt-3 w-full h-9 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-900 font-semibold text-[13px] flex items-center justify-center gap-1.5"
        >
          <Wand2 className="w-3.5 h-3.5" /> 使用此模板
        </button>
      </div>
    </div>
  );
}

function TemplateLive2DCard({ template, onUse }: any) {
  return (
    <div className="card-elevate glass border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-[5/6] relative bg-mesh-glow">
        <Live2DAutoDemo data={template.build()} className="absolute inset-0" />
        <div className="absolute top-3 left-3 text-[10px] font-mono text-fog-dim flex items-center gap-1.5">
          <MousePointerClick className="w-3 h-3 text-neon-cyan" /> 点击画板触发动作
        </div>
      </div>
      <div className="p-4">
        <div className="font-display font-semibold">{template.name}</div>
        <div className="text-[12px] text-fog mt-1.5 line-clamp-2 leading-relaxed">{template.description}</div>
        <button
          onClick={onUse}
          className="btn-press mt-3 w-full h-9 rounded-lg bg-gradient-to-r from-ember to-neon-violet text-ink-900 font-semibold text-[13px] flex items-center justify-center gap-1.5"
        >
          <Cuboid className="w-3.5 h-3.5" /> 使用此角色
        </button>
      </div>
    </div>
  );
}

function TemplateAnimationPreview({ data }: { data: any }) {
  // 用 SVG 直接渲染一个简化预览(静态,但有动画 class 装饰)
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg viewBox={`0 0 ${data.width} ${data.height}`} className="w-3/4 h-3/4">
        {data.layers.map((l: any, i: number) => {
          const t = l.transform;
          const transform = `translate(${t.x} ${t.y}) rotate(${t.rotate}) scale(${t.scaleX} ${t.scaleY})`;
          if (l.kind === 'circle') {
            return (
              <circle
                key={l.id}
                cx={l.attrs.cx}
                cy={l.attrs.cy}
                r={l.attrs.r}
                fill={l.style.fill}
                transform={transform}
                className="animate-breathe"
                style={{ animationDelay: `${i * 0.15}s`, transformOrigin: 'center', transformBox: 'fill-box' } as any}
              />
            );
          }
          if (l.kind === 'rect') {
            return (
              <rect
                key={l.id}
                x={l.attrs.x}
                y={l.attrs.y}
                width={l.attrs.width}
                height={l.attrs.height}
                rx={l.attrs.rx}
                fill={l.style.fill}
                transform={transform}
                className="animate-floaty"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            );
          }
          if (l.kind === 'text') {
            return (
              <text
                key={l.id}
                x={l.attrs.x}
                y={l.attrs.y}
                fontSize={l.attrs.fontSize}
                fontWeight={700}
                fill={l.style.fill}
                transform={transform}
                className="animate-floaty"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {l.text}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

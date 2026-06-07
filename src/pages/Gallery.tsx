import { useEffect, useState } from 'react';
import { Heart, Sparkles, Copy, ThumbsUp } from 'lucide-react';
import Live2DAutoDemo from '@/components/live2d/Live2DAutoDemo';
import { SVG_TEMPLATES, LIVE2D_TEMPLATES } from '@/lib/templates';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MOCK_GALLERY = [
  { id: 'g1', title: '霓虹数据流', author: 'AniForge', tag: 'SVG · 数据可视化', likes: 248, type: 'svg' as const, templateId: 'pulse-logo' },
  { id: 'g2', title: '小玲的早晨', author: 'Ling Studio', tag: 'Live2D · VTuber', likes: 1024, type: 'live2d' as const, templateId: 'l2d-default' },
  { id: 'g3', title: '跳跳糖', author: 'pixel_p', tag: 'SVG · 物理', likes: 530, type: 'svg' as const, templateId: 'bouncing-balls' },
  { id: 'g4', title: 'AURORA 标题', author: 'motion.gfx', tag: 'SVG · 标题', likes: 312, type: 'svg' as const, templateId: 'text-reveal' },
  { id: 'g5', title: 'Solaris 公转', author: 'astro.lab', tag: 'SVG · 循环', likes: 805, type: 'svg' as const, templateId: 'orbit' },
  { id: 'g6', title: 'Mini 桌宠', author: 'cozybits', tag: 'Live2D · 桌宠', likes: 421, type: 'live2d' as const, templateId: 'l2d-mini' },
  { id: 'g7', title: 'Cyber Pulse', author: 'wave.run', tag: 'SVG · 标识', likes: 622, type: 'svg' as const, templateId: 'pulse-logo' },
  { id: 'g8', title: 'Stellar', author: 'nebula', tag: 'SVG · 循环', likes: 901, type: 'svg' as const, templateId: 'orbit' },
];

export default function Gallery() {
  const [filter, setFilter] = useState<'all' | 'svg' | 'live2d'>('all');
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const createSvgProject = useProjectStore((s) => s.createSvgProject);
  const createLive2DProject = useProjectStore((s) => s.createLive2DProject);
  const updateSvgData = useProjectStore((s) => s.updateSvgData);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  const onRemix = async (item: typeof MOCK_GALLERY[0]) => {
    if (item.type === 'svg') {
      const t = SVG_TEMPLATES.find((x) => x.id === item.templateId);
      if (!t) return;
      const p = await createSvgProject(t.name + ' (Remix)');
      updateSvgData(t.build().data);
      pushToast('success', '已复制为新项目');
      navigate(`/editor/svg/${p.id}`);
    } else {
      const t = LIVE2D_TEMPLATES.find((x) => x.id === item.templateId);
      if (!t) return;
      const p = await createLive2DProject(t.name + ' (Remix)');
      useProjectStore.setState({ current: { ...p, data: t.build() }, isDirty: true });
      pushToast('success', '已复制为新项目');
      navigate(`/editor/live2d/${p.id}`);
    }
  };

  const items = MOCK_GALLERY.filter((g) => filter === 'all' || g.type === filter);

  return (
    <div className="relative">
      <div className="grid-bg absolute inset-0 opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-[1480px] px-6 py-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-neon-cyan mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 社区画廊
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">由创作者们点亮的灵感</h1>
            <p className="mt-3 text-fog max-w-2xl">所有展示作品都可以「Remix 副本」带走,马上开始你自己的版本。</p>
          </div>
          <div className="flex bg-ink-700 rounded-lg border border-white/10 p-0.5">
            {[
              { k: 'all', label: '全部' },
              { k: 'svg', label: 'SVG' },
              { k: 'live2d', label: 'Live2D' },
            ].map((it) => (
              <button
                key={it.k}
                onClick={() => setFilter(it.k as any)}
                className={cn('h-9 px-4 rounded-md text-[13px] font-medium transition', filter === it.k ? 'bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-900' : 'text-fog hover:text-cream')}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
          {items.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              liked={!!likes[item.id]}
              onLike={() => setLikes((m) => ({ ...m, [item.id]: !m[item.id] }))}
              onRemix={() => onRemix(item)}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item, liked, onLike, onRemix, index }: any) {
  const isL2D = item.type === 'live2d';
  const tpl = isL2D
    ? (LIVE2D_TEMPLATES.find((x) => x.id === item.templateId) as { id: string; build: () => import('@/types').Live2DProjectData } | undefined)
    : (SVG_TEMPLATES.find((x) => x.id === item.templateId) as { id: string; build: () => { data: import('@/types').SvgProjectData; thumbnail: string } } | undefined);
  const l2dData: import('@/types').Live2DProjectData | undefined = isL2D && tpl ? (tpl as { build: () => import('@/types').Live2DProjectData }).build() : undefined;
  const thumb: string | undefined = !isL2D && tpl ? (tpl as { build: () => { thumbnail: string } }).build().thumbnail : undefined;
  return (
    <div className="mb-4 break-inside-avoid card-elevate glass border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="relative" style={{ aspectRatio: isL2D ? '5/6' : '16/9' }}>
        {isL2D ? (
          l2dData ? <Live2DAutoDemo data={l2dData} className="absolute inset-0" /> : null
        ) : tpl ? (
          <div className="absolute inset-0" style={{ background: thumb }}>
            <TemplateAnimationInline tplId={tpl.id} />
          </div>
        ) : null}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={cn('px-2 py-0.5 text-[10px] font-mono rounded-full border', isL2D ? 'border-ember/40 text-ember bg-ember/10' : 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10')}>
            {isL2D ? 'LIVE2D' : 'SVG'}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-[14px]">{item.title}</div>
            <div className="text-[10px] text-fog-dim font-mono mt-0.5">{item.tag} · {item.author}</div>
          </div>
          <button
            onClick={onLike}
            className={cn('flex items-center gap-1 text-[11px] font-mono transition', liked ? 'text-rose-300' : 'text-fog-dim hover:text-rose-300')}
          >
            <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
            {item.likes + (liked ? 1 : 0)}
          </button>
        </div>
        <button
          onClick={onRemix}
          className="btn-press mt-3 w-full h-8 rounded-md bg-white/5 hover:bg-white/10 text-[12px] text-fog hover:text-cream transition flex items-center justify-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" /> Remix 副本
        </button>
      </div>
    </div>
  );
}

function TemplateAnimationInline({ tplId }: { tplId: string }) {
  if (tplId === 'pulse-logo') {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 220 130" className="w-2/3">
          <circle cx="60" cy="65" r="34" fill="#7CF9FF" className="origin-center animate-breathe" />
          <text x="115" y="74" fontSize="22" fontWeight={700} fill="#F5F5F7" fontFamily="Space Grotesk">AURORA</text>
        </svg>
      </div>
    );
  }
  if (tplId === 'bouncing-balls') {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 220 130" className="w-2/3">
          <circle cx="40" cy="80" r="12" fill="#7CF9FF" className="animate-bounce" />
          <circle cx="80" cy="80" r="12" fill="#FF6A3D" className="animate-bounce" style={{ animationDelay: '0.15s' }} />
          <circle cx="120" cy="80" r="12" fill="#B47CFF" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
        </svg>
      </div>
    );
  }
  if (tplId === 'text-reveal') {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 220 130" className="w-2/3">
          {['S', 'T', 'A', 'R'].map((c, i) => (
            <text key={c} x={50 + i * 40} y={80} fontSize={36} fontWeight={700} fill={i % 2 ? '#FF6A3D' : '#7CF9FF'} fontFamily="Space Grotesk" className="animate-floaty" style={{ animationDelay: `${i * 0.1}s` }}>{c}</text>
          ))}
        </svg>
      </div>
    );
  }
  if (tplId === 'orbit') {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 220 130" className="w-2/3">
          <g style={{ transformOrigin: '110px 65px', animation: 'headSway 6s linear infinite' }}>
            <circle cx="110" cy="65" r="6" fill="#7CF9FF" />
            {[0, 1, 2, 3, 4].map((i) => {
              const a = (i / 5) * Math.PI * 2;
              return <circle key={i} cx={110 + Math.cos(a) * 40} cy={65 + Math.sin(a) * 40} r="6" fill={i % 2 ? '#FF6A3D' : '#B47CFF'} />;
            })}
          </g>
        </svg>
      </div>
    );
  }
  return null;
}

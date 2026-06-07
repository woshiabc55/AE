import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Copy,
  Clock,
  ChevronRight,
  WandSparkles,
  MousePointerClick,
  Layers3,
  Sliders,
  Cuboid,
} from 'lucide-react';
import Live2DAutoDemo from '@/components/live2d/Live2DAutoDemo';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { SVG_TEMPLATES, LIVE2D_TEMPLATES } from '@/lib/templates';
import { createDefaultCharacter } from '@/engine/live2d';
import { cn, formatTime } from '@/lib/utils';
import type { Project } from '@/types';

export default function Home() {
  const projects = useProjectStore((s) => s.projects);
  const createSvgProject = useProjectStore((s) => s.createSvgProject);
  const createLive2DProject = useProjectStore((s) => s.createLive2DProject);
  const removeProject = useProjectStore((s) => s.removeProject);
  const duplicateProject = useProjectStore((s) => s.duplicateProject);
  const openProject = useProjectStore((s) => s.openProject);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  const demoCharacter = useMemo(() => createDefaultCharacter({ width: 600, height: 720 }), []);

  const onNewSvg = async () => {
    const p = await createSvgProject();
    pushToast('success', '已创建新的 SVG 动画项目');
    navigate(`/editor/svg/${p.id}`);
  };
  const onNewLive2D = async () => {
    const p = await createLive2DProject();
    // 立即填充默认角色
    p.data = demoCharacter;
    useProjectStore.getState().saveCurrent();
    pushToast('success', '已创建新的 Live2D 角色');
    navigate(`/editor/live2d/${p.id}`);
  };

  return (
    <div className="relative">
      <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />

      {/* Hero */}
      <section className="relative mx-auto max-w-[1480px] px-6 pt-12 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-fog mb-6"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ember animate-pulseGlow" />
              v0.1 · 公开测试 · 浏览器即用
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
            >
              一站式 <span className="gradient-text">SVG 动画</span>
              <br />与 <span className="gradient-text">Live2D 角色</span>创作平台
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 max-w-2xl text-fog text-base md:text-lg leading-relaxed"
            >
              AniForge 把 After-Effects 级时间线、关键帧缓动和 Cubism 风格的网格形变、参数绑定都搬进了浏览器。
              零安装、零配置,导出的 SVG、CSS、HTML 即可上线,Live2D 兼容 JSON 直接对接创作管线。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={onNewSvg}
                className="btn-press group inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-900 font-semibold tracking-wide shadow-glow hover:shadow-[0_0_40px_rgba(124,249,255,0.5)] transition"
              >
                <Plus className="w-4.5 h-4.5" />
                新建 SVG 动画
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onNewLive2D}
                className="btn-press group inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-cream font-semibold tracking-wide hover:bg-white/10 transition"
              >
                <Cuboid className="w-4.5 h-4.5 text-ember" />
                新建 Live2D 角色
              </button>
              <Link
                to="/templates"
                className="btn-press inline-flex items-center gap-2 h-12 px-4 rounded-xl text-fog hover:text-cream transition"
              >
                <LibraryIcon className="w-4.5 h-4.5" />
                浏览模板
              </Link>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-2xl">
              <Stat icon={Layers3} title="时间线 & 关键帧" subtitle="多轨编辑" />
              <Stat icon={Sliders} title="网格形变 Mesh" subtitle="顶点拖拽" />
              <Stat icon={MousePointerClick} title="点击/滑动触发" subtitle="动作绑定" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[5/6] max-w-[520px] mx-auto">
              <div className="absolute -inset-8 -z-10 rounded-[48px] bg-mesh-glow blur-2xl opacity-90" />
              <div className="absolute inset-0 rounded-[32px] glass border border-white/10 overflow-hidden">
                <div className="absolute top-3 left-3 right-3 flex items-center gap-2 text-[10px] font-mono text-fog-dim">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                  LIVE PREVIEW · Idle + Blink
                  <span className="flex-1" />
                  <span>60fps</span>
                </div>
                <Live2DAutoDemo data={demoCharacter} className="absolute inset-0 mt-7" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-fog-dim">
                  <span>param:AngleX  · AngleY  · Breath</span>
                  <span>AniForge Engine</span>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-28 h-28 rounded-2xl glass border border-white/10 grid place-items-center text-center">
                <div>
                  <div className="text-[10px] font-mono text-fog-dim">v0.1</div>
                  <div className="font-display text-2xl gradient-text font-bold">STUDIO</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 工作流 */}
      <section className="relative mx-auto max-w-[1480px] px-6 py-10">
        <SectionHeader title="工作流" subtitle="从草图到上线,四步走" />
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            { icon: Wand2, title: '1. 草图', desc: '在画布拖入图形 / 部件,或从模板开始' },
            { icon: Sliders, title: '2. 绑定', desc: '把参数拖到部件,形成 Live2D 风格形变' },
            { icon: PlayCircle, title: '3. 编排', desc: '多轨时间线 + 缓动 + 触发,实时预览' },
            { icon: Sparkles, title: '4. 导出', desc: 'SVG / HTML / Cubism JSON / GIF 一键出包' },
          ].map((s) => (
            <div key={s.title} className="card-elevate glass rounded-2xl p-5 border border-white/[0.06]">
              <s.icon className="w-5 h-5 text-neon-cyan" />
              <div className="mt-3 font-display text-base font-semibold">{s.title}</div>
              <div className="mt-1.5 text-[13px] text-fog leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 本地项目 */}
      <section className="relative mx-auto max-w-[1480px] px-6 py-10">
        <SectionHeader
          title="我的项目"
          subtitle="自动保存到本地 IndexedDB · 0KB 上传"
          right={
            <div className="flex gap-2">
              <button
                onClick={onNewSvg}
                className="btn-press h-9 px-3.5 rounded-lg bg-white/5 border border-white/10 text-sm flex items-center gap-2 hover:bg-white/10 transition"
              >
                <Plus className="w-4 h-4" /> SVG
              </button>
              <button
                onClick={onNewLive2D}
                className="btn-press h-9 px-3.5 rounded-lg bg-ember/15 border border-ember/30 text-sm text-ember flex items-center gap-2 hover:bg-ember/25 transition"
              >
                <Plus className="w-4 h-4" /> Live2D
              </button>
            </div>
          }
        />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.length === 0 && <EmptyProjects onSvg={onNewSvg} onLive2D={onNewLive2D} />}
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={async () => {
                await openProject(p.id);
                navigate(p.type === 'svg' ? `/editor/svg/${p.id}` : `/editor/live2d/${p.id}`);
              }}
              onDelete={async () => {
                await removeProject(p.id);
                pushToast('info', '项目已删除');
              }}
              onDuplicate={async () => {
                const copy = await duplicateProject(p.id);
                if (copy) pushToast('success', '已复制');
              }}
            />
          ))}
        </div>
      </section>

      {/* 模板精选 */}
      <section className="relative mx-auto max-w-[1480px] px-6 py-10">
        <SectionHeader
          title="模板精选"
          subtitle="挑一个,改一改,就是你的"
          right={
            <Link to="/templates" className="text-sm text-fog hover:text-cream transition flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SVG_TEMPLATES.slice(0, 4).map((t) => (
            <Link
              key={t.id}
              to="/templates"
              className="card-elevate glass border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              <div className="aspect-video relative" style={{ background: t.build().thumbnail }}>
                <div className="absolute inset-0 grid place-items-center">
                  <MiniAnimationSvg templateId={t.id} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold">{t.name}</div>
                  <span className="text-[10px] font-mono text-fog-dim">{formatTime(t.duration)}</span>
                </div>
                <div className="text-[12px] text-fog mt-1 line-clamp-2">{t.description}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {LIVE2D_TEMPLATES.map((t) => (
            <Link
              key={t.id}
              to="/templates"
              className="card-elevate glass border border-white/[0.06] rounded-2xl overflow-hidden flex"
            >
              <div className="w-40 shrink-0 relative bg-mesh-glow">
                <Live2DAutoDemo data={t.build()} className="absolute inset-0" />
              </div>
              <div className="p-4 flex-1">
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-[12px] text-fog mt-1.5 leading-relaxed">{t.description}</div>
                <div className="mt-3 text-[11px] font-mono text-fog-dim flex items-center gap-1.5">
                  <WandSparkles className="w-3 h-3 text-neon-cyan" /> 含 1 角色 + 3 动作
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-[1480px] px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 p-10">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-neon-cyan/15 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-ember/15 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">把你的下一段动画<br />交给浏览器。</h2>
              <p className="mt-3 text-fog">无论你是设计师、工程师,还是虚拟主播,AniForge 都能让你的灵感 60 秒上线。</p>
            </div>
            <div className="flex md:justify-end gap-3">
              <button
                onClick={onNewSvg}
                className="btn-press h-12 px-5 rounded-xl bg-cream text-ink-900 font-semibold hover:bg-white transition"
              >
                立即开始
              </button>
              <Link
                to="/gallery"
                className="btn-press h-12 px-5 rounded-xl border border-white/15 text-cream font-semibold hover:bg-white/5 transition inline-flex items-center gap-2"
              >
                看看作品 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-fog text-sm mt-1.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function Stat({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="glass rounded-xl border border-white/[0.06] p-3.5 flex items-center gap-3">
      <div className="w-9 h-9 grid place-items-center rounded-lg bg-white/5 text-neon-cyan">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-[11px] text-fog-dim font-mono">{subtitle}</div>
      </div>
    </div>
  );
}

function EmptyProjects({ onSvg, onLive2D }: { onSvg: () => void; onLive2D: () => void }) {
  return (
    <div className="col-span-full glass border border-dashed border-white/10 rounded-2xl p-10 text-center">
      <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-white/5 mb-4">
        <Sparkles className="w-6 h-6 text-neon-cyan" />
      </div>
      <div className="font-display text-lg">还没有项目,创建你的第一个作品</div>
      <div className="text-fog text-sm mt-1.5">所有内容自动保存在本地,不会上传任何数据</div>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={onSvg} className="btn-press h-10 px-4 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-900 font-semibold">
          新建 SVG 动画
        </button>
        <button onClick={onLive2D} className="btn-press h-10 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold">
          新建 Live2D 角色
        </button>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
  onDuplicate,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'card-elevate group relative glass border border-white/[0.06] rounded-2xl overflow-hidden',
      )}
    >
      <button onClick={onOpen} className="block w-full text-left">
        <div className="aspect-video relative overflow-hidden">
          {project.thumbnail ? (
            <img src={project.thumbnail} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <ProjectThumbnail type={project.type} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'px-2 py-0.5 text-[10px] font-mono rounded-full border',
                project.type === 'svg'
                  ? 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5'
                  : 'border-ember/40 text-ember bg-ember/5',
              )}
            >
              {project.type === 'svg' ? 'SVG' : 'LIVE2D'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="font-display font-semibold truncate">{project.name}</div>
          <div className="text-[11px] font-mono text-fog-dim mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> 更新于 {timeAgo(project.updatedAt)}
          </div>
        </div>
      </button>
      <div
        className={cn(
          'absolute top-3 right-3 flex items-center gap-1 transition',
          hover ? 'opacity-100' : 'opacity-0',
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="w-7 h-7 grid place-items-center rounded-md bg-black/40 backdrop-blur text-fog hover:text-cream transition"
          title="复制"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-7 h-7 grid place-items-center rounded-md bg-black/40 backdrop-blur text-fog hover:text-rose-300 transition"
          title="删除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ProjectThumbnail({ type }: { type: 'svg' | 'live2d' }) {
  if (type === 'svg') {
    return (
      <div className="absolute inset-0 grid place-items-center" style={{ background: 'linear-gradient(120deg,#1F1F2A,#0B0B12)' }}>
        <svg viewBox="0 0 200 120" className="w-3/4">
          <circle cx="60" cy="60" r="28" fill="#7CF9FF" className="animate-floaty" />
          <rect x="120" y="40" width="40" height="40" rx="8" fill="#FF6A3D" className="animate-floaty" style={{ animationDelay: '0.4s' }} />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: 'radial-gradient(circle at 50% 50%, #1F1F2A, #0B0B12 70%)' }}>
      <svg viewBox="0 0 80 100" className="w-1/2">
        <circle cx="40" cy="35" r="22" fill="#FFE0CC" stroke="#FFB4A0" />
        <ellipse cx="32" cy="34" rx="3" ry="4" fill="#0B0B12" />
        <ellipse cx="48" cy="34" rx="3" ry="4" fill="#0B0B12" />
        <path d="M30 46 Q40 50 50 46" stroke="#FF6A3D" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="22" y="58" width="36" height="36" rx="6" fill="#2A2A38" />
      </svg>
    </div>
  );
}

function MiniAnimationSvg({ templateId }: { templateId: string }) {
  if (templateId === 'pulse-logo') {
    return (
      <svg viewBox="0 0 220 130" className="w-2/3">
        <circle cx="60" cy="65" r="34" fill="#7CF9FF" className="origin-center animate-breathe" />
        <circle cx="60" cy="65" r="50" fill="none" stroke="#7CF9FF" strokeWidth="1.5" className="origin-center animate-pulseGlow" />
        <text x="115" y="74" fontSize="22" fontWeight={700} fill="#F5F5F7" fontFamily="Space Grotesk">Ani</text>
      </svg>
    );
  }
  if (templateId === 'bouncing-balls') {
    return (
      <svg viewBox="0 0 220 130" className="w-2/3">
        <circle cx="40" cy="80" r="12" fill="#7CF9FF" className="animate-bounce" style={{ animationDelay: '0s' }} />
        <circle cx="80" cy="80" r="12" fill="#FF6A3D" className="animate-bounce" style={{ animationDelay: '0.15s' }} />
        <circle cx="120" cy="80" r="12" fill="#B47CFF" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
        <line x1="10" y1="100" x2="210" y2="100" stroke="#1F1F2A" strokeWidth="1" />
      </svg>
    );
  }
  if (templateId === 'text-reveal') {
    return (
      <svg viewBox="0 0 220 130" className="w-2/3">
        {['A', 'N', 'I', 'F'].map((c, i) => (
          <text
            key={c}
            x={30 + i * 40}
            y={80}
            fontSize={36}
            fontWeight={700}
            fill={i % 2 ? '#FF6A3D' : '#7CF9FF'}
            fontFamily="Space Grotesk"
            className="animate-floaty"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {c}
          </text>
        ))}
      </svg>
    );
  }
  if (templateId === 'orbit') {
    return (
      <svg viewBox="0 0 220 130" className="w-2/3">
        <g style={{ transformOrigin: '110px 65px', animation: 'headSway 6s linear infinite' }}>
          <circle cx="110" cy="65" r="6" fill="#7CF9FF" />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return <circle key={i} cx={110 + Math.cos(a) * 40} cy={65 + Math.sin(a) * 40} r="6" fill={i % 2 ? '#FF6A3D' : '#B47CFF'} />;
          })}
        </g>
      </svg>
    );
  }
  return null;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  return `${d} 天前`;
}

function LibraryIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Users, Clock, Play, Copy, Heart, Share2, Sparkles } from 'lucide-react';
import { templatesApi } from '@/api/templates';
import { categories } from '@/mock/categories';
import { useScriptStore } from '@/stores/scriptStore';
import { useUIStore } from '@/stores/uiStore';
import { formatNumber, formatDate } from '@/utils/format';
import { renderPromptText } from '@/utils/promptRenderer';
import type { Template, SceneType } from '@/types';

const sceneTypeBadge: Record<SceneType, { label: string; color: string }> = {
  opening: { label: '开场', color: 'text-moss border-moss/40' },
  conflict: { label: '冲突', color: 'text-wine border-wine/40' },
  climax: { label: '高潮', color: 'text-gold-500 border-gold-500/40' },
  ending: { label: '结局', color: 'text-cream-100 border-cream-100/30' },
  custom: { label: '自定义', color: 'text-cream-200/50 border-ink-500' },
};

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const createFromTemplate = useScriptStore((s) => s.createFromTemplate);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    if (!id) return;
    templatesApi.byId(id).then((t) => setTemplate(t || null));
  }, [id]);

  if (!template) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-cream-200/40">加载中...</p>
      </div>
    );
  }

  const category = categories.find((c) => c.id === template.category);
  const [c1, c2, c3] = template.coverGradient;
  const sampleVars: Record<string, string> = {};
  template.variables.forEach((v) => {
    sampleVars[v.key] = v.defaultValue;
  });

  const handleUse = () => {
    const newId = createFromTemplate(template.id, template.title, template.scenes, template.variables);
    showToast('已创建剧本，正在打开编辑器');
    navigate(`/editor/${newId}`);
  };

  return (
    <div>
      {/* Cinematic Cover */}
      <div
        className="relative aspect-[2.35/1] w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2} 50%, ${c3})` }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-12">
          <Link
            to="/templates"
            className="absolute left-6 top-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cream-100/70 hover:text-gold-500"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            <span>返回广场</span>
          </Link>
          {category && (
            <div className="mb-4 inline-flex w-fit items-center gap-2 border border-gold-500/40 bg-ink-900/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500 backdrop-blur">
              {category.name}
            </div>
          )}
          <h1 className="font-display text-5xl font-bold text-cream-50 sm:text-6xl lg:text-7xl">
            {template.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-cream-200/80">{template.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-cream-200/60">
            <span className="flex items-center gap-1.5">
              BY · <span className="text-cream-100">{template.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={12} className="fill-gold-500 text-gold-500" />
              <span className="text-gold-500">{template.rating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} strokeWidth={1.5} />
              <span>{formatNumber(template.usageCount)} 次使用</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={1.5} />
              <span>更新于 {formatDate(template.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-14 z-40 border-b border-gold-500/20 bg-ink-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => showToast('已加入收藏', 'info')}>
              <Heart size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">收藏</span>
            </button>
            <button className="btn-ghost" onClick={() => showToast('链接已复制', 'info')}>
              <Share2 size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">分享</span>
            </button>
            <button className="btn-primary" onClick={handleUse}>
              <Play size={14} strokeWidth={2} />
              立即使用
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                · 分镜结构
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-cream-50">
                剧本骨架 · {template.scenes.length} 个场景
              </h2>
            </div>

            <div className="space-y-4">
              {template.scenes.map((scene, idx) => {
                const badge = sceneTypeBadge[scene.type];
                return (
                  <div key={scene.id} className="card p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-ink-600 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="scene-badge">{String(scene.order).padStart(2, '0')}</div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-cream-50">
                            {scene.title}
                          </h3>
                          <span className={`mt-1 inline-block border bg-ink-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      {scene.duration ? (
                        <div className="text-right">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">
                            预估时长
                          </p>
                          <p className="font-mono text-sm text-gold-500">
                            {scene.duration < 60
                              ? `${scene.duration}s`
                              : `${Math.round(scene.duration / 60)}min`}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="rounded-none border border-ink-600 bg-ink-800/40 p-4 font-mono text-sm leading-relaxed text-cream-200/90">
                      {scene.prompt.split('\n').map((line, i) => (
                        <p key={i} className="min-h-[1.5em]">
                          {line || '\u00a0'}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Variables */}
              <div className="card p-5">
                <div className="mb-4 flex items-center justify-between border-b border-ink-600 pb-3">
                  <h3 className="font-display text-lg font-bold text-cream-50">变量定义</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">
                    {template.variables.length} 个
                  </span>
                </div>
                <div className="space-y-3">
                  {template.variables.map((v) => (
                    <div key={v.key}>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gold-500">
                        {`{{${v.key}}}`}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-cream-100">{v.label}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-cream-200/50">
                        默认：{v.defaultValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample output */}
              <div className="card p-5">
                <div className="mb-3 flex items-center justify-between border-b border-ink-600 pb-3">
                  <h3 className="font-display text-lg font-bold text-cream-50">示例输出</h3>
                  <Sparkles size={14} className="text-gold-500" />
                </div>
                <div className="max-h-80 overflow-y-auto rounded-none border border-ink-600 bg-ink-900 p-3 font-mono text-xs leading-relaxed text-cream-200/80">
                  {template.scenes.map((scene) => (
                    <div key={scene.id} className="mb-3 last:mb-0">
                      <p className="mb-1 text-gold-500">## {scene.title}</p>
                      <p className="whitespace-pre-wrap">{renderPromptText(scene.prompt, sampleVars)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card flex items-center justify-center gap-2 p-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      template.scenes.map((s) => renderPromptText(s.prompt, sampleVars)).join('\n\n')
                    );
                    showToast('已复制示例提示词');
                  }}
                  className="btn-ghost"
                >
                  <Copy size={14} strokeWidth={1.5} />
                  复制示例
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

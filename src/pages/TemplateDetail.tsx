// 模板详情
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, BookmarkCheck, Copy, Share2, Sparkles, Clock, User as UserIcon, Play, ChevronRight, GitBranch, Download, History, Check } from 'lucide-react';
import { CoverArt, CategoryTag, Button, Badge, CopyButton, TabBar } from '../components/ui';
import { TemplateService } from '../services/template';
import { useApp } from '../store/useApp';
import { extractVariableKeys, formatDate, renderTemplate, estimateTokens } from '../lib/utils';
import { CATEGORIES } from '../data/templates.seed';
import type { Template, Variable } from '../types';
import { cn } from '../lib/utils';

function PreviewBody({ body, values }: { body: string; values: Record<string, string> }) {
  const parts = body.split(/(\{\{[^}]+\}\})/g);
  return (
    <div className="text-[14px] leading-[1.85] text-[var(--paper-1)] whitespace-pre-wrap font-mono">
      {parts.map((p, i) => {
        const m = p.match(/^\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}$/);
        if (m) {
          const key = m[1];
          const v = values[key];
          return (
            <span key={i} className={cn('variable-text', !v && 'is-empty opacity-60')}>
              {v || key}
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </div>
  );
}

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [tpl, setTpl] = useState<Template | null>(null);
  const [tab, setTab] = useState<'preview' | 'examples' | 'versions' | 'variables'>('preview');
  const [values, setValues] = useState<Record<string, string>>({});
  const { favorites, toggleFavorite, pushToast, user } = useApp();

  useEffect(() => {
    if (!id) return;
    TemplateService.get(id).then((t) => {
      setTpl(t);
      if (t && t.examples[0]) setValues({ ...t.examples[0].values });
      else if (t) setValues(Object.fromEntries(t.variables.map((v) => [v.key, v.defaultValue ?? ''])));
    });
  }, [id]);

  if (!tpl) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-32 bg-[var(--ink-3)] rounded" />
          <div className="h-12 w-2/3 bg-[var(--ink-3)] rounded" />
          <div className="h-40 bg-[var(--ink-3)] rounded" />
        </div>
      </div>
    );
  }

  const isFav = favorites.has(tpl.id);
  const catLabel = CATEGORIES.find((c) => c.key === tpl.category)?.label ?? tpl.category;
  const rendered = renderTemplate(tpl.body, values);

  const handleCopy = () => {
    navigator.clipboard.writeText(rendered);
    pushToast({ kind: 'success', message: '已复制到剪贴板' });
  };

  const handleFork = async () => {
    if (!user) {
      pushToast({ kind: 'warn', message: '请先登录后再 Fork' });
      nav('/login');
      return;
    }
    const t = await TemplateService.fork(tpl.id, user.id, user.name);
    pushToast({ kind: 'success', message: '已 Fork 到我的剧库' });
    nav(`/editor/${t.id}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--paper-3)] hover:text-[var(--paper-1)] mb-6 mono"
      >
        <ArrowLeft size={13} /> 返回
      </button>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* 左：封面 + 详情 */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-4">
            <CategoryTag category={tpl.category} />
            {tpl.tags.map((tg) => (
              <Badge key={tg} variant="default">{tg}</Badge>
            ))}
          </div>
          <h1 className="display text-4xl lg:text-5xl text-[var(--paper-0)] mb-4 leading-tight">{tpl.title}</h1>
          <p className="text-[15px] text-[var(--paper-2)] leading-relaxed mb-6 max-w-2xl">{tpl.description}</p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button size="lg" variant="primary" icon={<Play size={16} fill="currentColor" />} onClick={() => nav(`/workshop/${tpl.id}`)}>
              立即使用
            </Button>
            <Button size="lg" variant="secondary" icon={<GitBranch size={15} />} onClick={handleFork}>
              Fork 到剧库
            </Button>
            <Button
              size="lg"
              variant={isFav ? 'outline-amber' : 'secondary'}
              icon={isFav ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              onClick={() => toggleFavorite(tpl.id)}
            >
              {isFav ? '已收藏' : '收藏'}
            </Button>
            <Button size="lg" variant="ghost" icon={<Share2 size={15} />} onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              pushToast({ kind: 'success', message: '链接已复制' });
            }}>分享</Button>
          </div>

          <CoverArt seed={tpl.cover} category={tpl.category} size="xl" className="mb-8 !aspect-[16/8]" />

          {/* Tab */}
          <div className="mt-6">
            <TabBar
              value={tab}
              onChange={(v) => setTab(v)}
              tabs={[
                { value: 'preview', label: '剧本预览' },
                { value: 'variables', label: `变量 (${tpl.variables.length})` },
                { value: 'examples', label: `示例 (${tpl.examples.length})` },
                { value: 'versions', label: `版本 (${tpl.versions.length})` },
              ]}
            />
            <div className="mt-6">
              {tab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-6"
                >
                  <PreviewBody body={tpl.body} values={values} />
                </motion.div>
              )}

              {tab === 'variables' && (
                <motion.div
                  key="variables"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {tpl.variables.map((v) => (
                    <div key={v.key} className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="variable-text !text-[12px]">{`{{${v.key}}}`}</span>
                            <span className="text-[13px] text-[var(--paper-0)]">{v.label}</span>
                            {v.required && <Badge variant="vermilion">必填</Badge>}
                          </div>
                          {v.hint && <p className="text-[12px] text-[var(--paper-3)] mt-1">{v.hint}</p>}
                        </div>
                        <span className="tag shrink-0">{v.type}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {tab === 'examples' && (
                <motion.div
                  key="examples"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  {tpl.examples.map((ex) => (
                    <div key={ex.id} className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="display text-[15px] text-[var(--paper-0)]">{ex.name}</h4>
                        <button
                          onClick={() => { setValues({ ...ex.values }); pushToast({ kind: 'info', message: `已套用：${ex.name}` }); }}
                          className="text-[11px] text-[var(--amber-1)] mono hover:underline"
                        >
                          套用此例 →
                        </button>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(ex.values).map(([k, v]) => (
                          <div key={k} className="text-[12px] flex gap-2">
                            <span className="variable-text shrink-0">{`{{${k}}}`}</span>
                            <span className="text-[var(--paper-2)] truncate">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {tab === 'versions' && (
                <motion.div
                  key="versions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {[...tpl.versions].reverse().map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3 rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-4">
                      <History size={14} className="text-[var(--amber-2)] shrink-0" />
                      <div className="flex-1">
                        <div className="text-[13px] text-[var(--paper-0)]">{v.snapshot || `版本 ${tpl.versions.length - i}`}</div>
                        <div className="text-[11px] text-[var(--paper-3)] mono mt-0.5">{formatDate(v.createdAt)}</div>
                      </div>
                      {i === 0 && <Badge variant="amber">当前</Badge>}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* 右：作者 + 操作 */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--amber-1)] to-[var(--amber-3)] flex items-center justify-center text-[var(--ink-0)] text-[14px] font-bold">
                {tpl.author.name.slice(0, 1)}
              </div>
              <div>
                <div className="text-[14px] text-[var(--paper-0)] font-medium">{tpl.author.name}</div>
                <div className="text-[11px] text-[var(--paper-3)]">剧幕认证创作者</div>
              </div>
            </div>
            <div className="hairline" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mono text-lg text-[var(--paper-0)] tabular-nums">{tpl.stats.uses}</div>
                <div className="text-[10px] text-[var(--paper-3)] tracking-wider uppercase">累计调用</div>
              </div>
              <div>
                <div className="mono text-lg text-[var(--paper-0)] tabular-nums">{tpl.stats.favorites}</div>
                <div className="text-[10px] text-[var(--paper-3)] tracking-wider uppercase">收藏</div>
              </div>
            </div>
            <div className="hairline" />
            <div className="space-y-2 text-[12px] text-[var(--paper-2)]">
              <div className="flex items-center gap-2"><Clock size={12} className="text-[var(--paper-3)]" /> 更新于 {formatDate(tpl.updatedAt)}</div>
              <div className="flex items-center gap-2"><UserIcon size={12} className="text-[var(--paper-3)]" /> 公开 · 全员可见</div>
            </div>
          </div>

          <div className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-5 space-y-3">
            <div className="text-[12px] text-[var(--paper-2)] flex items-center justify-between">
              <span>渲染后 token 数</span>
              <span className="mono text-[var(--amber-1)]">{estimateTokens(rendered)}</span>
            </div>
            <div className="text-[12px] text-[var(--paper-2)] flex items-center justify-between">
              <span>未填变量</span>
              <span className="mono text-[var(--paper-3)]">
                {extractVariableKeys(rendered).length}
              </span>
            </div>
          </div>

          <div className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-5">
            <h4 className="eyebrow mb-3">使用说明</h4>
            <ol className="space-y-2 text-[12px] text-[var(--paper-2)] list-decimal list-inside">
              <li>点击"立即使用"进入变量工坊</li>
              <li>在左侧表单填写所有变量</li>
              <li>右侧实时预览最终提示词</li>
              <li>点击"复制"粘贴到任意 AI 工具</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// 变量工坊 - 填变量 + 实时预览
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Save, RefreshCw, ArrowRight, History, Check, BookOpen, Wand2 } from 'lucide-react';
import { Button, Input, Textarea, Select, CategoryTag, Badge, CoverArt, CopyButton } from '../components/ui';
import { TemplateService } from '../services/template';
import { useApp } from '../store/useApp';
import { estimateTokens, renderTemplate, extractVariableKeys, formatRelative } from '../lib/utils';
import type { Template, Variable } from '../types';
import { cn } from '../lib/utils';

function FormField({ v, value, onChange }: { v: Variable; value: string; onChange: (v: string) => void }) {
  if (v.type === 'textarea') {
    return (
      <Textarea
        label={v.label}
        hint={v.hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        showCount
        maxLength={500}
        rows={3}
      />
    );
  }
  if (v.type === 'enum') {
    return (
      <Select
        label={v.label}
        value={value}
        onChange={onChange}
        options={(v.options ?? []).map((o) => ({ value: o, label: o }))}
      />
    );
  }
  if (v.type === 'number') {
    return <Input label={v.label} hint={v.hint} type="number" value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return <Input label={v.label} hint={v.hint} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export default function Workshop() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user, pushToast } = useApp();
  const [tpl, setTpl] = useState<Template | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('全部');

  useEffect(() => {
    if (!id) return;
    TemplateService.get(id).then((t) => {
      setTpl(t);
      if (t) {
        setValues(Object.fromEntries(t.variables.map((v) => [v.key, v.defaultValue ?? ''])));
        if (t.examples[0]) setValues(t.examples[0].values);
      }
    });
  }, [id]);

  const rendered = useMemo(() => (tpl ? renderTemplate(tpl.body, values) : ''), [tpl, values]);
  const tokens = useMemo(() => estimateTokens(rendered), [rendered]);
  const missingKeys = useMemo(() => extractVariableKeys(rendered), [rendered]);
  const groups = useMemo(() => {
    if (!tpl) return ['全部'];
    const set = new Set<string>(['全部']);
    tpl.variables.forEach((v) => { if (v.group) set.add(v.group); });
    return [...set];
  }, [tpl]);
  const visibleVars = useMemo(() => {
    if (!tpl) return [];
    if (activeGroup === '全部') return tpl.variables;
    return tpl.variables.filter((v) => v.group === activeGroup);
  }, [tpl, activeGroup]);

  // 自动保存草稿
  useEffect(() => {
    if (!tpl) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(`ps_draft_${tpl.id}`, JSON.stringify(values));
        setSavedAt(new Date());
      } catch { /* ignore */ }
    }, 600);
    return () => clearTimeout(t);
  }, [values, tpl]);

  useEffect(() => {
    if (!tpl) return;
    try {
      const raw = localStorage.getItem(`ps_draft_${tpl.id}`);
      if (raw) {
        const draft = JSON.parse(raw) as Record<string, string>;
        setValues((prev) => ({ ...prev, ...draft }));
      }
    } catch { /* ignore */ }
  }, [tpl?.id]);

  if (!tpl) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-32 bg-[var(--ink-3)] rounded" />
          <div className="h-12 w-2/3 bg-[var(--ink-3)] rounded" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-96 bg-[var(--ink-3)] rounded" />
            <div className="h-96 bg-[var(--ink-3)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-8">
      <button
        onClick={() => nav(`/gallery/${tpl.id}`)}
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--paper-3)] hover:text-[var(--paper-1)] mb-4 mono"
      >
        <ArrowLeft size={13} /> 返回模板详情
      </button>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* 左：变量表单 */}
        <div className="lg:col-span-5">
          <div className="rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--ink-4)] flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CategoryTag category={tpl.category} />
                  <span className="text-[10px] text-[var(--paper-3)] mono">v{tpl.versions.length}</span>
                </div>
                <h2 className="display text-xl text-[var(--paper-0)]">{tpl.title}</h2>
              </div>
            </div>

            {/* 状态条 */}
            <div className="px-5 py-2.5 border-b border-[var(--ink-4)] flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-[var(--paper-3)]">
                {savedAt ? (
                  <>
                    <Check size={12} className="text-[var(--jade)]" />
                    <span>已自动保存 · {formatRelative(savedAt.toISOString())}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={12} className="animate-spin-slow" />
                    <span>等待编辑...</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {missingKeys.length > 0 && (
                  <span className="text-[var(--vermilion)] mono">{missingKeys.length} 个未填</span>
                )}
                <span className="text-[var(--paper-3)] mono">{tokens} tokens</span>
              </div>
            </div>

            {/* 分组标签 */}
            {groups.length > 1 && (
              <div className="px-5 pt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {groups.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={cn(
                      'h-7 px-3 text-[11px] rounded-[999px] border transition-colors whitespace-nowrap',
                      activeGroup === g
                        ? 'bg-[rgba(232,177,74,0.12)] border-[var(--amber-2)] text-[var(--amber-1)]'
                        : 'border-[var(--ink-4)] text-[var(--paper-2)] hover:border-[var(--ink-5)]'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {/* 变量表单 */}
            <div className="p-5 space-y-4 max-h-[calc(100vh-340px)] overflow-y-auto">
              {visibleVars.map((v) => {
                const isMissing = !values[v.key]?.trim();
                return (
                  <motion.div
                    key={v.key}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'rounded-[8px] p-3 -m-3',
                      isMissing && v.required && 'bg-[var(--vermilion-soft)]'
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="variable-text !text-[11px] !py-0.5">{`{{${v.key}}}`}</span>
                      {v.required && <Badge variant="vermilion">必填</Badge>}
                    </div>
                    <FormField
                      v={v}
                      value={values[v.key] ?? ''}
                      onChange={(val) => setValues((prev) => ({ ...prev, [v.key]: val }))}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* 底部示例 */}
            {tpl.examples.length > 0 && (
              <div className="px-5 py-3 border-t border-[var(--ink-4)] flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] text-[var(--paper-3)] shrink-0">套用示例：</span>
                {tpl.examples.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setValues({ ...ex.values });
                      pushToast({ kind: 'info', message: `已套用：${ex.name}` });
                    }}
                    className="shrink-0 h-7 px-3 text-[11px] rounded-[999px] border border-[var(--ink-4)] text-[var(--paper-2)] hover:border-[var(--amber-2)] hover:text-[var(--amber-1)] transition-colors"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右：实时预览 */}
        <div className="lg:col-span-7">
          <div className="sticky top-20">
            <div className="rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--ink-4)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wand2 size={14} className="text-[var(--amber-2)]" />
                  <span className="text-[12px] text-[var(--paper-1)] font-medium">实时预览</span>
                  <span className="text-[10px] text-[var(--paper-3)] mono">· LIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={rendered} label="复制最终提示词" />
                </div>
              </div>
              <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                <pre className="text-[13px] leading-[1.85] text-[var(--paper-1)] whitespace-pre-wrap font-mono">
                  {rendered.split(/(\{\{[^}]+\}\})/g).map((p, i) => {
                    const m = p.match(/^\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}$/);
                    if (m) {
                      const key = m[1];
                      const v = values[key];
                      return (
                        <span key={i} className={cn('variable-text', !v && 'is-empty opacity-70')}>
                          {v || `__${key}__`}
                        </span>
                      );
                    }
                    return <span key={i}>{p}</span>;
                  })}
                </pre>
              </div>
              <div className="px-5 py-3 border-t border-[var(--ink-4)] flex items-center justify-between text-[11px] text-[var(--paper-3)]">
                <div className="flex items-center gap-4">
                  <span>共 <span className="mono text-[var(--paper-1)]">{rendered.length}</span> 字符</span>
                  <span>约 <span className="mono text-[var(--paper-1)]">{tokens}</span> tokens</span>
                  {missingKeys.length > 0 && (
                    <span className="text-[var(--vermilion)]">未填 {missingKeys.length} 处</span>
                  )}
                </div>
                <span className="mono">v{tpl.versions.length}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="secondary"
                icon={<Save size={14} />}
                onClick={() => {
                  if (!user) {
                    pushToast({ kind: 'warn', message: '请先登录后再保存' });
                    nav('/login');
                    return;
                  }
                  try {
                    const draft = { ...tpl, body: tpl.body };
                    localStorage.setItem(`ps_saved_${user.id}_${tpl.id}`, JSON.stringify(values));
                    pushToast({ kind: 'success', message: '已保存到我的剧库' });
                  } catch { /* ignore */ }
                }}
              >
                保存到云端
              </Button>
              <Button variant="ghost" icon={<BookOpen size={14} />} onClick={() => nav(`/gallery/${tpl.id}`)}>
                查看模板详情
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

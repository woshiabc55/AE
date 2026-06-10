import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Share2, ChevronDown, Play, Wand2 } from 'lucide-react';
import { templatesApi } from '@/api/templates';
import { categories } from '@/mock/categories';
import type { Template, CategoryId } from '@/types';
import TemplateCard from '@/components/TemplateCard';
import * as Icons from 'lucide-react';

const TYPEWRITER_LINES = [
  '一个失意的钢琴教师在教自闭症儿童的过程中重新找到生命的意义',
  '深夜便利店里，女主撞见男友和闺蜜并排坐着',
  '都市人渴望片刻的宁静 — 高山原叶，冷泡更好喝',
  '在流量时代坚持慢创作的独立纪录片导演',
  '蒸汽朋克与东方仙侠融合的近未来RPG',
];

function useTypewriter(lines: string[]) {
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && text === '') {
      setDeleting(false);
      setLineIdx((i) => (i + 1) % lines.length);
      timeout = setTimeout(() => {}, 400);
    } else {
      timeout = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, deleting ? 20 : 50);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, lineIdx, lines]);

  return text;
}

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const typed = useTypewriter(TYPEWRITER_LINES);

  useEffect(() => {
    templatesApi.featured(6).then(setTemplates);
  }, []);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 30% 30%, rgba(212,165,116,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(139,58,58,0.15), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-20 lg:pt-32">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <div className="fade-up mb-6 inline-flex items-center gap-2 border border-gold-500/30 bg-gold-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500">
                <Sparkles size={11} strokeWidth={1.5} />
                <span>导演剪辑室 · Director's Cut</span>
              </div>
              <h1 className="fade-up delay-100 font-display text-5xl font-bold leading-[1.05] text-cream-50 sm:text-6xl lg:text-7xl xl:text-8xl">
                把提示词<br />
                <span className="italic text-gold-500">当作剧本</span>来写。
              </h1>
              <p className="fade-up delay-200 mt-6 max-w-xl text-base leading-relaxed text-cream-200/70 sm:text-lg">
                PromptStage（幕境）是为影视编导、短视频博主、游戏剧情设计师打造的云端提示词工程平台。
                <span className="text-cream-100">结构化、可分镜、可版本化</span>，一键投递到任意大模型。
              </p>
              <div className="fade-up delay-300 mt-10 flex flex-wrap items-center gap-3">
                <Link to="/templates" className="btn-primary">
                  <Play size={14} strokeWidth={2} />
                  立即开始创作
                </Link>
                <Link to="/editor" className="btn-outline">
                  <Wand2 size={14} strokeWidth={1.5} />
                  空白剧本
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="fade-up delay-300 card p-5">
                <div className="flex items-center justify-between border-b border-ink-600 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gold-500" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cream-200/60">
                      LIVE PREVIEW
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-cream-200/30">scene_01.prompt</span>
                </div>
                <div className="mt-4 min-h-[180px] font-mono text-sm leading-relaxed text-cream-100/90">
                  <div className="text-gold-500/60">// 提示词</div>
                  <div className="mt-2">
                    {typed}
                    <span className="caret" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink-600 pt-3 font-mono text-[10px] text-cream-200/40">
                  <span>3 变量 · 2 场景</span>
                  <span>~ 128 tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-gold-500/10 bg-ink-800/40 py-16">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                · 01 Categories
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-cream-50 sm:text-4xl">
                选择剧本类型
              </h2>
            </div>
            <Link to="/templates" className="hidden font-mono text-xs text-cream-200/50 hover:text-gold-500 md:block">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const Icon = (Icons as any)[cat.icon] || Sparkles;
              return (
                <Link
                  key={cat.id}
                  to={`/templates?category=${cat.id}`}
                  className="card group p-5 fade-up"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-gold-500/30 text-gold-500 transition-all group-hover:bg-gold-500 group-hover:text-ink-900">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream-50">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-cream-200/50">{cat.description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-ink-600 pt-3">
                    <span className="font-mono text-[10px] text-cream-200/40">
                      {cat.count} 模板
                    </span>
                    <ArrowRight size={12} className="text-cream-200/30 transition-all group-hover:translate-x-1 group-hover:text-gold-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                · 02 Featured
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-cream-50 sm:text-4xl">
                精选剧本模板
              </h2>
            </div>
            <Link to="/templates" className="font-mono text-xs text-cream-200/50 hover:text-gold-500">
              浏览全部 ({templates.length > 0 ? templates.length : '...'})
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="border-t border-gold-500/10 bg-ink-800/40 py-20">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
              · 03 Workflow
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-cream-50 sm:text-4xl">
              三步把灵感变成可执行剧本
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                icon: Sparkles,
                title: '选模板',
                desc: '从 30+ 行业模板中挑选，或从零开始。每个模板都内置分镜结构与变量定义。',
              },
              {
                num: '02',
                icon: Zap,
                title: '填变量',
                desc: '在剧本编辑器中填入主题、人物、情绪。变量以「活字」形式实时高亮，结构一目了然。',
              },
              {
                num: '03',
                icon: Share2,
                title: '投递 AI',
                desc: '一键复制最终提示词，或直接配置 API Key 投递到 GPT-4 / Claude / Gemini。',
              },
            ].map((step, i) => (
              <div key={step.num} className="card relative p-6 fade-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}>
                <div className="absolute -top-3 right-6">
                  <div className="scene-badge">{step.num}</div>
                </div>
                <step.icon size={24} strokeWidth={1.5} className="text-gold-500" />
                <h3 className="mt-4 font-display text-2xl font-bold text-cream-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-200/60">
                  {step.desc}
                </p>
                {i < 2 && (
                  <ChevronDown
                    size={20}
                    className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 rotate-[-90deg] text-gold-500/40 md:hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-cream-50 sm:text-5xl lg:text-6xl">
            你的下一部神作，<br />
            <span className="italic text-gold-500">从一行提示词开始。</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-cream-200/60">
            注册即可获得 5GB 云端剧本库、版本历史、跨设备同步。无需信用卡。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/templates" className="btn-primary">
              <Play size={14} strokeWidth={2} />
              免费开始创作
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

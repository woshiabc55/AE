// 首页 - 工作室入口
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Zap, Cloud, Users, BookOpen, Wand2, ChevronRight, Quote } from 'lucide-react';
import { Button, Card, CoverArt, CategoryTag, Stat, FilmStrip, Badge } from '../components/ui';
import { TemplateService } from '../services/template';
import { SEED_TEMPLATES } from '../data/templates.seed';
import { CATEGORIES } from '../data/templates.seed';
import type { Template } from '../types';
import { useApp } from '../store/useApp';
import { cn, compactNumber } from '../lib/utils';

function Marquee() {
  const items = [
    '短剧脚本',
    '直播口播',
    '小红书种草',
    '抖音爆款',
    '品牌故事片',
    '分镜九宫格',
    '知识口播',
    '公众号长文',
    '测评种草',
    '播客开场',
    '短篇小说',
    '反派小传',
  ];
  const set = [...items, ...items];
  return (
    <div className="border-y border-[var(--ink-4)] overflow-hidden bg-[var(--ink-2)]">
      <div className="flex animate-[marquee_36s_linear_infinite] py-3 whitespace-nowrap">
        {set.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-[12px] text-[var(--paper-2)] mono tracking-wider">
            <span className="w-1 h-1 rounded-full bg-[var(--amber-2)]" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function NumberRoll({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <span className="tabular-nums">{compactNumber(val)}{suffix}</span>;
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 80]);
  const y2 = useTransform(scrollY, [0, 600], [0, -40]);
  const nav = useNavigate();
  return (
    <section className="relative overflow-hidden pt-16 lg:pt-24 pb-20">
      {/* 背景光斑 */}
      <div className="absolute -top-40 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(232,177,74,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute top-40 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(58,142,142,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(192,57,43,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 stagger-children">
            <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full glass border border-[rgba(232,177,74,0.25)] text-[11px] text-[var(--amber-1)] mono tracking-wider mb-8">
              <span className="dot-amber" />
              v1.0 · 公开测试中
            </div>
            <h1 className="text-cinematic text-[80px] sm:text-[120px] lg:text-[160px]">
              写一次<br />用一千次
            </h1>
            <p className="mt-6 max-w-[540px] text-[16px] leading-relaxed text-[var(--paper-2)]">
              剧幕 PromptStage 是<span className="text-amber-gradient font-medium">面向中文创作者的云端剧本提示词工作台</span>。
              把散落在备忘录、Notion、群聊里的提示词，沉淀成可变量、可复用、可协作的剧目资产。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => nav('/gallery')} className="btn-amber-glow">
                浏览模板展厅
              </Button>
              <Button size="lg" variant="outline-amber" onClick={() => nav('/editor')}>
                <Wand2 size={18} /> 从零搭建
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[var(--paper-3)]">
              <span className="inline-flex items-center gap-1.5"><Cloud size={13} className="text-[var(--jade)]" /> 云端同步</span>
              <span className="inline-flex items-center gap-1.5"><Zap size={13} className="text-[var(--amber-2)]" /> 一键复制</span>
              <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-[var(--teal-2)]" /> 团队协作</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--paper-3)]">·</span>
              <span className="mono text-[11px] text-[var(--paper-3)]">12+ 模板 / 1GB / 永久免费</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative" style={{ perspective: 1200 }}>
            <motion.div style={{ y: y1 }} className="relative">
              <div className="amber-border-glow rounded-[12px] overflow-hidden">
                <CoverArt seed="featured_01" category="short-video" size="xl" className="!aspect-[4/3] shadow-[var(--shadow-3)]" />
              </div>
              <div className="absolute -top-4 -right-4 bg-[var(--amber-2)] text-[var(--ink-0)] px-3 py-1.5 rounded-[6px] text-[11px] font-bold tracking-wider mono shadow-[0_4px_16px_rgba(232,177,74,0.4)]">
                钩子 30s
              </div>
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute -bottom-10 -left-8 w-[60%]">
              <div className="amber-border-glow rounded-[12px] overflow-hidden">
                <CoverArt seed="featured_02" category="novel" size="lg" className="shadow-[var(--shadow-2)]" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute top-1/2 -right-6 w-[55%] glass rounded-[10px] p-4 shadow-[var(--shadow-2)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="tag tag-amber">{'{{product_name}}'}</span>
                <span className="tag">变量</span>
              </div>
              <div className="text-[12px] text-[var(--paper-1)] leading-relaxed font-mono">
                <span className="text-[var(--paper-3)]">// 钩子结构</span><br />
                1. 反差开场<br />
                2. 痛点放大<br />
                3. 价值递进<br />
                4. 限时逼单
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--ink-4)] flex items-center gap-1.5 text-[10px] text-[var(--paper-3)] mono">
                <span className="dot-amber" />
                <span>实时生成中</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBanner() {
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [totalUses, setTotalUses] = useState(0);
  useEffect(() => {
    TemplateService.list().then((list) => {
      setTotalTemplates(list.length);
      setTotalUses(list.reduce((s, t) => s + t.stats.uses, 0));
    });
  }, []);
  return (
    <section className="border-y border-[var(--ink-4)] bg-[var(--ink-2)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <Stat value={totalTemplates || SEED_TEMPLATES.length} label="在线模板" />
        <Stat value={totalUses || 0} label="累计调用" />
        <Stat value={5} label="剧本分类" />
        <Stat value={12} label="内置种子" />
      </div>
    </section>
  );
}

function FeaturedTemplates({ onView }: { onView: (id: string) => void }) {
  const items = SEED_TEMPLATES.slice(0, 6);
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="eyebrow eyebrow-amber mb-3">FEATURED · 精选剧目</div>
          <h2 className="display text-4xl lg:text-5xl text-[var(--paper-0)]">本周备受关注的剧本</h2>
        </div>
        <Link to="/gallery" className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-[var(--amber-1)] hover:gap-2.5 transition-all">
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -4 }}
            onClick={() => onView(t.id)}
            className={cn(
              'group cursor-pointer rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden card-hover',
              i === 0 && 'lg:col-span-2 lg:row-span-1'
            )}
          >
            <CoverArt
              seed={t.cover}
              category={t.category}
              size={i === 0 ? 'lg' : 'md'}
              className={i === 0 ? '!aspect-[16/8]' : ''}
            />
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryTag category={t.category} />
                {t.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>
              <h3 className={cn('display text-[var(--paper-0)] group-hover:text-[var(--amber-1)] transition-colors', i === 0 ? 'text-2xl' : 'text-lg')}>
                {t.title}
              </h3>
              <p className="text-[13px] text-[var(--paper-2)] line-clamp-2 leading-relaxed">{t.description}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-[var(--paper-3)]">
                  <span>{t.variables.length} 变量</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--ink-5)]" />
                  <span>{compactNumber(t.stats.uses)} 调用</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-[var(--amber-1)] mono opacity-0 group-hover:opacity-100 transition-opacity">
                  打开 <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoryShowcase() {
  const nav = useNavigate();
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="eyebrow eyebrow-amber mb-3">CATEGORIES · 五大类别</div>
          <h2 className="display text-4xl text-[var(--paper-0)] mb-4">从短视频到长故事</h2>
          <p className="text-[14px] text-[var(--paper-2)] leading-relaxed mb-6">
            五大剧本分类，{'{{n}}'} 套内置模板，覆盖你从一句话钩子到完整长片的所有创作场景。
          </p>
          <Button variant="ghost" size="md" iconRight={<ArrowRight size={14} />} onClick={() => nav('/gallery')}>
            探索全部
          </Button>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              onClick={() => nav(`/gallery?cat=${c.key}`)}
              className={cn('group text-left rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-5 transition-all hover:border-[var(--ink-5)]', `cat-${c.key}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="cat-bar" />
                <ChevronRight size={16} className="text-[var(--paper-3)] group-hover:text-[var(--cat)] transition-colors" />
              </div>
              <h3 className="display text-xl text-[var(--paper-0)] group-hover:text-[var(--cat)] transition-colors">{c.label}</h3>
              <p className="text-[12px] text-[var(--paper-2)] mt-1.5">{c.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueProp() {
  const items = [
    { icon: <BookOpen size={20} />, title: '结构化剧本', desc: '不再是松散段落，而是带变量插槽、片段库、版本历史的工程化剧本。' },
    { icon: <Wand2 size={20} />, title: '变量即资产', desc: '{{product_name}} 这样的插槽让你一次搭建，无限复用。' },
    { icon: <Cloud size={20} />, title: '云端永不丢失', desc: '草稿自动保存、登录即同步。出差、回家、换电脑都无缝衔接。' },
    { icon: <Sparkles size={20} />, title: '示例一键套用', desc: '每个模板都附完整填写示例，零启动成本。' },
  ];
  return (
    <section className="border-t border-[var(--ink-4)] bg-[var(--ink-2)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow eyebrow-amber mb-3">WHY PROMPTSTAGE · 为什么用剧幕</div>
          <h2 className="display text-4xl lg:text-5xl text-[var(--paper-0)]">把"我每次都要重新写"变成"一次搭建永久调用"</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full" hoverable>
                <div className="w-10 h-10 rounded-[6px] bg-[rgba(232,177,74,0.1)] border border-[rgba(232,177,74,0.25)] flex items-center justify-center text-[var(--amber-2)] mb-4">
                  {it.icon}
                </div>
                <h3 className="display text-lg text-[var(--paper-0)] mb-2">{it.title}</h3>
                <p className="text-[13px] text-[var(--paper-2)] leading-relaxed">{it.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: '01', t: '选择剧目', d: '从展厅挑选现成模板，或从零开始搭建' },
    { n: '02', t: '插入变量', d: '在剧本中插入 {{key}} 插槽并定义字段' },
    { n: '03', t: '填写生成', d: '在变量工坊填写，一键产出最终提示词' },
    { n: '04', t: '云端保存', d: '剧目存入云端剧库，跨设备随时调用' },
  ];
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-24">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="eyebrow eyebrow-amber mb-3">WORKFLOW · 创作流程</div>
          <h2 className="display text-4xl lg:text-5xl text-[var(--paper-0)] mb-6">四步完成从灵感<br />到可用提示词</h2>
          <p className="text-[14px] text-[var(--paper-2)] leading-relaxed max-w-md">
            你不需要成为 prompt engineer。把流程结构化、把变量命名好、把示例填完整，剩下的事交给剧幕。
          </p>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-6 hover:border-[var(--ink-5)] transition-colors">
              <div className="mono text-[40px] font-bold text-[var(--ink-4)] leading-none mb-4">{s.n}</div>
              <h3 className="display text-xl text-[var(--paper-0)] mb-2">{s.t}</h3>
              <p className="text-[13px] text-[var(--paper-2)] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="border-t border-[var(--ink-4)] bg-[var(--ink-2)]">
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-24 text-center">
        <Quote size={32} className="text-[var(--amber-2)] mx-auto mb-6 opacity-60" />
        <p className="display text-2xl lg:text-3xl text-[var(--paper-0)] leading-snug mb-8">
          "以前我每周要为新选题重新写 3 小时提示词。现在我打开剧幕，10 分钟就出活儿，省下的时间我能再写一整集脚本。"
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--teal-1)] to-[var(--teal-2)] flex items-center justify-center text-white text-[14px] font-bold">余</div>
          <div className="text-left">
            <div className="text-[14px] text-[var(--paper-0)]">余白</div>
            <div className="text-[12px] text-[var(--paper-3)]">余白工作室 主理人 · 抖音 80w 粉</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { user, loginDemo } = useApp();
  const nav = useNavigate();
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-24">
      <div className="relative rounded-[20px] overflow-hidden glass-strong p-10 lg:p-16 film-edge">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,177,74,0.2),transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(58,142,142,0.12),transparent_60%)] pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow eyebrow-amber mb-3 section-rule">START NOW · 现在开始</div>
            <h2 className="display text-4xl lg:text-5xl text-paper-gradient mb-4">搭一座属于你的<br />剧目库</h2>
            <p className="text-[15px] text-[var(--paper-2)] max-w-md leading-relaxed">
              注册即获得 <span className="text-[var(--amber-1)] mono">1GB</span> 云端空间。无需信用卡，无需邀请码。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button size="lg" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => nav(user ? '/editor' : '/login')} className="btn-amber-glow">
              {user ? '前往编辑器' : '免费注册'}
            </Button>
            {!user && (
              <Button size="lg" variant="outline-amber" onClick={loginDemo}>
                先用演示账号看看
              </Button>
            )}
          </div>
        </div>
        {/* 顶部进度光条 */}
        <div className="absolute top-0 left-0 right-0 progress-line" />
      </div>
    </section>
  );
}

export default function Home() {
  const nav = useNavigate();
  return (
    <div>
      <Hero />
      <Marquee />
      <StatsBanner />
      <FeaturedTemplates onView={(id) => nav(`/gallery/${id}`)} />
      <CategoryShowcase />
      <ValueProp />
      <Workflow />
      <Testimonial />
      <CTASection />
      <FilmStrip className="opacity-40" />
    </div>
  );
}

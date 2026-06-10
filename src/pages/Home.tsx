import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  Clapperboard,
  Layers,
  Atom,
  BookOpen,
  Pen,
  Wand2,
  TreePine,
  Palette,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store";
import { TemplateCard } from "@/components/TemplateCard";
import { FilmReel } from "@/components/FilmReel";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { SKILL_CATEGORY_LABEL } from "@/data/seed-skills";
import { cn } from "@/utils/format";

const GENRES = [
  { key: "all", label: "All", icon: Layers },
  { key: "movie", label: "电影", icon: Clapperboard },
  { key: "short", label: "短剧", icon: Sparkles },
  { key: "video", label: "短视频", icon: Atom },
  { key: "interactive", label: "互动", icon: BookOpen },
] as const;

const BEATS = [
  { key: "all", label: "全部节拍" },
  { key: "three-act", label: "三幕结构" },
  { key: "hero-journey", label: "英雄之旅" },
  { key: "save-the-cat", label: "救猫咪" },
  { key: "short-form", label: "短篇 / 短剧" },
  { key: "interactive", label: "互动分支" },
] as const;

export function Home() {
  const templates = useAppStore((s) => s.templates);
  const skills = useAppStore((s) => s.skills);
  const styles = useAppStore((s) => s.styles);
  const [genre, setGenre] = useState<string>("all");
  const [beat, setBeat] = useState<string>("all");

  const filtered = useMemo(
    () =>
      templates.filter(
        (t) =>
          (genre === "all" || t.genre === genre) &&
          (beat === "all" || t.beatModel === beat)
      ),
    [templates, genre, beat]
  );

  const featured = filtered.filter((t) => t.usageCount > 1000);
  const fresh = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
  const popular = [...filtered].sort((a, b) => b.usageCount - a.usageCount);
  const builtinSkills = useMemo(
    () => skills.filter((s) => s.isBuiltin === 1),
    [skills]
  );
  const builtinStyles = useMemo(
    () => styles.filter((s) => s.isBuiltin === 1),
    [styles]
  );

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-700">
        {/* 渐变背景 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, rgba(212,168,87,0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,16,46,0.18) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 0%, rgba(11,11,14,0.6) 100%)",
          }}
        />
        {/* 顶部胶片条 */}
        <div className="absolute top-0 left-0 right-0 h-3 film-strip" />

        <div className="relative mx-auto max-w-[1480px] px-6 lg:px-10 pt-16 pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span className="scene-tag">REEL 01 / TAKE 01</span>
              <span className="label-overline">2026 · SUMMER DROP</span>
            </div>

            <h1 className="font-display text-[64px] md:text-[88px] lg:text-[112px] leading-[0.9] tracking-tight text-paper-50">
              把灵感，
              <br />
              <span className="italic text-amber text-glow">装进磁轨。</span>
            </h1>

            <p className="mt-8 max-w-xl font-serif text-[18px] leading-[1.7] text-paper-200">
              萤幕 <span className="font-display italic">Lumière</span> 是一款云端 AI 剧本提示词模板器。
              将角色、节拍、冲突、台词、镜头语言抽离为可复用的结构化字段，
              一键喂给大模型，从此告别「想到哪写到哪」的散装提示词。
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/studio" className="reel-button">
                <Sparkles size={13} strokeWidth={1.5} /> 新建剧本模板
              </Link>
              <Link to="/library" className="ghost-button">
                <Clapperboard size={13} strokeWidth={1.5} /> 浏览公共模板库
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 label-overline">
              <span>本地优先 · 零后端</span>
              <span className="stat-divider" />
              <span>版本化字段</span>
              <span className="stat-divider" />
              <span>OpenAI 兼容 LLM</span>
              <span className="stat-divider" />
              <span>实时提示词拼装</span>
            </div>
          </div>

          {/* 3D 胶片 */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute -top-8 -right-4 hidden lg:block">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-amber/80 text-right space-y-1">
                <div>SCENE 01 · INT.</div>
                <div>LUMIÈRE STUDIO</div>
                <div className="text-ink-300">CAM · 50mm · f/1.4</div>
                <div className="text-ink-300">ROLL 12 / 24</div>
              </div>
            </div>
            <FilmReel />
            <div className="absolute -bottom-4 -left-2 hidden lg:block">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300 text-right">
                <div>“Cut. Print. Next take.”</div>
                <div className="text-amber mt-1">— LUMIÈRE TEAM</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部胶片条 */}
        <div className="absolute bottom-0 left-0 right-0 h-3 film-strip" />
      </section>

      {/* ====== v1 新模块三连击 ====== */}
      <section className="border-b border-ink-700 bg-ink-800/30">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="scene-tag">REEL 01.5 · v1 NEW</span>
              <h2 className="mt-3 font-display text-[44px] leading-[1.05] text-paper-50">
                三个新工具，<span className="italic text-amber">让你的剧本长出根</span>
              </h2>
              <p className="mt-3 font-serif text-paper-200 max-w-2xl">
                萤幕 v1 正式版新增 <span className="font-mono text-amber">Skill 库</span> ·
                <span className="font-mono text-amber mx-1">结构树画布</span> ·
                <span className="font-mono text-amber">Style 工作室</span>。
                三个工具相互补全，构成"提示词零件化 → 视觉/风格一键布置"的完整闭环。
              </p>
            </div>
            <span className="label-overline">
              {builtinSkills.length} Skills · {builtinStyles.length} Styles 内置
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <ModuleCard
              to="/skills"
              icon={Wand2}
              tag="SKILLS"
              title="剧本 Skill 库"
              tagline="碎片化的剧本配方"
              desc="在任意提示词中插入 @skill:key，渲染时自动展开。片段负责填实肌理，宏负责动态生长。"
              stat={`${builtinSkills.length} 个内置技能`}
              hint="覆盖开场 / 人物 / 场景 / 反转 / 收束 / 母题 等 11 个分类"
              accent="amber"
            />
            <ModuleCard
              to="/library"
              icon={TreePine}
              tag="CANVAS"
              title="结构树画布"
              tagline="节拍 = 树"
              desc="进入任意剧本详情页 → 右上角「结构树画布」自动生成节拍层级，可拖拽重排、绑定字段、追加到提示词。"
              stat="5 套节拍骨架"
              hint="三幕 / 英雄之旅 / 救猫咪 / 短剧 / 互动"
              accent="reel"
            />
            <ModuleCard
              to="/style"
              icon={Palette}
              tag="STYLE"
              title="Style 风格工作室"
              tagline="一键布置视觉 + 剧本风格"
              desc="选一个 Style（黑色电影 / 王家卫风 / 赛博朋克 / 现实主义），决定它要覆盖哪些剧本，一键注入系统指令 + 视觉主题。"
              stat={`${builtinStyles.length} 套风格`}
              hint="同时修改 CSS 变量与提示词"
              accent="cyan"
            />
          </div>

          {/* 内置 Skill 速览 */}
          <div className="mt-10 panel p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-amber" />
                <span className="label-overline">内置 Skill 速览</span>
              </div>
              <Link to="/skills" className="text-[10px] font-mono text-amber hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {builtinSkills.map((s) => (
                <Link
                  to="/skills"
                  key={s.id}
                  className="px-2.5 py-1.5 border border-ink-700 hover:border-amber transition group flex items-center gap-1.5"
                  title={s.description}
                >
                  <span
                    className={cn(
                      "px-1 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border",
                      s.type === "macro"
                        ? "border-violet-500 text-violet-300"
                        : "border-amber text-amber"
                    )}
                  >
                    {s.type === "macro" ? "宏" : "片"}
                  </span>
                  <span className="font-serif text-[12px] text-paper-100 group-hover:text-amber transition">
                    {s.name}
                  </span>
                  <code className="font-mono text-[10px] text-ink-300">
                    @{s.key}
                  </code>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 筛选 */}
      <section className="mx-auto max-w-[1480px] px-6 lg:px-10 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <span className="label-overline">SCENE 02 · Library</span>
            <h2 className="mt-2 font-display text-[40px] text-paper-50">
              体裁 × 节拍，<span className="italic text-amber">双重筛选</span>
            </h2>
          </div>
          <Link
            to="/library"
            className="ghost-button"
          >
            完整模板库 <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.key}
                onClick={() => setGenre(g.key)}
                className={cn("tag-pill", genre === g.key && "tag-pill-active")}
              >
                <g.icon size={11} /> {g.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {BEATS.map((b) => (
              <button
                key={b.key}
                onClick={() => setBeat(b.key)}
                className={cn("tag-pill", beat === b.key && "tag-pill-active")}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 精选 */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-6 lg:px-10 pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="scene-tag">FEATURED</span>
              <h2 className="mt-3 font-display text-[32px] text-paper-50">本周精选</h2>
            </div>
            <span className="label-overline">{featured.length} 部</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((t, i) => (
              <TemplateCard key={t.id} tpl={t} index={i} featured />
            ))}
          </div>
        </section>
      )}

      {/* 最新 */}
      <section className="mx-auto max-w-[1480px] px-6 lg:px-10 pb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="scene-tag">FRESH</span>
            <h2 className="mt-3 font-display text-[32px] text-paper-50">最新上架</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {fresh.map((t, i) => (
            <TemplateCard key={t.id} tpl={t} index={i} />
          ))}
        </div>
      </section>

      {/* 热门 */}
      <section className="mx-auto max-w-[1480px] px-6 lg:px-10 pb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="scene-tag">POPULAR</span>
            <h2 className="mt-3 font-display text-[32px] text-paper-50">热门调用榜</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {popular.map((t, i) => (
            <TemplateCard key={t.id} tpl={t} index={i} />
          ))}
        </div>
      </section>

      {/* 流程 */}
      <section className="mx-auto max-w-[1480px] px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <span className="scene-tag">SCENE 03 · HOW IT WORKS</span>
            <h2 className="mt-3 font-display text-[40px] leading-[1.05] text-paper-50">
              四步，
              <br />
              <span className="italic text-amber">把脑中的画面</span>
              <br />
              搬上 LLM 的舞台。
            </h2>
            <p className="mt-6 font-serif text-[16px] leading-[1.8] text-paper-200 max-w-md">
              我们不教你怎么写提示词，<br />
              我们把剧本结构本身，做成了提示词。
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              {
                n: "01",
                t: "选择节拍",
                d: "三幕、英雄之旅、救猫咪……12+ 节拍模型开箱即用。",
                icon: Layers,
              },
              {
                n: "02",
                t: "填写字段",
                d: "Logline、人物小传、节拍表、核心冲突、风格参考，一屏搞定。",
                icon: Pen,
              },
              {
                n: "03",
                t: "实时拼装",
                d: "结构化字段 → 提示词原文，变量高亮、Token 估算、导出 JSON。",
                icon: Sparkles,
              },
              {
                n: "04",
                t: "一键开拍",
                d: "调用大模型流式生成剧本，保存为新版本，发布到公共库。",
                icon: Clapperboard,
              },
            ].map((s) => (
              <div key={s.n} className="panel p-5 panel-hover">
                <div className="flex items-center justify-between mb-4">
                  <s.icon size={20} className="text-amber" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                    Take {s.n}
                  </span>
                </div>
                <h3 className="font-display text-[22px] text-paper-50">{s.t}</h3>
                <p className="mt-2 font-serif text-[14px] text-paper-200 leading-relaxed">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 引用 */}
      <section className="border-y border-ink-700 bg-ink-800/40 py-20">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-2 label-overline">SCENE 04 · QUOTE</div>
          <blockquote className="lg:col-span-10 font-display text-[28px] md:text-[40px] leading-[1.3] text-paper-50">
            “摄影是关于<span className="italic text-amber">剥离</span>的艺术，
            <br className="hidden md:block" />
            剧本是关于<span className="italic text-amber">注入</span>的艺术。”
            <footer className="mt-6 label-overline">— LUMIÈRE EDITORIAL</footer>
          </blockquote>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mx-auto max-w-[1480px] px-6 lg:px-10 py-24 text-center">
        <ArrowDown size={16} className="text-amber mx-auto mb-6 animate-bounce" />
        <h2 className="font-display text-[56px] text-paper-50 leading-[1]">
          现在，<span className="italic text-amber">开拍。</span>
        </h2>
        <p className="mt-6 font-serif italic text-[18px] text-paper-200 max-w-xl mx-auto">
          8 套精选模板 · 8 个剧本 Skill · 4 套风格预设 · 0 元起步 · 数据全部留在你本地。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/studio" className="reel-button">
            <Sparkles size={12} /> 创建我的第一个模板
          </Link>
          <Link to="/settings" className="ghost-button">
            配置 API Key
          </Link>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({
  to,
  icon: Icon,
  tag,
  title,
  tagline,
  desc,
  stat,
  hint,
  accent,
}: {
  to: string;
  icon: any;
  tag: string;
  title: string;
  tagline: string;
  desc: string;
  stat: string;
  hint: string;
  accent: "amber" | "reel" | "cyan";
}) {
  const accentMap = {
    amber: "border-amber/40 text-amber",
    reel: "border-reel/40 text-reel",
    cyan: "border-cyan-500/40 text-cyan-300",
  };
  return (
    <Link
      to={to}
      className="panel panel-hover p-6 group flex flex-col gap-3 relative overflow-hidden"
    >
      <span
        className={cn(
          "absolute top-0 right-0 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border-l border-b",
          accentMap[accent]
        )}
      >
        {tag}
      </span>
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-amber" />
        <h3 className="font-display text-[26px] text-paper-50">{title}</h3>
      </div>
      <p className="font-display italic text-[15px] text-paper-300">{tagline}</p>
      <p className="font-serif text-[13px] text-paper-200 leading-relaxed flex-1">
        {desc}
      </p>
      <div className="mt-2 pt-3 border-t border-ink-700/60 flex items-center justify-between text-[11px] font-mono">
        <span className="text-amber">{stat}</span>
        <span className="text-ink-300 group-hover:text-paper-200 transition flex items-center gap-1">
          {hint}
          <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition" />
        </span>
      </div>
    </Link>
  );
}

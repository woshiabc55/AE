import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Sparkles, Clapperboard, Layers, Atom, BookOpen, Pen } from "lucide-react";
import { useAppStore } from "@/store";
import { TemplateCard } from "@/components/TemplateCard";
import { FilmReel } from "@/components/FilmReel";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
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
          8 套精选模板 · 0 元起步 · 数据全部留在你本地。
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

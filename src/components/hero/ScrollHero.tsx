import { Link } from "react-router-dom";
import { ArrowDown, Clock, FileText, Gauge, Mic } from "lucide-react";
import { ACTS, TOTAL_CHARS, TOTAL_DURATION } from "@/data/acts";
import { Seal } from "@/components/common/Seal";

export function ScrollHero() {
  const minutes = Math.floor(TOTAL_DURATION / 60);
  const seconds = TOTAL_DURATION % 60;
  return (
    <section className="relative pt-10 pb-16">
      {/* 上沿飘带 */}
      <div className="absolute -top-3 left-0 right-0 flex items-center justify-center gap-3">
        <span className="h-px w-24 bg-mo-800/30" />
        <Seal text="宋 史 卷 九 · 北 伐" size="sm" />
        <span className="h-px w-24 bg-mo-800/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        {/* 标题 */}
        <div className="lg:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-mo-600 mb-4">
            Northern Expeditions of Emperor Taizong · 979 — 1004
          </div>
          <h1 className="font-xiao text-6xl md:text-7xl leading-[1.05] text-mo-900 tracking-[0.08em]">
            高粱河车神
            <br />
            <span className="text-zhu-500">与</span>
            雍熙悲歌
          </h1>
          <p className="font-brush text-2xl md:text-3xl text-mo-700 mt-6 leading-snug">
            赵光义北伐全纪实 ·
            <span className="text-mo-500">五次北伐，</span>
            <span className="text-zhu-500">一场驴车漂移，</span>
            <span className="text-mo-500">一曲杨家悲歌。</span>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/storyboard" className="btn-seal">
              <FileText className="size-4" /> 进入分镜表
            </Link>
            <a href="#act-0" className="btn-ghost">
              <ArrowDown className="size-4" /> 展开剧本
            </a>
            <Link to="/cast" className="btn-ghost">
              卷轴人物志
            </Link>
          </div>
        </div>

        {/* 剧本元信息卡 */}
        <div className="lg:col-span-5">
          <div className="card-paper p-6 relative">
            <div className="absolute -top-3 -left-3 seal text-[10px]">WORKBENCH META</div>
            <h3 className="font-xiao text-xl tracking-[0.18em] text-mo-900 mb-4">
              剧本元信息
            </h3>
            <dl className="grid grid-cols-2 gap-y-3 gap-x-6 font-serif text-sm">
              <Stat icon={FileText} label="总字数" value={`${TOTAL_CHARS} 字`} />
              <Stat
                icon={Clock}
                label="朗读时长"
                value={`${minutes} 分 ${seconds} 秒`}
              />
              <Stat icon={Gauge} label="建议速率" value="180—200 字/分钟" />
              <Stat
                icon={Mic}
                label="幕数"
                value={`${ACTS.length} 幕 · 24 镜头`}
              />
            </dl>
            <div className="mt-5 pt-5 border-t border-mo-800/15">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mo-600 mb-2">
                Structure / 结构
              </div>
              <ol className="space-y-1.5">
                {ACTS.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 text-sm font-serif"
                  >
                    <span className="font-mono text-[10px] text-mo-600 w-6">
                      {String(a.index).padStart(2, "0")}
                    </span>
                    <span className="text-mo-900">{a.title}</span>
                    <span className="text-mo-500">·</span>
                    <span className="text-mo-700">{a.subtitle}</span>
                    <span className="ml-auto font-mono text-[10px] text-mo-600">
                      {a.body.length} 字
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-5 pt-5 border-t border-mo-800/15 grid grid-cols-3 gap-2 text-center">
              <MiniStat n="2" label="北伐" />
              <MiniStat n="4" label="HTML 特效" />
              <MiniStat n="8" label="人物立绘" />
            </div>
          </div>
        </div>
      </div>

      {/* 烽烟 + 远山装饰 */}
      <div className="mt-12 relative h-20 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(58,76,56,0.45)" />
              <stop offset="100%" stopColor="rgba(58,76,56,0)" />
            </linearGradient>
            <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(14,10,7,0.35)" />
              <stop offset="100%" stopColor="rgba(14,10,7,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0 90 C 200 40, 380 100, 580 60 S 900 30, 1200 80 L1200 120 L0 120 Z"
            fill="url(#m1)"
          />
          <path
            d="M0 100 C 240 60, 460 110, 720 80 S 1080 60, 1200 100 L1200 120 L0 120 Z"
            fill="url(#m2)"
          />
        </svg>
        <div className="absolute left-[15%] bottom-3 smoke-puff animate-smoke" />
        <div
          className="absolute left-[40%] bottom-3 smoke-puff animate-smoke"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute left-[65%] bottom-3 smoke-puff animate-smoke"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute left-[88%] bottom-3 smoke-puff animate-smoke"
          style={{ animationDelay: "2.5s" }}
        />
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-mo-600">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd className="font-xiao text-base text-mo-900 mt-0.5 tracking-[0.08em]">
        {value}
      </dd>
    </div>
  );
}

function MiniStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-xiao text-2xl text-zhu-500 leading-none">{n}</div>
      <div className="font-mono text-[10px] tracking-[0.25em] text-mo-600 mt-1">
        {label}
      </div>
    </div>
  );
}

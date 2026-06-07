import { Bookshelf } from "@/components/bookshelf/Bookshelf";
import { ACTS, TOTAL_CHARS, TOTAL_DURATION } from "@/data/acts";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Gauge, Mic, ScrollText } from "lucide-react";

export default function Home() {
  const minutes = Math.floor(TOTAL_DURATION / 60);
  const seconds = TOTAL_DURATION % 60;
  return (
    <div className="relative pt-2 pb-12">
      {/* 紧凑 Hero */}
      <section className="relative pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-mo-600 mb-2">
              Song · Northern Expeditions · Library
            </div>
            <h1 className="font-xiao text-4xl md:text-5xl leading-[1.1] text-mo-900 tracking-[0.1em]">
              燕云长卷 · <span className="text-zhu-500">剧本书架</span>
            </h1>
            <p className="font-brush text-xl text-mo-700 mt-3">
              <span className="text-zhu-500">高粱河车神</span>
              <span className="text-mo-500">与</span>
              <span className="text-zhu-500">雍熙悲歌</span>
              <span className="text-mo-500"> — 五卷合璧，赵光义北伐全纪实</span>
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="card-paper p-4 grid grid-cols-4 gap-4">
              <Stat icon={ScrollText} label="卷数" value={`${ACTS.length} 卷`} />
              <Stat icon={FileText} label="总字数" value={`${TOTAL_CHARS} 字`} />
              <Stat
                icon={Mic}
                label="朗读"
                value={`${minutes}'${String(seconds).padStart(2, "0")}″`}
              />
              <Stat icon={Gauge} label="速率" value="180—200 wpm" />
            </div>
          </div>
        </div>
        {/* 路径面包屑 */}
        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-mo-600">
          <span>HOME</span>
          <ArrowRight className="size-3" />
          <span className="text-zhu-500">书架</span>
          <span className="ml-3 text-mo-500">/</span>
          <Link to="/storyboard" className="link-ink ml-3">分镜表</Link>
          <span className="text-mo-500">/</span>
          <Link to="/cast" className="link-ink">人物志</Link>
          <span className="text-mo-500">/</span>
          <Link to="/fx" className="link-ink">特效</Link>
        </div>
      </section>

      {/* 书架主体 */}
      <Bookshelf />
    </div>
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
      <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.25em] text-mo-600">
        <Icon className="size-3" />
        {label}
      </div>
      <div className="font-xiao text-base text-mo-900 mt-0.5 tracking-[0.08em]">
        {value}
      </div>
    </div>
  );
}

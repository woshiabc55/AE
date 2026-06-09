// 序章
import { BookOpen, Compass, Camera } from 'lucide-react';

export default function Prologue() {
  return (
    <section id="prologue" className="relative max-w-script mx-auto px-6 py-32">
      <div className="border-l-2 border-clapper-500 pl-8 mb-12">
        <div className="slate text-clapper-500 text-[10px] mb-2">PROLOGUE · 序章</div>
        <h2 className="font-display text-5xl md:text-6xl text-parchment-50 leading-tight">
          在工具的森林里
          <br />
          <span className="italic text-gilt-300">点一盏灯</span>
        </h2>
      </div>

      <div className="font-serif text-lg md:text-xl text-parchment-100/85 leading-relaxed space-y-6">
        <p className="text-pretty">
          工具从来不只是工具。它是某个深夜里你试图翻越的山，是某个清晨你写到第二页时
          突然明白的语法，是一束你早已熟悉却叫不出名字的光。
        </p>
        <p className="text-pretty">
          我们把过去三年里出现、留下、并被反复打开的 <span className="text-clapper-500">86 件 AI 工具</span>
          ，按照"它们在创作链中扮演什么角色"重新组织。它们不是产品说明书，
          也不是排行榜；它们是一份<span className="italic">场记单</span>，一份关于
          <span className="italic"> 谁负责写字，谁负责画画，谁负责替你走进一扇门</span>的剧本。
        </p>
        <p className="text-pretty">
          每一件工具都有一段对白、一份体例说明、一行定价、一组它擅长的镜头。
          愿你读完之后，能为自己写下一份新的分镜。
        </p>
      </div>

      {/* 阅读指南 */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gilt-600/40 p-5">
          <Camera size={18} className="text-clapper-500 mb-2" />
          <div className="label mb-2">体例</div>
          <div className="font-serif text-sm text-parchment-100/80 leading-relaxed">
            每一"场"以厂牌、口号（对白）、能力、定价、链接组织。
            场记编号沿用 ID-{`{ACT}`}-{"{NNN}"} 格式，方便引用。
          </div>
        </div>
        <div className="border border-gilt-600/40 p-5">
          <Compass size={18} className="text-clapper-500 mb-2" />
          <div className="label mb-2">动线</div>
          <div className="font-serif text-sm text-parchment-100/80 leading-relaxed">
            从「文字」到「探员」共八幕，按创作链顺序展开。
            你也可以通过顶部目录与筛选自由跳转。
          </div>
        </div>
        <div className="border border-gilt-600/40 p-5">
          <BookOpen size={18} className="text-clapper-500 mb-2" />
          <div className="label mb-2">约定</div>
          <div className="font-serif text-sm text-parchment-100/80 leading-relaxed">
            「免费」表示存在免费使用层；「中文友好」表示对中国大陆网络与中文语境支持良好。
            信息截至 2026 年初，部分字段以官方页面为准。
          </div>
        </div>
      </div>

      {/* 幕分隔 */}
      <div className="mt-24 act-rule" />
    </section>
  );
}

import { Link } from "react-router-dom";
import { Clapperboard, ArrowRight } from "lucide-react";

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
      <span className="scene-tag">SCENE 06 · ABOUT</span>
      <h1 className="mt-3 font-display text-[56px] leading-[1] text-paper-50">
        使用<span className="italic text-amber">指引</span>
      </h1>

      <div className="mt-10 space-y-10 font-serif text-[16px] leading-[1.9] text-paper-200">
        <section>
          <h2 className="font-display text-[28px] text-paper-50 mb-3">一、这是什么？</h2>
          <p>
            <span className="font-display italic text-amber">萤幕 Lumière</span> 是一款云端 AI 剧本提示词模板器。
            简单说：把"写剧本要用到的结构化信息"抽成一个个可填写的字段，实时拼成一段提示词，
            一键喂给大模型，让它帮你写。
          </p>
        </section>

        <section>
          <h2 className="font-display text-[28px] text-paper-50 mb-3">二、怎么用？</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>从「Library」挑一个模板，点进去看剧本结构。</li>
            <li>点右上角「派生副本」进入 Studio。</li>
            <li>左侧填写字段（Logline、人物、节拍……），中间的提示词会实时更新。</li>
            <li>点右侧「开拍」，调用大模型流式输出剧本。</li>
            <li>满意后点「保存」，会变成「我的模板」。</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-[28px] text-paper-50 mb-3">三、数据安全</h2>
          <p>
            所有模板、收藏、调用记录默认存于浏览器 IndexedDB；API Key 存于 localStorage，
            仅直连你填写的 LLM 服务（OpenAI 兼容）。我们没有服务器。
            想要换浏览器或清缓存？先去「Workshop → 数据管理」导出 JSON 备份。
          </p>
        </section>

        <section>
          <h2 className="font-display text-[28px] text-paper-50 mb-3">四、支持的节拍模型</h2>
          <ul className="grid grid-cols-2 gap-2">
            <li className="panel p-3">三幕结构</li>
            <li className="panel p-3">英雄之旅（12 节拍）</li>
            <li className="panel p-3">救猫咪（15 节拍）</li>
            <li className="panel p-3">短篇 / 短剧</li>
            <li className="panel p-3">互动分支</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[28px] text-paper-50 mb-3">五、v1 新功能</h2>
          <div className="space-y-3">
            <div>
              <Link to="/skills" className="font-display text-[20px] text-amber hover:underline">
                → Skills · 剧本技能库
              </Link>
              <p>
                片段（Fragment）+ 宏（Macro）双轨。提示词中插入
                <code className="font-mono text-amber mx-1">@skill:cold-open</code>，
                渲染时自动展开，并支持 <code className="font-mono">{"{{var}}"}</code> 字段插值。
              </p>
            </div>
            <div>
              <Link to="/style" className="font-display text-[20px] text-amber hover:underline">
                → Style · 风格工作室
              </Link>
              <p>
                一键把视觉主题（颜色、字体）与剧本风格（导演指令、风格清单）同时布置到任意剧本。
              </p>
            </div>
            <div>
              <span className="font-display text-[20px] text-amber">→ 结构树画布</span>
              <p>
                在剧本详情页右上角点击「结构树画布」进入。基于 beatModel
                自动生成节拍层级，可拖拽重排、绑定字段、追加到提示词。
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Link to="/studio" className="reel-button">
          <Clapperboard size={12} /> 立刻开拍 <ArrowRight size={11} />
        </Link>
        <Link to="/library" className="ghost-button">
          浏览模板
        </Link>
      </div>
    </div>
  );
}

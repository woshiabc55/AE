import { useState } from "react";
import { FX } from "@/data/fx";
import { FxDonkeyDash } from "./FxDonkeyDash";
import { FxQigou } from "./FxQigou";
import { FxChenjia } from "./FxChenjia";
import { FxChanyuan } from "./FxChanyuan";
import { BrushTitle } from "@/components/common/BrushTitle";
import { cn } from "@/lib/utils";
import { Code2, ExternalLink, Sparkles } from "lucide-react";

const RENDERERS: Record<string, () => JSX.Element> = {
  "fx-donkey": FxDonkeyDash,
  "fx-qigou": FxQigou,
  "fx-chenjia": FxChenjia,
  "fx-chanyuan": FxChanyuan,
};

const CODE_SNIPPETS: Record<string, string> = {
  "fx-donkey": `// 驴车漂移
@keyframes donkeyDash {
  0%   { transform: translateX(-110px) rotate(0deg); }
  40%  { transform: translateX(40vw)  rotate(8deg); }
  50%  { transform: translateX(45vw)  rotate(-10deg); }
  60%  { transform: translateX(50vw)  rotate(6deg); }
  100% { transform: translateX(110vw) rotate(2deg); }
}`,
  "fx-qigou": `// 岐沟关溃败 — SVG 循环
<animate attributeName="cy"
         values="150;180"
         dur="1s" repeatCount="indefinite" />
<animate attributeName="opacity"
         values="1;0"
         dur="1s" repeatCount="indefinite" />`,
  "fx-chenjia": `// 陈家谷月光 + 残旗 + 落空朱印
@keyframes chenjiaFlag {
  0%,100% { transform: skewX(-6deg); }
  50%     { transform: skewX(8deg); }
}
@keyframes chenjiaStamp {
  0%   { transform: translate(60px, 60px) scale(0); opacity: 0; }
  30%  { transform: translate(0, 0) scale(1.2); opacity: 1; }
}`,
  "fx-chanyuan": `// 澶渊之盟 — 双印同步落定
@keyframes chanyuanStamp {
  0%   { transform: translateY(-60px) scale(1.4); opacity: 0; }
  30%  { transform: translateY(0) scale(1); opacity: 1; }
}`,
};

export function FxStage() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <BrushTitle
          zh="特殊效果展示"
          en="SPECIAL FX · HTML / CSS / SVG"
          seal="肆"
        />
        <div className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
          4 SCENES · REFERENCE EFFECTS
        </div>
      </div>
      <p className="font-serif text-sm text-mo-700 max-w-[68ch] mb-6">
        以下四个动效模板均由 <span className="text-zhu-500">纯 HTML / CSS / SVG</span> 实现，
        可作为「引用效果」直接套用于其他剧本场景。
        每一项都附带<span className="text-zhu-500">同步给 AI 的提示词说明</span>。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FX.map((f) => (
          <FxCard key={f.id} id={f.id} />
        ))}
      </div>
    </section>
  );
}

function FxCard({ id }: { id: string }) {
  const fx = FX.find((f) => f.id === id)!;
  const Renderer = RENDERERS[id];
  const [showCode, setShowCode] = useState(false);

  return (
    <article
      id={id}
      className="card-paper rounded-sm overflow-hidden"
    >
      {/* 标题条 */}
      <header className="px-5 py-3 flex items-center justify-between border-b border-mo-800/15">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
            FX · {fx.tech.toUpperCase()}
          </div>
          <h3 className="font-xiao text-xl text-mo-900 tracking-[0.16em]">
            {fx.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip text-[10px]">
            <Sparkles className="size-3" /> {fx.hint.split("：")[0]}
          </span>
          <button
            onClick={() => setShowCode((s) => !s)}
            className={cn(
              "font-xiao text-xs tracking-[0.2em] inline-flex items-center gap-1 px-2 py-1 rounded-sm border",
              showCode
                ? "bg-mo-900 text-xuan-100 border-mo-900"
                : "text-mo-800 border-mo-800/40 hover:bg-mo-800/5",
            )}
          >
            <Code2 className="size-3" />
            {showCode ? "隐藏代码" : "查看代码"}
          </button>
        </div>
      </header>

      {/* 画中画舞台 */}
      <div className="relative aspect-[16/9] bg-mo-900">
        {Renderer ? <Renderer /> : null}
        {/* 角落：场次说明 */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10">
          <span className="seal text-[10px]">{fx.caption}</span>
        </div>
      </div>

      {/* 说明 */}
      <div className="px-5 py-4">
        <p className="font-serif text-sm text-mo-700 leading-relaxed">
          <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600 mr-2">
            AI HINT
          </span>
          {fx.promptNote}
        </p>
      </div>

      {/* 代码区 */}
      {showCode && (
        <div className="px-5 pb-5">
          <pre className="font-mono text-[11px] leading-relaxed bg-mo-900 text-xuan-100 p-4 rounded-sm overflow-x-auto">
{CODE_SNIPPETS[id]}
          </pre>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-2 inline-flex items-center gap-1 text-xs link-ink"
          >
            <ExternalLink className="size-3" />
            在 CodePen 中打开（占位）
          </a>
        </div>
      )}
    </article>
  );
}

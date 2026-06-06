import { useState } from "react";
import { ChevronDown, Feather, Volume2, Settings2 } from "lucide-react";
import {
  scriptMeta,
  scriptScenes,
  type ScriptScene,
} from "../data/world";
import { SectionHeader, BronzeDivider } from "../lib/ornaments";

export default function ScriptSection() {
  const [openId, setOpenId] = useState<string | null>("S-01");

  return (
    <section className="relative temp-jianmu py-24 md:py-32">
      {/* 淡淡的卷轴纸纹理 */}
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-bronze-pattern" />

      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <SectionHeader
          index="02 / 03 · A"
          en="Screenplay · DAGUAMO EP-001"
          zh="大国莫剧本"
          intro={`${scriptMeta.project} · ${scriptMeta.episode}。七场分镜脚本，包含场次、景别、动作、对白、技术提示与转场。点击任一场次可展开或折叠。`}
        />

        {/* 项目元信息条 */}
        <div className="mb-12 grid grid-cols-2 gap-3 rounded-sm border border-bronze-500/40 bg-ink-900/60 p-5 md:grid-cols-4">
          <MetaItem label="PROJECT" value={scriptMeta.project} highlight />
          <MetaItem label="SERIES" value={scriptMeta.series} />
          <MetaItem label="EPISODE" value={scriptMeta.episode} />
          <MetaItem label="DRAFT" value={scriptMeta.draft} />
        </div>

        {/* 剧本主体 */}
        <div className="space-y-3">
          {scriptScenes.map((s) => (
            <SceneCard
              key={s.id}
              scene={s}
              isOpen={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          ))}
        </div>

        {/* 末注 */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <BronzeDivider />
          <p className="text-center font-display text-xs italic text-bronze-300/70">
            「建木之巅向东 · 穿界门启 · 长安朱雀一线穿入」 ——《大国莫》EP-001 终
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
        {label}
      </div>
      <div
        className={`mt-1 font-serif text-sm ${
          highlight
            ? "text-2xl font-black text-gold-200"
            : "text-base text-ink-200/85"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SceneCard({
  scene,
  isOpen,
  onToggle,
}: {
  scene: ScriptScene;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-sm border transition-all duration-500 ${
        isOpen
          ? "border-gold-500/60 bg-ink-900/70 shadow-[0_0_50px_-20px_rgba(212,162,76,0.4)]"
          : "border-bronze-600/30 bg-ink-900/40 hover:border-bronze-500/60"
      }`}
    >
      {/* 折叠头 */}
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border font-mono text-sm font-bold transition-colors ${
            isOpen
              ? "border-gold-500 text-gold-200"
              : "border-bronze-500/60 text-bronze-300"
          }`}
        >
          {scene.number.replace(/[^\d]/g, "")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3
              className={`font-serif text-lg font-bold ${
                isOpen ? "text-gold-200" : "text-ink-200/90"
              }`}
            >
              {scene.title}
            </h3>
            <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
              {scene.id}
            </span>
            <span className="font-mono text-[0.65rem] text-ink-200/50">
              · {scene.location}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-ink-200/60">
            {scene.shot} · {scene.duration}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-bronze-400 transition-transform duration-500 ${
            isOpen ? "rotate-180 text-gold-400" : ""
          }`}
        />
      </button>

      {/* 展开内容 */}
      {isOpen && (
        <div className="border-t border-bronze-600/30 bg-gradient-to-b from-ink-900/40 to-ink-950/60 px-5 py-7 md:px-8">
          {/* 视觉描述 */}
          <Block icon={<Feather className="h-3.5 w-3.5" />} label="画面 / 动作">
            <p className="font-serif text-base leading-loose text-ink-200/90">
              {scene.visual}
            </p>
          </Block>

          {/* 对白节拍 */}
          {scene.beats.length > 0 && (
            <Block
              icon={<span className="font-mono text-[0.6rem]">⌗</span>}
              label="对白"
            >
              <div className="space-y-3">
                {scene.beats.map((b, i) => (
                  <div key={i} className="pl-4 border-l-2 border-bronze-500/40">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs font-bold tracking-widest text-gold-300">
                        {b.character}
                      </span>
                      {b.parenthetical && (
                        <span className="font-display text-xs italic text-ink-200/55">
                          （{b.parenthetical}）
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-serif text-base text-ink-200/90">
                      {b.text}
                    </p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {/* 技术提示 + 音效 */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Block
              icon={<Settings2 className="h-3.5 w-3.5" />}
              label="技术提示"
            >
              <ul className="space-y-1.5">
                {scene.techNotes.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs leading-relaxed text-core-300"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-core-400" />
                    <span className="font-mono">{n}</span>
                  </li>
                ))}
              </ul>
            </Block>

            {scene.sfx && scene.sfx.length > 0 && (
              <Block
                icon={<Volume2 className="h-3.5 w-3.5" />}
                label="音效 / 配乐"
              >
                <ul className="space-y-1.5">
                  {scene.sfx.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-relaxed text-bronze-300"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bronze-400" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>

          {/* 转场条 */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-bronze-600/20 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
                TRANSITION
              </span>
              <span className="font-display text-sm italic text-gold-300">
                {scene.transition}
              </span>
            </div>
            <span className="font-mono text-[0.6rem] tracking-widest2 text-ink-200/40">
              {scene.duration}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

function Block({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <div className="mb-3 flex items-center gap-2 text-bronze-400">
        {icon}
        <span className="font-mono text-[0.6rem] tracking-widest2">{label}</span>
        <span className="h-px flex-1 bg-bronze-600/20" />
      </div>
      {children}
    </div>
  );
}

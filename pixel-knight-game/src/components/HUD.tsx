// 战斗 HUD：血条 / 专注值 / 连击 / 分数 / 波次 / Boss 血条 / 技能槽 / 过渡

import { useGameStore } from "@/store/useGameStore";
import { SKILLS, SKILL_ORDER, PASSIVES } from "@/config";
import type { SkillId, PassiveId } from "@/types";
import { Pause } from "lucide-react";

interface Props {
  onPause: () => void;
}

const KEY_LABEL: Record<SkillId, string> = Object.fromEntries(
  SKILL_ORDER.map((id) => [id, SKILLS[id].key.replace("Key", "")]),
) as Record<SkillId, string>;

export default function HUD({ onPause }: Props) {
  const hp = useGameStore((s) => s.hp);
  const maxHp = useGameStore((s) => s.maxHp);
  const focus = useGameStore((s) => s.focus);
  const maxFocus = useGameStore((s) => s.maxFocus);
  const combo = useGameStore((s) => s.combo);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const totalWaves = useGameStore((s) => s.totalWaves);
  const enemiesLeft = useGameStore((s) => s.enemiesLeft);
  const waveLabel = useGameStore((s) => s.waveLabel);
  const cooldowns = useGameStore((s) => s.cooldowns);
  const passives = useGameStore((s) => s.passives);
  const chapter = useGameStore((s) => s.chapter);
  const totalChapters = useGameStore((s) => s.totalChapters);
  const chapterName = useGameStore((s) => s.chapterName);
  const stage = useGameStore((s) => s.stage);
  const bossActive = useGameStore((s) => s.bossActive);
  const bossName = useGameStore((s) => s.bossName);
  const bossHp = useGameStore((s) => s.bossHp);
  const bossMaxHp = useGameStore((s) => s.bossMaxHp);
  const bossPhase = useGameStore((s) => s.bossPhase);
  const transitionText = useGameStore((s) => s.transitionText);

  const hpPct = Math.max(0, Math.min(1, hp / maxHp));
  const hpSegs = 10;
  const filled = Math.round(hpPct * hpSegs);
  const focusPct = Math.max(0, Math.min(1, focus / maxFocus));

  const bossPct = bossMaxHp > 0 ? Math.max(0, Math.min(1, bossHp / bossMaxHp)) : 0;

  // 过渡文案分行
  const transLines = transitionText ? transitionText.split("\n") : [];
  const bossTitleLine = transLines[0] ?? "";
  const bossNameLine = transLines[1] ?? bossName;

  const showBossIntro = stage === "bossIntro" && transitionText;
  const showCleared = stage === "cleared" && transitionText;
  const showChapterIntro =
    stage === "waves" && transLines.length >= 2 && !bossActive && wave === 1;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      {/* ===== 左上：血条 + 专注值 + 被动 ===== */}
      <div className="absolute left-5 top-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-moon anim-flicker">HP</span>
          <div className="flex gap-[2px]">
            {Array.from({ length: hpSegs }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 border-2 border-night-950 ${
                  i < filled
                    ? hpPct > 0.5
                      ? "bg-ghoul"
                      : hpPct > 0.25
                        ? "bg-gold"
                        : "bg-blood"
                    : "bg-night-800"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="font-term text-2xl text-moon leading-none">
          {hp}
          <span className="text-moon/40">/{maxHp}</span>
        </div>

        {/* 专注值条 */}
        <div className="mt-1 flex items-center gap-2">
          <span className="font-pixel text-[9px] text-ember-core">FP</span>
          <div className="relative h-2.5 w-40 border-2 border-night-950 bg-night-800">
            <div
              className="h-full transition-[width] duration-100"
              style={{
                width: `${focusPct * 100}%`,
                background:
                  focusPct > 0.6
                    ? "linear-gradient(90deg,#ffd23f,#ff8a3c)"
                    : "linear-gradient(90deg,#5fd0ff,#ffd23f)",
              }}
            />
          </div>
          <span className="font-term text-base text-ember-core/80 leading-none">
            {focus}/{maxFocus}
          </span>
        </div>

        {/* 被动图标行 */}
        {passives.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 max-w-[220px]">
            {passives.map((id) => (
              <span
                key={id}
                className="border border-night-950 bg-night-800/80 px-1.5 py-0.5 font-term text-xs text-ghoul leading-none"
                title={PASSIVES[id].desc}
              >
                {PASSIVES[id].name}
              </span>
            ))}
          </div>
        )}

        {combo > 1 && (
          <div className="anim-in mt-1 flex items-baseline gap-1">
            <span className="font-pixel text-2xl text-ember drop-shadow-[0_0_8px_rgba(255,87,51,0.7)]">
              {combo}
            </span>
            <span className="font-pixel text-[10px] text-gold">COMBO</span>
          </div>
        )}
      </div>

      {/* ===== 顶部中央：章节 / Boss 血条 ===== */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[520px] text-center">
        {bossActive ? (
          <div className="anim-in">
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-pixel text-[11px] text-blood anim-flicker">
                {bossName}
              </span>
              <span className="font-term text-sm text-moon/50">
                PHASE {bossPhase}/2
              </span>
            </div>
            <div className="relative mx-auto mt-1 h-4 w-full border-2 border-night-950 bg-night-900">
              <div
                className="h-full transition-[width] duration-150"
                style={{
                  width: `${bossPct * 100}%`,
                  background:
                    bossPhase >= 2
                      ? "linear-gradient(90deg,#7a0f1a,#c01828,#ff5733)"
                      : "linear-gradient(90deg,#5a0f1a,#c01828)",
                }}
              />
              {/* 阶段分隔刻度 */}
              <div className="absolute inset-y-0 left-1/2 w-px bg-night-950/80" />
            </div>
            <div className="font-term text-base text-moon/40 mt-0.5">
              {Math.ceil(bossHp)} / {bossMaxHp}
            </div>
          </div>
        ) : (
          <>
            <div className="font-pixel text-[10px] text-moon/50">
              第 {chapter}/{totalChapters} 章 · {chapterName}
            </div>
            <div className="font-pixel text-[10px] text-ember-fire anim-flicker mt-1">
              {waveLabel}
            </div>
            <div className="font-term text-xl text-moon/80 mt-1">
              波次 {wave}/{totalWaves} · 剩余 {enemiesLeft}
            </div>
          </>
        )}
      </div>

      {/* ===== 右上：分数 + 暂停 ===== */}
      <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
        <button
          onClick={onPause}
          className="pointer-events-auto border-2 border-night-950 bg-night-800/80 px-3 py-2 text-moon hover:bg-night-700"
          title="暂停 (Esc)"
        >
          <Pause size={16} />
        </button>
        <div className="text-right">
          <div className="font-pixel text-[9px] text-moon/50">SCORE</div>
          <div className="font-term text-3xl text-gold leading-none drop-shadow-[0_2px_0_#000]">
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ===== 底部中央：技能槽 ===== */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="flex items-end gap-1.5">
          {SKILL_ORDER.map((id) => {
            const def = SKILLS[id];
            const cd = cooldowns[id] ?? 0;
            const cdPct = def.cooldown > 0 ? cd / def.cooldown : 0;
            const ready = cd <= 0;
            const enoughFocus = focus >= def.cost;
            const dim = !ready || !enoughFocus;
            return (
              <div
                key={id}
                className="relative flex h-14 w-12 flex-col items-center justify-end overflow-hidden border-2 border-night-950 bg-night-900"
                style={{
                  boxShadow: ready
                    ? `inset 0 0 0 1px ${def.color}55, 0 0 8px ${def.color}33`
                    : undefined,
                  opacity: dim ? 0.55 : 1,
                }}
                title={`${def.name} · ${def.desc}`}
              >
                {/* 冷却覆盖（从顶部下扫） */}
                {cd > 0 && (
                  <div
                    className="absolute inset-x-0 top-0 bg-night-950/75"
                    style={{ height: `${cdPct * 100}%` }}
                  />
                )}
                {/* 技能色条 */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ background: def.color }}
                />
                {/* 按键 */}
                <span
                  className="font-pixel text-[10px] mt-1"
                  style={{ color: enoughFocus ? def.color : "#c01828" }}
                >
                  {KEY_LABEL[id]}
                </span>
                {/* 名称 */}
                <span className="font-term text-xs text-moon/70 leading-tight mb-1.5 px-0.5 text-center">
                  {def.name}
                </span>
                {/* 专注消耗 */}
                <span
                  className="font-term text-[10px] mb-2"
                  style={{ color: enoughFocus ? "#ffd23f" : "#c01828" }}
                >
                  {def.cost}FP
                </span>
                {/* 冷却数字 */}
                {cd > 0 && (
                  <span className="absolute inset-0 flex items-center justify-center font-pixel text-sm text-moon drop-shadow-[0_0_4px_#000]">
                    {Math.ceil(cd)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1 text-center font-term text-xs text-moon/40">
          Q/E/R/F · V/C/X/Z 释放技能 · 普攻与技能回复专注
        </div>
      </div>

      {/* ===== 右下：操作提示 ===== */}
      <div className="absolute right-5 bottom-5 text-right font-term text-lg text-moon/50 leading-tight">
        <div>A/D 移动 · 空格 跳跃 · J 攻击</div>
        <div>Shift 冲刺 · 双段跳 · Esc 暂停</div>
      </div>

      {/* ===== 居中过渡覆盖 ===== */}
      {(showBossIntro || showCleared || showChapterIntro) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-night-950/55" />
          <div className="anim-in relative flex flex-col items-center gap-3 text-center px-8">
            {showBossIntro && (
              <>
                <div className="font-pixel text-[10px] text-blood anim-flicker">
                  ⚠ BOSS ⚠
                </div>
                <h2
                  className="font-pixel text-4xl text-moon"
                  style={{ textShadow: "4px 4px 0 #0b0814, 0 0 18px #c0182888" }}
                >
                  {bossTitleLine}
                </h2>
                <div className="font-term text-3xl text-blood">{bossNameLine}</div>
              </>
            )}
            {showCleared && (
              <>
                <div className="font-pixel text-[10px] text-ghoul anim-flicker">
                  ◆ 章节通关 ◆
                </div>
                <h2
                  className="font-pixel text-3xl text-gold"
                  style={{ textShadow: "4px 4px 0 #0b0814" }}
                >
                  {transLines[0] ?? "封印破除"}
                </h2>
                <div className="font-term text-2xl text-moon/80">
                  {transLines[1] ?? "晨曦之力觉醒"}
                </div>
                {passives.length > 0 && (
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <span className="font-pixel text-[9px] text-ember-core">
                      觉醒被动
                    </span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {passives.map((id: PassiveId) => (
                        <span
                          key={id}
                          className="border border-night-950 bg-night-800 px-2 py-1 font-term text-sm text-ghoul"
                        >
                          {PASSIVES[id].name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {showChapterIntro && (
              <>
                <div className="font-pixel text-[9px] text-moon/50">
                  第 {chapter} 章 / 共 {totalChapters} 章
                </div>
                <h2
                  className="font-pixel text-2xl text-moon"
                  style={{ textShadow: "3px 3px 0 #0b0814" }}
                >
                  {transLines[0]}
                </h2>
                <div className="font-term text-2xl text-ember-fire">
                  {transLines[1]}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

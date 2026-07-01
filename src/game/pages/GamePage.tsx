// P0 验收页面：跑通"出牌→事件→规则裁决→ECS状态变更→UI投影"全链路
// 纯规则、零 AI。验证：可出牌、可撤销、可重放自检、时代门禁生效

import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { EntityId } from '../types';
import { ERAS } from '../content/eras';
import {
  Swords, Wheat, Coins, Sparkles, Flag, History,
  SkipForward, Plus, Undo2, CheckCheck, RefreshCw, Target,
} from 'lucide-react';

const ERA_COLORS: Record<string, string> = {
  stone: 'text-stone-300',
  bronze: 'text-amber-400',
  iron: 'text-slate-300',
  classical: 'text-violet-300',
  medieval: 'text-emerald-300',
  gunpowder: 'text-orange-400',
  industrial: 'text-cyan-300',
  modern: 'text-rose-300',
};

const TYPE_COLOR: Record<string, string> = {
  unit: 'border-ember-400/60',
  building: 'border-mint-400/60',
  action: 'border-sun-500/60',
  policy: 'border-violet-400/60',
};

export default function GamePage() {
  const view = useGameStore((s) => s.view);
  const log = useGameStore((s) => s.log);
  const toast = useGameStore((s) => s.toast);
  const replayCheck = useGameStore((s) => s.replayCheck);
  const playCard = useGameStore((s) => s.playCard);
  const endTurn = useGameStore((s) => s.endTurn);
  const advanceEra = useGameStore((s) => s.advanceEra);
  const drawCard = useGameStore((s) => s.drawCard);
  const undo = useGameStore((s) => s.undo);
  const replayVerify = useGameStore((s) => s.replayVerify);
  const newGame = useGameStore((s) => s.newGame);
  const clearToast = useGameStore((s) => s.clearToast);

  // 选目标态：打出需要目标的卡时，先选中卡，再点目标势力
  const [pendingCard, setPendingCard] = useState<EntityId | null>(null);

  // toast 自动消失
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2600);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  const onCardClick = (card: { instanceId: EntityId; needsTarget: boolean; playable: boolean }) => {
    if (!card.playable) return;
    if (card.needsTarget) {
      setPendingCard(card.instanceId);
    } else {
      playCard(card.instanceId);
    }
  };

  const onFactionClick = (factionId: EntityId) => {
    if (pendingCard) {
      playCard(pendingCard, factionId);
      setPendingCard(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-ink-900 bg-noise font-mono text-ink-100">
      {/* 顶栏：时代状态 + 操作 */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-ink-600/60 bg-ink-800/40">
        <div className="flex items-center gap-5">
          <div className="font-pixel text-ember-400 text-glow-ember text-sm tracking-wider">造史者</div>
          <div className="flex items-center gap-4 text-xs">
            <span className={`${ERA_COLORS[view.era]}`}>
              {view.eraName}
            </span>
            <span className="text-ink-400">第 <span className="text-sun-500 font-bold">{view.turn}</span> 回合</span>
            <span className="text-ink-400">文明熵 <span className="text-mint-400 font-bold">{view.entropy}</span></span>
            {pendingCard && (
              <span className="text-ember-400 animate-pulse flex items-center gap-1">
                <Target size={12} /> 选择目标势力
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToolBtn onClick={drawCard} icon={<Plus size={14} />} label="抽牌" />
          <ToolBtn onClick={endTurn} icon={<SkipForward size={14} />} label="结束回合" />
          <ToolBtn onClick={advanceEra} disabled={!view.nextEra} icon={<History size={14} />} label={view.nextEra ? `跃迁·${view.nextEra.name}` : '已是顶点'} />
          <ToolBtn onClick={undo} icon={<Undo2 size={14} />} label="撤销" />
          <ToolBtn
            onClick={replayVerify}
            icon={<CheckCheck size={14} />}
            label="重放自检"
            tone={replayCheck === 'pass' ? 'mint' : replayCheck === 'fail' ? 'danger' : 'default'}
          />
          <ToolBtn onClick={newGame} icon={<RefreshCw size={14} />} label="新对局" />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* 左：势力面板 */}
        <aside className="w-72 border-r border-ink-600/60 bg-ink-800/30 p-4 overflow-y-auto">
          <SectionTitle icon={<Flag size={13} />} text="势力" />
          <div className="space-y-3 mt-3">
            {view.factions.map((f) => {
              const isTargetCandidate = pendingCard && !f.isPlayer;
              return (
                <button
                  key={f.id}
                  onClick={() => isTargetCandidate && onFactionClick(f.id)}
                  disabled={!isTargetCandidate}
                  className={`w-full text-left rounded-lg p-3 border transition-all ${
                    f.isPlayer
                      ? 'border-ember-400/40 bg-ember-400/5'
                      : isTargetCandidate
                        ? 'border-rose-400/60 bg-rose-400/10 hover:bg-rose-400/20 cursor-pointer animate-pulse'
                        : 'border-ink-600/40 bg-ink-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: f.color }}>
                      {f.name}
                      {f.isPlayer && <span className="text-ink-500 text-[10px] ml-1">(你)</span>}
                    </span>
                    <span className="text-[10px] text-ink-500">手牌 {f.handCount}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    <Stat icon={<Coins size={11} />} val={f.gold} color="text-amber-300" />
                    <Stat icon={<Wheat size={11} />} val={f.food} color="text-lime-300" />
                    <Stat icon={<Swords size={11} />} val={f.troops} color="text-rose-300" />
                    <Stat icon={<Sparkles size={11} />} val={f.prestige} color="text-violet-300" />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-400">
                    士气
                    <div className="flex-1 h-1.5 bg-ink-900 rounded">
                      <div
                        className="h-full rounded bg-gradient-to-r from-rose-500 to-ember-400"
                        style={{ width: `${Math.max(0, Math.min(100, f.morale))}%` }}
                      />
                    </div>
                    <span className="text-ember-400">{f.morale}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 中：手牌 */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-ink-600/60">
            <SectionTitle icon={<Swords size={13} />} text="我的手牌" />
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {view.hand.length === 0 ? (
              <div className="h-full flex items-center justify-center text-ink-500 text-xs">
                手牌已空 — 点击「抽牌」补充
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {view.hand.map((card) => (
                  <button
                    key={card.instanceId}
                    onClick={() => onCardClick(card)}
                    disabled={!card.playable}
                    className={`text-left rounded-lg p-3 border-2 bg-ink-900/60 transition-all ${
                      TYPE_COLOR[card.type] ?? 'border-ink-600/40'
                    } ${card.playable ? 'hover:scale-[1.02] hover:bg-ink-900/90 cursor-pointer' : 'opacity-40 cursor-not-allowed'} ${
                      pendingCard === card.instanceId ? 'ring-2 ring-ember-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-ink-100">{card.name}</span>
                      <span className={`text-[9px] ${ERA_COLORS[card.era]}`}>{ERAS[card.era].name}</span>
                    </div>
                    <div className="text-[10px] text-ink-400 mb-2">
                      {typeLabel(card.type)}
                      {card.needsTarget && <span className="ml-1 text-rose-400">·指定目标</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] mb-1">
                      {card.cost.gold ? (
                        <span className="flex items-center gap-0.5 text-amber-300"><Coins size={10} />{card.cost.gold}</span>
                      ) : null}
                      {card.cost.food ? (
                        <span className="flex items-center gap-0.5 text-lime-300"><Wheat size={10} />{card.cost.food}</span>
                      ) : null}
                    </div>
                    {card.flavor && <div className="text-[10px] text-ink-500 italic mt-1">{card.flavor}</div>}
                    {card.playBlockedReason && (
                      <div className="text-[10px] text-rose-400 mt-1">{card.playBlockedReason}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* 右：事件日志（真相来源的可视化） */}
        <aside className="w-72 border-l border-ink-600/60 bg-ink-800/30 p-4 overflow-y-auto">
          <SectionTitle icon={<History size={13} />} text="编年史" />
          <div className="space-y-1.5 mt-3">
            {log.length === 0 ? (
              <div className="text-ink-500 text-[11px]">历史尚未开始……</div>
            ) : (
              log.slice().reverse().map((entry, i) => (
                <div
                  key={i}
                  className="rounded px-2.5 py-1.5 bg-ink-900/50 border border-ink-600/30 text-[11px]"
                >
                  <div className="flex items-center justify-between text-[9px] text-ink-500 mb-0.5">
                    <span>T{entry.turn} · {ERAS[entry.era].name}</span>
                    <span className={entry.source === 'player' ? 'text-ember-400' : 'text-ink-500'}>
                      {entry.source}
                    </span>
                  </div>
                  <div className="text-ink-200">{entry.text}</div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-lg text-xs border backdrop-blur ${
            replayCheck === 'fail' || toast.includes('不足') || toast.includes('失败')
              ? 'bg-rose-900/80 border-rose-500/50 text-rose-100'
              : replayCheck === 'pass'
                ? 'bg-mint-900/80 border-mint-500/50 text-mint-100'
                : 'bg-ink-800/90 border-ink-500/50 text-ink-100'
          }`}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-pixel text-ink-300 uppercase tracking-wider">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Stat({ icon, val, color }: { icon: React.ReactNode; val: number; color: string }) {
  return (
    <span className={`flex items-center gap-1 ${color}`}>
      {icon}
      <span className="font-bold">{val}</span>
    </span>
  );
}

function ToolBtn({
  onClick, icon, label, disabled, tone = 'default',
}: {
  onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean;
  tone?: 'default' | 'mint' | 'danger';
}) {
  const toneCls =
    tone === 'mint' ? 'border-mint-500/50 text-mint-300 hover:bg-mint-500/10'
    : tone === 'danger' ? 'border-rose-500/50 text-rose-300 hover:bg-rose-500/10'
    : 'border-ink-500/40 text-ink-300 hover:bg-ink-700/40 hover:text-ink-100';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-[11px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${toneCls}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function typeLabel(t: string): string {
  return { unit: '单位', building: '建筑', action: '行动', policy: '政策' }[t] ?? t;
}

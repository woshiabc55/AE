// 游戏状态 store：串起 RuleEngine + CommandBus + StateManager + 投影
// store 持有投影快照 GameView（纯数据，zustand 友好）+ 事件日志 + 反馈消息
// 可复现性：AI 输出随事件持久化；undo 用快照回退；replay 从 timeline 重建并自检

import { create } from 'zustand';
import type { Command, EntityId, GameEvent } from '../types';
import { EventBus, RuleEngine, StateManager, CommandBus } from '../engine';
import { RULES } from '../content/rules';
import { bootstrapWorld } from '../content/bootstrap';
import { projectGame, type GameView } from '../projection/projection';

export interface LogEntry {
  turn: number;
  era: string;
  type: GameEvent['type'];
  text: string;
  source: GameEvent['source'];
}

interface GameState {
  view: GameView;
  log: LogEntry[];
  toast: string | null; // 反馈消息（出牌失败原因等）
  replayCheck: 'idle' | 'pass' | 'fail';

  dispatch: (cmd: Command) => boolean; // 返回是否成功
  playCard: (cardInstanceId: EntityId, targetFactionId?: EntityId) => boolean;
  endTurn: () => void;
  advanceEra: () => void;
  drawCard: () => void;
  undo: () => void;
  replayVerify: () => void;
  newGame: () => void;
  clearToast: () => void;
}

// 引擎实例（单例，不放进 zustand state，避免可变对象污染）
let bus: EventBus;
let rules: RuleEngine;
let state: StateManager;
let cmds: CommandBus;
let playerFactionId: EntityId;

function initEngine() {
  const boot = bootstrapWorld();
  bus = new EventBus();
  rules = new RuleEngine();
  for (const r of RULES) rules.register(r);
  state = new StateManager(boot.world);
  cmds = new CommandBus(rules, state, bus);
  playerFactionId = boot.playerFactionId;
}

function snapshot(): { view: GameView; log: LogEntry[] } {
  const view = projectGame(state.world, playerFactionId);
  const log: LogEntry[] = state.timeline.map((e) => eventToLog(e));
  return { view, log };
}

function eventToLog(e: GameEvent): LogEntry {
  let text = e.flavor ?? '';
  if (!text) {
    switch (e.type) {
      case 'CARD_PLAYED':
        text = '打出一张卡牌';
        break;
      case 'TURN_ENDED':
        text = '回合结束';
        break;
      case 'ERA_ADVANCED':
        text = '时代跃迁';
        break;
      case 'CARD_DRAWN':
        text = '抽牌';
        break;
      default:
        text = e.commandType ?? '事件';
    }
  }
  return { turn: e.turn, era: e.era, type: e.type, text, source: e.source };
}

function reproject(set: (fn: (s: GameState) => Partial<GameState>) => void) {
  const snap = snapshot();
  set(() => ({ view: snap.view, log: snap.log }));
}

export const useGameStore = create<GameState>((set, get) => {
  initEngine();
  const initial = snapshot();

  return {
    view: initial.view,
    log: initial.log,
    toast: null,
    replayCheck: 'idle',

    dispatch(cmd) {
      const res = cmds.dispatch(cmd);
      if (!res.ok) {
        set({ toast: res.reason ?? '操作失败' });
        return false;
      }
      reproject(set);
      return true;
    },

    playCard(cardInstanceId, targetFactionId) {
      return get().dispatch({
        type: 'PLAY_CARD',
        payload: { cardInstanceId, targetFactionId },
        source: 'player',
      });
    },

    endTurn() {
      get().dispatch({ type: 'END_TURN', payload: {}, source: 'player' });
    },

    advanceEra() {
      const next = get().view.nextEra;
      if (!next) return;
      get().dispatch({ type: 'ADVANCE_ERA', payload: { era: next.era }, source: 'player' });
    },

    drawCard() {
      get().dispatch({ type: 'DRAW_CARD', payload: { factionId: playerFactionId }, source: 'player' });
    },

    undo() {
      const ev = state.undo();
      if (ev) {
        reproject(set);
        set({ toast: `撤销：${eventToLog(ev).text}` });
      }
    },

    replayVerify() {
      const pass = state.verifyReplay();
      set({ replayCheck: pass ? 'pass' : 'fail', toast: pass ? '重放一致性自检通过' : '重放一致性失败' });
    },

    newGame() {
      initEngine();
      const snap = snapshot();
      set({ view: snap.view, log: snap.log, toast: '新对局开始', replayCheck: 'idle' });
    },

    clearToast() {
      set({ toast: null });
    },
  };
});

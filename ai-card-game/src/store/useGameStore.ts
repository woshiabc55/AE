import { create } from "zustand";
import type { GameContext } from "@/game";
import { createGameContext, initGame } from "@/game";
import { FACTION_TEMPLATES } from "@/game/factions";
import { CARD_TEMPLATES } from "@/game/cards";
import { ERA_LABELS } from "@/types";
import type { GameEvent, Era } from "@/types";
import { advanceTurn, director } from "@/systems/historyEngine";
import { playCard, drawCard } from "@/systems/cardSystem";
import { runOpponentTurns } from "@/systems/opponentAI";
import { startDialogue, chooseDialogueOption } from "@/systems/dialogueSystem";
import { computeHandView, type HandView } from "@/projection/views/handView";
import { computeFactionView, type FactionView } from "@/projection/views/factionView";
import {
  computeCausalView,
  computeEventLog,
  type CausalView,
} from "@/projection/views/causalView";
import type { DialogueTurn } from "@/types";

interface GameStore {
  ctx: GameContext | null;
  era: Era;
  eraLabel: string;
  turn: number;
  version: number; // 递增触发投影重算
  hand: HandView;
  factions: FactionView[];
  causal: CausalView;
  eventLog: GameEvent[];
  lastMessage: string | null;
  busy: boolean;
  currentDialogue: DialogueTurn | null;
  activeNPCId: string | null;

  startGame: (playerFactionId: string, opponentCount?: number) => void;
  doPlayCard: (cardId: string, target?: string) => Promise<void>;
  doDrawCard: (count?: number) => Promise<void>;
  doAdvanceTurn: () => Promise<void>;
  doStartDialogue: (npcId: string) => Promise<void>;
  doChooseOption: (optionId: string) => Promise<void>;
  closeDialogue: () => void;
  recompute: () => void;
}

function emptyViews() {
  return {
    hand: { cards: [], count: 0 } as HandView,
    factions: [] as FactionView[],
    causal: { nodes: [], edges: [], depth: 0 } as CausalView,
    eventLog: [] as GameEvent[],
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ctx: null,
  era: "ancient",
  eraLabel: ERA_LABELS.ancient,
  turn: 0,
  version: 0,
  lastMessage: null,
  busy: false,
  currentDialogue: null,
  activeNPCId: null,
  ...emptyViews(),

  startGame: (playerFactionId, opponentCount = 3) => {
    const ctx = createGameContext(Date.now());
    initGame(ctx, playerFactionId, opponentCount);
    const store = get();
    store.recompute();
    set({
      ctx,
      era: ctx.world.era,
      eraLabel: ERA_LABELS[ctx.world.era],
      turn: ctx.world.turn,
      lastMessage: `对局开始：${FACTION_TEMPLATES.find((f) => f.id === playerFactionId)?.name} 起手。`,
    });
    get().recompute();
  },

  doPlayCard: async (cardId, target) => {
    const { ctx } = get();
    if (!ctx) return;
    set({ busy: true });
    const result = await playCard(ctx, cardId, target);
    set({
      busy: false,
      lastMessage: result.accepted ? `出牌成功。` : `出牌失败：${result.reason}`,
    });
    get().recompute();
  },

  doDrawCard: async (count = 1) => {
    const { ctx } = get();
    if (!ctx) return;
    set({ busy: true });
    await drawCard(ctx, count);
    set({ busy: false, lastMessage: `抽取 ${count} 张卡牌。` });
    get().recompute();
  },

  doAdvanceTurn: async () => {
    const { ctx } = get();
    if (!ctx) return;
    set({ busy: true });
    // 1. 玩家先可出牌（已由 UI 触发）；2. 回合推进；3. 对手行动
    await advanceTurn(ctx);
    await runOpponentTurns(ctx);
    set({
      busy: false,
      era: ctx.world.era,
      eraLabel: ERA_LABELS[ctx.world.era],
      turn: ctx.world.turn,
      lastMessage: `第 ${ctx.world.turn} 回合 · ${ERA_LABELS[ctx.world.era]}`,
    });
    get().recompute();
  },

  doStartDialogue: async (npcId) => {
    const { ctx } = get();
    if (!ctx) return;
    set({ busy: true });
    const turn = await startDialogue(ctx, npcId);
    set({ busy: false, currentDialogue: turn, activeNPCId: npcId });
    get().recompute();
  },

  doChooseOption: async (optionId) => {
    const { ctx, currentDialogue, activeNPCId } = get();
    if (!ctx || !currentDialogue || !activeNPCId) return;
    set({ busy: true });
    const { nextTurn } = await chooseDialogueOption(ctx, activeNPCId, optionId, currentDialogue);
    set({
      busy: false,
      currentDialogue: nextTurn ?? null,
      lastMessage: `对话选项已记录。`,
    });
    get().recompute();
  },

  closeDialogue: () => set({ currentDialogue: null, activeNPCId: null }),

  recompute: () => {
    const { ctx } = get();
    if (!ctx) return;
    set({
      hand: computeHandView(ctx),
      factions: computeFactionView(ctx),
      causal: computeCausalView(ctx),
      eventLog: computeEventLog(ctx),
      version: get().version + 1,
    });
  },
}));

export { director, CARD_TEMPLATES };

import type {
  DirectorDirective,
  World,
  CausalGraph,
  StoryArc,
  SuspenseDirective,
  ForeshadowSeed,
  SuspenseReveal,
} from "@/types";
import { aiService } from "./AIService";
import { DirectorDirectiveSchema } from "./schemas";
import { directorFallback } from "./fallbacks";
import { getUnresolvedSuspense, getDueSuspense, markRevealed } from "@/engine/CausalGraph";
import { nanoid } from "nanoid";

export interface DirectorInput {
  turn: number;
  rng: () => number;
}

/**
 * Director AI（导演）— 多智能体编排器，悬疑叙事的幕后操盘手。
 *
 * 本质重构：从"三幕剧节拍器"升级为"悬疑故事编排器"。
 *
 * 核心职责：
 * 1. 故事弧线管理：维护多条并行的悬疑弧线（伏笔-悬念-揭示）
 * 2. 信息不对称：NPC 知道但玩家不知道的真相，制造戏剧张力
 * 3. 张力曲线：基于未揭示悬念数量动态调节
 * 4. 弧线编排：决定本回合埋什么伏笔、揭示什么悬念
 *
 * 悬疑生成的核心原则：
 * - 公平推理：所有线索都对玩家可见，只是真相隐藏
 * - 延迟满足：伏笔与揭示之间至少间隔 2 回合
 * - 多弧并行：同时运行 2-3 条弧线，避免单一线性
 */
export class Director {
  private current: DirectorDirective | null = null;
  /** 维护的故事弧线库 */
  private arcs: StoryArc[] = [];
  /** 当前悬疑指令 */
  private suspenseDirective: SuspenseDirective | null = null;

  async direct(input: DirectorInput): Promise<DirectorDirective> {
    const fallback = directorFallback({ turn: input.turn, rng: input.rng });
    const { data, trace } = await aiService.request<DirectorDirective>({
      task: "director",
      input: { turn: input.turn },
      schema: DirectorDirectiveSchema,
      fallback,
      tier: "fast",
    });
    this.current = data;
    void trace;
    return data;
  }

  currentDirective(): DirectorDirective | null {
    return this.current;
  }

  /**
   * 悬疑叙事编排 — 本回合的伏笔/揭示决策。
   * 这是 Director 的核心新增能力。
   */
  orchestrateSuspense(graph: CausalGraph, world: World, rng: () => number): SuspenseDirective {
    const turn = world.turn;

    // 1. 初始化弧线库（首次调用时）
    if (this.arcs.length === 0) {
      this.arcs = this.generateInitialArcs(world);
    }

    // 2. 推进弧线阶段
    this.advanceArcPhases(turn);

    // 3. 确定本回合应埋的伏笔
    const foreshadowsToPlant: ForeshadowSeed[] = [];
    for (const arc of this.arcs) {
      if (
        arc.status === "active" &&
        arc.currentPhase === "foreshadow" &&
        turn >= arc.phases.foreshadow.startTurn &&
        turn <= arc.phases.foreshadow.endTurn
      ) {
        // 伏笔阶段内，每回合有 40% 概率埋一条新伏笔
        if (rng() < 0.4) {
          const seed = this.generateForeshadowSeed(arc, turn, rng);
          foreshadowsToPlant.push(seed);
        }
      }
    }

    // 4. 确定本回合应揭示的悬念
    const suspenseToReveal: SuspenseReveal[] = [];
    const dueSuspense = getDueSuspense(graph, turn);
    for (const due of dueSuspense) {
      if (due.suspense) {
        const arc = this.arcs.find((a) => a.theme.includes(due.suspense!.question.slice(0, 4)));
        suspenseToReveal.push({
          arcId: arc?.id ?? "unknown",
          truth: due.suspense.question + "——真相终于大白。",
          seedEventId: due.id,
          involvesNpc: due.suspense.involves?.[0],
        });
        // 标记为已揭示（实际揭示事件由 historyAgent 生成）
      }
    }

    // 5. 计算张力等级：未揭示悬念越多，张力越高
    const unresolved = getUnresolvedSuspense(graph);
    const tensionLevel = Math.min(100, 20 + unresolved.length * 15 + suspenseToReveal.length * 10);

    // 6. 生成信息不对称提示
    const asymmetricHints = this.generateAsymmetricHints(world, rng);

    this.suspenseDirective = {
      activeArcs: this.arcs.filter((a) => a.status === "active"),
      foreshadowsToPlant,
      suspenseToReveal,
      tensionLevel,
      asymmetricHints,
    };

    return this.suspenseDirective;
  }

  /** 生成初始故事弧线库 — 基于战国历史经典悬疑 */
  private generateInitialArcs(world: World): StoryArc[] {
    const arcs: StoryArc[] = [];
    const baseTurn = world.turn;

    // 弧线1：远交近攻的暗流（秦之谋略）
    arcs.push({
      id: nanoid(8),
      theme: "远交近攻的暗流",
      phases: {
        foreshadow: { startTurn: baseTurn + 2, endTurn: baseTurn + 4 },
        suspense: { startTurn: baseTurn + 5, endTurn: baseTurn + 7 },
        reveal: { startTurn: baseTurn + 8, endTurn: baseTurn + 9 },
      },
      involvedNpcs: ["npc_fanju"],
      involvedFactions: ["qin"],
      currentPhase: "foreshadow",
      status: "pending",
      hiddenTruth: "范雎献远交近攻之策，秦王密谋齐楚而先取韩魏",
    });

    // 弧线2：将相和的暗裂（赵国内斗）
    arcs.push({
      id: nanoid(8),
      theme: "将相和的暗裂",
      phases: {
        foreshadow: { startTurn: baseTurn + 3, endTurn: baseTurn + 5 },
        suspense: { startTurn: baseTurn + 6, endTurn: baseTurn + 8 },
        reveal: { startTurn: baseTurn + 9, endTurn: baseTurn + 10 },
      },
      involvedNpcs: ["npc_linxiangru"],
      involvedFactions: ["zhao"],
      currentPhase: "foreshadow",
      status: "pending",
      hiddenTruth: "廉颇老将自负功高，与蔺相如暗中不和，将相失和危及赵国",
    });

    // 弧线3：稷下学宫的预言（齐之衰落）
    arcs.push({
      id: nanoid(8),
      theme: "稷下学宫的预言",
      phases: {
        foreshadow: { startTurn: baseTurn + 4, endTurn: baseTurn + 6 },
        suspense: { startTurn: baseTurn + 7, endTurn: baseTurn + 9 },
        reveal: { startTurn: baseTurn + 10, endTurn: baseTurn + 11 },
      },
      involvedNpcs: ["npc_zouyan"],
      involvedFactions: ["qi"],
      currentPhase: "foreshadow",
      status: "pending",
      hiddenTruth: "邹衍观星象知齐将衰，五德终始之论暗指齐之气数",
    });

    return arcs;
  }

  /** 推进弧线阶段 */
  private advanceArcPhases(currentTurn: number): void {
    for (const arc of this.arcs) {
      if (arc.status === "resolved") continue;
      if (arc.status === "pending" && currentTurn >= arc.phases.foreshadow.startTurn) {
        arc.status = "active";
      }
      if (currentTurn >= arc.phases.foreshadow.endTurn && arc.currentPhase === "foreshadow") {
        arc.currentPhase = "suspense";
      }
      if (currentTurn >= arc.phases.suspense.endTurn && arc.currentPhase === "suspense") {
        arc.currentPhase = "reveal";
      }
      if (currentTurn >= arc.phases.reveal.endTurn && arc.currentPhase === "reveal") {
        arc.currentPhase = "closed";
        arc.status = "resolved";
      }
    }
  }

  /** 生成伏笔种子 */
  private generateForeshadowSeed(arc: StoryArc, turn: number, rng: () => number): ForeshadowSeed {
    const hints = FORESHADOW_TEMPLATES[arc.theme] ?? FORESHADOW_TEMPLATES["default"];
    const hint = hints[Math.floor(rng() * hints.length)];
    return {
      theme: arc.theme,
      arcId: arc.id,
      hint,
      involvesNpc: arc.involvedNpcs?.[0],
      revealByTurn: arc.phases.reveal.startTurn,
    };
  }

  /** 生成信息不对称提示 */
  private generateAsymmetricHints(world: World, rng: () => number): string[] {
    const hints: string[] = [];
    const activeArcs = this.arcs.filter((a) => a.status === "active");
    for (const arc of activeArcs) {
      if (arc.hiddenTruth && rng() < 0.3) {
        // 30% 概率泄露一丝暗示（非真相）
        const npcName = arc.involvedNpcs?.[0] ?? "某人";
        hints.push(`${npcName}似有所思，目光闪烁不定。`);
      }
    }
    return hints;
  }

  /** 标记悬念已揭示 */
  revealSuspense(graph: CausalGraph, suspenseEventId: string, revealEventId: string): void {
    markRevealed(graph, suspenseEventId, revealEventId);
  }

  /** 获取当前悬疑指令 */
  currentSuspense(): SuspenseDirective | null {
    return this.suspenseDirective;
  }

  /** 评估叙事张力 */
  evaluateTension(graph: CausalGraph, world: World): number {
    const unresolved = getUnresolvedSuspense(graph);
    let tension = 20;
    // 未揭示悬念越多，张力越高
    tension += unresolved.length * 12;
    // 近期战争/叛乱事件加张力
    const nodes = Array.from(graph.nodes.values()).slice(-4);
    for (const e of nodes) {
      if (e.type === "WAR_DECLARED" || e.type === "REBELLION") tension += 10;
      if (e.type === "ALLIANCE_FORMED") tension -= 5;
    }
    return Math.min(100, Math.max(0, tension));
  }
}

/** 伏笔模板库 — 按弧线主题分类的模糊暗示 */
const FORESHADOW_TEMPLATES: Record<string, string[]> = {
  "远交近攻的暗流": [
    "秦使密赴齐楚，所谈何事？",
    "范雎深夜入宫，秦王屏退左右，所议何事？",
    "魏国细作回报：秦与齐似有密约。",
    "函谷关守将换防，调令来源不明。",
  ],
  "将相和的暗裂": [
    "廉颇老将军近日面色不豫，朝会称病不朝。",
    "蔺相如避道让行，旁人皆惑其意。",
    "赵国朝堂暗分两派，将相之间似有嫌隙。",
    "邯郸城内流传童谣，暗有所指。",
  ],
  "稷下学宫的预言": [
    "邹衍夜观天象，面露忧色，不语而退。",
    "稷下学宫的先生们窃窃私语，似有所隐瞒。",
    "齐王近闻谶语，心绪不宁。",
    "临淄市井流传'齐气数将尽'之说。",
  ],
  default: [
    "朝堂之上，暗流涌动。",
    "某大臣深夜密会，所议何事？",
    "边境传来异报，详情未明。",
  ],
};

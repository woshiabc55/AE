import type { Team } from "./operators";

export type MatchPhase = "prep" | "combat" | "roundOver" | "matchOver";

export interface MatchSnapshot {
  round: number;
  scoreAlpha: number;
  scoreBravo: number;
  ticketsAlpha: number;
  ticketsBravo: number;
  captureProgress: number; // -100..+100
  phase: MatchPhase;
  phaseTimer: number; // 剩余阶段时间(秒)
  captureOwner: "alpha" | "bravo" | "neutral";
  matchWinner: Team | null;
  roundWinner: Team | null;
}

interface MatchContext {
  alphaAlive: () => number; // 含玩家(若存活)+友军 bot
  bravoAlive: () => number;
  captureCount: () => { alpha: number; bravo: number; playerIn: boolean };
  onRoundStart: () => void;
  onRoundEnd: (winner: Team) => void;
  onMatchEnd: (winner: Team) => void;
}

const PREP_TIME = 3;
const ROUND_OVER_TIME = 4;
const MATCH_TARGET = 3; // 先夺 3 回合
const TICKETS_PER_ROUND = 14;
const CAPTURE_RATE = 14; // 每秒每人占领速率

export class MatchManager {
  round = 1;
  scoreAlpha = 0;
  scoreBravo = 0;
  ticketsAlpha = TICKETS_PER_ROUND;
  ticketsBravo = TICKETS_PER_ROUND;
  captureProgress = 0;
  phase: MatchPhase = "prep";
  phaseTimer = PREP_TIME;
  captureOwner: "alpha" | "bravo" | "neutral" = "neutral";
  matchWinner: Team | null = null;
  roundWinner: Team | null = null;

  private ctx: MatchContext;

  constructor(ctx: MatchContext) {
    this.ctx = ctx;
    // 不在此自动 startRound——交由调用方在赋值完成后显式调用，
    // 避免 onRoundStart 回调读取尚未赋值的字段。
  }

  // 开始一个新回合：重置票数/进度 + 通知 spawn
  startRound() {
    this.ticketsAlpha = TICKETS_PER_ROUND;
    this.ticketsBravo = TICKETS_PER_ROUND;
    this.captureProgress = 0;
    this.captureOwner = "neutral";
    this.roundWinner = null;
    this.phase = "prep";
    this.phaseTimer = PREP_TIME;
    this.ctx.onRoundStart();
  }

  resetRound() {
    this.startRound();
  }

  snapshot(): MatchSnapshot {
    return {
      round: this.round,
      scoreAlpha: this.scoreAlpha,
      scoreBravo: this.scoreBravo,
      ticketsAlpha: this.ticketsAlpha,
      ticketsBravo: this.ticketsBravo,
      captureProgress: this.captureProgress,
      phase: this.phase,
      phaseTimer: this.phaseTimer,
      captureOwner: this.captureOwner,
      matchWinner: this.matchWinner,
      roundWinner: this.roundWinner,
    };
  }

  consumeTicket(team: Team) {
    if (team === "alpha") this.ticketsAlpha = Math.max(0, this.ticketsAlpha - 1);
    else this.ticketsBravo = Math.max(0, this.ticketsBravo - 1);
  }

  canRespawn(team: Team): boolean {
    return team === "alpha" ? this.ticketsAlpha > 0 : this.ticketsBravo > 0;
  }

  update(dt: number) {
    if (this.phase === "matchOver") return;

    if (this.phase === "prep") {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        this.phase = "combat";
      }
      return;
    }

    if (this.phase === "roundOver") {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        // 进入下一回合或结束
        if (this.scoreAlpha >= MATCH_TARGET || this.scoreBravo >= MATCH_TARGET) {
          this.phase = "matchOver";
          this.matchWinner = this.scoreAlpha >= MATCH_TARGET ? "alpha" : "bravo";
          this.ctx.onMatchEnd(this.matchWinner);
        } else {
          this.round++;
          this.startRound();
        }
      }
      return;
    }

    // combat 阶段
    // 1. 占领进度
    const cc = this.ctx.captureCount();
    const alphaN = cc.alpha + (cc.playerIn ? 1 : 0);
    const bravoN = cc.bravo;
    if (alphaN > bravoN) {
      this.captureProgress = Math.min(100, this.captureProgress + CAPTURE_RATE * (alphaN - bravoN) * dt);
    } else if (bravoN > alphaN) {
      this.captureProgress = Math.max(-100, this.captureProgress - CAPTURE_RATE * (bravoN - alphaN) * dt);
    }
    // 占有方
    const prevOwner = this.captureOwner;
    if (this.captureProgress > 5) this.captureOwner = "alpha";
    else if (this.captureProgress < -5) this.captureOwner = "bravo";
    else this.captureOwner = "neutral";

    // 2. 回合胜负判定
    let winner: Team | null = null;
    if (this.captureProgress >= 100) winner = "alpha";
    else if (this.captureProgress <= -100) winner = "bravo";
    else if (this.ticketsAlpha <= 0 && this.ctx.alphaAlive() === 0) winner = "bravo";
    else if (this.ticketsBravo <= 0 && this.ctx.bravoAlive() === 0) winner = "alpha";

    if (winner) {
      this.roundWinner = winner;
      if (winner === "alpha") this.scoreAlpha++;
      else this.scoreBravo++;
      this.phase = "roundOver";
      this.phaseTimer = ROUND_OVER_TIME;
      this.ctx.onRoundEnd(winner);
    }
    void prevOwner;
  }
}

export { MATCH_TARGET, TICKETS_PER_ROUND };

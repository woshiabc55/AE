import type { GameState, KeyState, MechaId, Difficulty } from './types';
import { KEY_MAP, MECHA_WIDTH, MECHA_HEIGHT, GROUND_Y, SKILL_CONFIG } from './constants';

const DIFFICULTY_SETTINGS: Record<Difficulty, { reaction: number; aggression: number; errorRate: number }> = {
  easy: { reaction: 25, aggression: 0.35, errorRate: 0.4 },
  normal: { reaction: 14, aggression: 0.6, errorRate: 0.2 },
  hard: { reaction: 6, aggression: 0.85, errorRate: 0.05 },
};

export class MechaAI {
  private actionTimer = 0;
  private targetDistance = 80;
  private rngSeed = 0;

  constructor(
    private difficulty: Difficulty,
    private meId: MechaId,
  ) {}

  reset(): void {
    this.actionTimer = 0;
    this.rngSeed = 0;
  }

  update(state: GameState, keys: KeyState): void {
    const me = state[this.meId];
    const target = state[this.meId === 'red' ? 'blue' : 'red'];
    const map = KEY_MAP[this.meId];
    const settings = DIFFICULTY_SETTINGS[this.difficulty];

    // 清空上一帧输入
    Object.values(map).forEach((code) => {
      keys[this.meId][code] = false;
    });

    if (me.state === 'ko' || state.screen !== 'fighting') return;

    const dx = target.x - me.x;
    const distance = Math.abs(dx);
    const facingTarget = dx > 0 ? 1 : -1;

    this.actionTimer--;

    // 周期性决策
    if (this.actionTimer <= 0) {
      this.actionTimer = settings.reaction + this.randomInt(8);
      this.targetDistance = 55 + this.randomInt(80);
    }

    // 面向目标
    if (me.state !== 'attack' && me.state !== 'skill' && me.state !== 'hurt' && me.state !== 'dash') {
      me.facing = facingTarget;
    }

    // 移动接近
    if (distance > this.targetDistance) {
      keys[this.meId][facingTarget === 1 ? map.right : map.left] = true;
    } else if (distance < 45) {
      keys[this.meId][facingTarget === 1 ? map.left : map.right] = true;
    }

    // 跳跃越过障碍或拉开
    if (me.y + MECHA_HEIGHT >= GROUND_Y - 1 && this.randomFloat() < 0.03 * settings.aggression) {
      keys[this.meId][map.jump] = true;
    }

    // 防御：看到对方攻击前摇
    if (target.state === 'attack' || target.state === 'skill' || target.state === 'throw') {
      if (distance < 130 && this.randomFloat() < 0.6 * (1 - settings.errorRate)) {
        keys[this.meId][map.defend] = true;
      }
    }

    // 随机反击
    if (this.randomFloat() < 0.02 * settings.aggression && me.cooldowns.counter <= 0) {
      keys[this.meId][map.counter] = true;
    }

    // 攻击决策
    if (this.randomFloat() < settings.aggression) {
      if (distance < SKILL_CONFIG.attack.range + MECHA_WIDTH && me.cooldowns.attack <= 0) {
        keys[this.meId][map.attack] = true;
      } else if (distance < SKILL_CONFIG.skill1.range + MECHA_WIDTH && me.cooldowns.skill1 <= 0 && this.randomFloat() > settings.errorRate) {
        keys[this.meId][map.skill1] = true;
      } else if (distance < SKILL_CONFIG.skill2.range + MECHA_WIDTH && me.cooldowns.skill2 <= 0 && this.randomFloat() > settings.errorRate * 1.5) {
        keys[this.meId][map.skill2] = true;
      } else if (distance < SKILL_CONFIG.throw.range + MECHA_WIDTH && me.cooldowns.skill2 <= 0 && this.randomFloat() < 0.4) {
        keys[this.meId][map.skill2] = true;
      } else if (me.cooldowns.projectile <= 0 && this.randomFloat() > settings.errorRate) {
        keys[this.meId][map.projectile] = true;
      }
    }

    // 冲刺
    if (distance > 140 && me.cooldowns.dash <= 0 && this.randomFloat() < 0.05 * settings.aggression) {
      keys[this.meId][map.dash] = true;
    }

    // 必杀
    if (me.cooldowns.ultimate <= 0 && me.hp < 60 && distance < SKILL_CONFIG.ultimate.range + MECHA_WIDTH && this.randomFloat() < 0.3 * settings.aggression) {
      keys[this.meId][map.ultimate] = true;
    }
  }

  private randomFloat(): number {
    this.rngSeed = (this.rngSeed * 9301 + 49297) % 233280;
    return this.rngSeed / 233280;
  }

  private randomInt(max: number): number {
    return Math.floor(this.randomFloat() * max);
  }
}

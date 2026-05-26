import {
  MECHA_W,
  MECHA_H,
  MOVE_SPEED,
  JUMP_FORCE,
  GRAVITY,
  MAX_HP,
  MAX_ENERGY,
  ENERGY_REGEN,
  ATTACK_ENERGY_COST,
  DEFEND_ENERGY_COST,
  DEFEND_REDUCTION,
  ATTACK_DURATION,
  ATTACK_HIT_START,
  ATTACK_HIT_END,
  HURT_DURATION,
  GROUND_Y,
  ATTACK_RANGE,
  CANVAS_WIDTH,
} from '../utils/constants';
import type { Palette } from '../utils/sprite';
import { drawMecha, P1_PALETTE, P2_PALETTE } from '../utils/sprite';
import type { InputManager } from '../engine/InputManager';

export type MechaState = 'idle' | 'move' | 'jump' | 'attack' | 'defend' | 'hurt';

export type MechaConfig = {
  x: number;
  palette: Palette;
  facingRight: boolean;
  leftKey: string;
  rightKey: string;
  jumpKey: string;
  attackKey: string;
  defendKey: string;
  name: string;
};

export class Mecha {
  x: number;
  y: number;
  velocityX = 0;
  velocityY = 0;
  hp = MAX_HP;
  energy = MAX_ENERGY;
  state: MechaState = 'idle';
  facingRight: boolean;
  stateTimer = 0;
  globalFrame = 0;
  palette: Palette;
  hasHit = false;

  private leftKey: string;
  private rightKey: string;
  private jumpKey: string;
  private attackKey: string;
  private defendKey: string;
  name: string;

  constructor(config: MechaConfig) {
    this.x = config.x;
    this.y = GROUND_Y;
    this.palette = config.palette;
    this.facingRight = config.facingRight;
    this.leftKey = config.leftKey;
    this.rightKey = config.rightKey;
    this.jumpKey = config.jumpKey;
    this.attackKey = config.attackKey;
    this.defendKey = config.defendKey;
    this.name = config.name;
  }

  get isOnGround(): boolean {
    return this.y >= GROUND_Y;
  }

  get attackBox(): { x: number; y: number; w: number; h: number } | null {
    if (this.state !== 'attack') return null;
    if (this.stateTimer < ATTACK_HIT_START || this.stateTimer > ATTACK_HIT_END) return null;
    const dir = this.facingRight ? 1 : -1;
    return {
      x: this.x + dir * (MECHA_W / 2),
      y: this.y - MECHA_H * 0.6,
      w: ATTACK_RANGE,
      h: MECHA_H * 0.4,
    };
  }

  get hitBox(): { x: number; y: number; w: number; h: number } {
    return {
      x: this.x - MECHA_W / 2,
      y: this.y - MECHA_H,
      w: MECHA_W,
      h: MECHA_H,
    };
  }

  handleInput(input: InputManager) {
    if (this.state === 'hurt' || this.state === 'attack') return;

    if (this.state !== 'defend') {
      this.velocityX = 0;
      if (input.isDown(this.leftKey)) {
        this.velocityX = -MOVE_SPEED;
        this.state = 'move';
      }
      if (input.isDown(this.rightKey)) {
        this.velocityX = MOVE_SPEED;
        this.state = 'move';
      }
      if (this.velocityX === 0 && this.isOnGround && this.state === 'move') {
        this.state = 'idle';
      }
    }

    if (input.wasPressed(this.jumpKey) && this.isOnGround && this.state !== 'defend') {
      this.velocityY = JUMP_FORCE;
      this.state = 'jump';
    }

    if (input.wasPressed(this.attackKey) && this.state !== 'defend' && this.energy >= ATTACK_ENERGY_COST) {
      this.state = 'attack';
      this.stateTimer = 0;
      this.hasHit = false;
      this.energy -= ATTACK_ENERGY_COST;
      this.velocityX = 0;
    }

    if (input.isDown(this.defendKey) && this.isOnGround && this.state !== 'attack' && this.energy > 0) {
      this.state = 'defend';
      this.velocityX = 0;
    } else if (this.state === 'defend' && (!input.isDown(this.defendKey) || this.energy <= 0)) {
      this.state = 'idle';
    }
  }

  update() {
    this.globalFrame++;
    this.stateTimer++;

    if (this.state === 'attack' && this.stateTimer >= ATTACK_DURATION) {
      this.state = 'idle';
      this.stateTimer = 0;
    }

    if (this.state === 'hurt' && this.stateTimer >= HURT_DURATION) {
      this.state = 'idle';
      this.stateTimer = 0;
    }

    if (this.state !== 'defend' && this.state !== 'attack') {
      this.energy = Math.min(MAX_ENERGY, this.energy + ENERGY_REGEN);
    }

    if (this.state === 'defend') {
      this.energy = Math.max(0, this.energy - DEFEND_ENERGY_COST);
      if (this.energy <= 0) {
        this.state = 'idle';
      }
    }

    this.velocityY += GRAVITY;
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.velocityY = 0;
      if (this.state === 'jump') {
        this.state = 'idle';
      }
    }

    this.x = Math.max(MECHA_W / 2, Math.min(CANVAS_WIDTH - MECHA_W / 2, this.x));
  }

  takeDamage(amount: number, fromRight: boolean) {
    if (this.state === 'defend') {
      amount = amount * (1 - DEFEND_REDUCTION);
    }
    this.hp = Math.max(0, this.hp - amount);
    this.state = 'hurt';
    this.stateTimer = 0;
    this.velocityX = fromRight ? -4 : 4;
    this.velocityY = -3;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawMecha(
      ctx,
      this.x,
      this.y,
      this.palette,
      this.state,
      this.globalFrame,
      this.facingRight,
      this.state === 'hurt',
    );
  }

  reset(x: number) {
    this.x = x;
    this.y = GROUND_Y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.hp = MAX_HP;
    this.energy = MAX_ENERGY;
    this.state = 'idle';
    this.stateTimer = 0;
    this.globalFrame = 0;
    this.hasHit = false;
  }
}

export function createP1(x: number): Mecha {
  return new Mecha({
    x,
    palette: P1_PALETTE,
    facingRight: true,
    leftKey: 'a',
    rightKey: 'd',
    jumpKey: 'w',
    attackKey: 'j',
    defendKey: 'k',
    name: '赤焰',
  });
}

export function createP2(x: number): Mecha {
  return new Mecha({
    x,
    palette: P2_PALETTE,
    facingRight: false,
    leftKey: 'arrowleft',
    rightKey: 'arrowright',
    jumpKey: 'arrowup',
    attackKey: 'l',
    defendKey: ';',
    name: '苍雷',
  });
}

function boxOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function checkAttack(attacker: Mecha, defender: Mecha): boolean {
  const atkBox = attacker.attackBox;
  if (!atkBox || attacker.hasHit) return false;
  const defBox = defender.hitBox;
  return boxOverlap(atkBox, defBox);
}

export function pushApart(a: Mecha, b: Mecha) {
  const aBox = a.hitBox;
  const bBox = b.hitBox;
  if (!boxOverlap(aBox, bBox)) return;

  const overlapX = Math.min(aBox.x + aBox.w, bBox.x + bBox.w) - Math.max(aBox.x, bBox.x);
  const push = overlapX / 2 + 1;
  if (a.x < b.x) {
    a.x -= push;
    b.x += push;
  } else {
    a.x += push;
    b.x -= push;
  }
}

export function updateFacing(a: Mecha, b: Mecha) {
  a.facingRight = a.x < b.x;
  b.facingRight = b.x < a.x;
}

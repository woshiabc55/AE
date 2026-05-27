export interface PhysicsConfig {
  strength: number;
  damping: number;
  stiffness: number;
}

export type PhysicsForce = 'none' | 'gravity' | 'wind' | 'explode' | 'wave3d' | 'spring';

const DEFAULT_CONFIG: PhysicsConfig = {
  strength: 1.0,
  damping: 0.95,
  stiffness: 0.02,
};

export class PhysicsEngine {
  private originalPositions: Float32Array = new Float32Array(0);
  private velocities: Float32Array = new Float32Array(0);
  private config: PhysicsConfig = { ...DEFAULT_CONFIG };
  private currentForce: PhysicsForce = 'none';
  private time = 0;

  init(positions: Float32Array): void {
    this.originalPositions = new Float32Array(positions);
    this.velocities = new Float32Array(positions.length);
    this.time = 0;
  }

  setForce(force: PhysicsForce): void {
    this.currentForce = force;
  }

  setConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  step(dt: number): Float32Array {
    this.time += dt;
    const positions = new Float32Array(this.originalPositions);
    const len = this.originalPositions.length;
    const { strength, damping, stiffness } = this.config;

    for (let i = 0; i < len; i++) {
      let force = 0;
      const original = this.originalPositions[i]!;

      switch (this.currentForce) {
        case 'gravity': {
          if (i % 3 === 1) {
            force = strength * 200;
          }
          break;
        }
        case 'wind': {
          if (i % 3 === 0) {
            force = strength * 80 * Math.sin(this.time * 2 + original * 0.01);
          }
          break;
        }
        case 'explode': {
          const center = 0;
          const diff = original - center;
          force = strength * 300 * Math.sign(diff) * Math.exp(-this.time * 0.5);
          break;
        }
        case 'wave3d': {
          const axisIdx = i % 3;
          if (axisIdx === 2) {
            const x = this.originalPositions[i - 2] ?? 0;
            const y = this.originalPositions[i - 1] ?? 0;
            force = strength * 100 * Math.sin(x * 0.02 + this.time * 3) * Math.cos(y * 0.02 + this.time * 2);
          }
          break;
        }
        case 'spring': {
          force = -stiffness * (positions[i]! - original) * 60;
          break;
        }
        case 'none':
        default:
          break;
      }

      this.velocities[i] = (this.velocities[i]! + force * dt) * damping;
      positions[i] = this.originalPositions[i]! + this.velocities[i]! * dt;
    }

    return positions;
  }

  reset(): void {
    this.velocities.fill(0);
    this.time = 0;
    this.currentForce = 'none';
  }

  getForce(): PhysicsForce {
    return this.currentForce;
  }

  getConfig(): Readonly<PhysicsConfig> {
    return this.config;
  }
}

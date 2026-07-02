// 敌人波次刷新器

import { Enemy } from "@/entities/Enemy";
import { WAVES, WORLD_RIGHT } from "@/config";

type SpawnCallback = (e: Enemy) => void;

export class Spawner {
  private waveIndex = 0;
  private toSpawn = 0;
  private spawnTimer = 0;
  private interval = 1;
  private spawning = false;
  private waiting = false; // 本波已全部生成，等待清场
  private done = false;

  wave = 1;
  totalWaves = WAVES.length;
  waveLabel = WAVES[0].label;
  enemiesLeft = 0;
  onVictory?: () => void;

  start() {
    this.waveIndex = 0;
    this.done = false;
    this.beginWave();
  }

  private beginWave() {
    const w = WAVES[this.waveIndex];
    this.toSpawn = w.count;
    this.enemiesLeft = w.count;
    this.interval = w.interval;
    this.spawnTimer = 1.2; // 波次提示后稍等
    this.spawning = true;
    this.waiting = false;
    this.wave = this.waveIndex + 1;
    this.waveLabel = w.label;
  }

  update(dt: number, enemies: Enemy[], onSpawn: SpawnCallback) {
    if (this.done) return;

    if (this.spawning) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.toSpawn > 0) {
        const fromLeft = Math.random() < 0.25;
        const x = fromLeft ? -120 : WORLD_RIGHT + 60;
        const e = new Enemy(x);
        enemies.push(e);
        onSpawn(e);
        this.toSpawn--;
        this.spawnTimer = this.interval;
      }
      if (this.toSpawn <= 0) {
        this.spawning = false;
        this.waiting = true;
      }
    } else if (this.waiting) {
      if (enemies.length === 0) {
        // 本波清场
        if (this.waveIndex >= WAVES.length - 1) {
          this.done = true;
          this.onVictory?.();
        } else {
          this.waveIndex++;
          this.beginWave();
        }
      }
    }
  }

  /** 敌人死亡后调用以更新剩余计数 */
  notifyKill() {
    this.enemiesLeft = Math.max(0, this.enemiesLeft - 1);
  }

  get isDone() {
    return this.done;
  }
}

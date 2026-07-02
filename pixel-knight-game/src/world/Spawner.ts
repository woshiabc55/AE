// 敌人波次刷新器

import { Enemy } from "@/entities/Enemy";
import { WAVES, WORLD_RIGHT, type ChapterDef } from "@/config";

type SpawnCallback = (e: Enemy) => void;
type WaveConfig = { count: number; interval: number; label: string };

export class Spawner {
  private waveIndex = 0;
  private toSpawn = 0;
  private spawnTimer = 0;
  private interval = 1;
  private spawning = false;
  private waiting = false;
  private done = false;
  private waves: WaveConfig[] = WAVES;

  wave = 1;
  totalWaves = WAVES.length;
  waveLabel = WAVES[0].label;
  enemiesLeft = 0;
  onVictory?: () => void;
  /** 自定义生成函数（由 LevelManager 设置以生成不同类型敌人） */
  spawnFn?: (x: number) => Enemy;

  setWaves(waves: WaveConfig[]) {
    this.waves = waves;
    this.totalWaves = waves.length;
  }

  start() {
    this.waveIndex = 0;
    this.done = false;
    this.beginWave();
  }

  private beginWave() {
    const w = this.waves[this.waveIndex];
    this.toSpawn = w.count;
    this.enemiesLeft = w.count;
    this.interval = w.interval;
    this.spawnTimer = 1.2;
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
        const e = this.spawnFn ? this.spawnFn(x) : new Enemy(x);
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
        if (this.waveIndex >= this.waves.length - 1) {
          this.done = true;
          this.onVictory?.();
        } else {
          this.waveIndex++;
          this.beginWave();
        }
      }
    }
  }

  notifyKill() {
    this.enemiesLeft = Math.max(0, this.enemiesLeft - 1);
  }

  get isDone() {
    return this.done;
  }
}

void (null as unknown as ChapterDef);

// 关卡管理器：章节推进、波次刷新、Boss 出场、被动解锁

import { CHAPTERS, type ChapterDef } from "@/config";
import { Spawner } from "@/world/Spawner";
import { Enemy } from "@/entities/Enemy";
import { Boss } from "@/entities/Boss";
import { createBoss } from "@/entities/bosses";
import type { PassiveId } from "@/types";

export type ChapterStage = "waves" | "bossIntro" | "boss" | "cleared" | "finished";

export interface ChapterState {
  chapter: number;
  totalChapters: number;
  chapterName: string;
  chapterSubtitle: string;
  stage: ChapterStage;
  bossActive: boolean;
  bossName: string;
  bossDefeated: boolean;
  transitionText: string;
}

export class LevelManager {
  private chapterIndex = 0;
  spawner = new Spawner();
  boss: Boss | null = null;
  stage: ChapterStage = "waves";
  private stageTimer = 0;
  private transitionText = "";

  state: ChapterState;
  onChapterChange?: (c: ChapterDef) => void;
  onPassivesUnlock?: (ids: PassiveId[]) => void;
  onVictory?: () => void;

  constructor() {
    this.spawner.onVictory = () => {
      this.startBossIntro();
    };
    this.state = this.buildState();
  }

  private get chapter(): ChapterDef {
    return CHAPTERS[this.chapterIndex];
  }

  private buildState(): ChapterState {
    return {
      chapter: this.chapterIndex + 1,
      totalChapters: CHAPTERS.length,
      chapterName: this.chapter.name,
      chapterSubtitle: this.chapter.subtitle,
      stage: this.stage,
      bossActive: false,
      bossName: this.boss?.def.name ?? "",
      bossDefeated: false,
      transitionText: this.transitionText,
    };
  }

  start() {
    this.chapterIndex = 0;
    this.startChapter();
  }

  private startChapter() {
    this.stage = "waves";
    this.stageTimer = 0;
    this.boss = null;
    this.transitionText = `${this.chapter.subtitle}\n${this.chapter.name}`;
    this.spawner = new Spawner();
    this.spawner.onVictory = () => this.startBossIntro();
    // 用本章节波次配置启动
    this.spawner.setWaves(this.chapter.waves);
    this.spawner.start();
    this.onChapterChange?.(this.chapter);
    this.state = this.buildState();
  }

  private startBossIntro() {
    this.stage = "bossIntro";
    this.stageTimer = 0;
    const def = this.chapter.boss;
    this.boss = createBoss(def, 900);
    this.transitionText = `${def.title}\n${def.name}`;
  }

  private startBossFight() {
    this.stage = "boss";
    this.stageTimer = 0;
    this.state = this.buildState();
  }

  /** 生成敌人（按章节类型） */
  spawnEnemy(x: number): Enemy {
    const types = this.chapter.enemyTypes;
    const kind = types[Math.floor(Math.random() * types.length)];
    const e = new Enemy(x);
    e.kind = kind;
    return e;
  }

  update(dt: number, enemies: Enemy[], onSpawn: (e: Enemy) => void) {
    this.stageTimer += dt;

    if (this.stage === "waves") {
      this.spawner.update(dt, enemies, onSpawn);
    } else if (this.stage === "bossIntro") {
      if (this.stageTimer > 2.2) {
        this.startBossFight();
      }
    } else if (this.stage === "boss") {
      // Boss 战中也会刷新少量小怪（除第一章外）
      if (this.chapterIndex > 0 && Math.random() < 0.004) {
        const x = Math.random() < 0.5 ? -100 : 2700;
        onSpawn(this.spawnEnemy(x));
      }
    } else if (this.stage === "cleared") {
      if (this.stageTimer > 2.5) {
        // 解锁被动
        if (this.chapter.unlockPassives.length > 0) {
          this.onPassivesUnlock?.(this.chapter.unlockPassives);
        }
        // 下一章
        if (this.chapterIndex < CHAPTERS.length - 1) {
          this.chapterIndex++;
          this.startChapter();
        } else {
          this.stage = "finished";
          this.onVictory?.();
        }
      }
    }
  }

  /** Boss 死亡后调用 */
  notifyBossDefeated() {
    this.stage = "cleared";
    this.stageTimer = 0;
    this.boss = null;
    this.transitionText = "封印破除\n晨曦之力觉醒";
  }

  get currentChapter() {
    return this.chapter;
  }

  get wave() {
    return this.spawner.wave;
  }
  get totalWaves() {
    return this.chapter.waves.length;
  }
  get enemiesLeft() {
    return this.spawner.enemiesLeft;
  }
  get waveLabel() {
    return this.spawner.waveLabel;
  }
}

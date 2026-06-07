/* 宋太宗北伐 - 增强版像素游戏
   4 关卡历史战役 + 敌人 AI + Boss + 道具 + 音效 + 排行榜
*/

// === 关卡配置 ===
const LEVELS = [
  {
    id: "gaolianghe",
    name: "第一关 · 高粱河突围",
    subtitle: "979年七月 · 驾驴车逃出辽军包围",
    bgColor: "#2d4a2d",
    bgPattern: "grass",
    bgm: "tense",
    map: [
      "TTTTTTTTTTTTTTTT",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "T....BB....BB..T",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "T....BB....BB..T",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "TTTTTTTTTTTTTTTT"
    ],
    player: { x: 1, y: 6, type: "emperor" },
    goal: { x: 14, y: 6, label: "→ 涿州" },
    enemyTypes: ["khitan_archer", "khitan_cavalry"],
    boss: null,
    duration: 60,
    story: "高粱河之战，赵光义中箭后乘驴车逃命。驾！驾！驾！"
  },
  {
    id: "qigouguan",
    name: "第二关 · 岐沟关大撤退",
    subtitle: "986年五月 · 东路军崩溃",
    bgColor: "#3a2a1a",
    bgPattern: "mud",
    bgm: "battle",
    map: [
      "TTTTTTTTTTTTTTTT",
      "T..............T",
      "TCCCCCC.CC.CC..T",
      "T..............T",
      "T...BBBB.BB....T",
      "T..............T",
      "T..C.CC.CC.CC..T",
      "T..............T",
      "T.BB.BB...BBB..T",
      "T..............T",
      "T.CC..C.CCC.CC.T",
      "T..............T",
      "TTTTTTTTTTTTTTTT"
    ],
    player: { x: 1, y: 6, type: "general" },
    goal: { x: 14, y: 6, label: "→ 开封" },
    enemyTypes: ["khitan_cavalry", "khitan_chief", "arrow_volley"],
    boss: { type: "yeluxiuge", hp: 5, x: 13, y: 6 },
    duration: 90,
    story: "耶律休哥追击！十日血战，宋军崩溃。"
  },
  {
    id: "chenjiagu",
    name: "第三关 · 雪夜陈家谷",
    subtitle: "986年六月 · 杨业血战殉国",
    bgColor: "#1a2a4a",
    bgPattern: "snow",
    bgm: "tragic",
    map: [
      "TTTTTTTTTTTTTTTT",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "T....BB....BB..T",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "T....BB....BB..T",
      "T..............T",
      "T..CC.CC.CC.CC.T",
      "T..............T",
      "TTTTTTTTTTTTTTTT"
    ],
    player: { x: 1, y: 6, type: "yangye" },
    goal: { x: 12, y: 6, label: "→ 陈家谷口" },
    enemyTypes: ["khitan_chief", "khitan_archer"],
    boss: { type: "wangshen", hp: 3, x: 8, y: 6 },
    duration: 75,
    story: "杨业力战，谷口空无一人。千古忠魂。"
  },
  {
    id: "chanyuan",
    name: "第四关 · 澶渊之盟",
    subtitle: "1004年 · 百年和平",
    bgColor: "#3a3a5a",
    bgPattern: "palace",
    bgm: "peaceful",
    map: [
      "TTTTTTTTTTTTTTTT",
      "T..............T",
      "T....C..C..C...T",
      "T..............T",
      "T.....BB.......T",
      "T..............T",
      "T....C..C..C...T",
      "T..............T",
      "T.....BB.......T",
      "T..............T",
      "T....C..C..C...T",
      "T..............T",
      "TTTTTTTTTTTTTTTT"
    ],
    player: { x: 1, y: 6, type: "emperor" },
    goal: { x: 14, y: 6, label: "→ 澶州和议" },
    enemyTypes: [],
    boss: null,
    duration: 30,
    story: "百年战乱，终成一纸和约。"
  }
];

// === 敌人类型定义 ===
const ENEMY_DEFS = {
  khitan_archer: {
    name: "契丹弓骑兵",
    hp: 1, speed: 0.5, color: "#3e2723", score: 10,
    behavior: "patrol_h",
    desc: "游牧轻骑兵，远程骚扰"
  },
  khitan_cavalry: {
    name: "契丹重骑兵",
    hp: 2, speed: 0.8, color: "#2c1810", score: 20,
    behavior: "chase",
    desc: "具装甲骑，正面突击"
  },
  khitan_chief: {
    name: "契丹将校",
    hp: 3, speed: 0.6, color: "#8b1a1a", score: 50,
    behavior: "smart_chase",
    desc: "精锐先锋，会预判玩家位置"
  },
  arrow_volley: {
    name: "流矢",
    hp: 1, speed: 0, color: "#8b6f47", score: 5,
    behavior: "static_hazard",
    desc: "战场流矢，触之即伤"
  },
  yeluxiuge: {
    name: "耶律休哥",
    hp: 8, speed: 1.0, color: "#2c7873", score: 200,
    behavior: "boss_chase",
    isBoss: true,
    desc: "辽国第一名将，克星降临"
  },
  wangshen: {
    name: "监军王侁",
    hp: 4, speed: 0.7, color: "#5d4e8c", score: 100,
    behavior: "boss_runaway",
    isBoss: true,
    desc: "陷害杨业的元凶"
  }
};

// === 道具类型 ===
const POWERUP_DEFS = {
  heal: { name: "御酒补血", color: "#ff5252", symbol: "❤", effect: "heal", amount: 1 },
  shield: { name: "天子护盾", color: "#2196f3", symbol: "🛡", effect: "shield", duration: 300 },
  score2x: { name: "岁币双倍", color: "#ffc107", symbol: "★", effect: "score2x", duration: 300 },
  speed: { name: "汗血宝马", color: "#9c27b0", symbol: "⚡", effect: "speed", duration: 300 }
};

// === 音效系统 (Web Audio API) ===
class AudioSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmOsc = null;
  }
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.ctx = null;
    }
  }
  beep(freq, dur, type = "sine", vol = 0.1) {
    if (!this.ctx || this.muted) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.value = freq;
    o.type = type;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }
  sfx(name) {
    if (!this.ctx || this.muted) return;
    switch (name) {
      case "hit": this.beep(150, 0.15, "square", 0.15); break;
      case "shoot": this.beep(800, 0.08, "sawtooth", 0.1); break;
      case "powerup": this.beep(523, 0.1); setTimeout(()=>this.beep(659, 0.1), 100); setTimeout(()=>this.beep(784, 0.15), 200); break;
      case "die": this.beep(200, 0.5, "sawtooth", 0.2); break;
      case "win": [523,659,784,1047].forEach((f,i)=>setTimeout(()=>this.beep(f,0.2,"sine",0.15), i*150)); break;
      case "levelup": this.beep(440, 0.2); setTimeout(()=>this.beep(660, 0.3), 200); break;
      case "boss": this.beep(80, 0.6, "sawtooth", 0.2); break;
    }
  }
  toggleMute() { this.muted = !this.muted; return this.muted; }
}

const audio = new AudioSystem();

// === 排行榜 ===
class ScoreBoard {
  constructor() {
    this.key = "songshiz_scoreboard";
    this.data = this.load();
  }
  load() {
    try {
      const d = JSON.parse(localStorage.getItem(this.key));
      if (d && d.scores) return d;
    } catch (e) {}
    return { scores: [] };
  }
  save() {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {}
  }
  add(level, score, name = "赵光义") {
    this.data.scores.push({ level, score, name, time: Date.now() });
    this.data.scores.sort((a, b) => b.score - a.score);
    this.data.scores = this.data.scores.slice(0, 20);
    this.save();
  }
  getTop(level, n = 5) {
    return this.data.scores.filter(s => s.level === level).slice(0, n);
  }
  getAllTop(n = 10) {
    return this.data.scores.slice(0, n);
  }
}

const scoreboard = new ScoreBoard();

// === 游戏引擎 ===
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.W = canvas.width;
    this.H = canvas.height;
    this.tile = 30;
    this.state = "menu"; // menu, playing, paused, over, win, levelup
    this.keys = {};
    this.levelIndex = 0;
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.powerups = [];
    this.particles = [];
    this.frameCount = 0;
    this.score = 0;
    this.lives = 3;
    this.shield = 0;
    this.score2x = 0;
    this.speedBoost = 0;
    this.timeLeft = 0;
    this.playerName = "赵光义";
    this.bindInputs();
  }

  bindInputs() {
    document.addEventListener("keydown", e => {
      this.keys[e.key] = true;
      if (e.key === "p" || e.key === "P") this.togglePause();
      if (e.key === "m" || e.key === "M") audio.toggleMute();
      if (e.key === "Enter" && this.state === "menu") this.startGame();
      if ((e.key === "r" || e.key === "R") && (this.state === "over" || this.state === "win")) this.restartLevel();
    });
    document.addEventListener("keyup", e => { this.keys[e.key] = false; });

    // 移动控制
    document.querySelectorAll(".mobile-pad button[data-dir]").forEach(b => {
      b.addEventListener("touchstart", e => { e.preventDefault(); this.keys[b.dataset.dir] = true; });
      b.addEventListener("touchend", e => { e.preventDefault(); this.keys[b.dataset.dir] = false; });
      b.addEventListener("mousedown", e => { this.keys[b.dataset.dir] = true; });
      b.addEventListener("mouseup", e => { this.keys[b.dataset.dir] = false; });
    });
  }

  startGame() {
    audio.init();
    this.levelIndex = 0;
    this.lives = 3;
    this.score = 0;
    this.loadLevel(0);
  }

  loadLevel(idx) {
    this.levelIndex = idx;
    const lv = LEVELS[idx];
    this.map = lv.map;
    this.ROWS = this.map.length;
    this.COLS = this.map[0].length;
    this.timeLeft = lv.duration * 60;
    this.enemies = [];
    this.projectiles = [];
    this.powerups = [];
    this.particles = [];
    this.shield = 0;
    this.score2x = 0;
    this.speedBoost = 0;

    // 玩家
    this.player = {
      x: lv.player.x * this.tile + 4,
      y: lv.player.y * this.tile + 4,
      w: 22, h: 22, dir: 1,
      type: lv.player.type,
      frame: 0, frameTick: 0,
      invuln: 60, walkAnim: 0,
      attacking: false, attackFrame: 0
    };

    // 敌人
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const ch = this.map[r][c];
        if (ch === "C") {
          const types = lv.enemyTypes.filter(t => t !== "arrow_volley");
          const type = types[Math.floor(Math.random() * types.length)] || "khitan_archer";
          this.enemies.push(this.spawnEnemy(type, c, r));
        } else if (ch === "B" && lv.enemyTypes.includes("arrow_volley")) {
          this.enemies.push(this.spawnEnemy("arrow_volley", c, r));
        }
      }
    }

    // Boss
    if (lv.boss) {
      this.enemies.push(this.spawnEnemy(lv.boss.type, lv.boss.x, lv.boss.y, true));
    }

    // 道具（随机）
    for (let i = 0; i < 3; i++) {
      const types = Object.keys(POWERUP_DEFS);
      const type = types[Math.floor(Math.random() * types.length)];
      const c = 2 + Math.floor(Math.random() * (this.COLS - 4));
      const r = 1 + Math.floor(Math.random() * (this.ROWS - 2));
      this.powerups.push({
        type, x: c * this.tile + 8, y: r * this.tile + 8,
        w: 14, h: 14, def: POWERUP_DEFS[type], bobTick: 0
      });
    }

    this.state = "playing";
    $("#game-msg").textContent = lv.story;
    audio.sfx("levelup");
  }

  spawnEnemy(type, c, r, isBoss = false) {
    const def = ENEMY_DEFS[type];
    return {
      type, def, isBoss,
      x: c * this.tile + 4, y: r * this.tile + 4,
      w: 22, h: 22,
      hp: def.hp, maxHp: def.hp,
      vx: 0, vy: 0,
      frame: 0, frameTick: 0, attackCD: 0,
      homeX: c * this.tile + 4, homeY: r * this.tile + 4,
      color: def.color
    };
  }

  restartLevel() {
    this.loadLevel(this.levelIndex);
  }

  nextLevel() {
    if (this.levelIndex < LEVELS.length - 1) {
      this.loadLevel(this.levelIndex + 1);
      return true;
    }
    return false;
  }

  togglePause() {
    if (this.state === "playing") {
      this.state = "paused";
      $("#game-msg").textContent = "⏸ 暂停中 - 按 P 继续";
    } else if (this.state === "paused") {
      this.state = "playing";
      $("#game-msg").textContent = "继续战斗！";
    }
  }

  rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  update() {
    if (this.state !== "playing") return;
    this.frameCount++;
    const p = this.player;
    const speed = (this.speedBoost > 0 ? 3 : 2);
    p.frameTick++;
    if (p.frameTick > 8) { p.frameTick = 0; p.frame = (p.frame + 1) % 4; }

    // 玩家移动
    let moved = false;
    if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"]) { p.x -= speed; p.dir = -1; moved = true; }
    if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"]) { p.x += speed; p.dir = 1; moved = true; }
    if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"]) p.y -= speed, moved = true;
    if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"]) p.y += speed, moved = true;
    if (moved) p.walkAnim = (p.walkAnim + 0.3) % (Math.PI * 2);

    p.x = Math.max(0, Math.min(this.W - p.w, p.x));
    p.y = Math.max(0, Math.min(this.H - p.h, p.y));
    if (p.invuln > 0) p.invuln--;
    if (this.shield > 0) this.shield--;
    if (this.score2x > 0) this.score2x--;
    if (this.speedBoost > 0) this.speedBoost--;

    // 攻击（空格）
    if (this.keys[" "] || this.keys["Space"] || this.keys["z"] || this.keys["Z"]) {
      if (!p.attacking) {
        p.attacking = true; p.attackFrame = 0;
        this.shoot(p.x + p.w/2 + p.dir * 16, p.y + p.h/2, p.dir);
        audio.sfx("shoot");
      }
    }
    if (p.attacking) {
      p.attackFrame++;
      if (p.attackFrame > 12) p.attacking = false;
    }

    // 敌人 AI
    this.enemies.forEach(e => {
      if (!e.def) return;
      e.frameTick++;
      if (e.frameTick > 10) { e.frameTick = 0; e.frame = (e.frame + 1) % 2; }

      const dx = p.x - e.x, dy = p.y - e.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const beh = e.def.behavior;

      if (beh === "patrol_h") {
        e.x += e.vx || 0.5;
        if (e.x < 0 || e.x + e.w > this.W) e.vx = -e.vx;
      } else if (beh === "chase" || beh === "smart_chase" || beh === "boss_chase" || beh === "boss_runaway") {
        const sp = e.def.speed;
        if (beh === "boss_runaway") {
          e.x -= (dx > 0 ? 1 : -1) * sp * 0.5;
          e.y -= (dy > 0 ? 1 : -1) * sp * 0.5;
        } else {
          let tx = dx, ty = dy;
          if (beh === "smart_chase") {
            // 预判
            tx = dx + (p.dir * 30);
            ty = dy;
          }
          const len = Math.sqrt(tx*tx + ty*ty) || 1;
          e.x += (tx/len) * sp;
          e.y += (ty/len) * sp;
        }
        e.x = Math.max(0, Math.min(this.W - e.w, e.x));
        e.y = Math.max(0, Math.min(this.H - e.h, e.y));
      }

      // 敌人攻击
      if (e.attackCD > 0) e.attackCD--;
      if (dist < 150 && e.attackCD <= 0 && (e.def.behavior.includes("chase") || e.def.isBoss)) {
        e.attackCD = 60;
        // 射击玩家
        this.shootEnemy(e.x + e.w/2, e.y + e.h/2, p.x + p.w/2, p.y + p.h/2);
      }

      // 敌人与玩家碰撞
      if (this.rectCollide(p, e) && p.invuln <= 0) {
        this.hurtPlayer(e);
      }
    });

    // 弹丸更新
    this.projectiles = this.projectiles.filter(pr => {
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.life--;
      if (pr.x < 0 || pr.x > this.W || pr.y < 0 || pr.y > this.H || pr.life <= 0) return false;

      if (pr.fromPlayer) {
        // 击中敌人
        for (const e of this.enemies) {
          if (this.rectCollide(pr, e)) {
            e.hp--;
            this.spawnParticles(e.x + e.w/2, e.y + e.h/2, "#ffeb3b", 5);
            audio.sfx("hit");
            if (e.hp <= 0) {
              const sc = (this.score2x > 0 ? e.def.score * 2 : e.def.score);
              this.score += sc;
              this.spawnParticles(e.x + e.w/2, e.y + e.h/2, e.def.color, 15);
              if (e.isBoss) audio.sfx("boss");
              return false; // 弹丸消失
            }
            return false;
          }
        }
      } else {
        // 击中玩家
        if (this.rectCollide(pr, p) && p.invuln <= 0) {
          this.hurtPlayer(pr);
          return false;
        }
      }
      return true;
    });

    // 道具
    this.powerups.forEach(pu => {
      pu.bobTick = (pu.bobTick + 0.05) % (Math.PI * 2);
      if (this.rectCollide(p, pu)) {
        this.applyPowerup(pu);
        pu.collected = true;
        audio.sfx("powerup");
      }
    });
    this.powerups = this.powerups.filter(pu => !pu.collected);

    // 清除已死敌人
    this.enemies = this.enemies.filter(e => e.hp > 0);

    // 粒子
    this.particles = this.particles.filter(pt => {
      pt.x += pt.vx; pt.y += pt.vy;
      pt.vy += 0.1;
      pt.life--;
      return pt.life > 0;
    });

    // 到达终点
    const lv = LEVELS[this.levelIndex];
    const goalX = lv.goal.x * this.tile, goalY = lv.goal.y * this.tile;
    if (Math.abs(p.x - goalX) < this.tile && Math.abs(p.y - goalY) < this.tile) {
      this.score += lv.boss ? 500 : 200;
      audio.sfx("win");
      if (this.nextLevel()) {
        $("#game-msg").textContent = `🏆 ${lv.goal.label} 通关！进入下一关！得分: ${this.score}`;
      } else {
        this.gameComplete();
      }
    }

    // 时间
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this.hurtPlayer(null, true);
    }

    // 自加分
    if (this.frameCount % 30 === 0) this.score += this.score2x > 0 ? 2 : 1;
  }

  hurtPlayer(source, timeout = false) {
    if (this.shield > 0) return;
    this.lives--;
    this.player.invuln = 90;
    audio.sfx("hit");
    this.spawnParticles(this.player.x + 11, this.player.y + 11, "#ff5252", 10);
    if (this.lives <= 0 || timeout) {
      this.gameOver();
    }
  }

  applyPowerup(pu) {
    switch (pu.def.effect) {
      case "heal":
        this.lives = Math.min(5, this.lives + pu.def.amount);
        break;
      case "shield":
        this.shield = pu.def.duration;
        break;
      case "score2x":
        this.score2x = pu.def.duration;
        break;
      case "speed":
        this.speedBoost = pu.def.duration;
        break;
    }
  }

  shoot(x, y, dir) {
    this.projectiles.push({
      x, y, w: 6, h: 4,
      vx: dir * 6, vy: 0,
      life: 60, fromPlayer: true,
      color: "#ffeb3b"
    });
  }

  shootEnemy(x, y, tx, ty) {
    const dx = tx - x, dy = ty - y;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    this.projectiles.push({
      x, y, w: 5, h: 5,
      vx: (dx/len) * 3, vy: (dy/len) * 3,
      life: 90, fromPlayer: false,
      color: "#8b6f47"
    });
  }

  spawnParticles(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 1,
        life: 30 + Math.random() * 20, color
      });
    }
  }

  gameOver() {
    this.state = "over";
    scoreboard.add(LEVELS[this.levelIndex].id, this.score, this.playerName);
    audio.sfx("die");
    $("#game-msg").innerHTML = `💀 阵亡！得分: <b>${this.score}</b> · 按 R 重来`;
  }

  gameComplete() {
    this.state = "win";
    scoreboard.add("complete", this.score, this.playerName);
    audio.sfx("win");
    $("#game-msg").innerHTML = `🏆 全战役通关！总得分: <b>${this.score}</b>`;
  }

  // === 渲染 ===
  draw() {
    const ctx = this.ctx;
    const lv = LEVELS[this.levelIndex];

    // 背景
    ctx.fillStyle = lv ? lv.bgColor : "#1a1a1a";
    ctx.fillRect(0, 0, this.W, this.H);
    this.drawBackground(lv);

    if (this.state === "menu") { this.drawMenu(); return; }

    // 网格
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const x = c * this.tile, y = r * this.tile;
        if (this.map[r][c] === "T") {
          ctx.fillStyle = "#3e2723";
          ctx.fillRect(x, y, this.tile, this.tile);
          ctx.fillStyle = "#5d4037";
          ctx.fillRect(x + 2, y + 2, this.tile - 4, this.tile - 4);
        } else {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = lv.bgPattern === "snow" ? "#2a3a5a" : "#3a5a3a";
            ctx.fillRect(x, y, this.tile, this.tile);
          }
        }
      }
    }

    // 终点
    if (lv) {
      const gx = lv.goal.x * this.tile, gy = lv.goal.y * this.tile;
      ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 3;
      ctx.strokeRect(gx - 2, gy - 2, this.tile + 4, this.tile + 4);
      ctx.fillStyle = "#ffeb3b";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(lv.goal.label, gx + this.tile/2, gy + this.tile/2 + 4);
    }

    // 道具
    this.powerups.forEach(pu => {
      const bob = Math.sin(pu.bobTick) * 2;
      ctx.fillStyle = pu.def.color;
      ctx.beginPath();
      ctx.arc(pu.x + 7, pu.y + 7 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(pu.def.symbol, pu.x + 7, pu.y + 11 + bob);
    });

    // 敌人
    this.enemies.forEach(e => this.drawEnemy(e));

    // 玩家
    this.drawPlayer();

    // 弹丸
    this.projectiles.forEach(pr => {
      ctx.fillStyle = pr.color;
      if (pr.fromPlayer) {
        // 箭矢
        ctx.save();
        ctx.translate(pr.x, pr.y);
        const angle = Math.atan2(pr.vy, pr.vx);
        ctx.rotate(angle);
        ctx.fillRect(-3, -1, 6, 2);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 粒子
    this.particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.life / 50;
      ctx.fillRect(pt.x, pt.y, 3, 3);
      ctx.globalAlpha = 1;
    });

    // HUD
    this.drawHUD();

    // 暂停/结束覆盖
    if (this.state === "paused" || this.state === "over" || this.state === "win") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, this.W, this.H);
      ctx.fillStyle = this.state === "win" ? "#ffeb3b" : (this.state === "over" ? "#ff5252" : "#fff");
      ctx.font = "bold 28px serif";
      ctx.textAlign = "center";
      if (this.state === "paused") {
        ctx.fillText("⏸ 暂停", this.W/2, this.H/2 - 10);
        ctx.font = "14px serif";
        ctx.fillText("按 P 继续", this.W/2, this.H/2 + 20);
      } else if (this.state === "over") {
        ctx.fillText("💀 阵亡", this.W/2, this.H/2 - 10);
        ctx.font = "16px serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(`得分: ${this.score}`, this.W/2, this.H/2 + 20);
        ctx.font = "13px monospace";
        ctx.fillText("按 R 重新挑战本关", this.W/2, this.H/2 + 50);
        this.drawLeaderboard(this.W/2 - 130, this.H/2 + 65);
      } else if (this.state === "win") {
        ctx.fillText("🏆 通关！", this.W/2, this.H/2 - 30);
        ctx.font = "16px serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(`总得分: ${this.score}`, this.W/2, this.H/2 + 5);
        this.drawLeaderboard(this.W/2 - 130, this.H/2 + 25);
      }
    }
  }

  drawBackground(lv) {
    if (!lv) return;
    const ctx = this.ctx;
    if (lv.bgPattern === "snow") {
      // 雪花
      for (let i = 0; i < 30; i++) {
        const x = (i * 17 + this.frameCount * 0.3) % this.W;
        const y = (i * 23 + this.frameCount * 0.5) % this.H;
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (lv.bgPattern === "mud") {
      // 黄沙
      for (let i = 0; i < 20; i++) {
        const x = (i * 19 + this.frameCount * 0.5) % this.W;
        const y = (i * 31 + this.frameCount * 0.2) % this.H;
        ctx.fillStyle = "rgba(212, 163, 115, 0.4)";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (lv.bgPattern === "palace") {
      // 宫殿装饰
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = "rgba(184, 134, 11, 0.2)";
        ctx.fillRect(i * 100, 0, 40, 10);
      }
    } else {
      // 草地
      for (let i = 0; i < 40; i++) {
        const x = (i * 13) % this.W;
        const y = (i * 19) % this.H;
        ctx.fillStyle = "#5d8a3d";
        ctx.fillRect(x, y, 2, 4);
      }
    }
  }

  drawPlayer() {
    const p = this.player;
    const ctx = this.ctx;
    if (p.invuln > 0 && Math.floor(p.frameCount / 4) % 2 === 0) return;

    const x = p.x, y = p.y, dir = p.dir;
    const walk = Math.sin(p.walkAnim) * 1;
    const attacking = p.attacking;

    if (p.type === "emperor") {
      // 赵光义 - 帝王金甲
      // 驴
      ctx.fillStyle = "#8b6f47";
      ctx.fillRect(x + 2, y + 6 + walk, 8, 8);
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(x + 1, y + 4 + walk, 4, 4);
      ctx.fillRect(x + 8, y + 14 + walk, 2, 2);
      // 车
      ctx.fillStyle = "#8b1a1a";
      ctx.fillRect(x + 10, y + 4, 12, 10);
      // 皇帝
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(x + 13, y + 2, 5, 3);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + 14, y + 3, 1, 1);
      // 龙袍
      ctx.fillStyle = "#b03a2e";
      ctx.fillRect(x + 12, y + 5, 6, 6);
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(x + 14, y + 6, 2, 2);
    } else if (p.type === "general") {
      // 曹彬 - 蓝色将军
      ctx.fillStyle = "#1a3a5c";
      ctx.fillRect(x + 6, y + 4, 10, 8);
      ctx.fillStyle = "#f4d03f";
      ctx.fillRect(x + 8, y + 5, 6, 4);
      ctx.fillStyle = "#fadbd8";
      ctx.fillRect(x + 9, y + 7, 4, 2);
      // 身体
      ctx.fillStyle = "#3a5a8c";
      ctx.fillRect(x + 5, y + 12, 12, 8);
      // 武器
      ctx.fillStyle = "#8b6f47";
      if (attacking) {
        ctx.fillRect(x + (dir > 0 ? 18 : 0), y + 8, 6, 2);
      } else {
        ctx.fillRect(x + (dir > 0 ? 16 : 0), y + 6, 2, 12);
      }
    } else if (p.type === "yangye") {
      // 杨业 - 白袍战神
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(x + 6, y + 4, 10, 8);
      ctx.fillStyle = "#fadbd8";
      ctx.fillRect(x + 9, y + 7, 4, 2);
      ctx.fillStyle = "#d4a373";
      ctx.fillRect(x + 8, y + 5, 6, 2); // 头巾
      // 白袍
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(x + 5, y + 12, 12, 8);
      // 金刀
      ctx.fillStyle = "#b8860b";
      if (attacking) {
        ctx.fillRect(x + (dir > 0 ? 18 : -4), y + 4, 8, 3);
      } else {
        ctx.fillRect(x + (dir > 0 ? 16 : -2), y + 4, 3, 14);
      }
    }

    // 护盾效果
    if (this.shield > 0) {
      ctx.strokeStyle = "rgba(33, 150, 243, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 11, y + 11, 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 血条
    if (p.invuln > 0) {
      ctx.fillStyle = "rgba(255,0,0,0.5)";
      ctx.fillRect(x, y - 4, 22, 2);
    }
  }

  drawEnemy(e) {
    const ctx = this.ctx;
    const x = e.x, y = e.y, w = e.w, h = e.h;
    const flash = e.frame;

    if (e.type === "khitan_archer") {
      // 契丹弓骑兵
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(x + 6, y + 2 + flash, 10, 8);
      ctx.fillStyle = "#2c7873";
      ctx.fillRect(x + 4, y + 10, 14, 8);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + 8, y + 18, 6, 4);
      // 弓
      ctx.fillStyle = "#8b6f47";
      ctx.fillRect(x + 16, y + 4, 2, 10);
    } else if (e.type === "khitan_cavalry") {
      // 重骑兵
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + 4, y + 2, 14, 10);
      ctx.fillStyle = e.color;
      ctx.fillRect(x + 4, y + 12, 14, 8);
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(x + 6, y + 20, 4, 4);
      ctx.fillRect(x + 12, y + 20, 4, 4);
      // 长矛
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(x + 18, y + 2, 2, 16);
    } else if (e.type === "khitan_chief") {
      // 将校 - 红甲
      ctx.fillStyle = "#8b1a1a";
      ctx.fillRect(x + 4, y + 2, 14, 8);
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(x + 9, y + 3, 4, 2);
      ctx.fillStyle = "#fadbd8";
      ctx.fillRect(x + 8, y + 6, 4, 2);
      ctx.fillStyle = e.color;
      ctx.fillRect(x + 4, y + 10, 14, 10);
    } else if (e.type === "arrow_volley") {
      // 流矢
      ctx.fillStyle = "#8b6f47";
      ctx.save();
      ctx.translate(x + w/2, y + h/2);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-2, -6, 4, 12);
      ctx.restore();
    } else if (e.type === "yeluxiuge") {
      // Boss 耶律休哥
      const pulse = Math.sin(this.frameCount * 0.1) * 2;
      ctx.fillStyle = "#ff5252";
      ctx.fillRect(x - 1, y - 1, w + 2, h + 2 + pulse); // 光晕
      ctx.fillStyle = "#1a3a3a";
      ctx.fillRect(x + 4, y + 2, 14, 10);
      ctx.fillStyle = "#3a8a85";
      ctx.fillRect(x + 4, y + 12, 14, 8);
      ctx.fillStyle = "#fadbd8";
      ctx.fillRect(x + 8, y + 6, 4, 2);
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(x + 9, y + 3, 4, 2);
      // 武器
      ctx.fillStyle = "#b8860b";
      ctx.fillRect(x + 16, y + 4, 3, 14);
    } else if (e.type === "wangshen") {
      // 监军王侁
      ctx.fillStyle = "#5d4e8c";
      ctx.fillRect(x + 4, y + 2, 14, 10);
      ctx.fillStyle = "#fadbd8";
      ctx.fillRect(x + 8, y + 6, 4, 2);
      ctx.fillStyle = e.color;
      ctx.fillRect(x + 4, y + 12, 14, 8);
      // 官帽
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + 6, y, 10, 3);
    }

    // 血条
    if (e.hp < e.maxHp) {
      ctx.fillStyle = "#333";
      ctx.fillRect(x, y - 6, w, 3);
      ctx.fillStyle = "#ff5252";
      ctx.fillRect(x, y - 6, w * (e.hp / e.maxHp), 3);
    }
  }

  drawHUD() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, this.W, 36);

    ctx.fillStyle = "#fff";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Lv ${this.levelIndex + 1}/${LEVELS.length} ${LEVELS[this.levelIndex].name.replace(/第.关 · /, "")}`, 6, 14);
    ctx.fillText(`❤ ${"♥".repeat(this.lives)}${"♡".repeat(Math.max(0, 5 - this.lives))}`, 6, 28);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffeb3b";
    ctx.fillText(`★ ${this.score}`, this.W/2, 14);
    if (this.score2x > 0) {
      ctx.fillStyle = "#ffc107";
      ctx.fillText("×2 DOUBLE", this.W/2, 28);
    } else if (this.shield > 0) {
      ctx.fillStyle = "#2196f3";
      ctx.fillText("🛡 SHIELD", this.W/2, 28);
    } else if (this.speedBoost > 0) {
      ctx.fillStyle = "#9c27b0";
      ctx.fillText("⚡ SPEED", this.W/2, 28);
    } else {
      ctx.fillStyle = "#aaa";
      ctx.fillText(`⏱ ${Math.ceil(this.timeLeft / 60)}s`, this.W/2, 28);
    }

    ctx.textAlign = "right";
    ctx.fillStyle = audio.muted ? "#666" : "#fff";
    ctx.fillText(audio.muted ? "🔇" : "🔊 M", this.W - 6, 14);
    ctx.fillStyle = "#aaa";
    ctx.fillText("P 暂停", this.W - 6, 28);
  }

  drawLeaderboard(x, y) {
    const ctx = this.ctx;
    const tops = scoreboard.getAllTop(5);
    if (tops.length === 0) return;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x, y, 260, 100);
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 260, 100);
    ctx.fillStyle = "#ffeb3b";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("🏆 排行榜", x + 130, y + 14);
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    tops.forEach((s, i) => {
      const medal = ["🥇","🥈","🥉","④","⑤"][i] || `${i+1}`;
      ctx.fillStyle = i === 0 ? "#ffeb3b" : "#fff";
      ctx.fillText(`${medal} ${s.name} - ${s.level} - ${s.score}`, x + 8, y + 30 + i * 13);
    });
  }

  drawMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, this.W, this.H);
    // 装饰
    ctx.fillStyle = "#b03a2e";
    ctx.fillRect(0, this.H/2 - 60, this.W, 2);
    ctx.fillRect(0, this.H/2 + 50, this.W, 2);

    ctx.fillStyle = "#ffeb3b";
    ctx.font = "bold 28px serif";
    ctx.textAlign = "center";
    ctx.fillText("高粱河车神", this.W/2, this.H/2 - 25);
    ctx.fillStyle = "#fff";
    ctx.font = "16px serif";
    ctx.fillText("与雍熙悲歌 · 像素突围", this.W/2, this.H/2);

    ctx.font = "12px monospace";
    ctx.fillStyle = "#b8860b";
    ctx.fillText(`共 ${LEVELS.length} 关 · 4 个历史战役`, this.W/2, this.H/2 + 30);
    ctx.fillText("按 ENTER 开始", this.W/2, this.H/2 + 75);

    ctx.font = "10px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText("操作: 方向键/WASD移动, 空格射击", this.W/2, this.H - 30);
    ctx.fillText("P 暂停 · M 静音 · R 重来", this.W/2, this.H - 16);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  start() {
    this.loop();
  }
}

window.Game = Game;
window.LEVELS = LEVELS;
window.ENEMY_DEFS = ENEMY_DEFS;
window.scoreboard = scoreboard;

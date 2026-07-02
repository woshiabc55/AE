// 固定步长主循环（rAF + 累加器）

export class GameLoop {
  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;
  private readonly fixed: number;

  constructor(
    private update: (dt: number) => void,
    private render: () => void,
    fixedStep = 1 / 60,
  ) {
    this.fixed = fixedStep;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.1) dt = 0.1; // 防止切后台后大跳
    this.acc += dt;
    let guard = 0;
    while (this.acc >= this.fixed && guard < 5) {
      this.update(this.fixed);
      this.acc -= this.fixed;
      guard++;
    }
    this.render();
    this.raf = requestAnimationFrame(this.tick);
  };
}

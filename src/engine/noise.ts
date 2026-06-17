// 简易 2D 数值噪声（基于多倍 sin 叠加 + 哈希），用于粒子偏移场
// 优于真 Perlin 在 JS 中的性能，且视觉上足够自然
export class NoiseField {
  private seedA: number;
  private seedB: number;
  private seedC: number;

  constructor(seed = 1337) {
    this.seedA = seed * 0.001 + 0.13;
    this.seedB = seed * 0.0037 + 1.27;
    this.seedC = seed * 0.011 + 2.41;
  }

  // 输出 -1..1
  noise2D(x: number, y: number, t: number): number {
    const a = Math.sin((x * 0.012 + this.seedA) + t * 0.6) * 1.7;
    const b = Math.sin((y * 0.017 + this.seedB) - t * 0.4) * 1.2;
    const c = Math.sin((x * 0.005 - y * 0.006 + this.seedC) + t * 0.25) * 2.0;
    const d = Math.sin((x + y) * 0.003 + t * 0.13) * 1.3;
    return (a + b + c + d) / 6.2;
  }
}

// AnalyserNode 单例与信号分析
export class Analyser {
  ctx: AudioContext;
  node: AnalyserNode;
  freqData: Uint8Array;
  timeData: Uint8Array;
  private beatHistory: number[] = [];
  private lastBeatTime = 0;
  private bpmEstimate = 120;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.node = ctx.createAnalyser();
    this.node.fftSize = 1024;
    this.node.smoothingTimeConstant = 0.78;
    this.freqData = new Uint8Array(this.node.frequencyBinCount);
    this.timeData = new Uint8Array(this.node.fftSize);
  }

  getFrequencyData(): Uint8Array {
    this.node.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  getTimeDomainData(): Uint8Array {
    this.node.getByteTimeDomainData(this.timeData);
    return this.timeData;
  }

  // 0..1 归一化响度
  getRMS(): number {
    this.node.getByteTimeDomainData(this.timeData);
    let sum = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      const v = (this.timeData[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / this.timeData.length);
  }

  // 低频能量 (0..1) 用于节拍检测
  getLowEnergy(): number {
    this.node.getByteFrequencyData(this.freqData);
    // 取 0..12 bin 约 0~500Hz
    let sum = 0;
    const n = 12;
    for (let i = 0; i < n; i++) sum += this.freqData[i];
    return sum / (n * 255);
  }

  // 综合频段能量分组 low / mid / high
  getBands(): { low: number; mid: number; high: number } {
    this.node.getByteFrequencyData(this.freqData);
    const bins = this.freqData.length;
    let low = 0;
    let mid = 0;
    let high = 0;
    const lowEnd = Math.floor(bins * 0.12);
    const midEnd = Math.floor(bins * 0.45);
    for (let i = 0; i < lowEnd; i++) low += this.freqData[i];
    for (let i = lowEnd; i < midEnd; i++) mid += this.freqData[i];
    for (let i = midEnd; i < bins; i++) high += this.freqData[i];
    return {
      low: low / (lowEnd * 255),
      mid: mid / ((midEnd - lowEnd) * 255),
      high: high / ((bins - midEnd) * 255),
    };
  }

  // 节拍强度 0..1 + BPM 估计
  detectBeat(): { beat: number; bpm: number } {
    const energy = this.getLowEnergy();
    const now = performance.now();
    this.beatHistory.push(energy);
    if (this.beatHistory.length > 43) this.beatHistory.shift(); // 约 0.7s 历史
    const avg =
      this.beatHistory.reduce((a, b) => a + b, 0) /
      Math.max(1, this.beatHistory.length);
    const variance =
      this.beatHistory.reduce((a, b) => a + (b - avg) ** 2, 0) /
      Math.max(1, this.beatHistory.length);
    const threshold = avg * 1.35 + variance * 0.6 + 0.05;
    let beat = 0;
    if (energy > threshold && energy > 0.18 && now - this.lastBeatTime > 220) {
      beat = Math.min(1, (energy - threshold) * 4);
      const interval = now - this.lastBeatTime;
      if (this.lastBeatTime > 0 && interval > 0) {
        const instantBpm = 60000 / interval;
        if (instantBpm > 60 && instantBpm < 200) {
          this.bpmEstimate = this.bpmEstimate * 0.85 + instantBpm * 0.15;
        }
      }
      this.lastBeatTime = now;
    } else {
      beat *= 0.92;
    }
    return { beat, bpm: this.bpmEstimate };
  }
}

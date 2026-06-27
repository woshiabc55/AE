// 简单的合成音效，无需外部音频文件

export class SoundSynth {
  ctx: AudioContext | null = null;
  enabled = true;
  volume = 0.8;

  constructor() {
    // 懒加载 AudioContext，直到用户交互后再创建，避免自动播放策略拦截
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  private ensureContext() {
    if (!this.ctx) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    return this.ctx;
  }

  private noiseBuffer() {
    const ctx = this.ensureContext();
    if (!ctx) return null;
    const len = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playNoise(duration: number, frequency: number, volume: number) {
    const ctx = this.ensureContext();
    if (!ctx || !this.enabled) return;

    const buffer = this.noiseBuffer();
    if (!buffer) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = frequency;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + duration);
  }

  private playTone(freq: number, duration: number, volume: number, type: OscillatorType = "square") {
    const ctx = this.ensureContext();
    if (!ctx || !this.enabled) return;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playBreak(blockType: string) {
    // 破坏音：短促噪声 + 轻微降调
    this.playNoise(0.12, 2200, 0.25);
    const freq = blockType === "wood" || blockType === "planks" ? 180 : 120;
    this.playTone(freq, 0.08, 0.12, "sawtooth");
  }

  playPlace(blockType: string) {
    // 放置音：清脆短音
    const freq = blockType === "wood" || blockType === "planks" ? 320 : 440;
    this.playTone(freq, 0.06, 0.15, "square");
    this.playTone(freq * 1.5, 0.05, 0.08, "square");
  }

  playStep() {
    // 脚步声：极短低频噪声
    this.playNoise(0.05, 600, 0.08);
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}

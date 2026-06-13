/**
 * 道录 · DAOLU 音乐播放器
 * 使用 Web Audio API 生成 ambient drone（无需音频文件）
 * 轨道：多振荡器 + LFO 调制 + 低通滤波 + 反馈延迟
 */
export type DaoluTrack = {
  id: string;
  name: string;
  baseFreq: number[];   // 振荡器基频（Hz）
  filterFreq: number;   // 低通截止
  lfoRate: number;      // LFO 速率
};

const TRACKS: DaoluTrack[] = [
  {
    id: 't1',
    name: 'AMBIENT 001 · 仙',
    baseFreq: [55, 82.5, 110, 165],
    filterFreq: 480,
    lfoRate: 0.12,
  },
  {
    id: 't2',
    name: 'AMBIENT 002 · 境',
    baseFreq: [58.27, 87.5, 116.5, 174.6],
    filterFreq: 620,
    lfoRate: 0.18,
  },
  {
    id: 't3',
    name: 'AMBIENT 003 · 道',
    baseFreq: [49, 73.5, 98, 147],
    filterFreq: 360,
    lfoRate: 0.08,
  },
];

export class DaoluPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private delay: DelayNode | null = null;
  private feedback: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private oscGains: GainNode[] = [];
  private playing = false;
  private currentTrackIdx = 0;
  private volume = 0.35;

  get tracks() { return TRACKS; }
  get isPlaying() { return this.playing; }
  get track() { return TRACKS[this.currentTrackIdx]; }

  /** 懒初始化 AudioContext（需用户交互后才能 resume） */
  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      // @ts-ignore
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  async play() {
    const ctx = this.ensureCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (this.playing) return;

    const track = TRACKS[this.currentTrackIdx];

    // 主增益
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(ctx.destination);

    // 低通滤波
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = track.filterFreq;
    this.filter.Q.value = 1.2;
    this.filter.connect(this.masterGain);

    // 反馈延迟（混响感）
    this.delay = ctx.createDelay(1.0);
    this.delay.delayTime.value = 0.42;
    this.feedback = ctx.createGain();
    this.feedback.gain.value = 0.45;
    this.delay.connect(this.feedback).connect(this.delay);
    this.delay.connect(this.masterGain);
    this.filter.connect(this.delay);

    // 4 个振荡器 + LFO
    track.baseFreq.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.value = 0.18 / (i + 1);

      // LFO 调制 gain
      const lfo = ctx.createOscillator();
      lfo.frequency.value = track.lfoRate * (1 + i * 0.3);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06 / (i + 1);
      lfo.connect(lfoGain).connect(gain.gain);

      osc.connect(gain).connect(this.filter!);
      osc.start();
      lfo.start();

      this.oscs.push(osc);
      this.lfos.push(lfo);
      this.oscGains.push(gain);
    });

    this.playing = true;
  }

  pause() {
    if (!this.ctx || !this.playing) return;
    this.ctx.suspend();
    this.playing = false;
  }

  async toggle() {
    if (this.playing) this.pause();
    else await this.play();
    return this.playing;
  }

  next() {
    const wasPlaying = this.playing;
    this.stop();
    this.currentTrackIdx = (this.currentTrackIdx + 1) % TRACKS.length;
    if (wasPlaying) this.play();
  }

  prev() {
    const wasPlaying = this.playing;
    this.stop();
    this.currentTrackIdx = (this.currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
    if (wasPlaying) this.play();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  getVolume() { return this.volume; }

  private stop() {
    this.oscs.forEach((o) => { try { o.stop(); } catch {} });
    this.lfos.forEach((o) => { try { o.stop(); } catch {} });
    this.oscs = [];
    this.lfos = [];
    this.oscGains = [];
    this.masterGain?.disconnect();
    this.filter?.disconnect();
    this.delay?.disconnect();
    this.feedback?.disconnect();
    this.masterGain = null;
    this.filter = null;
    this.delay = null;
    this.feedback = null;
    this.playing = false;
  }
}

/** 全局单例 */
export const daolu = new DaoluPlayer();

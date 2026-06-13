/**
 * 道录 · DAOLU 音乐播放器
 * 模式：
 *   - ambient：Web Audio API 多振荡器 + LFO + 低通 + 反馈延迟（无需音频文件）
 *   - file   ：用户从本机选择的音频文件（HTMLAudioElement）
 * 通过 prev / next 在同一列表内循环切换
 */
export type DaoluTrack = {
  id: string;
  name: string;
  type: 'ambient' | 'file';
  /** ambient */
  baseFreq?: number[];
  filterFreq?: number;
  lfoRate?: number;
  /** file */
  url?: string;
  audio?: HTMLAudioElement;
  duration?: number;
  fileSize?: number;
};

const AMBIENT_DEFS: Omit<DaoluTrack, 'id' | 'type'>[] = [
  {
    name: 'AMBIENT 001 · 仙',
    baseFreq: [55, 82.5, 110, 165],
    filterFreq: 480,
    lfoRate: 0.12,
  },
  {
    name: 'AMBIENT 002 · 境',
    baseFreq: [58.27, 87.5, 116.5, 174.6],
    filterFreq: 620,
    lfoRate: 0.18,
  },
  {
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

  /** 全部轨道（ambient + 用户加载的 file） */
  private tracks: DaoluTrack[] = AMBIENT_DEFS.map((d, i) => ({
    id: `a${i}`,
    type: 'ambient' as const,
    ...d,
  }));

  get trackList() { return this.tracks; }
  get isPlaying() { return this.playing; }
  get track(): DaoluTrack { return this.tracks[this.currentTrackIdx]; }
  get trackIndex() { return this.currentTrackIdx; }

  /** 懒初始化 AudioContext（需用户交互后才能 resume） */
  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      // @ts-ignore
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  /** 加载一个或多个本地音频文件，返回加入的轨道 */
  async loadFiles(files: FileList | File[]): Promise<DaoluTrack[]> {
    const list = Array.from(files).filter((f) =>
      f.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(f.name)
    );
    if (list.length === 0) return [];

    const ctx = this.ensureCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    const added: DaoluTrack[] = [];
    for (const file of list) {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = this.volume;

      // 等待 metadata
      await new Promise<void>((resolve) => {
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); resolve(); };
        const cleanup = () => {
          audio.removeEventListener('loadedmetadata', onReady);
          audio.removeEventListener('error', onError);
        };
        audio.addEventListener('loadedmetadata', onReady, { once: true });
        audio.addEventListener('error', onError, { once: true });
        // 触发加载
        audio.load();
      });

      const track: DaoluTrack = {
        id: `f${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        type: 'file',
        url,
        audio,
        duration: isFinite(audio.duration) ? audio.duration : 0,
        fileSize: file.size,
      };
      this.tracks.push(track);
      added.push(track);
    }
    return added;
  }

  /** 移除一个已加载的文件轨道 */
  removeFile(trackId: string) {
    const idx = this.tracks.findIndex((t) => t.id === trackId);
    if (idx < 0 || this.tracks[idx].type !== 'file') return;
    const t = this.tracks[idx];
    if (t.audio) { try { t.audio.pause(); } catch {} t.audio.src = ''; }
    if (t.url) URL.revokeObjectURL(t.url);
    this.tracks.splice(idx, 1);
    if (this.currentTrackIdx >= this.tracks.length) {
      this.currentTrackIdx = Math.max(0, this.tracks.length - 1);
    }
  }

  /** 切换到指定索引（可被外部 UI 调用） */
  select(idx: number) {
    if (idx < 0 || idx >= this.tracks.length) return;
    const wasPlaying = this.playing;
    if (wasPlaying) this.stop();
    this.currentTrackIdx = idx;
    if (wasPlaying) this.play();
  }

  async play() {
    const ctx = this.ensureCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    if (this.playing) return;

    const track = this.tracks[this.currentTrackIdx];

    // 统一主链：masterGain → destination
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(ctx.destination);

    if (track.type === 'ambient') {
      this.playAmbient(ctx, track);
    } else if (track.type === 'file' && track.audio) {
      this.playFile(ctx, track);
    }

    this.playing = true;
  }

  private playAmbient(ctx: AudioContext, track: DaoluTrack) {
    if (!this.masterGain) return;

    // 低通滤波
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = track.filterFreq ?? 480;
    this.filter.Q.value = 1.2;
    this.filter.connect(this.masterGain);

    // 反馈延迟
    this.delay = ctx.createDelay(1.0);
    this.delay.delayTime.value = 0.42;
    this.feedback = ctx.createGain();
    this.feedback.gain.value = 0.45;
    this.delay.connect(this.feedback).connect(this.delay);
    this.delay.connect(this.masterGain);
    this.filter.connect(this.delay);

    // 4 个振荡器 + LFO
    (track.baseFreq ?? [55, 82.5, 110, 165]).forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.value = 0.18 / (i + 1);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = (track.lfoRate ?? 0.12) * (1 + i * 0.3);
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
  }

  private playFile(_ctx: AudioContext, track: DaoluTrack) {
    if (!track.audio) return;
    track.audio.currentTime = 0;
    track.audio.volume = this.volume;
    track.audio.loop = true;
    track.audio.play().catch(() => { /* 用户未交互时会失败，UI 会重试 */ });
  }

  pause() {
    if (!this.playing) return;
    const t = this.tracks[this.currentTrackIdx];
    if (t.type === 'file' && t.audio) {
      t.audio.pause();
    } else if (this.ctx) {
      this.ctx.suspend();
    }
    this.playing = false;
  }

  async toggle() {
    if (this.playing) this.pause();
    else await this.play();
    return this.playing;
  }

  next() {
    if (this.tracks.length === 0) return;
    const wasPlaying = this.playing;
    this.stop();
    this.currentTrackIdx = (this.currentTrackIdx + 1) % this.tracks.length;
    if (wasPlaying) this.play();
  }

  prev() {
    if (this.tracks.length === 0) return;
    const wasPlaying = this.playing;
    this.stop();
    this.currentTrackIdx = (this.currentTrackIdx - 1 + this.tracks.length) % this.tracks.length;
    if (wasPlaying) this.play();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
    // 文件轨道独立音量
    this.tracks.forEach((t) => {
      if (t.type === 'file' && t.audio) t.audio.volume = this.volume;
    });
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

    // 暂停所有文件轨道
    this.tracks.forEach((t) => {
      if (t.type === 'file' && t.audio && !t.audio.paused) {
        t.audio.pause();
      }
    });

    this.playing = false;
  }
}

/** 全局单例 */
export const daolu = new DaoluPlayer();

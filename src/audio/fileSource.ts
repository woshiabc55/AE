// 本地音频文件音源
export class FileSource {
  private ctx: AudioContext;
  private node: AudioBufferSourceNode | null = null;
  private buffer: AudioBuffer | null = null;
  private gain: GainNode;
  private startTime = 0;
  private offset = 0;
  private playing = false;
  private onEndedCb: (() => void) | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.gain.value = 0.9;
  }

  get output(): AudioNode {
    return this.gain;
  }

  get duration(): number {
    return this.buffer?.duration ?? 0;
  }

  get currentTime(): number {
    if (!this.playing) return this.offset;
    return this.offset + (this.ctx.currentTime - this.startTime);
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setVolume(v: number) {
    this.gain.gain.value = Math.max(0, Math.min(1.5, v));
  }

  async loadFile(file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.stop();
    this.buffer = buffer;
    this.offset = 0;
  }

  play(from = 0) {
    if (!this.buffer) return;
    this.stop();
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffer;
    src.connect(this.gain);
    src.onended = () => {
      this.playing = false;
      this.offset = 0;
      this.onEndedCb?.();
    };
    src.start(0, Math.max(0, Math.min(from, this.buffer.duration - 0.05)));
    this.node = src;
    this.startTime = this.ctx.currentTime;
    this.offset = from;
    this.playing = true;
  }

  pause() {
    if (!this.playing || !this.buffer) return;
    this.offset = this.currentTime;
    this.stop();
  }

  stop() {
    if (this.node) {
      try {
        this.node.onended = null;
        this.node.stop();
      } catch {
        /* noop */
      }
      try {
        this.node.disconnect();
      } catch {
        /* noop */
      }
      this.node = null;
    }
    this.playing = false;
  }

  onEnded(cb: () => void) {
    this.onEndedCb = cb;
  }
}

import { Analyser } from './analyser';
import { SynthSource } from './synthSource';
import { MicSource } from './micSource';
import { FileSource } from './fileSource';
import type { SourceId } from '@/store/useStore';

// 音频管理器：负责 AudioContext 生命周期 + 音源切换
export class AudioManager {
  ctx: AudioContext | null = null;
  analyser: Analyser | null = null;
  private current: SourceId | null = null;
  private synth: SynthSource | null = null;
  private mic: MicSource | null = null;
  private file: FileSource | null = null;

  async ensure(): Promise<{ ctx: AudioContext; analyser: Analyser }> {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.analyser = new Analyser(this.ctx);
    }
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        /* noop */
      }
    }
    if (!this.analyser) this.analyser = new Analyser(this.ctx);
    return { ctx: this.ctx, analyser: this.analyser };
  }

  async switchTo(id: SourceId, file?: File): Promise<void> {
    const { ctx, analyser } = await this.ensure();
    this.teardownCurrent();
    // 先断开 analyser 与 destination 的连接（避免叠加）
    try { analyser.node.disconnect(); } catch { /* noop */ }
    if (id === 'synth') {
      this.synth = new SynthSource(ctx);
      this.synth.output.connect(analyser.node);
      analyser.node.connect(ctx.destination);
      this.synth.start();
      this.synth.fadeIn();
    } else if (id === 'mic') {
      this.mic = new MicSource(ctx);
      await this.mic.start();
      // 麦克风不接 destination 以避免回授啸叫
      this.mic.output.connect(analyser.node);
    } else if (id === 'file') {
      this.file = new FileSource(ctx);
      if (file) {
        await this.file.loadFile(file);
        this.file.output.connect(analyser.node);
        analyser.node.connect(ctx.destination);
        this.file.play();
      } else if (this.file.duration > 0) {
        // 已有 buffer，播放
        this.file.output.connect(analyser.node);
        analyser.node.connect(ctx.destination);
        this.file.play();
      }
    }
    this.current = id;
  }

  teardownCurrent() {
    if (this.synth) {
      this.synth.stop();
      try { this.synth.output.disconnect(); } catch { /* noop */ }
      this.synth = null;
    }
    if (this.mic) {
      this.mic.stop();
      try { this.mic.output.disconnect(); } catch { /* noop */ }
      this.mic = null;
    }
    if (this.file) {
      this.file.stop();
      try { this.file.output.disconnect(); } catch { /* noop */ }
      this.file = null;
    }
  }

  getFile(): FileSource | null {
    return this.file;
  }

  destroy() {
    this.teardownCurrent();
    if (this.ctx) {
      this.ctx.close().catch(() => { /* noop */ });
      this.ctx = null;
    }
    this.analyser = null;
  }
}

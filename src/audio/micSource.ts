// 麦克风音源
export class MicSource {
  private ctx: AudioContext;
  private node: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async start(): Promise<void> {
    if (this.node) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('当前环境不支持麦克风');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    this.stream = stream;
    this.node = this.ctx.createMediaStreamSource(stream);
  }

  get output(): AudioNode {
    if (!this.node) throw new Error('MicSource 未启动');
    return this.node;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.node = null;
  }
}

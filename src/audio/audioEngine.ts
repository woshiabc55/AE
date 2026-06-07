// 简易音频引擎 - 程序化生成工业氛围音乐与警报

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private drone: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private enabled = true;
  private volume = 0.15;
  private started = false;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext 不可用', e);
    }
  }

  start() {
    if (!this.ctx || this.started) return;
    this.started = true;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // 工业氛围 drone
    this.drone = this.ctx.createOscillator();
    this.drone.type = 'sawtooth';
    this.drone.frequency.value = 55;
    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 200;
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.4;
    this.drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.master);
    this.drone.start();

    // LFO 调制
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 30;
    this.lfo.connect(lfoGain);
    lfoGain.connect(droneFilter.frequency);
    this.lfo.start();

    // 白噪音
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buf;
    this.noiseNode.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.15;
    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.master);
    this.noiseNode.start();
  }

  stop() {
    this.drone?.stop();
    this.lfo?.stop();
    this.noiseNode?.stop();
    this.drone = null;
    this.lfo = null;
    this.noiseNode = null;
    this.started = false;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? this.volume : 0;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.enabled) this.master.gain.value = this.volume;
  }

  // 短促哔哔（工作反馈）
  beep(freq: number = 800, duration: number = 0.08) {
    if (!this.ctx || !this.enabled || !this.master) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'square';
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 警报
  alarm() {
    if (!this.ctx || !this.enabled || !this.master) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now + i * 0.2);
      osc.frequency.exponentialRampToValueAtTime(200, now + i * 0.2 + 0.18);
      g.gain.setValueAtTime(0, now + i * 0.2);
      g.gain.linearRampToValueAtTime(0.3, now + i * 0.2 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.18);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.2);
    }
  }

  // 成功
  success() {
    this.beep(600, 0.1);
    setTimeout(() => this.beep(900, 0.1), 80);
  }

  // 失败 / 突破
  fail() {
    this.beep(150, 0.4);
  }

  // 倒计时滴答
  tick() {
    this.beep(1200, 0.03);
  }
}

export const audioEngine = new AudioEngine();

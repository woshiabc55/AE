// 内置电子合成器：低频鼓点 + 中频贝斯 + 高频噪声镲片 + LFO 节奏
// 零外部依赖，零等待，开页即可发声可视化
export class SynthSource {
  private ctx: AudioContext;
  private master: GainNode;
  private nodes: AudioNode[] = [];
  private intervals: number[] = [];
  private timeouts: number[] = [];
  private started = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0; // 由外部淡入
  }

  get output(): AudioNode {
    return this.master;
  }

  // 淡入
  fadeIn(duration = 0.6) {
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.55, t + duration);
  }

  fadeOut(duration = 0.3) {
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + duration);
  }

  start() {
    if (this.started) return;
    this.started = true;
    const ctx = this.ctx;
    const tempo = 124; // BPM
    const beatMs = 60000 / tempo;
    const masterIn = ctx.createGain();
    masterIn.gain.value = 0.6;
    masterIn.connect(this.master);
    this.nodes.push(masterIn);

    // ---------- 持续 Pad (持续中频) ----------
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 900;
    padFilter.Q.value = 0.7;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.07;
    padFilter.connect(padGain).connect(masterIn);

    const padFreqs = [110, 164.81, 220, 277.18]; // A2 E3 A3 C#4
    const padOscs: OscillatorNode[] = [];
    padFreqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      // 慢速 LFO detune
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.12 + i * 0.07;
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain).connect(o.detune);
      lfo.start();
      o.connect(padFilter);
      o.start();
      padOscs.push(o);
      this.nodes.push(o, lfo, lfoGain);
    });

    // ---------- Bass ----------
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 380;
    bassFilter.Q.value = 4;
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.18;
    bassFilter.connect(bassGain).connect(masterIn);
    this.nodes.push(bassFilter, bassGain);

    // ---------- Scheduler ----------
    let step = 0;
    const bassPattern = [
      55, 0, 0, 73.42, 0, 0, 65.41, 0, 55, 0, 0, 73.42, 0, 82.41, 65.41, 0,
    ];
    const hatPattern = [
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    ];
    const kickPattern = [
      1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
    ];

    const tick = () => {
      if (!this.started) return;
      const now = ctx.currentTime;
      // Kick
      if (kickPattern[step % 16]) {
        this.kick(ctx, masterIn, now);
      }
      // Bass note
      const bn = bassPattern[step % 16];
      if (bn > 0) {
        this.bassNote(ctx, bassFilter, bn, now, beatMs / 1000 * 0.45);
      }
      // Hi-hat
      if (hatPattern[step % 16]) {
        this.hat(ctx, masterIn, now, step % 4 === 1 ? 0.04 : 0.025);
      }
      // Pad chord shift
      if (step % 16 === 0) {
        const offset = (step / 16) % 4;
        const shift = [0, 2, 3, 5][offset];
        padOscs.forEach((o, i) => {
          o.frequency.cancelScheduledValues(now);
          o.frequency.setValueAtTime(o.frequency.value, now);
          o.frequency.linearRampToValueAtTime(
            padFreqs[i] * Math.pow(2, shift / 12),
            now + beatMs * 4 / 1000,
          );
        });
      }
      step++;
      const id = window.setTimeout(tick, beatMs / 4);
      this.timeouts.push(id);
    };
    // 启动第一次
    const id0 = window.setTimeout(tick, 80);
    this.timeouts.push(id0);
  }

  private kick(ctx: AudioContext, dest: AudioNode, time: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(140, time);
    o.frequency.exponentialRampToValueAtTime(40, time + 0.18);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.95, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    o.connect(g).connect(dest);
    o.start(time);
    o.stop(time + 0.45);
  }

  private bassNote(
    ctx: AudioContext,
    filter: BiquadFilterNode,
    freq: number,
    time: number,
    dur: number,
  ) {
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.5, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    o.connect(g).connect(filter);
    o.start(time);
    o.stop(time + dur + 0.05);
  }

  private hat(ctx: AudioContext, dest: AudioNode, time: number, vol = 0.03) {
    // 噪声 buffer
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    src.connect(hp).connect(g).connect(dest);
    src.start(time);
    src.stop(time + 0.08);
  }

  stop() {
    this.started = false;
    this.fadeOut(0.1);
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    setTimeout(() => {
      this.nodes.forEach((n) => {
        try {
          if ('stop' in n && typeof (n as OscillatorNode).stop === 'function') {
            try {
              (n as OscillatorNode).stop();
            } catch {
              /* noop */
            }
          }
        } catch {
          /* noop */
        }
      });
    }, 200);
  }
}

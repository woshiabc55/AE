/* =================================================================
   古琴 / 窑火 / 鼓点 - Web Audio 合成
   ================================================================= */
(function () {
  'use strict';

  const Synth = {
    ctx: null,
    master: null,

    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.25;
      this.master.connect(this.ctx.destination);
    },

    resume() {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    },

    // 古琴单音（衰减泛音）
    guqin(freq, duration = 2.5) {
      this.resume();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const partials = [
        { f: 1.0,    a: 0.6,  d: 2.0 },
        { f: 2.01,   a: 0.25, d: 1.4 },
        { f: 3.02,   a: 0.15, d: 0.9 },
        { f: 4.05,   a: 0.08, d: 0.6 },
        { f: 5.99,   a: 0.04, d: 0.4 }
      ];
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, t);
      out.gain.linearRampToValueAtTime(0.6, t + 0.005);
      out.gain.exponentialRampToValueAtTime(0.001, t + duration);
      out.connect(this.master);

      partials.forEach(p => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq * p.f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(p.a, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + p.d);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + p.d + 0.05);
      });
    },

    // 窑火轰鸣
    kiln(duration = 4) {
      this.resume();
      const ctx = this.ctx;
      const t = ctx.currentTime;

      // 粉红噪声（简化）
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 320;
      filter.Q.value = 0.7;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3;
      lfoGain.gain.value = 60;
      lfo.connect(lfoGain).connect(filter.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.45, t + 0.6);
      gain.gain.linearRampToValueAtTime(0.3, t + duration);
      gain.gain.linearRampToValueAtTime(0, t + duration);

      noise.connect(filter).connect(gain).connect(this.master);
      noise.start(t);
      lfo.start(t);
      noise.stop(t + duration);
      lfo.stop(t + duration);
    },

    // 战鼓
    drum() {
      this.resume();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.2);
      g.gain.setValueAtTime(0.7, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g).connect(this.master);
      o.start(t);
      o.stop(t + 0.35);
    },

    // 马蹄
    hooves(count = 4) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.resume();
          const ctx = this.ctx;
          const t = ctx.currentTime;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'square';
          o.frequency.value = 80;
          g.gain.setValueAtTime(0.2, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          o.connect(g).connect(this.master);
          o.start(t);
          o.stop(t + 0.1);
        }, i * 220);
      }
    },

    // 鸟鸣
    bird() {
      this.resume();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1800, t);
      o.frequency.exponentialRampToValueAtTime(3200, t + 0.1);
      o.frequency.exponentialRampToValueAtTime(2200, t + 0.25);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g).connect(this.master);
      o.start(t);
      o.stop(t + 0.35);
    },

    // 风
    wind(duration = 3) {
      this.resume();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.2;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      src.connect(filter).connect(gain).connect(this.master);
      src.start(t);
    }
  };

  window.Synth = Synth;

  // 自动绑定 data-sound 元素
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-sound]');
    if (!el) return;
    e.preventDefault();
    const s = el.dataset.sound;
    switch (s) {
      case 'guqin':  Synth.guqin(196); break;     // G3
      case 'guqin2': Synth.guqin(220); break;     // A3
      case 'kiln':   Synth.kiln(3.5); break;
      case 'drum':   Synth.drum(); break;
      case 'hooves': Synth.hooves(4); break;
      case 'bird':   Synth.bird(); break;
      case 'wind':   Synth.wind(2.5); break;
      case 'demo':   Synth.guqin(196, 1.2); setTimeout(() => Synth.kiln(2), 600); break;
    }
  });
})();

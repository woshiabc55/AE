import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ALL_SHOTS } from '@/data/scripts';

interface AudioNodes {
  ctx: AudioContext;
  masterGain: GainNode;
  noiseBuffers: Map<string, AudioBuffer>;
  activeNodes: AudioNode[];
}

/**
 * 简易程序化音频：根据当前 shot 的 voice 描述触发不同环境音
 * - fire → 火焰噪声（粉红噪 + 滤波）
 * - rain → 白噪声 + 高通
 * - wind → 低频噪声
 * - bow/sad → 锯齿波 + 滤波 → 弦乐
 * - heart → 鼓点（脉冲噪声）
 * - bell → 振荡器 + 衰减
 */
export function useAudio() {
  const ctxRef = useRef<AudioNodes | null>(null);

  useEffect(() => {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.2;
    masterGain.connect(ctx.destination);
    ctxRef.current = { ctx, masterGain, noiseBuffers: new Map(), activeNodes: [] };

    return () => {
      ctxRef.current?.activeNodes.forEach((n) => {
        try { (n as AudioBufferSourceNode).stop(); } catch { /* noop */ }
      });
      ctx.close();
    };
  }, []);

  // 监听 mute
  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state) => {
      if (!ctxRef.current) return;
      ctxRef.current.masterGain.gain.value = state.muted ? 0 : 0.18;
    });
    return unsub;
  }, []);

  // 监听 shot 切换播放对应声音
  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state, prev) => {
      if (state.currentIndex === prev.currentIndex) return;
      const shot = ALL_SHOTS[state.currentIndex];
      if (!shot || !ctxRef.current) return;
      playShotSound(ctxRef.current, shot.voice, shot.motif);
    });
    return unsub;
  }, []);
}

function playShotSound(nodes: AudioNodes, voice: string, motif: string[]) {
  const { ctx, masterGain } = nodes;
  const v = voice.toLowerCase();

  // 火焰
  if (v.includes('火') || motif.includes('fire')) {
    playFire(ctx, masterGain, motif.includes('rain') ? 0.3 : 0.5);
  }
  // 雨 / 风
  if (v.includes('雨') || v.includes('风') || v.includes('雪')) {
    playRain(ctx, masterGain, 0.25);
  }
  // 心跳
  if (v.includes('心跳')) {
    playHeartbeat(ctx, masterGain);
  }
  // 弦乐（升）
  if (v.includes('弦乐') || v.includes('号子')) {
    playString(ctx, masterGain, 220, 4);
  }
  // 钟 / 钟声
  if (v.includes('钟') || v.includes('叮')) {
    playBell(ctx, masterGain);
  }
  // 哭 / 喊
  if (v.includes('哭') || v.includes('喊')) {
    playCry(ctx, masterGain);
  }
  // 闪白
  if (v.includes('闪白')) {
    playFlash(ctx, masterGain);
  }
  // 噼啪声
  if (v.includes('噼啪')) {
    playCrackle(ctx, masterGain);
  }
}

function getNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBuffer {
  const length = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buf.getChannelData(0);
  if (type === 'white') {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * w) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }
  return buf;
}

function playFire(ctx: AudioContext, master: AudioNode, vol: number) {
  const buf = getNoiseBuffer(ctx, 'brown');
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.4);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.6);
  src.connect(filter).connect(gain).connect(master);
  src.start();
  src.stop(ctx.currentTime + 3);
}

function playRain(ctx: AudioContext, master: AudioNode, vol: number) {
  const buf = getNoiseBuffer(ctx, 'white');
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.7);
  src.connect(filter).connect(gain).connect(master);
  src.start();
  src.stop(ctx.currentTime + 3);
}

function playHeartbeat(ctx: AudioContext, master: AudioNode) {
  const t0 = ctx.currentTime;
  for (const t of [0, 0.3, 1.1, 1.4]) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 60;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0 + t);
    g.gain.linearRampToValueAtTime(0.4, t0 + t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + t + 0.25);
    o.connect(g).connect(master);
    o.start(t0 + t);
    o.stop(t0 + t + 0.3);
  }
}

function playString(ctx: AudioContext, master: AudioNode, freq: number, dur: number) {
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
  o.connect(filter).connect(g).connect(master);
  o.start();
  o.stop(ctx.currentTime + dur);
}

function playBell(ctx: AudioContext, master: AudioNode) {
  const t0 = ctx.currentTime;
  [523, 659, 784].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.12, t0 + 0.01 + i * 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 1.8);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + 2);
  });
}

function playCry(ctx: AudioContext, master: AudioNode) {
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(420, ctx.currentTime);
  o.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.8);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 600;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
  o.connect(filter).connect(g).connect(master);
  o.start();
  o.stop(ctx.currentTime + 1.1);
}

function playFlash(ctx: AudioContext, master: AudioNode) {
  const buf = getNoiseBuffer(ctx, 'white');
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.4, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  src.connect(filter).connect(g).connect(master);
  src.start();
  src.stop(ctx.currentTime + 0.4);
}

function playCrackle(ctx: AudioContext, master: AudioNode) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const buf = getNoiseBuffer(ctx, 'white');
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      src.connect(g).connect(master);
      src.start();
      src.stop(ctx.currentTime + 0.15);
    }, i * 80);
  }
}

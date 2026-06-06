// 简化的 Web Audio 合成器 — 为每个镜头生成环境音
// 真实实现需高保真录音，此处为演示性的合成提示

export type AudioCue =
  | "wave-loop"
  | "low-rumble"
  | "single-thump"
  | "silence"
  | "white-noise"
  | "low-fade-out";

interface CueSpec {
  type: OscillatorType | "noise";
  freq: number;
  q: number;
  gain: number;
  duration: number;
  filterFreq?: number;
}

const cueMap: Record<AudioCue, CueSpec> = {
  "wave-loop": { type: "sawtooth", freq: 60, q: 2, gain: 0.05, duration: 3, filterFreq: 400 },
  "low-rumble": { type: "sine", freq: 35, q: 4, gain: 0.04, duration: 3, filterFreq: 120 },
  "single-thump": { type: "sine", freq: 50, q: 6, gain: 0.18, duration: 0.5, filterFreq: 80 },
  "silence": { type: "sine", freq: 0, q: 0, gain: 0, duration: 3 },
  "white-noise": { type: "noise", freq: 0, q: 0, gain: 0.012, duration: 3, filterFreq: 8000 },
  "low-fade-out": { type: "sine", freq: 80, q: 2, gain: 0.03, duration: 3, filterFreq: 200 },
};

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

export function setMasterVolume(v: number) {
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
  }
}

export function playCue(cue: AudioCue, muted = false) {
  if (muted) return;
  const audio = getCtx();
  if (!audio || !masterGain) return;

  const spec = cueMap[cue];
  const now = audio.currentTime;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(spec.gain, now + 0.3);
  gain.gain.linearRampToValueAtTime(0, now + spec.duration);

  if (spec.type === "noise") {
    // White noise via buffer
    const bufferSize = audio.sampleRate * spec.duration;
    const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = audio.createBufferSource();
    source.buffer = buffer;
    if (spec.filterFreq) {
      const filter = audio.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = spec.filterFreq;
      source.connect(filter);
      filter.connect(gain);
    } else {
      source.connect(gain);
    }
    gain.connect(masterGain);
    source.start(now);
    source.stop(now + spec.duration);
    return;
  }

  const osc = audio.createOscillator();
  osc.type = spec.type as OscillatorType;
  osc.frequency.value = spec.freq;

  if (spec.filterFreq) {
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = spec.filterFreq;
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + spec.duration);
}

export const shotAudioMap: Record<string, AudioCue> = {
  "shot-21": "wave-loop",
  "shot-22": "low-rumble",
  "shot-23": "single-thump",
  "shot-24": "silence",
  "shot-25": "low-fade-out",
};

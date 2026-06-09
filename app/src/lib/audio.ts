export interface BGMHandle {
  stream: MediaStream | null;
  stop: () => void;
}

export function startBGM(volume: number): BGMHandle {
  const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
  const audioCtx = new Ctx();
  const dest = audioCtx.createMediaStreamDestination();
  const master = audioCtx.createGain();
  master.gain.value = volume;
  master.connect(dest);
  master.connect(audioCtx.destination);

  const bpm = 84;
  const beat = 60 / bpm;
  let step = 0;

  const id = window.setInterval(() => {
    if (!audioCtx || audioCtx.state === 'closed') return;
    const t = audioCtx.currentTime;
    if (step % 2 === 0) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      g.gain.setValueAtTime(0.6, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.2);
    }
    if (step % 4 === 0) {
      const bufSize = (audioCtx.sampleRate * 0.1) | 0;
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const g = audioCtx.createGain();
      g.gain.value = 0.2;
      src.connect(g).connect(master);
      src.start(t);
    }
    const notes = [220, 247, 262, 294, 330, 294, 262, 247];
    if (step % 8 === 0) {
      const f = notes[((step / 8) | 0) % notes.length];
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.4);
    }
    step++;
  }, beat * 1000);

  return {
    stream: dest.stream,
    stop: () => { clearInterval(id); try { audioCtx.close(); } catch { /* noop */ } },
  };
}

export function pickMime(): string {
  const cands = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=h264,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const m of cands) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
  }
  return 'video/webm';
}

export function formatTime(remain: number): string {
  const m = Math.floor(remain / 60000);
  const s = Math.floor((remain % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

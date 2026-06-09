import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MEME, type Meme } from '../data/memes';
import { clearParticles, drawFrame, type DrawCtx } from '../lib/canvas';

interface RendererOpts {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCardChange?: (card: Meme, idx: number, total: number) => void;
}

export function useRenderer({ canvasRef, onCardChange }: RendererOpts) {
  const rafRef = useRef<number | null>(null);
  const state = useAppStore.getState;

  useEffect(() => {
    const draw = (card: Meme, cardProgress: number, globalProgress: number) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      const s = state();
      const d: DrawCtx = {
        ctx, width: s.width, height: s.height,
        style: s.style, subtitles: s.subtitles, watermark: s.watermark,
      };
      drawFrame(d, card, cardProgress, globalProgress, s.particles);
    };

    (window as unknown as { __previewDraw: (c: Meme, p: number, g: number) => void }).__previewDraw = draw;
    if (MEME[0]) draw(MEME[0], 0.5, 0);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  function buildTimeline(): Meme[] {
    const s = state();
    const targetMs = s.totalMinutes * 60 * 1000;
    const covers = MEME.filter(m => m.categoryKey === 'CHAP');
    const pool = [...MEME.filter(m => m.categoryKey !== 'CHAP')].sort(() => Math.random() - 0.5);
    const items: Meme[] = [...covers];
    let i = 0;
    while (items.length * s.cardDuration < targetMs) {
      items.push(pool[i % pool.length]);
      i++;
    }
    return items;
  }

  async function start(onProgress?: (elapsed: number, card: Meme, idx: number, total: number) => void): Promise<Blob> {
    const s = state();
    if (s.running) throw new Error('ALREADY_RUNNING');
    useAppStore.setState({ running: true });
    const tl = buildTimeline();
    const cv = canvasRef.current;
    if (!cv) throw new Error('NO_CANVAS');

    // 启动音频
    const { startBGM, pickMime } = await import('../lib/audio');
    const bgm = startBGM(s.volume);

    const canvasStream = cv.captureStream(s.fps);
    const tracks = [...canvasStream.getVideoTracks()];
    if (bgm.stream) tracks.push(...bgm.stream.getAudioTracks());
    const combined = new MediaStream(tracks);

    const mime = pickMime();
    const recorder = new MediaRecorder(combined, {
      mimeType: mime,
      videoBitsPerSecond: s.resolution === 1080 ? 6_000_000 : 3_500_000,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const blobPromise = new Promise<Blob>(resolve => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
    });
    recorder.start(1000);
    useAppStore.getState().log(`● 录制启动 · ${mime} · ${s.width}×${s.height}`, 'ok');

    const startTs = performance.now();
    let cardIdx = 0;
    let cardStart = startTs;
    let lastDraw = 0;
    const cardDur = s.cardDuration / s.speed;
    const totalMs = s.totalMinutes * 60 * 1000;

    const loop = () => {
      if (!useAppStore.getState().running) return;
      const now = performance.now();
      const elapsed = now - startTs;
      const cardElapsed = now - cardStart;
      const cp = Math.min(1, cardElapsed / cardDur);
      const gp = Math.min(1, elapsed / totalMs);
      if (now - lastDraw >= 1000 / s.fps) {
        const card = tl[cardIdx];
        const ctx = cv.getContext('2d');
        if (ctx) {
          const d: DrawCtx = { ctx, width: s.width, height: s.height, style: s.style, subtitles: s.subtitles, watermark: s.watermark };
          drawFrame(d, card, cp, gp, s.particles);
        }
        lastDraw = now;
        onProgress?.(elapsed, card, cardIdx + 1, tl.length);
        onCardChange?.(card, cardIdx + 1, tl.length);
      }
      if (cardElapsed >= cardDur) {
        cardIdx++;
        cardStart = now;
        if (cardIdx >= tl.length) {
          const last = tl[tl.length - 1];
          const ctx = cv.getContext('2d');
          if (ctx) {
            const d: DrawCtx = { ctx, width: s.width, height: s.height, style: s.style, subtitles: s.subtitles, watermark: s.watermark };
            drawFrame(d, last, 1, 1, false);
          }
          onProgress?.(totalMs, last, tl.length, tl.length);
          setTimeout(() => {
            try { if (recorder.state === 'recording') recorder.stop(); } catch { /* noop */ }
            bgm.stop();
            clearParticles();
            useAppStore.setState({ running: false });
            useAppStore.getState().log('■ 录制完成', 'ok');
          }, 600);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const blob = await blobPromise;
    return blob;
  }

  function stop() {
    useAppStore.setState({ running: false });
  }

  return { start, stop };
}

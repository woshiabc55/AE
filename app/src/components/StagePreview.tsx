import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { drawFrame, type DrawCtx } from '../lib/canvas';
import { MEME } from '../data/memes';

export default function StagePreview() {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const resolution = useAppStore(s => s.resolution);
  const style = useAppStore(s => s.style);
  const subtitles = useAppStore(s => s.subtitles);
  const watermark = useAppStore(s => s.watermark);
  const particles = useAppStore(s => s.particles);
  const width = resolution === 720 ? 1280 : 1920;
  const height = resolution === 720 ? 720 : 1080;

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    cv.width = width; cv.height = height;
    useAppStore.setState({ width, height });
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const d: DrawCtx = { ctx, width, height, style, subtitles, watermark };
    drawFrame(d, MEME[0], 0.5, 0, particles);
  }, [width, height, style, subtitles, watermark, particles]);

  return (
    <div className="stage">
      <canvas ref={cvRef} width={width} height={height} />
      <div className="ticker">LIVE PREVIEW · {resolution}p</div>
      <div className="rec-dot" id="recDot" style={{ display: 'none' }}>REC</div>
    </div>
  );
}

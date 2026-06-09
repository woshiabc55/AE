import { useEffect, useRef, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import ControlPanel from './components/ControlPanel';
import StagePreview from './components/StagePreview';
import StatsPanel from './components/StatsPanel';
import LogBox from './components/LogBox';
import ProgressOverlay from './components/ProgressOverlay';
import { useRenderer } from './hooks/useRenderer';
import { MEME } from './data/memes';
import { formatTime } from './lib/audio';

export default function App() {
  const totalMinutes = useAppStore(s => s.totalMinutes);
  const resolution = useAppStore(s => s.resolution);
  const fps = useAppStore(s => s.fps);
  const running = useAppStore(s => s.running);
  const log = useAppStore(s => s.log);
  const [overActive, setOverActive] = useState(false);
  const [overCurrent, setOverCurrent] = useState<{ card: { title: string; category: string }; idx: number; total: number } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderer = useRenderer({ canvasRef });

  // 鼠标光斑
  const lightRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (lightRef.current) {
        lightRef.current.style.left = e.clientX + 'px';
        lightRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // 初始日志
  useEffect(() => {
    log('● React 18 + Vite + TypeScript 已加载', 'ok');
    log(`● 梗库 ${MEME.length} 条 · 默认 ${totalMinutes} 分钟 · ${resolution}p · ${fps}fps`, 'ok');
  }, []);

  async function handleGo() {
    if (running) return;
    setOverActive(true);
    setElapsedMs(0);
    setOverCurrent(null);
    const recDot = document.getElementById('recDot');
    if (recDot) recDot.style.display = 'flex';
    try {
      const blob = await renderer.start((elapsed, card, idx, total) => {
        setElapsedMs(elapsed);
        setOverCurrent({ card: { title: card.title, category: card.category }, idx, total });
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `2025-meme-explosion-react-${totalMinutes}min-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      log(`■ 下载：${(blob.size / 1024 / 1024).toFixed(1)} MB`, 'ok');
      setToast({ msg: `已下载 · ${(blob.size / 1024 / 1024).toFixed(1)} MB`, key: Date.now() });
    } catch (e) {
      log(`✗ 出错：${(e as Error).message}`, 'err');
    } finally {
      if (recDot) recDot.style.display = 'none';
      setOverActive(false);
    }
  }

  return (
    <>
      <div className="cursor-light" ref={lightRef} />
      <div className="shell">
        <header className="top">
          <div>
            <div className="brand">
              2025 热梗<br />大爆炸<span className="under" /><span className="badge">REACT</span>
            </div>
            <span className="sub">Auto · React 18 · WebM</span>
          </div>
          <div className="kpi-row">
            <div className="kpi warn"><b>{totalMinutes} min</b>默认出片时长</div>
            <div className="kpi"><b>{MEME.length}</b>条梗</div>
            <div className="kpi"><b>10</b>大分类</div>
            <div className="kpi"><b>{resolution}p</b>最高支持</div>
          </div>
        </header>

        <div className="layout">
          <ControlPanel onGo={handleGo} />
          <section className="preview-wrap">
            <StagePreview />
            <div className="under-preview">
              <div className="info">分辨率 <b>{resolution === 1080 ? '1920×1080' : '1280×720'}</b></div>
              <div className="info">帧率 <b>{fps} fps</b></div>
              <div className="info">编码 <b>VP9 / Opus</b></div>
              <div className="info">剩余 <b>{formatTime(Math.max(0, totalMinutes * 60_000 - elapsedMs))}</b></div>
            </div>
            <LogBox />
          </section>
          <StatsPanel />
        </div>

        <footer>
          React 18 + Vite + TypeScript · Canvas + MediaRecorder · 纯前端 · 建议 Chrome / Edge 桌面端 · <b>by 2025</b>
        </footer>
      </div>

      <ProgressOverlay active={overActive} current={overCurrent} elapsedMs={elapsedMs} />

      {toast && (
        <div key={toast.key} className="toast on">{toast.msg}</div>
      )}

      {/* hidden canvas for renderer reference */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}

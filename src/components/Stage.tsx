import { useEffect, useRef } from 'react';
import { Engine } from '@/engine/engine';
import { AudioManager } from '@/audio/audioManager';
import { useStore } from '@/store/useStore';

const audioManager = new AudioManager();
let engine: Engine | null = null;
let audioStarted = false;

export default function Stage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const source = useStore((s) => s.source);
  const density = useStore((s) => s.density);
  const setHud = useStore((s) => s.setHud);
  const fileName = useStore((s) => s.fileName);
  const setSource = useStore((s) => s.setSource);
  const setFileName = useStore((s) => s.setFileName);

  // 初始化引擎 + 监听首次启动事件
  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const { analyser } = await audioManager.ensure();
      if (cancelled || !canvasRef.current) return;
      engine = new Engine(canvasRef.current, analyser, {
        onHud: (hud) => setHud(hud),
        getSettings: () => ({
          sensitivity: useStore.getState().sensitivity,
          density: useStore.getState().density,
          speed: useStore.getState().speed,
          glow: useStore.getState().glow,
          ripple: useStore.getState().ripple,
          paused: useStore.getState().paused,
          themeId: useStore.getState().theme,
        }),
      });
      engine.applyDensity(density);
      engine.start();
      // 可视化先行：即使没有音频也可以看到带噪声的粒子
      // 监听用户首次点击启动音频
      const onStart = async () => {
        if (audioStarted) return;
        audioStarted = true;
        try {
          await audioManager.switchTo('synth');
        } catch (err) {
          console.warn('synth start failed', err);
        }
      };
      window.addEventListener('pulse:start', onStart);
    })();
    return () => {
      cancelled = true;
      engine?.stop();
      engine = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换音源（用户已点击启动后才会真正发声）
  useEffect(() => {
    if (!audioStarted) return;
    let cancelled = false;
    (async () => {
      try {
        if (source === 'synth') {
          await audioManager.switchTo('synth');
        } else if (source === 'mic') {
          await audioManager.switchTo('mic');
        } else if (source === 'file') {
          if (!fileName) {
            if (!cancelled) setSource('synth');
            return;
          }
          const pending = (window as unknown as { __pendingFile?: File }).__pendingFile;
          if (pending) {
            await audioManager.switchTo('file', pending);
            (window as unknown as { __pendingFile?: File }).__pendingFile = undefined;
          } else {
            await audioManager.switchTo('file');
          }
        }
      } catch (err) {
        console.warn('switch source failed', err);
        if (!cancelled) setSource('synth');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, fileName, setSource]);

  // 监听 density
  useEffect(() => {
    engine?.applyDensity(density);
  }, [density]);

  // 暴露全局给文件 input 使用
  useEffect(() => {
    (window as unknown as { __loadFile: (f: File) => void }).__loadFile = (f: File) => {
      setFileName(f.name);
      (window as unknown as { __pendingFile?: File }).__pendingFile = f;
      if (useStore.getState().source !== 'file') {
        setSource('file');
      } else {
        (async () => {
          try {
            await audioManager.switchTo('file', f);
            (window as unknown as { __pendingFile?: File }).__pendingFile = undefined;
          } catch (err) {
            console.warn(err);
          }
        })();
      }
    };
  }, [setFileName, setSource]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ background: 'transparent' }}
      aria-label="音乐粒子可视化舞台"
    />
  );
}

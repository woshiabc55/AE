import { useEffect, useState } from 'react';
import BrokenScroll from './components/BrokenScroll';
import PixelBeasts from './components/PixelBeasts';
import NodeTerminal from './components/NodeTerminal';
import GlitchCaption from './components/GlitchCaption';
import SealBar from './components/SealBar';
import BorerMask from './components/BorerMask';
import { useAtelier } from './store/useAtelier';
import { TITLE, SUBTITLE } from './data/inscriptions';

export default function App() {
  const mode = useAtelier((s) => s.mode);
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="atelier" data-mode={mode}>
      {/* 背景：远山/江面/古松/远帆 */}
      <BrokenScroll />
      {/* 像素生灵 */}
      <PixelBeasts />
      {/* 残字字幕 */}
      <GlitchCaption />
      {/* 虫蛀孔 */}
      <BorerMask />

      {/* 题字 */}
      <div className="title-block" style={{ opacity: booted ? 1 : 0 }}>
        <div className="title">{TITLE}</div>
        <div className="sub">{SUBTITLE}</div>
      </div>

      {/* 节点终端 */}
      <NodeTerminal />

      {/* 底栏朱印 */}
      <SealBar />
    </div>
  );
}

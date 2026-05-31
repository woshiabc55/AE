import { useState } from 'react';
import { designDB } from '@/data/designDB';

import LotusScroll from '@/components/archive/LotusScroll';
import WaveBorder from '@/components/archive/WaveBorder';
import KeyFretBorder from '@/components/archive/KeyFretBorder';
import PeonySpray from '@/components/archive/PeonySpray';
import CloudCollar from '@/components/archive/CloudCollar';
import Scrollwork from '@/components/archive/Scrollwork';
import BambooLeaf from '@/components/archive/BambooLeaf';
import DragonPattern from '@/components/archive/DragonPattern';
import BatPattern from '@/components/archive/BatPattern';
import RuyiCloud from '@/components/archive/RuyiCloud';

import MandelboxWireframe from '@/components/archive/MandelboxWireframe';
import SierpinskiTriangle from '@/components/archive/SierpinskiTriangle';
import KochSnowflake from '@/components/archive/KochSnowflake';
import MengerSponge from '@/components/archive/MengerSponge';
import DragonCurve from '@/components/archive/DragonCurve';
import FibonacciSpiral from '@/components/archive/FibonacciSpiral';
import VoronoiDiagram from '@/components/archive/VoronoiDiagram';
import HilbertCurve from '@/components/archive/HilbertCurve';
import FractalTree from '@/components/archive/FractalTree';
import LSystemRenderer from '@/components/archive/LSystemRenderer';

import TechGrid from '@/components/archive/TechGrid';
import CropMark from '@/components/archive/CropMark';
import PaperTag from '@/components/archive/PaperTag';
import CornerBracket from '@/components/archive/CornerBracket';
import InfoPanel from '@/components/archive/InfoPanel';
import IconToolbar from '@/components/archive/IconToolbar';
import ProgressBar from '@/components/archive/ProgressBar';
import DimensionLine from '@/components/archive/DimensionLine';
import RegistrationMark from '@/components/archive/RegistrationMark';
import StatusBar from '@/components/archive/StatusBar';

import ColorSwatch from '@/components/archive/ColorSwatch';
import ColorRamp from '@/components/archive/ColorRamp';
import GrayScale from '@/components/archive/GrayScale';
import CobaltBlueRange from '@/components/archive/CobaltBlueRange';
import TonalInversion from '@/components/archive/TonalInversion';
import PaletteCard from '@/components/archive/PaletteCard';
import ColorMatrix from '@/components/archive/ColorMatrix';
import ContrastChecker from '@/components/archive/ContrastChecker';

import DotCluster from '@/components/archive/DotCluster';
import DashedBorder from '@/components/archive/DashedBorder';
import Crosshair from '@/components/archive/Crosshair';
import LeaderLine from '@/components/archive/LeaderLine';
import AxisIndicator from '@/components/archive/AxisIndicator';
import CircledNumber from '@/components/archive/CircledNumber';
import ArrowEndpoint from '@/components/archive/ArrowEndpoint';
import Watermark from '@/components/archive/Watermark';

import BambooSilhouette from '@/components/archive/BambooSilhouette';
import SealStamp from '@/components/archive/SealStamp';
import ShuMark from '@/components/archive/ShuMark';
import TopoContour from '@/components/archive/TopoContour';
import InkWash from '@/components/archive/InkWash';
import BlankSpace from '@/components/archive/BlankSpace';

interface ComponentEntry {
  id: string;
  name: string;
  category: string;
  component: React.ReactNode;
}

const allComponents: ComponentEntry[] = [
  { id: 'lotus-scroll', name: '缠枝莲纹', category: 'qinghua', component: <LotusScroll petals={8} radius={70} /> },
  { id: 'wave-border', name: '海水江崖纹', category: 'qinghua', component: <WaveBorder width={300} height={80} waves={5} /> },
  { id: 'key-fret', name: '回纹边框', category: 'qinghua', component: <KeyFretBorder length={300} unitSize={14} /> },
  { id: 'peony', name: '折枝牡丹', category: 'qinghua', component: <PeonySpray petals={7} radius={60} layers={2} /> },
  { id: 'cloud-collar', name: '云肩纹', category: 'qinghua', component: <CloudCollar clouds={5} radius={50} /> },
  { id: 'scrollwork', name: '缠枝卷草纹', category: 'qinghua', component: <Scrollwork scrolls={4} amplitude={25} /> },
  { id: 'bamboo-leaf', name: '竹叶纹', category: 'qinghua', component: <BambooLeaf leaves={6} leafLen={35} /> },
  { id: 'dragon', name: '龙纹', category: 'qinghua', component: <DragonPattern size={120} simplified /> },
  { id: 'bat', name: '蝙蝠纹', category: 'qinghua', component: <BatPattern size={80} count={5} /> },
  { id: 'ruyi', name: '如意云头纹', category: 'qinghua', component: <RuyiCloud size={60} repeat={3} /> },

  { id: 'mandelbox', name: 'Mandelbox线框', category: 'fractal', component: <MandelboxWireframe depth={3} size={120} gap={15} /> },
  { id: 'sierpinski', name: 'Sierpinski三角', category: 'fractal', component: <SierpinskiTriangle depth={4} size={140} /> },
  { id: 'koch', name: 'Koch雪花', category: 'fractal', component: <KochSnowflake depth={3} size={120} /> },
  { id: 'menger', name: 'Menger海绵', category: 'fractal', component: <MengerSponge depth={2} size={120} /> },
  { id: 'dragon-curve', name: 'Dragon曲线', category: 'fractal', component: <DragonCurve iterations={10} size={140} /> },
  { id: 'fibonacci', name: 'Fibonacci螺旋', category: 'fractal', component: <FibonacciSpiral turns={5} size={140} /> },
  { id: 'voronoi', name: 'Voronoi图', category: 'fractal', component: <VoronoiDiagram points={12} size={140} /> },
  { id: 'hilbert', name: 'Hilbert曲线', category: 'fractal', component: <HilbertCurve order={3} size={140} /> },
  { id: 'fractal-tree', name: '分形树', category: 'fractal', component: <FractalTree depth={6} angle={25} size={140} /> },
  { id: 'lsystem', name: 'L-System', category: 'fractal', component: <LSystemRenderer axiom="F" rules={{ F: "F+F-F-F+F" }} angle={90} iterations={3} size={140} /> },

  { id: 'tech-grid', name: '技术网格', category: 'ui', component: <TechGrid width={200} height={200} /> },
  { id: 'crop-mark', name: '裁切标记', category: 'ui', component: <div className="relative w-24 h-24"><CropMark size={20} position="tl" /><CropMark size={20} position="tr" /><CropMark size={20} position="bl" /><CropMark size={20} position="br" /></div> },
  { id: 'paper-tag', name: '纸质标签', category: 'ui', component: <div className="space-y-2"><PaperTag label="PATTERN-A" rotation={-2} /><PaperTag label="蓝釉" rotation={1} /><PaperTag label="GLAZE-01" rotation={-3} /></div> },
  { id: 'corner-bracket', name: '角括号', category: 'ui', component: <CornerBracket size={80} /> },
  { id: 'info-panel', name: '信息面板', category: 'ui', component: <InfoPanel title="ARCHIVE-0047" fields={[{label:"DATE",value:"2026-05-30"},{label:"CLASS",value:"陶瓷-III"},{label:"ORIGIN",value:"蜀"}]} width={140} /> },
  { id: 'icon-toolbar', name: '图标工具栏', category: 'ui', component: <IconToolbar icons={[{id:'rect',label:'矩形',icon:'□'},{id:'circle',label:'圆',icon:'○'},{id:'tri',label:'三角',icon:'△'},{id:'diamond',label:'菱形',icon:'◇'},{id:'line',label:'线',icon:'—'},{id:'cross',label:'十字',icon:'+'}]} /> },
  { id: 'progress-bar', name: '进度条', category: 'ui', component: <div className="space-y-2 w-48"><ProgressBar value={60} max={100} label="GLAZE" /><ProgressBar value={85} max={100} label="PATTERN" color="#3a6aaa" /></div> },
  { id: 'dimension-line', name: '尺寸标注', category: 'ui', component: <DimensionLine length={160} label="SCALE 1:2.4" /> },
  { id: 'reg-mark', name: '配准标记', category: 'ui', component: <RegistrationMark size={40} circles={3} /> },
  { id: 'status-bar', name: '状态栏', category: 'ui', component: <StatusBar items={[{label:"CHARS",value:"2847"},{label:"STATUS",value:"已归档"}]} /> },

  { id: 'color-swatch', name: '色块', category: 'color', component: <div className="flex gap-2"><ColorSwatch color="#1a3a6b" label="钴蓝" hex="#1a3a6b" /><ColorSwatch color="#3a6aaa" label="中蓝" hex="#3a6aaa" /><ColorSwatch color="#a8c8e8" label="浅蓝" hex="#a8c8e8" /></div> },
  { id: 'color-ramp', name: '色彩渐变', category: 'color', component: <ColorRamp colors={['#1a3a6b','#3a6aaa','#7aaad4','#a8c8e8']} label="钴蓝色域" /> },
  { id: 'gray-scale', name: '灰阶', category: 'color', component: <GrayScale steps={8} /> },
  { id: 'cobalt-range', name: '钴蓝色域', category: 'color', component: <CobaltBlueRange steps={6} /> },
  { id: 'tonal-inversion', name: '色调反转', category: 'color', component: <TonalInversion original="#f0f0f0" inverted="#1a1a1a" /> },
  { id: 'palette-card', name: '调色板', category: 'color', component: <PaletteCard name="离线档案" colors={['#1a1a1a','#909090','#d0d0d0','#f0f0f0','#1a3a6b','#a8c8e8']} description="单色灰阶+钴蓝" /> },
  { id: 'color-matrix', name: '色彩矩阵', category: 'color', component: <ColorMatrix rows={3} cols={5} /> },
  { id: 'contrast-check', name: '对比度检查', category: 'color', component: <ContrastChecker foreground="#1a3a6b" background="#f0f0f0" /> },

  { id: 'dot-cluster', name: '圆点群', category: 'decor', component: <div className="space-y-2"><DotCluster count={5} arrangement="horizontal" /><DotCluster count={4} arrangement="diagonal" /></div> },
  { id: 'dashed-border', name: '虚线边框', category: 'decor', component: <DashedBorder width={160} height={80} /> },
  { id: 'crosshair', name: '十字准星', category: 'decor', component: <Crosshair size={30} /> },
  { id: 'leader-line', name: '引导线', category: 'decor', component: <LeaderLine label="DETAIL-A" /> },
  { id: 'axis-indicator', name: '坐标轴', category: 'decor', component: <AxisIndicator size={60} /> },
  { id: 'circled-number', name: '带圈数字', category: 'decor', component: <div className="flex gap-2"><CircledNumber number={1} /><CircledNumber number={2} /><CircledNumber number={3} /></div> },
  { id: 'arrow-endpoint', name: '箭头端点', category: 'decor', component: <div className="flex gap-2"><ArrowEndpoint direction="right" /><ArrowEndpoint direction="down" /></div> },
  { id: 'watermark', name: '水印', category: 'decor', component: <div className="relative w-40 h-20"><Watermark text="ARCHIVE" opacity={8} /><div className="absolute inset-0 flex items-center justify-center text-xs text-[#909090]">内容区域</div></div> },

  { id: 'bamboo-silhouette', name: '竹叶剪影', category: 'cultural', component: <BambooSilhouette opacity={15} size={120} /> },
  { id: 'seal-stamp', name: '印章', category: 'cultural', component: <SealStamp character="瓷" size={50} /> },
  { id: 'shu-mark', name: '蜀字标记', category: 'cultural', component: <div className="flex gap-3"><ShuMark size={40} style="modern" /><ShuMark size={40} style="seal" /></div> },
  { id: 'topo-contour', name: '等高线', category: 'cultural', component: <TopoContour lines={5} size={120} /> },
  { id: 'ink-wash', name: '水墨渲染', category: 'cultural', component: <div className="relative w-32 h-24 border border-[#d0d0d0]"><InkWash opacity={20} /><div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#909090]">覆层效果</div></div> },
  { id: 'blank-space', name: '留白', category: 'cultural', component: <BlankSpace width={160} height={60} label="留白 / NEGATIVE SPACE" /> },
];

const categoryGroups = [
  { id: 'qinghua', label: '🏺 青花瓷纹饰', count: 10 },
  { id: 'fractal', label: '◇ 分形几何', count: 10 },
  { id: 'ui', label: '📋 离线档案UI', count: 10 },
  { id: 'color', label: '🎨 色彩系统', count: 8 },
  { id: 'decor', label: '✦ 装饰元素', count: 8 },
  { id: 'cultural', label: '🏯 文化符号', count: 6 },
];

export default function ComponentGallery() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? allComponents.filter((c) => c.category === activeCategory)
    : allComponents;

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="crop-mark crop-mark-tl" />
      <div className="crop-mark crop-mark-tr" />
      <div className="crop-mark crop-mark-bl" />
      <div className="crop-mark crop-mark-br" />

      <header className="border-b border-[#1a1a1a] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#606060] hover:text-[#1a1a1a] transition-colors text-sm font-mono-cn">
              ← 首页
            </a>
            <div className="w-px h-5 bg-[#d0d0d0]" />
            <h1 className="text-lg font-black">组件库</h1>
            <span className="font-mono-cn text-[10px] text-[#909090] border border-[#d0d0d0] px-2 py-0.5">
              {allComponents.length} COMPONENTS
            </span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090]">
            6分类 · 52组件 · 离线档案风格
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-black">组件</span>
          <span className="text-2xl font-black qblue-accent">画廊</span>
          <span className="font-mono-cn text-xs text-[#909090]">COMPONENT GALLERY</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-xs font-mono-cn border transition-all cursor-pointer ${
              !activeCategory ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'border-[#d0d0d0] text-[#606060] hover:border-[#1a3a6b]'
            }`}
          >
            全部 ({allComponents.length})
          </button>
          {categoryGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveCategory(g.id)}
              className={`px-3 py-1.5 text-xs font-mono-cn border transition-all cursor-pointer ${
                activeCategory === g.id ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'border-[#d0d0d0] text-[#606060] hover:border-[#1a3a6b]'
              }`}
            >
              {g.label} ({g.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="paper-card p-0 overflow-hidden animate-fade-in-up"
            >
              <div className="border-b border-[#d0d0d0] px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold truncate">{entry.name}</span>
                <span className="font-mono-cn text-[8px] text-[#909090]">{entry.id}</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[140px] bg-white/50">
                {entry.component}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 COMPONENT GALLERY</span>
          <span>{allComponents.length} components · 6 categories</span>
        </div>
      </footer>
    </div>
  );
}

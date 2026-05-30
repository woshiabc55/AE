import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Layers, Download, Plus, Trash2, ArrowUp, ArrowDown, Image, Type, Shapes } from 'lucide-react';

interface CanvasItem {
  id: string;
  type: 'svg' | 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
}

const SAMPLE_SVGS: { name: string; code: string }[] = [
  {
    name: "网格背景",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><rect width="400" height="400" fill="#f0f0f0"/><g stroke="#d0d0d0" stroke-width="0.25"><line x1="0" y1="20" x2="400" y2="20"/><line x1="0" y1="40" x2="400" y2="40"/><line x1="20" y1="0" x2="20" y2="400"/><line x1="40" y1="0" x2="40" y2="400"/></g><g stroke="#e0e0e0" stroke-width="0.15"><line x1="0" y1="5" x2="400" y2="5"/><line x1="0" y1="10" x2="400" y2="10"/><line x1="5" y1="0" x2="5" y2="400"/><line x1="10" y1="0" x2="10" y2="400"/></g></svg>`,
  },
  {
    name: "缠枝莲",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><g transform="translate(100,100)" stroke="#1a3a6b" fill="none" stroke-width="1"><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(0)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(45)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(90)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(135)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(180)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(225)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(270)"/><ellipse cx="0" cy="-35" rx="12" ry="30" transform="rotate(315)"/><circle r="10" stroke-width="0.7"/><circle r="4" fill="#1a3a6b"/></g></svg>`,
  },
  {
    name: "角括号",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><g stroke="#1a1a1a" stroke-width="0.75" fill="none"><polyline points="5,25 5,5 25,5"/><polyline points="175,5 195,5 195,25"/><polyline points="5,175 5,195 25,195"/><polyline points="175,195 195,195 195,175"/></g></svg>`,
  },
  {
    name: "信息面板",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 280" width="120" height="280"><rect width="120" height="280" fill="#ffffff" stroke="#1a1a1a" stroke-width="0.5" rx="2"/><rect width="120" height="24" fill="#1a3a6b" rx="2"/><rect y="20" width="120" height="4" fill="#1a3a6b"/><text x="8" y="16" font-family="monospace" font-size="8" fill="#ffffff">ARCHIVE-0047</text><text x="8" y="40" font-family="monospace" font-size="7" fill="#909090">DATE</text><line x1="8" y1="44" x2="112" y2="44" stroke="#e0e0e0" stroke-width="0.3"/><text x="8" y="62" font-family="monospace" font-size="7" fill="#909090">CLASS</text><line x1="8" y1="66" x2="112" y2="66" stroke="#e0e0e0" stroke-width="0.3"/><text x="8" y="84" font-family="monospace" font-size="7" fill="#909090">ORIGIN</text><line x1="8" y1="88" x2="112" y2="88" stroke="#e0e0e0" stroke-width="0.3"/><text x="8" y="106" font-family="monospace" font-size="7" fill="#909090">MATERIAL</text><line x1="8" y1="110" x2="112" y2="110" stroke="#e0e0e0" stroke-width="0.3"/><text x="8" y="128" font-family="monospace" font-size="7" fill="#909090">CONDITION</text><line x1="8" y1="132" x2="112" y2="132" stroke="#e0e0e0" stroke-width="0.3"/></svg>`,
  },
  {
    name: "纸质标签",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 35" width="120" height="35"><g transform="rotate(-2, 60, 17)"><rect x="5" y="5" width="100" height="25" fill="#ffffff" stroke="#1a1a1a" stroke-width="0.5" rx="1"/><text x="15" y="22" font-family="monospace" font-size="10" fill="#1a1a1a">PATTERN-A</text></g></svg>`,
  },
];

export default function CollageBoard() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragInfo, setDragInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addItem = useCallback((type: CanvasItem['type'], content: string, label: string, w = 200, h = 200) => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setItems((prev) => [...prev, {
      id,
      type,
      content,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: w,
      height: h,
      rotation: (Math.random() - 0.5) * 6,
      label,
    }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItemId(null);
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      if (direction === 'up' && idx < next.length - 1) {
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      } else if (direction === 'down' && idx > 0) {
        [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      }
      return next;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
    setDragInfo({
      id,
      offsetX: e.clientX - item.x,
      offsetY: e.clientY - item.y,
    });
    setSelectedItemId(id);
  }, [items]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragInfo) return;
    const newX = e.clientX - dragInfo.offsetX;
    const newY = e.clientY - dragInfo.offsetY;
    setItems((prev) =>
      prev.map((i) => (i.id === dragInfo.id ? { ...i, x: newX, y: newY } : i))
    );
  }, [dragInfo]);

  const handleMouseUp = useCallback(() => {
    setDragInfo(null);
  }, []);

  const handleExportPng = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: '#f0f0f0',
        pixelRatio: 2,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'skill-nim-collage.png';
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, []);

  const handleExportSvg = useCallback(() => {
    const svgItems = items
      .filter((i) => i.type === 'svg')
      .map(
        (i) =>
          `<g transform="translate(${i.x},${i.y}) rotate(${i.rotation})">${i.content.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}</g>`
      )
      .join('\n');

    const textItems = items
      .filter((i) => i.type === 'text')
      .map(
        (i) =>
          `<text x="${i.x}" y="${i.y}" font-family="monospace" font-size="14" fill="#1a1a1a" transform="rotate(${i.rotation},${i.x},${i.y})">${i.content}</text>`
      )
      .join('\n');

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="#f0f0f0"/>
  ${svgItems}
  ${textItems}
</svg>`;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill-nim-collage.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#1a1a1a] bg-white/80 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#1a3a6b]" />
          <span className="font-mono-cn text-xs tracking-wider">拼接画板</span>
          <span className="font-mono-cn text-[10px] text-[#909090]">素材: {items.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-[10px] font-mono-cn border border-[#d0d0d0] px-2 py-1 bg-white"
            onChange={(e) => {
              const svg = SAMPLE_SVGS.find((s) => s.name === e.target.value);
              if (svg) addItem('svg', svg.code, svg.name);
              e.target.value = '';
            }}
            value=""
          >
            <option value="">添加SVG素材...</option>
            {SAMPLE_SVGS.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={() => addItem('text', '瓷器设计·青花瓷', '文本', 200, 30)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#d0d0d0] hover:border-[#1a3a6b] transition-all cursor-pointer"
          >
            <Type size={10} />
            文本
          </button>
          <button
            onClick={() => {
              const url = prompt('输入图片URL:');
              if (url) addItem('image', url, '图片', 300, 200);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#d0d0d0] hover:border-[#1a3a6b] transition-all cursor-pointer"
          >
            <Image size={10} />
            图片
          </button>
          <div className="w-px h-4 bg-[#d0d0d0]" />
          <button
            onClick={handleExportPng}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all cursor-pointer"
          >
            <Download size={10} />
            导出PNG
          </button>
          <button
            onClick={handleExportSvg}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all cursor-pointer"
          >
            <Shapes size={10} />
            导出SVG
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden grid-bg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Plus size={32} className="mx-auto text-[#d0d0d0]" />
                <p className="font-mono-cn text-xs text-[#909090]">
                  点击上方按钮添加素材到画板
                </p>
                <p className="font-mono-cn text-[10px] text-[#c0c0c0]">
                  支持SVG图形、文本块、图片 · 拖拽排列 · 导出PNG/SVG
                </p>
              </div>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className={`absolute cursor-move ${selectedItemId === item.id ? 'ring-1 ring-[#1a3a6b] ring-offset-1' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                transform: `rotate(${item.rotation}deg)`,
                boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
            >
              {item.type === 'svg' && (
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              )}
              {item.type === 'text' && (
                <div className="bg-white border border-[#1a1a1a] px-3 py-1.5 font-mono-cn text-sm text-[#1a1a1a]">
                  {item.content}
                </div>
              )}
              {item.type === 'image' && (
                <img
                  src={item.content}
                  alt={item.label}
                  className="max-w-[400px] max-h-[300px] border border-[#d0d0d0]"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-48 border-l border-[#d0d0d0] bg-[#faf8f5] overflow-y-auto scrollbar-thin shrink-0">
          <div className="p-2 border-b border-[#d0d0d0]">
            <span className="font-mono-cn text-[9px] text-[#909090]">图层 / LAYERS</span>
          </div>
          {items.length === 0 && (
            <div className="p-4 text-center font-mono-cn text-[10px] text-[#c0c0c0]">
              暂无图层
            </div>
          )}
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemId(item.id)}
              className={`px-3 py-2 border-b border-[#f0f0f0] cursor-pointer transition-all ${
                selectedItemId === item.id ? 'bg-[#1a3a6b] text-white' : 'hover:bg-[#f0f0f0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px]">
                    {item.type === 'svg' ? '◇' : item.type === 'text' ? 'T' : '□'}
                  </span>
                  <span className="text-[10px] font-bold truncate max-w-[80px]">{item.label}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'up'); }}
                    className={`p-0.5 ${selectedItemId === item.id ? 'text-white hover:text-[#a8c8e8]' : 'text-[#909090] hover:text-[#1a1a1a]'}`}
                  >
                    <ArrowUp size={9} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'down'); }}
                    className={`p-0.5 ${selectedItemId === item.id ? 'text-white hover:text-[#a8c8e8]' : 'text-[#909090] hover:text-[#1a1a1a]'}`}
                  >
                    <ArrowDown size={9} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className={`p-0.5 ${selectedItemId === item.id ? 'text-white hover:text-red-300' : 'text-[#909090] hover:text-red-500'}`}
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              </div>
              <div className={`text-[8px] mt-0.5 font-mono-cn ${selectedItemId === item.id ? 'text-[#a8c8e8]' : 'text-[#b0b0b0]'}`}>
                L{idx + 1} · ({Math.round(item.x)}, {Math.round(item.y)}) · {item.rotation.toFixed(1)}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

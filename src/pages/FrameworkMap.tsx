import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Flame, Ear, Hourglass, PenTool } from 'lucide-react';
import { dimensions, centerNode, timeAxisData } from '@/data/weiyang';
import { useAppStore } from '@/store/useAppStore';

const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={18} />,
  Flame: <Flame size={18} />,
  Ear: <Ear size={18} />,
  Hourglass: <Hourglass size={18} />,
  PenTool: <PenTool size={18} />,
};

export default function FrameworkMap() {
  const navigate = useNavigate();
  const { expandedDimensions, toggleDimension, openDetailPanel, activeNodeId, detailPanelOpen, closeDetailPanel } = useAppStore();

  const activeSection = activeNodeId
    ? dimensions.flatMap((d) => d.sections).find((s) => s.id === activeNodeId)
    : null;
  const activeDimension = activeNodeId
    ? dimensions.find((d) => d.sections.some((s) => s.id === activeNodeId))
    : null;

  return (
    <div className="min-h-screen relative noise-overlay paper-texture">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center px-4 pb-4">
          <CenterNode />

          <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            {dimensions.map((dim, idx) => (
              <DimensionCard
                key={dim.id}
                dimension={dim}
                index={idx}
                isExpanded={expandedDimensions.has(dim.id)}
                onToggle={() => toggleDimension(dim.id)}
                onNodeClick={(nodeId) => openDetailPanel(nodeId)}
                activeNodeId={activeNodeId}
              />
            ))}
          </div>

          <TimeAxis
            items={timeAxisData}
            onNodeClick={(nodeId) => openDetailPanel(nodeId)}
            activeNodeId={activeNodeId}
          />
        </main>

        {detailPanelOpen && activeSection && activeDimension && (
          <DetailPanel
            section={activeSection}
            dimension={activeDimension}
            onClose={closeDetailPanel}
            onEdit={() => {
              navigate(`/editor/${activeSection.id}`);
              closeDetailPanel();
            }}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b border-loess-800/30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-vermilion-700/60 flex items-center justify-center">
          <span className="text-loess-100 font-serif text-sm font-bold">未</span>
        </div>
        <h1 className="font-serif text-lg text-loess-200 tracking-wider">未央宫文档工作台</h1>
      </div>
      <div className="flex items-center gap-2 text-loess-400 text-xs">
        <span className="font-serif">五维解析 · 交互式框架</span>
      </div>
    </header>
  );
}

function CenterNode() {
  return (
    <div className="mt-8 flex flex-col items-center animate-fade-in">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-vermilion-700/80 to-loess-700/60 flex flex-col items-center justify-center node-glow animate-pulse-glow">
          <span className="font-serif text-2xl text-loess-50 font-bold tracking-widest">{centerNode.title}</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-ink-800 px-3 py-0.5 rounded-full border border-loess-700/40">
          <span className="text-loess-400 text-xs font-serif">{centerNode.subtitle}</span>
        </div>
      </div>
      <p className="mt-4 text-loess-400 text-sm text-center max-w-md leading-relaxed">
        {centerNode.description}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dim.color }}
          />
        ))}
      </div>
    </div>
  );
}

interface DimensionCardProps {
  dimension: typeof dimensions[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNodeClick: (nodeId: string) => void;
  activeNodeId: string | null;
}

function DimensionCard({ dimension, index, isExpanded, onToggle, onNodeClick, activeNodeId }: DimensionCardProps) {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full group"
      >
        <div
          className={`
            relative overflow-hidden rounded-lg border transition-all duration-300
            ${isExpanded
              ? 'border-opacity-60 bg-ink-800/80 shadow-lg'
              : 'border-opacity-30 bg-ink-800/40 hover:bg-ink-800/60 hover:border-opacity-50'
            }
          `}
          style={{ borderColor: dimension.color }}
        >
          <div className="p-4 flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isExpanded ? dimension.color + '30' : dimension.color + '15',
                color: dimension.color,
              }}
            >
              {iconMap[dimension.icon]}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3
                className="font-serif text-sm font-semibold transition-colors duration-200"
                style={{ color: isExpanded ? dimension.color : '#e6d5ab' }}
              >
                {dimension.title}
              </h3>
              <p className="text-loess-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                {dimension.description}
              </p>
            </div>
            <div
              className="shrink-0 mt-1 transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: dimension.color }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {isExpanded && (
            <div className="px-4 pb-3 space-y-1.5">
              <div className="ancient-divider mb-2" />
              {dimension.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeClick(sec.id);
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-200
                    ${activeNodeId === sec.id
                      ? 'bg-ink-700/80 node-glow-active'
                      : 'hover:bg-ink-700/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: dimension.color }}
                    />
                    <span className={`${activeNodeId === sec.id ? 'text-loess-100' : 'text-loess-300'} font-serif`}>
                      {sec.title}
                    </span>
                  </div>
                  {sec.timeMarker && (
                    <span className="ml-3.5 text-loess-600 text-[10px]">{sec.timeMarker}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

interface TimeAxisProps {
  items: typeof timeAxisData;
  onNodeClick: (nodeId: string) => void;
  activeNodeId: string | null;
}

function TimeAxis({ items, onNodeClick, activeNodeId }: TimeAxisProps) {
  return (
    <div className="w-full max-w-5xl mt-10 mb-4">
      <div className="text-center mb-3">
        <span className="text-loess-500 text-xs font-serif tracking-widest">时 间 轴</span>
      </div>
      <div className="relative px-4">
        <div className="absolute top-3 left-8 right-8 h-px bg-gradient-to-r from-transparent via-loess-700/40 to-transparent" />
        <div className="flex justify-between">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNodeClick(item.nodeId)}
              className="flex flex-col items-center group relative"
            >
              <div
                className={`
                  w-6 h-6 rounded-full border-2 transition-all duration-300 z-10
                  ${activeNodeId === item.nodeId
                    ? 'scale-125 border-vermilion-500 bg-vermilion-700/40'
                    : 'border-loess-700/60 bg-ink-800 group-hover:border-loess-500 group-hover:scale-110'
                  }
                `}
              />
              <span className="mt-2 text-[10px] text-loess-500 group-hover:text-loess-300 transition-colors font-serif whitespace-nowrap">
                {item.year}
              </span>
              <span className="text-[9px] text-loess-600 group-hover:text-loess-400 transition-colors whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DetailPanelProps {
  section: typeof dimensions[0]['sections'][0];
  dimension: typeof dimensions[0];
  onClose: () => void;
  onEdit: () => void;
}

function DetailPanel({ section, dimension, onClose, onEdit }: DetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-ink-800/95 border-l border-loess-700/30 animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dimension.color }}
              />
              <span className="text-loess-400 text-xs font-serif">{dimension.title}</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-ink-700/60 hover:bg-ink-600 flex items-center justify-center text-loess-400 hover:text-loess-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="font-serif text-xl text-loess-100 mb-4 leading-relaxed">
            {section.title}
          </h2>

          {section.timeMarker && (
            <div className="flex flex-wrap gap-2 mb-4">
              {section.timeMarker && (
                <span className="px-2 py-0.5 rounded bg-ink-700/60 text-loess-400 text-[10px] font-serif border border-loess-800/30">
                  {section.timeMarker}
                </span>
              )}
              {section.spaceScene && (
                <span className="px-2 py-0.5 rounded bg-ink-700/60 text-loess-400 text-[10px] font-serif border border-loess-800/30">
                  {section.spaceScene}
                </span>
              )}
              {section.coreFigure && (
                <span className="px-2 py-0.5 rounded bg-ink-700/60 text-loess-400 text-[10px] font-serif border border-loess-800/30">
                  {section.coreFigure}
                </span>
              )}
            </div>
          )}

          <div className="ancient-divider mb-4" />

          <div className="text-loess-300 text-sm leading-relaxed mb-6 line-clamp-[12]">
            {section.content
              .replace(/^##.*$/m, '')
              .replace(/>\s/gm, '')
              .replace(/\*\*/g, '')
              .replace(/\n{2,}/g, '\n\n')
              .trim()
              .slice(0, 300)}
            ...
          </div>

          {section.materialImagery && (
            <div className="mb-6 p-3 rounded-lg bg-ink-700/30 border border-loess-800/20">
              <span className="text-loess-500 text-[10px] font-serif block mb-1">物性意象</span>
              <span className="text-loess-300 text-xs">{section.materialImagery}</span>
            </div>
          )}

          <button
            onClick={onEdit}
            className="w-full py-2.5 rounded-lg font-serif text-sm transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: dimension.color + '25',
              color: dimension.color,
              border: `1px solid ${dimension.color}40`,
            }}
          >
            进入编辑 →
          </button>
        </div>
      </div>
    </div>
  );
}

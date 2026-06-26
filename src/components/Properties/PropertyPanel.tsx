import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import FillEditor from './FillEditor';
import StrokeEditor from './StrokeEditor';
import TransformEditor from './TransformEditor';

const tabs = [
  { key: 'properties' as const, label: '属性' },
];

function Section({
  title,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#0a0c14]">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full px-3 py-2 text-[10px] font-medium text-gray-400 hover:text-gray-200 transition-colors uppercase tracking-wider"
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        {title}
      </button>
      {!collapsed && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export default function PropertyPanel() {
  const selectedElementId = useProjectStore((s) => s.selectedElementId);
  const elements = useProjectStore((s) => s.project.elements);
  const element = elements.find((e) => e.id === selectedElementId);

  const [activeTab] = useState<'properties'>('properties');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#15171f] select-none relative">
      {/* 3D 左侧内嵌阴影 */}
      <div className="absolute top-0 left-0 bottom-0 w-px bg-[#0a0c14]" />
      <div className="absolute top-0 left-0 bottom-0 w-2 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)' }}
      />

      {/* 标签栏 - 3D 浮雕效果 */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="flex items-center h-9 border-b border-[#0a0c14] shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-3 h-full text-[10px] transition-all duration-150 uppercase tracking-wider ${
                activeTab === tab.key
                  ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {!element ? (
          <div className="flex flex-col items-center justify-center h-full text-[10px] text-white/15 gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
              style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
            >
              <span className="text-white/20 text-lg">?</span>
            </div>
            选中元素以编辑属性
          </div>
        ) : (
          <div className="py-1">
            {/* 元素类型标识 - 3D 徽章 */}
            <div className="px-3 py-2">
              <div
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,229,255,0.03))',
                  border: '1px solid rgba(0,229,255,0.15)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <span className="text-[#00e5ff]">{element.type}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/30 font-mono">{element.id.slice(-6)}</span>
              </div>
            </div>

            <Section
              title="填充"
              collapsed={!!collapsed.fill}
              onToggle={() => toggleSection('fill')}
            >
              <FillEditor element={element} />
            </Section>

            <Section
              title="描边"
              collapsed={!!collapsed.stroke}
              onToggle={() => toggleSection('stroke')}
            >
              <StrokeEditor element={element} />
            </Section>

            <Section
              title="变换"
              collapsed={!!collapsed.transform}
              onToggle={() => toggleSection('transform')}
            >
              <TransformEditor element={element} />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

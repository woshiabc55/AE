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
    <div className="border-b border-white/5">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 w-full px-3 py-1.5 text-[11px] font-medium text-gray-300 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        {title}
      </button>
      {!collapsed && <div className="px-3 pb-2.5">{children}</div>}
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
    <div className="flex flex-col h-full bg-[#1a1d27] border-l border-white/10 select-none">
      {/* 标签栏 */}
      <div className="flex items-center h-9 border-b border-white/10 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 h-full text-xs transition-colors ${
              activeTab === tab.key
                ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {!element ? (
          <div className="flex items-center justify-center h-full text-xs text-gray-600">
            未选中元素
          </div>
        ) : (
          <div className="py-1">
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

import { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import type { Scene, TransitionType } from '../../types';
import { Plus, X, ArrowRight, Film } from 'lucide-react';

const PREVIEW_COLORS = ['#1e2a3a', '#1e3a4a', '#2a1e3a', '#2e3a2a', '#3a2a1e', '#1e3a2a'];

export default function SceneManager() {
  const { project, addScene, removeScene } = useProjectStore();
  const scenes = project.scenes;
  const [activeId, setActiveId] = useState<string>(scenes[0]?.id ?? '');

  const handleAdd = () => {
    const s = addScene(`场景 ${scenes.length + 1}`);
    setActiveId(s.id);
  };

  return (
    <div className="relative">
      {/* 3D 顶部高光 - 模拟光线照射 */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="flex items-center gap-2 h-[110px] px-4 bg-[#13151e] overflow-x-auto">
        {scenes.map((scene, i) => (
          <div key={scene.id} className="flex items-center shrink-0">
            {/* 场景间过渡箭头 - 3D 透视效果 */}
            {i > 0 && (
              <div className="flex flex-col items-center mx-1">
                <ArrowRight size={12} className="text-white/25" />
                <span className="text-[7px] text-white/15 mt-0.5">→</span>
              </div>
            )}

            {/* 场景卡片 - 3D 浮雕效果 */}
            <div
              className="relative group cursor-pointer rounded-lg"
              onClick={() => setActiveId(scene.id)}
            >
              {/* 3D 挤压底层 */}
              <div
                className="absolute inset-0 rounded-lg translate-x-[3px] translate-y-[3px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              />

              {/* 主体 */}
              <div
                className={`relative w-[130px] h-[80px] rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                  activeId === scene.id
                    ? 'border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'border-white/10 hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                }`}
                style={{ backgroundColor: PREVIEW_COLORS[i % PREVIEW_COLORS.length] }}
              >
                {/* 3D 顶部高光 */}
                <div
                  className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)',
                  }}
                />

                {/* 3D 内嵌阴影 - 底部 */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                  }}
                />

                {/* 中心图标 */}
                <div className="flex items-center justify-center h-full text-white/15">
                  <Film size={22} />
                </div>

                {/* 场景序号徽章 */}
                <div
                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: activeId === scene.id ? '#00e5ff' : 'rgba(255,255,255,0.4)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {i + 1}
                </div>

                {/* 删除按钮 */}
                {scenes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeScene(scene.id);
                      if (activeId === scene.id) setActiveId(scenes[0]?.id ?? '');
                    }}
                    className="absolute top-1.5 right-1.5 p-0.5 rounded bg-black/60 text-white/40 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-black/80 transition-all"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>

              {/* 底部标签 */}
              <div className="flex justify-between items-center mt-1.5 px-0.5">
                <span className="text-[10px] text-white/50 truncate max-w-[75px]">{scene.name}</span>
                <span className="text-[8px] text-white/25 font-mono">{scene.endFrame - scene.startFrame}f</span>
              </div>
            </div>
          </div>
        ))}

        {/* 添加按钮 - 3D 压缩效果 */}
        <div className="shrink-0 relative">
          {/* 3D 底层偏移 */}
          <div className="absolute inset-0 w-[130px] h-[80px] rounded-lg translate-x-[3px] translate-y-[3px] bg-black/30" />

          <button
            onClick={handleAdd}
            className="relative w-[130px] h-[80px] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/25 hover:text-white/50 hover:border-white/20 hover:bg-white/[0.02] transition-all"
          >
            <Plus size={20} />
            <span className="text-[9px] mt-1.5 tracking-wide">添加场景</span>
          </button>
        </div>
      </div>

      {/* 底部3D 深度线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/50 to-transparent" />
    </div>
  );
}

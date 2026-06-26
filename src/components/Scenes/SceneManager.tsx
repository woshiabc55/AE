import { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import type { Scene, TransitionType } from '../../types';
import { Plus, X, ArrowRight, Film } from 'lucide-react';

const PREVIEW_COLORS = ['#2a2d3a', '#1e3a4a', '#3a2a1e', '#2e3a2a', '#3a1e3a', '#1e2a3a'];

export default function SceneManager() {
  const { project, addScene, removeScene } = useProjectStore();
  const scenes = project.scenes;
  const [activeId, setActiveId] = useState<string>(scenes[0]?.id ?? '');

  const handleAdd = () => {
    const s = addScene(`场景 ${scenes.length + 1}`);
    setActiveId(s.id);
  };

  return (
    <div className="flex items-center gap-1 h-[100px] px-3 bg-[#1a1d27] border-t border-white/10 overflow-x-auto">
      {scenes.map((scene, i) => (
        <div key={scene.id} className="flex items-center shrink-0">
          {/* transition arrow */}
          {i > 0 && (
            <ArrowRight size={12} className="text-white/30 mx-1 shrink-0" />
          )}
          {/* scene card */}
          <div
            className="relative group cursor-pointer rounded-md overflow-hidden"
            onClick={() => setActiveId(scene.id)}
          >
            <div
              className={`w-[120px] h-[80px] rounded-md border-2 transition-colors ${
                activeId === scene.id ? 'border-[#00e5ff]' : 'border-white/10'
              }`}
              style={{ backgroundColor: PREVIEW_COLORS[i % PREVIEW_COLORS.length] }}
            >
              <div className="flex items-center justify-center h-full text-white/20">
                <Film size={20} />
              </div>
            </div>
            {/* delete button */}
            {scenes.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); removeScene(scene.id); if (activeId === scene.id) setActiveId(scenes[0]?.id ?? ''); }}
                className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white/50 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
              >
                <X size={10} />
              </button>
            )}
            <div className="flex justify-between items-center mt-1 px-0.5">
              <span className="text-[10px] text-white/60 truncate max-w-[70px]">{scene.name}</span>
              <span className="text-[9px] text-white/30">{scene.endFrame - scene.startFrame}f</span>
            </div>
          </div>
        </div>
      ))}
      {/* add button */}
      <button
        onClick={handleAdd}
        className="shrink-0 w-[120px] h-[80px] rounded-md border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
      >
        <Plus size={18} />
        <span className="text-[10px] mt-1">添加场景</span>
      </button>
    </div>
  );
}

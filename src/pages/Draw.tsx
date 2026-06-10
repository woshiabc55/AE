import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Undo2, Redo2, Trash2, Save, FolderOpen } from "lucide-react";
import SvgCanvas from "@/components/canvas/SvgCanvas";
import ToolPanel from "@/components/panels/ToolPanel";
import LayersPanel from "@/components/panels/LayersPanel";
import { useProjectStore } from "@/store/projectStore";
import { PRESET_TEMPLATES } from "@/templates/presets";

export default function Draw() {
  const project = useProjectStore((s) => s.project);
  const undo = useProjectStore((s) => s.undo);
  const newBlank = useProjectStore((s) => s.newBlankProject);
  const loadTemplate = useProjectStore((s) => s.loadTemplate);
  const navigate = useNavigate();

  const [openTpl, setOpenTpl] = useState(false);

  const handleSave = () => {
    localStorage.setItem("mochi-project", JSON.stringify(project));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">01 · DRAW</span>
          <span className="text-mist-200 text-sm">/</span>
          <input
            value={project.name}
            onChange={(e) => useProjectStore.getState().setProjectName(e.target.value)}
            className="input w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} className="btn-ghost" title="撤销 (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="btn-ghost opacity-50 cursor-not-allowed" title="重做">
            <Redo2 className="w-4 h-4" />
          </button>
          <button onClick={handleSave} className="btn-ghost">
            <Save className="w-4 h-4" /> 保存
          </button>
          <button onClick={() => setOpenTpl((v) => !v)} className="btn-ghost">
            <FolderOpen className="w-4 h-4" /> 模板
          </button>
          <button
            onClick={() => navigate("/layers")}
            className="btn-primary"
            disabled={project.shapes.length === 0}
          >
            下一步：分层 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {openTpl && (
        <div className="panel p-3 flex items-center gap-3">
          <span className="label-cap">加载预设</span>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => {
                newBlank();
                setOpenTpl(false);
              }}
              className="btn-ghost text-sm"
            >
              <Trash2 className="w-4 h-4" /> 空白画布
            </button>
            {PRESET_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  loadTemplate(t.build());
                  setOpenTpl(false);
                }}
                className="btn-ghost text-sm"
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-[auto_1fr_18rem] gap-3">
        <ToolPanel />
        <div className="min-h-0">
          <SvgCanvas width={project.canvasWidth} height={project.canvasHeight} />
        </div>
        <LayersPanel />
      </div>

      <div className="panel p-3 flex items-center gap-4 text-xs font-mono text-mist-300">
        <span>提示：</span>
        <span><kbd className="chip">点击</kbd> 起点 + 终点绘制矩形 / 椭圆</span>
        <span><kbd className="chip">拖动</kbd> 画笔自由涂画</span>
        <span><kbd className="chip">点击两点</kbd> 钢笔闭合路径</span>
        <span><kbd className="chip">Del</kbd> 删除选中</span>
        <span><kbd className="chip">Shift+拖动</kbd> 平移画布</span>
      </div>
    </div>
  );
}

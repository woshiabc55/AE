import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { listProjects } from "@/db/db";
import { useLibraryStore } from "@/stores/libraryStore";
import { useStudioStore } from "@/stores/studioStore";
import { HALF_TEMPLATES, getTemplateBeads, getTemplateMirrorBeads } from "@/utils/templates";
import BeadThumbnail from "@/components/library/BeadThumbnail";
import ProjectCard from "@/components/library/ProjectCard";
import { Search, Plus, FolderOpen, Sparkles, FileText } from "lucide-react";

export default function Library() {
  const navigate = useNavigate();
  const { search, setSearch, refresh, removeProject, newBlank, newFromTemplate } =
    useLibraryStore();
  const loadProject = useStudioStore((s) => s.loadProject);
  const [showNew, setShowNew] = useState(false);

  const projects = useLiveQuery(() => listProjects(), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = (projects ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openProject = async (id: string) => {
    await loadProject(id);
    navigate("/studio");
  };

  return (
    <div className="h-full overflow-y-auto p-6 noise-overlay">
      <div className="mx-auto max-w-6xl">
        {/* 头部 */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-pixel text-lg text-mint">MODULE LIBRARY</h1>
            <p className="mt-1 font-mono text-xs text-ink-400">
              半面模块库 · 拼合 · 模板套用
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索作品..."
                className="w-48 rounded-bead border border-ink-600 bg-ink-700 py-1.5 pl-7 pr-3 font-mono text-xs text-cream placeholder:text-ink-500 focus:border-mint focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowNew(!showNew)}
              className="btn-bead btn-bead-primary"
            >
              <Plus className="h-4 w-4" />
              新建
            </button>
          </div>
        </div>

        {/* 新建面板 */}
        {showNew && (
          <section className="panel mb-6 p-4">
            <h2 className="title-pixel mb-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-volt" />
              CREATE NEW
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {HALF_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={async () => {
                    await newFromTemplate(t.id, `${t.label}作品`);
                    setShowNew(false);
                    navigate("/studio");
                  }}
                  className="group flex flex-col items-center gap-2 rounded-bead border border-ink-600 bg-ink-800 p-3 transition-all hover:border-mint hover:shadow-glow"
                >
                  <BeadThumbnail
                    beads={[...getTemplateBeads(t.id), ...getTemplateMirrorBeads(t.id)]}
                    gridSize={t.gridSize}
                    size={80}
                  />
                  <span className="font-mono text-[10px] uppercase text-ink-300 group-hover:text-mint">
                    {t.emoji} {t.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-600 pt-3">
              <button
                onClick={async () => {
                  await newBlank("空白作品", 16);
                  setShowNew(false);
                  navigate("/studio");
                }}
                className="btn-bead btn-bead-volt"
              >
                <FileText className="h-4 w-4" />
                空白 16×16
              </button>
              <button
                onClick={async () => {
                  await newBlank("空白作品", 32);
                  setShowNew(false);
                  navigate("/studio");
                }}
                className="btn-bead"
              >
                空白 32×32
              </button>
              <button
                onClick={async () => {
                  await newBlank("空白作品", 48);
                  setShowNew(false);
                  navigate("/studio");
                }}
                className="btn-bead"
              >
                空白 48×48
              </button>
            </div>
          </section>
        )}

        {/* 项目列表 */}
        <section>
          <h2 className="title-pixel mb-3 flex items-center gap-2">
            <FolderOpen className="h-3 w-3 text-aqua" />
            MY PROJECTS ({filtered.length})
          </h2>
          {filtered.length === 0 ? (
            <div className="panel flex flex-col items-center justify-center gap-3 p-12 text-center">
              <div className="font-pixel text-3xl text-ink-600">EMPTY</div>
              <p className="font-mono text-xs text-ink-400">
                还没有作品。点击右上角「新建」开始创作。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={openProject}
                  onDelete={async (id, name) => {
                    if (confirm(`删除「${name}」？`)) {
                      await removeProject(id);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* 模板说明 */}
        <section className="mt-8">
          <h2 className="title-pixel mb-3 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-volt" />
            HALF-MODULE TEMPLATES
          </h2>
          <p className="mb-3 font-mono text-[11px] text-ink-400">
            每个模板只定义左半面，右半面自动镜像生成。半面作为自主模块可独立编辑、拼合。
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {HALF_TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="panel flex flex-col items-center gap-2 p-3"
              >
                <BeadThumbnail
                  beads={getTemplateBeads(t.id)}
                  gridSize={t.gridSize}
                  size={70}
                />
                <span className="font-mono text-[10px] uppercase text-ink-300">
                  {t.emoji} {t.label}
                </span>
                <span className="chip chip-mint">L</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

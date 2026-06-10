import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Pen,
  Trash2,
  Copy,
  Download,
  Upload,
  RotateCcw,
  LayoutGrid,
  Table,
  Plus,
  Eye,
  ScrollText,
  Database,
} from "lucide-react";
import { useAppStore } from "@/store";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { cn, copyText, formatTime, timeAgo } from "@/utils/format";
import type { TemplateRecord } from "@/types";

type Tab = "mine" | "favorites" | "versions" | "data";

export function Workshop() {
  const templates = useAppStore((s) => s.templates);
  const favorites = useAppStore((s) => s.favorites);
  const remove = useAppStore((s) => s.removeTemplate);
  const toggleFav = useAppStore((s) => s.toggleFavorite);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const resetSeed = useAppStore((s) => s.resetSeed);

  const [tab, setTab] = useState<Tab>("mine");
  const [view, setView] = useState<"card" | "table">("table");

  const myTemplates = useMemo(
    () => templates.filter((t) => t.authorId === "me"),
    [templates]
  );
  const systemTemplates = useMemo(
    () => templates.filter((t) => t.authorId !== "me"),
    [templates]
  );
  const favoriteTemplates = useMemo(
    () =>
      favorites
        .map((f) => templates.find((t) => t.id === f.templateId))
        .filter((t): t is TemplateRecord => !!t),
    [favorites, templates]
  );

  const onExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumiere-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        await importData(text);
        alert("导入成功！");
      } catch (e) {
        alert("导入失败：" + (e as Error).message);
      }
    };
    input.click();
  };

  const onReset = async () => {
    if (!confirm("确定重置全部数据？这将清空你的模板、收藏、调用记录，并恢复为示例数据。")) return;
    await resetSeed();
  };

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-10">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <span className="scene-tag">SCENE 04 · WORKSHOP</span>
          <h1 className="mt-3 font-display text-[56px] leading-[1] text-paper-50">
            我的<span className="italic text-amber">工作台</span>
          </h1>
          <p className="mt-3 font-serif text-paper-200 max-w-xl">
            管理你的模板、收藏、版本与本地数据。萤幕的所有内容默认写入浏览器 IndexedDB。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/studio" className="reel-button">
            <Plus size={12} /> 新建模板
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-ink-700 mb-6 overflow-x-auto no-scrollbar">
        {[
          { k: "mine", l: "我的模板", n: myTemplates.length, icon: Pen },
          { k: "favorites", l: "收藏夹", n: favoriteTemplates.length, icon: Heart },
          { k: "data", l: "数据管理", n: 0, icon: Database },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as Tab)}
            className={cn(
              "px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
              tab === t.k
                ? "border-amber text-amber"
                : "border-transparent text-ink-300 hover:text-paper-100"
            )}
          >
            <t.icon size={12} />
            {t.l}
            {t.n > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[9px] border",
                  tab === t.k
                    ? "border-amber text-amber"
                    : "border-ink-600 text-ink-300"
                )}
              >
                {t.n}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "mine" && (
        <TemplateTable
          templates={myTemplates}
          systemCount={systemTemplates.length}
          view={view}
          setView={setView}
          onDelete={(id) => {
            if (confirm("确定删除？")) remove(id);
          }}
          onFav={(id) => toggleFav(id)}
          isFav={(id) => favorites.some((f) => f.templateId === id)}
        />
      )}

      {tab === "favorites" && (
        <TemplateTable
          templates={favoriteTemplates}
          systemCount={0}
          view={view}
          setView={setView}
          onDelete={(id) => toggleFav(id)}
          onFav={(id) => toggleFav(id)}
          isFav={() => true}
          isFavMode
        />
      )}

      {tab === "data" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-3">
              <Download size={14} className="text-amber" />
              <h3 className="font-display text-[20px] text-paper-50">导出</h3>
            </div>
            <p className="font-serif text-[14px] text-paper-200 leading-relaxed">
              将所有模板、收藏、版本、调用记录打包为 JSON 文件，便于备份或迁移。
            </p>
            <button onClick={onExport} className="reel-button mt-4">
              <Download size={11} /> 导出全部数据
            </button>
          </div>
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-3">
              <Upload size={14} className="text-amber" />
              <h3 className="font-display text-[20px] text-paper-50">导入</h3>
            </div>
            <p className="font-serif text-[14px] text-paper-200 leading-relaxed">
              从 JSON 文件恢复模板与配置。注意：导入会与现有数据合并，重复 ID 将被覆盖。
            </p>
            <button onClick={onImport} className="ghost-button mt-4">
              <Upload size={11} /> 选择 JSON 文件
            </button>
          </div>
          <div className="panel p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={14} className="text-reel" />
              <h3 className="font-display text-[20px] text-paper-50">重置示例数据</h3>
            </div>
            <p className="font-serif text-[14px] text-paper-200 leading-relaxed">
              清空你的模板、收藏、调用记录，并重新写入 8 套预置剧本模板。
            </p>
            <button
              onClick={onReset}
              className="ghost-button mt-4 !border-reel !text-reel hover:!bg-reel/10"
            >
              <RotateCcw size={11} /> 重置
            </button>
          </div>

          <div className="panel p-6 md:col-span-2">
            <h3 className="font-display text-[20px] text-paper-50 mb-4">数据统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "我的模板", v: myTemplates.length, c: "text-amber" },
                { l: "系统模板", v: systemTemplates.length, c: "text-paper-200" },
                { l: "收藏", v: favorites.length, c: "text-reel" },
                { l: "总调用", v: templates.reduce((s, t) => s + t.usageCount, 0), c: "text-paper-50" },
              ].map((s) => (
                <div key={s.l} className="border border-ink-600 p-4">
                  <div className="label-overline">{s.l}</div>
                  <div className={cn("font-display text-[36px] leading-none mt-2", s.c)}>
                    {s.v.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateTable({
  templates,
  systemCount,
  view,
  setView,
  onDelete,
  onFav,
  isFav,
  isFavMode,
}: {
  templates: TemplateRecord[];
  systemCount: number;
  view: "card" | "table";
  setView: (v: "card" | "table") => void;
  onDelete: (id: string) => void;
  onFav: (id: string) => void;
  isFav: (id: string) => boolean;
  isFavMode?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="label-overline">
          {templates.length} 条{isFavMode ? "收藏" : ""} · 另有 {systemCount} 套系统模板
        </span>
        <div className="flex border border-ink-600">
          <button
            onClick={() => setView("table")}
            className={cn(
              "p-1.5",
              view === "table" ? "bg-amber text-ink-900" : "text-ink-300"
            )}
          >
            <Table size={12} />
          </button>
          <button
            onClick={() => setView("card")}
            className={cn(
              "p-1.5",
              view === "card" ? "bg-amber text-ink-900" : "text-ink-300"
            )}
          >
            <LayoutGrid size={12} />
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="border border-dashed border-ink-600 py-16 text-center">
          <ScrollText size={28} className="text-ink-500 mx-auto mb-3" />
          <div className="font-display text-[20px] text-paper-200">
            {isFavMode ? "还没有收藏的剧本" : "还没有自己的模板"}
          </div>
          <Link to="/studio" className="reel-button mt-5 inline-flex">
            <Plus size={11} /> 创建第一个
          </Link>
        </div>
      ) : view === "table" ? (
        <div className="panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-ink-700 film-strip">
                <th className="px-4 py-3 label-overline text-paper-200">Title</th>
                <th className="px-4 py-3 label-overline text-paper-200">Genre</th>
                <th className="px-4 py-3 label-overline text-paper-200">Beat</th>
                <th className="px-4 py-3 label-overline text-paper-200">Updated</th>
                <th className="px-4 py-3 label-overline text-paper-200 text-right">Usage</th>
                <th className="px-4 py-3 label-overline text-paper-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-ink-700/60 hover:bg-ink-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link to={`/library/${t.id}`} className="block group">
                      <div className="font-display text-[16px] text-paper-50 group-hover:text-amber">
                        {t.title}
                      </div>
                      <div className="font-mono text-[10px] text-ink-300 mt-0.5 truncate max-w-md">
                        {t.logline}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-ink-200">
                    {GENRE_LABEL[tplGenre(t)]}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-ink-200">
                    {BEAT_MODEL_LABEL[t.beatModel]}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-ink-200">
                    {timeAgo(t.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] text-amber">
                    {t.usageCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/studio/${t.id}`}
                        className="ghost-button text-[10px] py-1 px-2"
                      >
                        <Pen size={10} />
                      </Link>
                      <button
                        onClick={() => onFav(t.id)}
                        className={cn(
                          "ghost-button text-[10px] py-1 px-2",
                          isFav(t.id) && "!border-reel !text-reel"
                        )}
                      >
                        <Heart
                          size={10}
                          fill={isFav(t.id) ? "#C8102E" : "none"}
                        />
                      </button>
                      {!isFavMode && (
                        <button
                          onClick={() => {
                            copyText(
                              JSON.stringify(
                                { id: t.id, title: t.title, slug: t.slug },
                                null,
                                2
                              )
                            );
                          }}
                          className="ghost-button text-[10px] py-1 px-2"
                        >
                          <Copy size={10} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(t.id)}
                        className="ghost-button text-[10px] py-1 px-2 hover:!border-reel hover:!text-reel"
                      >
                        {isFavMode ? <Heart size={10} /> : <Trash2 size={10} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((t, i) => (
            <div key={t.id} className="relative">
              <Link to={`/library/${t.id}`} className="block">
                <div className="clapper-card border border-ink-600 hover:border-amber transition-colors">
                  <div className="relative aspect-[4/3] p-5 pt-7">
                    <div className="scene-tag absolute top-4 right-4 z-10">
                      {BEAT_MODEL_LABEL[t.beatModel]}
                    </div>
                    <h3 className="font-display text-[20px] text-paper-50 leading-tight mt-6">
                      {t.title}
                    </h3>
                    <p className="mt-2 font-serif italic text-[12px] text-paper-200 line-clamp-3">
                      "{t.logline}"
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function tplGenre(t: TemplateRecord) {
  return t.genre;
}

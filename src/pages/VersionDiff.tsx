// 版本对比页
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  GitCompare,
  RotateCcw,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store";
import { diffLines, diffStats } from "@/utils/diff";
import { formatTime } from "@/utils/format";
import { toast } from "@/store/toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import type { VersionRecord, TemplateRecord } from "@/types";

export function VersionDiff() {
  const { id } = useParams();
  const nav = useNavigate();
  const tpl = useAppStore((s) => s.templates.find((t) => t.id === id));
  const listVersions = useAppStore((s) => s.listVersions);
  const rollback = useAppStore((s) => s.rollbackToVersion);

  const [versions, setVersions] = useState<VersionRecord[] | null>(null);
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    listVersions(id).then((vs) => {
      setVersions(vs);
      if (vs.length >= 2) {
        setRight(vs[0].id);
        setLeft(vs[1].id);
      } else if (vs.length === 1) {
        setRight(vs[0].id);
      }
    });
  }, [id, listVersions]);

  if (!tpl) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-[32px] text-paper-50">模板不存在</h1>
        <Link to="/library" className="reel-button mt-6 inline-flex">
          <ArrowLeft size={11} /> 返回
        </Link>
      </div>
    );
  }

  const leftV = versions?.find((v) => v.id === left);
  const rightV = versions?.find((v) => v.id === right);

  const leftSnap: TemplateRecord | null = leftV
    ? ({ ...(leftV.snapshot as any), id: tpl.id } as TemplateRecord)
    : tpl;
  const rightSnap: TemplateRecord | null = rightV
    ? ({ ...(rightV.snapshot as any), id: tpl.id } as TemplateRecord)
    : null;

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => nav(-1)} className="ghost-button text-[10px] py-1.5 px-3">
          <ArrowLeft size={11} /> 返回
        </button>
        <span className="scene-tag">SCENE 07 · VERSION DIFF</span>
        <span className="ml-auto label-overline">{tpl.title}</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-[44px] leading-[1] text-paper-50">
          版本<span className="italic text-amber">对比</span>
        </h1>
        <p className="mt-3 font-serif text-paper-200">
          按行对比任意两个版本，一键回滚到历史快照。系统会在每次手动保存时自动创建快照。
        </p>
      </div>

      {versions === null ? (
        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-64" />
        </div>
      ) : versions.length === 0 ? (
        <div className="border border-dashed border-ink-600 py-20 text-center">
          <GitCompare size={32} className="text-ink-500 mx-auto mb-3" />
          <h3 className="font-display text-[24px] text-paper-50">还没有历史版本</h3>
          <p className="mt-2 font-serif italic text-ink-300">
            在 Studio 中点击「保存为版本」即可创建第一个快照。
          </p>
          <Link to={`/studio/${tpl.id}`} className="reel-button mt-6 inline-flex">
            前往 Studio
          </Link>
        </div>
      ) : (
        <>
          {/* 选择条 */}
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <VersionSelect
              label="左侧 · 旧版本"
              versions={versions}
              value={left}
              onChange={setLeft}
            />
            <VersionSelect
              label="右侧 · 新版本 / 当前"
              versions={versions}
              value={right}
              onChange={setRight}
              allowCurrent
              tpl={tpl}
            />
          </div>

          {/* 操作栏 */}
          <div className="flex items-center gap-2 mb-4">
            {leftV && (
              <button
                onClick={async () => {
                  const r = await confirmDialog({
                    title: `回滚到 v${leftV.versionNo}？`,
                    description: `当前内容会被覆盖，生成新版本 v${tpl.version + 1}。`,
                    danger: true,
                    confirmText: "确认回滚",
                  });
                  if (r.ok) {
                    await rollback(leftV.id);
                    toast.success("已回滚", `当前内容已恢复为 v${leftV.versionNo}`);
                    nav(`/studio/${tpl.id}`);
                  }
                }}
                className="ghost-button text-[10px] py-1.5 px-3 hover:!border-amber"
              >
                <RotateCcw size={11} /> 回滚到此版本
              </button>
            )}
            <Link to={`/studio/${tpl.id}`} className="ghost-button text-[10px] py-1.5 px-3 ml-auto">
              <ArrowRight size={11} /> 进入 Studio
            </Link>
          </div>

          {/* 三个对比：字段、提示词、系统提示词 */}
          {leftSnap && rightSnap && (
            <div className="space-y-6">
              <DiffBlock
                title="📋 字段定义"
                a={JSON.stringify(leftSnap.fields, null, 2)}
                b={JSON.stringify(rightSnap.fields, null, 2)}
              />
              <DiffBlock
                title="✍️ 提示词模板"
                a={leftSnap.promptTpl}
                b={rightSnap.promptTpl}
              />
              <DiffBlock
                title="⚙️ 系统提示词"
                a={leftSnap.systemPrompt}
                b={rightSnap.systemPrompt}
              />
              <DiffBlock
                title="🏷️ 元信息"
                a={JSON.stringify(
                  {
                    title: leftSnap.title,
                    logline: leftSnap.logline,
                    genre: leftSnap.genre,
                    beatModel: leftSnap.beatModel,
                    tone: leftSnap.tone,
                    tags: leftSnap.tags,
                    description: leftSnap.description,
                  },
                  null,
                  2
                )}
                b={JSON.stringify(
                  {
                    title: rightSnap.title,
                    logline: rightSnap.logline,
                    genre: rightSnap.genre,
                    beatModel: rightSnap.beatModel,
                    tone: rightSnap.tone,
                    tags: rightSnap.tags,
                    description: rightSnap.description,
                  },
                  null,
                  2
                )}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VersionSelect({
  label,
  versions,
  value,
  onChange,
  allowCurrent,
  tpl,
}: {
  label: string;
  versions: VersionRecord[];
  value: string | null;
  onChange: (v: string) => void;
  allowCurrent?: boolean;
  tpl?: TemplateRecord;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="label-overline mb-1">{label}</div>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full panel flex items-center justify-between px-4 py-2.5 hover:border-amber"
      >
        <span className="font-mono text-[13px] text-paper-100">
          {value === "__current" && tpl
            ? `当前 · v${tpl.version}`
            : value
            ? versions.find((v) => v.id === value)
              ? `v${versions.find((v) => v.id === value)!.versionNo} · ${formatTime(versions.find((v) => v.id === value)!.createdAt)} · ${versions.find((v) => v.id === value)!.changelog}`
              : "选择版本"
            : "选择版本"}
        </span>
        <ChevronDown size={13} className="text-ink-300" />
      </button>
      {open && (
        <div className="absolute z-20 top-full mt-1 left-0 right-0 panel bg-ink-800 max-h-72 overflow-auto">
          {allowCurrent && tpl && (
            <button
              onClick={() => {
                onChange("__current");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-ink-700 font-mono text-[12px] border-b border-ink-700"
            >
              <span className="text-amber">当前</span>
              <span>v{tpl.version}</span>
              {value === "__current" && <Check size={12} className="ml-auto text-amber" />}
            </button>
          )}
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onChange(v.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-ink-700 font-mono text-[12px] border-b border-ink-700 last:border-0"
            >
              <span className="text-amber">v{v.versionNo}</span>
              <span className="text-ink-300 text-[10px]">{formatTime(v.createdAt)}</span>
              <span className="text-paper-200 text-[11px] truncate flex-1">
                {v.changelog}
              </span>
              {value === v.id && <Check size={12} className="text-amber" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DiffBlock({ title, a, b }: { title: string; a: string; b: string }) {
  const diff = useMemo(() => diffLines(a, b), [a, b]);
  const stats = useMemo(() => diffStats(diff), [diff]);
  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-4 py-2.5">
        <span className="label-overline">{title}</span>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-amber">+{stats.added}</span>
          <span className="text-reel">-{stats.removed}</span>
          <span className="text-ink-300">={stats.same}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-ink-700">
        <div className="p-3 max-h-96 overflow-auto font-mono text-[11.5px] leading-[1.7] whitespace-pre-wrap">
          {diff
            .filter((d) => d.type !== "add")
            .map((d, i) => (
              <div
                key={i}
                className={
                  d.type === "del"
                    ? "bg-reel/10 text-reel px-2 -mx-2"
                    : "text-paper-200"
                }
              >
                <span className="select-none inline-block w-6 text-ink-400">
                  {d.type === "del" ? "-" : " "}
                </span>
                {d.text || "\u00A0"}
              </div>
            ))}
        </div>
        <div className="p-3 max-h-96 overflow-auto font-mono text-[11.5px] leading-[1.7] whitespace-pre-wrap">
          {diff
            .filter((d) => d.type !== "del")
            .map((d, i) => (
              <div
                key={i}
                className={
                  d.type === "add"
                    ? "bg-amber/10 text-amber px-2 -mx-2"
                    : "text-paper-200"
                }
              >
                <span className="select-none inline-block w-6 text-ink-400">
                  {d.type === "add" ? "+" : " "}
                </span>
                {d.text || "\u00A0"}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

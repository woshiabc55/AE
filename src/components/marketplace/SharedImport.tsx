// 共享链接导入页 - 处理 #share= 哈希
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link2, Download, ArrowRight, X, Eye } from "lucide-react";
import { decodeTemplate, encodeTemplate } from "@/utils/share";
import { useAppStore } from "@/store";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/store/toast";
import { nanoid } from "nanoid";
import type { TemplateRecord, ScriptFieldDef } from "@/types";
import { validate, SharePayloadSchema } from "@/utils/validate";

export function SharedImport() {
  const loc = useLocation();
  const nav = useNavigate();
  const upsert = useAppStore((s) => s.upsertTemplate);
  const [encoded, setEncoded] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hash = loc.hash;
    if (hash.startsWith("#share=")) {
      const e = hash.slice("#share=".length);
      setEncoded(e);
      setOpen(true);
    }
  }, [loc.hash]);

  const decoded = encoded ? decodeTemplate(encoded) : null;

  // 严格校验
  const validation = useMemo(() => {
    if (!decoded) return null;
    return validate(SharePayloadSchema, decoded);
  }, [decoded]);

  const onImport = async () => {
    if (!decoded) {
      toast.error("无法解析模板");
      return;
    }
    if (validation?.ok === false) {
      toast.error("模板格式非法", validation.errors[0]);
      return;
    }
    if (!validation) {
      toast.error("无法解析模板");
      return;
    }
    const data = validation.data;
    const id = "tpl_" + nanoid(8);
    const tpl: TemplateRecord = {
      id,
      title: data.title,
      slug: (data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
        "imported") + "-" + nanoid(4),
      logline: "",
      genre: data.genre,
      beatModel: data.beatModel,
      tone: data.tone,
      cover: "from-amber/40 via-ink-700 to-reel/30",
      authorId: "me",
      authorName: "You",
      isPublic: 0,
      usageCount: 0,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fields: data.fields as ScriptFieldDef[],
      promptTpl: data.promptTpl,
      systemPrompt: data.systemPrompt,
      tags: data.tags,
      description: data.description,
    };
    await upsert(tpl);
    toast.success("已导入", `「${tpl.title}」已添加到你的工作台`);
    setOpen(false);
    // 清除 hash
    history.replaceState(null, "", location.pathname);
    nav(`/studio/${id}`);
  };

  const onClose = () => {
    setOpen(false);
    history.replaceState(null, "", location.pathname);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="导入共享模板"
      subtitle="有人分享了一个剧本模板，确认导入到你的工作台吗？"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 取消
          </button>
          {decoded && (
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(decoded, null, 2)
              )}`}
              download="imported-template.json"
              className="ghost-button text-[10px] py-1.5 px-3"
            >
              <Download size={11} /> 下载 JSON
            </a>
          )}
          <button
            onClick={onImport}
            className="reel-button text-[10px] py-1.5 px-3"
            disabled={!decoded || (validation && validation.ok === false)}
            title={validation && validation.ok === false ? validation.errors[0] : undefined}
          >
            <Link2 size={11} /> 导入到工作台
          </button>
        </>
      }
    >
      <div className="p-5">
        {!decoded ? (
          <div className="border border-reel/40 bg-reel/10 text-reel px-4 py-3 text-[13px]">
            链接已损坏，无法解析模板。
          </div>
        ) : validation && validation.ok === false ? (
          <div className="border border-reel/40 bg-reel/10 text-reel px-4 py-3 text-[13px]">
            <div className="font-display text-[15px] mb-2">校验失败</div>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
              {validation.errors.slice(0, 6).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="panel p-4">
              <div className="scene-tag">PREVIEW</div>
              <h3 className="font-display text-[24px] text-paper-50 mt-2">
                {decoded.title}
              </h3>
              <p className="mt-2 font-serif text-[14px] text-paper-200 leading-relaxed">
                {decoded.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {decoded.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest2 text-ink-200 border border-ink-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 label-overline">
                字段：{decoded.fields?.length ?? 0} 个 · 体裁：{decoded.genre} · 节拍：{decoded.beatModel}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// 模板分享模态
import { useState } from "react";
import { Copy, Check, Link2, Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { encodeTemplate } from "@/utils/share";
import { copyText } from "@/utils/format";
import { toast } from "@/store/toast";
import type { TemplateRecord } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  tpl: TemplateRecord;
}

export function ShareModal({ open, onClose, tpl }: Props) {
  const encoded = encodeTemplate(tpl);
  const url = `${location.origin}${location.pathname}#share=${encoded}`;
  const [copied, setCopied] = useState<string | null>(null);

  const onCopyUrl = async () => {
    await copyText(url);
    setCopied("url");
    toast.success("已复制分享链接", "粘贴给他人即可导入");
    setTimeout(() => setCopied(null), 1500);
  };
  const onCopyCode = async () => {
    await copyText(encoded);
    setCopied("code");
    toast.success("已复制模板代码");
    setTimeout(() => setCopied(null), 1500);
  };
  const onDownload = () => {
    const blob = new Blob([JSON.stringify(tpl, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tpl.slug || tpl.id}.lumiere.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="分享模板"
      subtitle="通过链接、代码或 JSON 文件把模板传给别人，对方在 Studio 即可一键导入"
      size="md"
    >
      <div className="p-5 space-y-4">
        <div>
          <div className="label-overline mb-2">分享链接</div>
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="field-input font-mono text-[12px] flex-1 truncate"
            />
            <button onClick={onCopyUrl} className="reel-button text-[10px] py-2 px-3">
              {copied === "url" ? <Check size={11} /> : <Link2 size={11} />}
              {copied === "url" ? "已复制" : "复制"}
            </button>
          </div>
          <p className="mt-2 text-[11px] font-serif italic text-ink-300">
            链接承载在 URL hash 中，不会上传任何后端。接收方只需打开链接并点击「导入」即可。
          </p>
        </div>

        <div>
          <div className="label-overline mb-2">代码片段</div>
          <div className="flex gap-2">
            <textarea
              readOnly
              value={encoded}
              onFocus={(e) => e.currentTarget.select()}
              rows={3}
              className="field-input font-mono text-[10.5px] flex-1 resize-none"
            />
          </div>
          <button
            onClick={onCopyCode}
            className="ghost-button text-[10px] py-1.5 px-3 mt-2"
          >
            {copied === "code" ? <Check size={11} /> : <Copy size={11} />}
            {copied === "code" ? "已复制" : "复制代码"}
          </button>
        </div>

        <div className="border-t border-ink-700 pt-4">
          <div className="label-overline mb-2">下载 JSON</div>
          <button onClick={onDownload} className="ghost-button text-[10px] py-2 px-3">
            <Download size={11} /> 下载 {tpl.slug || tpl.id}.lumiere.json
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 模板评论组件
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { MessageSquare, Trash2, Send } from "lucide-react";
import { db } from "@/db";
import { useAppStore } from "@/store";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { timeAgo } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/store/toast";
import { validate, CommentDraftSchema } from "@/utils/validate";

export function CommentSection({ templateId }: { templateId: string }) {
  const removeComment = useAppStore((s) => s.removeComment);
  const comments = useLiveQuery(
    () =>
      db.comments
        .where("templateId")
        .equals(templateId)
        .reverse()
        .sortBy("createdAt"),
    [templateId]
  );
  const [val, setVal] = useState("");
  const [posting, setPosting] = useState(false);
  const addComment = useAppStore((s) => s.addComment);

  const onPost = async () => {
    const r = validate(CommentDraftSchema, {
      templateId,
      body: val.trim(),
    });
    if (r.ok === false) {
      toast.warn("评论无效", r.errors[0]);
      return;
    }
    setPosting(true);
    await addComment(templateId, r.data.body);
    setVal("");
    setPosting(false);
    toast.success("已发布评论");
  };

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-4 py-2.5">
        <span className="label-overline flex items-center gap-2">
          <MessageSquare size={11} />
          评论 · {comments?.length ?? 0}
        </span>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="留下你的笔记、灵感、或者吐槽…"
            rows={2}
            className="field-input font-serif text-[13px] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                onPost();
              }
            }}
          />
          <button
            disabled={!val.trim() || posting}
            onClick={onPost}
            className="reel-button text-[10px] py-2 px-3 self-end"
          >
            <Send size={11} /> 发送
          </button>
        </div>
        <p className="mt-1.5 text-[10.5px] font-mono text-ink-400">
          ⌘ + Enter 快速发送
        </p>
      </div>
      <div className="border-t border-ink-700 divide-y divide-ink-700 max-h-80 overflow-auto">
        {comments === undefined ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : comments.length === 0 ? (
          <div className="px-4 py-8 text-center text-ink-300 font-serif italic text-[13px]">
            还没有评论 · 留下第一条吧
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="px-4 py-3 group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-amber flex items-center justify-center font-mono text-[10px] text-amber">
                    {c.author[0]?.toUpperCase()}
                  </div>
                  <span className="font-mono text-[11px] text-paper-200">
                    {c.author}
                  </span>
                  <span className="font-mono text-[10px] text-ink-400">
                    {timeAgo(c.createdAt)}
                  </span>
                  {c.fieldKey && (
                    <span className="font-mono text-[10px] text-amber border border-amber/40 px-1">
                      @ {c.fieldKey}
                    </span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    const r = await confirmDialog({
                      title: "删除这条评论？",
                      danger: true,
                      confirmText: "删除",
                    });
                    if (r.ok) removeComment(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-ink-300 hover:text-reel transition-all"
                  aria-label="删除"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <div className="font-serif text-[13.5px] text-paper-100 leading-relaxed pl-8">
                {c.body}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

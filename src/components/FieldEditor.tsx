// 字段编辑器
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/format";
import type { ScriptFieldDef } from "@/types";

interface Props {
  field: ScriptFieldDef;
  value: string;
  onChange: (v: string) => void;
}

function isListJSON(v: string) {
  try {
    const p = JSON.parse(v);
    return Array.isArray(p);
  } catch {
    return false;
  }
}

export function FieldEditor({ field, value, onChange }: Props) {
  return (
    <div data-field-key={field.key}>
      {field.type === "text" && (
        <div>
          <label className="label-overline flex items-center gap-2">
            <span className="text-amber">▶</span>
            {field.label}
            {field.required && <span className="text-reel">*</span>}
          </label>
          <input
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="field-input mt-1 text-[15px]"
          />
          {field.helper && (
            <p className="mt-1 text-[11px] text-ink-300 italic font-serif">
              {field.helper}
            </p>
          )}
        </div>
      )}

      {field.type === "longtext" && (
        <div>
          <label className="label-overline flex items-center gap-2">
            <span className="text-amber">▶</span>
            {field.label}
            {field.required && <span className="text-reel">*</span>}
          </label>
          <textarea
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="field-input mt-1 font-serif text-[14px] leading-relaxed resize-none"
          />
          {field.helper && (
            <p className="mt-1 text-[11px] text-ink-300 italic font-serif">
              {field.helper}
            </p>
          )}
          <div className="mt-1 text-right label-overline text-ink-400">
            {value.length} 字
          </div>
        </div>
      )}

      {field.type === "list" && (() => {
        let items: string[] = [];
        if (isListJSON(value)) items = JSON.parse(value);
        else if (value) items = value.split("\n").filter(Boolean);
        const update = (next: string[]) => onChange(JSON.stringify(next));
        return (
          <div>
            <label className="label-overline flex items-center gap-2">
              <span className="text-amber">▶</span>
              {field.label}
              {field.required && <span className="text-reel">*</span>}
            </label>
            <div className="mt-2 space-y-2">
              {items.map((it, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-3 font-mono text-[10px] text-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={it}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = e.target.value;
                      update(next);
                    }}
                    placeholder={field.placeholder}
                    className="field-input flex-1 text-[14px]"
                  />
                  <button
                    type="button"
                    onClick={() => update(items.filter((_, idx) => idx !== i))}
                    className="mt-2 text-ink-400 hover:text-reel transition-colors"
                    aria-label="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update([...items, ""])}
                className="ghost-button text-[10px] py-1.5 mt-1"
              >
                <Plus size={12} /> 添加节拍
              </button>
            </div>
            {field.helper && (
              <p className="mt-2 text-[11px] text-ink-300 italic font-serif">
                {field.helper}
              </p>
            )}
          </div>
        );
      })()}

      {field.type === "struct" && (
        <div>
          <label className="label-overline flex items-center gap-2">
            <span className="text-amber">▶</span>
            {field.label}
            {field.required && <span className="text-reel">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            placeholder={
              field.placeholder ??
              "姓名：\n年龄：\n外在：\n内在：\n欲望：\n伤口：\n弧光："
            }
            className="field-input mt-1 font-mono text-[12.5px] leading-relaxed resize-none"
          />
          {field.helper && (
            <p className="mt-1 text-[11px] text-ink-300 italic font-serif">
              {field.helper}
            </p>
          )}
        </div>
      )}

      {field.type === "code" && (
        <div>
          <label className="label-overline flex items-center gap-2">
            <span className="text-amber">▶</span>
            {field.label}
            {field.required && <span className="text-reel">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className={cn(
              "field-input mt-1 font-mono text-[12.5px] leading-relaxed resize-none",
              "bg-ink-900/50 border border-ink-600 px-3 py-2"
            )}
          />
        </div>
      )}
    </div>
  );
}

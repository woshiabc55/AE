// 确认对话框
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/format";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  input?: {
    label: string;
    placeholder?: string;
    type?: "text" | "number";
    validate?: (v: string) => string | null;
  };
}

let resolver: ((v: { ok: boolean; value?: string }) => void) | null = null;
let setter: ((opts: ConfirmOptions | null) => void) | null = null;

export function confirmDialog(opts: ConfirmOptions): Promise<{ ok: boolean; value?: string }> {
  setter?.(opts);
  return new Promise((res) => {
    resolver = res;
  });
}

export function ConfirmHost() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [val, setVal] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const okRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setter = setOpts;
    return () => {
      setter = null;
    };
  }, []);

  useEffect(() => {
    if (opts) {
      setVal("");
      setErr(null);
      setTimeout(() => {
        if (opts.input) inputRef.current?.focus();
        else okRef.current?.focus();
      }, 30);
    }
  }, [opts]);

  if (!opts) return null;
  const close = (ok: boolean, value?: string) => {
    resolver?.({ ok, value });
    resolver = null;
    setOpts(null);
  };
  const onSubmit = () => {
    if (opts.input) {
      const e = opts.input.validate?.(val);
      if (e) {
        setErr(e);
        return;
      }
      close(true, val);
    } else {
      close(true);
    }
  };
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink-950/85 backdrop-blur"
        onClick={() => close(false)}
      />
      <div className="relative panel max-w-md w-full p-6 border-amber/40">
        <button
          onClick={() => close(false)}
          className="absolute top-3 right-3 text-ink-300 hover:text-paper-100 p-1"
          aria-label="关闭"
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "shrink-0 w-9 h-9 flex items-center justify-center border",
              opts.danger ? "border-reel text-reel" : "border-amber text-amber"
            )}
          >
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[20px] text-paper-50">{opts.title}</h3>
            {opts.description && (
              <p className="mt-2 font-serif text-[14px] text-paper-200 leading-relaxed">
                {opts.description}
              </p>
            )}
            {opts.input && (
              <div className="mt-3">
                <label className="label-overline">{opts.input.label}</label>
                <input
                  ref={inputRef}
                  type={opts.input.type ?? "text"}
                  value={val}
                  onChange={(e) => {
                    setVal(e.target.value);
                    setErr(null);
                  }}
                  placeholder={opts.input.placeholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                    else if (e.key === "Escape") close(false);
                  }}
                  className="field-input font-mono text-[13px] mt-1"
                />
                {err && <p className="mt-1 text-[11px] text-reel">{err}</p>}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={() => close(false)} className="ghost-button text-[10px] py-1.5 px-3">
            {opts.cancelText ?? "取消"}
          </button>
          <button
            ref={okRef}
            onClick={onSubmit}
            className={cn(
              "text-[10px] py-1.5 px-3",
              opts.danger ? "reel-button-red" : "reel-button"
            )}
          >
            {opts.confirmText ?? "确认"}
          </button>
        </div>
      </div>
    </div>
  );
}

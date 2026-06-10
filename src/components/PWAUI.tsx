// 萤幕 Lumière — PWA UI
// 1) 安装横幅：触发 beforeinstallprompt
// 2) 更新提示：新 SW 就绪时提示刷新
// 3) 离线就绪：首次 SW 缓存完成时一次性 toast
// 4) 离线状态：网络断开时顶部细条
import { useEffect, useState } from "react";
import { Download, RefreshCw, X, WifiOff, Check } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { toast } from "@/store/toast";

export function PWAUI() {
  const { needRefresh, offlineReady, installPrompt, update, promptInstall, dismissInstall, isOnline } =
    usePWA();
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (installPrompt && !dismissed) {
      setShowInstall(true);
    } else {
      setShowInstall(false);
    }
  }, [installPrompt, dismissed]);

  useEffect(() => {
    if (offlineReady) {
      toast.success("已可离线使用", "主壳已缓存到本机，刷新一次即可完整离线。");
    }
  }, [offlineReady]);

  return (
    <>
      {/* 网络状态条 */}
      {!isOnline && (
        <div
          className="fixed top-0 inset-x-0 z-[90] bg-amber text-ink-950 px-4 py-1.5 text-center text-[12px] font-mono font-bold tracking-widest2 flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <WifiOff size={13} />
          离线模式 · 写入会保存到本地，联网后再同步
        </div>
      )}

      {/* 安装横幅 */}
      {showInstall && installPrompt && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[88] panel bg-ink-800 border border-amber/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] px-4 py-3 flex items-center gap-3 max-w-lg"
          role="dialog"
          aria-label="安装到桌面"
        >
          <div className="w-10 h-10 shrink-0 grid place-items-center bg-amber text-ink-950 font-display font-bold text-[18px]">
            L
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-[15px] text-paper-50 leading-tight">
              把萤幕装到桌面
            </div>
            <div className="text-[11px] font-mono text-ink-300 mt-0.5">
              离线可用 · 像原生 App 一样启动
            </div>
          </div>
          <button
            onClick={async () => {
              await promptInstall();
              setShowInstall(false);
            }}
            className="reel-button text-[10px] py-1.5 px-3"
            aria-label="安装应用"
          >
            <Download size={11} /> 安装
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              setShowInstall(false);
              dismissInstall();
            }}
            className="text-ink-300 hover:text-paper-100 p-1"
            aria-label="关闭安装提示"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 更新提示 */}
      {needRefresh && (
        <div
          className="fixed bottom-6 right-6 z-[88] panel bg-ink-800 border border-ink-600 px-4 py-3 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div className="text-[12px] font-mono text-paper-200">
            新版本已就绪
          </div>
          <button onClick={() => update()} className="reel-button text-[10px] py-1.5 px-3">
            <RefreshCw size={11} /> 刷新应用
          </button>
        </div>
      )}
    </>
  );
}

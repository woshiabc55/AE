// 萤幕 Lumière — PWA 注册、更新检测、安装提示捕获
// 用法：const { needRefresh, offlineReady, installPrompt, promptInstall, dismissInstall } = usePWA();
import { useEffect, useState, useCallback } from "react";

interface PWABiState {
  needRefresh: boolean;
  offlineReady: boolean;
  installPrompt: any | null;
  update: () => Promise<void>;
  promptInstall: () => Promise<void>;
  dismissInstall: () => void;
  isOnline: boolean;
}

export function usePWA(): PWABiState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any | null>(null);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // 注册 SW
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) {
      // 开发环境不注册，避免 HMR 被 SW 干扰
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // 立即检查更新
          reg.update();
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setNeedRefresh(true);
          }
          reg.addEventListener("updatefound", () => {
            const nw = reg.installing;
            if (!nw) return;
            nw.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(nw);
                setNeedRefresh(true);
              } else if (nw.state === "installed" && !navigator.serviceWorker.controller) {
                setOfflineReady(true);
              }
            });
          });
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("[PWA] SW 注册失败：", err);
        });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // 监听更新应用事件
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const onChange = () => {
      // controller 变化时刷新页面以应用新版本
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onChange);
  }, []);

  // 监听网络状态
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // 捕获安装提示事件
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    const onInstalled = () => {
      setInstallPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const update = useCallback(async () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage("SKIP_WAITING");
    setNeedRefresh(false);
  }, [waitingWorker]);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const dismissInstall = useCallback(() => {
    setInstallPrompt(null);
  }, []);

  return {
    needRefresh,
    offlineReady,
    installPrompt,
    update,
    promptInstall,
    dismissInstall,
    isOnline,
  };
}

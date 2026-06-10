import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastHost } from "@/components/ui/Toast";
import { ConfirmHost } from "@/components/ui/ConfirmDialog";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useAppStore } from "@/store";

// 路由级代码分割：首屏只加载 Home，其他页面按需加载
const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const Library = lazy(() => import("@/pages/Library").then((m) => ({ default: m.Library })));
const ScriptView = lazy(() => import("@/pages/ScriptView").then((m) => ({ default: m.ScriptView })));
const Studio = lazy(() => import("@/pages/Studio").then((m) => ({ default: m.Studio })));
const Workshop = lazy(() => import("@/pages/Workshop").then((m) => ({ default: m.Workshop })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));
const Marketplace = lazy(() => import("@/pages/Marketplace").then((m) => ({ default: m.Marketplace })));
const VersionDiff = lazy(() => import("@/pages/VersionDiff").then((m) => ({ default: m.VersionDiff })));
const Skills = lazy(() => import("@/pages/Skills").then((m) => ({ default: m.Skills })));
const StyleStudio = lazy(() => import("@/pages/StyleStudio").then((m) => ({ default: m.StyleStudio })));
const StructureCanvas = lazy(() =>
  import("@/pages/StructureCanvas").then((m) => ({ default: m.StructureCanvas }))
);

// 浮层组件：仅在需要时加载
const CommandPalette = lazy(() =>
  import("@/components/CommandPalette").then((m) => ({ default: m.CommandPalette }))
);
const SharedImport = lazy(() =>
  import("@/components/marketplace/SharedImport").then((m) => ({ default: m.SharedImport }))
);
const ShortcutHelp = lazy(() =>
  import("@/components/ui/ShortcutHelp").then((m) => ({ default: m.ShortcutHelp }))
);

function ScrollToTop() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="space-y-4 p-2" role="status" aria-label="页面加载中">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid md:grid-cols-3 gap-3 mt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <span className="sr-only">页面加载中…</span>
    </div>
  );
}

function OverlayFallback() {
  return null;
}

export default function App() {
  const loadAll = useAppStore((s) => s.loadAll);
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <NetworkStatus />
        <AppLayout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:id" element={<ScriptView />} />
              <Route path="/library/:id/versions" element={<VersionDiff />} />
              <Route path="/library/:id/canvas" element={<StructureCanvas />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/style" element={<StyleStudio />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/studio/:id" element={<Studio />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route
                path="*"
                element={
                  <div className="mx-auto max-w-2xl px-6 py-24 text-center">
                    <h1 className="font-display text-[64px] text-paper-50">404</h1>
                    <p className="font-serif italic text-ink-300 mt-3">
                      这场戏，不在剧本里。
                    </p>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </AppLayout>
        <Suspense fallback={<OverlayFallback />}>
          <CommandPalette />
          <SharedImport />
          <ToastHost />
          <ConfirmHost />
          <ShortcutHelp />
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Home } from "@/pages/Home";
import { Library } from "@/pages/Library";
import { ScriptView } from "@/pages/ScriptView";
import { Studio } from "@/pages/Studio";
import { Workshop } from "@/pages/Workshop";
import { Settings } from "@/pages/Settings";
import { About } from "@/pages/About";
import { Marketplace } from "@/pages/Marketplace";
import { VersionDiff } from "@/pages/VersionDiff";
import { Skills } from "@/pages/Skills";
import { StyleStudio } from "@/pages/StyleStudio";
import { StructureCanvas } from "@/pages/StructureCanvas";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastHost } from "@/components/ui/Toast";
import { ConfirmHost } from "@/components/ui/ConfirmDialog";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";
import { SharedImport } from "@/components/marketplace/SharedImport";
import { useAppStore } from "@/store";

function ScrollToTop() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
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
        </AppLayout>
        <CommandPalette />
        <SharedImport />
        <ToastHost />
        <ConfirmHost />
        <ShortcutHelp />
      </ErrorBoundary>
    </Router>
  );
}

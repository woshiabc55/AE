import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Home } from "@/pages/Home";
import { Library } from "@/pages/Library";
import { ScriptView } from "@/pages/ScriptView";
import { Studio } from "@/pages/Studio";
import { Workshop } from "@/pages/Workshop";
import { Settings } from "@/pages/Settings";
import { About } from "@/pages/About";
import { CommandPalette } from "@/components/CommandPalette";
import { useAppStore } from "@/store";

export default function App() {
  const loadAll = useAppStore((s) => s.loadAll);
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<ScriptView />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/:id" element={<Studio />} />
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
    </Router>
  );
}

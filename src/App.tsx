import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import Studio from "@/pages/Studio";
import Library from "@/pages/Library";
import Export from "@/pages/Export";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen flex-col bg-ink-800">
        <TopNav />
        <main className="relative flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/studio" replace />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/library" element={<Library />} />
            <Route path="/export" element={<Export />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <div className="scan-line" />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="border-t border-white/5 py-6 mt-12">
          <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 font-mono">
            <div>
              <span className="text-neon-cyan">NEON.FRAME</span> // GAME_IP_DERIVATIVES_ARCHIVE
            </div>
            <div className="flex items-center gap-4">
              <span>© 2026</span>
              <span className="text-neon-pink">v2.0.0</span>
              <span>BUILD 20260608</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Toaster } from './components/Toaster';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { Compare } from './pages/Compare';
import { useThemeSync } from './hooks/useThemeSync';

export default function App() {
  useThemeSync();

  return (
    <div className="relative min-h-screen bg-ink text-ink-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="border-t border-ink-200/20 py-8 text-center font-mono text-xs text-ink-300">
        <span className="font-serif italic">图海 IconGalaxy</span>
        <span className="mx-2 text-ink-300/40">·</span>
        Curated gallery of 7 open icon libraries
        <span className="mx-2 text-ink-300/40">·</span>
        <span className="text-vermillion">© 2026</span>
      </footer>

      <Toaster />
    </div>
  );
}

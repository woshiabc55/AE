import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import About from './pages/About';
import Nav from './components/Nav';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:slug" element={<ToolDetail />} />
          <Route path="/category/:name" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <footer className="border-t-2 border-bone/20 mt-12 py-8 px-6 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 SKILL FORGE — A LIVING ARCHIVE OF HTML CRAFTS</span>
        <span className="text-bone/60">BUILT WITH VITE + REACT + TAILWIND</span>
      </footer>
    </div>
  );
}

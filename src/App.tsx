import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import About from './pages/About';
import Distribution from './pages/Distribution';
import Standards from './pages/Standards';
import Exhibition from './pages/Exhibition';
import DesignSystem from './pages/DesignSystem';
import FontGarden from './pages/FontGarden';
import Schemes from './pages/Schemes';
import GameSchemes from './pages/GameSchemes';
import Arknights from './pages/Arknights';
import Nav from './components/Nav';
import PageNav from './components/PageNav';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-1 animate-fade-in pb-20">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:slug" element={<ToolDetail />} />
        <Route path="/category/:name" element={<Home />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/exhibition" element={<Exhibition />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/font-garden" element={<FontGarden />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/game-schemes" element={<GameSchemes />} />
        <Route path="/arknights" element={<Arknights />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <AnimatedRoutes />
      <PageNav />
      <footer className="border-t-2 border-bone/20 mt-12 py-8 px-6 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 SKILL FORGE — A LIVING ARCHIVE OF HTML CRAFTS</span>
        <span className="text-bone/60">← → 方向键切换页面 / BUILT WITH VITE + REACT + TAILWIND</span>
      </footer>
    </div>
  );
}

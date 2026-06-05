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
import Packs from './pages/Packs';
import QA from './pages/QA';
import Manifesto from './pages/Manifesto';
import NotFound from './pages/NotFound';
import Arknights from './pages/Arknights';
import PlumGrid from './pages/PlumGrid';
import Themes from './pages/Themes';
import HalftoneExhibition from './pages/HalftoneExhibition';
import Borders from './pages/Borders';
import Modular from './pages/Modular';
import CodexBoard from './pages/CodexBoard';
import CodexStudio from './pages/CodexStudio';
import Nav from './components/Nav';
import PageNav from './components/PageNav';
import { ErrorBoundary } from './components/ErrorBoundary';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-1 animate-fade-in pb-20">
      <ErrorBoundary>
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
          <Route path="/packs" element={<Packs />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/arknights" element={<Arknights />} />
          <Route path="/plum" element={<PlumGrid />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/halftone" element={<HalftoneExhibition />} />
          <Route path="/borders" element={<Borders />} />
          <Route path="/modular" element={<Modular />} />
          <Route path="/codex" element={<CodexBoard />} />
          <Route path="/codex-studio" element={<CodexStudio />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
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

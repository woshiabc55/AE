import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import ScriptCreator from './pages/ScriptCreator';
import ScriptDetail from './pages/ScriptDetail';
import ActDetail from './pages/ActDetail';
import Timeline from './pages/Timeline';
import RelationshipMap from './pages/RelationshipMap';
import Moodboard from './pages/Moodboard';
import WorldLore from './pages/WorldLore';
import ScriptPage from './pages/ScriptPage';
import StoryboardSketch from './pages/StoryboardSketch';
import ProductionSchedule from './pages/ProductionSchedule';
import Resources from './pages/Resources';
import './styles/variables.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/creator.css';
import './styles/expanded.css';
import './styles/production.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:id" element={<ChapterPage />} />
        <Route path="/script/new" element={<ScriptCreator />} />
        <Route path="/script/detail" element={<ScriptDetail />} />
        <Route path="/script/act/:id" element={<ActDetail />} />
        <Route path="/script/pages" element={<ScriptPage />} />
        <Route path="/script/sketch" element={<StoryboardSketch />} />
        <Route path="/script/schedule" element={<ProductionSchedule />} />
        <Route path="/script/resources" element={<Resources />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/relationships" element={<RelationshipMap />} />
        <Route path="/moodboard" element={<Moodboard />} />
        <Route path="/worldlore" element={<WorldLore />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

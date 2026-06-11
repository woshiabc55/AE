import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import ScriptCreator from './pages/ScriptCreator';
import ScriptDetail from './pages/ScriptDetail';
import ActDetail from './pages/ActDetail';
import './styles/variables.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/creator.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:id" element={<ChapterPage />} />
        <Route path="/script/new" element={<ScriptCreator />} />
        <Route path="/script/detail" element={<ScriptDetail />} />
        <Route path="/script/act/:id" element={<ActDetail />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

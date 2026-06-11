import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import './styles/variables.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:id" element={<ChapterPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

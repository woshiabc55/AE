import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { PlayerPage } from './pages/PlayerPage';
import { ChapterPage } from './pages/ChapterPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/chapter" element={<ChapterPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

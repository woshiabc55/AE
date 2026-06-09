import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import TemplateDetail from './pages/TemplateDetail';
import Workshop from './pages/Workshop';
import Editor from './pages/Editor';
import Library from './pages/Library';
import Login from './pages/Login';
import { useApp } from './store/useApp';

export default function App() {
  const bootstrap = useApp((s) => s.bootstrap);
  useEffect(() => { bootstrap(); }, [bootstrap]);

  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<TemplateDetail />} />
          <Route path="/workshop/:id" element={<Workshop />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import Home from '@/pages/Home';
import Templates from '@/pages/Templates';
import TemplateDetail from '@/pages/TemplateDetail';
import Editor from '@/pages/Editor';
import Scripts from '@/pages/Scripts';
import Settings from '@/pages/Settings';

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">· 404</p>
      <h1 className="mt-2 font-display text-6xl font-bold text-cream-50 sm:text-8xl">CUT!</h1>
      <p className="mt-4 text-base text-cream-200/60">这个场景不在剧本里。</p>
      <a href="/" className="btn-primary mt-8">
        回到首页
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="film-grain vignette flex min-h-screen flex-col bg-ink-900 text-cream-100">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toast />
      </div>
    </BrowserRouter>
  );
}

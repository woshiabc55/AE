import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import SvgEditor from '@/pages/SvgEditor';
import Live2DStudio from '@/pages/Live2DStudio';
import Templates from '@/pages/Templates';
import Gallery from '@/pages/Gallery';
import Settings from '@/pages/Settings';
import ToastHost from '@/components/common/ToastHost';
import { useProjectStore } from '@/store/projectStore';

export default function App() {
  const init = useProjectStore((s) => s.init);
  const location = useLocation();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/svg" element={<SvgEditor />} />
        <Route path="/editor/svg/:projectId" element={<SvgEditor />} />
        <Route path="/editor/live2d" element={<Live2DStudio />} />
        <Route path="/editor/live2d/:projectId" element={<Live2DStudio />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastHost />
    </Layout>
  );
}

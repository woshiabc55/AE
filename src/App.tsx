import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Projects from '@/pages/Projects';
import Editor from '@/pages/Editor';
import Present from '@/pages/Present';
import { useStore } from '@/store/storyboardStore';

function ThemeRoot({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'midnight') {
      html.classList.add('dark');
      html.style.background = '#0A0A12';
      html.style.color = '#E5E0D0';
    } else {
      html.classList.remove('dark');
      html.style.background = '#F4EFE6';
      html.style.color = '#1A1814';
    }
  }, [theme]);
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeRoot>
      <Router>
        <div className={useStore.getState().theme === 'midnight' ? 'bg-midnight-900 bg-paper-dark' : 'bg-paper bg-paper'}>
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/projects/:projectId" element={<Editor />} />
            <Route path="/projects/:projectId/present" element={<Present />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeRoot>
  );
}

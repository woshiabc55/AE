import { HashRouter, Routes, Route } from 'react-router-dom';
import Workbench from './pages/Workbench';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Workbench />} />
        <Route path="*" element={<Workbench />} />
      </Routes>
    </HashRouter>
  );
}

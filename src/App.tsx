import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Home from "@/pages/Home";
import Draw from "@/pages/Draw";
import Layers from "@/pages/Layers";
import Mesh from "@/pages/Mesh";
import Animate from "@/pages/Animate";
import ExportPage from "@/pages/Export";
import Preview from "@/pages/Preview";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/draw" element={<Draw />} />
          <Route path="/layers" element={<Layers />} />
          <Route path="/mesh" element={<Mesh />} />
          <Route path="/animate" element={<Animate />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Routes>
    </Router>
  );
}

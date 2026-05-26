import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspace from "@/pages/Workspace";
import SkillsPage from "@/pages/SkillsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
    </Router>
  );
}

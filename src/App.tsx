import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SchemeDetail from "@/pages/SchemeDetail";
import ConceptDesign from "@/pages/ConceptDesign";
import LaunchPlan from "@/pages/LaunchPlan";
import SkillNim from "@/pages/SkillNim";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheme/:id" element={<SchemeDetail />} />
        <Route path="/concept" element={<ConceptDesign />} />
        <Route path="/launch" element={<LaunchPlan />} />
        <Route path="/nim" element={<SkillNim />} />
      </Routes>
    </Router>
  );
}

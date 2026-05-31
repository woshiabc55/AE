import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SchemeDetail from "@/pages/SchemeDetail";
import ConceptDesign from "@/pages/ConceptDesign";
import LaunchPlan from "@/pages/LaunchPlan";
import SkillNim from "@/pages/SkillNim";
import DesignDatabase from "@/pages/DesignDatabase";
import ComponentGallery from "@/pages/ComponentGallery";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheme/:id" element={<SchemeDetail />} />
        <Route path="/concept" element={<ConceptDesign />} />
        <Route path="/launch" element={<LaunchPlan />} />
        <Route path="/nim" element={<SkillNim />} />
        <Route path="/db" element={<DesignDatabase />} />
        <Route path="/components" element={<ComponentGallery />} />
      </Routes>
    </Router>
  );
}

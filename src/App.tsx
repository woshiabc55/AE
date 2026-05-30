import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ConceptArt from "@/pages/ConceptArt";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concept-art" element={<ConceptArt />} />
      </Routes>
    </Router>
  );
}

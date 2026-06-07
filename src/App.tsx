import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Employees from "@/pages/Employees";
import Workshop from "@/pages/Workshop";
import Codex from "@/pages/Codex";
import Settings from "@/pages/Settings";
import Story from "@/pages/Story";
import Qliphoth from "@/pages/Qliphoth";
import Characters from "@/pages/Characters";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/qliphoth" element={<Qliphoth />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/story" element={<Story />} />
      </Routes>
    </Router>
  );
}

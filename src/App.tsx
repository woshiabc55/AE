import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Employees from "@/pages/Employees";
import Workshop from "@/pages/Workshop";
import Codex from "@/pages/Codex";
import Settings from "@/pages/Settings";
import Story from "@/pages/Story";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/story" element={<Story />} />
      </Routes>
    </Router>
  );
}

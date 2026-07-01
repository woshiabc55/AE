import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "@/pages/Start";
import Game from "@/pages/Game";
import Chronicle from "@/pages/Chronicle";
import Codex from "@/pages/Codex";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/dialogue" element={<Game />} />
        <Route path="/chronicle" element={<Chronicle />} />
        <Route path="/codex" element={<Codex />} />
      </Routes>
    </Router>
  );
}

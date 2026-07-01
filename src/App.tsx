import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "@/pages/Home";
import GamePage from "@/game/pages/GamePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GamePage />} />
        <Route
          path="*"
          element={
            <div className="h-full flex items-center justify-center bg-ink-900">
              <Link to="/" className="text-ember-400 underline">返回首页</Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

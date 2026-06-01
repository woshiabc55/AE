import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import SceneDetail from "@/pages/SceneDetail";
import TimelineController from "@/components/TimelineController";

function AppContent() {
  const location = useLocation();
  const showTimeline = location.pathname !== '/';

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:id" element={<SceneDetail />} />
      </Routes>
      {showTimeline && <TimelineController />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

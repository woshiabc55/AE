import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ToolDetail from "@/pages/ToolDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:id" element={<ToolDetail />} />
      </Routes>
    </Router>
  );
}

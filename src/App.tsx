import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Effects from "@/pages/Effects";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/effects" element={<Effects />} />
      </Routes>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SchemeDetail from "@/pages/SchemeDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheme/:id" element={<SchemeDetail />} />
      </Routes>
    </Router>
  );
}

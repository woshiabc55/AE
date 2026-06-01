import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Document from "./pages/Document";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/document/:id" element={<Document />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MinecraftPage from "@/pages/MinecraftPage";

export default function App() {
  return (
    <Router basename="/AE">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/minecraft" element={<MinecraftPage />} />
      </Routes>
    </Router>
  );
}

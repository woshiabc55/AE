import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrameworkMap from "@/pages/FrameworkMap";
import DocEditor from "@/pages/DocEditor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrameworkMap />} />
        <Route path="/editor/:nodeId" element={<DocEditor />} />
      </Routes>
    </Router>
  );
}

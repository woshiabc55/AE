import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Workspace from "@/pages/Workspace";
import Templates from "@/pages/Templates";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </Layout>
    </Router>
  );
}

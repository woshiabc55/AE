import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Exam from "@/pages/Exam";
import Outline from "@/pages/Outline";

// 处理首页锚点跳转（?focus=exams / ?focus=outline）
function ScrollToFocus() {
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const focus = params.get("focus");
    if (focus && location.pathname === "/") {
      const el = document.getElementById(focus);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    } else if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToFocus />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/outline/:chapterId" element={<Outline />} />
        </Routes>
      </Layout>
    </Router>
  );
}

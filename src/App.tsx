import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import Home from "@/pages/Home";
import StoryboardPage from "@/pages/StoryboardPage";
import CastPage from "@/pages/CastPage";
import FxPage from "@/pages/FxPage";

export default function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/storyboard" element={<StoryboardPage />} />
          <Route path="/cast" element={<CastPage />} />
          <Route path="/fx" element={<FxPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

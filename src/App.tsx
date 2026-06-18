import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import GameDetail from "@/pages/GameDetail";
import HeroPage from "@/pages/HeroPage";
import Category from "@/pages/Category";
import Favorites from "@/pages/Favorites";
import SearchPage from "@/pages/SearchPage";
import Gallery from "@/pages/Gallery";
import { Navbar, Footer } from "@/components/Layout";
import { preloadImages } from "@/hooks/useImagePreload";
import { allConceptImageUrls } from "@/data/conceptImages";
import { allRealAssets } from "@/data/realAssets";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function GlobalPreload() {
  useEffect(() => {
    // 应用启动时预热所有设定图 URL + 所有真实素材 URL，
    // 确保首页 / 图库 / 详情页能立即命中浏览器缓存
    const aiUrls = allConceptImageUrls();
    const realUrls = allRealAssets().map((a) => a.asset.url);
    preloadImages([...aiUrls, ...realUrls]);
  }, []);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <GlobalPreload />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
            <Route path="/hero/:heroId" element={<HeroPage />} />
            <Route path="/category/:cat" element={<Category />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="*"
              element={
                <div className="py-20 text-center">
                  <div className="font-serif text-6xl font-black text-white">404</div>
                  <div className="mt-2 text-white/50">该页面不存在</div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";

export default function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main
        className={cn(
          "flex-1 flex flex-col",
          isHome ? "" : "min-h-0"
        )}
      >
        <Outlet />
      </main>
      <footer className="border-t border-mist-100/5 py-3 px-6 text-[11px] font-mono text-mist-300 flex items-center justify-between">
        <span>MOCHI LIVE STUDIO · 探索 SVG → Live2D 的轻量桥梁</span>
        <span className="hidden md:inline">A · 001  ·  © 2026 Mochi Live</span>
      </footer>
    </div>
  );
}

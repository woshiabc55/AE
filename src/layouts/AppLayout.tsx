import { NavLink, useLocation } from "react-router-dom";
import {
  Clapperboard,
  Compass,
  Pen,
  Library,
  Settings,
  ScrollText,
  Store,
} from "lucide-react";
import { cn } from "@/utils/format";
import { Marquee } from "@/components/Marquee";
import { NetworkDot } from "@/components/ui/NetworkStatus";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useRef } from "react";

const NAV = [
  { to: "/", label: "Discover", icon: Compass, end: true },
  { to: "/library", label: "Library", icon: Library },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/studio", label: "Studio", icon: Pen },
  { to: "/workshop", label: "Workshop", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const triggerRef = useRef<(() => void) | null>(null);

  useShortcuts([
    {
      combo: "Mod+K",
      description: "open command palette",
      handler: () => {
        const el = document.querySelector<HTMLButtonElement>(
          "[data-cmd-k-trigger]"
        );
        el?.click();
      },
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-ink-900 text-paper-100">
      <Marquee />

      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-900/85 backdrop-blur">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center border border-amber text-amber group-hover:bg-amber group-hover:text-ink-900 transition-colors">
              <Clapperboard size={18} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[20px] tracking-wide text-paper-50">
                萤幕 <span className="italic text-amber">Lumière</span>
              </span>
              <span className="label-overline mt-1 text-ink-300">
                Prompt Reel · Est. 2026
              </span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1" aria-label="主导航">
            {NAV.map((n) => {
              const active = n.end
                ? loc.pathname === n.to
                : loc.pathname.startsWith(n.to);
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={cn(
                    "px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 flex items-center gap-2 border-b-2 transition-colors",
                    active
                      ? "border-amber text-amber"
                      : "border-transparent text-ink-300 hover:text-paper-100"
                  )}
                >
                  <n.icon size={13} strokeWidth={1.5} />
                  {n.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              data-cmd-k-trigger
              onClick={() => {
                const ev = new CustomEvent("lumiere:open-palette");
                window.dispatchEvent(ev);
              }}
              className="ghost-button text-[10px] py-1.5 px-3"
              aria-label="打开命令面板"
              title="⌘K"
            >
              <span className="font-mono">⌘K</span>
              <span>搜索</span>
            </button>
            <span className="label-overline">v0.2 · stable</span>
            <NetworkDot />
          </div>

          <nav
            className="flex md:hidden items-center gap-1"
            aria-label="移动端导航"
          >
            {NAV.map((n) => {
              const active = n.end
                ? loc.pathname === n.to
                : loc.pathname.startsWith(n.to);
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={cn(
                    "p-2 border",
                    active ? "border-amber text-amber" : "border-transparent text-ink-300"
                  )}
                >
                  <n.icon size={16} strokeWidth={1.5} />
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 relative" id="main-content">
        {children}
      </main>

      <footer className="border-t border-ink-700 mt-12">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 text-ink-300">
            <span className="font-mono text-[10px] uppercase tracking-widest2">
              萤幕 Lumière · Prompt Reel for Storytellers
            </span>
          </div>
          <div className="flex items-center gap-3 label-overline">
            <span>"Action."</span>
            <span className="stat-divider" />
            <span>"Cut."</span>
            <span className="stat-divider" />
            <span>"Print."</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

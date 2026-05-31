import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, BookOpen, BarChart3, Users, Trophy, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/community", label: "Community", icon: Users },
  { to: "/achievements", label: "Achievements", icon: Trophy },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-primary text-white">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <span className="font-display text-lg font-bold text-primary">L</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wide">
              LinguaVerse
            </h1>
            <p className="text-xs text-primary-200 opacity-70">
              Explore Languages
            </p>
          </div>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-pill px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-accent"
                    : "text-primary-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user.username}
                </p>
                <p className="truncate text-xs text-primary-200 opacity-70">
                  {user.level} · {user.targetLanguage?.toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full p-1.5 text-primary-200 transition-colors hover:bg-white/10 hover:text-white"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 text-sm text-primary-200 hover:text-white"
            >
              <LogOut size={16} />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface">
        <Outlet />
      </main>
    </div>
  );
}

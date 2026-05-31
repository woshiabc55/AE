import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, BarChart3, Users, Trophy, User, Menu, ChevronLeft, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { LANGUAGE_CONFIG } from '@/types';
import ProgressRing from '@/components/ProgressRing';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const location = useLocation();
  const { user, sidebarCollapsed, toggleSidebar, logout, progress } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const langConfig = user ? LANGUAGE_CONFIG[user.targetLanguage] : LANGUAGE_CONFIG.en;
  const dailyProgress = user ? Math.min(100, Math.round((progress.dailyMinutes / user.dailyGoal) * 100)) : 0;

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-brand-border/30`}>
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-bold text-lg">L</span>
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display font-bold text-lg text-white whitespace-nowrap overflow-hidden"
            >
              LinguaVerse
            </motion.span>
          )}
        </Link>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                sidebarCollapsed ? 'justify-center' : ''
              } ${isActive
                ? 'bg-brand-accent/15 text-brand-accent'
                : 'text-gray-400 hover:text-white hover:bg-brand-card/60'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-brand-accent' : 'group-hover:text-white'} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-brand-accent rounded-r-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-brand-border/30 p-3 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
        {user && (
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: langConfig.bgColor }}
              >
                {user.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <ProgressRing percentage={dailyProgress} size={20} strokeWidth={2.5} color={langConfig.color} />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400">
                  {user.xp} XP · 🔥 {user.streak}
                </p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 bg-brand-surface border-r border-brand-border/30 transition-transform duration-300 lg:translate-x-0 ${sidebarWidth} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 h-14 px-4 border-b border-brand-border/30 bg-brand-surface/50 backdrop-blur-sm lg:hidden flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-white">LinguaVerse</span>
        </header>

        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors absolute top-4 left-[4.5rem] z-30"
          >
            <Menu size={16} />
          </button>
        )}

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="p-4 md:p-6 lg:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

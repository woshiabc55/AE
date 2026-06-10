import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Explore = lazy(() => import('./pages/Explore').then((m) => ({ default: m.Explore })))
const Editor = lazy(() => import('./pages/Editor').then((m) => ({ default: m.Editor })))
const Stage = lazy(() => import('./pages/Stage').then((m) => ({ default: m.Stage })))
const Team = lazy(() => import('./pages/Team').then((m) => ({ default: m.Team })))
const Me = lazy(() => import('./pages/Me').then((m) => ({ default: m.Me })))

function PageFallback() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-bone-400 font-mono-ui text-[12px] animate-flicker">
        幕启 · 装片中……
      </div>
    </div>
  )
}

export function Router() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/editor/:templateId" element={<Editor />} />
          <Route path="/stage/:templateId" element={<Stage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/me" element={<Me />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/shell/AppShell'
import Dashboard from '@/pages/Dashboard'
import DocApp from '@/pages/DocApp'
import SheetApp from '@/pages/SheetApp'
import SlideApp from '@/pages/SlideApp'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppShell appType="home">
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/doc"
          element={
            <AppShell appType="doc" appName="TabDoc 文档">
              <DocApp />
            </AppShell>
          }
        />
        <Route
          path="/sheet"
          element={
            <AppShell appType="sheet" appName="TabSheet 表格">
              <SheetApp />
            </AppShell>
          }
        />
        <Route
          path="/slide"
          element={
            <AppShell appType="slide" appName="TabSlide 演示">
              <SlideApp />
            </AppShell>
          }
        />
      </Routes>
    </Router>
  )
}

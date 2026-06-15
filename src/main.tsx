import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LibraryPage from './pages/Library';
import SettingsPage from './pages/Settings';
import './styles/index.css';
import '@xyflow/react/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<App initialTab="canvas" />} />
        </Route>
        <Route
          path="/library"
          element={
            <App>
              <LibraryPage />
            </App>
          }
        />
        <Route
          path="/settings"
          element={
            <App>
              <SettingsPage />
            </App>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);

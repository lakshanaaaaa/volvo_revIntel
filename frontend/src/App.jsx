import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastProvider } from './components/ui/Toast';
import { getStats } from './lib/api';
import { Overview } from './pages/Overview';
import { ManagerBrief } from './pages/ManagerBrief';
import { Conversations } from './pages/Conversations';
import { RoutingReview } from './pages/RoutingReview';
import { ExportsPage } from './pages/ExportsPage';
import { DataImports } from './pages/DataImports';
import { Settings } from './pages/Settings';

const TITLES = {
  '/':         'Overview',
  '/brief':    'Manager Brief — 21 August 2026',
  '/inbox':    'Conversations',
  '/routing':  'Routing & Review',
  '/exports':  'Exports',
  '/import':   'Data Imports',
  '/settings': 'Data Definitions',
};

export default function App() {
  const location = useLocation();
  const [stats, setStats] = useState(null);

  const refreshStats = useCallback(async () => {
    try {
      const s = await getStats();
      setStats(s);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => { refreshStats(); }, [refreshStats]);

  const title = TITLES[location.pathname] || 'Revenue Intelligence Inbox';

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#080F1D]">
        <Sidebar stats={stats} />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Topbar title={title} stats={stats} onImportSuccess={refreshStats} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/"         element={<Overview />} />
              <Route path="/brief"    element={<ManagerBrief />} />
              <Route path="/inbox"    element={<Conversations />} />
              <Route path="/routing"  element={<RoutingReview />} />
              <Route path="/exports"  element={<ExportsPage />} />
              <Route path="/import"   element={<DataImports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

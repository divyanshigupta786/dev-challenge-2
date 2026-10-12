import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { TodayPage } from './pages/TodayPage';
import { ObservePage } from './pages/ObservePage';
import { ReflectionPage } from './pages/ReflectionPage';
import { JournalPage, JournalEntryPage } from './pages/JournalPage';
import { SettingsPage } from './pages/SettingsPage';
import { FolioPage } from './pages/FolioPage';

function Layout() {
  return (
    <div className="flex min-h-screen bg-stone-light text-graphite antialiased font-body">
      <Sidebar />
      <main className="flex-1 w-full min-w-0 flex flex-col">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-width editorial landing page (public entry door) */}
        <Route path="/" element={<LandingPage />} />

        {/* Application screens inside Layout with sidebar & mobile nav */}
        <Route element={<Layout />}>
          <Route path="/quests" element={<TodayPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/observe" element={<ObservePage />} />
          <Route path="/folio" element={<FolioPage />} />
          <Route path="/folio/:questId" element={<FolioPage />} />
          <Route path="/reflection" element={<ReflectionPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:id" element={<JournalEntryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



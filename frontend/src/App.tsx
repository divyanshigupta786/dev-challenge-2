import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './components/Navigation';
import { TodayPage } from './pages/TodayPage';
import { ObservePage } from './pages/ObservePage';
import { ReflectionPage } from './pages/ReflectionPage';
import { JournalPage, JournalEntryPage } from './pages/JournalPage';
import { SettingsPage } from './pages/SettingsPage';

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
        <Route element={<Layout />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/observe" element={<ObservePage />} />
          <Route path="/reflection" element={<ReflectionPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:id" element={<JournalEntryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

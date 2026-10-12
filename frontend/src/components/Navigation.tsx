import { NavLink, useLocation } from 'react-router-dom';
import { Home, Eye, Sparkles, BookOpen, Settings, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { to: '/quests', label: 'Quests', icon: Home },
  { to: '/folio', label: 'Field Folio', icon: FileText },
  { to: '/observe', label: 'Observe', icon: Eye },
  { to: '/reflection', label: 'Reflection', icon: Sparkles },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/settings', label: 'Settings', icon: Settings },
];

// Desktop sidebar navigation
export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-border-subtle py-8 px-4 flex-shrink-0">
      {/* Wordmark */}
      <div className="mb-10 px-2">
        <NavLink to="/" className="block group">
          <h1 className="font-heading text-2xl text-graphite leading-none tracking-tight group-hover:text-oxide transition-colors">Mundane</h1>
          <p className="text-xs text-text-muted mt-1 font-body">Your city is more interesting than you think.</p>
        </NavLink>
      </div>

      {/* Nav links */}
      <nav aria-label="Main navigation" className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-150',
                isActive
                  ? 'bg-oxide/10 text-oxide font-medium'
                  : 'text-text-muted hover:text-graphite hover:bg-dust/30',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 mt-auto">
        <p className="text-[10px] text-text-muted leading-relaxed">
          Entries stored locally on your device.
        </p>
      </div>
    </aside>
  );
}

// Mobile bottom navigation
export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-subtle z-50 safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded min-w-[44px] min-h-[44px] justify-center"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'text-oxide' : 'text-text-muted'}
              />
              <span className={cn('text-[10px]', isActive ? 'text-oxide font-medium' : 'text-text-muted')}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}


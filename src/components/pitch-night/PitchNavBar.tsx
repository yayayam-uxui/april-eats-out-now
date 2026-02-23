import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Bell, Briefcase, MessageSquare, Search, LogOut, BarChart2, Shield } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/pitch', icon: Home, label: 'Home' },
  { to: '/pitch/network', icon: Users, label: 'Network' },
  { to: '/pitch/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/pitch/leaderboard', icon: BarChart2, label: 'Leaderboard' },
];

export function PitchNavBar() {
  const { currentUser, logout, notifications } = usePitchNight();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/pitch/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-14 gap-2">
        {/* Logo */}
        <Link to="/pitch" className="flex items-center gap-1.5 mr-4 shrink-0">
          <div className="w-8 h-8 bg-[#0A66C2] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">PN</span>
          </div>
          <span className="hidden sm:block font-semibold text-[#0A66C2] text-sm leading-none">
            Pitch<br />Night
          </span>
        </Link>

        {/* Search */}
        <div className="flex items-center bg-[#EEF3F8] rounded px-3 py-1.5 gap-2 flex-1 max-w-[280px]">
          <Search size={16} className="text-[#666]" />
          <input
            className="bg-transparent text-sm outline-none w-full placeholder:text-[#666]"
            placeholder="Search startups, people..."
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav items */}
        <nav className="flex items-center">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/pitch' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 text-xs gap-0.5 min-w-[56px] border-b-2 transition-colors',
                  active
                    ? 'text-black border-black'
                    : 'text-[#666] border-transparent hover:text-black hover:border-black'
                )}
              >
                <Icon size={20} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}

          {/* Notifications bell */}
          <Link
            to="/pitch/notifications"
            className={cn(
              'relative flex flex-col items-center justify-center px-3 py-2 text-xs gap-0.5 min-w-[56px] border-b-2 transition-colors',
              location.pathname === '/pitch/notifications'
                ? 'text-black border-black'
                : 'text-[#666] border-transparent hover:text-black hover:border-black'
            )}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2.5 bg-[#CC1016] text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="hidden sm:block">Alerts</span>
          </Link>

          {/* Admin */}
          {currentUser?.role === 'admin' && (
            <Link
              to="/pitch/admin"
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 text-xs gap-0.5 min-w-[56px] border-b-2 transition-colors',
                location.pathname.startsWith('/pitch/admin')
                  ? 'text-black border-black'
                  : 'text-[#666] border-transparent hover:text-black hover:border-black'
              )}
            >
              <Shield size={20} />
              <span className="hidden sm:block">Admin</span>
            </Link>
          )}

          {/* Judge dashboard */}
          {currentUser?.role === 'judge' && (
            <Link
              to="/pitch/judge"
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 text-xs gap-0.5 min-w-[56px] border-b-2 transition-colors',
                location.pathname.startsWith('/pitch/judge')
                  ? 'text-black border-black'
                  : 'text-[#666] border-transparent hover:text-black hover:border-black'
              )}
            >
              <Briefcase size={20} />
              <span className="hidden sm:block">Judging</span>
            </Link>
          )}
        </nav>

        {/* Avatar + logout */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#e0e0e0]">
          {currentUser ? (
            <>
              <Link to={currentUser.role === 'startup' ? `/pitch/startup/${currentUser.startupId}` : '/pitch'}>
                <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#666] hover:text-red-600 transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link
              to="/pitch/login"
              className="text-sm font-semibold text-[#0A66C2] border border-[#0A66C2] rounded-full px-3 py-1 hover:bg-[#EEF3F8] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Star, Settings, Bell, BarChart2, Award, BookOpen, Home,
  ChevronRight, ToggleLeft, ToggleRight, Trash2, PlusCircle, Send,
} from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`bg-white rounded-xl border border-[#e0e0e0] p-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function AdminNavLink({ to, icon, label, desc }: { to: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e0e0e0] hover:shadow-md hover:border-[#0A66C2] transition-all group"
    >
      <div className="w-10 h-10 bg-[#EEF3F8] rounded-full flex items-center justify-center text-[#0A66C2] group-hover:bg-[#0A66C2] group-hover:text-white transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0A66C2] transition-colors" />
    </Link>
  );
}

export default function AdminDashboard() {
  const { currentUser, startups, users, scores, notifications, event, updateEvent, getLeaderboard } = usePitchNight();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/pitch/login');
    return null;
  }

  const judges = users.filter((u) => u.role === 'judge');
  const totalScores = scores.length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const leaderboard = getLeaderboard();

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-xl p-5 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-bold text-lg">Admin Panel</p>
              <p className="text-white/70 text-sm">Pitch Night Spring 2026</p>
            </div>
          </div>

          {/* Toggle: scores published */}
          <div className="mt-4 flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-sm">Scores Published</p>
              <p className="text-white/60 text-xs">Startups can see their scores</p>
            </div>
            <button
              onClick={() => updateEvent({ scoresPublished: !event.scoresPublished })}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              {event.scoresPublished ? (
                <><ToggleRight size={28} className="text-green-400" /><span className="text-green-400">ON</span></>
              ) : (
                <><ToggleLeft size={28} className="text-white/50" /><span className="text-white/50">OFF</span></>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Startups" value={startups.length} icon={<Home size={18} className="text-[#0A66C2]" />} color="bg-[#EEF3F8]" />
          <StatCard label="Judges" value={judges.length} icon={<Star size={18} className="text-purple-600" />} color="bg-purple-50" />
          <StatCard label="Scores Submitted" value={totalScores} icon={<BarChart2 size={18} className="text-green-600" />} color="bg-green-50" />
          <StatCard label="Notifications" value={notifications.length} icon={<Bell size={18} className="text-amber-600" />} color="bg-amber-50" />
        </div>

        {/* Quick leaderboard */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Current Standings</h3>
            <Link to="/pitch/leaderboard" className="text-xs text-[#0A66C2] hover:underline">Full leaderboard →</Link>
          </div>
          {leaderboard.map((item, idx) => (
            <div key={item.startup.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-700'
              }`}>{idx + 1}</span>
              <StartupAvatar name={item.startup.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.startup.name}</p>
                <p className="text-xs text-gray-400">{item.judgesCount} judge{item.judgesCount !== 1 ? 's' : ''} scored</p>
              </div>
              <span className="font-bold text-[#0A66C2] text-sm">
                {item.avgScore > 0 ? item.avgScore.toFixed(1) : '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Management links */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Manage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminNavLink to="/pitch/admin/startups" icon={<Home size={18} />} label="Startups" desc="Add, edit, delete startup profiles" />
            <AdminNavLink to="/pitch/admin/judges" icon={<Star size={18} />} label="Judges" desc="Manage judges and assignments" />
            <AdminNavLink to="/pitch/admin/criteria" icon={<BookOpen size={18} />} label="Criteria" desc="Edit scoring criteria and weights" />
            <AdminNavLink to="/pitch/admin/rooms" icon={<Settings size={18} />} label="Rooms" desc="Manage event rooms" />
            <AdminNavLink to="/pitch/admin/notifications" icon={<Bell size={18} />} label="Notifications" desc="Send alerts to startups" />
            <AdminNavLink to="/pitch/leaderboard" icon={<Award size={18} />} label="Leaderboard" desc="View live rankings" />
          </div>
        </div>
      </div>
    </PitchLayout>
  );
}

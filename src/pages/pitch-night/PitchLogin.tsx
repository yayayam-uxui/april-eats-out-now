import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePitchNight } from '@/context/PitchNightContext';
import { Eye, EyeOff, Shield, Star, Rocket } from 'lucide-react';

type Tab = 'startup' | 'judge' | 'admin';

export default function PitchLogin() {
  const { login, users, getStartupByAccessCode, event } = usePitchNight();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('startup');
  const [accessCode, setAccessCode] = useState('');
  const [judgeId, setJudgeId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const judges = users.filter((u) => u.role === 'judge');

  const handleStartupLogin = () => {
    if (!accessCode.trim()) { setError('Please enter your access code'); return; }
    const startup = getStartupByAccessCode(accessCode.trim());
    if (!startup) { setError('Invalid access code. Please check with the event organizer.'); return; }
    setError('');
    setLoading(true);
    // Create a startup team user
    const userId = `startup-user-${startup.id}`;
    login('startup', userId);
    // We need to set the startupId on the user — handled in context by updating user
    setTimeout(() => {
      navigate(`/pitch/startup/${startup.id}/dashboard`);
    }, 400);
  };

  const handleJudgeLogin = () => {
    if (!judgeId) { setError('Please select your judge profile'); return; }
    setError('');
    setLoading(true);
    login('judge', judgeId);
    const judge = users.find((u) => u.id === judgeId);
    const isNew = !judge?.name || judge.name === judgeId;
    setTimeout(() => {
      navigate(isNew ? '/pitch/judge/onboarding' : '/pitch/judge');
    }, 400);
  };

  const handleAdminLogin = () => {
    if (adminPassword !== 'admin2026') { setError('Incorrect admin password'); return; }
    setError('');
    setLoading(true);
    login('admin', 'admin-1');
    setTimeout(() => {
      navigate('/pitch/admin');
    }, 400);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'startup', label: 'Startup Team', icon: <Rocket size={16} /> },
    { id: 'judge', label: 'Judge', icon: <Star size={16} /> },
    { id: 'admin', label: 'Organizer', icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F3F2EE] flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#0A66C2] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white font-bold text-2xl">PN</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
        <p className="text-gray-500 mt-1">{event.subtitle} · {event.venue}</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#e0e0e0]">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                tab === id
                  ? 'text-[#0A66C2] border-[#0A66C2]'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Startup tab */}
          {tab === 'startup' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Startup Access Code
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartupLogin()}
                  placeholder="e.g. NUTRI2026"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] tracking-widest font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Get this code from your event organizer</p>
              </div>
              <button
                onClick={handleStartupLogin}
                disabled={loading}
                className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Enter Dashboard'}
              </button>
            </div>
          )}

          {/* Judge tab */}
          {tab === 'judge' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Select your profile
                </label>
                <select
                  value={judgeId}
                  onChange={(e) => setJudgeId(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] bg-white"
                >
                  <option value="">— Choose judge —</option>
                  {judges.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name}{j.company ? ` · ${j.company}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleJudgeLogin}
                disabled={loading}
                className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Go to Judge Dashboard'}
              </button>
            </div>
          )}

          {/* Admin tab */}
          {tab === 'admin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="Enter organizer password"
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Demo password: admin2026</p>
              </div>
              <button
                onClick={handleAdminLogin}
                disabled={loading}
                className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Enter Admin Panel'}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Guest link */}
      <button
        onClick={() => { login('guest', 'guest-' + Date.now()); navigate('/pitch'); }}
        className="mt-4 text-sm text-gray-500 hover:text-[#0A66C2] transition-colors underline"
      >
        Continue as audience (no login required)
      </button>
    </div>
  );
}

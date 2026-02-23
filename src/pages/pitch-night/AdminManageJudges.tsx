import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, PlusCircle, X, Save, Star } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import type { UserProfile } from '@/types/pitchNight';

const EMPTY_JUDGE = { name: '', title: '', company: '', headline: '', email: '', linkedinUrl: '' };

export default function AdminManageJudges() {
  const { users, addUser, deleteUser, startups, updateStartup } = usePitchNight();
  const judges = users.filter((u) => u.role === 'judge');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_JUDGE });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newJudge: UserProfile = {
      id: `judge-${Date.now()}`,
      role: 'judge',
      name: form.name,
      headline: form.headline || `${form.title} at ${form.company}`,
      title: form.title,
      company: form.company,
      email: form.email,
      linkedinUrl: form.linkedinUrl,
      connections: [],
      pendingConnections: [],
      sentConnections: [],
      followedStartups: [],
    };
    addUser(newJudge);
    setForm({ ...EMPTY_JUDGE });
    setAdding(false);
  };

  const handleAssign = (judgeId: string, startupId: string, assign: boolean) => {
    const startup = startups.find((s) => s.id === startupId);
    if (!startup) return;
    const ids = assign
      ? [...new Set([...startup.assignedJudgeIds, judgeId])]
      : startup.assignedJudgeIds.filter((id) => id !== judgeId);
    updateStartup(startupId, { assignedJudgeIds: ids });
  };

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pitch/admin" className="text-gray-500 hover:text-[#0A66C2]"><ChevronLeft size={20} /></Link>
            <h1 className="text-xl font-bold text-gray-900">Manage Judges</h1>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-[#0A66C2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#004182] transition-colors"
          >
            <PlusCircle size={16} />Add Judge
          </button>
        </div>

        {adding && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">New Judge</h3>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Full Name *', key: 'name' },
                { label: 'Job Title', key: 'title' },
                { label: 'Company', key: 'company' },
                { label: 'Email', key: 'email' },
                { label: 'LinkedIn URL', key: 'linkedinUrl' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleAdd} className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold px-5 py-2 rounded-full transition-colors">
              <Save size={15} />Add Judge
            </button>
          </div>
        )}

        {/* Judges list */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          {judges.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No judges yet.</p>
          )}
          {judges.map((j) => (
            <div key={j.id} className="border-b border-[#e0e0e0] last:border-b-0">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                  {j.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{j.name}</p>
                  <p className="text-xs text-gray-500">{j.headline ?? `${j.title} · ${j.company}`}</p>
                </div>
                <button onClick={() => deleteUser(j.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Startup assignments */}
              <div className="px-4 pb-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Assigned to startups:</p>
                <div className="flex flex-wrap gap-2">
                  {startups.map((s) => {
                    const assigned = s.assignedJudgeIds.includes(j.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleAssign(j.id, s.id, !assigned)}
                        className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                          assigned
                            ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                            : 'border-[#e0e0e0] text-gray-500 hover:border-[#0A66C2] hover:text-[#0A66C2]'
                        }`}
                      >
                        {assigned ? '✓ ' : ''}{s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PitchLayout>
  );
}

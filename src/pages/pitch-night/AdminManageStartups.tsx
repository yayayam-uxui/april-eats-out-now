import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Edit2, PlusCircle, X, Save } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import type { Startup, Industry, StartupStage } from '@/types/pitchNight';

const INDUSTRIES: Industry[] = ['FinTech','HealthTech','EdTech','CleanTech','AgriTech','SaaS','E-commerce','AI/ML','DeepTech','Social Impact','FoodTech','PropTech','HRTech','LegalTech','Marketplace'];
const STAGES: StartupStage[] = ['Idea','MVP','Pre-Seed','Seed','Series A'];

const EMPTY: Omit<Startup, 'id' | 'teamMemberIds' | 'assignedJudgeIds' | 'connections' | 'followers'> = {
  name: '', tagline: '', description: '', founder: '', founderTitle: '', industry: 'SaaS', stage: 'MVP',
  teamSize: 2, location: '', founded: String(new Date().getFullYear()), askAmount: '', website: '',
  pitchOrder: 1, traction: '', problem: '', solution: '', tags: [], accessCode: '',
};

export default function AdminManageStartups() {
  const { startups, addStartup, updateStartup, deleteStartup, rooms, users } = usePitchNight();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });

  const openEdit = (s: Startup) => {
    setEditing(s.id);
    setAdding(false);
    setForm({
      name: s.name, tagline: s.tagline, description: s.description, founder: s.founder,
      founderTitle: s.founderTitle, industry: s.industry, stage: s.stage, teamSize: s.teamSize,
      location: s.location, founded: s.founded, askAmount: s.askAmount ?? '', website: s.website ?? '',
      pitchOrder: s.pitchOrder, traction: s.traction ?? '', problem: s.problem, solution: s.solution,
      tags: s.tags, accessCode: s.accessCode, roomId: s.roomId,
    });
  };

  const handleSave = () => {
    const tags = typeof form.tags === 'string'
      ? (form.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
      : form.tags;
    if (adding) {
      addStartup({
        id: `startup-${Date.now()}`,
        ...form,
        tags,
        teamMemberIds: [],
        assignedJudgeIds: [],
        connections: [],
        followers: 0,
      });
    } else if (editing) {
      updateStartup(editing, { ...form, tags });
    }
    setEditing(null);
    setAdding(false);
  };

  const judges = users.filter((u) => u.role === 'judge');

  const FormPanel = () => (
    <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{adding ? 'Add Startup' : 'Edit Startup'}</h3>
        <button onClick={() => { setEditing(null); setAdding(false); }} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Name *', key: 'name', type: 'text' },
          { label: 'Founder Name *', key: 'founder', type: 'text' },
          { label: 'Founder Title', key: 'founderTitle', type: 'text' },
          { label: 'Location', key: 'location', type: 'text' },
          { label: 'Founded Year', key: 'founded', type: 'text' },
          { label: 'Team Size', key: 'teamSize', type: 'number' },
          { label: 'Ask Amount', key: 'askAmount', type: 'text' },
          { label: 'Pitch Order', key: 'pitchOrder', type: 'number' },
          { label: 'Access Code *', key: 'accessCode', type: 'text' },
          { label: 'Website', key: 'website', type: 'url' },
          { label: 'Traction', key: 'traction', type: 'text' },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
            <input
              type={type}
              value={String((form as Record<string, unknown>)[key] ?? '')}
              onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
              className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Tagline *</label>
        <input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
          className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
          className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Problem</label>
          <textarea value={form.problem} onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))} rows={2}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Solution</label>
          <textarea value={form.solution} onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))} rows={2}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Industry</label>
          <select value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value as Industry }))}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]">
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Stage</label>
          <select value={form.stage} onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as StartupStage }))}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]">
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Room</label>
          <select value={form.roomId ?? ''} onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value || undefined }))}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]">
            <option value="">— No room —</option>
            {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Tags (comma-separated)</label>
          <input value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
            className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            placeholder="AI, B2B, SaaS" />
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold px-5 py-2 rounded-full transition-colors">
        <Save size={15} />Save
      </button>
    </div>
  );

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pitch/admin" className="text-gray-500 hover:text-[#0A66C2]"><ChevronLeft size={20} /></Link>
            <h1 className="text-xl font-bold text-gray-900">Manage Startups</h1>
          </div>
          <button
            onClick={() => { setAdding(true); setEditing(null); setForm({ ...EMPTY, pitchOrder: startups.length + 1 }); }}
            className="flex items-center gap-1.5 bg-[#0A66C2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#004182] transition-colors"
          >
            <PlusCircle size={16} />Add Startup
          </button>
        </div>

        {(adding || editing) && <FormPanel />}

        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          {startups.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0">
              <StartupAvatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500">{s.industry} · {s.stage} · Code: <span className="font-mono font-semibold">{s.accessCode}</span></p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-[#0A66C2] transition-colors p-1">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteStartup(s.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {startups.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No startups yet. Add one!</p>
          )}
        </div>
      </div>
    </PitchLayout>
  );
}

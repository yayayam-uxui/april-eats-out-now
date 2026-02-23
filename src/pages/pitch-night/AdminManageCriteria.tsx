import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, PlusCircle, X, Save, GripVertical } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import type { Criterion } from '@/types/pitchNight';

const EMPTY: Omit<Criterion, 'id'> = { label: '', description: '', icon: '⭐', maxScore: 10, order: 1 };

export default function AdminManageCriteria() {
  const { criteria, addCriterion, updateCriterion, deleteCriterion } = usePitchNight();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Criterion, 'id'>>({ ...EMPTY });

  const sorted = [...criteria].sort((a, b) => a.order - b.order);

  const handleSave = () => {
    if (adding) {
      addCriterion({ id: `crit-${Date.now()}`, ...form });
    } else if (editing) {
      updateCriterion(editing, form);
    }
    setAdding(false);
    setEditing(null);
  };

  const openEdit = (c: Criterion) => {
    setEditing(c.id);
    setAdding(false);
    setForm({ label: c.label, description: c.description, icon: c.icon, maxScore: c.maxScore, order: c.order });
  };

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pitch/admin" className="text-gray-500 hover:text-[#0A66C2]"><ChevronLeft size={20} /></Link>
            <h1 className="text-xl font-bold text-gray-900">Scoring Criteria</h1>
          </div>
          <button
            onClick={() => { setAdding(true); setEditing(null); setForm({ ...EMPTY, order: criteria.length + 1 }); }}
            className="flex items-center gap-1.5 bg-[#0A66C2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#004182] transition-colors"
          >
            <PlusCircle size={16} />Add Criterion
          </button>
        </div>

        {(adding || editing) && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{adding ? 'New Criterion' : 'Edit Criterion'}</h3>
              <button onClick={() => { setAdding(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Label *</label>
                <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Icon (emoji)</label>
                <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Max Score</label>
                <input type="number" min={1} max={100} value={form.maxScore} onChange={(e) => setForm((f) => ({ ...f, maxScore: Number(e.target.value) }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Display Order</label>
                <input type="number" min={1} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold px-5 py-2 rounded-full transition-colors">
              <Save size={15} />Save
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          {sorted.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0 hover:bg-[#F3F2EE] group">
              <GripVertical size={16} className="text-gray-300" />
              <span className="text-xl w-7">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                <p className="text-xs text-gray-500">{c.description} · Max: {c.maxScore}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-[#0A66C2] p-1 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => deleteCriterion(c.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {criteria.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No criteria defined yet.</p>
          )}
        </div>
      </div>
    </PitchLayout>
  );
}

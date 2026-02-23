import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, PlusCircle, X, Save } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';

const EMPTY = { name: '', description: '', capacity: 50 };

export default function AdminManageRooms() {
  const { rooms, addRoom, updateRoom, deleteRoom } = usePitchNight();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addRoom({ id: `room-${Date.now()}`, ...form });
    setForm({ ...EMPTY });
    setAdding(false);
  };

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pitch/admin" className="text-gray-500 hover:text-[#0A66C2]"><ChevronLeft size={20} /></Link>
            <h1 className="text-xl font-bold text-gray-900">Manage Rooms</h1>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-[#0A66C2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#004182] transition-colors"
          >
            <PlusCircle size={16} />Add Room
          </button>
        </div>

        {adding && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">New Room</h3>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Room Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" placeholder="Main Stage" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Capacity</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                  className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" placeholder="Brief description" />
            </div>
            <button onClick={handleAdd} className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold px-5 py-2 rounded-full transition-colors">
              <Save size={15} />Add Room
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          {rooms.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0 hover:bg-[#F3F2EE]">
              <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center text-[#0A66C2] font-bold text-sm shrink-0">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-500">{r.description}{r.capacity ? ` · ${r.capacity} seats` : ''}</p>
              </div>
              <button onClick={() => deleteRoom(r.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No rooms defined yet.</p>
          )}
        </div>
      </div>
    </PitchLayout>
  );
}

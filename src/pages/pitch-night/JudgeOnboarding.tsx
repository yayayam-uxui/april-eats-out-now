import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePitchNight } from '@/context/PitchNightContext';

export default function JudgeOnboarding() {
  const { currentUser, updateUser } = usePitchNight();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    headline: currentUser?.headline ?? '',
    company: currentUser?.company ?? '',
    title: currentUser?.title ?? '',
    linkedinUrl: currentUser?.linkedinUrl ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, {
      name: form.name,
      headline: form.headline || `${form.title} at ${form.company}`,
      company: form.company,
      title: form.title,
      linkedinUrl: form.linkedinUrl,
    });
    navigate('/pitch/judge');
  };

  return (
    <div className="min-h-screen bg-[#F3F2EE] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
            {(form.name || '?').charAt(0)}
          </div>
          <h1 className="text-xl font-bold text-gray-900">Complete your judge profile</h1>
          <p className="text-sm text-gray-500 mt-1">This information will be visible to startups during the event.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              placeholder="Your full name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Partner, CEO, Angel..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company *</label>
              <input
                required
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Your firm or company"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              placeholder="https://linkedin.com/in/you"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-2.5 rounded-full transition-colors mt-2"
          >
            Continue to Judge Dashboard →
          </button>
        </form>
      </div>
    </div>
  );
}

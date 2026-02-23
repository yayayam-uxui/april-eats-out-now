import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Send, Bell } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { formatDistanceToNow } from 'date-fns';

const PRESETS = [
  { label: 'Please head to the main stage', type: 'action' as const },
  { label: 'Your pitch starts in 5 minutes', type: 'warning' as const },
  { label: 'Q&A session begins now', type: 'info' as const },
  { label: 'Congratulations — you made it to the finals!', type: 'success' as const },
  { label: 'Please submit your one-pager to the organizer', type: 'action' as const },
  { label: 'Scores have been published — check your profile!', type: 'success' as const },
];

const TYPE_COLORS: Record<string, string> = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  action: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function AdminManageNotifications() {
  const { notifications, sendNotification, startups, currentUser } = usePitchNight();
  const [target, setTarget] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success' | 'action'>('info');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    sendNotification({
      targetStartupId: target,
      message: message.trim(),
      type,
      sentBy: currentUser.name,
    });
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <Link to="/pitch/admin" className="text-gray-500 hover:text-[#0A66C2] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Manage Notifications</h1>
        </div>

        {/* Compose */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Send Notification</h2>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Target</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] bg-white"
            >
              <option value="all">All startups</option>
              {startups.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Type</label>
            <div className="flex gap-2 flex-wrap">
              {(['info', 'warning', 'success', 'action'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors ${
                    type === t ? TYPE_COLORS[t] + ' border-current' : 'border-[#e0e0e0] text-gray-500 hover:bg-[#F3F2EE]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick messages</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setMessage(p.label); setType(p.type); }}
                  className="text-xs border border-[#e0e0e0] rounded-full px-3 py-1 hover:bg-[#EEF3F8] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Type your notification message…"
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {sent ? 'Sent!' : 'Send Notification'}
          </button>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0]">
            <h2 className="font-semibold text-gray-800">Notification History</h2>
          </div>
          {notifications.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              <Bell size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No notifications sent yet</p>
            </div>
          )}
          {[...notifications].reverse().map((n) => {
            const startup = startups.find((s) => s.id === n.targetStartupId);
            return (
              <div key={n.id} className={`px-5 py-3 border-b border-[#e0e0e0] last:border-b-0 ${TYPE_COLORS[n.type]} border-l-4`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.message}</p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDistanceToNow(new Date(n.sentAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-70">
                  To: {startup ? startup.name : 'All startups'} · Sent by {n.sentBy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </PitchLayout>
  );
}

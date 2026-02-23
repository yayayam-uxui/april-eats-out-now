import { Bell } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NOTIF_STYLES: Record<string, string> = {
  info: 'border-blue-300 bg-blue-50',
  warning: 'border-amber-300 bg-amber-50',
  success: 'border-green-300 bg-green-50',
  action: 'border-purple-300 bg-purple-50',
};

const NOTIF_ICONS: Record<string, string> = {
  info: 'ℹ️', warning: '⚠️', success: '✅', action: '📣',
};

export default function PitchNotifications() {
  const { notifications, markNotificationRead, currentUser, startups } = usePitchNight();

  // Filter based on role
  const relevantNotifications = notifications.filter((n) => {
    if (currentUser?.role === 'admin') return true;
    if (n.targetStartupId === 'all') return true;
    if (currentUser?.startupId) return n.targetStartupId === currentUser.startupId;
    return n.targetStartupId === 'all';
  });

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e0e0e0] flex items-center gap-2">
            <Bell size={18} className="text-[#0A66C2]" />
            <h1 className="font-bold text-gray-900 text-lg">Notifications</h1>
          </div>

          {relevantNotifications.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Bell size={36} className="mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          )}

          {[...relevantNotifications].reverse().map((n) => {
            const startup = startups.find((s) => s.id === n.targetStartupId);
            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={cn(
                  'flex items-start gap-3 px-5 py-4 border-b border-[#e0e0e0] last:border-b-0 border-l-4 cursor-pointer transition-opacity hover:opacity-90',
                  NOTIF_STYLES[n.type],
                  n.read && 'opacity-60'
                )}
              >
                <span className="text-xl shrink-0 mt-0.5">{NOTIF_ICONS[n.type]}</span>
                <div className="flex-1">
                  {startup && (
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">→ {startup.name}</p>
                  )}
                  {!startup && n.targetStartupId === 'all' && (
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">→ All Startups</p>
                  )}
                  <p className="text-sm font-medium text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.sentAt), { addSuffix: true })} · {n.sentBy}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A66C2] mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PitchLayout>
  );
}

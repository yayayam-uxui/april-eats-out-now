import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bell, Star, Edit2, Users, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NOTIF_STYLES: Record<string, string> = {
  info: 'border-blue-300 bg-blue-50 text-blue-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
  success: 'border-green-300 bg-green-50 text-green-800',
  action: 'border-purple-300 bg-purple-50 text-purple-800',
};

const NOTIF_ICONS: Record<string, string> = {
  info: 'ℹ️', warning: '⚠️', success: '✅', action: '📣',
};

export default function StartupTeamDashboard() {
  const { id } = useParams<{ id: string }>();
  const { startups, getStartupNotifications, getStartupScores, markNotificationRead, users, event, rooms, criteria } = usePitchNight();
  const navigate = useNavigate();

  const startup = startups.find((s) => s.id === id);
  if (!startup) {
    return (
      <PitchLayout>
        <div className="text-center py-24">
          <p className="text-gray-500">Startup not found</p>
          <Link to="/pitch" className="text-[#0A66C2] hover:underline text-sm block mt-2">← Back to feed</Link>
        </div>
      </PitchLayout>
    );
  }

  const notifications = getStartupNotifications(startup.id);
  const scores = getStartupScores(startup.id);
  const judges = users.filter((u) => startup.assignedJudgeIds.includes(u.id));
  const room = rooms.find((r) => r.id === startup.roomId);
  const sortedCriteria = [...criteria].sort((a, b) => a.order - b.order);

  const avgScore = scores.length
    ? (scores.reduce((sum, s) => sum + s.total, 0) / scores.length).toFixed(1)
    : null;

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header card */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#0A66C2] to-[#0073B1]" />
          <div className="px-5 -mt-10 pb-5">
            <StartupAvatar name={startup.name} size="xl" logoUrl={startup.logoUrl} className="border-4 border-white" />
            <div className="flex items-start justify-between flex-wrap gap-3 mt-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{startup.name}</h1>
                <p className="text-gray-500 text-sm">{startup.tagline}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                  {room && <span>🏛️ {room.name}</span>}
                  <span>#{startup.pitchOrder} in order</span>
                  <span>👥 {startup.followers} followers</span>
                </div>
              </div>
              <Link
                to={`/pitch/startup/${startup.id}`}
                className="flex items-center gap-1.5 text-sm text-[#0A66C2] border border-[#0A66C2] px-3 py-1.5 rounded-full hover:bg-[#EEF3F8] transition-colors font-semibold"
              >
                <Edit2 size={13} />View / Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#0A66C2]" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">No notifications yet</div>
          )}

          {[...notifications].reverse().map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'flex items-start gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0 border-l-4 cursor-pointer transition-opacity',
                NOTIF_STYLES[n.type],
                n.read && 'opacity-60'
              )}
            >
              <span className="text-lg shrink-0">{NOTIF_ICONS[n.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.message}</p>
                <p className="text-xs opacity-70 mt-0.5">
                  {formatDistanceToNow(new Date(n.sentAt), { addSuffix: true })} · {n.sentBy}
                </p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-current mt-1 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Scores */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-2">
            <Star size={16} className="text-amber-500" />
            <h2 className="font-bold text-gray-900">Judge Scores</h2>
            {!event.scoresPublished && (
              <span className="text-xs text-gray-400 font-normal ml-1">(not yet published)</span>
            )}
          </div>

          {!event.scoresPublished ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              <Star size={28} className="mx-auto mb-2 opacity-30" />
              <p>Scores will be visible once the organizer publishes results.</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No scores submitted yet.</div>
          ) : (
            <>
              {/* Average score banner */}
              {avgScore && (
                <div className="mx-4 my-4 bg-[#EEF3F8] rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-[#0A66C2]">{avgScore}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Average score out of 10</p>
                  <p className="text-xs text-gray-400">{scores.length} judge{scores.length !== 1 ? 's' : ''} have scored you</p>
                </div>
              )}

              {/* Per-judge scores */}
              {scores.map((score) => {
                const judge = judges.find((j) => j.id === score.judgeId);
                return (
                  <div key={score.id} className="px-4 py-3 border-b border-[#e0e0e0] last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {score.judgeName.charAt(0)}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{score.judgeName}</p>
                        {judge?.headline && <p className="text-xs text-gray-400 hidden sm:block">· {judge.headline}</p>}
                      </div>
                      <span className="text-base font-bold text-[#0A66C2]">{score.total.toFixed(1)}/10</span>
                    </div>

                    {/* Criteria breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {sortedCriteria.map((c) => (
                        score.scores[c.id] !== undefined && (
                          <div key={c.id} className="bg-[#F3F2EE] rounded-lg px-2 py-1.5 flex items-center justify-between">
                            <span className="text-xs text-gray-600">{c.icon} {c.label}</span>
                            <span className="text-xs font-bold text-gray-800">{score.scores[c.id]}</span>
                          </div>
                        )
                      ))}
                    </div>

                    {score.comment && (
                      <div className="mt-2 bg-[#F3F2EE] rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500 italic">"{score.comment}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Judges assigned */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users size={16} className="text-[#0A66C2]" />Your Judges
          </h2>
          {judges.length === 0 && <p className="text-sm text-gray-400">No judges assigned yet.</p>}
          <div className="space-y-2">
            {judges.map((j) => {
              const hasScored = scores.some((s) => s.judgeId === j.id);
              return (
                <div key={j.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    {j.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{j.name}</p>
                    <p className="text-xs text-gray-400">{j.headline ?? j.title}</p>
                  </div>
                  {hasScored && (
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                  )}
                  <button
                    onClick={() => navigate(`/pitch/messages?with=${j.id}`)}
                    className="text-gray-400 hover:text-[#0A66C2] transition-colors p-1"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PitchLayout>
  );
}

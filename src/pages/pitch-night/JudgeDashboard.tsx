import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Star, ArrowRight, User } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import { cn } from '@/lib/utils';

export default function JudgeDashboard() {
  const { currentUser, startups, getJudgeScore, event, rooms } = usePitchNight();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'judge') {
    navigate('/pitch/login');
    return null;
  }

  const assignedStartups = startups
    .filter((s) => s.assignedJudgeIds.includes(currentUser.id))
    .sort((a, b) => a.pitchOrder - b.pitchOrder);

  const scoredCount = assignedStartups.filter((s) => getJudgeScore(s.id, currentUser.id)).length;
  const progress = assignedStartups.length ? Math.round((scoredCount / assignedStartups.length) * 100) : 0;

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Judge profile card */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-[#0A66C2] to-[#7B1EA2]" />
          <div className="px-5 -mt-8 pb-5">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl border-4 border-white mb-2">
              {currentUser.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">{currentUser.headline ?? `${currentUser.title} · ${currentUser.company}`}</p>
            <Link to="/pitch/judge/onboarding" className="text-xs text-[#0A66C2] hover:underline mt-1 block">
              Edit profile
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Scoring Progress</h3>
            <span className="text-sm font-semibold text-[#0A66C2]">{scoredCount}/{assignedStartups.length} scored</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#0A66C2] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}% complete</p>
        </div>

        {/* Assigned startups */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e0e0e0]">
            <h3 className="font-bold text-gray-900">Startups to Judge</h3>
            <p className="text-xs text-gray-500 mt-0.5">Tap a startup to submit your scores</p>
          </div>

          {assignedStartups.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <User size={32} className="mx-auto mb-2 opacity-40" />
              <p>No startups assigned to you yet.</p>
            </div>
          )}

          {assignedStartups.map((startup) => {
            const score = getJudgeScore(startup.id, currentUser.id);
            const room = rooms.find((r) => r.id === startup.roomId);
            return (
              <div
                key={startup.id}
                className="flex items-center gap-3 px-5 py-4 border-b border-[#e0e0e0] last:border-b-0 hover:bg-[#F3F2EE] transition-colors cursor-pointer"
                onClick={() => navigate(`/pitch/judge/score/${startup.id}`)}
              >
                {/* Score status */}
                {score ? (
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={20} className="text-gray-300 shrink-0" />
                )}

                <StartupAvatar name={startup.name} size="sm" logoUrl={startup.logoUrl} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{startup.name}</p>
                  <p className="text-xs text-gray-500 truncate">{startup.tagline}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">#{startup.pitchOrder}</span>
                    {room && <span className="text-[10px] text-gray-400">{room.name}</span>}
                    <span className="text-[10px] text-gray-400">{startup.industry}</span>
                  </div>
                </div>

                {score ? (
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.round(score.total / 2) ? 'fill-amber-400' : 'opacity-30'} />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-[#0A66C2] mt-0.5">{score.total.toFixed(1)}/10</p>
                    <p className="text-[10px] text-gray-400">Edit score</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[#0A66C2] shrink-0">
                    <span className="text-xs font-semibold">Score</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* All startups browse */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Want to see all pitching startups?</p>
          <Link
            to="/pitch/network"
            className="text-[#0A66C2] text-sm font-semibold hover:underline"
          >
            Browse all startups →
          </Link>
        </div>
      </div>
    </PitchLayout>
  );
}

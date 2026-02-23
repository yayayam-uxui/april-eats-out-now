import { Link } from 'react-router-dom';
import { Trophy, Award, Star, TrendingUp, BarChart2 } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';

const MEDALS = ['🥇', '🥈', '🥉'];

const RANK_STYLES = [
  'border-amber-300 bg-amber-50',
  'border-gray-300 bg-gray-50',
  'border-orange-300 bg-orange-50',
];

export default function Leaderboard() {
  const { getLeaderboard, criteria, scores, event, startups } = usePitchNight();
  const leaderboard = getLeaderboard();
  const sortedCriteria = [...criteria].sort((a, b) => a.order - b.order);

  // Total possible scores
  const maxPossibleJudges = [...new Set(scores.map((s) => s.judgeId))].length;

  return (
    <PitchLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A66C2] to-[#7B1EA2] rounded-xl p-6 text-white text-center">
          <Trophy size={36} className="mx-auto mb-2 opacity-90" />
          <h1 className="text-2xl font-bold">Live Leaderboard</h1>
          <p className="text-white/70 mt-1">{event.name} · {event.subtitle}</p>
          {!event.scoresPublished && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              Scores are not yet published to startups
            </div>
          )}
        </div>

        {/* Top 3 podium */}
        {leaderboard.filter((item) => item.avgScore > 0).length >= 3 && (
          <div className="flex items-end justify-center gap-4 px-4">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <StartupAvatar name={leaderboard[1].startup.name} size="md" />
              <p className="text-xs font-semibold text-gray-700 text-center line-clamp-1">{leaderboard[1].startup.name}</p>
              <div className="text-lg font-bold text-gray-400">🥈</div>
              <div className="w-full bg-gray-200 rounded-t-lg h-16 flex items-end justify-center pb-2">
                <span className="text-sm font-bold text-gray-600">{leaderboard[1].avgScore.toFixed(1)}</span>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <StartupAvatar name={leaderboard[0].startup.name} size="lg" />
              <p className="text-sm font-bold text-gray-800 text-center line-clamp-1">{leaderboard[0].startup.name}</p>
              <div className="text-2xl">🥇</div>
              <div className="w-full bg-[#0A66C2] rounded-t-lg h-24 flex items-end justify-center pb-2">
                <span className="text-base font-bold text-white">{leaderboard[0].avgScore.toFixed(1)}</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <StartupAvatar name={leaderboard[2].startup.name} size="md" />
              <p className="text-xs font-semibold text-gray-700 text-center line-clamp-1">{leaderboard[2].startup.name}</p>
              <div className="text-lg font-bold text-orange-400">🥉</div>
              <div className="w-full bg-orange-200 rounded-t-lg h-10 flex items-end justify-center pb-2">
                <span className="text-sm font-bold text-orange-700">{leaderboard[2].avgScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] flex items-center gap-2">
            <BarChart2 size={16} className="text-[#0A66C2]" />
            <h2 className="font-bold text-gray-900">Full Rankings</h2>
          </div>

          {leaderboard.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Trophy size={40} className="mx-auto mb-3 opacity-20" />
              <p>No scores have been submitted yet.</p>
            </div>
          )}

          {leaderboard.map((item, idx) => {
            const startupScores = scores.filter((s) => s.startupId === item.startup.id);
            const criteriaAverages = sortedCriteria.map((c) => {
              const vals = startupScores.map((s) => s.scores[c.id] ?? 0).filter((v) => v > 0);
              return {
                ...c,
                avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null,
              };
            });

            return (
              <div
                key={item.startup.id}
                className={`border-b border-[#e0e0e0] last:border-b-0 ${idx < 3 ? RANK_STYLES[idx] + ' border-l-4' : ''}`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {idx < 3 ? (
                      <span className="text-xl">{MEDALS[idx]}</span>
                    ) : (
                      <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
                    )}
                  </div>

                  <StartupAvatar name={item.startup.name} size="sm" logoUrl={item.startup.logoUrl} />

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/pitch/startup/${item.startup.id}`}
                      className="text-sm font-bold text-gray-900 hover:text-[#0A66C2] hover:underline transition-colors"
                    >
                      {item.startup.name}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">{item.startup.industry} · {item.startup.stage}</p>

                    {/* Per-criterion scores */}
                    {item.judgesCount > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        {criteriaAverages.map((ca) => (
                          ca.avg !== null && (
                            <span key={ca.id} className="text-[10px] text-gray-400">
                              {ca.icon} {ca.avg.toFixed(1)}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    {item.avgScore > 0 ? (
                      <>
                        <p className="text-xl font-bold text-[#0A66C2]">{item.avgScore.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">{item.judgesCount} judge{item.judgesCount !== 1 ? 's' : ''}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-300 font-medium">Not scored</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Criteria legend */}
        {sortedCriteria.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Scoring Criteria</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sortedCriteria.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <span className="text-base">{c.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{c.label}</p>
                    <p className="text-[10px] text-gray-400">Max {c.maxScore} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PitchLayout>
  );
}

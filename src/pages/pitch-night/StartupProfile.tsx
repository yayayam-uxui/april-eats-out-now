import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Globe, Linkedin, TrendingUp, Tag, MessageSquare, UserPlus, Check, Lightbulb, Zap } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import { StartupCard } from '@/components/pitch-night/StartupCard';
import { cn } from '@/lib/utils';

const STAGE_COLORS: Record<string, string> = {
  Idea: 'bg-gray-100 text-gray-700',
  MVP: 'bg-blue-100 text-blue-700',
  'Pre-Seed': 'bg-purple-100 text-purple-700',
  Seed: 'bg-green-100 text-green-700',
  'Series A': 'bg-amber-100 text-amber-700',
};

export default function StartupProfile() {
  const { id } = useParams<{ id: string }>();
  const { startups, currentUser, users, event, scores, rooms, isConnected, sendConnectionRequest, followStartup, unfollowStartup } = usePitchNight();
  const navigate = useNavigate();

  const startup = startups.find((s) => s.id === id);
  if (!startup) {
    return (
      <PitchLayout>
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg">Startup not found</p>
          <Link to="/pitch" className="text-[#0A66C2] hover:underline text-sm mt-2 block">← Back to feed</Link>
        </div>
      </PitchLayout>
    );
  }

  const room = rooms.find((r) => r.id === startup.roomId);
  const judges = users.filter((u) => startup.assignedJudgeIds.includes(u.id));
  const startupScores = scores.filter((s) => s.startupId === startup.id);
  const avgScore = startupScores.length
    ? (startupScores.reduce((sum, s) => sum + s.total, 0) / startupScores.length).toFixed(1)
    : null;

  const isFollowing = currentUser?.followedStartups.includes(startup.id) ?? false;
  const alreadyConnected = currentUser ? isConnected(currentUser.id, startup.id) : false;
  const hasSentRequest = currentUser?.sentConnections.includes(startup.id) ?? false;
  const isOwnStartup = currentUser?.startupId === startup.id || currentUser?.role === 'admin';

  const connectedStartups = startups.filter((s) => startup.connections.includes(s.id) && s.id !== startup.id);

  const handleFollow = () => {
    if (!currentUser) { navigate('/pitch/login'); return; }
    if (isFollowing) unfollowStartup(currentUser.id, startup.id);
    else followStartup(currentUser.id, startup.id);
  };

  const handleConnect = () => {
    if (!currentUser) { navigate('/pitch/login'); return; }
    if (!alreadyConnected && !hasSentRequest) sendConnectionRequest(currentUser.id, startup.id);
  };

  const handleMessage = () => {
    if (!currentUser) { navigate('/pitch/login'); return; }
    navigate(`/pitch/messages?with=${startup.id}`);
  };

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-[#0A66C2] to-[#0073B1] relative">
            {startup.coverUrl && (
              <img src={startup.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="bg-white/90 text-[#0A66C2] text-xs font-bold px-2 py-0.5 rounded-full">
                Pitch #{startup.pitchOrder}
              </span>
              {room && (
                <span className="bg-white/90 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {room.name}
                </span>
              )}
            </div>
          </div>

          {/* Avatar overlapping */}
          <div className="px-6 -mt-10">
            <StartupAvatar name={startup.name} size="xl" logoUrl={startup.logoUrl} className="border-4 border-white" />
          </div>

          {/* Main info */}
          <div className="px-6 pt-3 pb-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
                <p className="text-gray-600 mt-0.5">{startup.tagline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin size={13} />{startup.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={13} />{startup.teamSize} employees</span>
                  {startup.traction && (
                    <span className="flex items-center gap-1.5 text-green-700 font-medium"><TrendingUp size={13} />{startup.traction}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STAGE_COLORS[startup.stage])}>
                    {startup.stage}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF3F8] text-[#0A66C2]">
                    {startup.industry}
                  </span>
                  {startup.askAmount && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                      Raising {startup.askAmount}
                    </span>
                  )}
                </div>
                {/* Connections & followers */}
                <p className="text-xs text-gray-400 mt-2">
                  {startup.followers} followers · Founded {startup.founded} · {startup.teamSize}-person team
                </p>
              </div>

              {/* Score (if published) */}
              {event.scoresPublished && avgScore && (
                <div className="text-center bg-[#EEF3F8] rounded-xl px-5 py-3">
                  <p className="text-3xl font-bold text-[#0A66C2]">{avgScore}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Avg. Score / 10</p>
                  <p className="text-xs text-gray-400">{startupScores.length} judge{startupScores.length !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>

            {/* External links */}
            <div className="flex flex-wrap gap-2 mt-3">
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#0A66C2] hover:underline">
                  <Globe size={13} />Website
                </a>
              )}
              {startup.linkedinUrl && (
                <a href={startup.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#0A66C2] hover:underline">
                  <Linkedin size={13} />LinkedIn
                </a>
              )}
            </div>

            {/* Actions */}
            {!isOwnStartup && (
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={handleConnect}
                  disabled={alreadyConnected || hasSentRequest}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors',
                    alreadyConnected
                      ? 'border-gray-300 text-gray-400 cursor-default'
                      : hasSentRequest
                      ? 'border-gray-300 text-gray-500 cursor-default'
                      : 'bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#004182]'
                  )}
                >
                  {alreadyConnected ? <Check size={14} /> : <UserPlus size={14} />}
                  {alreadyConnected ? 'Connected' : hasSentRequest ? 'Pending' : 'Connect'}
                </button>
                <button
                  onClick={handleFollow}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors',
                    isFollowing
                      ? 'border-gray-400 text-gray-600 hover:border-red-400 hover:text-red-500'
                      : 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#EEF3F8]'
                  )}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  onClick={handleMessage}
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-[#F3F2EE] transition-colors"
                >
                  <MessageSquare size={14} />Message
                </button>
              </div>
            )}
            {isOwnStartup && currentUser?.role !== 'admin' && (
              <Link
                to={`/pitch/startup/${startup.id}/edit`}
                className="mt-4 inline-block text-sm font-semibold px-4 py-1.5 rounded-full border border-[#0A66C2] text-[#0A66C2] hover:bg-[#EEF3F8] transition-colors"
              >
                Edit profile
              </Link>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{startup.description}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-red-700 font-semibold text-xs mb-1">
                <Lightbulb size={13} />THE PROBLEM
              </div>
              <p className="text-sm text-gray-700">{startup.problem}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-green-700 font-semibold text-xs mb-1">
                <Zap size={13} />THE SOLUTION
              </div>
              <p className="text-sm text-gray-700">{startup.solution}</p>
            </div>
            {startup.traction && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs mb-1">
                  <TrendingUp size={13} />TRACTION
                </div>
                <p className="text-sm text-gray-700">{startup.traction}</p>
              </div>
            )}
          </div>
        </div>

        {/* Founder */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Founder</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold">
              {startup.founder.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{startup.founder}</p>
              <p className="text-sm text-gray-500">{startup.founderTitle} at {startup.name}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {startup.tags.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {startup.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-sm text-gray-600 bg-[#EEF3F8] px-3 py-1 rounded-full">
                  <Tag size={11} />#{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Judges */}
        {judges.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Judges Assigned</h2>
            <div className="space-y-3">
              {judges.map((judge) => {
                const judgeScore = scores.find((s) => s.startupId === startup.id && s.judgeId === judge.id);
                return (
                  <div key={judge.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                      {judge.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{judge.name}</p>
                      <p className="text-xs text-gray-500">{judge.headline ?? judge.title}</p>
                    </div>
                    {event.scoresPublished && judgeScore && (
                      <span className="text-sm font-bold text-[#0A66C2] bg-[#EEF3F8] px-2 py-1 rounded-lg">
                        {judgeScore.total.toFixed(1)}/10
                      </span>
                    )}
                    {judgeScore && !event.scoresPublished && (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Scored</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Network connections */}
        {connectedStartups.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Connected Startups</h2>
            <div className="space-y-1">
              {connectedStartups.map((s) => (
                <StartupCard key={s.id} startup={s} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </PitchLayout>
  );
}

import { Link } from 'react-router-dom';
import { MapPin, Users, TrendingUp, Tag } from 'lucide-react';
import type { Startup } from '@/types/pitchNight';
import { usePitchNight } from '@/context/PitchNightContext';
import { StartupAvatar } from './StartupAvatar';
import { cn } from '@/lib/utils';

const STAGE_COLORS: Record<string, string> = {
  Idea: 'bg-gray-100 text-gray-700',
  MVP: 'bg-blue-100 text-blue-700',
  'Pre-Seed': 'bg-purple-100 text-purple-700',
  Seed: 'bg-green-100 text-green-700',
  'Series A': 'bg-amber-100 text-amber-700',
};

interface StartupCardProps {
  startup: Startup;
  compact?: boolean;
}

export function StartupCard({ startup, compact = false }: StartupCardProps) {
  const { currentUser, followStartup, unfollowStartup, sendConnectionRequest, isConnected, startups } = usePitchNight();

  const isFollowing = currentUser?.followedStartups.includes(startup.id) ?? false;
  const alreadyConnected = currentUser ? isConnected(currentUser.id, startup.id) : false;
  const hasSentRequest = currentUser?.sentConnections.includes(startup.id) ?? false;

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (isFollowing) unfollowStartup(currentUser.id, startup.id);
    else followStartup(currentUser.id, startup.id);
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser || alreadyConnected || hasSentRequest) return;
    sendConnectionRequest(currentUser.id, startup.id);
  };

  if (compact) {
    return (
      <Link
        to={`/pitch/startup/${startup.id}`}
        className="flex items-center gap-3 p-3 hover:bg-[#F3F2EE] rounded-lg transition-colors group"
      >
        <StartupAvatar name={startup.name} size="sm" logoUrl={startup.logoUrl} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#0A66C2] transition-colors">{startup.name}</p>
          <p className="text-xs text-gray-500 truncate">{startup.tagline}</p>
        </div>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', STAGE_COLORS[startup.stage] ?? 'bg-gray-100 text-gray-700')}>
          {startup.stage}
        </span>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-[#0A66C2] to-[#0073B1] relative">
        {startup.coverUrl && (
          <img src={startup.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Pitch order badge */}
        <div className="absolute top-2 right-2 bg-white/90 text-[#0A66C2] text-xs font-bold px-2 py-0.5 rounded-full">
          #{startup.pitchOrder}
        </div>
      </div>

      {/* Avatar — overlapping the cover */}
      <div className="px-4 -mt-6 mb-1">
        <StartupAvatar name={startup.name} size="lg" logoUrl={startup.logoUrl} className="border-4 border-white" />
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <Link to={`/pitch/startup/${startup.id}`} className="hover:underline">
          <h3 className="text-base font-bold text-gray-900 leading-tight">{startup.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{startup.tagline}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><MapPin size={11} />{startup.location}</span>
          <span className="flex items-center gap-1"><Users size={11} />{startup.teamSize} people</span>
          {startup.traction && (
            <span className="flex items-center gap-1 text-green-700 font-medium"><TrendingUp size={11} />{startup.traction}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STAGE_COLORS[startup.stage] ?? 'bg-gray-100 text-gray-700')}>
            {startup.stage}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#EEF3F8] text-[#0A66C2]">
            {startup.industry}
          </span>
          {startup.askAmount && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Raising {startup.askAmount}
            </span>
          )}
        </div>

        {/* Tags */}
        {startup.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {startup.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[11px] text-gray-500 flex items-center gap-0.5">
                <Tag size={9} />#{tag}
              </span>
            ))}
          </div>
        )}

        {/* Follower count */}
        <p className="text-xs text-gray-400 mt-2">{startup.followers} followers</p>

        {/* Actions */}
        {currentUser && currentUser.startupId !== startup.id && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#e0e0e0]">
            <button
              onClick={handleFollow}
              className={cn(
                'flex-1 text-sm font-semibold py-1.5 rounded-full border transition-colors',
                isFollowing
                  ? 'border-gray-400 text-gray-600 hover:border-red-400 hover:text-red-600'
                  : 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#EEF3F8]'
              )}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {currentUser.role !== 'admin' && (
              <button
                onClick={handleConnect}
                disabled={alreadyConnected || hasSentRequest}
                className={cn(
                  'flex-1 text-sm font-semibold py-1.5 rounded-full border transition-colors',
                  alreadyConnected
                    ? 'border-gray-300 text-gray-400 cursor-default'
                    : hasSentRequest
                    ? 'border-gray-300 text-gray-500 cursor-default'
                    : 'bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#004182]'
                )}
              >
                {alreadyConnected ? 'Connected' : hasSentRequest ? 'Pending' : 'Connect'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

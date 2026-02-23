import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Bell, Search } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupCard } from '@/components/pitch-night/StartupCard';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';

type Tab = 'startups' | 'people' | 'requests';

export default function PitchNetwork() {
  const { startups, users, currentUser, getPendingRequests, acceptConnection, declineConnection, isConnected } = usePitchNight();
  const [tab, setTab] = useState<Tab>('startups');
  const [search, setSearch] = useState('');

  const pendingRequests = currentUser ? getPendingRequests(currentUser.id) : [];
  const allPeople = users.filter((u) => u.id !== currentUser?.id);

  const filteredStartups = startups.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.tagline.toLowerCase().includes(search.toLowerCase()) ||
    s.industry.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPeople = allPeople.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'startups', label: 'Startups', count: startups.length },
    { id: 'people', label: 'People', count: allPeople.length },
    { id: 'requests', label: 'Requests', count: pendingRequests.length },
  ];

  return (
    <PitchLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">My Network</h1>

          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F3F2EE] rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search startups or people..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e0e0e0] mt-3 -mx-4 px-4">
            {tabs.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 pb-2.5 text-sm font-semibold mr-6 border-b-2 transition-colors ${
                  tab === id ? 'text-[#0A66C2] border-[#0A66C2]' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className="bg-[#EEF3F8] text-[#0A66C2] text-xs font-bold px-1.5 py-0.5 rounded-full">{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Startups tab */}
        {tab === 'startups' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStartups.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))}
            {filteredStartups.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-400">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>No startups found</p>
              </div>
            )}
          </div>
        )}

        {/* People tab */}
        {tab === 'people' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            {filteredPeople.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>No people found</p>
              </div>
            )}
            {filteredPeople.map((person) => {
              const connected = currentUser ? isConnected(currentUser.id, person.id) : false;
              return (
                <div key={person.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0 hover:bg-[#F3F2EE] transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    person.role === 'judge' ? 'bg-purple-500' : person.role === 'admin' ? 'bg-red-500' : 'bg-[#0A66C2]'
                  }`}>
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500 truncate">{person.headline ?? person.role}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      person.role === 'judge' ? 'bg-purple-100 text-purple-700' :
                      person.role === 'admin' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {person.role}
                    </span>
                  </div>
                  {connected && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <UserCheck size={14} />Connected
                    </span>
                  )}
                  {person.linkedinUrl && (
                    <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#0A66C2] hover:underline shrink-0">
                      LinkedIn
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Requests tab */}
        {tab === 'requests' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            {pendingRequests.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p>No pending connection requests</p>
              </div>
            )}
            {pendingRequests.map((req) => {
              const fromUser = users.find((u) => u.id === req.fromId);
              const fromStartup = startups.find((s) => s.id === req.fromId);
              const name = fromUser?.name ?? fromStartup?.name ?? req.fromId;
              return (
                <div key={req.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#e0e0e0] last:border-b-0">
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">wants to connect</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptConnection(req.id)}
                      className="text-sm font-semibold bg-[#0A66C2] text-white px-4 py-1.5 rounded-full hover:bg-[#004182] transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineConnection(req.id)}
                      className="text-sm font-semibold border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full hover:bg-[#F3F2EE] transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PitchLayout>
  );
}

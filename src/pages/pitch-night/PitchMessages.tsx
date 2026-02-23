import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, MessageSquare } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PitchMessages() {
  const { currentUser, users, startups, sendMessage, getConversation, messages } = usePitchNight();
  const [searchParams] = useSearchParams();
  const withId = searchParams.get('with');

  const [activeConvId, setActiveConvId] = useState<string | null>(withId);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // All people we can message
  const allPeople = [
    ...users.filter((u) => u.id !== currentUser?.id).map((u) => ({ id: u.id, name: u.name, sub: u.headline ?? u.role })),
    ...startups.map((s) => ({ id: s.id, name: s.name, sub: s.tagline })),
  ];

  // People we've already messaged
  const conversationPartners = allPeople.filter((p) => {
    if (!currentUser) return false;
    return messages.some(
      (m) => (m.senderId === currentUser.id && m.receiverId === p.id) ||
             (m.senderId === p.id && m.receiverId === currentUser.id)
    );
  });

  // Show the selected person or fallback to first conversation
  const displayList = conversationPartners.length > 0 ? conversationPartners : [];

  const activePerson = allPeople.find((p) => p.id === activeConvId);
  const conversation = currentUser && activeConvId ? getConversation(currentUser.id, activeConvId) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.length]);

  const handleSend = () => {
    if (!text.trim() || !currentUser || !activeConvId) return;
    sendMessage(currentUser.id, activeConvId, text.trim());
    setText('');
  };

  if (!currentUser) {
    return (
      <PitchLayout>
        <div className="text-center py-24 text-gray-400">
          <p>Please <Link to="/pitch/login" className="text-[#0A66C2] hover:underline">sign in</Link> to view messages.</p>
        </div>
      </PitchLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F2EE]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm h-14 flex items-center px-4">
        <Link to="/pitch" className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-[#0A66C2] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">PN</span>
          </div>
        </Link>
        <h1 className="font-bold text-gray-900 ml-4">Messages</h1>
      </div>

      <div className="pt-14 max-w-5xl mx-auto h-[calc(100vh-56px)] flex">
        {/* Sidebar */}
        <div className="w-72 shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col">
          <div className="p-3 border-b border-[#e0e0e0]">
            <h2 className="font-semibold text-gray-800 mb-2 text-sm px-1">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {allPeople.map((p) => {
              const msgs = getConversation(currentUser.id, p.id);
              const lastMsg = msgs[msgs.length - 1];
              if (!lastMsg && p.id !== activeConvId && !withId) return null;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveConvId(p.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F3F2EE] transition-colors text-left',
                    activeConvId === p.id && 'bg-[#EEF3F8]'
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    {lastMsg ? (
                      <p className="text-xs text-gray-400 truncate">{lastMsg.content}</p>
                    ) : (
                      <p className="text-xs text-gray-400 truncate">{p.sub}</p>
                    )}
                  </div>
                </button>
              );
            })}

            {/* New conversation - show all people */}
            <div className="px-3 py-2 border-t border-[#e0e0e0] mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Start new conversation</p>
              {allPeople.filter((p) => {
                const msgs = getConversation(currentUser.id, p.id);
                return msgs.length === 0 && p.id !== activeConvId;
              }).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveConvId(p.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 hover:bg-[#F3F2EE] rounded-lg text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <p className="text-xs text-gray-700 truncate">{p.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat panel */}
        {activeConvId && activePerson ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#e0e0e0] shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm">
                {activePerson.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{activePerson.name}</p>
                <p className="text-xs text-gray-400 truncate">{activePerson.sub}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F3F2EE]">
              {conversation.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-12">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Start a conversation with {activePerson.name}</p>
                </div>
              )}
              {conversation.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={cn('flex', isMine && 'justify-end')}>
                    <div className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2',
                      isMine ? 'bg-[#0A66C2] text-white' : 'bg-white text-gray-800 border border-[#e0e0e0]'
                    )}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn('text-[10px] mt-1', isMine ? 'text-white/60' : 'text-gray-400')}>
                        {formatDistanceToNow(new Date(msg.sentAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-[#e0e0e0]">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Message ${activePerson.name}…`}
                className="flex-1 bg-[#F3F2EE] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A66C2] transition-shadow"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:bg-[#004182] transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#F3F2EE]">
            <div className="text-center text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Send, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupCard } from '@/components/pitch-night/StartupCard';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import type { FeedPost } from '@/types/pitchNight';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post }: { post: FeedPost }) {
  const { currentUser, likePost, addComment } = usePitchNight();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) return;
    likePost(post.id);
    setLiked(true);
  };

  const handleComment = () => {
    if (!commentText.trim() || !currentUser) return;
    addComment(post.id, currentUser.id, currentUser.name, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {post.authorName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{post.authorName}</p>
          {post.authorHeadline && (
            <p className="text-xs text-gray-500 truncate">{post.authorHeadline}</p>
          )}
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
        {post.startupId && (
          <Link
            to={`/pitch/startup/${post.startupId}`}
            className="mt-2 block border border-[#e0e0e0] rounded-lg p-3 hover:bg-[#F3F2EE] transition-colors"
          >
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pitching tonight</p>
            <p className="text-sm font-semibold text-[#0A66C2] mt-0.5">View startup profile →</p>
          </Link>
        )}
      </div>

      {/* Stats */}
      {(post.likes > 0 || post.comments.length > 0) && (
        <div className="px-4 pb-2 flex items-center gap-2 text-xs text-gray-500">
          {post.likes > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[9px]">👍</span>
              {post.likes}
            </span>
          )}
          {post.comments.length > 0 && (
            <button
              onClick={() => setShowComments((v) => !v)}
              className="ml-auto hover:text-[#0A66C2] hover:underline"
            >
              {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="border-t border-[#e0e0e0] px-2 py-1 flex">
        {[
          { icon: ThumbsUp, label: liked ? 'Liked' : 'Like', action: handleLike, active: liked },
          { icon: MessageCircle, label: 'Comment', action: () => setShowComments((v) => !v), active: false },
          { icon: Send, label: 'Share', action: () => {}, active: false },
        ].map(({ icon: Icon, label, action, active }) => (
          <button
            key={label}
            onClick={action}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              active ? 'text-[#0A66C2]' : 'text-gray-500 hover:bg-[#F3F2EE] hover:text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-[#e0e0e0] px-4 py-3 space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                {c.authorName.charAt(0)}
              </div>
              <div className="bg-[#F3F2EE] rounded-2xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-gray-800">{c.authorName}</p>
                <p className="text-xs text-gray-700 mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <div className="flex gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#F3F2EE] rounded-full px-3 py-1.5">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Add a comment…"
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
                />
                <button onClick={handleComment} disabled={!commentText.trim()} className="text-[#0A66C2] disabled:opacity-40">
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventBanner() {
  const { event } = usePitchNight();
  return (
    <div className="bg-gradient-to-r from-[#0A66C2] to-[#0073B1] rounded-xl p-4 text-white mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          LIVE
        </span>
        <span className="text-white/70 text-xs">{event.date}</span>
      </div>
      <h2 className="text-xl font-bold">{event.name} · {event.subtitle}</h2>
      <p className="text-white/80 text-sm mt-1">{event.venue}</p>
      <Link
        to="/pitch/leaderboard"
        className="mt-3 inline-block bg-white text-[#0A66C2] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#EEF3F8] transition-colors"
      >
        View Live Leaderboard →
      </Link>
    </div>
  );
}

export default function PitchHome() {
  const { feed, startups, currentUser } = usePitchNight();
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const { addPost } = usePitchNight();

  const handlePost = () => {
    if (!postText.trim() || !currentUser) return;
    addPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHeadline: currentUser.headline,
      content: postText.trim(),
      type: 'update',
    });
    setPostText('');
  };

  const topStartups = [...startups].sort((a, b) => b.followers - a.followers).slice(0, 4);

  const RightSidebar = (
    <div className="space-y-4">
      {/* Startups to follow */}
      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e0e0e0]">
          <h3 className="text-sm font-bold text-gray-900">Pitching Tonight</h3>
        </div>
        {topStartups.map((s) => (
          <StartupCard key={s.id} startup={s} compact />
        ))}
        <Link
          to="/pitch/network"
          className="block text-center text-xs text-[#0A66C2] font-semibold py-3 hover:bg-[#EEF3F8] transition-colors"
        >
          See all startups →
        </Link>
      </div>

      {/* Event info */}
      <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-700 text-sm mb-2">Event Info</p>
        <p>📍 Pitch Night Spring 2026</p>
        <p>🏛️ Google Campus TLV</p>
        <p>📅 February 22, 2026</p>
        <p>👥 5 startups · 3 judges</p>
      </div>
    </div>
  );

  return (
    <PitchLayout rightSidebar={RightSidebar}>
      <div className="space-y-4">
        <EventBanner />

        {/* Create post */}
        {currentUser && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-4">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <button
                onClick={() => document.getElementById('post-input')?.focus()}
                className="flex-1 text-left text-sm text-gray-500 border border-[#e0e0e0] rounded-full px-4 py-2 hover:bg-[#F3F2EE] hover:border-gray-400 transition-colors"
              >
                Share an update…
              </button>
            </div>
            <textarea
              id="post-input"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              rows={postText ? 3 : 0}
              className={`w-full mt-3 text-sm border-none outline-none resize-none text-gray-800 placeholder:text-gray-400 transition-all ${postText ? 'block' : 'hidden'}`}
            />
            {postText && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePost}
                  disabled={!postText.trim()}
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feed */}
        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {feed.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">Be the first to share something!</p>
          </div>
        )}
      </div>
    </PitchLayout>
  );
}

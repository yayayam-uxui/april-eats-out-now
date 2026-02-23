import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { usePitchNight } from '@/context/PitchNightContext';
import { PitchLayout } from '@/components/pitch-night/PitchLayout';
import { StartupAvatar } from '@/components/pitch-night/StartupAvatar';
import { cn } from '@/lib/utils';

function ScoreSlider({
  criterion,
  value,
  onChange,
}: {
  criterion: { id: string; label: string; description: string; icon: string; maxScore: number };
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-[#F3F2EE] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{criterion.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{criterion.label}</p>
            <p className="text-xs text-gray-500">{criterion.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#0A66C2]">{value}</span>
          <span className="text-sm text-gray-400">/{criterion.maxScore}</span>
        </div>
      </div>

      {/* Score buttons */}
      <div className="flex gap-1 mt-3 flex-wrap">
        {Array.from({ length: criterion.maxScore }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 min-w-[28px] h-9 rounded-lg text-sm font-bold transition-all',
              n <= value
                ? 'bg-[#0A66C2] text-white shadow-sm'
                : 'bg-white text-gray-400 border border-[#e0e0e0] hover:border-[#0A66C2] hover:text-[#0A66C2]'
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Qualitative labels */}
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
        <span>Weak</span>
        <span>Average</span>
        <span>Outstanding</span>
      </div>
    </div>
  );
}

export default function ScoreStartup() {
  const { id } = useParams<{ id: string }>();
  const { startups, criteria, currentUser, submitScore, getJudgeScore } = usePitchNight();
  const navigate = useNavigate();

  const startup = startups.find((s) => s.id === id);
  const existingScore = currentUser && id ? getJudgeScore(id, currentUser.id) : undefined;

  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (existingScore) return { ...existingScore.scores };
    return Object.fromEntries(criteria.map((c) => [c.id, 5]));
  });
  const [comment, setComment] = useState(existingScore?.comment ?? '');
  const [submitted, setSubmitted] = useState(false);

  const sortedCriteria = [...criteria].sort((a, b) => a.order - b.order);
  const total = sortedCriteria.length
    ? sortedCriteria.reduce((sum, c) => sum + (scores[c.id] ?? 0), 0) / sortedCriteria.length
    : 0;

  if (!startup || !currentUser || currentUser.role !== 'judge') {
    return (
      <PitchLayout>
        <div className="text-center py-24 text-gray-500">
          <p>You don't have access to this page.</p>
          <Link to="/pitch/judge" className="text-[#0A66C2] hover:underline text-sm mt-2 block">← Back</Link>
        </div>
      </PitchLayout>
    );
  }

  const handleSubmit = () => {
    const entry = {
      id: `score-${currentUser.id}-${startup.id}-${Date.now()}`,
      startupId: startup.id,
      judgeId: currentUser.id,
      judgeName: currentUser.name,
      scores,
      comment: comment.trim() || undefined,
      submittedAt: new Date().toISOString(),
      total: parseFloat(total.toFixed(2)),
    };
    submitScore(entry);
    setSubmitted(true);
    setTimeout(() => navigate('/pitch/judge'), 1800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F3F2EE] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Score submitted!</h2>
          <p className="text-gray-500 mt-1">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <PitchLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link to="/pitch/judge" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A66C2] mb-4 transition-colors">
          <ChevronLeft size={16} />Back to dashboard
        </Link>

        {/* Startup header */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 mb-4 flex items-center gap-3">
          <StartupAvatar name={startup.name} size="md" logoUrl={startup.logoUrl} />
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">{startup.name}</h1>
            <p className="text-sm text-gray-500">{startup.tagline}</p>
          </div>
          <Link
            to={`/pitch/startup/${startup.id}`}
            className="text-xs text-[#0A66C2] hover:underline"
          >
            View profile →
          </Link>
        </div>

        {/* Live total */}
        <div className="bg-[#0A66C2] rounded-xl p-4 mb-4 flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-80">Your running average</p>
            <p className="text-4xl font-bold mt-0.5">{total.toFixed(1)}</p>
          </div>
          <p className="text-sm opacity-70">out of 10</p>
        </div>

        {/* Criteria sliders */}
        <div className="space-y-3 mb-4">
          {sortedCriteria.map((criterion) => (
            <ScoreSlider
              key={criterion.id}
              criterion={criterion}
              value={scores[criterion.id] ?? 5}
              onChange={(v) => setScores((prev) => ({ ...prev, [criterion.id]: v }))}
            />
          ))}
        </div>

        {/* Comment */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comments <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your thoughts on this startup's pitch, team, or potential…"
            className="w-full text-sm border border-[#e0e0e0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold py-3 rounded-full transition-colors text-base"
        >
          <Send size={18} />
          {existingScore ? 'Update Score' : 'Submit Score'}
        </button>
      </div>
    </PitchLayout>
  );
}

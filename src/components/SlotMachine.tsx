import React, { useEffect, useMemo, useState } from 'react';
import { CHARACTERS } from '@/lib/characters';

interface SlotMachineProps {
  /** The pose every reel lands on — the chosen restaurant's character. */
  targetSrc: string;
  targetAlt: string;
  onDone: () => void;
}

const REEL_DURATIONS = [1300, 1800, 2300]; // ms, staggered stops like a real machine
const ITEM_H = 104; // px, height of one reel cell

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ targetSrc, targetAlt, onDone }) => {
  const [spinning, setSpinning] = useState(false);

  // Build the three strips once per spin: random poses, target pinned last.
  const reels = useMemo(() => {
    const poses = Object.values(CHARACTERS).map((c) => c.src);
    return REEL_DURATIONS.map((_, i) => {
      const count = 8 + i * 4; // later reels travel further = feel faster
      const strip: string[] = [];
      while (strip.length < count) strip.push(...shuffled(poses));
      return [...strip.slice(0, count), targetSrc];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSrc]);

  useEffect(() => {
    // Kick the CSS transition one frame after mount
    const start = requestAnimationFrame(() => setSpinning(true));
    const done = setTimeout(onDone, REEL_DURATIONS[REEL_DURATIONS.length - 1] + 600);
    return () => {
      cancelAnimationFrame(start);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSrc]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6" dir="rtl">
      {/* Marquee bulbs */}
      <div className="flex gap-2 mb-4" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-april-fuchsia animate-pulse"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-4 border-april-fuchsia p-4 w-full max-w-sm">
        <div className="flex justify-between gap-2" role="img" aria-label={`מגרילה... ${targetAlt}`}>
          {reels.map((strip, r) => (
            <div
              key={r}
              className="flex-1 overflow-hidden rounded-xl bg-april-background border border-orange-100"
              style={{ height: ITEM_H }}
            >
              <div
                className="flex flex-col items-center"
                style={{
                  transform: spinning
                    ? `translateY(-${(strip.length - 1) * ITEM_H}px)`
                    : 'translateY(0)',
                  transition: spinning
                    ? `transform ${REEL_DURATIONS[r]}ms cubic-bezier(0.15, 0.85, 0.3, 1)`
                    : 'none',
                }}
              >
                {strip.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center shrink-0"
                    style={{ height: ITEM_H, width: '100%' }}
                  >
                    <img src={src} alt="" className="w-20 h-20 object-contain" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-april-fuchsia text-2xl font-bold mt-5 animate-pulse">מגרילה...</div>
    </div>
  );
};

export default SlotMachine;

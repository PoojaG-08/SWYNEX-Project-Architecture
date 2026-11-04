import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface CountdownTimerProps {
  targetDate: string;
  isRevealed?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, isRevealed }) => {
  const { triggerGlobalConfetti } = useTheme();
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const [hasFiredAtExpiry, setHasFiredAtExpiry] = useState(false);

  useEffect(() => {
    function calculate() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        if (!hasFiredAtExpiry && !isRevealed) {
          setHasFiredAtExpiry(true);
          triggerGlobalConfetti();
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, hasFiredAtExpiry, isRevealed]);

  if (isRevealed || time.isPast) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--highlight)]/15 border border-[var(--highlight)]/40 rounded-xl text-[var(--highlight)]">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-semibold text-sm">Reveal Date Reached! All matches unlocked</span>
        </div>
        <button
          onClick={triggerGlobalConfetti}
          className="px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition-transform active:scale-95"
          title="Trigger celebratory confetti"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Confetti</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-[var(--accent)]">
        <Clock className="w-4 h-4" />
        <span className="font-medium tracking-wide uppercase text-[11px]">Reveal Countdown</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm">
        <div className="bg-[var(--bg-main)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg text-center min-w-[50px]">
          <span className="text-base font-bold text-[var(--text-main)]">{String(time.days).padStart(2, '0')}</span>
          <span className="block text-[10px] text-[var(--accent)] uppercase">days</span>
        </div>
        <span className="text-[var(--highlight)] font-bold">:</span>
        <div className="bg-[var(--bg-main)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg text-center min-w-[50px]">
          <span className="text-base font-bold text-[var(--text-main)]">{String(time.hours).padStart(2, '0')}</span>
          <span className="block text-[10px] text-[var(--accent)] uppercase">hrs</span>
        </div>
        <span className="text-[var(--highlight)] font-bold">:</span>
        <div className="bg-[var(--bg-main)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg text-center min-w-[50px]">
          <span className="text-base font-bold text-[var(--text-main)]">{String(time.minutes).padStart(2, '0')}</span>
          <span className="block text-[10px] text-[var(--accent)] uppercase">min</span>
        </div>
        <span className="text-[var(--highlight)] font-bold">:</span>
        <div className="bg-[var(--bg-main)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg text-center min-w-[50px]">
          <span className="text-base font-bold text-[var(--primary)]">{String(time.seconds).padStart(2, '0')}</span>
          <span className="block text-[10px] text-[var(--accent)] uppercase">sec</span>
        </div>
      </div>
    </div>
  );
};

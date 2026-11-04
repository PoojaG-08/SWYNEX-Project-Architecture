import React, { useEffect } from 'react';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import { RevealedAssignment } from '../types/index.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface FinalRevealViewProps {
  assignments: RevealedAssignment[];
  groupName: string;
}

export const FinalRevealView: React.FC<FinalRevealViewProps> = ({ assignments, groupName }) => {
  const { triggerGlobalConfetti } = useTheme();

  useEffect(() => {
    // Trigger celebratory react-confetti shower on reveal
    triggerGlobalConfetti();
  }, []);

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--highlight)]/40 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Banner Scrim */}
      <div className="relative rounded-xl overflow-hidden mb-8 border border-[var(--border-card)] max-h-56">
        <img
          src="/src/assets/images/celebration_reveal_banner_1793770312568.jpg"
          alt="Gift Exchange Celebration"
          referrerPolicy="no-referrer"
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent flex flex-col justify-end p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--highlight)] text-[var(--bg-main)] text-xs font-bold w-fit mb-2 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Big Reveal is Live!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-main)] drop-shadow-md">
            All Secret Pairings Unveiled!
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mt-1">
            The secret is out for <span className="font-semibold text-[var(--highlight)]">{groupName}</span>! See who gave to whom across the entire group.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
            Complete Gift Exchange Chain
          </h3>
          <p className="text-xs text-[var(--accent)]">
            {assignments.length} secret santa pairs successfully completed
          </p>
        </div>

        <button
          onClick={triggerGlobalConfetti}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
          <span>Celebrate with Confetti!</span>
        </button>
      </div>

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {assignments.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] hover:border-[var(--highlight)] transition-all flex items-center justify-between gap-3 shadow-md"
          >
            {/* Giver */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] text-[var(--accent)] font-bold text-sm flex items-center justify-center shrink-0 border border-[var(--border-card)]">
                {item.giverName.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] block">Secret Giver</span>
                <span className="font-bold text-sm text-[var(--text-main)] truncate block">{item.giverName}</span>
              </div>
            </div>

            {/* Arrow & Gift icon */}
            <div className="flex flex-col items-center shrink-0 px-2">
              <Gift className="w-4 h-4 text-[var(--highlight)] mb-0.5" />
              <ArrowRight className="w-4 h-4 text-[var(--primary)]" />
            </div>

            {/* Recipient */}
            <div className="flex items-center gap-3 min-w-0 justify-end text-right">
              <div className="truncate">
                <span className="text-[10px] uppercase tracking-wider text-[var(--highlight)] block">Happy Recipient</span>
                <span className="font-bold text-sm text-[var(--text-main)] truncate block">{item.recipientName}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--highlight)] text-[var(--bg-main)] font-bold text-sm flex items-center justify-center shrink-0 shadow">
                {item.recipientName.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

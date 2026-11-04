import React, { useState } from 'react';
import { Eye, EyeOff, Gift, Sparkles, ExternalLink, Heart, AlertCircle } from 'lucide-react';
import { SecretRecipient } from '../types/index.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface SecretRecipientCardProps {
  recipient: SecretRecipient | null;
  budget: number;
  currency: string;
  isDrawn: boolean;
  isOrganizer: boolean;
  onDrawClick?: () => void;
}

export const SecretRecipientCard: React.FC<SecretRecipientCardProps> = ({
  recipient,
  budget,
  currency,
  isDrawn,
  isOrganizer,
  onDrawClick,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { triggerGlobalConfetti } = useTheme();

  const handleReveal = () => {
    setIsRevealed(true);
    triggerGlobalConfetti();
  };

  if (!isDrawn) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-8 text-center shadow-xl">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center text-[var(--accent)] mb-4 shadow-inner border border-[var(--border-card)]">
            <Gift className="w-8 h-8 animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>
          <h3 className="text-xl font-bold font-display text-[var(--text-main)] mb-2">
            Assignments Have Not Been Drawn Yet
          </h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Once everyone has joined and added their wishlist ideas, the organizer can shuffle and generate secret matches.
          </p>
          {isOrganizer ? (
            <button
              onClick={onDrawClick}
              className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
              <span>Shuffle & Assign Secret Matches</span>
            </button>
          ) : (
            <div className="text-xs text-[var(--highlight)] bg-[var(--bg-main)] px-4 py-2 rounded-lg border border-[var(--highlight)]/30 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Waiting for the group organizer to draw names...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="rounded-2xl bg-[var(--bg-card)] border border-amber-500/30 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm text-[var(--text-main)]">
          Assignments have been drawn, but no recipient was assigned to your account. Please contact the group organizer.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl overflow-hidden transition-all duration-300">
      {/* Decorative top ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--accent)]" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-card)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--highlight)] mb-1">
              <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
              <span className="uppercase tracking-wider">Your Top Secret Mission</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-main)]">
              Secret Gift Recipient
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Only you can see this assignment. Keep it secret until the reveal date!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[var(--bg-main)] px-3.5 py-1.5 rounded-xl border border-[var(--border-card)] text-xs text-[var(--text-main)]">
              <span className="text-[var(--accent)] font-medium">Budget:</span>{' '}
              <span className="font-bold text-[var(--highlight)] font-mono tabular-nums">
                {currency}
                {budget}
              </span>
            </div>

            <button
              onClick={() => {
                if (!isRevealed) {
                  handleReveal();
                } else {
                  setIsRevealed(false);
                }
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md ${
                isRevealed
                  ? 'bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-card)]'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
              }`}
            >
              {isRevealed ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide for Privacy</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Unwrap & Reveal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secret Recipient Content */}
        {!isRevealed ? (
          <div
            onClick={handleReveal}
            className="cursor-pointer group mt-6 p-8 rounded-2xl bg-[var(--bg-main)]/80 border-2 border-dashed border-[var(--accent)]/40 hover:border-[var(--primary)] transition-all text-center flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden"
          >
            {/* Visual mystery image */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl mb-4 relative border border-[var(--border-card)] group-hover:scale-105 transition-transform duration-300">
              <img
                src="/src/assets/images/mystery_gift_box_1793770312349.jpg"
                alt="Mystery Gift Box"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)]/80 via-transparent to-transparent" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--highlight)]/20 text-[var(--highlight)] text-xs font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tap or Click to Unwrap</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                Who is your secret match?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">
                Your recipient is waiting! Click here to uncover their identity with festive confetti and see their wishlist.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Recipient Profile Card */}
            <div className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--highlight)] text-[var(--bg-main)] font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
                  {recipient.avatar || recipient.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className="text-2xl font-bold font-display text-[var(--text-main)]">
                      {recipient.name}
                    </h3>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--bg-main)] bg-[var(--highlight)] px-2.5 py-0.5 rounded-full">
                      Your Recipient
                    </span>
                  </div>
                  <p className="text-xs text-[var(--accent)]">{recipient.email}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    You are giving a gift to {recipient.name}! Aim for around {currency}
                    {budget}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={triggerGlobalConfetti}
                  className="px-3.5 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--highlight)] border border-[var(--highlight)]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Celebrate with confetti"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confetti!</span>
                </button>

                <div className="bg-[var(--bg-card)] px-4 py-3 rounded-xl border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-[var(--accent)] uppercase tracking-wide">Wishes</div>
                  <div className="text-lg font-bold text-[var(--text-main)] font-mono tabular-nums">
                    {recipient.wishlist?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient's Wishlist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[var(--primary)]" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
                    {recipient.name}&apos;s Gift Wishlist
                  </h4>
                </div>
                <span className="text-xs text-[var(--accent)]">
                  Browse their requested items
                </span>
              </div>

              {(!recipient.wishlist || recipient.wishlist.length === 0) ? (
                <div className="p-6 rounded-xl bg-[var(--bg-main)]/60 border border-[var(--border-card)] text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    {recipient.name} hasn&apos;t added any specific gift wishes yet!
                  </p>
                  <p className="text-xs text-[var(--highlight)] mt-1">
                    Tip: Thoughtful gifts, chocolates, cozy winter items, or gift cards within {currency}{budget} are always appreciated.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {recipient.wishlist.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h5 className="font-semibold text-sm text-[var(--text-main)] leading-snug">
                            {item.title}
                          </h5>
                          {item.priority === 'high' && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 shrink-0">
                              Top Wish
                            </span>
                          )}
                          {item.priority === 'medium' && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--highlight)]/20 text-[var(--highlight)] border border-[var(--highlight)]/30 shrink-0">
                              Liked
                            </span>
                          )}
                          {item.priority === 'low' && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 shrink-0">
                              Nice to Have
                            </span>
                          )}
                        </div>

                        {item.notes && (
                          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
                        <span className="font-mono text-[var(--highlight)] font-medium">
                          {item.currency || currency}
                          {item.estimatedPrice > 0 ? item.estimatedPrice : 'Open budget'}
                        </span>

                        {item.link ? (
                          <a
                            href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--accent)] hover:text-[var(--text-main)] font-medium transition-colors"
                          >
                            <span>View Item</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)] text-[11px]">No link provided</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

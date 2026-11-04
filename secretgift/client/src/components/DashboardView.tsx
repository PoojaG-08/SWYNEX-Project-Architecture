import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  KeyRound,
  Users,
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { GroupSummary } from '../types/index.ts';
import { api } from '../api/client.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface DashboardViewProps {
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onHowItWorks: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  onHowItWorks,
}) => {
  const { user } = useAuth();
  const { triggerGlobalConfetti } = useTheme();
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    try {
      const data = await api.getGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Showcase Section */}
      <div className="relative rounded-3xl overflow-hidden border border-[var(--border-card)] shadow-2xl bg-[var(--bg-card)]">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src="/src/assets/images/secret_gift_hero_1793770311514.jpg"
            alt="Secret Gift Exchange"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)]/80 via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--highlight)]/20 border border-[var(--highlight)]/40 text-[var(--highlight)] text-xs font-semibold w-fit mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anonymous & Fair Secret Santa</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-[var(--text-main)] leading-tight tracking-tight drop-shadow-md">
              Gift Exchanging, <br />
              <span className="text-[var(--accent)]">Made Secret & Simple.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2.5 max-w-xl leading-relaxed">
              Create a private gift circle with friends or colleagues. Each member receives one secret match with wishlist suggestions until the grand reveal!
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <button
                onClick={onCreateGroup}
                className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Group</span>
              </button>

              <button
                onClick={onJoinGroup}
                className="px-5 py-2.5 bg-[var(--bg-main)]/90 hover:bg-[var(--bg-main)] text-[var(--accent)] border border-[var(--border-card)] text-xs sm:text-sm font-semibold rounded-xl shadow backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Join with Code</span>
              </button>

              <button
                onClick={onHowItWorks}
                className="text-xs text-[var(--highlight)] hover:underline font-medium ml-1"
              >
                How does it work? →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--border-card)] shadow">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--accent)] font-medium block uppercase tracking-wider">
              My Active Circles
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)]">
              {groups.length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] text-[var(--highlight)] flex items-center justify-center shrink-0 border border-[var(--border-card)] shadow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--accent)] font-medium block uppercase tracking-wider">
              Secret Matches Ready
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-[var(--highlight)]">
              {groups.filter((g) => g.isDrawn).length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--border-card)] shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--accent)] font-medium block uppercase tracking-wider">
              Privacy Guarantee
            </span>
            <span className="text-sm font-semibold text-[var(--text-main)] block mt-0.5">
              100% Zero-Leak Matches
            </span>
          </div>
        </div>
      </div>

      {/* Gift Exchange Groups List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-main)]">
              Your Gift Exchange Groups
            </h2>
            <p className="text-xs text-[var(--accent)] mt-0.5">
              Select an exchange circle to check your match, view wishlists, or manage settings
            </p>
          </div>

          <button
            onClick={onJoinGroup}
            className="text-xs text-[var(--highlight)] hover:text-white font-medium flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Have an invite code?</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--accent)]">Loading your groups...</div>
        ) : groups.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-card)] text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center text-[var(--accent)] mb-4">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">No Active Gift Groups</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mb-6">
              You haven&apos;t created or joined any gift exchange groups yet. Start one now or join a friend&apos;s group using their code!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onCreateGroup}
                className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold rounded-xl shadow transition-transform active:scale-95"
              >
                Create Group
              </button>
              <button
                onClick={onJoinGroup}
                className="px-5 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] text-[var(--accent)] border border-[var(--border-card)] text-xs font-semibold rounded-xl transition-colors"
              >
                Enter Invite Code
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const revealDateFormatted = new Date(group.revealDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={group.id}
                  onClick={() => onSelectGroup(group.id)}
                  className="cursor-pointer group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top status badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--bg-main)] text-[var(--accent)] border border-[var(--border-card)]">
                        {group.isCreator ? 'Organizer' : 'Participant'}
                      </span>

                      {group.isRevealed ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--highlight)]/20 text-[var(--highlight)] border border-[var(--highlight)]/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Revealed</span>
                        </span>
                      ) : group.isDrawn ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          <span>Match Ready</span>
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-[var(--bg-main)] text-[var(--text-muted)]">
                          Waiting for draw
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold font-display text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {group.name}
                    </h3>

                    {group.rules && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                        {group.rules}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--border-card)] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--accent)]">Budget</span>
                      <span className="font-mono font-bold text-[var(--highlight)]">
                        {group.currency}{group.budget}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--accent)]">Reveal Date</span>
                      <span className="text-[var(--text-main)] font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--highlight)]" />
                        <span>{revealDateFormatted}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[var(--text-muted)] flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{group.memberCount} members</span>
                      </span>

                      <span className="font-bold text-xs text-[var(--primary)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>Open Group</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

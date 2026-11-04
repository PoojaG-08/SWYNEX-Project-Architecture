import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  Gift,
  Users,
  Sparkles,
  Shuffle,
  RotateCcw,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { GroupDetail, MyAssignmentResponse } from '../types/index.ts';
import { api } from '../api/client.ts';
import { CountdownTimer } from './CountdownTimer.tsx';
import { SecretRecipientCard } from './SecretRecipientCard.tsx';
import { FinalRevealView } from './FinalRevealView.tsx';
import { WishlistSection } from './WishlistSection.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface GroupDetailViewProps {
  groupId: string;
  onBack: () => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({ groupId, onBack }) => {
  const { triggerGlobalConfetti } = useTheme();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [assignment, setAssignment] = useState<MyAssignmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'wishlist' | 'members' | 'reveal'>('mission');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const [groupData, assignmentData] = await Promise.all([
        api.getGroup(groupId),
        api.getMyAssignment(groupId).catch(() => ({ hasAssignment: false })),
      ]);
      setGroup(groupData);
      setAssignment(assignmentData);

      // Trigger confetti if group is in revealed state on load
      if (groupData.isRevealed && groupData.isDrawn) {
        triggerGlobalConfetti();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load group details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  const handleCopyCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDrawAssignments = async () => {
    if (!group) return;
    if (group.members.length < 2) {
      alert('You need at least 2 members in the group to draw secret matches. Invite friends first!');
      return;
    }

    if (
      group.isDrawn &&
      !confirm('Recipients have already been drawn. Drawing again will re-shuffle everyone. Continue?')
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await api.drawAssignments(group.id);
      await loadData();
      triggerGlobalConfetti();
    } catch (err: any) {
      alert(err.message || 'Failed to draw assignments.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDraw = async () => {
    if (!group) return;
    if (!confirm('Are you sure you want to reset all drawn assignments? Members will lose their current matches.')) {
      return;
    }

    setActionLoading(true);
    try {
      await api.resetDraw(group.id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reset draw.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTestReveal = async () => {
    if (!group) return;
    setActionLoading(true);
    try {
      const res = await api.toggleTestReveal(group.id);
      await loadData();
      if (res.testRevealEnabled) {
        setActiveTab('reveal');
        triggerGlobalConfetti();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle test reveal.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[var(--accent)]">Opening secret gift vault...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="py-16 text-center">
        <div className="p-6 max-w-md mx-auto rounded-2xl bg-[var(--bg-card)] border border-red-500/30">
          <ShieldAlert className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-main)]">{error || 'Group not found.'}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] text-xs font-semibold rounded-xl text-[var(--accent)]"
          >
            Back to Exchanges
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(group.revealDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Groups</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Calendar className="w-3.5 h-3.5 text-[var(--highlight)]" />
          <span>Reveal Date: {formattedDate}</span>
        </div>
      </div>

      {/* Main Group Header Card */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--accent)]/10 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--border-card)]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-semibold text-[var(--bg-main)] bg-[var(--accent)] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {group.isCreator ? 'Organizer' : 'Member'}
              </span>

              {group.isDrawn ? (
                <span className="text-xs font-semibold text-[var(--highlight)] bg-[var(--bg-main)] border border-[var(--highlight)]/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Matches Drawn</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-main)] px-2.5 py-0.5 rounded-full">
                  Gathering Members
                </span>
              )}

              {group.isRevealed && (
                <button
                  onClick={triggerGlobalConfetti}
                  className="text-xs font-semibold text-white bg-[var(--primary)] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 transition-transform active:scale-95"
                  title="Click to launch confetti!"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Final Reveal Active! (Launch Confetti)</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-main)]">
              {group.name}
            </h1>

            {group.rules && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 max-w-2xl leading-relaxed">
                {group.rules}
              </p>
            )}
          </div>

          {/* Quick Invite Code Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] flex items-center justify-between sm:justify-start gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] block">
                  Invite Code
                </span>
                <span className="font-mono text-base font-bold text-[var(--highlight)] tracking-wider">
                  {group.inviteCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--accent)] text-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors"
                title="Copy Invite Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-center sm:text-left min-w-[100px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] block">
                Gift Budget
              </span>
              <span className="font-mono text-base font-bold text-[var(--text-main)]">
                {group.currency}{group.budget}
              </span>
            </div>
          </div>
        </div>

        {/* Live Countdown & Stats Strip */}
        <div className="relative z-10 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CountdownTimer targetDate={group.revealDate} isRevealed={group.isRevealed} />

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--accent)]" />
              <span>
                <strong className="text-[var(--text-main)] font-mono tabular-nums">{group.members.length}</strong> members joined
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[var(--primary)]" />
              <span>
                <strong className="text-[var(--text-main)] font-mono tabular-nums">
                  {group.members.reduce((acc, m) => acc + m.wishlistCount, 0)}
                </strong> wishes added
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Controls Bar (Only visible to Group Creator) */}
      {group.isCreator && (
        <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--highlight)]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--highlight)]/20 text-[var(--highlight)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--highlight)] uppercase tracking-wider">
                Organizer Dashboard Controls
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                You control the secret draw and reveal timing for this group.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!group.isDrawn ? (
              <button
                disabled={actionLoading || group.members.length < 2}
                onClick={handleDrawAssignments}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Draw Secret Matches</span>
              </button>
            ) : (
              <>
                <button
                  disabled={actionLoading}
                  onClick={handleDrawAssignments}
                  className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--highlight)] border border-[var(--highlight)]/30 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                  title="Re-run Derangement draw"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Re-shuffle</span>
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleResetDraw}
                  className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--primary)] border border-[var(--primary)]/30 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Draw</span>
                </button>
              </>
            )}

            {/* Test Reveal Mode Toggle */}
            <button
              disabled={actionLoading || !group.isDrawn}
              onClick={handleToggleTestReveal}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                group.testRevealEnabled
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--accent)] border-[var(--border-card)] hover:bg-[var(--accent)]/10'
              }`}
              title="Test the final post-reveal matrix without waiting for the future date"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{group.testRevealEnabled ? 'Disable Test Reveal' : 'Test Final Reveal'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-card)] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('mission')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mission'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>My Secret Assignment</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My Wishlist for this Group</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members ({group.members.length})</span>
        </button>

        {group.isRevealed && (
          <button
            onClick={() => setActiveTab('reveal')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reveal'
                ? 'bg-[var(--highlight)] text-[var(--bg-main)] shadow-md'
                : 'text-[var(--highlight)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <span>All Matches Revealed!</span>
          </button>
        )}
      </div>

      {/* Tab 1: Secret Recipient Mission */}
      {activeTab === 'mission' && (
        <SecretRecipientCard
          recipient={assignment?.recipient || null}
          budget={group.budget}
          currency={group.currency}
          isDrawn={group.isDrawn}
          isOrganizer={group.isCreator}
          onDrawClick={handleDrawAssignments}
        />
      )}

      {/* Tab 2: Personal Wishlist for this Group */}
      {activeTab === 'wishlist' && (
        <WishlistSection
          groupId={group.id}
          groupName={group.name}
          defaultCurrency={group.currency}
        />
      )}

      {/* Tab 3: Group Members */}
      {activeTab === 'members' && (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)] mb-5">
            <div>
              <h3 className="text-xl font-bold font-display text-[var(--text-main)]">
                Exchange Members
              </h3>
              <p className="text-xs text-[var(--accent)] mt-0.5">
                Everyone participating in this gift exchange circle
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] text-[var(--highlight)] border border-[var(--highlight)]/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite Code: {group.inviteCode}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[var(--bg-card)] to-[var(--bg-surface)] text-[var(--accent)] font-bold text-base flex items-center justify-center shrink-0 border border-[var(--border-card)] shadow">
                  {member.avatar || member.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[var(--text-main)] truncate">
                      {member.name}
                    </h4>
                    {member.isOrganizer && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[var(--highlight)]/20 text-[var(--highlight)] shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--accent)] truncate">{member.email}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    {member.wishlistCount > 0 ? (
                      <span className="text-[var(--highlight)]">
                        ★ {member.wishlistCount} {member.wishlistCount === 1 ? 'wish' : 'wishes'} listed
                      </span>
                    ) : (
                      'No wishes yet'
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Final Revealed Assignments */}
      {activeTab === 'reveal' && group.allAssignments && (
        <FinalRevealView
          assignments={group.allAssignments}
          groupName={group.name}
        />
      )}
    </div>
  );
};

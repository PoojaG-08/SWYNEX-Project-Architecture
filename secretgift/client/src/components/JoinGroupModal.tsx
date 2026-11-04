import React, { useState } from 'react';
import { X, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../api/client.ts';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: (groupId: string) => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose, onJoined }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Please enter a valid group invite code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.joinGroup(inviteCode.trim().toUpperCase());
      onClose();
      onJoined(res.groupId);
    } catch (err: any) {
      setError(err.message || 'Failed to join group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-main)] border-b border-[var(--border-card)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
              Join Gift Group
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[var(--primary)]/20 border border-[var(--primary)]/40 text-xs text-[var(--text-main)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              Invite Code *
            </label>
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g. FROST-2026 or GIFT-4491"
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-center text-lg font-mono tracking-widest uppercase focus:outline-none focus:border-[var(--accent)]"
            />
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 text-center">
              Ask your exchange organizer or friend for their 6-8 character code.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-card)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
              <span>{loading ? 'Joining...' : 'Join Group'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

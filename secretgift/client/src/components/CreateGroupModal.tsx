import React, { useState } from 'react';
import { X, Gift, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { api } from '../api/client.ts';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (groupId: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
}) => {
  // Default reveal date to 7 days from now at 18:00
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(18, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('25');
  const [currency, setCurrency] = useState('$');
  const [revealDate, setRevealDate] = useState(getDefaultDate());
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a group name.');
      return;
    }

    if (!revealDate) {
      setError('Please select a reveal date and time.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createGroup({
        name: name.trim(),
        budget: parseFloat(budget) || 25,
        currency,
        revealDate: new Date(revealDate).toISOString(),
        rules: rules.trim(),
      });

      onClose();
      onGroupCreated(res.group.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-main)] border-b border-[var(--border-card)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
              Create Gift Exchange Group
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
              Group Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Friends Holiday Swap 2026, Office Secret Santa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                Gift Budget *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="25"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="CA$">CA$ (CAD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              Reveal Date & Time *
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={revealDate}
                onChange={(e) => setRevealDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              On this date, full assignments are unlocked for all group members with confetti celebrations!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              Group Rules / Description (Optional)
            </label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="e.g. Handmade items welcome! Wrap in festive paper. No joke gifts."
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
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
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create & Generate Invite Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

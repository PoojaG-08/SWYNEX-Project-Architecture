import React, { useState, useEffect } from 'react';
import { X, Sparkles, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { WishlistItem } from '../types/index.ts';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    estimatedPrice: number;
    currency: string;
    link?: string;
    notes?: string;
    priority: 'high' | 'medium' | 'low';
    groupId?: string;
  }) => Promise<void>;
  initialData?: WishlistItem | null;
  groupId?: string;
  defaultCurrency?: string;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  groupId,
  defaultCurrency = '$',
}) => {
  const [title, setTitle] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setEstimatedPrice(initialData.estimatedPrice > 0 ? String(initialData.estimatedPrice) : '');
      setCurrency(initialData.currency || defaultCurrency);
      setLink(initialData.link || '');
      setNotes(initialData.notes || '');
      setPriority(initialData.priority || 'medium');
    } else {
      setTitle('');
      setEstimatedPrice('');
      setCurrency(defaultCurrency);
      setLink('');
      setNotes('');
      setPriority('medium');
    }
    setError(null);
  }, [initialData, defaultCurrency, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a gift title or idea.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : 0,
        currency,
        link: link.trim(),
        notes: notes.trim(),
        priority,
        groupId,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save wish.');
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
            <Sparkles className="w-5 h-5 text-[var(--highlight)]" />
            <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
              {initialData ? 'Edit Wishlist Idea' : 'Add Gift Wish'}
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
              Gift Idea / Item Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cozy Wool Scarf, Espresso Beans, Sci-Fi Book..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                Estimated Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--highlight)] font-mono">
                  {currency}
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  placeholder="25"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="high">Top Wish (High)</option>
                <option value="medium">Would Love (Medium)</option>
                <option value="low">Nice to Have (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              Product Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/product-link"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              Notes (Size, Color, Details)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Size M, navy blue or dark olive, or any similar alternative!"
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
              {loading ? 'Saving...' : initialData ? 'Update Wish' : 'Add to Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

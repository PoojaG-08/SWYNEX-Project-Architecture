import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { WishlistItem } from '../types/index.ts';
import { api } from '../api/client.ts';
import { WishlistModal } from './WishlistModal.tsx';

interface WishlistSectionProps {
  groupId?: string;
  groupName?: string;
  defaultCurrency?: string;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  groupId,
  groupName,
  defaultCurrency = '$',
}) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const loadItems = async () => {
    try {
      const data = await api.getMyWishlist(groupId);
      setItems(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [groupId]);

  const handleSave = async (data: any) => {
    if (editingItem) {
      await api.updateWishlistItem(editingItem._id, data);
    } else {
      await api.addWishlistItem(data);
    }
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this gift idea?')) {
      await api.deleteWishlistItem(id);
      await loadItems();
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-card)]">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-xl font-bold font-display text-[var(--text-main)]">
              {groupName ? `My Wishlist for ${groupName}` : 'My Gift Wishlist'}
            </h3>
          </div>
          <p className="text-xs text-[var(--accent)] mt-1">
            Your secret gift giver will see these suggestions to pick something you love!
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold rounded-xl shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gift Wish</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[var(--accent)]">Loading your wishes...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] flex items-center justify-center text-[var(--highlight)] mb-3 border border-[var(--border-card)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-main)]">No wishes added yet!</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mb-4">
            Help your Secret Santa by adding 2-3 things you would love to receive within the group budget.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] text-[var(--highlight)] border border-[var(--highlight)]/40 text-xs font-medium rounded-xl transition-colors"
          >
            Add Your First Wish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm text-[var(--text-main)] leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.priority === 'high' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
                        Top Wish
                      </span>
                    )}
                    {item.priority === 'medium' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--highlight)]/20 text-[var(--highlight)] border border-[var(--highlight)]/30">
                        Liked
                      </span>
                    )}
                    {item.priority === 'low' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
                        Nice
                      </span>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[var(--highlight)] font-medium">
                    {item.currency || defaultCurrency}
                    {item.estimatedPrice > 0 ? item.estimatedPrice : 'Flexible'}
                  </span>
                  {item.link && (
                    <a
                      href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:text-[var(--text-main)] inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setModalOpen(true);
                    }}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--highlight)] transition-colors"
                    title="Edit wish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    title="Delete wish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WishlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
        groupId={groupId}
        defaultCurrency={defaultCurrency}
      />
    </div>
  );
};

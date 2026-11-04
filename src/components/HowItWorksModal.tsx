import React from 'react';
import { X, Gift, ShieldCheck, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-main)] border-b border-[var(--border-card)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--highlight)]" />
            <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
              How SecretGift Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] text-[var(--highlight)] flex items-center justify-center shrink-0 border border-[var(--border-card)] font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-main)] text-sm">Create or Join a Private Group</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                Set a budget limit and reveal date. Share your unique invite code with friends or coworkers so they can join.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--border-card)] font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-main)] text-sm">Share Your Gift Wishlist</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                Add gift wishes with estimated prices, product links, and preferences (colors, sizes) to guide your secret giver.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--border-card)] font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-main)] text-sm">Derangement Secret Draw</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                Our algorithm assigns each member a secret recipient. Strict rules guarantee nobody gets themselves, and only you see your assigned match!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] text-[var(--highlight)] flex items-center justify-center shrink-0 border border-[var(--border-card)] font-bold text-xs">
              4
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-main)] text-sm">The Big Reveal & Confetti</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                When the countdown hits zero (or when you unwrap your card), a visual confetti cascade celebrates the match, unlocking the full chain for everyone.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-card)] flex items-center gap-2.5 text-xs text-[var(--accent)]">
            <ShieldCheck className="w-5 h-5 text-[var(--highlight)] shrink-0" />
            <span>
              Zero-leak backend: Assignments are securely hidden on the server until the reveal date.
            </span>
          </div>

          <div className="text-right pt-2 border-t border-[var(--border-card)]">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow transition-colors"
            >
              Got It, Let&apos;s Gift!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

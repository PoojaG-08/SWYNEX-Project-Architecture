/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { GroupDetailView } from './components/GroupDetailView.tsx';
import { WishlistSection } from './components/WishlistSection.tsx';
import { CreateGroupModal } from './components/CreateGroupModal.tsx';
import { JoinGroupModal } from './components/JoinGroupModal.tsx';
import { HowItWorksModal } from './components/HowItWorksModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ConfettiOverlay } from './components/ConfettiOverlay.tsx';
import { Gift, ShieldCheck } from 'lucide-react';

function SecretGiftApp() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'groups' | 'wishlist'>('groups');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('group_festive_2026');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--highlight)] text-[var(--bg-main)] font-bold text-xl flex items-center justify-center mx-auto mb-3 animate-pulse shadow-lg">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-main)]">Loading SecretGift...</p>
        </div>
      </div>
    );
  }

  const handleGroupCreated = (newGroupId: string) => {
    setSelectedGroupId(newGroupId);
    setCurrentTab('groups');
  };

  const handleGroupJoined = (joinedGroupId: string) => {
    setSelectedGroupId(joinedGroupId);
    setCurrentTab('groups');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--primary)] selection:text-white transition-colors duration-200">
      {/* react-confetti Celebration Overlay */}
      <ConfettiOverlay />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'wishlist') {
            setSelectedGroupId(null);
          }
        }}
        onCreateGroupClick={() => {
          if (!user) setAuthModalOpen(true);
          else setCreateModalOpen(true);
        }}
        onJoinGroupClick={() => {
          if (!user) setAuthModalOpen(true);
          else setJoinModalOpen(true);
        }}
        onHowItWorksClick={() => setHowItWorksOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {selectedGroupId ? (
          <GroupDetailView
            groupId={selectedGroupId}
            onBack={() => setSelectedGroupId(null)}
          />
        ) : currentTab === 'wishlist' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-main)]">
                My Personal Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[var(--accent)] mt-1">
                Manage your universal gift wishes. These are shared with whoever draws your name in any exchange circle.
              </p>
            </div>
            <WishlistSection defaultCurrency="$" />
          </div>
        ) : (
          <DashboardView
            onSelectGroup={(id) => setSelectedGroupId(id)}
            onCreateGroup={() => {
              if (!user) setAuthModalOpen(true);
              else setCreateModalOpen(true);
            }}
            onJoinGroup={() => {
              if (!user) setAuthModalOpen(true);
              else setJoinModalOpen(true);
            }}
            onHowItWorks={() => setHowItWorksOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-card)] bg-[var(--bg-deep)] py-6 px-4 sm:px-8 text-xs text-[var(--text-muted)] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-main)]">SecretGift</span>
            <span>·</span>
            <span>Anonymous Gift Exchange Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--accent)]">
            <button
              onClick={() => setHowItWorksOpen(true)}
              className="hover:text-[var(--text-main)] transition-colors"
            >
              How It Works
            </button>
            <span>·</span>
            <span className="flex items-center gap-1 text-[var(--highlight)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Leak Derangement Algorithm</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <CreateGroupModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoined={handleGroupJoined}
      />

      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SecretGiftApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

import React, { useState } from 'react';
import { Gift, Plus, User, LogOut, Sparkles, HelpCircle, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { ThemeSelector } from './ThemeSelector.tsx';

interface NavbarProps {
  currentTab: 'groups' | 'wishlist';
  onTabChange: (tab: 'groups' | 'wishlist') => void;
  onCreateGroupClick: () => void;
  onJoinGroupClick: () => void;
  onHowItWorksClick: () => void;
  onAuthClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onCreateGroupClick,
  onJoinGroupClick,
  onHowItWorksClick,
  onAuthClick,
}) => {
  const { user, logout, demoUsers, demoLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-main)]/95 backdrop-blur-md border-b border-[var(--border-card)] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Brand wordmark */}
        <div
          onClick={() => onTabChange('groups')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--highlight)] flex items-center justify-center text-[var(--bg-main)] shadow-md">
            <Gift className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-[var(--text-main)] whitespace-nowrap">
            Secret<span className="text-[var(--accent)]">Gift</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-main)]/80">
          <button
            onClick={() => onTabChange('groups')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[var(--accent)] ${
              currentTab === 'groups' ? 'text-[var(--accent)] font-bold' : ''
            }`}
          >
            Exchange Groups
          </button>
          <button
            onClick={() => onTabChange('wishlist')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[var(--accent)] ${
              currentTab === 'wishlist' ? 'text-[var(--accent)] font-bold' : ''
            }`}
          >
            My Wishlist
          </button>
          <button
            onClick={onHowItWorksClick}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-[var(--accent)] flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-[var(--highlight)]" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Theme Selector Dropdown */}
          <ThemeSelector />

          {user ? (
            <>
              <button
                onClick={onJoinGroupClick}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] rounded-xl transition-colors whitespace-nowrap"
              >
                Join with Code
              </button>

              <button
                onClick={onCreateGroupClick}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Exchange</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-card)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--highlight)] text-[var(--bg-main)] font-bold text-xs flex items-center justify-center">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-[var(--text-main)] max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[var(--border-card)]">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate">{user.name}</p>
                      <p className="text-[11px] text-[var(--accent)] truncate">{user.email}</p>
                    </div>

                    {/* Quick Demo Switcher inside dropdown */}
                    <div className="px-4 py-2 border-b border-[var(--border-card)]">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--highlight)] mb-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Switch Active Account:</span>
                      </div>
                      <div className="space-y-1">
                        {demoUsers.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              demoLogin(d.email);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                              user.email === d.email
                                ? 'bg-[var(--bg-surface)] text-[var(--highlight)] font-bold'
                                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-surface)]/60'
                            }`}
                          >
                            <span className="truncate">{d.name}</span>
                            <span className="text-[10px] opacity-70">
                              {d.email === 'sarah@example.com' ? 'Organizer' : 'Member'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[var(--primary)] hover:bg-[var(--bg-surface)] flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl shadow transition-colors"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

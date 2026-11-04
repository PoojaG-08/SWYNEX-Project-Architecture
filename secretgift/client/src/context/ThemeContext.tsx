import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'midnight' | 'evergreen' | 'plum' | 'teal';

export interface ThemeOption {
  id: ThemeName;
  name: string;
  description: string;
  previewColors: string[];
  confettiColors: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Royale & Champagne Gold',
    description: 'Deep midnight indigo, warm gold, and vibrant berry rose',
    previewColors: ['#0B0F19', '#F43F5E', '#FBBF24', '#38BDF8'],
    confettiColors: ['#F43F5E', '#FBBF24', '#38BDF8', '#FDE68A', '#FFFFFF'],
  },
  {
    id: 'evergreen',
    name: 'Alpine Evergreen & Cranberry',
    description: 'Cozy holiday forest green, cranberry red, and frosted mint',
    previewColors: ['#05241C', '#DC2626', '#34D399', '#FBBF24'],
    confettiColors: ['#DC2626', '#34D399', '#FBBF24', '#A7F3D0', '#FFFFFF'],
  },
  {
    id: 'plum',
    name: 'Cosmic Royal Plum & Stardust',
    description: 'Rich velvet violet, neon flamingo, and electric amber',
    previewColors: ['#150826', '#EC4899', '#A78BFA', '#FDE047'],
    confettiColors: ['#EC4899', '#A78BFA', '#FDE047', '#38BDF8', '#FFFFFF'],
  },
  {
    id: 'teal',
    name: 'Nordic Aurora & Deep Teal',
    description: 'Ocean teal, coral pink, and soft aqua sparkles',
    previewColors: ['#073B4C', '#FF6B6B', '#4ECDC4', '#FFE66D'],
    confettiColors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#F7FFF7'],
  },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  activeThemeOption: ThemeOption;
  triggerGlobalConfetti: () => void;
  confettiActive: boolean;
  stopConfetti: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('secretgift_theme');
    return (saved as ThemeName) || 'midnight'; // Default new theme: Midnight Royale & Champagne Gold
  });

  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('secretgift_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  const triggerGlobalConfetti = () => {
    setConfettiActive(true);
    // Auto stop emission after 4 seconds
    setTimeout(() => {
      setConfettiActive(false);
    }, 4500);
  };

  const stopConfetti = () => {
    setConfettiActive(false);
  };

  const activeThemeOption =
    THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        activeThemeOption,
        triggerGlobalConfetti,
        confettiActive,
        stopConfetti,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

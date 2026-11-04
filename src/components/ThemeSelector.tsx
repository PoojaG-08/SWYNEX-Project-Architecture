import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useTheme, THEME_OPTIONS, ThemeName } from '../context/ThemeContext.tsx';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, activeThemeOption, triggerGlobalConfetti } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-card)] text-xs font-semibold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-sm"
        title="Change application color theme"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--highlight)]" />
        <span className="hidden sm:inline">Theme</span>
        <div className="flex items-center -space-x-1">
          {activeThemeOption.previewColors.map((color, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-black/40"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 pb-2 border-b border-[var(--border-card)] flex items-center justify-between">
            <span className="text-xs font-bold font-display text-[var(--text-main)]">
              Choose Color Theme
            </span>
            <button
              onClick={() => {
                triggerGlobalConfetti();
                setIsOpen(false);
              }}
              className="text-[10px] text-[var(--highlight)] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Test Confetti</span>
            </button>
          </div>

          <div className="p-2 space-y-1.5">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between ${
                  theme === opt.id
                    ? 'bg-[var(--bg-surface)] border border-[var(--highlight)]'
                    : 'hover:bg-[var(--bg-surface)]/60 border border-transparent'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)]">
                      {opt.name}
                    </span>
                    {theme === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[var(--highlight)]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {opt.description}
                  </p>
                </div>

                <div className="flex items-center -space-x-1 pl-2 shrink-0">
                  {opt.previewColors.map((color, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

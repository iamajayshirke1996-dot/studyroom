import React from 'react';
import {
  X,
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ACCENT_THEMES, AccentColor, ThemeMode } from '../../types/theme';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    mode,
    setMode,
    accentColor,
    setAccentColor,
    currentTheme,
    isDark,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useTheme();

  if (!isCustomizerOpen) return null;

  const handleReset = () => {
    setMode('dark');
    setAccentColor('indigo');
  };

  const accentList: AccentColor[] = ['indigo', 'emerald', 'purple', 'blue', 'amber', 'rose'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl text-white shadow-md"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Customize Theme & Appearance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch Light/Dark mode and choose your custom accent color
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Display Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMode('light')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  mode === 'light'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Sun className={`h-5 w-5 ${mode === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  mode === 'dark'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Moon className={`h-5 w-5 ${mode === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('system')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  mode === 'system'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Laptop className={`h-5 w-5 ${mode === 'system' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">System Sync</span>
              </button>
            </div>
          </div>

          {/* Accent Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Custom Accent Color Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {accentList.map((colorKey) => {
                const opt = ACCENT_THEMES[colorKey];
                const isSelected = accentColor === colorKey;

                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setAccentColor(colorKey)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-950/80 shadow-md ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-900'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: opt.primary }}
                      />
                      <span className="text-xs font-medium truncate text-slate-800 dark:text-slate-200">
                        {opt.name}
                      </span>
                    </div>

                    {isSelected && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Theme Live Preview
            </label>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${currentTheme.primary}20`,
                    borderColor: `${currentTheme.primary}40`,
                    color: currentTheme.primary,
                  }}
                >
                  Active Accent: {currentTheme.name}
                </span>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Action Button
                </button>
              </div>

              {/* Progress preview */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Goal Progress Simulation</span>
                  <span className="font-bold" style={{ color: currentTheme.primary }}>
                    75%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '75%',
                      backgroundColor: currentTheme.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCustomizerOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

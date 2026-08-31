import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, AccentColor, ACCENT_THEMES, AccentThemeOption } from '../types/theme';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  currentTheme: AccentThemeOption;
  isDark: boolean;
  toggleLightDark: () => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = 'studypulse_theme_mode';
const ACCENT_COLOR_KEY = 'studypulse_accent_color';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_MODE_KEY);
    return (saved as ThemeMode) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem(ACCENT_COLOR_KEY);
    return (saved as AccentColor) || 'indigo';
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Listen to system changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = mode === 'system' ? isSystemDark : mode === 'dark';

  // Apply dark class and theme attributes to html root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Set accent class and CSS variables
    const theme = ACCENT_THEMES[accentColor] || ACCENT_THEMES.indigo;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.setAttribute('data-accent', accentColor);
  }, [isDark, accentColor]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
  };

  const setAccentColor = (newAccent: AccentColor) => {
    setAccentColorState(newAccent);
    localStorage.setItem(ACCENT_COLOR_KEY, newAccent);
  };

  const toggleLightDark = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setMode(nextMode);
  };

  const currentTheme = ACCENT_THEMES[accentColor] || ACCENT_THEMES.indigo;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        accentColor,
        setAccentColor,
        currentTheme,
        isDark,
        toggleLightDark,
        isCustomizerOpen,
        setIsCustomizerOpen,
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

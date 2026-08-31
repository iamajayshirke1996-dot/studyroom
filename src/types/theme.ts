export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColor = 'indigo' | 'emerald' | 'purple' | 'blue' | 'amber' | 'rose';

export interface AccentThemeOption {
  id: AccentColor;
  name: string;
  primary: string; // e.g. '#6366f1'
  primaryHover: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  ring: string;
  cssClass: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentThemeOption> = {
  indigo: {
    id: 'indigo',
    name: 'Electric Indigo',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    badgeBorder: 'border-indigo-500/30',
    gradient: 'from-indigo-600 to-purple-600',
    ring: 'focus:ring-indigo-500',
    cssClass: 'theme-indigo',
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Emerald',
    primary: '#10b981',
    primaryHover: '#059669',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
    ring: 'focus:ring-emerald-500',
    cssClass: 'theme-emerald',
  },
  purple: {
    id: 'purple',
    name: 'Cyber Violet',
    primary: '#a855f7',
    primaryHover: '#9333ea',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
    badgeBorder: 'border-purple-500/30',
    gradient: 'from-purple-600 to-pink-600',
    ring: 'focus:ring-purple-500',
    cssClass: 'theme-purple',
  },
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/30',
    gradient: 'from-blue-600 to-cyan-600',
    ring: 'focus:ring-blue-500',
    cssClass: 'theme-blue',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-600',
    ring: 'focus:ring-amber-500',
    cssClass: 'theme-amber',
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/30',
    gradient: 'from-rose-600 to-red-600',
    ring: 'focus:ring-rose-500',
    cssClass: 'theme-rose',
  },
};

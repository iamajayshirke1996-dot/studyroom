import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  badgeText?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconColor,
  badgeText,
  badgeColor = 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      {/* Subtle background glow */}
      <div
        className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-15 dark:opacity-10 blur-2xl ${gradient}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm ${iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          {badgeText && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

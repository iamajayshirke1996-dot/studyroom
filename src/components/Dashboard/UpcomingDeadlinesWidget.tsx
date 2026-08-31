import React from 'react';
import { Calendar, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const UpcomingDeadlinesWidget: React.FC = () => {
  const { goals, setActiveTab } = useStudy();

  interface DeadlineItem {
    id: string;
    goalId: string;
    title: string;
    parentTitle?: string;
    type: string;
    dueDate: Date;
    daysRemaining: number;
    isMilestone: boolean;
  }

  const now = new Date();
  const deadlineItems: DeadlineItem[] = [];

  goals.forEach((g) => {
    if (g.status !== 'completed' && g.deadline) {
      const d = new Date(g.deadline);
      const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      deadlineItems.push({
        id: g.id,
        goalId: g.id,
        title: g.title,
        type: g.type,
        dueDate: d,
        daysRemaining: diffDays,
        isMilestone: false,
      });
    }

    g.milestones?.forEach((m) => {
      if (!m.completed && m.dueDate) {
        const d = new Date(m.dueDate);
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        deadlineItems.push({
          id: m.id,
          goalId: g.id,
          title: m.title,
          parentTitle: g.title,
          type: g.type,
          dueDate: d,
          daysRemaining: diffDays,
          isMilestone: true,
        });
      }
    });
  });

  deadlineItems.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const displayItems = deadlineItems.slice(0, 4);

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Upcoming Deadlines</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Target milestones & checkpoints</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('timeline')}
            className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            <span>Timeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {displayItems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p>No immediate deadlines! You are all caught up.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayItems.map((item) => {
              const isUrgent = item.daysRemaining <= 3;
              const isWarning = item.daysRemaining <= 7 && item.daysRemaining > 3;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab('timeline')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                          item.type === 'udemy'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : item.type === 'youtube'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : item.type === 'dsa'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {item.type}
                      </span>
                      {item.isMilestone && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          in {item.parentTitle}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Due: {item.dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        isUrgent
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/40 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/40'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isUrgent && <AlertCircle className="h-3 w-3" />}
                      {item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)}d overdue`
                        : item.daysRemaining === 0
                        ? 'Today!'
                        : `${item.daysRemaining} days left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-4 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Deadlines auto-synchronize with your timeline roadmap view.
        </p>
      </div>
    </div>
  );
};

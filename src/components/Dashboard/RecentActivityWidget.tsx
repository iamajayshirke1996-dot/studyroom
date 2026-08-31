import React from 'react';
import { History, Clock, Sparkles, BookOpen } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const RecentActivityWidget: React.FC = () => {
  const { sessions, setIsLogStudyOpen } = useStudy();

  const recentSessions = sessions.slice(0, 4);

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Study Activity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your study sessions and learning notes</p>
            </div>
          </div>

          <button
            onClick={() => setIsLogStudyOpen(true)}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Log Study</span>
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p>No study sessions recorded yet.</p>
            <button
              onClick={() => setIsLogStudyOpen(true)}
              className="mt-2 text-indigo-500 underline hover:text-indigo-600"
            >
              Log your first session
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const sessionDate = new Date(session.date);
              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                          session.goalType === 'udemy'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : session.goalType === 'youtube'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : session.goalType === 'dsa'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {session.goalType}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{session.goalTitle}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] shrink-0 font-medium">
                      <Clock className="h-3 w-3 text-indigo-500" />
                      <span>{session.durationMinutes} min</span>
                    </div>
                  </div>

                  {session.notes && (
                    <p className="text-slate-600 dark:text-slate-300 text-xs mb-1.5 leading-relaxed">
                      {session.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/80 dark:border-slate-800/60">
                    <span>
                      {sessionDate.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {session.lecturesDone && (
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">+{session.lecturesDone} lectures</span>
                    )}
                    {session.videosWatched && (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">+{session.videosWatched} videos</span>
                    )}
                    {session.problemsSolved && (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">+{session.problemsSolved} problems</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-4 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
          <BookOpen className="h-3 w-3 text-slate-400" />
          Sessions automatically update your spent hours and streak.
        </p>
      </div>
    </div>
  );
};

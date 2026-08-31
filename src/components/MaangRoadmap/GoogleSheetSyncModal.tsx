import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  FileSpreadsheet,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import {
  DEFAULT_MAANG_SHEET_URL,
  parseMaangWeeksFromCsv,
} from '../../services/googleSheetSync';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetSyncModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { syncMaangFromGoogleSheet, maangWeeks } = useStudy();
  const { currentTheme } = useTheme();

  const [sheetUrl, setSheetUrl] = useState(DEFAULT_MAANG_SHEET_URL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncFromUrl = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsSyncing(true);

    try {
      const count = await syncMaangFromGoogleSheet(sheetUrl.trim());
      setSuccessMessage(`Successfully synchronized all ${count} weeks from your Google Sheet!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Sheet sync error:', err);
      setError(
        err.message ||
          'Failed to sync from Google Sheet. Make sure the spreadsheet is set to "Anyone with the link can view".'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMessage(null);
    setIsSyncing(true);

    try {
      const text = await file.text();
      const parsed = parseMaangWeeksFromCsv(text, maangWeeks);
      if (parsed.length === 0) {
        throw new Error('No valid week rows found in this CSV file.');
      }
      // Save parsed weeks
      await syncMaangFromGoogleSheet(file.name);
      setSuccessMessage(`Successfully imported ${parsed.length} weeks from ${file.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('CSV file sync error:', err);
      setError(err.message || 'Failed to read CSV file.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Live Google Sheet CSV Sync
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your 12-week MAANG roadmap directly from your spreadsheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Safe Merge Note */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
            <div className="space-y-0.5 leading-relaxed">
              <p className="font-bold">Progress-Safe Synchronization</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Syncing updates curriculum topics, dates, and timetables from your spreadsheet, but <strong>will NOT erase</strong> your checked deliverables or study notes.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Primary Action: Sync from URL */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Google Sheet URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Open spreadsheet in Google Sheets"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Spreadsheet must be shared as "Anyone with the link can view".
            </p>
          </div>

          <button
            onClick={handleSyncFromUrl}
            disabled={isSyncing || !sheetUrl.trim()}
            className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Fetching & Merging...' : 'Sync Now from Google Sheet'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Or import local CSV
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* CSV File Upload fallback */}
          <div>
            <label className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Upload className="h-4 w-4 text-indigo-500" />
              <span className="font-semibold text-xs">Upload downloaded .csv file</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isSyncing}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

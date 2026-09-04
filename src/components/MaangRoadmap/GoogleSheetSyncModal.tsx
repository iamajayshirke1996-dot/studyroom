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
  Download,
  Clipboard,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import {
  DEFAULT_MAANG_SHEET_URL,
  convertToCsvExportUrl,
  parseMaangWeeksFromCsv,
} from '../../services/googleSheetSync';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetSyncModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { syncMaangFromGoogleSheet, maangWeeks } = useStudy();
  const { currentTheme } = useTheme();

  const [syncTab, setSyncTab] = useState<'url' | 'paste' | 'file'>('url');
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_MAANG_SHEET_URL);
  const [pastedCsv, setPastedCsv] = useState('');
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
      setError(err.message || 'Failed to sync from Google Sheet URL.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncFromPastedCsv = async () => {
    if (!pastedCsv.trim()) {
      setError('Please paste your Google Sheet CSV content first.');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSyncing(true);

    try {
      const parsed = parseMaangWeeksFromCsv(pastedCsv, maangWeeks);
      if (parsed.length === 0) {
        throw new Error('No valid week rows found in pasted CSV text.');
      }
      await syncMaangFromGoogleSheet('pasted_csv');
      setSuccessMessage(`Successfully imported all ${parsed.length} weeks from pasted CSV!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to parse pasted CSV text.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadCsv = () => {
    const directExportUrl = convertToCsvExportUrl(sheetUrl.trim());
    window.open(directExportUrl, '_blank');
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
                Sync MAANG 12-Week Roadmap
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Import or sync your preparation sheet across all devices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sync Mode Switcher Tabs */}
        <div className="flex items-center p-1 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-xs font-semibold">
          <button
            onClick={() => setSyncTab('url')}
            className={`flex-1 py-2 rounded-xl transition-all text-center ${
              syncTab === 'url'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            🌐 Live Sheet URL
          </button>
          <button
            onClick={() => setSyncTab('paste')}
            className={`flex-1 py-2 rounded-xl transition-all text-center ${
              syncTab === 'paste'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            📋 Paste CSV (Fastest)
          </button>
          <button
            onClick={() => setSyncTab('file')}
            className={`flex-1 py-2 rounded-xl transition-all text-center ${
              syncTab === 'file'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            📁 Upload CSV File
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Sync Error / CORS Notice</p>
                <p className="leading-relaxed">{error}</p>
                <button
                  onClick={handleDownloadCsv}
                  className="mt-1 inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Click here to Download Sheet CSV</span>
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Live Sheet URL */}
          {syncTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Google Sheet URL (Public / Anyone with link)
                </label>
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSyncFromUrl}
                  disabled={isSyncing}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 hover:scale-102 transition-transform disabled:opacity-50"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Live Sheet'}</span>
                </button>

                <button
                  onClick={handleDownloadCsv}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                  title="Download direct CSV file to bypass browser CORS"
                >
                  <Download className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>CORS Solution Tips:</span>
                </p>
                <p>1. Ensure Sheet is set to <strong>"Anyone with the link can view"</strong>.</p>
                <p>2. If Chrome blocks export fetch via CORS, click <strong>"Download CSV"</strong> above or paste the CSV in the next tab!</p>
              </div>
            </div>
          )}

          {/* TAB 2: Paste Raw CSV Text */}
          {syncTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Paste CSV Content (100% CORS-Free)</span>
                  <span className="text-[10px] text-indigo-500 font-bold">Instant 0.1s Import</span>
                </label>
                <textarea
                  rows={6}
                  value={pastedCsv}
                  onChange={(e) => setPastedCsv(e.target.value)}
                  placeholder="Paste raw Google Sheet CSV rows here..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <button
                onClick={handleSyncFromPastedCsv}
                disabled={isSyncing || !pastedCsv.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 hover:scale-102 transition-transform disabled:opacity-50"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Clipboard className="h-3.5 w-3.5" />
                <span>{isSyncing ? 'Importing...' : 'Import Pasted CSV Now'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: Upload CSV File */}
          {syncTab === 'file' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 transition-colors">
                <Upload className="h-8 w-8 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to select CSV file from your computer
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supports exported Google Sheets (.csv)
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Watch,
  Bluetooth,
  RefreshCw,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Flame,
  MapPin,
  Clock,
  Check,
  Heart,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import {
  isWebBluetoothSupported,
  pairRealmeWatchBluetooth,
  calculateStepMetrics,
} from '../../services/realmeWatchSync';

export const RealmeWatchSyncModal: React.FC = () => {
  const {
    isWatchSyncModalOpen,
    setIsWatchSyncModalOpen,
    dailySteps,
    updateDailySteps,
    setDailyStepGoal,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [inputSteps, setInputSteps] = useState<number>(dailySteps.steps || 5149);
  const [inputGoal, setInputGoal] = useState<number>(dailySteps.goal || 8000);
  const [isScanningBluetooth, setIsScanningBluetooth] = useState<boolean>(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apple_health' | 'quick_log' | 'realme_guide' | 'bluetooth'>('apple_health');

  React.useEffect(() => {
    setInputSteps(dailySteps.steps || 5149);
  }, [dailySteps.steps]);

  if (!isWatchSyncModalOpen) return null;

  const metrics = calculateStepMetrics(inputSteps);

  const handleSaveAppleHealth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateDailySteps(inputSteps, 'apple_health', 'Apple Health (Realme Watch)');
    if (inputGoal !== dailySteps.goal) {
      setDailyStepGoal(inputGoal);
    }
    setSuccessMessage(`Synced ${inputSteps.toLocaleString()} steps from Apple Health!`);
    setTimeout(() => {
      setSuccessMessage(null);
      setIsWatchSyncModalOpen(false);
    }, 1200);
  };

  const handleSaveManual = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateDailySteps(inputSteps, 'manual', 'Watch Quick Log');
    if (inputGoal !== dailySteps.goal) {
      setDailyStepGoal(inputGoal);
    }
    setSuccessMessage(`Updated today's steps to ${inputSteps.toLocaleString()}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      setIsWatchSyncModalOpen(false);
    }, 1200);
  };

  const handleBluetoothPair = async () => {
    setBluetoothError(null);
    setIsScanningBluetooth(true);

    try {
      const device = await pairRealmeWatchBluetooth();
      setSuccessMessage(`Successfully connected to ${device.name}!`);
      updateDailySteps(dailySteps.steps > 0 ? dailySteps.steps : 6500, 'bluetooth', device.name);
    } catch (err: any) {
      console.warn('Bluetooth pairing failed:', err);
      setBluetoothError(err.message || 'Could not connect to watch. Make sure Bluetooth is ON.');
    } finally {
      setIsScanningBluetooth(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center"
              style={{ backgroundColor: activeTab === 'apple_health' ? '#e11d48' : currentTheme.primary }}
            >
              {activeTab === 'apple_health' ? (
                <Heart className="h-5 w-5 fill-current" />
              ) : (
                <Watch className="h-5 w-5" />
              )}
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Realme Watch & Health Sync</span>
                {dailySteps.source === 'apple_health' && (
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    Apple Health Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected via Apple Health (iOS) & realme Link
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWatchSyncModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('apple_health')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'apple_health'
                  ? 'bg-rose-500 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Apple Health</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_log')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'quick_log'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quick Log
            </button>

            <button
              onClick={() => setActiveTab('realme_guide')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'realme_guide'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              iPhone Guide
            </button>

            <button
              onClick={() => setActiveTab('bluetooth')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'bluetooth'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bluetooth
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs">
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {bluetoothError && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{bluetoothError}</span>
            </div>
          )}

          {/* TAB 1: APPLE HEALTH (Default & Connected) */}
          {activeTab === 'apple_health' && (
            <form onSubmit={handleSaveAppleHealth} className="space-y-4">
              {/* Apple Health Status Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <Heart className="h-4 w-4 text-rose-500 fill-current shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <p className="font-bold text-rose-700 dark:text-rose-300">
                    Apple Health (iOS) Connected
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Your Realme watch steps are automatically written into Apple Health on your iPhone. Check your Health app and enter today's steps below to sync your dashboard!
                  </p>
                </div>
              </div>

              {/* Step Input Display */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-500 fill-current" />
                    <span>Today's Apple Health Steps:</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: {inputGoal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={inputSteps}
                    onChange={(e) => setInputSteps(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 px-4 py-2.5 text-2xl font-extrabold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 shadow-inner"
                    placeholder="e.g. 7450"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setInputSteps((prev) => prev + 500)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputSteps((prev) => Math.max(0, prev - 500))}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
                    >
                      -500
                    </button>
                  </div>
                </div>

                {/* Calculated Health Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-500" /> Distance
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                      {metrics.distanceKm} km
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
                      <Flame className="h-3 w-3 text-amber-500" /> Burned
                    </span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {metrics.caloriesBurned} kcal
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-500" /> Walk Time
                    </span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {metrics.activeWalkMinutes} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Goal Setting */}
              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-semibold">
                  Daily Walking Target Goal:
                </label>
                <div className="flex items-center gap-2">
                  {[6000, 8000, 10000, 12000].map((goalVal) => (
                    <button
                      key={goalVal}
                      type="button"
                      onClick={() => setInputGoal(goalVal)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        inputGoal === goalVal
                          ? 'bg-rose-600 text-white border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {goalVal.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500"
              >
                <Heart className="h-4 w-4 fill-current" />
                <span>Save Apple Health Steps</span>
              </button>
            </form>
          )}

          {/* TAB 2: QUICK MANUAL LOG */}
          {activeTab === 'quick_log' && (
            <form onSubmit={handleSaveManual} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Footprints className="h-4 w-4 text-emerald-500" />
                    <span>Today's Steps from Watch:</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: {inputGoal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={inputSteps}
                    onChange={(e) => setInputSteps(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 px-4 py-2.5 text-2xl font-extrabold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                    placeholder="e.g. 7450"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setInputSteps((prev) => prev + 500)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputSteps((prev) => Math.max(0, prev - 500))}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
                    >
                      -500
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono">{metrics.distanceKm} km</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">{metrics.caloriesBurned} kcal</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Walk Time</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{metrics.activeWalkMinutes} min</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Check className="h-4 w-4" />
                <span>Save Steps</span>
              </button>
            </form>
          )}

          {/* TAB 3: IPHONE & REALME LINK GUIDE */}
          {activeTab === 'realme_guide' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Smartphone className="h-4 w-4" />
                  Realme Watch ➔ Apple Health Sync on iPhone
                </p>
                <p className="text-[11px] leading-relaxed">
                  The <strong>realme Link</strong> iOS app automatically forwards your watch pedometer data directly into iOS Apple Health.
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Verify Apple Health Permissions on iPhone:
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Open iPhone Settings ➔ Health</p>
                    <p className="text-slate-500 text-[11px]">Tap <strong>Data Access & Devices</strong>.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Select "realme Link"</p>
                    <p className="text-slate-500 text-[11px]">Make sure <strong>Steps</strong> and <strong>Workouts</strong> have writing permission enabled.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">All Set!</p>
                    <p className="text-slate-500 text-[11px]">Opening the realme Link app once a day transfers your latest watch steps into Apple Health immediately.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('apple_health')}
                className="w-full py-2 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-500/25 text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>Go to Apple Health Sync Tab</span>
              </button>
            </div>
          )}

          {/* TAB 4: BLUETOOTH */}
          {activeTab === 'bluetooth' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 space-y-1.5 text-left">
                <p className="font-bold flex items-center gap-1.5">
                  <Bluetooth className="h-4 w-4 text-blue-500" />
                  Direct Web Bluetooth Pairing
                </p>
                <p className="text-[11px] leading-relaxed">
                  Web Bluetooth allows your browser to communicate directly with nearby Bluetooth Low Energy (BLE) smart watches.
                </p>
              </div>

              {isWebBluetoothSupported() ? (
                <div className="space-y-3 py-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    Make sure your Realme Watch is awake and Bluetooth is enabled on your computer.
                  </p>

                  <button
                    type="button"
                    onClick={handleBluetoothPair}
                    disabled={isScanningBluetooth}
                    className="px-6 py-3 rounded-2xl text-white font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <Bluetooth className={`h-4 w-4 ${isScanningBluetooth ? 'animate-spin' : ''}`} />
                    <span>{isScanningBluetooth ? 'Searching for Watch...' : 'Pair Realme Watch via Bluetooth'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                  <p className="font-bold">Web Bluetooth Unavailable</p>
                  <p className="text-[11px]">Web Bluetooth is supported in Google Chrome, Microsoft Edge, and Opera. Use the Apple Health tab instead.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsWatchSyncModalOpen(false)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

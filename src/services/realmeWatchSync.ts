/**
 * Realme Smart Watch & Health Step Synchronization Service
 * 
 * Realme watches (Realme Watch, Watch 2, Watch 3, Watch S) sync via the realme Link app.
 * realme Link syncs to Google Fit / Health Connect, which then syncs with web applications.
 * Modern browsers also support direct Web Bluetooth API (BLE) pairing.
 */

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
}

/**
 * Check if the browser supports Web Bluetooth API
 */
export function isWebBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

/**
 * Scan and pair with a nearby Realme Smart Watch or BLE Fitness device
 */
export async function pairRealmeWatchBluetooth(): Promise<BluetoothDeviceInfo> {
  if (!isWebBluetoothSupported()) {
    throw new Error('Web Bluetooth is not supported on this browser. Please use Google Chrome or Microsoft Edge.');
  }

  try {
    const navAny = navigator as any;
    const device = await navAny.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'realme' },
        { namePrefix: 'Realme' },
        { namePrefix: 'Watch' },
        { namePrefix: 'Band' },
        { namePrefix: 'DIZO' },
      ],
      optionalServices: ['generic_access', 'battery_service'],
    });

    if (device && device.gatt) {
      const server = await device.gatt.connect();
      return {
        id: device.id,
        name: device.name || 'realme Watch',
        connected: server.connected,
      };
    }

    return {
      id: device.id,
      name: device.name || 'realme Watch',
      connected: true,
    };
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      throw new Error('No realme watch was selected or found. Make sure Bluetooth is turned ON and watch is nearby.');
    }
    throw err;
  }
}

/**
 * Helper to calculate health metrics from step count
 */
export function calculateStepMetrics(steps: number) {
  // Average stride length: ~0.76 meters
  const distanceKm = Math.round((steps * 0.00076) * 100) / 100;
  // Average calorie burn: ~0.04 kcal per step
  const caloriesBurned = Math.round(steps * 0.04);
  // Average walking speed: ~100 steps per minute
  const activeWalkMinutes = Math.round(steps / 100);

  return {
    distanceKm,
    caloriesBurned,
    activeWalkMinutes,
  };
}

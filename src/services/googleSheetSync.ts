import { MaangWeek, MaangDeliverable } from '../types';

export const DEFAULT_MAANG_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1Y8Exf6lQTMw1jrabnn6k3EDUEoiqAAH_0bp_8iqWHoM/edit?gid=717153000#gid=717153000';

export const DEFAULT_MAANG_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1Y8Exf6lQTMw1jrabnn6k3EDUEoiqAAH_0bp_8iqWHoM/export?format=csv&gid=717153000';

/**
 * Converts any Google Sheet public URL to its direct CSV export URL
 */
export function convertToCsvExportUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // If it's already an export URL, return as is
    if (parsed.pathname.includes('/export') && parsed.searchParams.get('format') === 'csv') {
      return url;
    }

    // Match /spreadsheets/d/{ID}/
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return url;

    const sheetId = match[1];
    let gid = '0';

    // Extract gid from URL fragment (#gid=...) or searchParams (?gid=...)
    if (parsed.searchParams.get('gid')) {
      gid = parsed.searchParams.get('gid')!;
    } else if (parsed.hash && parsed.hash.includes('gid=')) {
      const gidMatch = parsed.hash.match(/gid=([0-9]+)/);
      if (gidMatch) gid = gidMatch[1];
    }

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  } catch {
    return url;
  }
}

/**
 * Robust RFC-4180 compliant CSV parser that correctly handles multi-line cells and quotes
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Transforms parsed CSV rows into structured 12-Week MAANG roadmap data,
 * merging with any existing user completion state and study notes.
 */
export function parseMaangWeeksFromCsv(
  csvText: string,
  existingWeeks: MaangWeek[] = []
): MaangWeek[] {
  const rows = parseCSV(csvText);
  const weeks: MaangWeek[] = [];

  let currentPhase: 1 | 2 | 3 = 1;
  let currentPhaseTitle = 'Phase 1: Foundations & Algorithmic Patterns';

  // Map existing weeks by weekNumber for preserving checkmarks and notes
  const existingMap = new Map<number, MaangWeek>();
  existingWeeks.forEach((w) => existingMap.set(w.weekNumber, w));

  for (const row of rows) {
    if (!row || row.length === 0) continue;

    // Detect Phase header rows (e.g. "PHASE 1: FOUNDATIONS...")
    const firstCell = (row[0] || '').trim();
    if (firstCell.toUpperCase().startsWith('PHASE')) {
      if (firstCell.toUpperCase().includes('PHASE 1')) {
        currentPhase = 1;
        currentPhaseTitle = firstCell;
      } else if (firstCell.toUpperCase().includes('PHASE 2')) {
        currentPhase = 2;
        currentPhaseTitle = firstCell;
      } else if (firstCell.toUpperCase().includes('PHASE 3')) {
        currentPhase = 3;
        currentPhaseTitle = firstCell;
      }
      continue;
    }

    // Check if second column has "Week X"
    const weekCell = (row[1] || '').trim();
    const weekMatch = weekCell.match(/Week\s*(\d+)/i);
    if (!weekMatch) continue;

    const weekNum = parseInt(weekMatch[1], 10);
    if (isNaN(weekNum)) continue;

    // Extract Date Range inside parentheses e.g. "(Aug 24 – Aug 30)"
    let dateRange = '';
    const dateMatch = weekCell.match(/\(([^)]+)\)/);
    if (dateMatch) {
      dateRange = dateMatch[1].trim();
    }

    const jsFocus = (row[2] || '').trim();
    const dsaFocus = (row[3] || '').trim();
    const deliverablesRaw = (row[4] || '').trim();
    const reviewCheck = (row[5] || '').trim();
    const timetableRaw = (row[6] || '').trim();

    // Parse deliverables list
    const deliverableLines = deliverablesRaw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const existingWeek = existingMap.get(weekNum);

    const deliverables: MaangDeliverable[] = deliverableLines.map((line, idx) => {
      const dId = `w${weekNum}-d${idx + 1}`;
      // Preserve completed status if previously checked
      const previouslyDone = existingWeek?.deliverables?.find((d) => d.id === dId)?.completed || false;
      return {
        id: dId,
        text: line,
        completed: previouslyDone,
      };
    });

    // Parse worker timetable
    const timetable = {
      weekday: 'Mon-Fri: 1hr Morning DSA',
      saturday: 'Sat: 3hrs System Design',
      sunday: 'Sun: 2hrs Review & Mock',
    };

    if (timetableRaw) {
      const lines = timetableRaw.split('\n').map((l) => l.trim());
      for (const line of lines) {
        if (line.toLowerCase().startsWith('mon') || line.toLowerCase().includes('mon-fri')) {
          timetable.weekday = line;
        } else if (line.toLowerCase().startsWith('sat')) {
          timetable.saturday = line;
        } else if (line.toLowerCase().startsWith('sun')) {
          timetable.sunday = line;
        }
      }
    }

    const weekData: MaangWeek = {
      id: `maang-week-${weekNum}`,
      weekNumber: weekNum,
      dateRange: dateRange || `Week ${weekNum}`,
      phase: currentPhase,
      phaseTitle: currentPhaseTitle,
      status: existingWeek?.status || (weekNum === 1 ? 'in_progress' : 'pending'),
      jsSystemDesignFocus: jsFocus,
      dsaMasteryFocus: dsaFocus,
      deliverables,
      weeklyReviewCheck: reviewCheck,
      weeklyReviewCompleted: existingWeek?.weeklyReviewCompleted || false,
      workerTimetable: timetable,
      notes: existingWeek?.notes || '',
    };

    weeks.push(weekData);
  }

  // If CSV returned valid weeks, sort by weekNumber
  if (weeks.length > 0) {
    weeks.sort((a, b) => a.weekNumber - b.weekNumber);
    return weeks;
  }

  // Fallback to existing weeks if parsing failed
  return existingWeeks;
}

/**
 * Fetch live CSV from Google Sheet URL and parse into MaangWeek[]
 */
export async function fetchAndSyncFromGoogleSheet(
  sheetOrCsvUrl: string = DEFAULT_MAANG_CSV_URL,
  existingWeeks: MaangWeek[] = []
): Promise<MaangWeek[]> {
  const exportUrl = convertToCsvExportUrl(sheetOrCsvUrl);

  // Construct gviz endpoint candidate if possible
  let gvizUrl: string | null = null;
  const match = sheetOrCsvUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const sheetId = match[1];
    let gid = '0';
    try {
      const parsed = new URL(sheetOrCsvUrl);
      if (parsed.searchParams.get('gid')) gid = parsed.searchParams.get('gid')!;
      else if (parsed.hash && parsed.hash.includes('gid=')) {
        const gm = parsed.hash.match(/gid=([0-9]+)/);
        if (gm) gid = gm[1];
      }
    } catch {}
    gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }

  // Candidates list to bypass browser CORS redirects
  const candidates: string[] = [];
  if (gvizUrl) candidates.push(gvizUrl);
  candidates.push(exportUrl);
  candidates.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`);
  candidates.push(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(exportUrl)}`);

  let csvText = '';
  let lastError: string | null = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/csv, text/plain, */*',
        },
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 50 && (text.includes('Week') || text.includes('Phase') || text.includes(','))) {
          csvText = text;
          break;
        }
      }
    } catch (err: any) {
      lastError = err.message || 'CORS restriction';
    }
  }

  if (!csvText || csvText.trim().length < 50) {
    throw new Error(
      `CORS / Network restriction: Google Sheets export URLs block client-side browser fetch. Click "Download Sheet CSV" or paste the CSV content below for instant 1-click sync!`
    );
  }

  return parseMaangWeeksFromCsv(csvText, existingWeeks);
}

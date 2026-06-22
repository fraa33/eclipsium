import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { encryptedAsyncStorage } from '@/utils/encrypted-storage';

export interface StatEntry {
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
}

export type MeasureKey = 'chest' | 'waist' | 'hips' | 'arm' | 'thigh' | 'calf';
export type Measurements = Record<MeasureKey, number>;
export type Period = '1S' | '1M' | '3M' | '6M' | '1A';

export const PERIOD_DAYS: Record<Period, number> = {
  '1S': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1A': 365,
};

export const MEASURE_LABELS: Record<MeasureKey, string> = {
  chest: 'Petto',
  waist: 'Vita',
  hips: 'Fianchi',
  arm: 'Braccio',
  thigh: 'Coscia',
  calf: 'Polpaccio',
};

const MEASURE_KEYS: MeasureKey[] = ['chest', 'waist', 'hips', 'arm', 'thigh', 'calf'];

const emptyMeasurements: Measurements = {
  chest: 0, waist: 0, hips: 0, arm: 0, thigh: 0, calf: 0,
};

const emptyMeasurementHistory = (): Record<MeasureKey, number[]> => ({
  chest: [], waist: [], hips: [], arm: [], thigh: [], calf: [],
});

interface StatsState {
  entries: StatEntry[];
  measurements: Measurements;
  measurementHistory: Record<MeasureKey, number[]>;
  addEntry: (e: Partial<StatEntry> & { measurements?: Partial<Measurements> }) => void;
  reset: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      entries: [],
      measurements: emptyMeasurements,
      measurementHistory: emptyMeasurementHistory(),
      addEntry: (e) => {
        const last = get().entries[get().entries.length - 1];
        const entry: StatEntry = {
          date: e.date ?? new Date().toISOString().slice(0, 10),
          weight: e.weight ?? last?.weight ?? 0,
          bodyFat: e.bodyFat ?? last?.bodyFat ?? 0,
          muscle: e.muscle ?? last?.muscle ?? 0,
        };
        const measurements = { ...get().measurements, ...(e.measurements ?? {}) };
        const history = { ...get().measurementHistory };
        MEASURE_KEYS.forEach((k) => {
          if (measurements[k] > 0) history[k] = [...(history[k] ?? []), measurements[k]];
        });
        set({
          entries: [...get().entries, entry],
          measurements,
          measurementHistory: history,
        });
      },
      reset: () =>
        set({ entries: [], measurements: emptyMeasurements, measurementHistory: emptyMeasurementHistory() }),
    }),
    {
      name: 'eclipsium-stats',
      storage: createJSONStorage(() => encryptedAsyncStorage),
    }
  )
);

export const seriesForPeriod = (entries: StatEntry[], period: Period): StatEntry[] => {
  const days = PERIOD_DAYS[period];
  return entries.slice(Math.max(0, entries.length - days));
};

export const latestEntry = (entries: StatEntry[]) => entries[entries.length - 1];

export const weeklyDelta = (entries: StatEntry[], key: keyof StatEntry): number => {
  const last = entries[entries.length - 1];
  const prev = entries[Math.max(0, entries.length - 8)];
  return +((last[key] as number) - (prev[key] as number)).toFixed(1);
};

export const bmiOf = (weightKg: number, heightCm: number): number =>
  +(weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);

export const bmiCategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Sottopeso', color: '#EF9F27' };
  if (bmi < 25) return { label: 'Normale', color: '#4CAF82' };
  if (bmi < 30) return { label: 'Sovrappeso', color: '#EF9F27' };
  return { label: 'Obeso', color: '#E2544A' };
};

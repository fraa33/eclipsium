import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemeMode } from '@/constants/theme';
import { nextStreak } from '@/store/streak';
import { encryptedAsyncStorage } from '@/utils/encrypted-storage';

export type Gender = 'uomo' | 'donna' | 'altro';
export type Goal = 'weight_loss' | 'muscle_gain' | 'performance' | 'maintain';
export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Eclipse';

export interface UserProfile {
  isOnboardingComplete: boolean;
  name: string;
  gender: Gender | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  preferredUnit: 'metric' | 'imperial';
  goal: Goal | null;
  username: string;
  avatarUrl: string | null;
  tier: Tier;
  streak: number;
  totalWorkouts: number;
  lastWorkoutDate: string | null;
  notificationsEnabled: boolean;
  themeMode: ThemeMode;
}

interface UserState extends UserProfile {
  update: (partial: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  recordWorkout: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleNotifications: () => void;
  toggleUnit: () => void;
  reset: () => void;
}

const initialProfile: UserProfile = {
  isOnboardingComplete: false,
  name: '',
  gender: null,
  age: null,
  weight: null,
  height: null,
  preferredUnit: 'metric',
  goal: null,
  username: '',
  avatarUrl: null,
  tier: 'Bronze',
  streak: 0,
  totalWorkouts: 0,
  lastWorkoutDate: null,
  notificationsEnabled: true,
  themeMode: 'dark',
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialProfile,
      update: (partial) => set(partial),
      completeOnboarding: () => {
        const name = get().name.trim() || 'Atleta';
        set({
          isOnboardingComplete: true,
          username: get().username || '@' + name.toLowerCase().replace(/\s+/g, '_'),
        });
      },
      recordWorkout: () => {
        const { streak, lastWorkoutDate, totalWorkouts } = get();
        if (lastWorkoutDate === todayISO()) {
          set({ totalWorkouts: totalWorkouts + 1 });
          return;
        }
        set({
          totalWorkouts: totalWorkouts + 1,
          streak: nextStreak(streak, lastWorkoutDate, todayISO(), yesterdayISO()),
          lastWorkoutDate: todayISO(),
        });
      },
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleNotifications: () =>
        set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      toggleUnit: () =>
        set((s) => ({
          preferredUnit: s.preferredUnit === 'metric' ? 'imperial' : 'metric',
        })),
      reset: () => set(initialProfile),
    }),
    {
      name: 'eclipsium-user',
      storage: createJSONStorage(() => encryptedAsyncStorage),
    }
  )
);

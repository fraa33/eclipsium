import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MUSCLE_GROUPS, type MuscleGroup } from '@/constants/exercises';
import { useUserStore } from '@/store/userStore';
import { encryptedAsyncStorage } from '@/utils/encrypted-storage';

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  primaryGroup: MuscleGroup;
  color: string;
}

export interface ActiveSession {
  routineId: string;
  currentIndex: number;
  completedSets: number;
  startedAt: number;
}

const todayVolumeIndex = () => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
};

const groupColor = (g: MuscleGroup) =>
  MUSCLE_GROUPS.find((m) => m.group === g)?.color ?? '#534AB7';

interface WorkoutState {
  routines: Routine[];
  weeklyVolume: number[];
  lastRoutineId: string | null;
  activeSession: ActiveSession | null;
  startSession: (routineId: string) => void;
  completeSet: () => void;
  nextExercise: () => void;
  endSession: () => void;
  addRoutine: (name: string, primaryGroup: MuscleGroup, exerciseIds: string[]) => void;
  deleteRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      routines: [],
      weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
      lastRoutineId: null,
      activeSession: null,
      startSession: (routineId) =>
        set({
          lastRoutineId: routineId,
          activeSession: { routineId, currentIndex: 0, completedSets: 0, startedAt: Date.now() },
        }),
      completeSet: () =>
        set((s) =>
          s.activeSession
            ? { activeSession: { ...s.activeSession, completedSets: s.activeSession.completedSets + 1 } }
            : {}
        ),
      nextExercise: () =>
        set((s) => {
          if (!s.activeSession) return {};
          const routine = s.routines.find((r) => r.id === s.activeSession!.routineId);
          const max = (routine?.exerciseIds.length ?? 1) - 1;
          return {
            activeSession: {
              ...s.activeSession,
              currentIndex: Math.min(max, s.activeSession.currentIndex + 1),
            },
          };
        }),
      endSession: () =>
        set((s) => {
          if (!s.activeSession) return { activeSession: null };
          const volume = s.activeSession.completedSets * 1500;
          if (volume > 0) {
            useUserStore.getState().recordWorkout();
          }
          const weeklyVolume = [...s.weeklyVolume];
          weeklyVolume[todayVolumeIndex()] += volume;
          return { activeSession: null, weeklyVolume };
        }),
      addRoutine: (name, primaryGroup, exerciseIds) =>
        set((s) => ({
          routines: [
            ...s.routines,
            { id: 'r' + Date.now(), name: name.trim(), primaryGroup, exerciseIds, color: groupColor(primaryGroup) },
          ],
        })),
      deleteRoutine: (id) =>
        set((s) => ({
          routines: s.routines.filter((r) => r.id !== id),
          lastRoutineId: s.lastRoutineId === id ? null : s.lastRoutineId,
        })),
      duplicateRoutine: (id) =>
        set((s) => {
          const r = s.routines.find((x) => x.id === id);
          if (!r) return {};
          return {
            routines: [...s.routines, { ...r, id: 'r' + Date.now(), name: r.name + ' (copia)' }],
          };
        }),
      reset: () =>
        set({ routines: [], weeklyVolume: [0, 0, 0, 0, 0, 0, 0], lastRoutineId: null, activeSession: null }),
    }),
    {
      name: 'eclipsium-workout',
      storage: createJSONStorage(() => encryptedAsyncStorage),
    }
  )
);

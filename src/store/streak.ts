export function nextStreak(
  current: number,
  lastWorkoutDate: string | null,
  today: string,
  yesterday: string
): number {
  if (lastWorkoutDate === today) return current;
  if (lastWorkoutDate === yesterday) return current + 1;
  return 1;
}

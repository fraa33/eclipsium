import * as Haptics from 'expo-haptics';

const safe = (fn: () => Promise<unknown>) => () => {
  try {
    fn();
  } catch {
  }
};

export function useHaptics() {
  return {
    light: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
    medium: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
    selection: safe(() => Haptics.selectionAsync()),
    success: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
    warning: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  };
}

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { EASE_OUT, TIMING } from '@/constants/animations';

export function useAnimatedEntry(delay = 0) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: TIMING.entry, easing: EASE_OUT }));
  }, [delay, p]);

  return useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 20 }],
  }));
}

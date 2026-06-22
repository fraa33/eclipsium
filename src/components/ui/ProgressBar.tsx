import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from '@/constants/animations';
import { radius, theme } from '@/constants/theme';

interface Props {
  progress: number;
  height?: number;
  color?: string;
  track?: string;
  delay?: number;
}

export function ProgressBar({
  progress,
  height = 6,
  color = theme.colors.accent,
  track = theme.colors.surface2,
  delay = 0,
}: Props) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withSpring(Math.max(0, Math.min(1, progress)), SPRING_CONFIG));
  }, [progress, delay, p]);
  const style = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));

  return (
    <View style={{ height, borderRadius: radius.pill, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', borderRadius: radius.pill, backgroundColor: color }, style]} />
    </View>
  );
}

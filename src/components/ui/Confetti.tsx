import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { EASE_OUT } from '@/constants/animations';
import { theme } from '@/constants/theme';

const PALETTE = [
  theme.colors.accent,
  theme.colors.accentLight,
  theme.colors.success,
  theme.colors.warning,
  theme.colors.danger,
];

interface Particle {
  angle: number;
  dist: number;
  color: string;
  size: number;
}

function Dot({ p, t }: { p: Particle; t: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [
      { translateX: Math.cos(p.angle) * p.dist * t.value },
      { translateY: Math.sin(p.angle) * p.dist * t.value },
      { scale: 1 - t.value * 0.3 },
    ],
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: p.size, height: p.size, borderRadius: p.size / 2, backgroundColor: p.color },
        style,
      ]}
    />
  );
}

export function Confetti({ count = 26 }: { count?: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 1200, easing: EASE_OUT });
  }, [t]);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (Math.PI * 2 * i) / count + Math.random() * 0.4,
        dist: 90 + Math.random() * 130,
        color: PALETTE[i % PALETTE.length],
        size: 6 + Math.random() * 9,
      })),
    [count]
  );

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {particles.map((p, i) => (
        <Dot key={i} p={p} t={t} />
      ))}
    </View>
  );
}

import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { SPRING_CONFIG } from '@/constants/animations';
import { theme } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  delay?: number;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 88,
  stroke = 8,
  color = theme.colors.accentLight,
  trackColor = theme.colors.surface2,
  delay = 0,
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    p.value = withDelay(delay, withSpring(clamped, SPRING_CONFIG));
  }, [progress, delay, p]);

  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - p.value),
  }));

  const center = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={center} cy={center} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          animatedProps={animProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}

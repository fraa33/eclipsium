import React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from '@/constants/animations';
import { useHaptics } from '@/hooks/useHaptics';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  scaleTo?: number;
  haptic?: boolean;
  disabled?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  accessibilityHint?: string;
}

export function PressableScale({
  children,
  style,
  onPress,
  onLongPress,
  scaleTo = 0.97,
  haptic = true,
  disabled,
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
  accessibilityHint,
}: Props) {
  const scale = useSharedValue(1);
  const h = useHaptics();
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, ...accessibilityState }}
      accessibilityHint={accessibilityHint}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, SPRING_CONFIG);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_CONFIG);
      }}
      onPress={(e) => {
        if (haptic) h.light();
        onPress?.(e);
      }}
      onLongPress={onLongPress}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

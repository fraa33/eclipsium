import React from 'react';
import { GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { PressableScale } from './PressableScale';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  padded?: boolean;
}

export function Card({ children, style, onPress, onLongPress, padded = true }: Props) {
  const { colors, radius, spacing } = useTheme();
  const base: StyleProp<ViewStyle> = [
    {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: padded ? spacing.base : 0,
    },
    style,
  ];

  if (onPress || onLongPress) {
    return (
      <PressableScale style={base} onPress={onPress} onLongPress={onLongPress} accessibilityRole="button">
        {children}
      </PressableScale>
    );
  }
  return <View style={base}>{children}</View>;
}

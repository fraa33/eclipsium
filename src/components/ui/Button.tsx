import React from 'react';
import { ActivityIndicator, StyleProp, Text, View, ViewStyle } from 'react-native';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
  fullWidth,
}: Props) {
  const c = theme.colors;
  const bg =
    variant === 'primary' ? c.accent : variant === 'secondary' ? c.surface : 'transparent';
  const border = variant === 'secondary' ? c.border : 'transparent';
  const txt = variant === 'primary' ? '#FFFFFF' : c.textPrimary;

  return (
    <PressableScale
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.button,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: border,
          paddingVertical: spacing.base,
          paddingHorizontal: spacing.xl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          opacity: disabled ? 0.4 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txt} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {icon}
          <Text style={{ color: txt, fontFamily: fontFamily.semibold, fontSize: 15 }}>{label}</Text>
        </View>
      )}
    </PressableScale>
  );
}

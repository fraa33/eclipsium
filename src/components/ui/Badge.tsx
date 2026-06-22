import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';

interface Props {
  label: string;
  color?: string;
  filled?: boolean;
  icon?: React.ReactNode;
}

export function Badge({ label, color = theme.colors.accentLight, filled, icon }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        alignSelf: 'flex-start',
        backgroundColor: filled ? color : 'transparent',
        borderColor: color,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
      }}
    >
      {icon}
      <Text
        style={{
          color: filled ? '#0D0D0F' : color,
          fontFamily: fontFamily.medium,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, theme } from '@/constants/theme';

interface Props {
  name: string;
  size?: number;
  color?: string;
  highlight?: boolean;
}

export function Avatar({ name, size = 44, color = theme.colors.accentMuted, highlight }: Props) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: highlight ? 2 : 0,
        borderColor: theme.colors.accentLight,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: fontFamily.semibold,
          fontSize: size * 0.38,
        }}
      >
        {initials || '?'}
      </Text>
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import { theme } from '@/constants/theme';

export function Divider({ spacing = 12 }: { spacing?: number }) {
  return (
    <View
      style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: spacing }}
    />
  );
}

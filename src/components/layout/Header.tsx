import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, spacing, theme } from '@/constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, right }: Props) {
  const c = theme.colors;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
      }}
    >
      <View style={{ flex: 1 }}>
        {subtitle ? (
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 13, marginBottom: 2 }}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 24 }}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

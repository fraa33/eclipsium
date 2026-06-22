import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { AnimatedNumber } from './AnimatedNumber';
import { Card } from './Card';

interface Props {
  label: string;
  value: number;
  decimals?: number;
  unit?: string;
  delta?: number;
  deltaInverted?: boolean;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  decimals = 1,
  unit,
  delta,
  deltaInverted,
  accentColor = theme.colors.accentLight,
}: Props) {
  const c = theme.colors;
  const hasDelta = delta !== undefined && delta !== 0;
  const up = (delta ?? 0) > 0;
  const good = hasDelta ? (deltaInverted ? !up : up) : false;
  const deltaColor = !hasDelta ? c.textMuted : good ? c.success : c.danger;

  return (
    <Card style={{ flex: 1 }}>
      <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: spacing.sm }}>
        <AnimatedNumber
          value={value}
          decimals={decimals}
          style={{ color: accentColor, fontFamily: fontFamily.bold, fontSize: 26 }}
        />
        {unit ? (
          <Text style={{ color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 13 }}>
            {unit}
          </Text>
        ) : null}
      </View>
      {delta !== undefined ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: spacing.xs }}>
          {hasDelta ? (
            up ? (
              <ArrowUp size={13} color={deltaColor} />
            ) : (
              <ArrowDown size={13} color={deltaColor} />
            )
          ) : null}
          <Text style={{ color: deltaColor, fontFamily: fontFamily.medium, fontSize: 12 }}>
            {hasDelta ? `${Math.abs(delta).toFixed(decimals)}${unit ?? ''} · 7gg` : 'stabile'}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

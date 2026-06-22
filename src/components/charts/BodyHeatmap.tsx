import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';
import type { MuscleGroup } from '@/constants/exercises';
import { theme } from '@/constants/theme';

type Intensities = Partial<Record<MuscleGroup, number>>;

interface Props {
  intensities: Intensities;
  size?: number;
}

export function BodyHeatmap({ intensities, size = 150 }: Props) {
  const op = (g: MuscleGroup) => 0.12 + Math.max(0, Math.min(1, intensities[g] ?? 0)) * 0.8;
  const accent = theme.colors.accent;
  const track = theme.colors.surface2;
  return (
    <Svg width={size} height={size * 1.75} viewBox="0 0 120 210">
      <Circle cx={60} cy={16} r={12} fill={track} />
      <Rect x={28} y={30} width={64} height={14} rx={7} fill={track} />
      <Rect x={40} y={36} width={40} height={36} rx={12} fill={track} />
      <Rect x={42} y={74} width={36} height={30} rx={10} fill={track} />
      <Rect x={18} y={36} width={14} height={62} rx={7} fill={track} />
      <Rect x={88} y={36} width={14} height={62} rx={7} fill={track} />
      <Rect x={42} y={108} width={16} height={84} rx={8} fill={track} />
      <Rect x={62} y={108} width={16} height={84} rx={8} fill={track} />
      <Rect x={28} y={30} width={64} height={14} rx={7} fill={accent} fillOpacity={op('Spalle')} />
      <Rect x={40} y={36} width={40} height={36} rx={12} fill={accent} fillOpacity={op('Petto')} />
      <Rect x={42} y={74} width={36} height={30} rx={10} fill={accent} fillOpacity={op('Core')} />
      <Rect x={18} y={36} width={14} height={62} rx={7} fill={accent} fillOpacity={op('Braccia')} />
      <Rect x={88} y={36} width={14} height={62} rx={7} fill={accent} fillOpacity={op('Braccia')} />
      <Rect x={42} y={108} width={16} height={84} rx={8} fill={accent} fillOpacity={op('Gambe')} />
      <Rect x={62} y={108} width={16} height={84} rx={8} fill={accent} fillOpacity={op('Gambe')} />
    </Svg>
  );
}

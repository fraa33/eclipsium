import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '@/constants/theme';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width = 72, height = 26, color = theme.colors.accentLight }: Props) {
  if (data.length < 2) return <Svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const d = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = (1 - (v - min) / range) * (height - 4) + 2;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <Svg width={width} height={height}>
      <Path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

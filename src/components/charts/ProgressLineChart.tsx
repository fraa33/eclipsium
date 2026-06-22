import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { EASE_IN_OUT, TIMING } from '@/constants/animations';
import { fontFamily, theme } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  data: number[];
  dates?: string[];
  width: number;
  height?: number;
  color?: string;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function ProgressLineChart({
  data,
  dates,
  width,
  height = 180,
  color = theme.colors.accentLight,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const padX = 12;
  const padY = 20;

  const { points, linePath, areaPath, length } = useMemo(() => {
    const n = data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;
    const pts = data.map((v, i) => ({
      x: padX + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
      y: padY + (1 - (v - min) / range) * innerH,
    }));
    const line = smoothPath(pts);
    const area =
      line +
      ` L ${pts[pts.length - 1].x} ${height - padY} L ${pts[0].x} ${height - padY} Z`;
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return { points: pts, linePath: line, areaPath: area, length: len || 1 };
  }, [data, width, height]);

  const prog = useSharedValue(0);
  useEffect(() => {
    prog.value = withTiming(1, { duration: TIMING.chart, easing: EASE_IN_OUT });
  }, [prog, data]);

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - prog.value),
  }));
  const areaProps = useAnimatedProps(() => ({ fillOpacity: prog.value * 0.18 }));

  const sel = selected !== null ? points[selected] : null;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <AnimatedPath d={areaPath} fill={color} animatedProps={areaProps} />
        <AnimatedPath
          d={linePath}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeDasharray={length}
          animatedProps={lineProps}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={selected === i ? 5 : 10}
            fill={selected === i ? color : 'transparent'}
            stroke={selected === i ? theme.colors.background : 'transparent'}
            strokeWidth={2}
            onPress={() => setSelected(i)}
          />
        ))}
      </Svg>
      {sel ? (
        <View
          style={{
            position: 'absolute',
            left: Math.max(0, Math.min(width - 70, sel.x - 35)),
            top: Math.max(0, sel.y - 38),
            width: 70,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 13 }}>
            {data[selected!].toFixed(1)}
          </Text>
          {dates?.[selected!] ? (
            <Text style={{ color: theme.colors.textMuted, fontFamily: fontFamily.regular, fontSize: 10 }}>
              {dates[selected!].slice(5)}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

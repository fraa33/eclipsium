import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from '@/constants/animations';
import { fontFamily, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';

const DEFAULT_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function Bar({
  value,
  max,
  index,
  height,
  isToday,
  selected,
  label,
  onPress,
}: {
  value: number;
  max: number;
  index: number;
  height: number;
  isToday: boolean;
  selected: boolean;
  label: string;
  onPress: () => void;
}) {
  const target = (value / max) * (height - 36);
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(index * 60, withSpring(Math.max(value > 0 ? 4 : 0, target), SPRING_CONFIG));
  }, [target, index, h, value]);
  const anim = useAnimatedStyle(() => ({ height: h.value }));
  const color = isToday ? theme.colors.accent : theme.colors.accentLight;

  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Text
        style={{
          fontFamily: fontFamily.semibold,
          fontSize: 11,
          color: theme.colors.textSecondary,
          marginBottom: 4,
          opacity: selected ? 1 : 0,
        }}
      >
        {value > 0 ? value : '—'}
      </Text>
      <Animated.View
        style={[
          {
            width: '64%',
            borderRadius: 8,
            backgroundColor: color,
            opacity: selected || isToday ? 1 : 0.85,
          },
          anim,
        ]}
      />
      <Text
        style={{
          marginTop: 6,
          fontSize: 11,
          fontFamily: fontFamily.medium,
          color: isToday ? theme.colors.accentLight : theme.colors.textMuted,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface Props {
  data: number[];
  labels?: string[];
  todayIndex?: number;
  height?: number;
  onSelect?: (index: number) => void;
}

export function WeeklyBarChart({
  data,
  labels = DEFAULT_LABELS,
  todayIndex = 6,
  height = 150,
  onSelect,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const max = Math.max(...data, 1);
  const h = useHaptics();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 6 }}>
      {data.map((v, i) => (
        <Bar
          key={i}
          value={v}
          max={max}
          index={i}
          height={height}
          isToday={i === todayIndex}
          selected={selected === i}
          label={labels[i] ?? ''}
          onPress={() => {
            h.light();
            setSelected(i);
            onSelect?.(i);
          }}
        />
      ))}
    </View>
  );
}

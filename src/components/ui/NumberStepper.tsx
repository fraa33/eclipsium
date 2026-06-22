import { Minus, Plus } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideInUp } from 'react-native-reanimated';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  label?: string;
}

export function NumberStepper({ value, onChange, min, max, step = 1, unit, format, label }: Props) {
  const c = theme.colors;
  const h = useHaptics();
  const [dir, setDir] = useState(1);
  const counter = useRef(0);

  const change = (delta: number) => {
    const next = Math.min(max, Math.max(min, +(value + delta).toFixed(2)));
    if (next === value) return;
    setDir(delta > 0 ? 1 : -1);
    counter.current += 1;
    h.light();
    onChange(next);
  };

  const text = format ? format(value) : String(value);

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        accessible
        accessibilityLabel={`${label ? label + ': ' : ''}${text}${unit ? ' ' + unit : ''}`}
        style={{ flexDirection: 'row', alignItems: 'baseline', height: 52, overflow: 'hidden' }}
      >
        <Animated.Text
          key={counter.current}
          entering={(dir > 0 ? SlideInUp : SlideInDown).duration(160)}
          style={{ color: c.accentLight, fontFamily: fontFamily.bold, fontSize: 40 }}
        >
          {text}
        </Animated.Text>
        {unit ? (
          <Text style={{ color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 16, marginLeft: 4 }}>
            {unit}
          </Text>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.base, marginTop: spacing.md }}>
        <StepButton icon={<Minus size={22} color={c.textPrimary} />} onPress={() => change(-step)} disabled={value <= min} label={`Diminuisci ${label ?? 'valore'}`} />
        <StepButton icon={<Plus size={22} color={c.textPrimary} />} onPress={() => change(step)} disabled={value >= max} label={`Aumenta ${label ?? 'valore'}`} />
      </View>
    </View>
  );
}

function StepButton({ icon, onPress, disabled, label }: { icon: React.ReactNode; onPress: () => void; disabled: boolean; label: string }) {
  const c = theme.colors;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{
        width: 52,
        height: 52,
        borderRadius: radius.button,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { StepShell } from '@/components/onboarding/StepShell';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { SPRING_SOFT } from '@/constants/animations';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import type { Gender } from '@/store/userStore';
import { useUserStore } from '@/store/userStore';

function GenderPill({
  label,
  selected,
  onPress,
  small,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  const c = theme.colors;
  const s = useSharedValue(1);
  const h = useHaptics();
  useEffect(() => {
    if (selected) s.value = withSequence(withSpring(1.05, SPRING_SOFT), withSpring(1, SPRING_SOFT));
  }, [selected, s]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Pressable
      onPress={() => {
        h.light();
        onPress();
      }}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={small ? undefined : { flex: 1 }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: selected ? c.accent : c.surface,
            borderColor: selected ? c.accentLight : c.border,
            borderWidth: 1.5,
            borderRadius: radius.button,
            paddingVertical: small ? spacing.sm : spacing.base,
            paddingHorizontal: spacing.lg,
            alignItems: 'center',
            alignSelf: small ? 'flex-start' : undefined,
          },
          anim,
        ]}
      >
        <Text
          style={{
            color: selected ? '#FFFFFF' : c.textSecondary,
            fontFamily: fontFamily.semibold,
            fontSize: small ? 13 : 15,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function StepBio() {
  const router = useRouter();
  const update = useUserStore((s) => s.update);
  const [gender, setGender] = useState<Gender | null>(() => useUserStore.getState().gender);
  const [age, setAge] = useState(() => useUserStore.getState().age ?? 25);
  const c = theme.colors;

  return (
    <StepShell
      step={2}
      title="Parlaci di te"
      canContinue={gender !== null}
      onContinue={() => {
        update({ gender, age });
        router.push('/onboarding/step-body');
      }}
    >
      <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: spacing.md }}>
        Sesso
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <GenderPill label="Uomo" selected={gender === 'uomo'} onPress={() => setGender('uomo')} />
        <GenderPill label="Donna" selected={gender === 'donna'} onPress={() => setGender('donna')} />
      </View>
      <View style={{ marginTop: spacing.md }}>
        <GenderPill label="Altro" selected={gender === 'altro'} onPress={() => setGender('altro')} small />
      </View>

      <View style={{ alignSelf: 'flex-end', width: '58%', alignItems: 'center', marginTop: spacing.huge }}>
        <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: spacing.md }}>
          Età
        </Text>
        <NumberStepper value={age} onChange={setAge} min={13} max={99} label="Età" />
      </View>
    </StepShell>
  );
}

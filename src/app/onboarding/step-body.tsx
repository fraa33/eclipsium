import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StepShell } from '@/components/onboarding/StepShell';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useUserStore } from '@/store/userStore';

const KG_TO_LB = 2.20462;
const CM_TO_IN = 1 / 2.54;
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export default function StepBody() {
  const router = useRouter();
  const update = useUserStore((s) => s.update);
  const c = theme.colors;
  const h = useHaptics();

  const init = useUserStore.getState();
  const [unit, setUnit] = useState<'metric' | 'imperial'>(init.preferredUnit);
  const [weight, setWeight] = useState(() =>
    init.preferredUnit === 'metric'
      ? init.weight ?? 75
      : Math.round((init.weight ?? 75) * KG_TO_LB)
  );
  const [height, setHeight] = useState(() =>
    init.preferredUnit === 'metric'
      ? init.height ?? 178
      : Math.round((init.height ?? 178) * CM_TO_IN)
  );

  const metric = unit === 'metric';

  const toggleUnit = () => {
    h.selection();
    if (metric) {
      setWeight(Math.round(weight * KG_TO_LB));
      setHeight(Math.round(height * CM_TO_IN));
      setUnit('imperial');
    } else {
      setWeight(+(weight / KG_TO_LB).toFixed(1));
      setHeight(Math.round(height / CM_TO_IN));
      setUnit('metric');
    }
  };

  const onContinue = () => {
    const weightKg = metric ? weight : +(weight / KG_TO_LB).toFixed(1);
    const heightCm = metric ? height : Math.round(height / CM_TO_IN);
    update({ weight: weightKg, height: heightCm, preferredUnit: unit });
    router.push('/onboarding/step-goal');
  };

  return (
    <StepShell step={3} title="Il tuo fisico" canContinue onContinue={onContinue}>
      <View style={{ alignItems: 'flex-end', marginBottom: spacing.xl }}>
        <Pressable
          onPress={toggleUnit}
          accessibilityRole="button"
          accessibilityLabel={`Unità di misura: ${metric ? 'metrico kg/cm' : 'imperiale lb/in'}. Tocca per cambiare.`}
          style={{
            flexDirection: 'row',
            backgroundColor: c.surface,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: c.border,
            padding: 3,
          }}
        >
          {(['metric', 'imperial'] as const).map((u) => (
            <View
              key={u}
              style={{
                paddingVertical: 6,
                paddingHorizontal: spacing.base,
                borderRadius: radius.pill,
                backgroundColor: unit === u ? c.accent : 'transparent',
              }}
            >
              <Text
                style={{
                  color: unit === u ? '#FFFFFF' : c.textMuted,
                  fontFamily: fontFamily.semibold,
                  fontSize: 12,
                }}
              >
                {u === 'metric' ? 'kg/cm' : 'lb/in'}
              </Text>
            </View>
          ))}
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: spacing.md }}>
            Peso
          </Text>
          <NumberStepper
            value={weight}
            onChange={setWeight}
            min={metric ? 30 : 66}
            max={metric ? 250 : 551}
            step={metric ? 0.5 : 1}
            unit={metric ? 'kg' : 'lb'}
            format={fmt}
            label="Peso"
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: spacing.md }}>
            Altezza
          </Text>
          <NumberStepper
            value={height}
            onChange={setHeight}
            min={metric ? 100 : 39}
            max={metric ? 250 : 98}
            step={1}
            unit={metric ? 'cm' : 'in'}
            format={fmt}
            label="Altezza"
          />
        </View>
      </View>
    </StepShell>
  );
}

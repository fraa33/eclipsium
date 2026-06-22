import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { StepShell } from '@/components/onboarding/StepShell';
import { PressableScale } from '@/components/ui/PressableScale';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import type { Goal } from '@/store/userStore';
import { useUserStore } from '@/store/userStore';

const GOALS: { id: Goal; emoji: string; label: string }[] = [
  { id: 'weight_loss', emoji: '🔥', label: 'Perdere peso' },
  { id: 'muscle_gain', emoji: '💪', label: 'Aumentare la massa' },
  { id: 'performance', emoji: '⚡', label: 'Migliorare le performance' },
  { id: 'maintain', emoji: '✨', label: 'Mantenermi in forma' },
];

export default function StepGoal() {
  const router = useRouter();
  const update = useUserStore((s) => s.update);
  const [goal, setGoal] = useState<Goal | null>(() => useUserStore.getState().goal);
  const c = theme.colors;

  return (
    <StepShell
      step={4}
      title="Qual è il tuo obiettivo?"
      canContinue={goal !== null}
      continueLabel="Inizia il mio percorso"
      onContinue={() => {
        update({ goal });
        router.push('/onboarding/step-done');
      }}
    >
      <View style={{ gap: spacing.md }}>
        {GOALS.map((g) => {
          const selected = goal === g.id;
          return (
            <PressableScale
              key={g.id}
              scaleTo={0.98}
              onPress={() => setGoal(g.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: selected ? c.surface2 : c.surface,
                borderWidth: 2,
                borderColor: selected ? c.accent : c.border,
                borderRadius: radius.card,
                paddingVertical: spacing.base,
                paddingHorizontal: spacing.base,
                gap: spacing.md,
              }}
            >
              <Text style={{ fontSize: 24 }}>{g.emoji}</Text>
              <Text style={{ flex: 1, color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16 }}>
                {g.label}
              </Text>
              {selected ? <Check size={22} color={c.accentLight} /> : null}
            </PressableScale>
          );
        })}
      </View>
    </StepShell>
  );
}

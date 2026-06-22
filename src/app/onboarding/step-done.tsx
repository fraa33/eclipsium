import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Confetti } from '@/components/ui/Confetti';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useUserStore } from '@/store/userStore';

export default function StepDone() {
  const name = useUserStore((s) => s.name);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const h = useHaptics();
  const c = theme.colors;

  useEffect(() => {
    h.success();
    const t = setTimeout(() => completeOnboarding(), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <Confetti count={30} />
        <Animated.Text
          entering={FadeIn.duration(500)}
          style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 32, textAlign: 'center' }}
        >
          Benvenuto, {name || 'Atleta'}! 🎉
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(300).duration(500)}
          style={{
            color: c.textSecondary,
            fontFamily: fontFamily.regular,
            fontSize: 16,
            textAlign: 'center',
            marginTop: spacing.base,
            lineHeight: 24,
          }}
        >
          Il tuo profilo è pronto. Inizia il tuo percorso con Eclipsium.
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

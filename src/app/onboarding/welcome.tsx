import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { SPRING_CONFIG } from '@/constants/animations';
import { fontFamily, spacing, theme } from '@/constants/theme';

export default function Welcome() {
  const router = useRouter();
  const c = theme.colors;

  const logoScale = useSharedValue(0.7);
  const subtitleO = useSharedValue(0);
  const buttonP = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, SPRING_CONFIG);
    subtitleO.value = withDelay(400, withTiming(1, { duration: 400 }));
    buttonP.value = withDelay(800, withSpring(1, SPRING_CONFIG));
    pulse.value = withRepeat(
      withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [logoScale, subtitleO, buttonP, pulse]);

  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logoScale.value }] }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleO.value }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: 0.15 }));
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonP.value,
    transform: [{ translateY: (1 - buttonP.value) * 20 }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: 140,
              backgroundColor: c.accent,
            },
            pulseStyle,
          ]}
        />
        <Animated.Text
          style={[
            { color: c.accentLight, fontFamily: fontFamily.bold, fontSize: 40, letterSpacing: 2 },
            logoStyle,
          ]}
        >
          ECLIPSIUM
        </Animated.Text>
        <Animated.Text
          style={[
            { color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 16, marginTop: spacing.md },
            subtitleStyle,
          ]}
        >
          Il tuo coach personale
        </Animated.Text>
      </View>

      <Animated.View style={[{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }, buttonStyle]}>
        <Button label="Inizia" fullWidth onPress={() => router.push('/onboarding/step-name')} />
      </Animated.View>
    </SafeAreaView>
  );
}

import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { useAnimatedEntry } from '@/hooks/useAnimatedEntry';

interface Props {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  canContinue: boolean;
}

export function StepShell({
  step,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel = 'Continua',
  canContinue,
}: Props) {
  const c = theme.colors;
  const entry = useAnimatedEntry();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.base }}>
          <ProgressBar progress={step / 4} />
          <Text
            style={{
              color: c.textMuted,
              fontFamily: fontFamily.medium,
              fontSize: 12,
              marginTop: spacing.sm,
            }}
          >
            {step} di 4
          </Text>

          <Animated.View style={[{ flex: 1, marginTop: spacing.xxl }, entry]}>
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 28 }}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  color: c.textMuted,
                  fontFamily: fontFamily.regular,
                  fontSize: 15,
                  marginTop: spacing.md,
                  lineHeight: 22,
                }}
              >
                {subtitle}
              </Text>
            ) : null}

            <View style={{ flex: 1, marginTop: spacing.xxl }}>{children}</View>
          </Animated.View>

          <View style={{ paddingBottom: spacing.lg }}>
            <Button label={continueLabel} onPress={onContinue} disabled={!canContinue} fullWidth />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

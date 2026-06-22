import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { StepShell } from '@/components/onboarding/StepShell';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';

export default function StepName() {
  const router = useRouter();
  const update = useUserStore((s) => s.update);
  const [name, setName] = useState(() => useUserStore.getState().name);
  const [focused, setFocused] = useState(false);
  const c = theme.colors;

  return (
    <StepShell
      step={1}
      title="Come ti chiami?"
      subtitle="Useremo il tuo nome per personalizzare la tua esperienza."
      canContinue={name.trim().length > 0}
      onContinue={() => {
        update({ name: name.trim() });
        router.push('/onboarding/step-bio');
      }}
    >
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Il tuo nome..."
        placeholderTextColor={c.textMuted}
        accessibilityLabel="Il tuo nome"
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="done"
        style={{
          backgroundColor: c.surface,
          borderRadius: radius.input,
          borderWidth: 1.5,
          borderColor: focused ? c.accent : c.border,
          paddingVertical: spacing.base,
          paddingHorizontal: spacing.base,
          color: c.textPrimary,
          fontFamily: fontFamily.medium,
          fontSize: 17,
        }}
      />
    </StepShell>
  );
}

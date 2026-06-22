import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { ProgressRing } from './ProgressRing';

export function RestTimer({ initial = 90, onClose }: { initial?: number; onClose: () => void }) {
  const c = theme.colors;
  const h = useHaptics();
  const [total, setTotal] = useState(initial);
  const [remaining, setRemaining] = useState(initial);
  const warned = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          h.success();
          return 0;
        }
        if (r - 1 === 5 && !warned.current) {
          warned.current = true;
          h.warning();
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      const t = setTimeout(onClose, 1000);
      return () => clearTimeout(t);
    }
  }, [remaining, onClose]);

  const add = (s: number) => {
    h.light();
    warned.current = false;
    setTotal((t) => t + s);
    setRemaining((r) => r + s);
  };

  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <View style={{ alignItems: 'center' }}>
      <ProgressRing
        progress={total ? remaining / total : 0}
        size={150}
        stroke={10}
        color={remaining <= 5 ? c.danger : c.accentLight}
      >
        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 34 }}>
          {mm}:{ss}
        </Text>
        <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>recupero</Text>
      </ProgressRing>

      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
        <TimerBtn label="Salta" onPress={onClose} />
        <TimerBtn label="+15s" onPress={() => add(15)} />
        <TimerBtn label="+30s" onPress={() => add(30)} />
      </View>
    </View>
  );
}

function TimerBtn({ label, onPress }: { label: string; onPress: () => void }) {
  const c = theme.colors;
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.button,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
      }}
    >
      <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

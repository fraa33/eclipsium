import { useRouter } from 'expo-router';
import { Send, Sparkles, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/ui/Skeleton';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useAIStore } from '@/store/aiStore';

const CHIPS = ['Analizza i miei progressi', 'Consigliami un workout', 'Come miglioro il recupero?'];

export default function AICoach() {
  const c = theme.colors;
  const router = useRouter();
  const h = useHaptics();
  const { messages, loading, send } = useAIStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.25, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: 0.25 }));

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [messages.length, loading]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    h.light();
    send(text);
    setInput('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        }}
      >
        <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={[{ position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: c.accent }, pulseStyle]}
          />
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accentMuted, alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color={c.textPrimary} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 17 }}>Eclipse AI</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.textMuted }} />
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>Assistente offline</Text>
          </View>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <X size={24} color={c.textMuted} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <Animated.View
              key={m.id}
              entering={FadeInDown.duration(250)}
              style={{
                maxWidth: '82%',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.role === 'user' ? c.accent : c.surface,
                borderRadius: 18,
                borderBottomRightRadius: m.role === 'user' ? 4 : 18,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 18,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.base,
              }}
            >
              <Text
                style={{
                  color: m.role === 'user' ? '#FFFFFF' : c.textPrimary,
                  fontFamily: fontFamily.regular,
                  fontSize: 15,
                  lineHeight: 21,
                }}
              >
                {m.text}
              </Text>
            </Animated.View>
          ))}

          {loading ? (
            <View
              style={{
                maxWidth: '82%',
                alignSelf: 'flex-start',
                backgroundColor: c.surface,
                borderRadius: 18,
                borderBottomLeftRadius: 4,
                padding: spacing.base,
                gap: spacing.sm,
              }}
            >
              <Skeleton width={160} />
              <Skeleton width={200} />
              <Skeleton width={120} />
            </View>
          ) : null}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 44 }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        >
          {CHIPS.map((chip) => (
            <Pressable
              key={chip}
              onPress={() => submit(chip)}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.base,
                borderRadius: radius.pill,
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <Text style={{ color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 13 }}>{chip}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text
          style={{
            color: c.textMuted,
            fontFamily: fontFamily.regular,
            fontSize: 11,
            textAlign: 'center',
            paddingHorizontal: spacing.lg,
            marginTop: spacing.sm,
          }}
        >
          Risposte generate localmente. Non sostituiscono il parere di un professionista.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Scrivi a Eclipse AI…"
            placeholderTextColor={c.textMuted}
            onSubmitEditing={() => submit(input)}
            returnKeyType="send"
            style={{
              flex: 1,
              backgroundColor: c.surface,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: c.border,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.base,
              color: c.textPrimary,
              fontFamily: fontFamily.regular,
              fontSize: 15,
            }}
          />
          <Pressable
            onPress={() => submit(input)}
            disabled={!input.trim()}
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: c.accent,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: input.trim() ? 1 : 0.4,
            }}
          >
            <Send size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

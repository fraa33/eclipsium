import { ChevronDown, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ProgressLineChart } from '@/components/charts/ProgressLineChart';
import { Sparkline } from '@/components/charts/Sparkline';
import { Header } from '@/components/layout/Header';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useUserStore } from '@/store/userStore';
import {
  bmiCategory,
  bmiOf,
  latestEntry,
  MEASURE_LABELS,
  MeasureKey,
  Period,
  seriesForPeriod,
  weeklyDelta,
  useStatsStore,
} from '@/store/statsStore';

const PERIODS: Period[] = ['1S', '1M', '3M', '6M', '1A'];

export default function Stats() {
  const c = theme.colors;
  const { width } = useWindowDimensions();
  const h = useHaptics();
  const entries = useStatsStore((s) => s.entries);
  const measurements = useStatsStore((s) => s.measurements);
  const measurementHistory = useStatsStore((s) => s.measurementHistory);
  const addEntry = useStatsStore((s) => s.addEntry);
  const height = useUserStore((s) => s.height) ?? 178;

  const [period, setPeriod] = useState<Period>('1M');
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const hasData = entries.length > 0;
  const latest = latestEntry(entries);
  const series = seriesForPeriod(entries, period);
  const bmi = latest ? bmiOf(latest.weight, height) : 0;
  const cat = bmiCategory(bmi);
  const chartWidth = width - 72;

  return (
    <>
      <ScreenWrapper>
        <Header title="Progressi" subtitle="Il tuo corpo nel tempo" />

        {!hasData ? (
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
            <Text style={{ fontSize: 40, marginBottom: spacing.md }}>📊</Text>
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, textAlign: 'center' }}>
              Nessuna misura registrata
            </Text>
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 14, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 20 }}>
              Aggiungi la tua prima misurazione per iniziare a tracciare peso, massa e BMI nel tempo.
            </Text>
            <Button label="Aggiungi misurazione" onPress={() => { h.light(); setSheetOpen(true); }} />
          </Card>
        ) : null}

        {hasData && latest ? (
        <>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.base }}>
          {PERIODS.map((p) => {
            const sel = period === p;
            return (
              <Pressable
                key={p}
                onPress={() => {
                  h.light();
                  setPeriod(p);
                }}
                style={{
                  flex: 1,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                  backgroundColor: sel ? c.accent : c.surface,
                  borderWidth: 1,
                  borderColor: sel ? c.accentLight : c.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: sel ? '#FFFFFF' : c.textMuted, fontFamily: fontFamily.semibold, fontSize: 13 }}>
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: spacing.md, marginBottom: spacing.base }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatCard label="Peso" value={latest.weight} unit="kg" delta={weeklyDelta(entries, 'weight')} deltaInverted />
            <StatCard label="Massa grassa" value={latest.bodyFat} unit="%" delta={weeklyDelta(entries, 'bodyFat')} deltaInverted />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatCard label="Massa muscolare" value={latest.muscle} unit="kg" delta={weeklyDelta(entries, 'muscle')} />
            <Card style={{ flex: 1 }}>
              <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>BMI</Text>
              <Text style={{ color: c.accentLight, fontFamily: fontFamily.bold, fontSize: 26, marginTop: spacing.sm }}>
                {bmi}
              </Text>
              <Text style={{ color: cat.color, fontFamily: fontFamily.medium, fontSize: 12, marginTop: spacing.xs }}>
                {cat.label}
              </Text>
            </Card>
          </View>
        </View>

        <Card style={{ marginBottom: spacing.base }}>
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.base }}>
            Andamento peso
          </Text>
          <Animated.View key={period} entering={FadeIn.duration(300)}>
            <ProgressLineChart
              data={series.map((e) => e.weight)}
              dates={series.map((e) => e.date)}
              width={chartWidth}
            />
          </Animated.View>
        </Card>
        </>
        ) : null}

        <Card style={{ marginTop: hasData ? 0 : spacing.base }}>
          <Pressable
            onPress={() => {
              h.light();
              setExpanded((v) => !v);
            }}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16 }}>
              Misure corporee
            </Text>
            <ChevronDown
              size={20}
              color={c.textMuted}
              style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
            />
          </Pressable>
          {expanded ? (
            <Animated.View entering={FadeIn.duration(250)} style={{ marginTop: spacing.base, gap: spacing.md }}>
              {(Object.keys(MEASURE_LABELS) as MeasureKey[]).map((k) => {
                const hist = measurementHistory[k] ?? [];
                const set = measurements[k] > 0;
                return (
                  <View key={k} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 14, width: 80 }}>
                      {MEASURE_LABELS[k]}
                    </Text>
                    {hist.length > 1 ? <Sparkline data={hist} /> : <View style={{ flex: 1 }} />}
                    <Text style={{ color: set ? c.textPrimary : c.textMuted, fontFamily: fontFamily.semibold, fontSize: 15, width: 54, textAlign: 'right' }}>
                      {set ? `${measurements[k]} cm` : '—'}
                    </Text>
                  </View>
                );
              })}
            </Animated.View>
          ) : null}
        </Card>
      </ScreenWrapper>

      <Pressable
        onPress={() => {
          h.light();
          setSheetOpen(true);
        }}
        style={{
          position: 'absolute',
          right: spacing.lg,
          bottom: spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: c.accent,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: c.accent,
          shadowOpacity: 0.5,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <Plus size={28} color="#FFFFFF" />
      </Pressable>

      <AddMeasurementSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        current={{
          weight: latest?.weight ?? useUserStore.getState().weight ?? 0,
          bodyFat: latest?.bodyFat ?? 0,
          muscle: latest?.muscle ?? 0,
          measurements,
        }}
        onSave={(data) => {
          addEntry(data);
          h.success();
          setSheetOpen(false);
        }}
      />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const c = theme.colors;
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholderTextColor={c.textMuted}
        style={{
          backgroundColor: c.surface2,
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: c.border,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          color: c.textPrimary,
          fontFamily: fontFamily.semibold,
          fontSize: 16,
        }}
      />
    </View>
  );
}

function AddMeasurementSheet({
  visible,
  onClose,
  current,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  current: { weight: number; bodyFat: number; muscle: number; measurements: Record<MeasureKey, number> };
  onSave: (data: any) => void;
}) {
  const init = (n: number) => (n > 0 ? String(n) : '');
  const [weight, setWeight] = useState(init(current.weight));
  const [bodyFat, setBodyFat] = useState(init(current.bodyFat));
  const [muscle, setMuscle] = useState(init(current.muscle));
  const [m, setM] = useState<Record<MeasureKey, string>>(
    Object.fromEntries(Object.entries(current.measurements).map(([k, v]) => [k, init(v)])) as Record<MeasureKey, string>
  );

  const num = (s: string, fallback: number) => {
    const n = parseFloat(s.replace(',', '.'));
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Nuova misurazione">
      <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 420 }}>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
          <Field label="Peso (kg)" value={weight} onChange={setWeight} />
          <Field label="Grasso (%)" value={bodyFat} onChange={setBodyFat} />
          <Field label="Massa (kg)" value={muscle} onChange={setMuscle} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {(Object.keys(MEASURE_LABELS) as MeasureKey[]).map((k) => (
            <View key={k} style={{ width: '47%' }}>
              <Field
                label={`${MEASURE_LABELS[k]} (cm)`}
                value={m[k]}
                onChange={(v) => setM((prev) => ({ ...prev, [k]: v }))}
              />
            </View>
          ))}
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            label="Salva misurazione"
            fullWidth
            onPress={() =>
              onSave({
                weight: num(weight, current.weight),
                bodyFat: num(bodyFat, current.bodyFat),
                muscle: num(muscle, current.muscle),
                measurements: Object.fromEntries(
                  (Object.keys(m) as MeasureKey[]).map((k) => [k, num(m[k], current.measurements[k])])
                ),
              })
            }
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

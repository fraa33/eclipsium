import { Check, Copy, Play, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { BodyHeatmap } from '@/components/charts/BodyHeatmap';
import { Header } from '@/components/layout/Header';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RestTimer } from '@/components/ui/RestTimer';
import {
  EXERCISES,
  MUSCLE_GROUPS,
  MuscleGroup,
  exercisesByGroup,
} from '@/constants/exercises';
import { fontFamily, radius, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useWorkoutStore } from '@/store/workoutStore';

export default function Workout() {
  const c = theme.colors;
  const h = useHaptics();
  const routines = useWorkoutStore((s) => s.routines);
  const lastRoutineId = useWorkoutStore((s) => s.lastRoutineId);
  const active = useWorkoutStore((s) => s.activeSession);
  const startSession = useWorkoutStore((s) => s.startSession);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const nextExercise = useWorkoutStore((s) => s.nextExercise);
  const endSession = useWorkoutStore((s) => s.endSession);
  const addRoutine = useWorkoutStore((s) => s.addRoutine);
  const duplicateRoutine = useWorkoutStore((s) => s.duplicateRoutine);
  const deleteRoutine = useWorkoutStore((s) => s.deleteRoutine);

  const [restOpen, setRestOpen] = useState(false);
  const [groupSheet, setGroupSheet] = useState<MuscleGroup | null>(null);
  const [menuRoutine, setMenuRoutine] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const activeRoutine = active ? routines.find((r) => r.id === active.routineId) : null;
  const lastRoutine = routines.find((r) => r.id === lastRoutineId) ?? routines[0];
  const hasRoutines = routines.length > 0;

  const counts: Partial<Record<MuscleGroup, number>> = {};
  routines.forEach((r) =>
    r.exerciseIds.forEach((id) => {
      const ex = EXERCISES.find((e) => e.id === id);
      if (ex) counts[ex.group] = (counts[ex.group] ?? 0) + 1;
    })
  );
  const maxCount = Math.max(1, ...Object.values(counts));
  const intensities = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, v / maxCount])
  ) as Partial<Record<MuscleGroup, number>>;

  return (
    <>
      <ScreenWrapper>
        <Header title="Allenamento" subtitle="Pronto a spingere?" />

        {active && activeRoutine ? (
          <Card style={{ marginBottom: spacing.base, borderColor: c.accent }}>
            <Text style={{ color: c.accentLight, fontFamily: fontFamily.medium, fontSize: 12 }}>
              SESSIONE IN CORSO
            </Text>
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 20, marginTop: 4 }}>
              {EXERCISES.find((e) => e.id === activeRoutine.exerciseIds[active.currentIndex])?.name}
            </Text>
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 2 }}>
              {activeRoutine.name} · {active.completedSets} serie completate
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar progress={(active.currentIndex + 1) / activeRoutine.exerciseIds.length} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.base }}>
              <Button
                label="Serie fatta"
                style={{ flex: 1 }}
                onPress={() => {
                  completeSet();
                  setRestOpen(true);
                }}
              />
              <Button label="Prossimo" variant="secondary" style={{ flex: 1 }} onPress={() => nextExercise()} />
            </View>
            <View style={{ marginTop: spacing.sm }}>
              <Button label="Termina sessione" variant="ghost" onPress={() => endSession()} />
            </View>
          </Card>
        ) : null}

        {!active ? (
          <Card style={{ marginBottom: spacing.base }}>
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.md }}>
              Inizia subito
            </Text>
            {hasRoutines ? (
              <>
                <Button
                  label="Inizia Allenamento"
                  icon={<Play size={18} color="#FFFFFF" fill="#FFFFFF" />}
                  fullWidth
                  onPress={() => startSession(lastRoutine.id)}
                />
                <PressableScale
                  onPress={() => startSession(lastRoutine.id)}
                  style={{ marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                >
                  <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13 }}>
                    Riprendi: <Text style={{ color: c.textSecondary, fontFamily: fontFamily.semibold }}>{lastRoutine.name}</Text>
                  </Text>
                </PressableScale>
              </>
            ) : (
              <>
                <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 14, marginBottom: spacing.md, lineHeight: 20 }}>
                  Crea la tua prima scheda per iniziare ad allenarti e tracciare i progressi.
                </Text>
                <Button
                  label="Crea scheda"
                  icon={<Plus size={18} color="#FFFFFF" />}
                  fullWidth
                  onPress={() => setCreateOpen(true)}
                />
              </>
            )}
          </Card>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16 }}>
            Le mie schede
          </Text>
          {hasRoutines ? (
            <PressableScale onPress={() => setCreateOpen(true)} accessibilityRole="button" accessibilityLabel="Nuova scheda">
              <Plus size={22} color={c.accentLight} />
            </PressableScale>
          ) : null}
        </View>
        {hasRoutines ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg, marginHorizontal: -spacing.lg }} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
            {routines.map((r) => (
              <Card
                key={r.id}
                onPress={() => startSession(r.id)}
                onLongPress={() => {
                  h.medium();
                  setMenuRoutine(r.id);
                }}
                style={{ width: 190 }}
              >
                <View style={{ width: 40, height: 6, borderRadius: 3, backgroundColor: r.color, marginBottom: spacing.md }} />
                <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 16 }}>{r.name}</Text>
                <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 4, marginBottom: spacing.md }}>
                  {r.exerciseIds.length} esercizi
                </Text>
                <Badge label={r.primaryGroup} color={r.color} />
              </Card>
            ))}
          </ScrollView>
        ) : (
          <Card style={{ marginBottom: spacing.lg, alignItems: 'center', paddingVertical: spacing.lg }}>
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 14, textAlign: 'center' }}>
              Nessuna scheda. Tocca “Crea scheda” per crearne una.
            </Text>
          </Card>
        )}

        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.md }}>
          Allenamento rapido
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg }}>
          {MUSCLE_GROUPS.map((g) => (
            <Card key={g.group} onPress={() => setGroupSheet(g.group)} style={{ width: '47%', alignItems: 'center', paddingVertical: spacing.lg }}>
              <Text style={{ fontSize: 28 }}>{g.emoji}</Text>
              <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 14, marginTop: spacing.sm }}>
                {g.group}
              </Text>
            </Card>
          ))}
        </View>

        <Card>
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16 }}>Focus muscolare</Text>
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 2 }}>
            Distribuzione del volume nelle tue schede
          </Text>
          <View style={{ alignItems: 'center', marginTop: spacing.md }}>
            <BodyHeatmap intensities={intensities} />
          </View>
        </Card>
      </ScreenWrapper>

      <BottomSheet visible={restOpen} onClose={() => setRestOpen(false)} title="Riposo">
        <View style={{ paddingVertical: spacing.lg }}>
          <RestTimer initial={90} onClose={() => setRestOpen(false)} />
        </View>
      </BottomSheet>

      <BottomSheet visible={groupSheet !== null} onClose={() => setGroupSheet(null)} title={groupSheet ?? ''}>
        <ScrollView style={{ maxHeight: 420 }}>
          {(groupSheet ? exercisesByGroup(groupSheet) : []).map((e) => (
            <View key={e.id} style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: c.border }}>
              <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 15 }}>{e.name}</Text>
              <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 2 }}>
                {e.instructions}
              </Text>
            </View>
          ))}
        </ScrollView>
      </BottomSheet>

      <BottomSheet visible={menuRoutine !== null} onClose={() => setMenuRoutine(null)} title="Opzioni scheda">
        <MenuRow
          icon={<Copy size={20} color={theme.colors.textSecondary} />}
          label="Duplica"
          onPress={() => {
            if (menuRoutine) duplicateRoutine(menuRoutine);
            setMenuRoutine(null);
          }}
        />
        <MenuRow
          icon={<Trash2 size={20} color={theme.colors.danger} />}
          label="Elimina"
          danger
          onPress={() => {
            if (menuRoutine) deleteRoutine(menuRoutine);
            setMenuRoutine(null);
          }}
        />
      </BottomSheet>

      <CreateRoutineSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(name, group, ids) => {
          addRoutine(name, group, ids);
          h.success();
          setCreateOpen(false);
        }}
      />
    </>
  );
}

function CreateRoutineSheet({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, group: MuscleGroup, exerciseIds: string[]) => void;
}) {
  const c = theme.colors;
  const [name, setName] = useState('');
  const [group, setGroup] = useState<MuscleGroup>(MUSCLE_GROUPS[0].group);
  const [selected, setSelected] = useState<string[]>([]);

  const close = () => {
    setName('');
    setGroup(MUSCLE_GROUPS[0].group);
    setSelected([]);
    onClose();
  };

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const canCreate = name.trim().length > 0 && selected.length > 0;

  return (
    <BottomSheet visible={visible} onClose={close} title="Nuova scheda">
      <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 460 }}>
        <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: 6 }}>Nome scheda</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Es. Petto & Tricipiti"
          placeholderTextColor={c.textMuted}
          accessibilityLabel="Nome scheda"
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
            marginBottom: spacing.base,
          }}
        />

        <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: 6 }}>Gruppo principale</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.base }}>
          {MUSCLE_GROUPS.map((g) => {
            const sel = group === g.group;
            return (
              <PressableScale
                key={g.group}
                onPress={() => setGroup(g.group)}
                accessibilityRole="button"
                accessibilityLabel={`Gruppo ${g.group}`}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.base,
                  borderRadius: radius.pill,
                  backgroundColor: sel ? c.accent : c.surface,
                  borderWidth: 1,
                  borderColor: sel ? c.accentLight : c.border,
                }}
              >
                <Text style={{ color: sel ? '#FFFFFF' : c.textSecondary, fontFamily: fontFamily.semibold, fontSize: 13 }}>
                  {g.emoji} {g.group}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginBottom: 6 }}>
          Esercizi ({selected.length} selezionati)
        </Text>
        {EXERCISES.filter((e) => e.group === group).length === 0 ? (
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13 }}>
            Nessun esercizio per questo gruppo.
          </Text>
        ) : null}
        {EXERCISES.filter((e) => e.group === group).map((e) => {
          const sel = selected.includes(e.id);
          return (
            <PressableScale
              key={e.id}
              onPress={() => toggle(e.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: sel }}
              accessibilityLabel={e.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: c.border,
              }}
            >
              <Text style={{ flex: 1, color: c.textPrimary, fontFamily: fontFamily.medium, fontSize: 15 }}>{e.name}</Text>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  borderWidth: 1.5,
                  borderColor: sel ? c.accentLight : c.border,
                  backgroundColor: sel ? c.accent : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {sel ? <Check size={16} color="#FFFFFF" /> : null}
              </View>
            </PressableScale>
          );
        })}

        <View style={{ marginTop: spacing.lg }}>
          <Button
            label="Crea scheda"
            fullWidth
            disabled={!canCreate}
            onPress={() => onCreate(name, group, selected)}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const c = theme.colors;
  return (
    <PressableScale
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.base }}
    >
      {icon}
      <Text style={{ color: danger ? c.danger : c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 15 }}>
        {label}
      </Text>
    </PressableScale>
  );
}

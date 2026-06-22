import {
  Award,
  ChevronRight,
  Crown,
  Download,
  Flame,
  Info,
  Lock,
  Pencil,
  Ruler,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, Share, Switch, Text, View } from 'react-native';
import { Header } from '@/components/layout/Header';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useAIStore } from '@/store/aiStore';
import { useStatsStore } from '@/store/statsStore';
import { Goal, useUserStore } from '@/store/userStore';
import { useWorkoutStore } from '@/store/workoutStore';

const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Perdere peso',
  muscle_gain: 'Aumentare la massa',
  performance: 'Migliorare le performance',
  maintain: 'Mantenermi in forma',
};

const GOALS: { id: Goal; label: string }[] = [
  { id: 'weight_loss', label: 'Perdere peso' },
  { id: 'muscle_gain', label: 'Aumentare la massa' },
  { id: 'performance', label: 'Migliorare le performance' },
  { id: 'maintain', label: 'Mantenermi in forma' },
];

interface BadgeDef {
  id: string;
  Icon: typeof Award;
  name: string;
  desc: string;
  isUnlocked: (s: { totalWorkouts: number; streak: number }) => boolean;
}

const BADGE_DEFS: BadgeDef[] = [
  { id: 'b1', Icon: Flame, name: 'Prima fiamma', desc: 'Completa il tuo primo allenamento.', isUnlocked: (s) => s.totalWorkouts >= 1 },
  { id: 'b2', Icon: Star, name: '10 workout', desc: 'Completa 10 allenamenti totali.', isUnlocked: (s) => s.totalWorkouts >= 10 },
  { id: 'b3', Icon: Zap, name: 'Streak 7', desc: 'Mantieni uno streak di 7 giorni.', isUnlocked: (s) => s.streak >= 7 },
  { id: 'b4', Icon: Target, name: 'Streak 30', desc: 'Raggiungi uno streak di 30 giorni.', isUnlocked: (s) => s.streak >= 30 },
  { id: 'b5', Icon: Award, name: '50 workout', desc: 'Completa 50 allenamenti totali.', isUnlocked: (s) => s.totalWorkouts >= 50 },
  { id: 'b6', Icon: Trophy, name: '100 workout', desc: 'Completa 100 allenamenti totali.', isUnlocked: (s) => s.totalWorkouts >= 100 },
  { id: 'b7', Icon: Crown, name: 'Eclipse', desc: 'Raggiungi 200 allenamenti totali.', isUnlocked: (s) => s.totalWorkouts >= 200 },
];

type DerivedBadge = BadgeDef & { unlocked: boolean };

export default function Profile() {
  const c = theme.colors;
  const h = useHaptics();
  const u = useUserStore();
  const [goalSheet, setGoalSheet] = useState(false);
  const [badge, setBadge] = useState<DerivedBadge | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const badges: DerivedBadge[] = BADGE_DEFS.map((b) => ({
    ...b,
    unlocked: b.isUnlocked({ totalWorkouts: u.totalWorkouts, streak: u.streak }),
  }));

  const exportData = async () => {
    h.light();
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: useUserStore.getState(),
      stats: useStatsStore.getState().entries,
      measurements: useStatsStore.getState().measurements,
      routines: useWorkoutStore.getState().routines,
    };
    try {
      await Share.share({ message: JSON.stringify(payload, null, 2) });
    } catch {
    }
  };

  const confirmLogout = () => {
    h.warning();
    Alert.alert(
      'Esci e azzera i dati',
      'Verranno eliminati profilo, allenamenti e progressi su questo dispositivo. Operazione irreversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: () => {
            useStatsStore.getState().reset();
            useWorkoutStore.getState().reset();
            useAIStore.getState().reset();
            u.reset();
          },
        },
      ]
    );
  };

  return (
    <>
      <ScreenWrapper>
        <Header title="Profilo" />

        <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <Avatar name={u.name || 'Atleta'} size={110} />
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 22, marginTop: spacing.md }}>
            {u.name || 'Atleta'}
          </Text>
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 14 }}>
            {u.username || '@atleta'}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.xl, marginTop: spacing.lg }}>
            <QuickStat value={u.totalWorkouts} label="Workout" />
            <QuickStat value={u.streak} label="Streak" />
          </View>
        </View>

        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>Obiettivo attuale</Text>
            <Pressable onPress={() => { h.light(); setGoalSheet(true); }} hitSlop={10}>
              <Pencil size={16} color={c.accentLight} />
            </Pressable>
          </View>
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 18, marginTop: spacing.sm }}>
            {u.goal ? GOAL_LABELS[u.goal] : 'Nessun obiettivo'}
          </Text>
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 12, marginTop: spacing.sm }}>
            {u.totalWorkouts > 0
              ? `${u.totalWorkouts} allenamenti completati · streak ${u.streak}`
              : 'Inizia ad allenarti per fare progressi verso il tuo obiettivo'}
          </Text>
        </Card>

        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.md }}>
          Impostazioni
        </Text>
        <Card style={{ marginBottom: spacing.lg }} padded={false}>
          <SettingRow
            icon={<Info size={20} color={c.textSecondary} />}
            label="Notifiche"
            right={
              <Switch
                value={u.notificationsEnabled}
                onValueChange={() => { h.light(); u.toggleNotifications(); }}
                trackColor={{ true: c.accent, false: c.border }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon={<Star size={20} color={c.textSecondary} />}
            label={`Tema: ${u.themeMode === 'dark' ? 'Dark Premium' : 'Glassmorphism'}`}
            right={
              <Switch
                value={u.themeMode === 'glass'}
                onValueChange={(v) => { h.light(); u.setThemeMode(v ? 'glass' : 'dark'); }}
                trackColor={{ true: c.accent, false: c.border }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon={<Ruler size={20} color={c.textSecondary} />}
            label="Unità di misura"
            value={u.preferredUnit === 'metric' ? 'kg / cm' : 'lb / in'}
            onPress={() => { h.light(); u.toggleUnit(); }}
          />
          <SettingRow icon={<Shield size={20} color={c.textSecondary} />} label="Privacy" onPress={() => { h.light(); setPrivacyOpen(true); }} />
          <SettingRow icon={<Download size={20} color={c.textSecondary} />} label="Esporta dati" onPress={exportData} />
          <SettingRow icon={<Info size={20} color={c.textSecondary} />} label="Info app" value="v1.0.0" last />
        </Card>

        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.md }}>
          Badge guadagnati
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg }}>
          {badges.map((b) => (
            <PressableScale
              key={b.id}
              scaleTo={0.94}
              onPress={() => setBadge(b)}
              style={{ width: '22%', alignItems: 'center' }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: b.unlocked ? c.surface : c.surface2,
                  borderWidth: 1,
                  borderColor: b.unlocked ? c.accent : c.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: b.unlocked ? 1 : 0.5,
                }}
              >
                {b.unlocked ? <b.Icon size={26} color={c.accentLight} /> : <Lock size={22} color={c.textMuted} />}
              </View>
              <Text
                numberOfLines={1}
                style={{ color: b.unlocked ? c.textSecondary : c.textMuted, fontFamily: fontFamily.medium, fontSize: 10, marginTop: 6 }}
              >
                {b.name}
              </Text>
            </PressableScale>
          ))}
        </View>

        <Pressable
          onPress={confirmLogout}
          accessibilityRole="button"
          accessibilityLabel="Esci e azzera i dati"
          style={{ alignItems: 'center', paddingVertical: spacing.base }}
        >
          <Text style={{ color: c.danger, fontFamily: fontFamily.semibold, fontSize: 15 }}>Esci dall'account</Text>
        </Pressable>
      </ScreenWrapper>

      <BottomSheet visible={goalSheet} onClose={() => setGoalSheet(false)} title="Modifica obiettivo">
        {GOALS.map((g) => (
          <PressableScale
            key={g.id}
            onPress={() => { u.update({ goal: g.id }); setGoalSheet(false); }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: spacing.base,
              borderBottomWidth: 1,
              borderBottomColor: c.border,
            }}
          >
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 15 }}>{g.label}</Text>
            {u.goal === g.id ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.accentLight }} /> : null}
          </PressableScale>
        ))}
      </BottomSheet>

      <BottomSheet visible={badge !== null} onClose={() => setBadge(null)} title={badge?.name}>
        {badge ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: c.surface2,
                borderWidth: 1,
                borderColor: badge.unlocked ? c.accent : c.border,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.base,
              }}
            >
              {badge.unlocked ? <badge.Icon size={34} color={c.accentLight} /> : <Lock size={28} color={c.textMuted} />}
            </View>
            <Text style={{ color: c.textSecondary, fontFamily: fontFamily.regular, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
              {badge.desc}
            </Text>
            <Text style={{ color: badge.unlocked ? c.success : c.warning, fontFamily: fontFamily.semibold, fontSize: 13, marginTop: spacing.md }}>
              {badge.unlocked ? 'Sbloccato ✓' : 'Da sbloccare'}
            </Text>
          </View>
        ) : null}
      </BottomSheet>

      <BottomSheet visible={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy">
        <View style={{ paddingVertical: spacing.md, gap: spacing.md }}>
          <Text style={{ color: c.textSecondary, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 }}>
            Eclipsium funziona completamente offline. Tutti i tuoi dati — profilo, misure, allenamenti — restano
            salvati solo su questo dispositivo e non vengono inviati ad alcun server.
          </Text>
          <Text style={{ color: c.textSecondary, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 }}>
            L'assistente AI genera risposte localmente, senza connessione esterna. Puoi esportare i tuoi dati in
            qualsiasi momento da “Esporta dati” o eliminarli del tutto uscendo dall'account.
          </Text>
        </View>
      </BottomSheet>
    </>
  );
}

function QuickStat({ value, label }: { value: number; label: string }) {
  const c = theme.colors;
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 20 }}>{value}</Text>
      <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  right,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const c = theme.colors;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.base,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: c.border,
      }}
    >
      {icon}
      <Text style={{ flex: 1, color: c.textPrimary, fontFamily: fontFamily.medium, fontSize: 15 }}>{label}</Text>
      {value ? <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 14 }}>{value}</Text> : null}
      {right ?? (onPress && !value ? <ChevronRight size={18} color={c.textMuted} /> : null)}
    </Pressable>
  );
}

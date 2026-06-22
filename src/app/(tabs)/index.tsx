import { Bell, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { WeeklyBarChart } from '@/components/charts/WeeklyBarChart';
import { Header } from '@/components/layout/Header';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { fontFamily, spacing, theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useWorkoutStore } from '@/store/workoutStore';

const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MESI = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];
const MILESTONES = [7, 14, 30, 60, 90];

export default function Dashboard() {
  const router = useRouter();
  const c = theme.colors;
  const name = useUserStore((s) => s.name) || 'Atleta';
  const streak = useUserStore((s) => s.streak);
  const weekly = useWorkoutStore((s) => s.weeklyVolume);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const now = new Date();
  const dateStr = `${GIORNI[now.getDay()]}, ${now.getDate()} ${MESI[now.getMonth()]}`;

  const nextMilestone = MILESTONES.find((m) => m > streak) ?? streak;
  const milestoneProgress = nextMilestone > 0 ? streak / nextMilestone : 0;

  const sum = weekly.reduce((a, b) => a + b, 0);
  const sessions = weekly.filter((v) => v > 0).length;
  const volumePct = Math.min(1, sum / 24000);
  const caloriePct = Math.min(1, sum / 30000);

  const tip =
    sum === 0
      ? 'Inizia il tuo primo allenamento per accendere lo streak e iniziare a tracciare i progressi.'
      : sessions < 3
        ? 'Buon inizio! Punta ad almeno 3 sessioni a settimana per risultati costanti.'
        : 'Ottimo ritmo questa settimana. Ricordati di alternare i gruppi muscolari per un volume equilibrato.';

  return (
    <ScreenWrapper>
      <Header
        subtitle={dateStr}
        title={`${greet}, ${name} 👋`}
        right={<Bell size={24} color={c.textSecondary} accessibilityLabel="Notifiche" />}
      />

      <Card style={{ marginBottom: spacing.base }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Text style={{ fontSize: 40 }}>🔥</Text>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <AnimatedNumber
                value={streak}
                style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 36 }}
              />
              <Text style={{ color: c.textSecondary, fontFamily: fontFamily.medium, fontSize: 15 }}>
                giorni di streak
              </Text>
            </View>
            <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 13 }}>
              {streak > 0 ? 'Continua così, non spezzare la catena! 💪' : 'Allenati oggi per accendere lo streak 🔥'}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.base }}>
          <ProgressBar progress={milestoneProgress} />
          <Text style={{ color: c.textMuted, fontFamily: fontFamily.regular, fontSize: 12, marginTop: spacing.sm }}>
            {nextMilestone - streak} giorni al traguardo di {nextMilestone}
          </Text>
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.base }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <RingStat label="Volume" progress={volumePct} percent />
          <RingStat label="Calorie" progress={caloriePct} percent color={c.warning} />
          <RingStat label="Sessioni" progress={sessions / 5} text={`${sessions}/5`} color={c.success} />
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.base }}>
        <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 16, marginBottom: spacing.base }}>
          Volume settimanale
        </Text>
        <WeeklyBarChart data={weekly} todayIndex={Math.min(6, now.getDay() === 0 ? 6 : now.getDay() - 1)} />
      </Card>

      <Card style={{ marginBottom: spacing.base }}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Sparkles size={22} color={c.accentLight} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.textPrimary, fontFamily: fontFamily.semibold, fontSize: 15 }}>
              Consiglio del giorno
            </Text>
            <Text style={{ color: c.textSecondary, fontFamily: fontFamily.regular, fontSize: 14, marginTop: 4, lineHeight: 20 }}>
              {tip}
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <Button label="Chiedi all'AI" variant="secondary" onPress={() => router.push('/ai-coach')} />
            </View>
          </View>
        </View>
      </Card>
    </ScreenWrapper>
  );
}

function RingStat({
  label,
  progress,
  percent,
  text,
  color = theme.colors.accentLight,
}: {
  label: string;
  progress: number;
  percent?: boolean;
  text?: string;
  color?: string;
}) {
  const c = theme.colors;
  return (
    <View style={{ alignItems: 'center' }}>
      <ProgressRing progress={progress} size={84} color={color}>
        {percent ? (
          <AnimatedNumber
            value={Math.round(progress * 100)}
            suffix="%"
            style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 16 }}
          />
        ) : (
          <Text style={{ color: c.textPrimary, fontFamily: fontFamily.bold, fontSize: 16 }}>{text}</Text>
        )}
      </ProgressRing>
      <Text style={{ color: c.textMuted, fontFamily: fontFamily.medium, fontSize: 12, marginTop: spacing.sm }}>
        {label}
      </Text>
    </View>
  );
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import {
  formatCountdown,
  getGreetingName,
  getTimeGreeting,
  useDashboardStore,
} from '@/store/dashboardStore';
import { useOnboardingStore } from '@/store/onboardingStore';

const QUICK_ACTIONS: { label: string; href: string; icon: keyof typeof Ionicons.glyphMap; disabled?: boolean }[] = [
  { label: 'AI Soru Çöz', href: '/solve', icon: 'camera-outline' },
  { label: 'Flash Kart', href: '/(drawer)/(tabs)/study', icon: 'albums-outline' },
  { label: 'Deneme Sınavı', href: '/(drawer)/(tabs)/exam', icon: 'timer-outline' },
  { label: 'AI Plan Gör', href: '/plan', icon: 'calendar-outline' },
  { label: 'Soru Bankası', href: '/question-bank', icon: 'library-outline' },
  { label: 'Bilgi Yarışması', href: '', icon: 'trophy-outline', disabled: true },
];

/**
 * Ana panel (PDF Bölüm 3.1): durum çubuğu, geri sayım, görevler, hızlı erişim, öneri, sıralama.
 */
export default function HomeScreen() {
  const draft = useOnboardingStore((s) => s.draft);
  const seedFromOnboarding = useDashboardStore((s) => s.seedFromOnboarding);
  const tasks = useDashboardStore((s) => s.tasks);
  const toggleTask = useDashboardStore((s) => s.toggleTask);
  const dailyGoalPercent = useDashboardStore((s) => s.dailyGoalPercent);
  const streakDays = useDashboardStore((s) => s.streakDays);
  const primaryExamLabel = useDashboardStore((s) => s.primaryExamLabel);
  const targetExamDateIso = useDashboardStore((s) => s.targetExamDateIso);
  const secondaryExamChip = useDashboardStore((s) => s.secondaryExamChip);
  const leaderboardRankToday = useDashboardStore((s) => s.leaderboardRankToday);

  useEffect(() => {
    seedFromOnboarding(draft.examTypes, draft.fullName);
  }, [draft.examTypes, draft.fullName, seedFromOnboarding]);

  const name = getGreetingName(draft.fullName);
  const countdown = formatCountdown(targetExamDateIso);
  const countdownColors =
    countdown.urgency === 'critical'
      ? { bg: '#fef2f2', border: Brand.danger, accent: Brand.danger }
      : countdown.urgency === 'soon'
        ? { bg: '#fff7ed', border: Brand.warning, accent: Brand.warning }
        : { bg: '#fff', border: '#e2e8f0', accent: Brand.navy };

  const weakHint =
    tasks.find((t) => !t.done && t.subject === 'Matematik') != null
      ? 'Bu hafta Matematik’te tekrar öneriyoruz — 20 soru çöz.'
      : 'Bugün paragraf ve Türkçe dengeyi koru.';

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.topRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{name ? name.slice(0, 1).toUpperCase() : '?'}</Text>
        </View>
        <View style={styles.topCenter}>
          <Text style={styles.greeting}>
            {getTimeGreeting()}
            {name ? `, ${name}!` : '!'}
          </Text>
          <View style={styles.goalBarBg}>
            <View style={[styles.goalBarFill, { width: `${dailyGoalPercent}%` }]} />
          </View>
          <Text style={styles.goalCaption}>Bugünkü hedef %{dailyGoalPercent}</Text>
        </View>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn} onPress={() => {}}>
            <Ionicons name="notifications-outline" size={22} color={Brand.navy} />
          </Pressable>
          <Text style={styles.streak}>🔥 {streakDays} gün</Text>
        </View>
      </View>

      <View style={[styles.countdownCard, { backgroundColor: countdownColors.bg, borderColor: countdownColors.border }]}>
        <Text style={styles.countdownKicker}>{primaryExamLabel}</Text>
        <Text style={[styles.countdownBig, { color: countdownColors.accent }]}>
          {countdown.line1} kaldı
        </Text>
        <Text style={styles.countdownSub}>Hedef puana yaklaşım — günlük görevleri tamamla.</Text>
        {secondaryExamChip ? (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{secondaryExamChip}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Bugünkü görevler</Text>
      {tasks.map((task) => (
        <Pressable
          key={task.id}
          style={[styles.taskRow, task.done && styles.taskRowDone]}
          onPress={() => toggleTask(task.id)}>
          <View style={[styles.checkbox, task.done && styles.checkboxOn]}>
            {task.done ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
          </View>
          <View style={styles.taskBody}>
            <Text style={styles.taskSubject}>{task.subject}</Text>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskEta}>~{task.minutes} dk</Text>
          </View>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>Hızlı erişim</Text>
      <View style={styles.grid}>
        {QUICK_ACTIONS.map((action) =>
          action.disabled ? (
            <View key={action.label} style={[styles.gridItem, styles.gridItemDisabled]}>
              <Ionicons name={action.icon} size={24} color="#94a3b8" />
              <Text style={styles.gridTextMuted}>{action.label}</Text>
              <Text style={styles.soon}>Yakında</Text>
            </View>
          ) : (
            <Link key={action.label} href={action.href as any} asChild>
              <Pressable style={styles.gridItem}>
                <Ionicons name={action.icon} size={24} color={Brand.purple} />
                <Text style={styles.gridText}>{action.label}</Text>
              </Pressable>
            </Link>
          ),
        )}
      </View>

      <View style={styles.suggestCard}>
        <Text style={styles.suggestTitle}>AI öneri</Text>
        <Text style={styles.suggestBody}>{weakHint}</Text>
      </View>

      <Text style={styles.leader}>
        Liderlik tablosunda bugün: <Text style={styles.leaderBold}>#{leaderboardRankToday}</Text>
      </Text>

      <Link href="/modal" asChild>
        <Pressable style={styles.linkBtn}>
          <Text style={styles.linkText}>Uygulama bilgisi</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(168,85,247,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: Brand.purple },
  topCenter: { flex: 1 },
  greeting: { fontSize: 17, fontWeight: '700', color: Brand.navy, marginBottom: 8 },
  goalBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  goalBarFill: { height: '100%', backgroundColor: Brand.accent, borderRadius: 4 },
  goalCaption: { fontSize: 12, color: '#64748b', marginTop: 4 },
  topRight: { alignItems: 'flex-end' },
  iconBtn: { padding: 4 },
  streak: { fontSize: 13, fontWeight: '600', color: '#ea580c', marginTop: 4 },
  countdownCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  countdownKicker: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  countdownBig: { fontSize: 20, fontWeight: '800' },
  countdownSub: { fontSize: 13, color: '#64748b', marginTop: 8, lineHeight: 18 },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: 'rgba(15,23,42,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  taskRowDone: { opacity: 0.65, borderColor: Brand.success },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: Brand.success, borderColor: Brand.success },
  taskBody: { flex: 1 },
  taskSubject: { fontSize: 12, fontWeight: '600', color: Brand.purple },
  taskTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginTop: 2 },
  taskEta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  gridItem: {
    width: '31%',
    minWidth: 100,
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gridItemDisabled: { opacity: 0.85 },
  gridText: { fontSize: 11, fontWeight: '600', color: '#334155', textAlign: 'center', marginTop: 6 },
  gridTextMuted: { fontSize: 11, fontWeight: '600', color: '#94a3b8', textAlign: 'center', marginTop: 6 },
  soon: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  suggestCard: {
    backgroundColor: 'rgba(56,189,248,0.1)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  suggestTitle: { fontSize: 12, fontWeight: '700', color: '#0369a1', marginBottom: 6 },
  suggestBody: { fontSize: 14, color: '#0c4a6e', lineHeight: 20 },
  leader: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  leaderBold: { fontWeight: '800', color: Brand.navy },
  linkBtn: { alignSelf: 'flex-start' },
  linkText: { color: Brand.purple, fontWeight: '600', fontSize: 15 },
});

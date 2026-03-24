import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useOnboardingStore, type ExamType } from '@/store/onboardingStore';
import {
  addDays,
  startOfWeekMonday,
  usePlanningStore,
  type PlannedTask,
} from '@/store/planningStore';

const WEEKDAY_LABELS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const HOURS = Array.from({ length: 15 }, (_, i) => 6 + i); // 06–20

/**
 * PDF Bölüm 4.3 — Haftalık plan görünümü (stub motor; GPT-4o sonra).
 */
export default function PlanWeeklyScreen() {
  const draft = useOnboardingStore((s) => s.draft);
  const prefs = useOnboardingStore((s) => s.planningPreferences);
  const generatePlanFromPreferences = usePlanningStore((s) => s.generatePlanFromPreferences);
  const plannedTasks = usePlanningStore((s) => s.plannedTasks);
  const weekOffset = usePlanningStore((s) => s.weekOffset);
  const setWeekOffset = usePlanningStore((s) => s.setWeekOffset);
  const viewMode = usePlanningStore((s) => s.viewMode);
  const setViewMode = usePlanningStore((s) => s.setViewMode);
  const moveTask = usePlanningStore((s) => s.moveTask);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (plannedTasks.length > 0) return;
    const exams: ExamType[] = draft.examTypes.length ? draft.examTypes : ['YKS'];
    const cap = prefs?.capacityMin ?? 120;
    const slotLabels = prefs?.slots?.length ? prefs.slots.map(String) : ['Akşam'];
    generatePlanFromPreferences({
      examTypes: exams,
      capacityMin: cap,
      slots: slotLabels,
    });
  }, [plannedTasks.length, prefs, draft.examTypes, generatePlanFromPreferences]);

  const weekStart = useMemo(() => {
    const base = startOfWeekMonday(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const onRegenerate = () => {
    if (!prefs) {
      Alert.alert('Önce tercihler', 'Onboarding adım 4’te kapasite ve saat tercihi kaydedilir.');
      return;
    }
    generatePlanFromPreferences({
      examTypes: draft.examTypes.length ? draft.examTypes : ['YKS'],
      capacityMin: prefs.capacityMin,
      slots: prefs.slots,
    });
  };

  const tasksForGrid = useMemo(() => {
    return plannedTasks.map((t) => {
      const d = addDays(weekStart, t.weekday === 0 ? 6 : t.weekday - 1);
      return { ...t, dateLabel: `${d.getDate()}.${d.getMonth() + 1}` };
    });
  }, [plannedTasks, weekStart]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.toolbar}>
          <Pressable style={styles.iconBtn} onPress={() => setWeekOffset(weekOffset - 1)}>
            <Ionicons name="chevron-back" size={22} color={Brand.navy} />
          </Pressable>
          <Text style={styles.weekTitle}>
            {weekStart.getDate()}.{weekStart.getMonth() + 1} haftası
          </Text>
          <Pressable style={styles.iconBtn} onPress={() => setWeekOffset(weekOffset + 1)}>
            <Ionicons name="chevron-forward" size={22} color={Brand.navy} />
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          {(['week', 'day', 'month'] as const).map((m) => (
            <Pressable
              key={m}
              style={[styles.toggleChip, viewMode === m && styles.toggleChipOn]}
              onPress={() => setViewMode(m)}>
              <Text style={[styles.toggleText, viewMode === m && styles.toggleTextOn]}>
                {m === 'week' ? 'Haftalık' : m === 'day' ? 'Günlük' : 'Aylık'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.aiBtn} onPress={onRegenerate}>
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.aiBtnText}>AI ile Yeniden Planla</Text>
        </Pressable>

        {viewMode !== 'week' ? (
          <Text style={styles.stubNote}>
            {viewMode === 'day' ? 'Günlük' : 'Aylık'} görünüm bir sonraki iterasyonda takvim grid’i ile eklenecek.
          </Text>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator style={styles.gridScroll}>
        <View style={styles.gridWrap}>
          <View style={styles.timeCol}>
            <Text style={styles.corner} />
            {HOURS.map((h) => (
              <Text key={h} style={styles.timeLabel}>
                {String(h).padStart(2, '0')}:00
              </Text>
            ))}
          </View>
          {[1, 2, 3, 4, 5, 6, 0].map((jsDay) => (
            <View key={jsDay} style={styles.dayCol}>
              <Text style={styles.dayHead}>{WEEKDAY_LABELS_TR[jsDay]}</Text>
              <View style={styles.dayCells}>
                {HOURS.map((hour) => {
                  const slotTasks = tasksForGrid.filter(
                    (t) => t.weekday === jsDay && t.startHour === hour,
                  );
                  return (
                    <View key={`${jsDay}-${hour}`} style={styles.cell}>
                      {slotTasks.map((t) => (
                        <Pressable
                          key={t.id}
                          onPress={() => setSelectedId(selectedId === t.id ? null : t.id)}
                          style={[
                            styles.taskPill,
                            { backgroundColor: t.color + '33', borderColor: t.color },
                            selectedId === t.id && styles.taskPillSelected,
                          ]}>
                          <Text style={styles.taskPillText} numberOfLines={2}>
                            {t.subject}{'\n'}
                            <Text style={styles.taskTopic}>{t.topic}</Text>
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
        </ScrollView>

        {selectedId ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Görev</Text>
            {tasksForGrid
              .filter((t) => t.id === selectedId)
              .map((t) => (
                <Text key={t.id} style={styles.detailBody}>
                  {t.subject} — {t.topic} ({t.durationMin} dk)
                </Text>
              ))}
            <Pressable
              style={styles.resched}
              onPress={() => {
                const t = plannedTasks.find((x) => x.id === selectedId);
                if (!t) return;
                const nextSlot = findNextFreeSlot(plannedTasks, t);
                moveTask(t.id, nextSlot.weekday, nextSlot.startHour, 0);
                Alert.alert('Yeniden zamanlama', 'Önerilen boş slota taşındı (Reclaim benzeri stub).');
                setSelectedId(null);
              }}>
              <Text style={styles.reschedText}>Boş slota taşı (örnek)</Text>
            </Pressable>
            <Pressable style={styles.startBtn}>
              <Text style={styles.startBtnText}>Başlat</Text>
            </Pressable>
          </View>
        ) : null}

        <Link href="/plan/analysis" asChild>
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Plan analizi ve ilerleme →</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

function findNextFreeSlot(tasks: PlannedTask[], current: PlannedTask) {
  for (const h of [18, 19, 20]) {
    const clash = tasks.some((t) => t.id !== current.id && t.weekday === current.weekday && t.startHour === h);
    if (!clash) return { weekday: current.weekday, startHour: h };
  }
  return { weekday: current.weekday === 5 ? 6 : 5, startHour: 10 };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBtn: { padding: 8 },
  weekTitle: { fontSize: 16, fontWeight: '700', color: Brand.navy },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  toggleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  toggleChipOn: { backgroundColor: Brand.navy },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  toggleTextOn: { color: '#fff' },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Brand.purple,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  aiBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  stubNote: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  gridScroll: { marginTop: 8 },
  gridWrap: { flexDirection: 'row', minWidth: 520 },
  timeCol: { width: 40 },
  corner: { height: 28 },
  timeLabel: {
    height: 44,
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'right',
    paddingRight: 4,
  },
  dayCol: { flex: 1, minWidth: 36 },
  dayHead: {
    height: 28,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#334155',
  },
  dayCells: {},
  cell: {
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e8f0',
    padding: 1,
  },
  taskPill: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  taskPillSelected: { opacity: 0.9, borderWidth: 2 },
  taskPillText: { fontSize: 8, fontWeight: '700', color: '#0f172a' },
  taskTopic: { fontSize: 7, fontWeight: '500', color: '#475569' },
  detailCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailTitle: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  detailBody: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  resched: { marginTop: 12 },
  reschedText: { color: Brand.purple, fontWeight: '600', fontSize: 14 },
  startBtn: {
    marginTop: 12,
    backgroundColor: Brand.navy,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontWeight: '700' },
  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 15, fontWeight: '600', color: Brand.purple },
});

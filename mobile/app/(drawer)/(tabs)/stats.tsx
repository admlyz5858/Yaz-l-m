import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Brand, BrandStrings } from '@/constants/theme';
import {
  aggregateFlashcards,
  aggregateQuestionBank,
  last7DaysPomodoro,
  maxInSeries,
} from '@/lib/analyticsLocal';
import { useDashboardStore } from '@/store/dashboardStore';
import { useFlashcardStore } from '@/store/flashcardStore';
import { useMockExamStore } from '@/store/mockExamStore';
import { usePlanningStore } from '@/store/planningStore';
import { usePomodoroStore } from '@/store/pomodoroStore';
import { useQuestionBankStore } from '@/store/questionBankStore';

function Ring({ percent, size = 88, stroke = 8 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const offset = c * (1 - p / 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={Brand.electricDim}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={styles.ringPct}>{Math.round(p)}%</Text>
    </View>
  );
}

/**
 * İstatistik sekmesi — PDF Bölüm 15 (yerel özet; Analytics servisi yok).
 */
export default function StatsTabScreen() {
  const progress = useQuestionBankStore((s) => s.progress);
  const qb = useMemo(() => aggregateQuestionBank(progress), [progress]);

  const decks = useFlashcardStore((s) => s.decks);
  const cards = useFlashcardStore((s) => s.cards);
  const fc = useMemo(() => aggregateFlashcards(decks, cards), [decks, cards]);

  const sessionLog = usePomodoroStore((s) => s.sessionLog);
  const totalWorkMin = usePomodoroStore((s) => s.totalWorkMinutes);
  const pomStreak = usePomodoroStore((s) => s.streakDays);
  const weekBars = useMemo(() => last7DaysPomodoro(sessionLog), [sessionLog]);
  const barMax = useMemo(() => maxInSeries(weekBars.map((d) => d.minutes)), [weekBars]);

  const dashStreak = useDashboardStore((s) => s.streakDays);
  const dailyGoal = useDashboardStore((s) => s.dailyGoalPercent);
  const leaderboardRank = useDashboardStore((s) => s.leaderboardRankToday);

  const planStats = usePlanningStore((s) => s.getWeekStats());
  const mockHistory = useMockExamStore((s) => s.history);

  const examTrend = useMemo(() => {
    const h = [...mockHistory].slice(0, 10).reverse();
    return h.map((row) => ({
      id: row.id,
      pct: row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0,
      label: `${row.correct}/${row.total}`,
    }));
  }, [mockHistory]);

  const accPct = qb.accuracy * 100;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>{BrandStrings.appNameFull}</Text>
      <Text style={styles.title}>Performans</Text>
      <Text style={styles.sub}>Soru bankası, odak, kartlar ve denemeler — cihazda özetlenir.</Text>

      <View style={styles.rowCards}>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Soru doğruluğu</Text>
          <Ring percent={accPct} />
          <Text style={styles.cardHint}>
            {qb.totalAttempts} deneme · {qb.solvedDistinct} farklı soru
          </Text>
        </View>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Günlük hedef</Text>
          <Text style={styles.bigNum}>{dailyGoal}%</Text>
          <Text style={styles.cardHint}>Panel görevleri</Text>
          <View style={styles.inlineRow}>
            <Ionicons name="flame-outline" size={18} color={Brand.warning} />
            <Text style={styles.inlineText}>Seri {dashStreak} gün</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.sectionTitle}>Ders bazlı doğruluk</Text>
          <Link href="/question-bank" asChild>
            <Pressable>
              <Text style={styles.link}>Soru bankası</Text>
            </Pressable>
          </Link>
        </View>
        {qb.bySubject.length === 0 ? (
          <Text style={styles.empty}>Henüz çözülmüş soru yok — bankadan başla.</Text>
        ) : (
          qb.bySubject.slice(0, 6).map((s) => (
            <View key={s.subject} style={styles.barRow}>
              <Text style={styles.barLabel} numberOfLines={1}>
                {s.subject}
              </Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.round(s.rate * 100)}%` }]} />
              </View>
              <Text style={styles.barPct}>{Math.round(s.rate * 100)}%</Text>
            </View>
          ))
        )}
      </View>

      {qb.topWeakTopics.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Zayıf konular (yanlış sayısı)</Text>
          {qb.topWeakTopics.slice(0, 5).map((t) => (
            <View key={t.konu} style={styles.topicRow}>
              <Text style={styles.topicName} numberOfLines={1}>
                {t.konu}
              </Text>
              <Text style={styles.topicMeta}>
                {t.wrong} yanlış / {t.attempts} deneme
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.sectionTitle}>Odak (Pomodoro)</Text>
          <Link href="/pomodoro" asChild>
            <Pressable>
              <Text style={styles.link}>Sayaç</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.metricLine}>
          Toplam <Text style={styles.metricEm}>{totalWorkMin}</Text> dk · Pomodoro serisi{' '}
          <Text style={styles.metricEm}>{pomStreak}</Text> gün
        </Text>
        <Text style={styles.chartCaption}>Son 7 gün (dk)</Text>
        <View style={styles.chartRow}>
          {weekBars.map((d) => (
            <View key={d.dayKey} style={styles.chartCol}>
              <View
                style={[
                  styles.chartBar,
                  { height: barMax > 0 ? Math.max(4, (d.minutes / barMax) * 72) : 4 },
                ]}
              />
              <Text style={styles.chartLbl}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.sectionTitle}>Flash kart</Text>
          <Link href="/flashcards" asChild>
            <Pressable>
              <Text style={styles.link}>Desteler</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.metricLine}>
          <Text style={styles.metricEm}>{fc.totalCards}</Text> kart · Bugün tekrar:{' '}
          <Text style={styles.metricEm}>{fc.dueToday}</Text> · Toplam tekrar:{' '}
          <Text style={styles.metricEm}>{fc.reviewsTotal}</Text>
        </Text>
        {fc.byDeck.map((d) => (
          <View key={d.title} style={styles.topicRow}>
            <Text style={styles.topicName} numberOfLines={1}>
              {d.title}
            </Text>
            <Text style={styles.topicMeta}>
              {d.due} vadesi gelen · {d.reviewed} en az 1 kez çalışıldı
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.sectionTitle}>Haftalık plan özeti</Text>
          <Link href="/plan/analysis" asChild>
            <Pressable>
              <Text style={styles.link}>Detay</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.metricLine}>
          Tamamlanma <Text style={styles.metricEm}>{planStats.completionPercent}%</Text> · Planlanan{' '}
          <Text style={styles.metricEm}>{planStats.plannedMinutes}</Text> dk · Tahmini gerçekleşen{' '}
          <Text style={styles.metricEm}>{planStats.actualMinutes}</Text> dk
        </Text>
        <Text style={styles.hintSmall}>Plan görevleri tamamlandıkça oran güncellenir.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.sectionTitle}>Deneme trendi</Text>
          <Link href="/mock-exam" asChild>
            <Pressable>
              <Text style={styles.link}>Yeni deneme</Text>
            </Pressable>
          </Link>
        </View>
        {examTrend.length === 0 ? (
          <Text style={styles.empty}>Henüz zamanlı deneme yok.</Text>
        ) : (
          <View style={styles.examTrendRow}>
            {examTrend.map((e) => (
              <View key={e.id} style={styles.examDot}>
                <Text style={styles.examPct}>{e.pct}</Text>
                <View style={[styles.examBar, { height: Math.max(8, (e.pct / 100) * 48) }]} />
              </View>
            ))}
          </View>
        )}
        {mockHistory[0] ? (
          <Text style={styles.hintSmall}>
            Son deneme: %
            {mockHistory[0].total > 0
              ? Math.round((mockHistory[0].correct / mockHistory[0].total) * 100)
              : 0}
          </Text>
        ) : null}
      </View>

      <View style={styles.cardMuted}>
        <Ionicons name="analytics-outline" size={22} color="#94a3b8" />
        <Text style={styles.mutedText}>
          Sunucu analitiği (ClickHouse / ML tahmini) bağlandığında buraya kıyas ve haftalık rapor eklenecek.
        </Text>
      </View>
      <Text style={styles.rankFoot}>
        Bugünkü sıralama (örnek): #{leaderboardRank}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontSize: 11, fontWeight: '700', color: Brand.electricDim, letterSpacing: 1.2 },
  title: { fontSize: 24, fontWeight: '800', color: Brand.navy, marginTop: 4 },
  sub: { fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 16, lineHeight: 20 },
  rowCards: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 14,
  },
  cardHalf: { flex: 1, marginBottom: 0 },
  cardLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 10 },
  cardHint: { fontSize: 12, color: '#94a3b8', marginTop: 8, textAlign: 'center' },
  bigNum: { fontSize: 36, fontWeight: '800', color: Brand.navy, textAlign: 'center', marginVertical: 8 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'center' },
  inlineText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  ringPct: { fontSize: 18, fontWeight: '800', color: Brand.navy },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Brand.navy },
  link: { fontSize: 14, fontWeight: '700', color: Brand.electricDim },
  empty: { fontSize: 14, color: '#94a3b8', fontStyle: 'italic' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { width: 100, fontSize: 13, fontWeight: '600', color: '#334155' },
  barTrack: { flex: 1, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Brand.electricDim, borderRadius: 4 },
  barPct: { width: 36, fontSize: 12, fontWeight: '700', color: '#64748b', textAlign: 'right' },
  topicRow: { marginBottom: 10 },
  topicName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  topicMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  metricLine: { fontSize: 14, color: '#475569', lineHeight: 22 },
  metricEm: { fontWeight: '800', color: Brand.navy },
  chartCaption: { fontSize: 12, color: '#94a3b8', marginTop: 12, marginBottom: 8 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 4 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBar: { width: '72%', backgroundColor: Brand.electricDim, borderRadius: 4, minHeight: 4 },
  chartLbl: { fontSize: 10, color: '#94a3b8', marginTop: 6 },
  hintSmall: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
  examTrendRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', minHeight: 64, paddingVertical: 8 },
  examDot: { alignItems: 'center' },
  examPct: { fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 4 },
  examBar: { width: 22, backgroundColor: Brand.navy, borderRadius: 3 },
  cardMuted: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mutedText: { flex: 1, fontSize: 13, color: '#64748b', lineHeight: 19 },
  rankFoot: { fontSize: 12, color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
});

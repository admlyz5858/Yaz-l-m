import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { usePlanningStore } from '@/store/planningStore';

/**
 * PDF Bölüm 4.4 — Plan analizi ve ilerleme (stub metrikler).
 */
export default function PlanAnalysisScreen() {
  const stats = usePlanningStore((s) => s.getWeekStats());

  const topSubject = useMemo(() => {
    const sorted = [...stats.subjectShares].sort((a, b) => b.minutes - a.minutes);
    return sorted[0]?.subject ?? '—';
  }, [stats.subjectShares]);

  const lowSubject = useMemo(() => {
    const sorted = [...stats.subjectShares].sort((a, b) => a.minutes - b.minutes);
    return sorted[0]?.subject ?? '—';
  }, [stats.subjectShares]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.ringCard}>
          <Text style={styles.ringLabel}>Bu hafta tamamlanma</Text>
          <Text style={styles.ringValue}>%{stats.completionPercent}</Text>
          <Text style={styles.ringHint}>Günlük görevler üzerinden (stub)</Text>
        </View>

        <Text style={styles.section}>Ders bazlı dağılım (planlanan süre)</Text>
        {stats.subjectShares.map((row) => (
          <View key={row.subject} style={styles.row}>
            <Text style={styles.rowLabel}>{row.subject}</Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min(100, (row.minutes / Math.max(stats.plannedMinutes, 1)) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.rowMin}>{row.minutes} dk</Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hedef vs gerçek (tahmini)</Text>
          <Text style={styles.cardBody}>
            Planladığın ~{stats.plannedMinutes} dk / Tahmini çalışılan ~{stats.actualMinutes} dk
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Streak (plana uyum)</Text>
          <Text style={styles.cardBody}>
            {stats.streakPlanDays} gün üst üste hedefe yakın tamamlama (stub)
          </Text>
        </View>

        <Text style={styles.summary}>
          Bu hafta en çok: {topSubject} {'\n'}
          En az: {lowSubject}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 40 },
  ringCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  ringLabel: { fontSize: 14, color: '#64748b' },
  ringValue: { fontSize: 42, fontWeight: '800', color: Brand.navy, marginVertical: 8 },
  ringHint: { fontSize: 12, color: '#94a3b8' },
  section: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  row: { marginBottom: 12 },
  rowLabel: { fontSize: 13, color: '#475569', marginBottom: 4 },
  barBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: Brand.purple },
  rowMin: { fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Brand.navy, marginBottom: 8 },
  cardBody: { fontSize: 14, color: '#475569', lineHeight: 20 },
  summary: {
    marginTop: 8,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '500',
  },
});

/**
 * Deneme sınavı sonuç ekranı — net, boşlar, konu özeti (mock)
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getTrialExamById, type TrialAnswers } from '../../data/trialExams';
import { getTurkishQuestionsByIds } from '../../data/turkishQuestions';
import { colors } from '../../theme/colors';

interface TrialExamResultScreenProps {
  navigation?: any;
  route?: { params?: { trialId: string; answers: TrialAnswers } };
}

export default function TrialExamResultScreen({ navigation, route }: TrialExamResultScreenProps) {
  const trialId = route?.params?.trialId ?? '';
  const rawAnswers = route?.params?.answers ?? {};
  const meta = getTrialExamById(trialId);

  const { questions, correct, wrong, empty } = useMemo(() => {
    if (!meta) {
      return { questions: [], correct: 0, wrong: 0, empty: 0 };
    }
    const qs = getTurkishQuestionsByIds(meta.questionIds);
    let c = 0;
    let w = 0;
    let e = 0;
    for (const q of qs) {
      const a = rawAnswers[q.id];
      if (a === undefined || a === null) e += 1;
      else if (a === q.correctIndex) c += 1;
      else w += 1;
    }
    return { questions: qs, correct: c, wrong: w, empty: e };
  }, [meta, rawAnswers]);

  const topicStats = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    if (!meta) return map;
    const qs = getTurkishQuestionsByIds(meta.questionIds);
    for (const q of qs) {
      const cur = map.get(q.topic) ?? { total: 0, correct: 0 };
      cur.total += 1;
      const a = rawAnswers[q.id];
      if (a !== undefined && a !== null && a === q.correctIndex) cur.correct += 1;
      map.set(q.topic, cur);
    }
    return map;
  }, [meta, rawAnswers]);

  if (!meta) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.empty}>Sonuç yüklenemedi.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation?.navigate('ExamHome')}>
          <Text style={styles.primaryBtnText}>Sınava dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const total = questions.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <MaterialCommunityIcons name="chart-box-outline" size={40} color={colors.secondary} />
          <Text style={styles.heroTitle}>Deneme Tamamlandı</Text>
          <Text style={styles.heroSub}>{meta.title}</Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNum}>{correct}</Text>
            <Text style={styles.scoreLabel}>Doğru</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreNum, styles.scoreWrong]}>{wrong}</Text>
            <Text style={styles.scoreLabel}>Yanlış</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreNum, styles.scoreEmpty]}>{empty}</Text>
            <Text style={styles.scoreLabel}>Boş</Text>
          </View>
        </View>

        <View style={styles.barWrap}>
          <Text style={styles.barTitle}>Başarı oranı: %{pct}</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${pct}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Konu bazlı özet</Text>
        {Array.from(topicStats.entries()).map(([topic, st]) => (
          <View key={topic} style={styles.topicRow}>
            <Text style={styles.topicName}>{topic}</Text>
            <Text style={styles.topicRatio}>
              {st.correct}/{st.total} doğru
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            navigation?.reset({
              index: 0,
              routes: [{ name: 'ExamHome' }],
            })
          }
        >
          <Text style={styles.primaryBtnText}>Sınav ana sayfasına dön</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation?.navigate('TrialExamSelect')}
        >
          <Text style={styles.secondaryBtnText}>Yeni deneme seç</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  empty: { padding: 24, fontSize: 16, color: colors.textSecondary, textAlign: 'center' },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 12 },
  heroSub: { fontSize: 15, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 10 },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreNum: { fontSize: 28, fontWeight: '800', color: colors.success },
  scoreWrong: { color: colors.error },
  scoreEmpty: { color: colors.warning },
  scoreLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4, fontWeight: '600' },
  barWrap: { marginBottom: 28 },
  barTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  barTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topicName: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  topicRatio: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});

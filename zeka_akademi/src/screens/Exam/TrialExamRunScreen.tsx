/**
 * Deneme sınavı — geri sayım, soru sırası, cevap kaydı
 */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getTrialExamById, type TrialAnswers } from '../../data/trialExams';
import { getTurkishQuestionsByIds } from '../../data/turkishQuestions';
import { colors } from '../../theme/colors';

interface TrialExamRunScreenProps {
  navigation?: any;
  route?: { params?: { trialId: string } };
}

function formatMmSs(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrialExamRunScreen({ navigation, route }: TrialExamRunScreenProps) {
  const trialId = route?.params?.trialId ?? '';
  const meta = getTrialExamById(trialId);
  const questions = useMemo(
    () => (meta ? getTurkishQuestionsByIds(meta.questionIds) : []),
    [meta]
  );
  const totalSeconds = meta ? meta.durationMinutes * 60 : 0;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TrialAnswers>({});
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const finishedRef = useRef(false);

  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    finishedRef.current = false;
    setIndex(0);
    setAnswers({});
    setSecondsLeft(totalSeconds);
    if (!meta || questions.length === 0) return;
    endTimeRef.current = Date.now() + totalSeconds * 1000;

    const tick = () => {
      const end = endTimeRef.current;
      if (end == null) return;
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        navigation?.replace('TrialExamResult', {
          trialId: meta.id,
          answers: { ...answersRef.current },
        });
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [trialId, meta, questions.length, totalSeconds, navigation]);

  const goFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    navigation?.replace('TrialExamResult', {
      trialId: meta!.id,
      answers: { ...answersRef.current },
    });
  };

  const confirmExit = () => {
    Alert.alert(
      'Denemeyi bırak',
      'İlerlemen kaydedilmeden çıkılacak. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çık', style: 'destructive', onPress: () => navigation?.goBack() },
      ]
    );
  };

  if (!meta || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backRow}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primaryDark} />
          <Text style={styles.backText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.empty}>Deneme bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const q = questions[index];
  const selected = answers[q.id] ?? null;
  const last = index >= questions.length - 1;

  const setChoice = (i: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: i }));
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const goNext = () => {
    if (last) goFinish();
    else setIndex((i) => i + 1);
  };

  const lowTime = secondsLeft <= 120 && secondsLeft > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={confirmExit} style={styles.iconBtn}>
          <MaterialCommunityIcons name="close" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.timerWrap}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={lowTime ? colors.warning : colors.primary}
          />
          <Text style={[styles.timerText, lowTime && styles.timerUrgent]}>
            {formatMmSs(secondsLeft)}
          </Text>
        </View>
        <Text style={styles.progressLabel}>
          {index + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.badge}>
          {meta.examLabel} · Deneme
        </Text>
        <View style={styles.qCard}>
          <Text style={styles.qText}>{q.question}</Text>
        </View>

        {q.options.map((opt, i) => {
          const active = selected === i;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => setChoice(i)}
            >
              <Text style={[styles.optLetter, active && styles.optLetterActive]}>
                {String.fromCharCode(65 + i)}
              </Text>
              <Text style={[styles.optText, active && styles.optTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnGhost, index === 0 && styles.navBtnDisabled]}
          onPress={goPrev}
          disabled={index === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={22} color={colors.primary} />
          <Text style={styles.navBtnGhostText}>Önceki</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtnPrimary} onPress={goNext}>
          <Text style={styles.navBtnPrimaryText}>{last ? 'Bitir' : 'Sonraki'}</Text>
          {!last && (
            <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 6,
  },
  backText: { fontSize: 16, color: colors.primaryDark, fontWeight: '600' },
  empty: { padding: 24, fontSize: 16, color: colors.textSecondary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  iconBtn: { padding: 10 },
  timerWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 18, fontWeight: '800', color: colors.primary, fontVariant: ['tabular-nums'] },
  timerUrgent: { color: colors.warning },
  progressLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginRight: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  qCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: '#eff6ff',
  },
  optLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 12,
    overflow: 'hidden',
  },
  optLetterActive: { backgroundColor: colors.primary, color: '#fff' },
  optText: { flex: 1, fontSize: 15, color: colors.text },
  optTextActive: { fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  navBtnGhost: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  navBtnDisabled: { opacity: 0.35 },
  navBtnGhostText: { fontSize: 16, fontWeight: '700', color: colors.primary, marginLeft: -4 },
  navBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  navBtnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { getQuestionsForActiveSession, useMockExamStore } from '@/store/mockExamStore';

function formatClock(sec: number) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function MockExamSessionScreen() {
  const router = useRouter();
  const presetId = useMockExamStore((s) => s.presetId);
  const endsAt = useMockExamStore((s) => s.endsAt);
  const finishedAt = useMockExamStore((s) => s.finishedAt);
  const setAnswer = useMockExamStore((s) => s.setAnswer);
  const finish = useMockExamStore((s) => s.finish);
  const timeUp = useMockExamStore((s) => s.timeUp);
  const answers = useMockExamStore((s) => s.answers);

  const questionIds = useMockExamStore((s) => s.questionIds);
  const questions = useMemo(() => getQuestionsForActiveSession(), [questionIds]);
  const [index, setIndex] = useState(0);
  const [remain, setRemain] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[index];

  const goResult = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    router.replace('/mock-exam/result');
  }, [router]);

  useEffect(() => {
    if (!presetId || questions.length === 0) {
      router.replace('/mock-exam');
      return;
    }
    if (finishedAt) {
      goResult();
    }
  }, [presetId, questions.length, finishedAt, router, goResult]);

  useEffect(() => {
    if (!endsAt || finishedAt) return;
    const tick = () => {
      const left = Math.ceil((endsAt - Date.now()) / 1000);
      setRemain(left);
      if (left <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        timeUp();
        goResult();
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endsAt, finishedAt, goResult, timeUp]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && endsAt && !finishedAt) {
        const left = Math.ceil((endsAt - Date.now()) / 1000);
        setRemain(left);
        if (left <= 0) {
          timeUp();
          goResult();
        }
      }
    });
    return () => sub.remove();
  }, [endsAt, finishedAt, goResult, timeUp]);

  if (!q || q.soru_tipi !== 'MCQ' || !q.şıklar || q.doğru_index === undefined) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.err}>Oturum yok.</Text>
        <Pressable onPress={() => router.replace('/mock-exam')}>
          <Text style={styles.link}>Deneme seç</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const selected = answers[q.question_id];
  const urgent = remain <= 120;

  const onSubmitEarly = () => {
    finish();
    goResult();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>
          Soru {index + 1} / {questions.length}
        </Text>
        <Text style={[styles.timer, urgent && styles.timerUrgent]}>{formatClock(remain)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.qtext}>{q.metin}</Text>
        {q.şıklar.map((opt, idx) => {
          const on = selected === idx;
          return (
            <Pressable
              key={idx}
              style={[styles.option, on && styles.optionOn]}
              onPress={() => {
                setAnswer(q.question_id, idx);
              }}>
              <Text style={styles.optLabel}>{String.fromCharCode(65 + idx)})</Text>
              <Text style={styles.optText}>{opt}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.navBtn, index === 0 && styles.navDisabled]}
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}>
          <Text style={styles.navBtnText}>Önceki</Text>
        </Pressable>
        {index < questions.length - 1 ? (
          <Pressable style={styles.navBtnPrimary} onPress={() => setIndex((i) => i + 1)}>
            <Text style={styles.navBtnPrimaryText}>Sonraki</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.navBtnPrimary} onPress={onSubmitEarly}>
            <Text style={styles.navBtnPrimaryText}>Bitir</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progress: { fontSize: 14, fontWeight: '700', color: Brand.navy },
  timer: { fontSize: 20, fontWeight: '800', color: Brand.electricDim },
  timerUrgent: { color: Brand.danger },
  scroll: { padding: 16, paddingBottom: 100 },
  qtext: { fontSize: 16, lineHeight: 24, color: '#0f172a', marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  optionOn: { borderColor: Brand.electricDim, backgroundColor: '#ecfeff' },
  optLabel: { fontWeight: '800', color: Brand.navy, width: 28 },
  optText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  navDisabled: { opacity: 0.4 },
  navBtnText: { fontWeight: '700', color: Brand.navy },
  navBtnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Brand.navy,
    alignItems: 'center',
  },
  navBtnPrimaryText: { fontWeight: '800', color: '#fff' },
  err: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 40 },
  link: { marginTop: 12, textAlign: 'center', color: Brand.electricDim, fontWeight: '700' },
});

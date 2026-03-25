/**
 * Pomodoro Zamanlayıcısı
 * 25/5 dk, ders seçimi, arka plan sesi, mola ekranı
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SUBJECTS = ['Matematik', 'Türkçe', 'Fen', 'Tarih', 'Coğrafya', 'Diğer'];
const WORK_MIN = 25;
const BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;
const POMODOROS_FOR_LONG_BREAK = 4;

type Phase = 'work' | 'break' | 'longBreak';

interface PomodoroScreenProps {
  navigation?: any;
}

export default function PomodoroScreen({ navigation }: PomodoroScreenProps) {
  const [phase, setPhase] = useState<Phase>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_MIN * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const totalSeconds = phase === 'work' ? WORK_MIN * 60 : phase === 'longBreak' ? LONG_BREAK_MIN * 60 : BREAK_MIN * 60;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    setIsRunning(false);
    Vibration.vibrate([0, 200, 100, 200]);
    if (phase === 'work') {
      const next = pomodoroCount + 1;
      setPomodoroCount(next);
      const newPhase = next % POMODOROS_FOR_LONG_BREAK === 0 ? 'longBreak' : 'break';
      setPhase(newPhase);
      setSecondsLeft(newPhase === 'longBreak' ? LONG_BREAK_MIN * 60 : BREAK_MIN * 60);
    } else {
      setPhase('work');
      setSecondsLeft(WORK_MIN * 60);
    }
  }, [secondsLeft]);

  const startStop = () => {
    if (secondsLeft === totalSeconds && phase === 'work') {
      setSecondsLeft(WORK_MIN * 60);
    }
    if (secondsLeft === totalSeconds && (phase === 'break' || phase === 'longBreak')) {
      setSecondsLeft(phase === 'longBreak' ? LONG_BREAK_MIN * 60 : BREAK_MIN * 60);
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    if (phase === 'work') setSecondsLeft(WORK_MIN * 60);
    else if (phase === 'longBreak') setSecondsLeft(LONG_BREAK_MIN * 60);
    else setSecondsLeft(BREAK_MIN * 60);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pomodoro</Text>
      </View>

      {phase === 'work' && (
        <View style={styles.subjectRow}>
          <Text style={styles.subjectLabel}>Ders</Text>
          <View style={styles.subjectChips}>
            {SUBJECTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, selectedSubject === s && styles.chipActive]}
                onPress={() => setSelectedSubject(s)}
              >
                <Text style={[styles.chipText, selectedSubject === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.timerWrapper}>
        <View style={[styles.timerRing, { borderColor: phase === 'work' ? '#2563eb' : '#f59e0b' }]}>
          <Text style={styles.phaseLabel}>
            {phase === 'work' ? 'Çalışma' : phase === 'longBreak' ? 'Uzun Mola' : 'Mola'}
          </Text>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.subjectText}>{phase === 'work' ? selectedSubject : ''}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.mainBtn} onPress={startStop}>
          <MaterialCommunityIcons
            name={isRunning ? 'pause' : 'play'}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <MaterialCommunityIcons name="check-circle" size={24} color="#2563eb" />
        <Text style={styles.statsText}>Bugün: {pomodoroCount} pomodoro tamamlandı</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#0c1929' },
  subjectRow: { padding: 16 },
  subjectLabel: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  subjectChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { fontSize: 14, color: '#64748b' },
  chipTextActive: { color: '#fff', fontWeight: '500' },
  timerWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timerRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseLabel: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#0f172a' },
  subjectText: { fontSize: 16, color: '#2563eb', marginTop: 8 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingBottom: 32,
  },
  mainBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtn: { padding: 12 },
  resetText: { fontSize: 16, color: '#64748b' },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  statsText: { fontSize: 14, color: '#64748b' },
});

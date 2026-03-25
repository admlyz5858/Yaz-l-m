import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Brand } from '@/constants/theme';
import type { SoundPreset } from '@/store/pomodoroStore';
import { usePomodoroStore } from '@/store/pomodoroStore';

type Phase = 'idle' | 'work' | 'short' | 'long';

const SOUND_OPTIONS: { id: SoundPreset; label: string }[] = [
  { id: 'silent', label: 'Sessiz' },
  { id: 'rain', label: 'Yağmur (yakında)' },
  { id: 'library', label: 'Kütüphane (yakında)' },
  { id: 'lofi', label: 'Lo-fi (yakında)' },
  { id: 'forest', label: 'Orman (yakında)' },
];

function formatMmSs(sec: number): string {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * PDF Bölüm 8 — Pomodoro: süre, mola, arka plan sesi (stub), titreşim, basit istatistik.
 */
export default function PomodoroScreen() {
  const settings = usePomodoroStore((s) => s.settings);
  const setSettings = usePomodoroStore((s) => s.setSettings);
  const recordWorkSession = usePomodoroStore((s) => s.recordWorkSession);
  const resetTodayIfNeeded = usePomodoroStore((s) => s.resetTodayIfNeeded);
  const completedToday = usePomodoroStore((s) => s.completedWorkToday);
  const streakDays = usePomodoroStore((s) => s.streakDays);
  const totalMinutes = usePomodoroStore((s) => s.totalWorkMinutes);

  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState('');
  /** Bu döngüde tamamlanan çalışma sayısı (4. sonrası uzun mola) */
  const workStreakRef = useRef(0);
  const completingRef = useRef(false);

  const totalPhaseSec = useMemo(() => {
    if (phase === 'work') return settings.workSec;
    if (phase === 'short') return settings.shortBreakSec;
    if (phase === 'long') return settings.longBreakSec;
    return settings.workSec;
  }, [phase, settings]);

  const progress = totalPhaseSec > 0 ? 1 - remaining / totalPhaseSec : 0;

  useEffect(() => {
    resetTodayIfNeeded();
  }, [resetTodayIfNeeded]);

  const onPhaseComplete = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;

    if (phase === 'work') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const mins = Math.round(settings.workSec / 60);
      recordWorkSession(mins, subject.trim() || undefined);
      workStreakRef.current += 1;
      const nextLong = workStreakRef.current % settings.sessionsUntilLong === 0;
      setPhase(nextLong ? 'long' : 'short');
      setRemaining(nextLong ? settings.longBreakSec : settings.shortBreakSec);
      setRunning(true);
    } else if (phase === 'short' || phase === 'long') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhase('work');
      setRemaining(settings.workSec);
      setRunning(true);
    }

    queueMicrotask(() => {
      completingRef.current = false;
    });
  }, [phase, recordWorkSession, settings, subject]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, remaining]);

  useEffect(() => {
    if (!running || remaining !== 0 || phase === 'idle') return;
    onPhaseComplete();
  }, [running, remaining, phase, onPhaseComplete]);

  const startWork = () => {
    resetTodayIfNeeded();
    workStreakRef.current = 0;
    setPhase('work');
    setRemaining(settings.workSec);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const resume = () => remaining > 0 && setRunning(true);

  const stopToIdle = () => {
    setRunning(false);
    setPhase('idle');
    setRemaining(0);
  };

  const SIZE = 220;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {phase === 'idle' ? (
          <>
            <Text style={styles.lead}>
              Çalışma / kısa mola / uzun mola sürelerini ayarla; odak oturumu başlat.
            </Text>

            <Text style={styles.label}>Çalışma (dakika)</Text>
            <View style={styles.stepRow}>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ workSec: Math.max(15 * 60, settings.workSec - 5 * 60) })
                }>
                <Text style={styles.stepTxt}>-5</Text>
              </Pressable>
              <Text style={styles.stepVal}>{Math.round(settings.workSec / 60)} dk</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ workSec: Math.min(90 * 60, settings.workSec + 5 * 60) })
                }>
                <Text style={styles.stepTxt}>+5</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Kısa mola (dk)</Text>
            <View style={styles.stepRow}>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ shortBreakSec: Math.max(60, settings.shortBreakSec - 60) })
                }>
                <Text style={styles.stepTxt}>-1</Text>
              </Pressable>
              <Text style={styles.stepVal}>{Math.round(settings.shortBreakSec / 60)} dk</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ shortBreakSec: Math.min(30 * 60, settings.shortBreakSec + 60) })
                }>
                <Text style={styles.stepTxt}>+1</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Uzun mola (dk)</Text>
            <View style={styles.stepRow}>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ longBreakSec: Math.max(5 * 60, settings.longBreakSec - 60) })
                }>
                <Text style={styles.stepTxt}>-1</Text>
              </Pressable>
              <Text style={styles.stepVal}>{Math.round(settings.longBreakSec / 60)} dk</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() =>
                  setSettings({ longBreakSec: Math.min(45 * 60, settings.longBreakSec + 60) })
                }>
                <Text style={styles.stepTxt}>+1</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Arka plan sesi</Text>
            <View style={styles.chips}>
              {SOUND_OPTIONS.map((o) => (
                <Pressable
                  key={o.id}
                  style={[styles.chip, settings.soundPreset === o.id && styles.chipOn]}
                  onPress={() => setSettings({ soundPreset: o.id })}>
                  <Text style={[styles.chipTxt, settings.soundPreset === o.id && styles.chipTxtOn]}>
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Ders / konu (opsiyonel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Paragraf"
              placeholderTextColor="#94a3b8"
              value={subject}
              onChangeText={setSubject}
            />

            <View style={styles.statsRow}>
              <Text style={styles.stat}>Bugün: {completedToday} pomodoro</Text>
              <Text style={styles.stat}>Seri: {streakDays} gün</Text>
            </View>
            <Text style={styles.statSub}>Toplam odak: ~{totalMinutes} dk</Text>

            <Pressable style={styles.primary} onPress={startWork}>
              <Ionicons name="play" size={22} color="#fff" />
              <Text style={styles.primaryTxt}>Başlat</Text>
            </Pressable>

            <Text style={styles.stub}>
              Uygulama engelleme ve sanal çalışma odaları sonraki sürümde (PDF 8.2).
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.phaseLabel}>
              {phase === 'work' ? 'Odak' : phase === 'short' ? 'Kısa mola' : 'Uzun mola'}
            </Text>

            <View style={styles.ringWrap}>
              <Svg width={SIZE} height={SIZE}>
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke="#e2e8f0"
                  strokeWidth={STROKE}
                  fill="none"
                />
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke={phase === 'work' ? Brand.electric : Brand.success}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${C} ${C}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.timeBig}>{formatMmSs(remaining)}</Text>
                {phase === 'work' && subject ? <Text style={styles.subj}>{subject}</Text> : null}
              </View>
            </View>

            <View style={styles.controls}>
              {running ? (
                <Pressable style={styles.secondary} onPress={pause}>
                  <Ionicons name="pause" size={22} color={Brand.navy} />
                  <Text style={styles.secondaryTxt}>Duraklat</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.secondary} onPress={resume}>
                  <Ionicons name="play" size={22} color={Brand.navy} />
                  <Text style={styles.secondaryTxt}>Devam</Text>
                </Pressable>
              )}
              <Pressable style={styles.dangerOutline} onPress={stopToIdle}>
                <Text style={styles.dangerTxt}>Bitir</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>
              {phase === 'work'
                ? 'Bildirim engelleme bu sürümde stub; tamamlanınca titreşim + başarı hissi.'
                : 'Molayı bitirince otomatik yeni çalışma başlar.'}
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 40 },
  lead: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  stepBtn: {
    width: 48,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: { fontSize: 16, fontWeight: '700', color: Brand.navy },
  stepVal: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: Brand.navy },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  chipOn: { borderColor: Brand.electric, backgroundColor: 'rgba(34,211,238,0.12)' },
  chipTxt: { fontSize: 12, fontWeight: '600', color: '#475569' },
  chipTxtOn: { color: Brand.navy },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  stat: { fontSize: 13, fontWeight: '600', color: '#475569' },
  statSub: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
  primary: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Brand.navy,
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryTxt: { color: '#fff', fontWeight: '800', fontSize: 17 },
  stub: { marginTop: 16, fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  phaseLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.electricDim,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ringWrap: { alignSelf: 'center', marginVertical: 16, width: 220, height: 220 },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBig: { fontSize: 44, fontWeight: '800', color: Brand.navy },
  subj: { marginTop: 8, fontSize: 14, color: '#64748b' },
  controls: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 8 },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  secondaryTxt: { fontWeight: '700', color: Brand.navy },
  dangerOutline: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.danger,
  },
  dangerTxt: { fontWeight: '700', color: Brand.danger },
  hint: { marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },
});

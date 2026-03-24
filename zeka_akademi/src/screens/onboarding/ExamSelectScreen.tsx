/**
 * EKRAN 5 — Sınav Seçimi (Step 2/4: Hedef Sınav)
 * YKS, LGS, KPSS, ALES, DGS, Üniversite Dersleri, Diğer
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EXAMS = [
  { id: 'yks', name: 'YKS (TYT + AYT)', icon: 'math-compass' as const, date: 'Haziran 2025', duration: '12 ay' },
  { id: 'lgs', name: 'LGS', icon: 'book-open' as const, date: 'Haziran 2025', duration: '10 ay' },
  { id: 'kpss', name: 'KPSS', icon: 'clipboard-text' as const, date: 'Temmuz 2025', duration: '8 ay' },
  { id: 'ales', name: 'ALES', icon: 'school' as const, date: 'Mayıs 2025', duration: '4 ay' },
  { id: 'dgs', name: 'DGS', icon: 'book-open' as const, date: 'Temmuz 2025', duration: '4 ay' },
  { id: 'university', name: 'Üniversite Dersleri', icon: 'domain' as const, date: '-', duration: '-' },
  { id: 'other', name: 'Diğer', icon: 'star' as const, date: '-', duration: '-' },
];

interface ExamSelectScreenProps {
  navigation: any;
}

export default function ExamSelectScreen({ navigation }: ExamSelectScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [yksType, setYksType] = useState<'SAY' | 'EA' | 'SÖZ' | 'DİL' | ''>('');

  const toggleExam = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    if (id === 'yks' && !next.has(id)) setYksType('');
    setSelected(next);
  };

  const handleContinue = () => {
    navigation.navigate('LevelTest');
  };

  const isYksSelected = selected.has('yks');

  return (
    <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Hedef Sınavını Seç</Text>
          <Text style={styles.subtitle}>Step 2/4</Text>

          {EXAMS.map((exam) => (
            <TouchableOpacity
              key={exam.id}
              style={[styles.card, selected.has(exam.id) && styles.cardSelected]}
              onPress={() => toggleExam(exam.id)}
            >
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name={exam.icon} size={32} color="#fff" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{exam.name}</Text>
                <Text style={styles.cardMeta}>{exam.date} • {exam.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {isYksSelected && (
            <View style={styles.yksExtras}>
              <Text style={styles.label}>Puan türü</Text>
              <View style={styles.yksRow}>
                {(['SAY', 'EA', 'SÖZ', 'DİL'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.yksBtn, yksType === t && styles.yksBtnActive]}
                    onPress={() => setYksType(t)}
                  >
                    <Text style={styles.yksBtnText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Hedef netim (opsiyonel)</Text>
              <View style={styles.targetRow}>
                <Text style={styles.targetPlaceholder}>___</Text>
              </View>
            </View>
          )}

          <View style={styles.progress}>
            <View style={[styles.progressBar, { width: '50%' }]} />
            <Text style={styles.progressText}>2/4</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleContinue}
          >
            <Text style={styles.primaryBtnText}>Devam Et</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardSelected: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardIcon: { marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cardMeta: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  yksExtras: { marginTop: 16, marginBottom: 24 },
  label: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  yksRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  yksBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  yksBtnActive: { backgroundColor: 'rgba(255,255,255,0.5)' },
  yksBtnText: { color: '#fff', fontWeight: '600' },
  targetRow: { height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  targetPlaceholder: { color: 'rgba(255,255,255,0.5)', padding: 12 },
  progress: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2, marginRight: 12 },
  progressText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  primaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#0f766e', fontSize: 16, fontWeight: 'bold' },
});

/**
 * AI Planlama Modülü — Haftalık Plan Görünümü
 * Belge: Hafta seçici, Haftalık|Günlük|Aylık toggle, Takvim grid, Görev kartları
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const SUBJECT_COLORS: Record<string, string> = {
  Matematik: '#2196f3',
  Türkçe: '#ff9800',
  Fen: '#4caf50',
  Tarih: '#9c27b0',
  Coğrafya: '#00bcd4',
};

// Örnek haftalık plan verisi
const SAMPLE_TASKS = [
  { id: '1', subject: 'Matematik', topic: 'Türev', duration: 45, day: 0, hour: 9 },
  { id: '2', subject: 'Türkçe', topic: 'Paragraf', duration: 30, day: 0, hour: 10 },
  { id: '3', subject: 'Fen', topic: 'Kimya', duration: 45, day: 1, hour: 14 },
  { id: '4', subject: 'Matematik', topic: 'İntegral', duration: 60, day: 2, hour: 9 },
  { id: '5', subject: 'Tarih', topic: 'Osmanlı', duration: 30, day: 3, hour: 16 },
];

function getWeekRange(offset: number): { start: Date; end: Date; label: string } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start,
    end,
    label: `${start.getDate()}.${start.getMonth() + 1} - ${end.getDate()}.${end.getMonth() + 1}`,
  };
}

interface PlanViewScreenProps {
  navigation?: any;
}

export default function PlanViewScreen({ navigation }: PlanViewScreenProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'monthly'>('weekly');
  const week = getWeekRange(weekOffset);

  const tasksByDay = DAYS.map((_, i) =>
    SAMPLE_TASKS.filter((t) => t.day === i)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Geri butonu */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Haftalık Plan</Text>
        <TouchableOpacity
          style={styles.analysisBtn}
          onPress={() => navigation?.navigate('PlanAnalysis')}
        >
          <MaterialCommunityIcons name="chart-pie" size={22} color="#0c1929" />
        </TouchableOpacity>
      </View>
      {/* Üst araç çubuğu */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.weekNav}
          onPress={() => setWeekOffset(weekOffset - 1)}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.weekLabel}>{week.label}</Text>
        <TouchableOpacity
          style={styles.weekNav}
          onPress={() => setWeekOffset(weekOffset + 1)}
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color="#0c1929" />
        </TouchableOpacity>
      </View>

      {/* Görünüm toggle */}
      <View style={styles.viewToggle}>
        {(['weekly', 'daily', 'monthly'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.toggleBtn, viewMode === m && styles.toggleBtnActive]}
            onPress={() => setViewMode(m)}
          >
            <Text style={[styles.toggleText, viewMode === m && styles.toggleTextActive]}>
              {m === 'weekly' ? 'Haftalık' : m === 'daily' ? 'Günlük' : 'Aylık'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'weekly' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {DAYS.map((day, i) => (
            <View key={day} style={styles.dayColumn}>
              <Text style={styles.dayHeader}>{day}</Text>
              {tasksByDay[i].map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    { borderLeftColor: SUBJECT_COLORS[task.subject] || '#2563eb' },
                  ]}
                >
                  <Text style={styles.taskSubject}>{task.subject}</Text>
                  <Text style={styles.taskTopic}>{task.topic}</Text>
                  <Text style={styles.taskDuration}>{task.duration} dk</Text>
                </TouchableOpacity>
              ))}
              {tasksByDay[i].length === 0 && (
                <Text style={styles.emptyDay}>—</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {viewMode === 'daily' && (
        <ScrollView style={styles.scroll}>
          <Text style={styles.placeholder}>Günlük görünüm (yakında)</Text>
        </ScrollView>
      )}

      {viewMode === 'monthly' && (
        <ScrollView style={styles.scroll}>
          <Text style={styles.placeholder}>Aylık görünüm (yakında)</Text>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.aiButton}>
        <MaterialCommunityIcons name="robot" size={20} color="#fff" />
        <Text style={styles.aiButtonText}>AI ile Yeniden Planla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0c1929',
  },
  analysisBtn: { padding: 4 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekNav: { padding: 4 },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c1929',
  },
  viewToggle: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 14, color: '#666' },
  toggleTextActive: { color: '#0c1929', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 80,
  },
  dayColumn: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 80,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  taskSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  taskTopic: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  taskDuration: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  emptyDay: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    paddingVertical: 8,
  },
  placeholder: {
    textAlign: 'center',
    color: '#999',
    padding: 32,
  },
  aiButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

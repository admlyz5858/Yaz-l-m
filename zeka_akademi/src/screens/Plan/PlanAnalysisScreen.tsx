/**
 * Plan Analizi ve İlerleme Ekranı
 * Belge: Tamamlama oranı, ders dağılımı, hedef vs gerçek, streak
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PlanAnalysisScreenProps {
  navigation?: any;
}

export default function PlanAnalysisScreen({ navigation }: PlanAnalysisScreenProps) {
  const completionRate = 72;
  const plannedHours = 5;
  const actualHours = 3.5;
  const streak = 4;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Analizi</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Bu Hafta</Text>

        {/* Tamamlama oranı */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tamamlama Oranı</Text>
          <View style={styles.rateRow}>
            <Text style={styles.ringValue}>%{completionRate}</Text>
            <View style={[styles.barBg, { flex: 1 }]}>
              <View
                style={[
                  styles.barFill,
                  { width: `${completionRate}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Hedef vs Gerçek */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Hedef vs Gerçek</Text>
          <Text style={styles.comparison}>
            Planladığın {plannedHours} saate karşı {actualHours} saat çalıştın
          </Text>
          <View style={styles.barWrapper}>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(actualHours / plannedHours) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.card}>
          <View style={styles.streakRow}>
            <MaterialCommunityIcons name="fire" size={32} color="#f59e0b" />
            <View>
              <Text style={styles.streakValue}>{streak} gün</Text>
              <Text style={styles.streakLabel}>Üst üste plana uyuldu</Text>
            </View>
          </View>
        </View>

        {/* Ders dağılımı özeti */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bu Hafta En Çok / En Az</Text>
          <Text style={styles.summary}>En çok: Matematik</Text>
          <Text style={styles.summary}>En az: Tarih</Text>
        </View>
      </ScrollView>
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
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0c1929',
  },
  scroll: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c1929',
    minWidth: 50,
  },
  comparison: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  barWrapper: { marginTop: 8 },
  barBg: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  summary: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
});

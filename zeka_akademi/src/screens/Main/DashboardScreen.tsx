/**
 * Ana Panel (Dashboard)
 * Belge: Üst çubuk, Geri sayım widget, Görevler, Quick Actions
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const QUICK_ACTIONS = [
  { id: 'ai-solve', label: 'AI Soru Çöz', icon: 'camera' as const, screen: null },
  { id: 'flashcard', label: 'Flash Kart', icon: 'cards' as const, screen: null },
  { id: 'exam', label: 'Deneme Sınavı', icon: 'file-document' as const, screen: null },
  { id: 'plan', label: 'AI Plan Gör', icon: 'calendar' as const, screen: 'PlanView' as const },
  { id: 'bank', label: 'Soru Bankası', icon: 'book-open-variant' as const, screen: null },
  { id: 'quiz', label: 'Bilgi Yarışması', icon: 'trophy' as const, screen: null },
];

interface DashboardScreenProps {
  navigation?: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Üst çubuk */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>{greeting}, Kullanıcı!</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
          </View>
          <View style={styles.icons}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#1a1a1a" />
            <MaterialCommunityIcons name="fire" size={24} color="#f59e0b" />
          </View>
        </View>

        {/* Geri sayım widget */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTitle}>YKS — 127 Gün Kaldı</Text>
          <Text style={styles.countdownSub}>Hedef puana %67 ulaştın</Text>
        </View>

        {/* Bugünkü görevler */}
        <Text style={styles.sectionTitle}>Bugünkü Görevler</Text>
        <View style={styles.taskCard}>
          <Text style={styles.taskText}>Matematik - Türev konusu (45 dk)</Text>
          <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="#999" />
        </View>
        <View style={styles.taskCard}>
          <Text style={styles.taskText}>Türkçe - 20 soru çöz</Text>
          <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="#999" />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={styles.quickItem}
              onPress={() => a.screen && navigation?.navigate(a.screen)}
            >
              <MaterialCommunityIcons name={a.icon} size={28} color="#7c4dff" />
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  scroll: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { flex: 1 },
  greetingText: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#7c4dff', borderRadius: 3 },
  icons: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  countdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#7c4dff',
  },
  countdownTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' },
  countdownSub: { fontSize: 14, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  taskText: { flex: 1, fontSize: 16 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickItem: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
});

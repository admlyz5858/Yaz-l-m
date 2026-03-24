/**
 * AI Çözüm Ekranı
 * Adım adım çözüm, Sokratik mod toggle, Benzer soru önerisi
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Örnek adım adım çözüm (gerçekte AI'dan gelecek)
const SAMPLE_STEPS = [
  { id: '1', text: 'x² - 4 = 0 ifadesinde 4\'ü sağ tarafa atalım: x² = 4', detail: 'Denklemin her iki tarafına 4 ekleyerek x²\'yi yalnız bırakıyoruz.' },
  { id: '2', text: 'Her iki tarafın karekökünü alalım: x = ±2', detail: 'Karekök alırken hem pozitif hem negatif değeri dikkate alırız.' },
  { id: '3', text: 'Çözüm kümesi: {-2, 2}', detail: 'Denklemin iki farklı reel kökü vardır.' },
];

interface AISolutionScreenProps {
  navigation?: any;
  route?: { params?: { question: string; source?: string } };
}

export default function AISolutionScreen({ navigation, route }: AISolutionScreenProps) {
  const question = route?.params?.question ?? 'Soru yüklenemedi';
  const [socraticMode, setSocraticMode] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const displayedSteps = socraticMode
    ? SAMPLE_STEPS.map((s, i) => ({ ...s, text: `İpucu ${i + 1}: ${s.text}` }))
    : SAMPLE_STEPS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f766e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Çözüm</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Orijinal soru */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Soru</Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        {/* Sokratik mod toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Sokratik Mod (ipuçları)</Text>
          <Switch
            value={socraticMode}
            onValueChange={setSocraticMode}
            trackColor={{ false: '#e0e0e0', true: '#b47cff' }}
            thumbColor="#fff"
          />
        </View>

        {/* Adım adım çözüm */}
        <Text style={styles.sectionTitle}>
          {socraticMode ? 'İpuçları' : 'Adım Adım Çözüm'}
        </Text>
        {displayedSteps.map((step) => (
          <TouchableOpacity
            key={step.id}
            style={styles.stepCard}
            onPress={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
          >
            <Text style={styles.stepText}>{step.text}</Text>
            {expandedStep === step.id && step.detail && (
              <Text style={styles.stepDetail}>{step.detail}</Text>
            )}
            {step.detail && (
              <Text style={styles.stepHint}>
                {expandedStep === step.id ? 'Daralt' : 'Bu adımı anlamadım'}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Aksiyonlar */}
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="cards" size={20} color="#0d9488" />
          <Text style={styles.actionBtnText}>Bu soruyu soru bankasına ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="format-list-numbered" size={20} color="#0d9488" />
          <Text style={styles.actionBtnText}>Benzer 5 Soru Çöz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa' },
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#0f766e' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0d9488',
  },
  questionLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  questionText: { fontSize: 16, color: '#1a1a1a', lineHeight: 24 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 16, color: '#1a1a1a' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  stepText: { fontSize: 16, color: '#1a1a1a', lineHeight: 24 },
  stepDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  stepHint: {
    fontSize: 13,
    color: '#0d9488',
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionBtnText: { fontSize: 15, color: '#0d9488', fontWeight: '500' },
});

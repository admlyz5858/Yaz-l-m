/**
 * AI Soru Çözme — Giriş Ekranı
 * MVP: Metin yazarak, Kamera (simülasyon)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AISolveEntryScreenProps {
  navigation?: any;
}

export default function AISolveEntryScreen({ navigation }: AISolveEntryScreenProps) {
  const [questionText, setQuestionText] = useState('');

  const handleSolve = () => {
    if (questionText.trim()) {
      navigation?.navigate('AISolution', {
        question: questionText.trim(),
        source: 'text',
      });
    }
  };

  const handleCamera = () => {
    // Kamera simülasyonu: örnek soru ile geç
    navigation?.navigate('AISolution', {
      question: 'x² - 4 = 0 denkleminin çözüm kümesi nedir?',
      source: 'camera',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Soru Çöz</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.optionCard} onPress={handleCamera}>
          <MaterialCommunityIcons name="camera" size={48} color="#2563eb" />
          <Text style={styles.optionTitle}>Kamera ile Çek</Text>
          <Text style={styles.optionDesc}>Soruyu fotoğrafla, anında çözüm al</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>veya</Text>

        <Text style={styles.label}>Soruyu yaz</Text>
        <TextInput
          style={styles.input}
          placeholder="Soruyu buraya yazın veya yapıştırın..."
          placeholderTextColor="#999"
          value={questionText}
          onChangeText={setQuestionText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.solveBtn, !questionText.trim() && styles.solveBtnDisabled]}
          onPress={handleSolve}
          disabled={!questionText.trim()}
        >
          <MaterialCommunityIcons name="robot" size={22} color="#fff" />
          <Text style={styles.solveBtnText}>Çözümü Al</Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#0c1929' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e8e8e8',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 12,
  },
  optionDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#1a1a1a',
  },
  solveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  solveBtnDisabled: { opacity: 0.5 },
  solveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

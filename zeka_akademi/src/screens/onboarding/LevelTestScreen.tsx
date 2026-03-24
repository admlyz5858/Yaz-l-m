/**
 * EKRAN 6 — Seviye Tespiti (Step 3/4: Hızlı Tanıma Testi)
 * 10 soru, 60 sn/soru, adaptif algoritma
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Geçici örnek sorular
const SAMPLE_QUESTIONS = [
  { id: '1', question: '2 + 2 = ?', options: ['3', '4', '5', '6'], correct: 1 },
  { id: '2', question: 'Türkiye\'nin başkenti neresidir?', options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'], correct: 1 },
  { id: '3', question: 'Suyun kimyasal formülü nedir?', options: ['CO2', 'H2O', 'NaCl', 'O2'], correct: 1 },
];

interface LevelTestScreenProps {
  navigation: any;
}

export default function LevelTestScreen({ navigation }: LevelTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers([...answers, optionIndex]);
    if (currentIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(60);
    } else {
      navigation.navigate('PlanCreate');
    }
  };

  const handleSkip = () => {
    navigation.navigate('PlanCreate');
  };

  const q = SAMPLE_QUESTIONS[currentIndex];

  return (
    <LinearGradient colors={['#0f766e', '#0d9488']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.progress}>Soru {currentIndex + 1}/{SAMPLE_QUESTIONS.length}</Text>
          <Text style={styles.timer}>{timeLeft} sn</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }]} />
        </View>

        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => handleAnswer(i)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Geç</Text>
        </TouchableOpacity>

        <View style={styles.stepProgress}>
          <View style={[styles.stepBar, { width: '75%' }]} />
          <Text style={styles.stepText}>3/4</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progress: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  timer: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 32 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  question: { fontSize: 20, color: '#fff', fontWeight: '600', marginBottom: 24 },
  option: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: { color: '#fff', fontSize: 16 },
  skipBtn: { marginTop: 24, alignItems: 'center' },
  skipText: { color: 'rgba(255,255,255,0.8)', textDecorationLine: 'underline' },
  stepProgress: { flexDirection: 'row', alignItems: 'center', marginTop: 32 },
  stepBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2, marginRight: 12 },
  stepText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
});

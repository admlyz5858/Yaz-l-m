/**
 * Soru Çözüm Modu
 * Soru + şıklar, anlık geri bildirim, "Önce düşün" modu
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getTurkishQuestionById, getNextTurkishQuestionId } from '../../data/turkishQuestions';

interface QuestionSolveScreenProps {
  navigation?: any;
  route?: { params?: { questionId: string } };
}

export default function QuestionSolveScreen({ navigation, route }: QuestionSolveScreenProps) {
  const questionId = route?.params?.questionId ?? '';
  const q = getTurkishQuestionById(questionId);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [thinkModeLock, setThinkModeLock] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    setSelectedIndex(null);
    setShowFeedback(false);
    setThinkModeLock(true);
    setSecondsLeft(30);
  }, [questionId]);

  useEffect(() => {
    if (!thinkModeLock) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setThinkModeLock(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [thinkModeLock]);

  const handleSelect = (index: number) => {
    if (thinkModeLock || !q) return;
    setSelectedIndex(index);
    setShowFeedback(true);
  };

  if (!q) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
          </TouchableOpacity>
        </View>
        <Text style={styles.empty}>Soru bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const isCorrect = selectedIndex === q.correctIndex;
  const nextId = getNextTurkishQuestionId(questionId);

  const goNext = () => {
    if (nextId) {
      navigation?.replace('QuestionSolve', { questionId: nextId });
    } else {
      navigation?.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        {thinkModeLock && (
          <Text style={styles.timer}>Önce düşün: {secondsLeft} sn</Text>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.topicBadge}>{q.topic} • {q.exam}</Text>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        {q.options.map((opt, i) => {
          let optionStyle = styles.option;
          if (showFeedback && selectedIndex === i) {
            optionStyle = isCorrect ? styles.optionCorrect : styles.optionWrong;
          } else if (showFeedback && i === q.correctIndex) {
            optionStyle = styles.optionCorrect;
          }
          return (
            <TouchableOpacity
              key={i}
              style={[optionStyle, thinkModeLock && styles.optionDisabled]}
              onPress={() => handleSelect(i)}
              disabled={showFeedback}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
              <Text style={styles.optionText}>{opt}</Text>
              {showFeedback && selectedIndex === i && (
                <MaterialCommunityIcons
                  name={isCorrect ? 'check-circle' : 'close-circle'}
                  size={24}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          );
        })}

        {showFeedback && (
          <View style={[styles.feedbackCard, !isCorrect && styles.feedbackCardWrong]}>
            <Text style={styles.feedbackTitle}>
              {isCorrect ? 'Doğru!' : 'Yanlış'}
            </Text>
            <Text style={styles.feedbackText}>{q.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
              <Text style={styles.nextBtnText}>
                {nextId ? 'Sonraki Soru' : 'Soru Bankasına Dön'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  timer: { fontSize: 14, color: '#f59e0b', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  topicBadge: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    color: '#1a1a1a',
    lineHeight: 26,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionDisabled: { opacity: 0.7 },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  optionText: { flex: 1, fontSize: 16, color: '#1a1a1a' },
  feedbackCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  feedbackCardWrong: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#f44336',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  nextBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  empty: { padding: 24, fontSize: 16, color: '#666' },
});

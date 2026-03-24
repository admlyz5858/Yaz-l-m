/**
 * Flash Kart Çalışma Ekranı
 * Ön-arka kart, flip, FSRS 5 buton (Yeniden/Zor/Orta/Kolay/Çok Kolay)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SAMPLE_CARDS = [
  { id: '1', front: 'Türev nedir?', back: 'Bir fonksiyonun belirli bir noktadaki anlık değişim hızıdır. f\'(x) ile gösterilir.' },
  { id: '2', front: 'İntegral ile türev arasındaki ilişki', back: 'İntegral, türevin ters işlemidir. Türevi alınan fonksiyona geri dönmek için integral kullanılır.' },
  { id: '3', front: 'Zincir kuralı (chain rule)', back: 'y=f(g(x)) ise y\' = f\'(g(x)) · g\'(x). İç fonksiyonun türevi ile dış fonksiyonun türevi çarpılır.' },
];

type Rating = 1 | 2 | 3 | 4 | 5;

const RATINGS: { value: Rating; label: string; color: string }[] = [
  { value: 1, label: 'Yeniden', color: '#f44336' },
  { value: 2, label: 'Zor', color: '#ff9800' },
  { value: 3, label: 'Orta', color: '#ffc107' },
  { value: 4, label: 'Kolay', color: '#8bc34a' },
  { value: 5, label: 'Çok Kolay', color: '#4caf50' },
];

interface FlashcardStudyScreenProps {
  navigation?: any;
  route?: { params?: { deckId: string; deckName: string } };
}

export default function FlashcardStudyScreen({ navigation, route }: FlashcardStudyScreenProps) {
  const deckName = route?.params?.deckName ?? 'Deste';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const card = SAMPLE_CARDS[currentIndex];
  const total = SAMPLE_CARDS.length;
  const remaining = total - currentIndex - 1;

  const flip = () => setShowBack(!showBack);

  const handleRating = (_rating: Rating) => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowBack(false);
    } else {
      navigation?.goBack();
    }
  };

  if (!card) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f766e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{deckName}</Text>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          Kart {currentIndex + 1}/{total}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / total) * 100}%` },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.cardWrapper} onPress={flip} activeOpacity={1}>
        {!showBack ? (
          <View style={styles.card}>
            <Text style={styles.cardFrontText}>{card.front}</Text>
            <Text style={styles.hint}>Dokunup çevir</Text>
          </View>
        ) : (
          <View style={[styles.card, styles.cardBack]}>
            <Text style={styles.cardBackText}>{card.back}</Text>
          </View>
        )}
      </TouchableOpacity>

      {showBack && (
        <View style={styles.ratings}>
          <Text style={styles.ratingLabel}>Hatırlama?</Text>
          <View style={styles.ratingRow}>
            {RATINGS.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.ratingBtn, { backgroundColor: r.color }]}
                onPress={() => handleRating(r.value)}
              >
                <Text style={styles.ratingBtnText}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bu oturumda kalan: {Math.max(0, remaining)} kart</Text>
        <Text style={styles.footerText}>Tahmini süre: ~{Math.max(0, remaining) * 2} dk</Text>
      </View>
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
  progressRow: { paddingHorizontal: 16, paddingVertical: 12 },
  progressText: { fontSize: 14, color: '#666', marginBottom: 4 },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0d9488',
    borderRadius: 2,
  },
  cardWrapper: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#f0fdfa',
    borderWidth: 2,
    borderColor: '#0d9488',
  },
  cardFrontText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  cardBackText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  hint: { fontSize: 13, color: '#999', marginTop: 12 },
  ratings: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ratingBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  footerText: { fontSize: 13, color: '#666' },
});

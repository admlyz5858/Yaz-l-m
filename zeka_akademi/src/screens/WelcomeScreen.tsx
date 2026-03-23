/**
 * EKRAN 2 — Karşılama Ekranı (Welcome Screen)
 * 3 sayfalık swipeable karşılama seti
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface WelcomePage {
  id: string;
  title: string;
  subtitle?: string;
  icon: 'target' | 'book-open-variant' | 'calendar-check';
}

const PAGES: WelcomePage[] = [
  {
    id: '1',
    title: 'Sınavına 90 Günün Var',
    subtitle: 'Her gün 45 dakika ile hedefe ulaş',
    icon: 'target',
  },
  {
    id: '2',
    title: '1,000+ Soru Bankası + AI Çözüm',
    subtitle: 'Kamera ile soru çek, anında çözüm al',
    icon: 'book-open-variant',
  },
  {
    id: '3',
    title: 'Senin için Özelleştirilmiş Plan',
    subtitle: 'AI ile kişisel çalışma planı oluştur',
    icon: 'calendar-check',
  },
];

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onSignUp, onSignIn }: WelcomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderItem = ({ item }: { item: WelcomePage }) => (
    <View style={styles.page}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={item.icon} size={80} color="#fff" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
    </View>
  );

  const isLastPage = currentIndex === PAGES.length - 1;

  return (
    <LinearGradient
      colors={['#1a237e', '#7c4dff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <FlatList
          ref={flatListRef}
          data={PAGES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />

        {/* Nokta indikatörü */}
        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Butonlar */}
        <View style={styles.buttons}>
          {!isLastPage ? (
            <TouchableOpacity style={styles.nextButton} onPress={goNext}>
              <Text style={styles.nextText}>Devam</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={onSignUp}>
                <Text style={styles.primaryText}>Hemen Başla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={onSignIn}>
                <Text style={styles.secondaryText}>Giriş Yap</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  page: {
    width,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  buttons: {
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand, BrandStrings } from '@/constants/theme';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    key: '1',
    title: `${BrandStrings.appName} ile hedefine odaklan`,
    subtitle: 'Modern arayüz ve akıllı planlama ile sınav hazırlığı.',
  },
  {
    key: '2',
    title: 'Soru bankası + akıllı çözüm',
    subtitle: 'Metinle sor; adım adım rehberlik al.',
  },
  {
    key: '3',
    title: 'Kişiselleştirilmiş çalışma planı',
    subtitle: 'Hedeflerine göre haftalık düzen.',
  },
] as const;

/**
 * Ekran 2 — Karşılama (PDF Bölüm 2.2): 3 sayfa, nokta göstergesi, Hemen Başla / Giriş Yap.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / WINDOW_WIDTH);
    if (i !== page) setPage(i);
  };

  const goNext = () => {
    if (page < PAGES.length - 1) {
      listRef.current?.scrollToOffset({ offset: (page + 1) * WINDOW_WIDTH, animated: true });
    }
  };

  return (
    <LinearGradient
      colors={[Brand.navy, Brand.navyMid, Brand.navyLight]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.safe}>
        <FlatList
          ref={listRef}
          data={[...PAGES]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.page, { width: WINDOW_WIDTH }]}>
              <Text style={styles.pageTitle}>{item.title}</Text>
              <Text style={styles.pageSub}>{item.subtitle}</Text>
            </View>
          )}
        />

        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View key={PAGES[i].key} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>

        {page < PAGES.length - 1 ? (
          <Pressable style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextBtnText}>İleri</Text>
          </Pressable>
        ) : (
          <View style={styles.finalActions}>
            <Pressable style={styles.primaryBtn} onPress={() => router.push('/auth')}>
              <Text style={styles.primaryBtnText}>Hemen Başla</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => router.push('/auth')}>
              <Text style={styles.secondaryBtnText}>Giriş Yap</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  page: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 12,
  },
  pageSub: {
    fontSize: 16,
    color: 'rgba(248,250,252,0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: Brand.electric,
    width: 22,
  },
  nextBtn: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  finalActions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: Brand.electric,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Brand.navy,
    fontWeight: '800',
    fontSize: 17,
  },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: 'rgba(248,250,252,0.9)',
    fontWeight: '600',
    fontSize: 16,
  },
});

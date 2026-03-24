import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type Item = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  premium?: boolean;
  onPress: () => void;
};

/**
 * PDF Bölüm 3.3 — Drawer: Premium özellikler + topluluk + offline + destek.
 */
export function DrawerMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const items: Item[] = [
    {
      key: 'coach',
      label: 'AI Koç ile Konuş',
      icon: 'chatbubbles-outline',
      premium: true,
      onPress: () => {
        onClose();
        // Modül 15 ile bağlanacak
      },
    },
    {
      key: 'teacher',
      label: 'Öğretmen Modu',
      icon: 'school-outline',
      premium: true,
      onPress: () => onClose(),
    },
    {
      key: 'groups',
      label: 'Gruplar ve Arkadaşlar',
      icon: 'people-outline',
      onPress: () => onClose(),
    },
    {
      key: 'plan',
      label: 'AI Çalışma Planı',
      icon: 'calendar-outline',
      onPress: () => {
        onClose();
        router.push('/plan');
      },
    },
    {
      key: 'solve',
      label: 'AI Soru Çöz',
      icon: 'bulb-outline',
      onPress: () => {
        onClose();
        router.push('/solve');
      },
    },
    {
      key: 'bank',
      label: 'Soru Bankası',
      icon: 'library-outline',
      onPress: () => {
        onClose();
        router.push('/question-bank');
      },
    },
    {
      key: 'flash',
      label: 'Flash Kartlar',
      icon: 'albums-outline',
      onPress: () => {
        onClose();
        router.push('/flashcards');
      },
    },
    {
      key: 'offline',
      label: 'İndirilen İçerikler (Offline)',
      icon: 'cloud-download-outline',
      onPress: () => onClose(),
    },
    {
      key: 'help',
      label: 'Destek ve Yardım',
      icon: 'help-circle-outline',
      onPress: () => onClose(),
    },
    {
      key: 'sub',
      label: 'Abonelik Yönetimi',
      icon: 'card-outline',
      onPress: () => {
        onClose();
        router.push('/(drawer)/(tabs)/profile');
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.brand}>Ladek ACADEMY</Text>
        <Text style={styles.sub}>Menü</Text>
      </View>
      {items.map((item) => (
        <Pressable
          key={item.key}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={item.onPress}>
          <Ionicons name={item.icon} size={22} color={Brand.navy} />
          <Text style={styles.rowLabel}>{item.label}</Text>
          {item.premium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
      <Text style={styles.footer}>Starter / Premium katmanları backend ile eklenecek.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  brand: { fontSize: 22, fontWeight: '800', color: Brand.navy },
  sub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  rowPressed: { backgroundColor: '#f1f5f9' },
  rowLabel: { flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '500' },
  premiumBadge: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: { fontSize: 11, fontWeight: '700', color: Brand.purple },
  footer: { marginTop: 24, fontSize: 12, color: '#94a3b8', lineHeight: 18 },
});

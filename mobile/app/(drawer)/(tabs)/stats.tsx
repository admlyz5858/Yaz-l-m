import { StyleSheet, Text, View } from 'react-native';

/**
 * İstatistik sekmesi (PDF Bölüm 15).
 */
export default function StatsTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>İstatistik</Text>
      <Text style={styles.body}>Performans panosu ve raporlar Analytics servisi bağlandığında dolar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22 },
});

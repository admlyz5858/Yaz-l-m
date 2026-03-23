import { StyleSheet, Text, View } from 'react-native';

/**
 * Sınav sekmesi: deneme, soru bankası, yarışma (PDF Bölüm 3.2).
 */
export default function ExamTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sınav</Text>
      <Text style={styles.body}>Zamanlanmış deneme ve soru bankası bir sonraki modül adımlarında.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22 },
});

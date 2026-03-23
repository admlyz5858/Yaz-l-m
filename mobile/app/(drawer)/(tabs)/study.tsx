import { StyleSheet, Text, View } from 'react-native';

/**
 * Çalış sekmesi: soru çözme, flash kart, Pomodoro (PDF Bölüm 3.2).
 */
export default function StudyTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çalış</Text>
      <Text style={styles.body}>AI soru çözme, flash kart ve Pomodoro modülleri sırayla eklenecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 15, color: '#64748b', lineHeight: 22 },
});

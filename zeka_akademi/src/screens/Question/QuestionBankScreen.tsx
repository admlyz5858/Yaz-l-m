/**
 * Soru Bankası
 * Arama, filtre paneli, soru listesi kart formatı
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TURKISH_QUESTIONS } from '../../data/turkishQuestions';

const EXAMS = ['Tümü', 'YKS-TYT', 'YKS-AYT', 'LGS', 'KPSS'];
const SUBJECTS = ['Tümü', 'Türkçe'];
const TOPICS = ['Tümü', 'Paragraf', 'Cümlede Anlam', 'Fiilimsiler', 'Sözcükte Anlam'];

interface QuestionBankScreenProps {
  navigation?: any;
}

export default function QuestionBankScreen({ navigation }: QuestionBankScreenProps) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState('Tümü');
  const [selectedSubject, setSelectedSubject] = useState('Tümü');
  const [selectedTopic, setSelectedTopic] = useState('Tümü');

  const filtered = TURKISH_QUESTIONS.filter((q) => {
    const hay = `${q.preview} ${q.question} ${q.topic}`.toLowerCase();
    const matchSearch = !search || hay.includes(search.toLowerCase());
    const matchExam = selectedExam === 'Tümü' || q.exam === selectedExam;
    const matchSubject = selectedSubject === 'Tümü' || q.subject === selectedSubject;
    const matchTopic = selectedTopic === 'Tümü' || q.topic === selectedTopic;
    return matchSearch && matchExam && matchSubject && matchTopic;
  });

  const renderItem = ({ item }: { item: (typeof TURKISH_QUESTIONS)[0] }) => (
    <TouchableOpacity
      style={styles.questionCard}
      onPress={() => navigation?.navigate('QuestionSolve', { questionId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardSubject}>{item.subject}</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>Zorluk: {item.difficulty}/5</Text>
        </View>
      </View>
      <Text style={styles.cardTopic}>{item.topic} • {item.exam}</Text>
      <Text style={styles.cardPreview} numberOfLines={3}>{item.preview}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0c1929" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soru Bankası</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={22} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Paragraf, fiilimsi, soru ara..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, filterOpen && styles.filterBtnActive]}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <MaterialCommunityIcons name="filter-variant" size={24} color={filterOpen ? '#fff' : '#0c1929'} />
        </TouchableOpacity>
      </View>

      {filterOpen && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Sınav Türü</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {EXAMS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.chip, selectedExam === e && styles.chipActive]}
                onPress={() => setSelectedExam(e)}
              >
                <Text style={[styles.chipText, selectedExam === e && styles.chipTextActive]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>Ders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {SUBJECTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, selectedSubject === s && styles.chipActive]}
                onPress={() => setSelectedSubject(s)}
              >
                <Text style={[styles.chipText, selectedSubject === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>Konu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {TOPICS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, selectedTopic === t && styles.chipActive]}
                onPress={() => setSelectedTopic(t)}
              >
                <Text style={[styles.chipText, selectedTopic === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Soru bulunamadı</Text>
        }
      />
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
  searchRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#2563eb' },
  filterPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterLabel: { fontSize: 13, color: '#666', marginBottom: 8 },
  filterRow: { marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { fontSize: 14, color: '#666' },
  chipTextActive: { color: '#fff', fontWeight: '500' },
  list: { padding: 16, paddingBottom: 32 },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubject: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  difficultyBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: { fontSize: 12, color: '#666' },
  cardTopic: { fontSize: 13, color: '#666', marginTop: 4 },
  cardPreview: { fontSize: 15, color: '#1a1a1a', marginTop: 8, lineHeight: 22 },
  empty: { textAlign: 'center', color: '#999', padding: 32 },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { examLabel, type ExamCategory } from '@/data/questionBank';
import { Brand } from '@/constants/theme';
import { DERS_LIST, useQuestionBankStore } from '@/store/questionBankStore';

const SINAV_OPTIONS: ExamCategory[] = ['YKS_TYT', 'LGS', 'KPSS_GY'];

/**
 * PDF Bölüm 5.2.2 — Arama ve filtre (drawer yerine kompakt panel).
 */
export default function QuestionBankSearchScreen() {
  const filters = useQuestionBankStore((s) => s.filters);
  const setSearch = useQuestionBankStore((s) => s.setSearch);
  const setFilters = useQuestionBankStore((s) => s.setFilters);
  const resetFilters = useQuestionBankStore((s) => s.resetFilters);
  const progress = useQuestionBankStore((s) => s.progress);
  const getFilteredQuestions = useQuestionBankStore((s) => s.getFilteredQuestions);

  const [filterOpen, setFilterOpen] = useState(false);

  const list = useMemo(() => getFilteredQuestions(), [filters, progress, getFilteredQuestions]);

  const toggleSınav = (cat: ExamCategory) => {
    const next = filters.sınavlar.includes(cat)
      ? filters.sınavlar.filter((c) => c !== cat)
      : [...filters.sınavlar, cat];
    setFilters({ sınavlar: next });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder='Doğal dil: "TYT matematik zor"'
          placeholderTextColor="#94a3b8"
          value={filters.search}
          onChangeText={setSearch}
        />
        <Pressable onPress={() => setFilterOpen(!filterOpen)} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color={Brand.navy} />
        </Pressable>
      </View>

      {filterOpen ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Text style={styles.filterLabel}>Sınav:</Text>
          {SINAV_OPTIONS.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.chip, filters.sınavlar.includes(cat) && styles.chipOn]}
              onPress={() => toggleSınav(cat)}>
              <Text style={[styles.chipText, filters.sınavlar.includes(cat) && styles.chipTextOn]}>
                {examLabel(cat)}
              </Text>
            </Pressable>
          ))}
          <Text style={styles.filterLabel}>Ders:</Text>
          {DERS_LIST.map((d) => (
            <Pressable
              key={d}
              style={[styles.chip, filters.ders === d && styles.chipOn]}
              onPress={() => setFilters({ ders: filters.ders === d ? null : d })}>
              <Text style={[styles.chipText, filters.ders === d && styles.chipTextOn]}>{d}</Text>
            </Pressable>
          ))}
          <View style={styles.switchInline}>
            <Text style={styles.mini}>Yanlışlar</Text>
            <Switch
              value={filters.onlyWrong}
              onValueChange={(v) => setFilters({ onlyWrong: v })}
              trackColor={{ true: Brand.purple }}
            />
          </View>
          <View style={styles.switchInline}>
            <Text style={styles.mini}>Çözülmemiş</Text>
            <Switch
              value={filters.onlyUnsolved}
              onValueChange={(v) => setFilters({ onlyUnsolved: v })}
              trackColor={{ true: Brand.purple }}
            />
          </View>
          <Pressable onPress={resetFilters}>
            <Text style={styles.reset}>Sıfırla</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      <Text style={styles.count}>{list.length} soru</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {list.map((q) => {
          const pr = progress[q.question_id];
          return (
            <Link
              key={q.question_id}
              href={{ pathname: '/question-bank/practice', params: { id: q.question_id } } as any}
              asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.badge}>{examLabel(q.sınav_türü)}</Text>
                  <Text style={styles.zor}>Zorluk {q.zorluk}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {q.metin}
                </Text>
                <Text style={styles.cardMeta}>
                  {q.ders} · {q.konu}
                  {pr ? ` · Deneme: ${pr.attempts}` : ''}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 8 },
  filterBtn: { padding: 8 },
  filterScroll: { maxHeight: 52, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  filterLabel: { alignSelf: 'center', marginRight: 6, fontSize: 12, color: '#64748b' },
  chip: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 6,
  },
  chipOn: { borderColor: Brand.purple, backgroundColor: 'rgba(168,85,247,0.12)' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  chipTextOn: { color: Brand.navy },
  switchInline: { flexDirection: 'row', alignItems: 'center', marginRight: 10, gap: 4 },
  mini: { fontSize: 11, color: '#64748b' },
  reset: { alignSelf: 'center', fontSize: 13, color: Brand.purple, fontWeight: '600' },
  count: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 13, color: '#64748b' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { fontSize: 11, fontWeight: '700', color: Brand.purple },
  zor: { fontSize: 11, color: '#94a3b8' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', lineHeight: 21 },
  cardMeta: { fontSize: 12, color: '#64748b', marginTop: 8 },
});

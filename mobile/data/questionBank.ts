/**
 * Örnek soru havuzu — PDF Bölüm 5.2.1 alanlarına uyumlu (MVP stub).
 */
export type ExamCategory = 'YKS_TYT' | 'YKS_AYT' | 'LGS' | 'KPSS_GY';

export type QuestionType = 'MCQ' | 'open' | 'gap';

export type BankQuestion = {
  question_id: string;
  sınav_türü: ExamCategory;
  ders: string;
  konu: string;
  alt_konu?: string;
  müfredat_yılı: number;
  zorluk: 1 | 2 | 3 | 4 | 5;
  soru_tipi: QuestionType;
  kaynak: string;
  metin: string;
  şıklar?: string[];
  doğru_index?: number;
  çözüm_süresi_ort: number;
  doğru_cevap_oranı: number;
  görsel_var_mı: boolean;
};

export const QUESTION_BANK: BankQuestion[] = [
  {
    question_id: 'q_tytkim_1',
    sınav_türü: 'YKS_TYT',
    ders: 'Matematik',
    konu: 'Temel kavramlar',
    alt_konu: 'Mutlak değer',
    müfredat_yılı: 2025,
    zorluk: 2,
    soru_tipi: 'MCQ',
    kaynak: 'Özgün',
    metin: '|x - 3| = 5 denklemini sağlayan x değerlerinin toplamı kaçtır?',
    şıklar: ['3', '6', '8', '10', '12'],
    doğru_index: 1,
    çözüm_süresi_ort: 60,
    doğru_cevap_oranı: 0.72,
    görsel_var_mı: false,
  },
  {
    question_id: 'q_tytkim_2',
    sınav_türü: 'YKS_TYT',
    ders: 'Matematik',
    konu: 'Fonksiyonlar',
    alt_konu: 'Bileşke',
    müfredat_yılı: 2025,
    zorluk: 3,
    soru_tipi: 'MCQ',
    kaynak: 'ÖSYM 2023',
    metin: 'f(x) = 2x + 1 ve g(x) = x² için (f ∘ g)(2) değeri kaçtır?',
    şıklar: ['9', '11', '13', '17', '21'],
    doğru_index: 2,
    çözüm_süresi_ort: 90,
    doğru_cevap_oranı: 0.58,
    görsel_var_mı: false,
  },
  {
    question_id: 'q_tytturk_1',
    sınav_türü: 'YKS_TYT',
    ders: 'Türkçe',
    konu: 'Paragraf',
    alt_konu: 'Ana düşünce',
    müfredat_yılı: 2025,
    zorluk: 2,
    soru_tipi: 'MCQ',
    kaynak: 'Özgün',
    metin:
      'Aşağıdaki paragrafta yazarın asıl vurgulamak istediği düşünce hangi seçenekte en iyi ifade edilmiştir? (Metin: Bilimsel okuryazarlık toplumsal gelişimin temelidir.)',
    şıklar: [
      'Teknoloji her şeydir.',
      'Bilimsel düşünme ve okuryazarlık toplumsal ilerlemenin ön koşuludur.',
      'Sanat bilimden üstündür.',
      'Eğitim sadece meslek kazandırır.',
      'İstatistik yanıltıcıdır.',
    ],
    doğru_index: 1,
    çözüm_süresi_ort: 120,
    doğru_cevap_oranı: 0.65,
    görsel_var_mı: false,
  },
  {
    question_id: 'q_lgsfen_1',
    sınav_türü: 'LGS',
    ders: 'Fen Bilimleri',
    konu: 'Kuvvet ve hareket',
    alt_konu: 'Newton yasaları',
    müfredat_yılı: 2025,
    zorluk: 2,
    soru_tipi: 'MCQ',
    kaynak: 'MEB örnek',
    metin: 'Bir cisme etki eden net kuvvet sıfır ise cisim için aşağıdakilerden hangisi söylenebilir?',
    şıklar: [
      'Hızı mutlaka sıfırdır.',
      'İvmesi sıfırdır.',
      'Mutlaka durur.',
      'Kinetik enerjisi artar.',
      'Potansiyel enerjisi sıfırdır.',
    ],
    doğru_index: 1,
    çözüm_süresi_ort: 70,
    doğru_cevap_oranı: 0.68,
    görsel_var_mı: false,
  },
  {
    question_id: 'q_kpss_1',
    sınav_türü: 'KPSS_GY',
    ders: 'Genel Yetenek',
    konu: 'Sayısal mantık',
    alt_konu: 'Dizi',
    müfredat_yılı: 2025,
    zorluk: 3,
    soru_tipi: 'MCQ',
    kaynak: 'Özgün',
    metin: '3, 7, 15, 31, 63, ? dizisinde sıradaki terim hangisidir?',
    şıklar: ['95', '111', '127', '135', '142'],
    doğru_index: 2,
    çözüm_süresi_ort: 85,
    doğru_cevap_oranı: 0.52,
    görsel_var_mı: false,
  },
];

export function examLabel(cat: ExamCategory): string {
  const m: Record<ExamCategory, string> = {
    YKS_TYT: 'YKS TYT',
    YKS_AYT: 'YKS AYT',
    LGS: 'LGS',
    KPSS_GY: 'KPSS GY',
  };
  return m[cat];
}

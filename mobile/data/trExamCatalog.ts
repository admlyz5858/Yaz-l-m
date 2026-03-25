/**
 * Türkiye sınav kataloğu (ÖSYM, MEB, diğer kurumlar) — MVP listesi.
 * Resmi tarihler `examCalendar.fallback.json` / uzaktan JSON ile güncellenir; buradaki tarihler örnek değildir.
 */

export type ExamInstitution = 'OSYM' | 'MEB' | 'OTHER';

export type ExamCatalogItem = {
  id: string;
  label: string;
  hint: string;
  institution: ExamInstitution;
  /** Uzaktan takvim JSON `exams[].key` ile eşleşme; yoksa null (manuel geri sayım) */
  calendarKey: string | null;
};

export type ExamCatalogGroup = {
  title: string;
  exams: ExamCatalogItem[];
};

/** Aynı sınav takvim anahtarı için planlama ders havuzu */
const PLAN_BY_CAL: Record<string, string[]> = {
  YKS: ['Matematik', 'Türkçe', 'Fen'],
  LGS: ['Türkçe', 'Matematik', 'Fen'],
  KPSS: ['Genel Yetenek', 'Genel Kültür'],
  ALES: ['Sayısal', 'Türkçe'],
  DGS: ['Sayısal', 'Türkçe'],
  MSU: ['Matematik', 'Türkçe', 'Fen'],
  TUS: ['Tıp temel', 'Türkçe'],
  DUS: ['Tıp temel', 'Türkçe'],
  STS: ['Türkçe', 'Alan bilgisi'],
  YDS: ['İngilizce', 'Türkçe'],
  YOKDIL: ['İngilizce'],
  EYDS: ['İngilizce'],
  YOS: ['Matematik', 'Türkçe'],
  EKPSS: ['Genel Yetenek', 'Genel Kültür'],
  EHL: ['Türkçe', 'Trafik'],
  ISG: ['İSG mevzuat', 'Türkçe'],
  AGS: ['Matematik', 'Türkçe'],
  YOKATLAS: ['Genel'],
};

export const TR_EXAM_CATALOG: ExamCatalogGroup[] = [
  {
    title: 'ÖSYM — Yükseköğretim giriş ve geçiş',
    exams: [
      { id: 'YKS', label: 'YKS (TYT + AYT)', hint: 'Üniversite yerleştirme', institution: 'OSYM', calendarKey: 'YKS' },
      { id: 'ALES', label: 'ALES', hint: 'Lisansüstü', institution: 'OSYM', calendarKey: 'ALES' },
      { id: 'DGS', label: 'DGS', hint: 'Dikey geçiş', institution: 'OSYM', calendarKey: 'DGS' },
      { id: 'YOS', label: 'YÖS', hint: 'Yabancı uyruklu öğrenci', institution: 'OSYM', calendarKey: 'YOS' },
      { id: 'MSU', label: 'MSÜ', hint: 'Milli Savunma Üniversitesi', institution: 'OSYM', calendarKey: 'MSU' },
    ],
  },
  {
    title: 'ÖSYM — Ortaöğretim',
    exams: [
      { id: 'LGS', label: 'LGS', hint: 'Liselere giriş (8. sınıf)', institution: 'OSYM', calendarKey: 'LGS' },
    ],
  },
  {
    title: 'ÖSYM — KPSS ve öğretmenlik',
    exams: [
      { id: 'KPSS', label: 'KPSS', hint: 'Genel yetenek / genel kültür', institution: 'OSYM', calendarKey: 'KPSS' },
      { id: 'EKPSS', label: 'EKPSS', hint: 'Engelli kamu personeli', institution: 'OSYM', calendarKey: 'EKPSS' },
      { id: 'OABT', label: 'ÖABT', hint: 'Öğretmenlik alan bilgisi (KPSS kapsamı)', institution: 'OSYM', calendarKey: 'KPSS' },
    ],
  },
  {
    title: 'ÖSYM — Sağlık ve uzmanlık',
    exams: [
      { id: 'TUS', label: 'TUS', hint: 'Tıpta uzmanlık', institution: 'OSYM', calendarKey: 'TUS' },
      { id: 'DUS', label: 'DUS', hint: 'Diş hekimliğinde uzmanlık', institution: 'OSYM', calendarKey: 'DUS' },
      { id: 'STS', label: 'STS', hint: 'Sağlıkta uzmanlık / yan dal', institution: 'OSYM', calendarKey: 'STS' },
    ],
  },
  {
    title: 'ÖSYM — Dil ve yabancı dil',
    exams: [
      { id: 'YDS', label: 'YDS', hint: 'Yabancı dil', institution: 'OSYM', calendarKey: 'YDS' },
      { id: 'EYDS', label: 'e-YDS', hint: 'Elektronik YDS', institution: 'OSYM', calendarKey: 'EYDS' },
      { id: 'YOKDIL', label: 'YÖKDİL', hint: 'Yükseköğretim kurumları', institution: 'OSYM', calendarKey: 'YOKDIL' },
    ],
  },
  {
    title: 'ÖSYM — Meslek ve teknik',
    exams: [
      { id: 'EHL', label: 'Ehliyet sınavları (MTSK)', hint: 'Sürücü adayları', institution: 'OSYM', calendarKey: 'EHL' },
      { id: 'ISG', label: 'İSG', hint: 'İş güvenliği uzmanlığı', institution: 'OSYM', calendarKey: 'ISG' },
      { id: 'AGS', label: 'AGS', hint: 'Avukatlık staj', institution: 'OSYM', calendarKey: 'AGS' },
    ],
  },
  {
    title: 'MEB — Ölçme ve sınav (ÖDSGM)',
    exams: [
      { id: 'MEB_LGS_HAZIRLIK', label: 'LGS hazırlık (müfredat)', hint: 'MEB çerçevesi', institution: 'MEB', calendarKey: 'LGS' },
      { id: 'MEB_YKS_HAZIRLIK', label: 'YKS hazırlık (müfredat)', hint: 'MEB çerçevesi', institution: 'MEB', calendarKey: 'YKS' },
      { id: 'MEB_OKUL_ORTA', label: 'Ortaokul okul sınavları', hint: 'Yazılı / performans', institution: 'MEB', calendarKey: null },
      { id: 'MEB_OKUL_LISE', label: 'Lise okul sınavları', hint: 'Yazılı / proje', institution: 'MEB', calendarKey: null },
      { id: 'MEB_YDT', label: 'YDT (YKS kapsamı)', hint: 'Yabancı dil testi', institution: 'MEB', calendarKey: 'YKS' },
    ],
  },
  {
    title: 'MEB — Mesleki ve özel',
    exams: [
      { id: 'MEB_MESLEK_LISE', label: 'Meslek lisesi alan sınavları', hint: 'Kurum içi / MYK ile ilişkili', institution: 'MEB', calendarKey: null },
      { id: 'MEB_AKADEMIK_DESTEK', label: 'Destekleme ve yetiştirme', hint: 'Bursluluk / DY', institution: 'MEB', calendarKey: null },
      { id: 'MEB_ULUSLARARASI', label: 'Uluslararası öğrenci / uyum', hint: 'MEB süreçleri', institution: 'MEB', calendarKey: null },
    ],
  },
  {
    title: 'Diğer kurum ve hedefler',
    exams: [
      { id: 'YOK_ATLAS', label: 'YÖK Atlas / tercih süreci', hint: 'Yerleştirme takvimi', institution: 'OTHER', calendarKey: 'YOKATLAS' },
      { id: 'UNIVERSITY', label: 'Üniversite ders / vize-final', hint: 'Kurum içi sınavlar', institution: 'OTHER', calendarKey: null },
      { id: 'KPSS_A', label: 'KPSS A grubu (GY-GK)', hint: 'ÖSYM KPSS kapsamı', institution: 'OSYM', calendarKey: 'KPSS' },
      { id: 'KPSS_B', label: 'KPSS B grubu', hint: 'ÖSYM KPSS kapsamı', institution: 'OSYM', calendarKey: 'KPSS' },
      { id: 'OTHER', label: 'Diğer / özel hedef', hint: 'Listede yoksa', institution: 'OTHER', calendarKey: null },
    ],
  },
];

const flat: ExamCatalogItem[] = TR_EXAM_CATALOG.flatMap((g) => g.exams);
const byId = new Map(flat.map((e) => [e.id, e]));

export function getExamCatalogItem(id: string): ExamCatalogItem | undefined {
  return byId.get(id);
}

export function getExamLabel(id: string): string {
  return byId.get(id)?.label ?? id;
}

/** Dashboard / chip için kısa etiket */
export function getPrimaryExamShortLabel(id: string): string {
  const item = byId.get(id);
  if (!item) return id;
  if (item.id === 'YKS') return 'YKS';
  if (item.id === 'MEB_LGS_HAZIRLIK') return 'LGS hazırlık';
  return item.label.split('(')[0]?.trim() ?? item.label;
}

/**
 * Plan stub için ders listesi — bilinmeyen id için genel liste.
 */
export function planSubjectsForExamId(examId: string): string[] {
  const item = byId.get(examId);
  const key = item?.calendarKey;
  if (key && PLAN_BY_CAL[key]) return [...PLAN_BY_CAL[key]];
  if (examId === 'UNIVERSITY' || examId === 'OTHER') return ['Genel', 'Paragraf', 'Matematik'];
  return ['Türkçe', 'Matematik', 'Fen'];
}

export function calendarKeyForExamId(examId: string): string | null {
  return byId.get(examId)?.calendarKey ?? null;
}

export function allCatalogExamIds(): string[] {
  return flat.map((e) => e.id);
}

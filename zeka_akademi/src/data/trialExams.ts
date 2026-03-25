/**
 * Mini deneme sınavları — soru kimlikleri mevcut Türkçe bankasından çekilir
 */

export type TrialExamMeta = {
  id: string;
  title: string;
  subtitle: string;
  examLabel: string;
  durationMinutes: number;
  questionIds: string[];
};

const TYT_MINI_IDS = [
  'tyt-tr-d1-01',
  'tyt-tr-d1-02',
  'tyt-tr-d1-03',
  'tyt-tr-d1-04',
  'tyt-tr-d1-05',
  'tyt-tr-d1-06',
  'tyt-tr-d1-07',
  'tyt-tr-d1-08',
  'tyt-tr-d1-09',
  'tyt-tr-d1-10',
];

const LGS_MINI_IDS = [
  'tyt-tr-d2-01',
  'tyt-tr-d2-02',
  'tyt-tr-d2-03',
  'tyt-tr-d2-04',
  'tyt-tr-d2-05',
  'tyt-tr-d2-06',
  'tyt-tr-d2-07',
  'tyt-tr-d2-08',
  'tyt-tr-d2-09',
  'tyt-tr-d2-10',
];

export const TRIAL_EXAMS: TrialExamMeta[] = [
  {
    id: 'tyt-mini-tr',
    title: 'TYT Türkçe Mini Deneme',
    subtitle: '10 soru · süre sınırlı · gerçek sınav hissi',
    examLabel: 'YKS-TYT',
    durationMinutes: 25,
    questionIds: TYT_MINI_IDS,
  },
  {
    id: 'lgs-mini-tr',
    title: 'LGS Türkçe Mini Deneme',
    subtitle: '10 soru · ortaokul seviyesi metin ve dil bilgisi',
    examLabel: 'LGS',
    durationMinutes: 20,
    questionIds: LGS_MINI_IDS,
  },
];

export function getTrialExamById(id: string): TrialExamMeta | undefined {
  return TRIAL_EXAMS.find((e) => e.id === id);
}

export type TrialAnswers = Record<string, number | null>;

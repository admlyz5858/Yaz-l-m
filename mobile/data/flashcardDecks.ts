/**
 * Örnek desteler — PDF Bölüm 6 (üretim ileride AI ile).
 */
export type FlashCardContent = {
  id: string;
  ön: string;
  arka: string;
  kaynak?: string;
};

export type FlashDeckMeta = {
  deck_id: string;
  başlık: string;
  sınav_etiketi: string;
  kartlar: FlashCardContent[];
};

export const SEED_DECKS: FlashDeckMeta[] = [
  {
    deck_id: 'deck_yks_mat',
    başlık: 'YKS — Matematik temel',
    sınav_etiketi: 'YKS TYT',
    kartlar: [
      {
        id: 'fc_1',
        ön: 'Mutlak değer tanımı: |x| = ?',
        arka: '|x| = x (x≥0), |x| = -x (x<0). Mesafeyi temsil eder.',
        kaynak: 'Özet',
      },
      {
        id: 'fc_2',
        ön: 'logₐ(xy) kuralu',
        arka: 'logₐ(xy) = logₐx + logₐy (a>0, a≠1, x,y>0)',
      },
      {
        id: 'fc_3',
        ön: 'Bir fonksiyonun türevi geometrik olarak neyi verir?',
        arka: 'Eğrinin o noktadaki teğetinin eğimi (anlık değişim oranı).',
      },
    ],
  },
  {
    deck_id: 'deck_lgs_sosyal',
    başlık: 'LGS — Tarih',
    sınav_etiketi: 'LGS',
    kartlar: [
      {
        id: 'fc_4',
        ön: 'Osmanlı Devleti hangi yılda kurulmuştur?',
        arka: '1299 (Bilecik/Söğüt çevresi, tarihî kaynaklara göre).',
      },
      {
        id: 'fc_5',
        ön: 'Kurtuluş Savaşı döneminde Büyük Millet Meclisi nerede toplanmıştır?',
        arka: 'Ankara (23 Nisan 1920).',
      },
    ],
  },
];

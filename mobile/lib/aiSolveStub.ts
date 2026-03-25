/**
 * AI Gateway yerine yerel stub — PDF Bölüm 5.1.2 akışını simüle eder.
 */

export type SolutionStep = { title: string; detail: string };

export type SolveResult = {
  subject: 'Matematik' | 'Fen' | 'Sözel' | 'Yabancı' | 'Diğer';
  steps: SolutionStep[];
  socraticHints: string[];
  confidenceNote: string;
};

function detectSubject(text: string): SolveResult['subject'] {
  const t = text.toLowerCase();
  if (/x\s*[\+\-\=]|fonksiyon|integral|türev|mutlak|denklem|sayı/.test(t)) return 'Matematik';
  if (/kuvvet|newton|enerji|hücre|kimya|atom/.test(t)) return 'Fen';
  if (/english|verb|grammar|translate/.test(t)) return 'Yabancı';
  if (/paragraf|yazar|düşünce|anlam|edebiyat|türkçe/.test(t)) return 'Sözel';
  return 'Diğer';
}

export function generateStubSolution(questionText: string, socraticOnly: boolean): SolveResult {
  const subject = detectSubject(questionText);

  const steps: SolutionStep[] = [
    {
      title: '1. Soruyu anla',
      detail: 'Verilenleri ve isteneni netleştir; gereksiz bilgileri ele.',
    },
    {
      title: '2. Strateji seç',
      detail:
        subject === 'Matematik'
          ? 'Cebirsel dönüşüm veya özel tanımlar (mutlak değer, fonksiyon) ile ilerle.'
          : subject === 'Fen'
            ? 'İlgili yasayı (ör. F=ma, enerji korunumu) hatırlayıp verilere uygula.'
            : 'Metinde ana fikri ve kanıt cümlelerini ayırt et.',
    },
    {
      title: '3. Çöz ve kontrol et',
      detail: 'Sonucu soruda istenen birim ve mantıkla doğrula; uç durumları düşün.',
    },
  ];

  const socraticHints = [
    'Bu soruda önce hangi büyüklükleri biliyorsun, hangileri bilinmiyor?',
    'Benzer bir örnek daha önce çözdün mü — oradaki yöntem işe yarar mı?',
    'Cevabı bulduktan sonra soruya geri dönüp mantıklı mı diye kontrol et.',
  ];

  if (socraticOnly) {
    return {
      subject,
      steps: [],
      socraticHints,
      confidenceNote: 'Sokratik mod: doğrudan cevap yerine düşünme ipuçları (PDF 18.2).',
    };
  }

  return {
    subject,
    steps,
    socraticHints,
    confidenceNote:
      'Bu çözüm yerel stub üretimidir. Üretim AI ile yapıldığında doğruluğunu kontrol et (PDF 18.3).',
  };
}

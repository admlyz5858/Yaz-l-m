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
  // --- YKS TYT Türkçe (kullanıcı setleri) ---
  ...buildTytTurkceSet1(),
  ...buildTytTurkceSet2(),
];

function letterToIndex(letter: string): number {
  return 'ABCD'.indexOf(letter.toUpperCase());
}

type TurkceRowInput = Omit<BankQuestion, 'question_id' | 'doğru_index'> & {
  answer: string;
};

/** İlk 10 Türkçe sorusu (TYT) */
function buildTytTurkceSet1(): BankQuestion[] {
  const rows: TurkceRowInput[] = [
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 120,
      doğru_cevap_oranı: 0.55,
      görsel_var_mı: false,
      metin:
        'Bir sanatçının eserlerini değerlendirirken yalnızca ortaya koyduğu ürüne bakmak çoğu zaman eksik bir değerlendirme olur. Çünkü sanatçının yetiştiği çevre, içinde bulunduğu kültürel yapı ve yaşadığı dönemin koşulları onun üretimini doğrudan etkiler. Bu nedenle bir eseri anlamak, aynı zamanda o eserin arka planını da anlamayı gerektirir.\n\nBu parçadan aşağıdakilerden hangisine ulaşılamaz?',
      şıklar: [
        'Bir eseri değerlendirmek için yalnızca son ürüne bakmak yeterli değildir.',
        'Sanatçının yaşadığı çevre eserlerini etkiler.',
        'Sanat eserleri yalnızca estetik kaygıyla ortaya çıkar.',
        'Bir eseri anlamak için bağlamı bilmek gerekir.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 110,
      doğru_cevap_oranı: 0.58,
      görsel_var_mı: false,
      metin:
        'İnsanlar çoğu zaman hızlı sonuç almak ister ve bu nedenle süreçleri göz ardı eder. Oysa kalıcı başarılar, sabır ve düzenli çaba gerektirir. Süreci önemsemeyen bireyler, kısa vadede bazı sonuçlar elde etseler bile uzun vadede istedikleri noktaya ulaşamazlar.\n\nBu parçaya göre aşağıdakilerden hangisi kesin olarak söylenebilir?',
      şıklar: [
        'Hızlı sonuç alan kişiler her zaman başarısız olur.',
        'Süreç odaklı çalışanlar uzun vadede daha başarılı olabilir.',
        'Sabır gerektiren işler her zaman zordur.',
        'Kısa vadeli başarılar değersizdir.',
      ],
      answer: 'B',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Ana fikir',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 100,
      doğru_cevap_oranı: 0.62,
      görsel_var_mı: false,
      metin:
        'Günümüzde bilgiye ulaşmak oldukça kolaydır; ancak bu durum, doğru bilgiye ulaşıldığı anlamına gelmez. Bilginin hızla yayılması, yanlış bilgilerin de aynı hızla yayılmasına neden olmaktadır. Bu nedenle bireylerin bilgiye eleştirel bir gözle yaklaşması gerekir.\n\nBu parçanın ana fikri aşağıdakilerden hangisidir?',
      şıklar: [
        'Bilgiye ulaşmak günümüzde zordur.',
        'Yanlış bilgi yayılmaz.',
        'Bilgiye eleştirel yaklaşmak gerekir.',
        'Teknoloji zararlıdır.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 95,
      doğru_cevap_oranı: 0.6,
      görsel_var_mı: false,
      metin:
        'Bir öğretmen, öğrencilerinin yalnızca doğru cevaplara ulaşmasını değil, aynı zamanda düşünme süreçlerini geliştirmesini de hedefler. Bu nedenle öğrencilerine doğrudan cevap vermek yerine onları düşündürecek sorular yöneltir.\n\nBu parçaya göre öğretmenin asıl amacı aşağıdakilerden hangisidir?',
      şıklar: [
        'Öğrencilerin daha hızlı öğrenmesini sağlamak',
        'Öğrencilerin ezber yapmasını sağlamak',
        'Öğrencilerin düşünme becerilerini geliştirmek',
        'Öğrencilere zor sorular sormak',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 115,
      doğru_cevap_oranı: 0.54,
      görsel_var_mı: false,
      metin:
        'Bir şehirde yaşayan insanların yaşam kalitesi, yalnızca ekonomik imkânlarla ölçülemez. Kültürel etkinlikler, sosyal ilişkiler ve çevresel faktörler de bu kaliteyi belirleyen önemli unsurlar arasındadır.\n\nBu parçadan aşağıdakilerden hangisi çıkarılamaz?',
      şıklar: [
        'Yaşam kalitesi sadece ekonomik durumla belirlenmez.',
        'Kültürel etkinlikler yaşam kalitesini etkiler.',
        'Ekonomik durum yaşam kalitesini hiç etkilemez.',
        'Sosyal ilişkiler yaşam kalitesinde rol oynar.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Cümlede Anlam',
      alt_konu: 'Cümlede Anlam',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 90,
      doğru_cevap_oranı: 0.48,
      görsel_var_mı: false,
      metin:
        'Aşağıdaki cümlelerin hangisinde hem neden-sonuç hem de amaç anlamı birlikte vardır?',
      şıklar: [
        'Başarılı olmak için düzenli çalışıyor.',
        'Düzenli çalıştığı için başarılı oldu.',
        'Başarılı olmak için çalıştığı için yoruldu.',
        'Çalışmayı sevdiği için başarılı olmak istiyor.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Fiilimsiler',
      alt_konu: 'Fiilimsiler',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 85,
      doğru_cevap_oranı: 0.5,
      görsel_var_mı: false,
      metin:
        'Aşağıdaki cümlelerin hangisinde hem sıfat-fiil hem zarf-fiil birlikte kullanılmıştır?',
      şıklar: [
        'Koşarak gelen çocuk düştü.',
        'Gülen çocuk mutlu görünüyordu.',
        'Koşarak geldi ve oturdu.',
        'Geldiğinde onu gördüm.',
      ],
      answer: 'A',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Sözcükte Anlam',
      alt_konu: 'Deyim',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 70,
      doğru_cevap_oranı: 0.64,
      görsel_var_mı: false,
      metin:
        '“Onun bu konuda elini taşın altına koyması gerekiyordu.” cümlesinde geçen deyimin anlamı aşağıdakilerden hangisidir?',
      şıklar: [
        'Zor bir işten kaçınmak',
        'Sorumluluk almaktan kaçınmak',
        'Sorumluluk almak ve risk üstlenmek',
        'Kolay bir işi tercih etmek',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 100,
      doğru_cevap_oranı: 0.6,
      görsel_var_mı: false,
      metin:
        'Bir bilim insanı, yaptığı deneylerin sonucunu hemen elde edemeyebilir. Bazen aynı deneyi defalarca tekrarlamak zorunda kalır. Ancak bu süreç, onun daha doğru sonuçlara ulaşmasını sağlar.\n\nBu parçaya göre aşağıdakilerden hangisi vurgulanmaktadır?',
      şıklar: [
        'Bilimsel çalışmalar kolaydır.',
        'Deneyler her zaman hızlı sonuç verir.',
        'Tekrar etmek daha doğru sonuçlara ulaşmayı sağlar.',
        'Bilim insanları hata yapmaz.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 95,
      doğru_cevap_oranı: 0.58,
      görsel_var_mı: false,
      metin:
        'Bir yazarın dili ne kadar sade olursa, okurla kurduğu bağ o kadar güçlü olur. Çünkü karmaşık anlatımlar, okuyucunun metni anlamasını zorlaştırabilir.\n\nBu parçaya göre aşağıdakilerden hangisi doğrudur?',
      şıklar: [
        'Sade dil her zaman yetersizdir.',
        'Karmaşık anlatım okuyucuyu metne yaklaştırır.',
        'Sade dil, okurla bağ kurmayı kolaylaştırır.',
        'Okuyucu metni anlamak zorunda değildir.',
      ],
      answer: 'C',
    },
  ];

  return rows.map((r, i) => {
    const { answer, ...rest } = r;
    return {
      ...rest,
      question_id: `q_tyt_tr_set1_${i + 1}`,
      doğru_index: letterToIndex(answer),
    };
  });
}

/** İkinci 10 Türkçe sorusu (TYT) */
function buildTytTurkceSet2(): BankQuestion[] {
  const rows: TurkceRowInput[] = [
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 115,
      doğru_cevap_oranı: 0.56,
      görsel_var_mı: false,
      metin:
        'Bir araştırmacı, insanların okuma alışkanlıklarını incelerken ilginç bir sonuca ulaşır: İnsanlar, ilgilerini çeken metinleri daha hızlı ve daha dikkatli okurken ilgilerini çekmeyen metinleri yüzeysel geçmektedir. Bu durum, okumanın yalnızca bir beceri değil, aynı zamanda bir ilgi meselesi olduğunu göstermektedir.\n\nBu parçadan aşağıdakilerden hangisi kesin olarak çıkarılabilir?',
      şıklar: [
        'İnsanlar her metni aynı dikkatle okur.',
        'Okuma becerisi yalnızca teknik bir yetenektir.',
        'İlgi, okuma sürecini etkileyen bir faktördür.',
        'İlgi duymayan kişiler okuma yapamaz.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 110,
      doğru_cevap_oranı: 0.54,
      görsel_var_mı: false,
      metin:
        'Bir şehir planlamacısı, şehirlerin yalnızca binalardan ibaret olmadığını savunur. Ona göre bir şehri yaşanabilir kılan; parkları, sosyal alanları ve insanların bir araya gelebileceği ortak mekânlarıdır. Bu unsurlar eksik olduğunda şehirler sadece kalabalık yerleşim alanlarına dönüşür.\n\nBu parçadan aşağıdakilerden hangisine ulaşılamaz?',
      şıklar: [
        'Şehirler sadece binalardan oluşmaz.',
        'Sosyal alanlar şehir yaşamını etkiler.',
        'Kalabalık şehirler her zaman yaşanabilirdir.',
        'Ortak alanlar şehirleri daha yaşanabilir kılar.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Ana fikir',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 100,
      doğru_cevap_oranı: 0.6,
      görsel_var_mı: false,
      metin:
        'Bir öğrencinin başarısı yalnızca ders çalıştığı süreyle ölçülemez. Nasıl çalıştığı, ne kadar odaklandığı ve öğrendiklerini ne kadar tekrar ettiği de en az süre kadar önemlidir.\n\nBu parçanın ana fikri aşağıdakilerden hangisidir?',
      şıklar: [
        'Uzun süre çalışmak başarıyı garanti eder.',
        'Başarı yalnızca çalışma süresine bağlı değildir.',
        'Öğrenciler çok çalışmalıdır.',
        'Tekrar yapmak gereksizdir.',
      ],
      answer: 'B',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 100,
      doğru_cevap_oranı: 0.62,
      görsel_var_mı: false,
      metin:
        'Bilgi çağında yaşadığımız için her gün çok sayıda bilgiye maruz kalıyoruz. Ancak bu bilgilerin hepsini doğru kabul etmek, yanlış sonuçlara yol açabilir. Bu nedenle bireylerin bilgiyi sorgulama alışkanlığı kazanması gerekir.\n\nBu parçaya göre aşağıdakilerden hangisi doğrudur?',
      şıklar: [
        'Tüm bilgiler güvenilirdir.',
        'Bilgiyi sorgulamak gereksizdir.',
        'Bilgiyi eleştirel değerlendirmek gerekir.',
        'Bilgiye ulaşmak zordur.',
      ],
      answer: 'C',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 95,
      doğru_cevap_oranı: 0.58,
      görsel_var_mı: false,
      metin:
        'Bir yazar, eserlerinde sade bir dil kullanarak geniş bir okuyucu kitlesine ulaşmayı hedefler. Karmaşık anlatımlardan kaçınarak okuyucunun metni daha kolay anlamasını sağlar.\n\nBu parçaya göre aşağıdakilerden hangisi çıkarılabilir?',
      şıklar: [
        'Sade dil okuyucu sayısını artırabilir.',
        'Karmaşık anlatım daha etkilidir.',
        'Okuyucular zor metinleri tercih eder.',
        'Yazarlar sade dil kullanmamalıdır.',
      ],
      answer: 'A',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Paragraf',
      alt_konu: 'Paragraf',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 100,
      doğru_cevap_oranı: 0.57,
      görsel_var_mı: false,
      metin:
        'Bir bilim insanı, deneylerinde başarısız olduğunda bunu bir son olarak değil, yeni bir başlangıç olarak görür. Çünkü her başarısızlık, doğru sonuca ulaşmak için bir ipucu barındırır.\n\nBu parçadan aşağıdakilerden hangisi kesinlikle çıkarılır?',
      şıklar: [
        'Başarısızlık bilimde yer almaz.',
        'Başarısızlık öğrenme sürecinin bir parçasıdır.',
        'Bilim insanları hata yapmaz.',
        'Deneyler her zaman başarılı olur.',
      ],
      answer: 'B',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Cümlede Anlam',
      alt_konu: 'Cümlede Anlam',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 85,
      doğru_cevap_oranı: 0.52,
      görsel_var_mı: false,
      metin:
        'Aşağıdaki cümlelerin hangisinde amaç-sonuç ilişkisi vardır?',
      şıklar: [
        'Ders çalıştığı için başarılı oldu.',
        'Başarılı olmak için düzenli çalışıyor.',
        'Ders çalışmayı seviyor.',
        'Çalışkan bir öğrencidir.',
      ],
      answer: 'B',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Cümlede Anlam',
      alt_konu: 'Karşılaştırma',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 75,
      doğru_cevap_oranı: 0.55,
      görsel_var_mı: false,
      metin:
        'Aşağıdaki cümlelerin hangisinde karşılaştırma yapılmıştır?',
      şıklar: [
        'Bu kitap çok güzeldi.',
        'Bu kitap diğerlerinden daha akıcı.',
        'Kitap okudu.',
        'Kütüphaneye gitti.',
      ],
      answer: 'B',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Fiilimsiler',
      alt_konu: 'Fiilimsiler',
      müfredat_yılı: 2025,
      zorluk: 3,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 85,
      doğru_cevap_oranı: 0.5,
      görsel_var_mı: false,
      metin:
        'Aşağıdaki cümlelerin hangisinde hem sıfat-fiil hem zarf-fiil vardır?',
      şıklar: [
        'Koşarak gelen çocuk düştü.',
        'Gülen çocuk mutluydu.',
        'Koşarak geldi.',
        'Geldiğinde onu gördüm.',
      ],
      answer: 'A',
    },
    {
      sınav_türü: 'YKS_TYT',
      ders: 'Türkçe',
      konu: 'Sözcükte Anlam',
      alt_konu: 'Deyim / Kalıp söz',
      müfredat_yılı: 2025,
      zorluk: 2,
      soru_tipi: 'MCQ',
      kaynak: 'Özgün',
      çözüm_süresi_ort: 70,
      doğru_cevap_oranı: 0.63,
      görsel_var_mı: false,
      metin:
        '“Bu işi hafife alma.” cümlesindeki "hafife almak" ifadesinin anlamı aşağıdakilerden hangisidir?',
      şıklar: [
        'Önem vermemek',
        'Kolay bulmak',
        'Zor görmek',
        'Beğenmek',
      ],
      answer: 'A',
    },
  ];

  return rows.map((r, i) => {
    const { answer, ...rest } = r;
    return {
      ...rest,
      question_id: `q_tyt_tr_set2_${i + 1}`,
      doğru_index: letterToIndex(answer),
    };
  });
}

export function examLabel(cat: ExamCategory): string {
  const m: Record<ExamCategory, string> = {
    YKS_TYT: 'YKS TYT',
    YKS_AYT: 'YKS AYT',
    LGS: 'LGS',
    KPSS_GY: 'KPSS GY',
  };
  return m[cat];
}

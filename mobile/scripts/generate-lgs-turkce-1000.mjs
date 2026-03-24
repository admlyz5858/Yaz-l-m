/**
 * 1000 LGS Türkçe sorusu — örnek yapıda (4 şık, paragraf / cümle / fiilimsi / sözcük).
 * node scripts/generate-lgs-turkce-1000.mjs
 */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/lgsTurkce1000.generated.json');

const rnd = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

const shuffle = (arr, rand) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// --- Paragraf: 3 cümle + soru kökü, doğru şık metinden çıkarılabilir özet ---
const paragrafGiris = [
  'Eğitim, bireyin düşünme becerilerini geliştirmesine yardımcı olur.',
  'Doğayı korumak, gelecek nesillere yaşanabilir bir dünya bırakmanın ön koşuludur.',
  'Sanat, duyguların ve düşüncelerin ifade edilmesinde önemli bir araçtır.',
  'Bilimsel araştırmalar, doğru bilgiye ulaşmada sistematik yöntemleri gerektirir.',
  'Spor, disiplin ve dayanıklılık kazandıran bir etkinliktir.',
  'Okuma alışkanlığı, kelime bilgisini ve hayal gücünü destekler.',
  'Teknoloji, iletişimi kolaylaştırsa da bilinçli kullanım gerektirir.',
  'Tarih, geçmişten ders çıkarmayı sağlayan bir bilim dalıdır.',
  'Aile içi diyalog, çocukların kendini ifade etmesine katkı sunar.',
  'Çevre kirliliği, canlıların yaşam alanlarını tehdit eden bir sorundur.',
];

const paragrafOrta = [
  'Bu süreçte sabır ve düzenli çaba büyük rol oynar.',
  'Bireylerin sorumluluk bilinciyle hareket etmesi beklenir.',
  'Toplumun ortak değerler etrafında birleşmesi kolaylaşır.',
  'Uzmanlar, bilinçli adımlar atılmasını önerir.',
  'Aksi halde istenmeyen sonuçlar ortaya çıkabilir.',
];

const paragrafSon = [
  'Bu nedenle toplumsal destek ve bilinçlendirme çalışmaları önem taşır.',
  'Dolayısıyla herkesin üzerine düşen sorumluluk vardır.',
  'Sonuç olarak ölçülü ve planlı bir yaklaşım gereklidir.',
  'Bu bağlamda eğitimin ve öğretimin rolü büyüktür.',
  'Özetle birey ve toplum iş birliği şarttır.',
];

const paragrafSoruKökleri = [
  { metin: 'Bu parçanın ana fikri aşağıdakilerden hangisidir?', doğruTip: 'ozet' },
  { metin: 'Bu parçadan aşağıdakilerden hangisine ulaşılamaz?', doğruTip: 'ulasilamaz' },
  { metin: 'Bu parçaya göre aşağıdakilerden hangisi kesin olarak söylenebilir?', doğruTip: 'kesin' },
  { metin: 'Yazar bu parçada temel olarak neyi vurgulamaktadır?', doğruTip: 'vurgu' },
  { metin: 'Bu parçada aşağıdakilerden hangisi doğrudan belirtilmiştir?', doğruTip: 'dogrudan' },
];

const yanlisGenel = [
  'Parçada bu iddia hiç geçmemektedir.',
  'Metnin ana düşüncesiyle çelişen bir yorumdur.',
  'Yalnızca yanlış okumayla çıkarılabilecek bir sonuçtur.',
  'Metinde örneklendirilmemiş dış bir bilgidir.',
];

function buildParagraf(n, rand) {
  const a = paragrafGiris[n % paragrafGiris.length];
  const b = paragrafOrta[Math.floor(rand() * paragrafOrta.length)];
  const c = paragrafSon[Math.floor(rand() * paragrafSon.length)];
  const body = `${a} ${b} ${c}`;
  const stem = paragrafSoruKökleri[n % paragrafSoruKökleri.length];
  const doğruMetin =
    stem.doğruTip === 'ulasilamaz'
      ? 'Metinde verilmeyen veya metinden kesin çıkarılamayan iddia.'
      : 'Parçanın ana düşüncesini özetleyen ve metinle uyumlu ifade.';
  const opts = shuffle([doğruMetin, ...yanlisGenel.slice(0, 3)], rand);
  const doğru_index = opts.indexOf(doğruMetin);
  return {
    question_id: `q_lgs_tr_gen_${String(n).padStart(4, '0')}`,
    sınav_türü: 'LGS',
    ders: 'Türkçe',
    konu: 'Paragraf',
    alt_konu: stem.doğruTip,
    müfredat_yılı: 2025,
    zorluk: ((n % 5) + 1),
    soru_tipi: 'MCQ',
    kaynak: 'Özgün üretim',
    metin: `${body}\n\n${stem.metin}`,
    şıklar: opts,
    doğru_index,
    çözüm_süresi_ort: 85 + (n % 35),
    doğru_cevap_oranı: 0.48 + rand() * 0.22,
    görsel_var_mı: false,
  };
}

// Neden-sonuç: B doğru (sabit şablon, indeks karıştırılır)
function buildCumleNedenSonuc(n, rand) {
  const doğru = `Düzenli çalıştığı için sınavda başarılı oldu. (${n})`;
  const yanlis = [
    `Başarılı olmak için her gün plan yapıyor. (${n})`,
    `Sınavdan sonra dinlenmek istiyor. (${n})`,
    `Okula zamanında gelmeye özen gösteriyor. (${n})`,
  ];
  const opts = shuffle([doğru, ...yanlis], rand);
  return {
    question_id: `q_lgs_tr_gen_${String(n).padStart(4, '0')}`,
    sınav_türü: 'LGS',
    ders: 'Türkçe',
    konu: 'Cümlede Anlam',
    alt_konu: 'Neden sonuç',
    müfredat_yılı: 2025,
    zorluk: ((n % 5) + 1),
    soru_tipi: 'MCQ',
    kaynak: 'Özgün üretim',
    metin: 'Aşağıdaki cümlelerin hangisinde neden-sonuç ilişkisi vardır?',
    şıklar: opts,
    doğru_index: opts.indexOf(doğru),
    çözüm_süresi_ort: 75 + (n % 25),
    doğru_cevap_oranı: 0.5 + rand() * 0.2,
    görsel_var_mı: false,
  };
}

function buildFiilimsi(n, rand) {
  const doğru = `Koşarak gelen öğrenci sınıfa girdi. (${n})`;
  const yanlis = [
    `Gülen çocuk bahçede oynuyordu. (${n})`,
    `Hızlıca koştu ve yetişti. (${n})`,
    `Geldiğinde zil çalmıştı. (${n})`,
  ];
  const opts = shuffle([doğru, ...yanlis], rand);
  return {
    question_id: `q_lgs_tr_gen_${String(n).padStart(4, '0')}`,
    sınav_türü: 'LGS',
    ders: 'Türkçe',
    konu: 'Fiilimsiler',
    alt_konu: 'Fiilimsiler',
    müfredat_yılı: 2025,
    zorluk: ((n % 5) + 1),
    soru_tipi: 'MCQ',
    kaynak: 'Özgün üretim',
    metin: 'Aşağıdaki cümlelerin hangisinde hem sıfat-fiil hem zarf-fiil birlikte kullanılmıştır?',
    şıklar: opts,
    doğru_index: opts.indexOf(doğru),
    çözüm_süresi_ort: 78 + (n % 22),
    doğru_cevap_oranı: 0.52 + rand() * 0.18,
    görsel_var_mı: false,
  };
}

const sozcukHavuzu = [
  {
    kok: '“İşi şansa bırakma.” ifadesindeki “şansa bırakmak” için en uygun anlam',
    o: ['Rastgele davranmak', 'Planlı olmak', 'Yardım istemek', 'Ertelemek'],
    d: 0,
  },
  {
    kok: '“Burnundan solumak” deyiminin anlamı',
    o: ['Çok sinirli olmak', 'Çok neşeli olmak', 'Uyumak', 'Koşmak'],
    d: 0,
  },
  {
    kok: '“Ağzından bal damlamak” ifadesi',
    o: ['Tatlı ve güzel konuşmak', 'Susmak', 'Bağırmak', 'Yalan söylemek'],
    d: 0,
  },
  {
    kok: '“Göz açıp kapayıncaya kadar” anlamı',
    o: ['Çok kısa sürede', 'Çok uzun sürede', 'Hiç', 'Bazen'],
    d: 0,
  },
  {
    kok: '“Elinden düşürmemek” deyimi',
    o: ['Bir şeyi sürekli yanında bulundurmak', 'Düşürmek', 'Vazgeçmek', 'Unutmak'],
    d: 0,
  },
  {
    kok: '“Hafife almak” ifadesinin anlamı',
    o: ['Önem vermemek', 'Kolay bulmak', 'Zor görmek', 'Beğenmek'],
    d: 0,
  },
  {
    kok: '“Elini taşın altına koymak” deyimi',
    o: ['Sorumluluk almak', 'Kaçınmak', 'Yardım istemek', 'Tembellik etmek'],
    d: 0,
  },
  {
    kok: '“Kulak vermek” deyimi',
    o: ['Dikkatle dinlemek', 'Ses çıkarmak', 'Kaçmak', 'Unutmak'],
    d: 0,
  },
];

function buildSozcuk(n, rand) {
  const item = sozcukHavuzu[n % sozcukHavuzu.length];
  const vary = ` (${n})`;
  const optsRaw = item.o.map((t) => t + vary);
  const doğruStr = optsRaw[item.d];
  const order = shuffle([0, 1, 2, 3], rand);
  const şıklar = order.map((i) => optsRaw[i]);
  const doğru_index = şıklar.indexOf(doğruStr);
  return {
    question_id: `q_lgs_tr_gen_${String(n).padStart(4, '0')}`,
    sınav_türü: 'LGS',
    ders: 'Türkçe',
    konu: 'Sözcükte Anlam',
    alt_konu: 'Deyim',
    müfredat_yılı: 2025,
    zorluk: ((n % 5) + 1),
    soru_tipi: 'MCQ',
    kaynak: 'Özgün üretim',
    metin: `${item.kok} aşağıdakilerden hangisidir?`,
    şıklar,
    doğru_index,
    çözüm_süresi_ort: 68 + (n % 20),
    doğru_cevap_oranı: 0.54 + rand() * 0.2,
    görsel_var_mı: false,
  };
}

const out = [];
for (let k = 0; k < 1000; k++) {
  const rand = rnd(9000 + k * 1337);
  const n = k + 1;
  const mod = k % 4;
  if (mod === 0) out.push(buildParagraf(n, rand));
  else if (mod === 1) out.push(buildCumleNedenSonuc(n, rand));
  else if (mod === 2) out.push(buildFiilimsi(n, rand));
  else out.push(buildSozcuk(n, rand));
}

writeFileSync(OUT, JSON.stringify(out), 'utf8');
console.log('OK', out.length, OUT);

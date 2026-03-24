/**
 * YKS TYT Türkçe soru bankası (kullanıcı tarafından sağlanan içerik)
 */

export type TurkishQuestion = {
  id: string;
  subject: string;
  topic: string;
  exam: string;
  difficulty: number;
  preview: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function letterToIndex(letter: string): number {
  return letter.charCodeAt(0) - 65;
}

function buildPreview(question: string, maxLen = 100): string {
  const first = question.split('\n')[0].trim();
  return first.length > maxLen ? `${first.slice(0, maxLen)}…` : first;
}

function makeQ(
  id: string,
  topic: string,
  question: string,
  options: string[],
  answer: string,
  explanation: string
): TurkishQuestion {
  return {
    id,
    subject: 'Türkçe',
    topic,
    exam: 'YKS-TYT',
    difficulty: 2,
    preview: buildPreview(question),
    question,
    options,
    correctIndex: letterToIndex(answer),
    explanation,
  };
}

/** Deneme seti 1 */
const BATCH1: TurkishQuestion[] = [
  makeQ(
    'tyt-tr-d1-01',
    'Paragraf',
    'Bir araştırmacı, insanların okuma alışkanlıklarını incelerken ilginç bir sonuca ulaşır: İnsanlar, ilgilerini çeken metinleri daha hızlı ve daha dikkatli okurken ilgilerini çekmeyen metinleri yüzeysel geçmektedir. Bu durum, okumanın yalnızca bir beceri değil, aynı zamanda bir ilgi meselesi olduğunu göstermektedir.\n\nBu parçadan aşağıdakilerden hangisi kesin olarak çıkarılabilir?',
    ['İnsanlar her metni aynı dikkatle okur.', 'Okuma becerisi yalnızca teknik bir yetenektir.', 'İlgi, okuma sürecini etkileyen bir faktördür.', 'İlgi duymayan kişiler okuma yapamaz.'],
    'C',
    'Metinde ilginin okuma dikkatini ve hızını etkilediği belirtiliyor; doğru şık C.'
  ),
  makeQ(
    'tyt-tr-d1-02',
    'Paragraf',
    'Bir şehir planlamacısı, şehirlerin yalnızca binalardan ibaret olmadığını savunur. Ona göre bir şehri yaşanabilir kılan; parkları, sosyal alanları ve insanların bir araya gelebileceği ortak mekânlarıdır. Bu unsurlar eksik olduğunda şehirler sadece kalabalık yerleşim alanlarına dönüşür.\n\nBu parçadan aşağıdakilerden hangisine ulaşılamaz?',
    ['Şehirler sadece binalardan oluşmaz.', 'Sosyal alanlar şehir yaşamını etkiler.', 'Kalabalık şehirler her zaman yaşanabilirdir.', 'Ortak alanlar şehirleri daha yaşanabilir kılar.'],
    'C',
    'Metin kalabalığın tek başına yaşanabilirlik sağlamadığını ima eder; C seçeneği metne aykırıdır.'
  ),
  makeQ(
    'tyt-tr-d1-03',
    'Paragraf',
    'Bir öğrencinin başarısı yalnızca ders çalıştığı süreyle ölçülemez. Nasıl çalıştığı, ne kadar odaklandığı ve öğrendiklerini ne kadar tekrar ettiği de en az süre kadar önemlidir.\n\nBu parçanın ana fikri aşağıdakilerden hangisidir?',
    ['Uzun süre çalışmak başarıyı garanti eder.', 'Başarı yalnızca çalışma süresine bağlı değildir.', 'Öğrenciler çok çalışmalıdır.', 'Tekrar yapmak gereksizdir.'],
    'B',
    'Ana fikir: başarı sadece süreye değil, çalışma biçimine de bağlıdır.'
  ),
  makeQ(
    'tyt-tr-d1-04',
    'Paragraf',
    'Bilgi çağında yaşadığımız için her gün çok sayıda bilgiye maruz kalıyoruz. Ancak bu bilgilerin hepsini doğru kabul etmek, yanlış sonuçlara yol açabilir. Bu nedenle bireylerin bilgiyi sorgulama alışkanlığı kazanması gerekir.\n\nBu parçaya göre aşağıdakilerden hangisi doğrudur?',
    ['Tüm bilgiler güvenilirdir.', 'Bilgiyi sorgulamak gereksizdir.', 'Bilgiyi eleştirel değerlendirmek gerekir.', 'Bilgiye ulaşmak zordur.'],
    'C',
    'Metin bilgiyi sorgulama ve eleştirel bakışı vurgular.'
  ),
  makeQ(
    'tyt-tr-d1-05',
    'Paragraf',
    'Bir yazar, eserlerinde sade bir dil kullanarak geniş bir okuyucu kitlesine ulaşmayı hedefler. Karmaşık anlatımlardan kaçınarak okuyucunun metni daha kolay anlamasını sağlar.\n\nBu parçaya göre aşağıdakilerden hangisi çıkarılabilir?',
    ['Sade dil okuyucu sayısını artırabilir.', 'Karmaşık anlatım daha etkilidir.', 'Okuyucular zor metinleri tercih eder.', 'Yazarlar sade dil kullanmamalıdır.'],
    'A',
    'Sade dilin anlaşılırlığı ve kitleye ulaşmayı kolaylaştırdığı çıkarılır.'
  ),
  makeQ(
    'tyt-tr-d1-06',
    'Paragraf',
    'Bir bilim insanı, deneylerinde başarısız olduğunda bunu bir son olarak değil, yeni bir başlangıç olarak görür. Çünkü her başarısızlık, doğru sonuca ulaşmak için bir ipucu barındırır.\n\nBu parçadan aşağıdakilerden hangisi kesinlikle çıkarılır?',
    ['Başarısızlık bilimde yer almaz.', 'Başarısızlık öğrenme sürecinin bir parçasıdır.', 'Bilim insanları hata yapmaz.', 'Deneyler her zaman başarılı olur.'],
    'B',
    'Başarısızlığın öğrenme ve ilerleme için ipucu sunduğu belirtiliyor.'
  ),
  makeQ(
    'tyt-tr-d1-07',
    'Cümlede Anlam',
    'Aşağıdaki cümlelerin hangisinde amaç-sonuç ilişkisi vardır?',
    ['Ders çalıştığı için başarılı oldu.', 'Başarılı olmak için düzenli çalışıyor.', 'Ders çalışmayı seviyor.', 'Çalışkan bir öğrencidir.'],
    'B',
    '"Başarılı olmak için" ifadesi amaç (sonuç hedefi) ve buna yönelik eylemi gösterir; amaç-sonuç yapısı B şıkkındadır.'
  ),
  makeQ(
    'tyt-tr-d1-08',
    'Cümlede Anlam',
    'Aşağıdaki cümlelerin hangisinde karşılaştırma yapılmıştır?',
    ['Bu kitap çok güzeldi.', 'Bu kitap diğerlerinden daha akıcı.', 'Kitap okudu.', 'Kütüphaneye gitti.'],
    'B',
    '"Diğerlerinden daha" karşılaştırma eki içerir.'
  ),
  makeQ(
    'tyt-tr-d1-09',
    'Fiilimsiler',
    'Aşağıdaki cümlelerin hangisinde hem sıfat-fiil hem zarf-fiil vardır?',
    ['Koşarak gelen çocuk düştü.', 'Gülen çocuk mutluydu.', 'Koşarak geldi.', 'Geldiğinde onu gördüm.'],
    'A',
    '"Koşarak" zarf-fiil, "gelen" sıfat-fiildir.'
  ),
  makeQ(
    'tyt-tr-d1-10',
    'Sözcükte Anlam',
    '“Bu işi hafife alma.” cümlesindeki "hafife almak" ifadesinin anlamı aşağıdakilerden hangisidir?',
    ['Önem vermemek', 'Kolay bulmak', 'Zor görmek', 'Beğenmek'],
    'A',
    'Hafife almak: önemsememek, ciddiye almamak.'
  ),
];

/** Deneme seti 2 */
const BATCH2: TurkishQuestion[] = [
  makeQ(
    'tyt-tr-d2-01',
    'Paragraf',
    'Bir sanatçının eserlerini değerlendirirken yalnızca ortaya koyduğu ürüne bakmak çoğu zaman eksik bir değerlendirme olur. Çünkü sanatçının yetiştiği çevre, içinde bulunduğu kültürel yapı ve yaşadığı dönemin koşulları onun üretimini doğrudan etkiler. Bu nedenle bir eseri anlamak, aynı zamanda o eserin arka planını da anlamayı gerektirir.\n\nBu parçadan aşağıdakilerden hangisine ulaşılamaz?',
    ['Bir eseri değerlendirmek için yalnızca son ürüne bakmak yeterli değildir.', 'Sanatçının yaşadığı çevre eserlerini etkiler.', 'Sanat eserleri yalnızca estetik kaygıyla ortaya çıkar.', 'Bir eseri anlamak için bağlamı bilmek gerekir.'],
    'C',
    'Metin sanatı bağlamdan soyutlamaz; C şıkkı metne aykırıdır.'
  ),
  makeQ(
    'tyt-tr-d2-02',
    'Paragraf',
    'İnsanlar çoğu zaman hızlı sonuç almak ister ve bu nedenle süreçleri göz ardı eder. Oysa kalıcı başarılar, sabır ve düzenli çaba gerektirir. Süreci önemsemeyen bireyler, kısa vadede bazı sonuçlar elde etseler bile uzun vadede istedikleri noktaya ulaşamazlar.\n\nBu parçaya göre aşağıdakilerden hangisi kesin olarak söylenebilir?',
    ['Hızlı sonuç alan kişiler her zaman başarısız olur.', 'Süreç odaklı çalışanlar uzun vadede daha başarılı olabilir.', 'Sabır gerektiren işler her zaman zordur.', 'Kısa vadeli başarılar değersizdir.'],
    'B',
    'Metin sürece önem vermenin uzun vadeli başarıyla ilişkisini vurgular.'
  ),
  makeQ(
    'tyt-tr-d2-03',
    'Paragraf',
    'Günümüzde bilgiye ulaşmak oldukça kolaydır; ancak bu durum, doğru bilgiye ulaşıldığı anlamına gelmez. Bilginin hızla yayılması, yanlış bilgilerin de aynı hızla yayılmasına neden olmaktadır. Bu nedenle bireylerin bilgiye eleştirel bir gözle yaklaşması gerekir.\n\nBu parçanın ana fikri aşağıdakilerden hangisidir?',
    ['Bilgiye ulaşmak günümüzde zordur.', 'Yanlış bilgi yayılmaz.', 'Bilgiye eleştirel yaklaşmak gerekir.', 'Teknoloji zararlıdır.'],
    'C',
    'Ana fikir: bilgiye eleştirel yaklaşım gerekliliği.'
  ),
  makeQ(
    'tyt-tr-d2-04',
    'Paragraf',
    'Bir öğretmen, öğrencilerinin yalnızca doğru cevaplara ulaşmasını değil, aynı zamanda düşünme süreçlerini geliştirmesini de hedefler. Bu nedenle öğrencilerine doğrudan cevap vermek yerine onları düşündürecek sorular yöneltir.\n\nBu parçaya göre öğretmenin asıl amacı aşağıdakilerden hangisidir?',
    ['Öğrencilerin daha hızlı öğrenmesini sağlamak', 'Öğrencilerin ezber yapmasını sağlamak', 'Öğrencilerin düşünme becerilerini geliştirmek', 'Öğrencilere zor sorular sormak'],
    'C',
    'Öğretmenin hedefi düşünme süreçlerini geliştirmektir.'
  ),
  makeQ(
    'tyt-tr-d2-05',
    'Paragraf',
    'Bir şehirde yaşayan insanların yaşam kalitesi, yalnızca ekonomik imkânlarla ölçülemez. Kültürel etkinlikler, sosyal ilişkiler ve çevresel faktörler de bu kaliteyi belirleyen önemli unsurlar arasındadır.\n\nBu parçadan aşağıdakilerden hangisi çıkarılamaz?',
    ['Yaşam kalitesi sadece ekonomik durumla belirlenmez.', 'Kültürel etkinlikler yaşam kalitesini etkiler.', 'Ekonomik durum yaşam kalitesini hiç etkilemez.', 'Sosyal ilişkiler yaşam kalitesinde rol oynar.'],
    'C',
    'Metin ekonominin de etkili olduğunu reddetmez; C kesinlikle çıkarılamaz.'
  ),
  makeQ(
    'tyt-tr-d2-06',
    'Cümlede Anlam',
    'Aşağıdaki cümlelerin hangisinde hem neden-sonuç hem de amaç anlamı birlikte vardır?',
    ['Başarılı olmak için düzenli çalışıyor.', 'Düzenli çalıştığı için başarılı oldu.', 'Başarılı olmak için çalıştığı için yoruldu.', 'Çalışmayı sevdiği için başarılı olmak istiyor.'],
    'C',
    'İlk "için" amaç, "çalıştığı için" neden-sonuç ilişkisidir.'
  ),
  makeQ(
    'tyt-tr-d2-07',
    'Fiilimsiler',
    'Aşağıdaki cümlelerin hangisinde hem sıfat-fiil hem zarf-fiil birlikte kullanılmıştır?',
    ['Koşarak gelen çocuk düştü.', 'Gülen çocuk mutlu görünüyordu.', 'Koşarak geldi ve oturdu.', 'Geldiğinde onu gördüm.'],
    'A',
    '"Koşarak" zarf-fiil, "gelen" sıfat-fiildir.'
  ),
  makeQ(
    'tyt-tr-d2-08',
    'Sözcükte Anlam',
    '“Onun bu konuda elini taşın altına koyması gerekiyordu.” cümlesinde geçen deyimin anlamı aşağıdakilerden hangisidir?',
    ['Zor bir işten kaçınmak', 'Sorumluluk almaktan kaçınmak', 'Sorumluluk almak ve risk üstlenmek', 'Kolay bir işi tercih etmek'],
    'C',
    'Elini taşın altına koymak: risk alıp sorumluluk üstlenmek.'
  ),
  makeQ(
    'tyt-tr-d2-09',
    'Paragraf',
    'Bir bilim insanı, yaptığı deneylerin sonucunu hemen elde edemeyebilir. Bazen aynı deneyi defalarca tekrarlamak zorunda kalır. Ancak bu süreç, onun daha doğru sonuçlara ulaşmasını sağlar.\n\nBu parçaya göre aşağıdakilerden hangisi vurgulanmaktadır?',
    ['Bilimsel çalışmalar kolaydır.', 'Deneyler her zaman hızlı sonuç verir.', 'Tekrar etmek daha doğru sonuçlara ulaşmayı sağlar.', 'Bilim insanları hata yapmaz.'],
    'C',
    'Tekrarın doğruluğa katkısı vurgulanır.'
  ),
  makeQ(
    'tyt-tr-d2-10',
    'Paragraf',
    'Bir yazarın dili ne kadar sade olursa, okurla kurduğu bağ o kadar güçlü olur. Çünkü karmaşık anlatımlar, okuyucunun metni anlamasını zorlaştırabilir.\n\nBu parçaya göre aşağıdakilerden hangisi doğrudur?',
    ['Sade dil her zaman yetersizdir.', 'Karmaşık anlatım okuyucuyu metne yaklaştırır.', 'Sade dil, okurla bağ kurmayı kolaylaştırır.', 'Okuyucu metni anlamak zorunda değildir.'],
    'C',
    'Sade dilin okur bağını güçlendirdiği ifade edilir.'
  ),
];

export const TURKISH_QUESTIONS: TurkishQuestion[] = [...BATCH1, ...BATCH2];

export const TURKISH_QUESTION_IDS = TURKISH_QUESTIONS.map((q) => q.id);

export function getTurkishQuestionById(id: string): TurkishQuestion | undefined {
  return TURKISH_QUESTIONS.find((q) => q.id === id);
}

export function getNextTurkishQuestionId(currentId: string): string | null {
  const i = TURKISH_QUESTION_IDS.indexOf(currentId);
  if (i < 0 || i >= TURKISH_QUESTION_IDS.length - 1) return null;
  return TURKISH_QUESTION_IDS[i + 1];
}

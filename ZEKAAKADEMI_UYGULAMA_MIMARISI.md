# ZekaAkademi - Uygulama Mimarisi Taslağı

**Yapay Zeka Destekli Akıllı Eğitim Platformu**  
**Hedef:** LGS • YKS • KPSS • ALES • DGS • ÖSYM Sınavları  
**Toplam Modül:** 15+ | **Ekran:** 60+ | **Özellik:** 100+

---

## BÖLÜM 1: GENEL BAKIŞ VE STRATEJİK KONUMLANDIRMA

### 1.1 Uygulama Vizyonu
ZekaAkademi, Türkiye'deki **15 milyondan fazla** sınav adayına yönelik, yapay zeka teknolojilerini eğitimle birleştiren kapsamlı bir mobil öğrenme platformudur.

**Referans Pazar Verileri:**
- MEBİ: 1,185,000 aktif kullanıcı
- Kunduz: 40 milyon+ yanıtlanmış soru
- ZekaAkademi hedefi: Bu iki oyuncunun birleştirdiği tüm özellikleri aşan tek uygulama

### 1.2 Pazar Analizi ve Hedef Kitle

| Segment | Profil | Birincil İhtiyaç | Tahmini Büyüklük |
|---------|--------|------------------|------------------|
| YKS Adayları | 9–12. Sınıf (15–18 yaş) | TYT/AYT hazırlık, deneme sınavı | ~2.5M |
| LGS Adayları | 7–8. Sınıf (12–14 yaş) | LGS soru bankası, müfredat takibi | ~1.3M |
| KPSS Adayları | Üniversite mezunları (22–35 yaş) | GY/GK + ÖABT hazırlık | ~1.8M |
| ALES/DGS | Lisans mezunları | Sayısal/sözel akıl yürütme | ~600K |
| Üniversite Öğrencileri | 18–25 yaş | Vize/final hazırlık, not tutma | ~3M |
| Öğretmenler | 25–45 yaş | Soru bankası, ders materyali üretimi | ~900K |

### 1.3 Rekabet Analizi

| Platform | Güçlü Yön | Zayıf Yön | ZekaAkademi Farkı |
|----------|-----------|-----------|-------------------|
| MEBİ | Resmi içerik, ücretsiz, 1.18M kullanıcı | Sınırlı AI, sadece YKS/LGS | Tüm sınavlar + Gelişmiş AI |
| Kunduz | İnsan uzman ağı, 50K+ uzman | Pahalı, sadece soru çözme | Hibrit AI+uzman + geniş modül |
| Vitamin/Raunt | Rehberlik, 155K+ saat destek | Kurumsal odaklı, pahalı | Bireysel + kurumsal erişim |
| Quizlet | Flash kart, 60M kullanıcı | Türk müfredatına özel değil | FSRS + Türk müfredat odağı |
| Duolingo (model) | Oyunlaştırma, günlük alışkanlık | Eğitim değil dil odaklı | Sınav odaklı gamification |

### 1.4 Temel Özellik Matrisi (15 Modül)

| # | Modül | AI Entegrasyon Derinliği | Öncelik | MVP'de? |
|---|-------|--------------------------|---------|---------|
| 1 | AI Destekli Planlama | GPT-4o + Müfredat Analizi | KRİTİK | Evet |
| 2 | AI Soru Çözme | OCR + LLM + Sokratik | KRİTİK | Evet |
| 3 | Soru Bankası | NLP Kategorizasyon | KRİTİK | Evet |
| 4 | AI Flash Kart | FSRS + NLP Üretim | YÜKSEK | Evet |
| 5 | AI Özet/Sunum | RAG + LLM Özetleme | YÜKSEK | Hayır |
| 6 | Pomodoro/Odak | Davranışsal Analitik | YÜKSEK | Evet |
| 7 | Bilgi Yarışması | NLP + Soru Üretimi | ORTA | Hayır |
| 8 | Deneme Sınavı | Adaptif Test Motoru | KRİTİK | Evet |
| 9 | Boşluk Doldurma | NLP Cloze Üretimi | ORTA | Hayır |
| 10 | Sınav Geri Sayım | NLP Takvim Entegrasyon | YÜKSEK | Evet |
| 11 | Müfredat Tespiti | Document AI + NER | YÜKSEK | Evet |
| 12 | Sosyal/Topluluk | Öneri Sistemi | ORTA | Hayır |
| 13 | İstatistik/Analitik | ML Performans Analizi | YÜKSEK | Evet |
| 14 | Soru Ekleme | İçerik Moderasyon AI | ORTA | Hayır |
| 15 | AI Koçluk Botu | Sokratik GPT-4o | YÜKSEK | Hayır |

---

## BÖLÜM 2: GİRİŞ EKRANLARI (ONBOARDING FLOW)

**Kural:** Onboarding maksimum **7 ekran**, **3 dakikayı geçmemeli**.

### 2.1 EKRAN 1 — Splash Screen (Açılış Ekranı)

| Özellik | Detay |
|---------|-------|
| Süre | 2.5 saniye animasyon |
| Animasyon | Logo yukarıdan aşağıya düşer |
| Arka plan | Gradient (lacivert → mor) |
| Arka planda çalışanlar | Uygulama config yüklemesi, token kontrolü, internet bağlantısı check |
| Karar ağacı | Token geçerli → Ana Panel \| Token yok → Karşılama Ekranı |
| Offline kontrolü | İnternet yok → Offline mod uyarısı + Cache içerikle devam |

### 2.2 EKRAN 2 — Karşılama Ekranı (Welcome Screen)

**3 sayfalık yatay kaydırmalı (swipeable) karşılama seti:**

| Sayfa | Başlık | Görsel | Alt Başlık |
|-------|--------|--------|------------|
| 1 | "Sınavına 90 Günün Var" | AI koç görseli | "Her gün 45 dakika ile hedefe ulaş" |
| 2 | "1,000+ Soru Bankası + AI Çözüm" | Soru çözme animasyonu | - |
| 3 | "Senin için Özelleştirilmiş Plan" | Kişiselleştirme görseli | - |

**Ortak elemanlar:**
- Her sayfada: Bir sonraki sayfaya geçiş butonu
- Alt kısımda nokta indikatörü
- Son sayfada: "Hemen Başla" (→ Kayıt) ve "Giriş Yap" butonları

### 2.3 EKRAN 3 — Kayıt / Giriş Ekranı

| Yöntem | Akış | Özel Not |
|--------|------|----------|
| E-posta + Şifre | Form → OTP doğrulama → Profil kurulum | KVKK onayı zorunlu |
| Google OAuth | Tek tık → Token al → Profil kurulum | Hızlı onboarding |
| Apple Sign-In | Face ID/Touch ID → Profil kurulum | iOS zorunluluğu |
| Telefon (OTP) | Numara → SMS kodu → Profil kurulum | Türkiye'de yaygın tercih |
| Misafir Modu | Hesap açmadan 3 deneme → Kayıt teşviki | Freemium kapısı |

### 2.4 EKRAN 4 — Profil Kurulum (Step 1/4: Temel Bilgiler)

**Alanlar:**
- Ad Soyad (zorunlu)
- Doğum tarihi seçici
- Şehir/İlçe dropdown (opsiyonel)
- Cinsiyet seçimi (opsiyonel, KVKK açıklamalı)

**UI:**
- Alt kısımda ilerleme çubuğu (Step 1/4)
- "Devam Et" butonu
- "Şimdi Değil" linki ile atlanabilir (eksik profil sonra tamamlanabilir)

### 2.5 EKRAN 5 — Sınav Seçimi (Step 2/4: Hedef Sınav)

**En kritik onboarding ekranı — kişiselleştirme motorunu tetikler**

**Sınav kartları (büyük format):**
- YKS (TYT + AYT) / LGS / KPSS / ALES / DGS / Üniversite Dersleri / Diğer

**Her kartta:**
- Sınav logosu
- Sınav tarihi
- Tahmini hazırlık süresi
- "Bu yıl sınava girecek" checkbox

**Özellikler:**
- Çoklu sınav seçimi mümkün (örn: YKS + KPSS birlikte)
- YKS seçilirse: Alt seçenek → Hangi puan türü? (SAY/EA/SÖZ/DİL)
- Hedef net veya puan girişi (opsiyonel): "Hedef netim: ___"

### 2.6 EKRAN 6 — Seviye Tespiti (Step 3/4: Hızlı Tanıma Testi)

| Özellik | Detay |
|---------|-------|
| Soru sayısı | 10 soru |
| Dağılım | Her ders için 1-2 örnek soru (çoktan seçmeli) |
| Süre | 60 saniye/soru (zamanlayıcı görünür) |
| Algoritma | Adaptif: Doğru cevap → Üst zorluk \| Yanlış → Alt zorluk |
| Sonuç seviyeleri | Başlangıç / Orta / İleri |
| Çıktı | Her ders için ayrı seviye profili |
| Geçilirse | Sistem default başlangıç seviyesi atar |

### 2.7 EKRAN 7 — Kişiselleştirme ve Plan Oluşturma (Step 4/4)

**AI motoru devreye girer:**

- Sınav tarihi (Takvimden seç veya otomatik doldur)
- Günlük çalışma kapasitesi: Slider (30 dk – 8 saat)
- Zayıf konular (Seviye testinden otomatik + manuel ekleme)
- Çalışma saatleri tercihi: Sabah / Öğle / Akşam / Gece
- AI Plan Oluşturma animasyonu (3 saniye "Planın hazırlanıyor...")
- Plan önizlemesi: Haftalık görünüm → "Planı Başlat" butonu

---

## BÖLÜM 3: ANA PANEL VE NAVİGASYON MİMARİSİ

### 3.1 Ana Panel (Dashboard) Bölümleri

#### 3.1.1 Üst Kısım — Kullanıcı Durumu Çubuğu
- **Sol:** Avatar + "Günaydın, [İsim]!" kişisel selamlama (saate göre değişen)
- **Orta:** Bugünkü hedef ilerleme çubuğu (% tamamlanma)
- **Sağ:** Bildirim zili + Günlük seri (Streak) ateş ikonu

#### 3.1.2 Sınav Geri Sayım Widget'ı
- Büyük kart formatı: "[Sınav Adı] — X Gün Kaldı"
- Mini ilerleme: "Hedef Puana %67 ulaştın"
- İkincil sınav varsa küçük chip formatında gösterim

#### 3.1.3 Bugünkü Görevler Listesi
- AI tarafından oluşturulan günlük görev listesi (3–7 görev)
- Her görev: İkon + Ders adı + Süre tahmini + Tamamla checkbox
- Görev türleri: Konu çalışma, Soru çözme, Flash kart tekrar, Deneme sınavı
- Tamamlanan görev: Yeşil çizgi, konfeti animasyonu

#### 3.1.4 Hızlı Erişim Kısayolları (Quick Actions)
**6'lı grid formatı:**
1. AI Soru Çöz
2. Flash Kart Çalış
3. Deneme Sınavı
4. AI Plan Gör
5. Soru Bankası
6. Bilgi Yarışması

#### 3.1.5 Son Aktivite ve Öneriler
- Son çalıştığın konular + yeniden devam et butonu
- AI öneri kartları: "Bu hafta Matematik'te zayıfsın, 20 soru çöz"
- Liderlik tablosunda bugünkü sıran

### 3.2 Alt Navigasyon Çubuğu (Bottom Navigation)

| Tab | İkon | Ekranlar | Badge |
|-----|------|----------|-------|
| Ana Sayfa | Ev ikonu | Dashboard, Günlük plan, Haber | Tamamlanmayan görev sayısı |
| Çalış | Kitap ikonu | Soru çözme, Flash kart, Pomodoro | Bugünkü eksik görev |
| Sınav | Kâğıt-kalem ikonu | Deneme, Soru bankası, Yarışma | Aktif sınav varsa |
| İstatistik | Grafik ikonu | Performans, Raporlar, Rozetler | Yeni rozet kazanıldıysa |
| Profil | Kullanıcı ikonu | Ayarlar, Abonelik, Hedefler | Eksik profil |

### 3.3 Üst Menü (Hamburger / Drawer Menu)

**Premium Özellikler:**
- AI Koç ile Konuş (Premium)
- Öğretmen Modu (Premium)
- Gruplar ve Arkadaşlar
- İndirilen İçerikler (Offline)
- Destek ve Yardım
- Abonelik Yönetimi

---

## BÖLÜM 4: YAPAY ZEKA DESTEKLİ PLANLAMA MODÜLÜ

### 4.1 AI Planlama Motoru — Veri Kaynakları

| Veri Kaynağı | Veri Türü | Güncelleme Sıklığı | Ağırlık |
|--------------|-----------|---------------------|---------|
| Seviye Testi Sonuçları | Konu bazlı yeterlilik puanı (0–100) | Sınav sonrası | %25 |
| Performans Geçmişi | Doğru/yanlış oranları, çözüm süreleri | Her oturum | %30 |
| Müfredat Durumu | İşlenen / işlenmeyen konular | Günlük | %25 |
| Sınav Takvimi | Kalan gün, öncelikli konular | Anlık | %20 |

### 4.2 Plan Oluşturma Akışı (7 Adım)

1. Kullanıcı "Plan Oluştur" butonuna tıklar veya onboardingden yönlendirilir
2. Sistem mevcut verileri toplar (seviye, müfredat, takvim, geçmiş)
3. GPT-4o API'ye yapılandırılmış prompt gönderilir
4. Model JSON formatında haftalık plan döndürür
5. Plan kullanıcıya interaktif takvim görünümünde sunulur
6. Kullanıcı düzenleme yapabilir (sürükle-bırak ile görev kaydırma)
7. Plan onaylanır ve takvime işlenir

### 4.3 Haftalık Plan Görünümü Ekranı

#### 4.3.1 Üst Araç Çubuğu
- Hafta seçici (sol-sağ ok ile önceki/sonraki hafta)
- Görünüm tipi: Haftalık | Günlük | Aylık (toggle)
- "AI ile Yeniden Planla" butonu

#### 4.3.2 Takvim Grid'i
- **Yatay:** Pazartesi–Pazar sütunları
- **Dikey:** 06:00–24:00 saat dilimleri
- **Renk kodlama:** Matematik: mavi, Türkçe: turuncu vb.
- **Görev kartları:** Ders adı + Konu + Süre
- Sürükle-bırak ile yeniden zamanlama
- Tıklanınca: Görev detayları + "Başlat" butonu

#### 4.3.3 Akıllı Yeniden Zamanlama (Reclaim.ai Benzeri)
- Görev atlanınca: "Bu görevi ne zaman tamamlamak istersin?"
- Takvimde boş slotlara otomatik önerim: "Yarın 20:00-21:00 uygun görünüyor"
- Sınav tarihi yaklaştıkça plan yoğunluğu otomatik artar
- Hafta sonu boşlukları için "Telafi seansı" önerileri
- Hastalık/geçici yokluk bildirimi → Plan otomatik sıkıştırılır

### 4.4 Plan Analizi ve İlerleme Ekranı
- Bu hafta tamamlama oranı (halka grafik)
- Ders bazlı dağılım: Pasta grafik
- Hedef vs Gerçek: "Planladığın 5 saate karşı 3.5 saat çalıştın"
- Streak takibi: Kaç gün üst üste plana uyuldu
- Özet: "Bu hafta en çok: Matematik | En az: Tarih"

---

## BÖLÜM 5: AI SORU ÇÖZME VE SORU BANKASI

### 5.1 AI Soru Çözme Modülü

**Hibrit model:** Kunduz + Photomath OCR kalitesi

#### 5.1.1 Soru Giriş Yöntemleri

| Giriş Türü | Teknik Altyapı | Kullanım Senaryosu | Doğruluk |
|------------|----------------|---------------------|----------|
| Kamera ile Fotoğraf | OCR (Tesseract + Google Vision) | Kitap/test kâğıdından soru | ~%89 |
| Galeri'den Yükleme | OCR + Image preprocessing | Ekran görüntüsünden soru | ~%91 |
| El Yazısı Çizimi | CNN tabanlı yazı tanıma | Tablet/stylus ile çizilen formüller | ~%78 |
| Metin Yazarak | Doğrudan LLM girişi | Dijital ortamda sorulan sorular | ~%99 |
| Sesli Soru | Whisper STT → LLM | Sözlü sorular (dil sınavları) | ~%85 |

#### 5.1.2 AI Çözüm Motoru Akışı (7 Adım)

1. Görüntü/metin alınır → Ön işleme (kontrast, döndürme, gürültü giderme)
2. OCR ile metin/formül dijitalleştirilir
3. Soru tipi sınıflandırılır: Matematik / Fen / Sözel / Yabancı Dil / Diğer
4. Uygun model seçilir: Matematik → Wolfram+GPT | Fen → GPT-4o | Sözel → Claude
5. Sokratik mod aktifse: Cevap değil yönlendirici ipucu verilir
6. Standart modda: Adım adım çözüm + Kavramsal açıklama sunulur
7. Çözüm okunurluk skoru hesaplanır, gerekirse yeniden formüle edilir
8. Benzer soru önerileri soru bankasından getirilir

#### 5.1.3 Çözüm Ekranı Detayları
- **Üst:** Orijinal soru görseli (zoomlanabilir)
- **Orta:** Adım adım çözüm (her adım ayrı kart, kaydırılabilir)
- **Sokratik Mod toggle:** Kapalı → Tam çözüm | Açık → İpucu sistemi
- Her adımda: "Bu adımı anlamadım" → AI daha detaylı açıklar
- "Bu soruyu soru bankasına ekle" butonu
- "Benzer 5 Soru Çöz" hızlı aksiyon
- Çözüm kalitesi oylama (👍/👎) — Model iyileştirme için veri

### 5.2 Soru Bankası Modülü

#### 5.2.1 Veri Yapısı

| Alan | Açıklama | Örnek Değer |
|------|----------|-------------|
| question_id | UUID | q_7a3f8b2c |
| sınav_türü | Enum | YKS_TYT / LGS / KPSS_GY |
| ders | String | Matematik |
| konu | String | Olasılık |
| alt_konu | String | Koşullu Olasılık |
| müfredat_yılı | Integer | 2025 |
| zorluk | 1-5 scale | 3 |
| soru_tipi | Enum | MCQ / Açık uçlu / Boşluk |
| kaynak | String | ÖSYM 2023 / Özgün |
| çözüm_süresi_ort | Seconds | 94 |
| doğru_cevap_oranı | Float | 0.63 |
| görsel_var_mı | Boolean | true |

#### 5.2.2 Arama ve Filtreleme Ekranı
- **Arama çubuğu:** Doğal dil araması ("YKS TYT olasılık zor sorular")
- **Filtre paneli (drawer):**
  - Sınav türü çoklu seçim
  - Ders seçimi
  - Konu ağacı (hiyerarşik seçim)
  - Zorluk seviyesi (slider: 1–5)
  - Soru tipi (MCQ, açık uçlu, vs)
  - Daha önce yanlış yaptıklarım (toggle)
  - Hiç çözmediklerim (toggle)
- **Soru listesi:** Kart formatında, soru önizlemesi
- **Sıralama:** Zorluk / Tarih / Çözülme sayısı / Doğruluk oranı

#### 5.2.3 Soru Çözüm Modu
- Soru üst kısımda, şıklar alt kısımda
- Cevap seçimi → Anlık geri bildirim (doğru: yeşil + açıklama, yanlış: kırmızı + neden)
- Süre göstergesi (opsiyonel)
- "Önce düşün" modu: Cevap butonunu 30 saniye kilitler
- Çözüm sonrası: Konu açıklaması + Bağlantılı konular + Sonraki soru

#### 5.2.4 Soru Ekleme (Kullanıcı İçerik Üretimi)

| Adım | İşlem |
|------|-------|
| 1 | Soru metnini yaz veya fotoğrafla yükle |
| 2 | Şıkları gir (MCQ: 4-5 şık, doğru şıkkı işaretle) |
| 3 | Çözüm açıklaması yaz (opsiyonel) |
| 4 | Etiketleme: Ders, Konu, Zorluk, Sınav türü seç |
| 5 | AI Moderasyon → Otomatik kalite kontrolü (spam/hata tespiti) |
| 6 | Topluluk onayı (3+ kullanıcı onayı ile yayın) |

**Katkı:** Her onaylanan soru için 50 ZekaPuan

---

## BÖLÜM 6: AI FLASH KART SİSTEMİ

### 6.1 Flash Kart Üretim Motorları

| Kaynak | İşlem | Çıktı | AI Teknolojisi |
|--------|-------|-------|----------------|
| PDF/Belge Yükleme | NLP ile anahtar kavram çıkarımı | Soru-Cevap kartları | GPT-4o + NER |
| Fotoğraf/Görsel | OCR → NLP özet | Görsel oklüzyon kartları | Google Vision + GPT |
| Web URL | Scraping → Özetleme | Konu özet kartları | RAG + Summarization |
| Ses Kaydı | Whisper STT → Özetleme | Ders notu kartları | Whisper + GPT-4o |
| Video (YouTube) | Transcript → NLP | Bölüm kartları | YouTubeTranscript + GPT |
| Manuel Yazma | Kullanıcı girer | Özel kartlar | AI öneri/tamamlama |
| Soru Bankası | Soru → Karta dönüştür | Sınav formatı kartlar | Template + GPT |

### 6.2 Kart Formatları

#### 6.2.1 Standart Ön-Arka Kart
- Ön yüz: Soru / Kavram / Tanım
- Arka yüz: Cevap + Açıklama + Kaynak referansı
- Flip animasyonu (3D dönme efekti)

#### 6.2.2 Cloze (Boşluk Doldurma) Kart
- Cümleden anahtar kelimeler AI tarafından otomatik çıkarılır
- Örnek: "Osmanlı Devleti [___] yılında kurulmuştur." → Cevap: 1299
- Birden fazla boşluk desteklenir

#### 6.2.3 Görsel Oklüzyon Kartı
- Anatomi, coğrafya, biyoloji için ideal
- Görsel üzerine AI otomatik etiket tespiti
- Seçilen etiket kapatılır, kullanıcıdan tahmin istenir
- Manuel oklüzyon kutusu çizme seçeneği

#### 6.2.4 Sesli Kart
- Ön yüzde metin okunur (TTS — Türkçe ses desteği)
- Yabancı dil kartlarında hedef dilde telaffuz
- Kullanıcı kendi sesini kaydedip karşılaştırabilir

### 6.3 FSRS Tekrar Algoritması

| Özellik | Detay |
|---------|-------|
| Avantaj | Anki SM-2'ye göre %20–30 daha az tekrar |
| Parametre | 17 matematiksel parametre, kişiselleştirilir |
| Kalibrasyon | Minimum 1.000 tekrar sonrası otomatik ağırlık |
| Metrikler | Zorluk, Kararlılık, Geri Çağırılabilirlik |
| Tahmin | "Bu kartı tam unutmadan 2 gün sonra tekrar et" |
| Yanıt seçenekleri | Yeniden(1) / Zor(2) / Orta(3) / Kolay(4) / Çok Kolay(5) |

### 6.4 Flash Kart Çalışma Ekranı
- **Üst:** Deste adı + Kart X/Y + İlerleme çubuğu
- **Orta:** Büyük beyaz kart, hafif gölgeli
- **Etkileşim:** Kart üstüne dokun veya yukarı kaydır (çevirme)
- **Cevap sonrası 5 buton:** Yeniden | Zor | Orta | Kolay | Çok Kolay (Kırmızı→Yeşil gradyan)
- **Alt:** "Bugün kalan: X kart" + "Tahmini süre: Y dk"

### 6.5 Deste Yönetimi Ekranı
- Destelerim: Grid veya liste görünümü
- Her deste kartında: İsim, kart sayısı, son çalışma tarihi, bugün kalan
- Sınav modu: Süreli tekrar (sınav öncesi yoğun çalışma)
- Paylaşım: Desteni toplulukla paylaş / Arkadaşlara gönder
- AI ile Deste Optimize Et: Tekrar eden/benzer kartları bul ve birleştir

---

## BÖLÜM 7: AI ÖZET VE SUNUM MODÜLÜ

### 7.1 Desteklenen Giriş Formatları

| Format | Maks Boyut | İşlem Süresi | Çıktı Seçenekleri |
|--------|------------|--------------|-------------------|
| PDF | 50 MB | 15–45 saniye | Özet / Sunum / Flash Kart |
| Word (.docx) | 20 MB | 10–30 saniye | Özet / Sunum / Flash Kart |
| PowerPoint (.pptx) | 30 MB | 20–60 saniye | Geliştirilmiş özet / Sorular |
| Ses (.mp3/.m4a) | 100 MB / 90dk | 30–90 saniye | Transkript / Flash Kart |
| YouTube URL | Sınırsız | 15–30 saniye | Transkript / Özet |
| Görsel (.jpg/.png) | 10 MB | 5–15 saniye | Metin çıkarımı / Kart |
| Metin yapıştırma | 50.000 karakter | 5–20 saniye | Özet / Sunum / Kart |

### 7.2 Özet Üretimi Ekranı
- Büyük drag-drop yükleme alanı
- **Özet türü:** Madde madde liste / Kısa paragraf / Kavram haritası / Soru-cevap formatı
- **Özet uzunluğu:** Çok kısa / Orta / Detaylı (slider)
- **Dil:** Türkçe / İngilizce / İkisi de
- "Sınav için kritik noktaları vurgula" checkbox

### 7.3 Sunum Üretimi
- Slayt sayısı: Otomatik / 5 / 10 / 15 / 20
- Tasarım şablonu: Akademik / Minimal / Renkli / Karanlık
- Her slayt: Başlık + Madde madde içerik + İlgili görsel (AI veya stok)
- Konuşmacı notları otomatik
- İhracat: PPTX / PDF / Ekranda görüntüle
- **Kaynak doğrulama:** Her istatistik için kaynak zorunluluğu (halüsinasyon riski)

---

## BÖLÜM 8: POMODORO VE ODAKLANMA ARAÇLARI

### 8.1 Pomodoro Zamanlayıcısı

#### 8.1.1 Temel Ekran
- Büyük dairesel zamanlayıcı (25:00 başlangıç)
- Çalışılan ders/konu seçimi (her pomodoro için)
- **Arka plan sesi:** Sessiz / Yağmur / Kütüphane / Lo-fi müzik / Orman
- Bildirim engelleme: Pomodoro süresince sustur
- Tamamlandığında: Titreşim + ses + konfeti animasyonu
- Mola ekranı: 5 dk / 15 dk (her 4 pomodorodan sonra)

#### 8.1.2 AI Destekli Özelleştirme

| Özellik | Detay |
|---------|-------|
| Varsayılan | 25/5 dk — Değiştirilebilir: 15-90 dk çalışma, 5-30 dk mola |
| AI öneri | "Son 3 hafta verinize göre 35/7 dk sizin için daha verimli" |
| Ders zorluğu | Matematik: 25 dk, Metin okuma: 45 dk |
| Verimlilik | "Saat 09:00-11:00 en verimli zaman diliminiz" |
| Mola uyarısı | 90 dk üzeri çalışmada uyarı |

### 8.2 Odaklanma Araçları

#### 8.2.1 Uygulama Engelleme (App Blocker)
- Sosyal medya engellemesi
- Beyaz liste: Sözlük, hesap makinesi vb.
- Engelleme denemesi: "5 saniye bekle" + odak hatırlatması
- Acil durum: 3 bypass denemesi → 30 dk kilitlenir

#### 8.2.2 Sanal Çalışma Odaları (Yeolpumta Modeli)
- Canlı arkadaşlar veya yabancılarla aynı "odada" çalışma
- Her oda: Katılımcı sayısı, sessiz mod, oda ismi
- Ortak Pomodoro modu: Hep birlikte başlar
- Reaction emojileri: 💪🔥📚
- Günlük seri ateşi ve rozetler

#### 8.2.3 Odaklanma İstatistikleri
- Bugün çalışma süreleri (ders bazlı çubuk grafik)
- Haftalık ısı haritası (GitHub benzeri, yeşil tonları)
- En verimli saatler grafiği
- Pomodoro tamamlama oranı

---

## BÖLÜM 9: BİLGİ YARIŞMALARI VE GAMİFİKASYON

### 9.1 Bilgi Yarışması Formatları

| Format | Oyuncu | Süre | Ödül | AI Rolü |
|--------|--------|------|------|---------|
| 1v1 Düello | 2 oyuncu | 10 soru / 5 dk | ZekaPuan + rozet | Denk rakip eşleştirme |
| Grup Yarışması | 2–8 oyuncu | 20 soru / 10 dk | Sıralama + özel rozet | Karma soru üretimi |
| Haftalık Turnuva | Tüm kullanıcılar | Hafta boyunca | Özel ödüller + unvan | Adaptif zorluk |
| Hızlı Quiz | 1 oyuncu | 5 soru / 2 dk | Anlık puan | Zayıf konu odaklı |
| Akıl Yarışması | 1 oyuncu | 30 soru / 30 dk | Sertifika | ÖSYM format simülasyonu |

### 9.2 Gamifikasyon Sistemi

#### 9.2.1 ZekaPuan (XP Sistemi)

| Aktivite | ZekaPuan | Bonus Koşulu | Bonus Puan |
|----------|----------|---------------|------------|
| Soru çözme (doğru) | 10 | İlk deneme doğru | +5 |
| Flash kart tekrarı | 3 / kart | 10+ kart üst üste | +20 |
| Pomodoro tamamlama | 25 | 5+ ardışık pomodoro | +50 |
| Deneme sınavı | 100 | Hedef üstü puan | +100 |
| Yarışma kazanma | 200 | Üst üste 3 galibiyet | +500 |
| Soru bankasına katkı | 50 / onay | Haftanın katkıcısı | +200 |
| Günlük giriş | 5 | 30 günlük seri | +500 |

#### 9.2.2 Seviye Sistemi
- **50 seviye:** Her 500 XP'de bir seviye
- **Seviye isimleri:** Çalışkan Öğrenci (1–10) → Zeki Beyinler (11–20) → Bilge Akıl (21–30) → Şampiyon (31–40) → Efsane (41–50)
- Her seviyede özel avatar çerçevesi, renk teması

#### 9.2.3 Rozet Sistemi (50+ Özgün)
- Örnekler: 7 Günlük Seri, İlk Deneme Sınavı, Flash Kart Ustası, Soru Bankası Katkıcısı, Yarışma Şampiyonu, Yüzde Yüz
- Gizli (sürpriz) veya Görev bazlı
- Profil sayfasında sergilenir

#### 9.2.4 Liderlik Tabloları
- Haftalık / Aylık / Genel (All-time)
- Filtreler: Tüm Türkiye / Şehrim / Arkadaşlarım / Aynı sınıf / Aynı sınav
- Kullanıcı kendi sırasını her zaman görür

---

## BÖLÜM 10: ZAMANLANMIŞ DENEME SINAVLARI

### 10.1 Sınav Türleri

| Sınav Türü | Süre | Soru Sayısı | Kapsam | Analitik |
|------------|------|-------------|--------|----------|
| TYT Tam Deneme | 135 dk | 120 soru | Tüm TYT | Net, puan, yüzdelik |
| AYT Alan Denemesi | 180 dk | 80 soru | Seçilen alan | Alan bazlı |
| LGS Denemesi | 100 dk | 90 soru | LGS müfredatı | Okul bazlı sıralama |
| KPSS Denemesi | 120 dk | 120 soru | GY/GK | Branş bazlı |
| Ders Minideneme | 30–45 dk | 20–40 soru | Tek ders | Konu detaylı |
| Hata Tekrar Sınavı | Kendi hızın | Değişken | Önceki hatalar | Hata pattern analizi |
| Adaptif Sınav | Değişken | Değişken | Zayıf konular | Bilgi boşluğu tespiti |

### 10.2 Sınav Başlatma Akışı

1. Sınav türü seç
2. Soru kaynağı: ÖSYM arşivi / Karma (ÖSYM + Özgün) / Sadece Özgün
3. Konu filtresi (opsiyonel)
4. Zorluk ayarı: Kolaydan zora / Karma / Sadece zor
5. Sınav bilgileri ekranı
6. Hazırım → Geri sayım 3-2-1 → Başla

### 10.3 Sınav Ekranı UX

#### Üst Çubuk
- Sol: Soru numarası gezgini (X/Y)
- Orta: Geri sayım (son 10 dk kırmızı)
- Sağ: Ders bazlı kalan süre + Sınav bırak

#### Soru Alanı
- Soru metni + görsel (zoom)
- 4 veya 5 şık (MCQ)
- Seçili şık mavi çerçeveli
- "Soru boş bırak" (bazı sınavlarda)
- "Bu soruyu işaretle" bayrağı

#### Alt Navigasyon
- ← Önceki \| → Sonraki
- Soru grid'i (120 soru)
- Renkler: Boş (gri) / Cevaplı (mavi) / İşaretli (sarı)

### 10.4 Sonuç ve Analitik

**Anlık Sonuç:**
- X Net / Y Puan
- Önceki denemeyle karşılaştırma
- Türkiye geneli tahmini sıralama
- Ders bazlı doğru/yanlış/boş

**Detaylı Analiz:**
- Konu bazlı performans
- Zaman analizi (her soru için)
- Hata pattern analizi
- AI öğrenme önerisi
- Soru bazlı inceleme

---

## BÖLÜM 11: BOŞLUK DOLDURMA KARTLARI

### 11.1 Otomatik Cloze Üretim Algoritması

1. Metin NLP pipeline'ından geçirilir
2. NER: Tarihler, isimler, kavramlar tespit
3. TF-IDF ile anahtar kelimeler
4. Zorluk analizi: Sık kelimeler kolay, nadir kelimeler zor
5. Çeldirici seçenekler (distractors) üretimi
6. Çıktı: MCQ veya yazılı cevap formatı

### 11.2 Kullanıcı Arayüzü
- Kart görünümü: Metin ortasında [___]
- **Mod 1:** 4 şıklı MCQ
- **Mod 2:** Yazılı cevap, AI semantik benzerlik ile değerlendirir
- **Mod 3:** Sürükle-Bırak kelime havuzu
- İpucu: İlk harf / Kelime uzunluğu
- Skor + "Bu kavramı tekrar çalış" AI önerisi

---

## BÖLÜM 12: SINAV GERİ SAYIM VE TAKVİM

### 12.1 Sınav Takvimi

| Sınav | Kaynak | Güncelleme | Widget |
|-------|--------|------------|--------|
| YKS (TYT+AYT) | ÖSYM API | Anlık | ✅ |
| LGS | MEB veri | Anlık | ✅ |
| KPSS (Lisans/Önlisans) | ÖSYM API | Anlık | ✅ |
| ALES / DGS / EKPSS | ÖSYM API | Anlık | ✅ |
| YDUS, TUS, DUS | ÖSYM API | Anlık | ✅ |
| Üniversite Vize/Final | Kullanıcı ekler | Manuel | ✅ |

### 12.2 Geri Sayım Widget
- Ana panel: "YKS'ye 127 GÜN 14 SAAT 32 DAKİKA kaldı"
- Boyutlar: Küçük (2x1), Orta (4x2), Büyük (4x4)
- İlerleme halkası: "Hazırlık sürecinin %43'ünü tamamladın"
- Renk: 30 gün → turuncu, 7 gün → kırmızı

### 12.3 Müfredat PDF/Belge Tespiti (Document AI)

1. PDF/görsel/Word yükleme
2. Multimodal AI (Gemini/Claude) layout analizi
3. NER ile tarih, etkinlik, sınav çıkarımı
4. Yarıyıl farkındalığı (yıl belirtilmemişse context)
5. Onay ekranı
6. Google/Apple Takvim'e ekleme
7. **Kritik:** "Final Sınavı (İptal Edildi)" gibi notlar ayrıştırılır
8. **Zorunlu:** Her etkinlik kullanıcı onayından geçer

---

## BÖLÜM 13: MÜFREDAT TESPİTİ VE KİŞİSELLEŞTİRME

### 13.1 Müfredat Veri Yapısı (Örnek: TYT Matematik)

| Alan | Örnek Değer |
|------|-------------|
| Sınav Türü | YKS-TYT |
| Ders | Matematik |
| Ana Konu | Sayılar |
| Alt Konu 1 | Doğal Sayılar |
| Alt Konu 2 | Tam Sayılar |
| Kazanım | Doğal sayılar üzerinde dört işlem yapabilir |
| Ağırlık (% net) | %12 (~3.6 soru) |
| Zorluk Dağılımı | Kolay %40, Orta %40, Zor %20 |

### 13.2 Konu Ağacı Navigasyonu
- Hiyerarşik: Sınav → Ders → Ana Konu → Alt Konu
- Her nodda: Kazanım sayısı, kişisel ilerleme %
- Renk: Kırmızı (çalışılmamış) → Sarı (kısmen) → Yeşil (tamamlanmış)
- "Bugün çalış" butonu

### 13.3 Kişiselleştirme Motoru (Knowledge Graph)

**Kullanıcı yeterlilik skoru (0–100):**
- Soru çözme performansı
- Flash kart FSRS hatırlama skoru
- Deneme sınavı net dağılımı
- Zaman kalıbı

### 13.4 AI Koçluk Önerileri (Örnek Mesajlar)

- "Analitik geometri puanın son 2 haftada %15 düştü. Bugün 20 soru çözelim mi?"
- "Yarın TYT denemen var. Bu gece flash kart tekrarı öneriyorum."
- "Hata pattern'in: Paragraf sorularında 3. şıkkı fazla seçiyorsun. Dikkat!"
- "Bu haftaki en başarılı konun: Türev (%87 doğru). Zoru sıraya ekleyeyim mi?"
- "Sınava 30 gün kaldı. Zayıf konulara yoğunlaşma zamanı geldi."

---

## BÖLÜM 14: SOSYAL ÖZELLİKLER VE TOPLULUK

### 14.1 Arkadaş Sistemi
- Kullanıcı adı veya telefon ile ekleme
- Arkadaşın haftalık puanı
- 1v1 yarışma daveti
- Streak görüntüleme
- Flash kart destesi paylaşma

### 14.2 Sınıf/Grup Modülü (Öğretmen)

| Özellik | Öğretmen | Öğrenci |
|---------|----------|---------|
| Sınıf oluşturma | Evet + davet kodu | Katılma kodu |
| Ödev atama | Soru seti, deneme, flash kart | Atanan ödevler |
| Performans takibi | Tüm sınıf pano | Kendi sırası |
| Özel soru bankası | Sınıfa özel sorular | Sınıf soruları |
| Duyuru | Push notification | Bildirim + in-app |
| Puan verme | Ödev teslim onayı | Kazanılan puan |

### 14.3 İçerik Keşif (Discover Feed)
- Topluluk flash kart desteleri
- AI önerilen içerikler
- Günün sorusu (en çok çözülen zor soru)
- Başarı hikayeleri paylaşımları

---

## BÖLÜM 15: İSTATİSTİK VE PERFORMANS ANALİTİKLERİ

### 15.1 Genel Bakış Kartları

| Metrik | Görsel | Açıklama |
|--------|--------|----------|
| Toplam Çalışma Süresi | Büyük sayı + saat ikonu | Bu hafta/ay/toplam |
| Çözülen Soru Sayısı | Çubuk grafik | Ders bazlı |
| Doğruluk Oranı | Yüzdelik halka | Sınav ve ders bazlı |
| Flash Kart Tekrar | Aralıklı takvim | Bugün/hafta/bekleyen |
| Streak Günleri | Ateş animasyonu | Ardışık gün |
| Sınav Trendi | Çizgi grafik | Son 10 deneme neti |

### 15.2 Derinlemesine Analiz
- Konu bazlı yeterlilik haritası (ısı haritası)
- Hata analizi: En çok yanlış 10 konu
- Zaman analizi: Verimli saatler
- Tahminsel: "Bu gidişle sınav günü X net yaparsın"
- Karşılaştırma: Aynı sınav hedefleyenlerle anonymize

### 15.3 Haftalık/Aylık Rapor
- Her Pazar akşamı push: "Haftalık Raporun Hazır"
- İçerik: Toplam süre, en iyi/zayıf konu, öneri
- Paylaşım özelliği

---

## BÖLÜM 16: TEKNİK MİMARİ

### 16.1 Frontend (Mobil Uygulama)

| Platform | Teknoloji | Neden |
|----------|-----------|-------|
| iOS | Swift + SwiftUI | Native, Apple kılavuzları |
| Android | Kotlin + Jetpack Compose | Native, Material You |
| Ortak Kod (%60) | React Native veya Flutter | Hız, maliyet |
| State | Redux Toolkit / Zustand | Tahmin edilebilir |
| Offline Cache | SQLite + AsyncStorage | İnternetsiz |
| Push | FCM + APNs | Güvenilir bildirim |

### 16.2 Backend Mikroservisleri

| Servis | Teknoloji | Sorumluluk |
|--------|-----------|------------|
| Auth Service | Node.js + JWT | Kimlik doğrulama, OAuth |
| AI Gateway | Python + FastAPI | OpenAI/Anthropic proxy, rate limiting |
| Question Service | Node.js + PostgreSQL | Soru bankası CRUD |
| Flashcard Service | Python + Redis | FSRS, kart yönetimi |
| Planning Service | Python + Celery | AI plan, takvim |
| Analytics Service | Python + ClickHouse | Performans, raporlama |
| Notification Service | Node.js + Bull | Push, e-posta, SMS |
| Content Service | Node.js + S3 | PDF/ses/video |
| Exam Service | Node.js + PostgreSQL | Deneme motoru |
| Social Service | Node.js + Graph DB | Arkadaşlar, gruplar |

### 16.3 AI/ML Katmanı

| Görev | Model | Kullanım |
|-------|-------|----------|
| Soru çözme (genel) | GPT-4o | Her istek |
| Matematik (cebirsel) | Wolfram Alpha API | Matematik soruları |
| OCR / Görsel tanıma | Google Vision API | Kamera tarama |
| Flash kart üretimi | Claude 3.5 Sonnet | İçerik yükleme |
| Müfredat tespiti | Gemini 1.5 Pro | PDF belge |
| Ses transkripsiyonu | OpenAI Whisper | Ses kaydı |
| TTS (sesli kart) | Google TTS (Türkçe) | Flash kart |
| FSRS algoritması | Özel ML modeli | Her tekrar |
| Performans tahmini | XGBoost / LSTM | Haftalık rapor |

### 16.4 Veritabanı Mimarisi

| Veritabanı | Teknoloji | Veri |
|------------|-----------|------|
| Ana | PostgreSQL | Kullanıcılar, sorular, flash kartlar, sınavlar |
| Cache | Redis | Session, sık kullanılan setler, sıralama |
| Arama | Elasticsearch | Soru arama, içerik keşfi |
| Analitik | ClickHouse | Kullanım logları, metrikler |
| Dosyalar | AWS S3 | PDF, ses, görsel |
| Sosyal Graf | Neo4j | Arkadaşlık, öneri |
| Gerçek Zamanlı | Firebase RTDB | Canlı yarışma, sanal odalar |

---

## BÖLÜM 17: MONETİZASYON STRATEJİSİ

### 17.1 Fiyatlandırma Katmanları

| Plan | Aylık | Yıllık | Hedef Kitle |
|------|-------|--------|-------------|
| Ücretsiz | ₺0 | ₺0 | Freemium kapısı |
| Starter | ₺49 | ₺399 | Lise öğrencileri |
| Premium | ₺99 | ₺799 | Yoğun hazırlık |
| Premium+ | ₺149 | ₺1.199 | AI koç + tüm özellikler |
| Kurumsal | Teklif | Teklif | Okullar, dershaneler |

### 17.2 Özellik Matrisi

| Özellik | Ücretsiz | Starter | Premium | Premium+ |
|---------|----------|---------|---------|----------|
| Günlük soru çözme | 5 soru | 50 soru | Sınırsız | Sınırsız |
| AI çözüm kalitesi | Temel | Standart | Gelişmiş | Sokratik koç |
| Flash kart | 50 kart | 500 kart | Sınırsız | Sınırsız |
| Deneme sınavı | 1/ay | 5/ay | Sınırsız | Sınırsız |
| AI planlama | Temel plan | Haftalık | Tam AI | Tam AI |
| Boşluk doldurma | Hayır | Evet | Evet | Evet |
| Sunum üretimi | Hayır | Hayır | 3/ay | Sınırsız |
| AI koçluk botu | Hayır | Hayır | Hayır | 30 mesaj/gün |
| Offline içerik | Hayır | 1 GB | 5 GB | 20 GB |
| Reklam | Var | Yok | Yok | Yok |

---

## BÖLÜM 18: KVKK VE ETİK UYUM

### 18.1 Kişisel Verilerin Korunması

| Gereksinim | Uygulama |
|------------|----------|
| Açık rıza | Onboarding'de net KVKK checkbox |
| Veri minimizasyonu | Sadece gerekli veriler |
| Veri silme hakkı | Profil → Hesabımı Sil → 30 gün içinde |
| Veri taşınabilirliği | JSON/CSV dışa aktarma |
| Şeffaflık | Hangi veri, neden açıkça belirtilir |
| Çocuk güvenliği | 13 yaş altı ebeveyn onayı |
| Veri yerelleştirme | Türkiye: Hetzner TR / AWS eu-central-1 |

### 18.2 Akademik Dürüstlük
- Sokratik mod varsayılan
- "Bu cevabı kullanmak öğrenmeni engeller" uyarıları
- Öğretmen/kurum için AI kısıtlama
- Sınav modunda AI kapatılır
- AI çıktı uyarısı banner'ı

### 18.3 AI Hallüsinasyon Yönetimi
- Matematik: Wolfram Alpha çapraz doğrulama
- Tarih: RAG (kaynak belge)
- Güven skoru gösterimi
- 👎 ile hatalı çözüm işaretleme
- Kritik içerik için özel uyarı banner'leri

---

## EK: GELİŞTİRME ROADMAP

| Faz | Süre | Özellikler | Hedef Kullanıcı |
|-----|------|------------|-----------------|
| **MVP (v0.1)** | 3 ay | Soru bankası, AI çözüm, Flash kart, Pomodoro, Basit plan, Deneme sınavı | 500 beta |
| **V1.0** | 3 ay | Tam AI planlama, Müfredat tespiti, Geri sayım, İstatistikler, Temel gamification | 10.000 |
| **V1.5** | 2 ay | Yarışmalar, Boşluk doldurma, Öğretmen modu, Sosyal özellikler | 50.000 |
| **V2.0** | 3 ay | AI özet/sunum, Koçluk botu, Gelişmiş analitik, Sanal odalar | 200.000 |
| **V3.0** | 4 ay | Biyometrik odak, AR/VR, Kurumsal platform, API marketplace | 1.000.000 |

---

*Bu mimari taslak, ZekaAkademi PDF rehberinin tüm bölümlerini referans alarak oluşturulmuştur ve geliştirme ekipleri, tasarımcılar, ürün yöneticileri ve yatırımcılar için referans kaynağıdır.*

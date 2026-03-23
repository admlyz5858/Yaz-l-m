# ZekaAkademi - MVP (v0.1) Kapsamı

**Süre:** 3 ay | **Hedef:** 500 beta kullanıcı

## MVP'de Yer Alan Modüller

| # | Modül | MVP Özellikleri | MVP'de Olmayan |
|---|-------|-----------------|----------------|
| 1 | AI Planlama | Basit plan (haftalık, sabit şablon), GPT-4o entegrasyonu | Tam adaptif plan, Reclaim.ai benzeri akıllı yeniden zamanlama |
| 2 | AI Soru Çözme | Kamera OCR, Metin girişi, Adım adım çözüm, Sokratik toggle | Sesli soru, El yazısı çizim |
| 3 | Soru Bankası | Arama, filtreleme, soru çözüm modu, anlık geri bildirim | Kullanıcı soru ekleme, topluluk onayı |
| 4 | AI Flash Kart | Manuel + PDF'den kart, FSRS algoritması, Standart ön-arka format | Cloze, Görsel oklüzyon, Sesli kart, YouTube/URL kaynak |
| 5 | Pomodoro | 25/5 dk, ders seçimi, arka plan sesi, mola ekranı | AI özelleştirme, Adaptif süre önerisi |
| 6 | Deneme Sınavı | TYT/LGS tam deneme, ÖSYM arşivi, zamanlayıcı, sonuç ekranı | Adaptif sınav, Hata tekrar sınavı, Detaylı analitik |
| 7 | Sınav Geri Sayım | YKS/LGS/KPSS widget, gün sayacı | Müfredat PDF tespiti, Takvim entegrasyonu |
| 8 | Müfredat Tespiti | Statik müfredat veritabanı, konu ağacı | Document AI ile PDF'den otomatik tespit |
| 9 | İstatistik | Temel dashboard (süre, soru sayısı, doğruluk) | Konu haritası, Tahminsel analitik, Haftalık rapor |

## MVP Onboarding (7 Ekran - Tümü)

- [x] Splash (2.5 sn)
- [x] Karşılama 3 sayfa
- [x] Kayıt (E-posta, Google, Misafir)
- [x] Profil Step 1
- [x] Sınav Seçimi Step 2
- [x] Seviye Tespiti Step 3 (10 soru)
- [x] Plan Oluşturma Step 4 (basit AI plan)

## MVP Teknik Stack (Minimum)

| Katman | MVP Teknolojisi |
|--------|-----------------|
| Mobile | Flutter (tek kod tabanı) veya React Native |
| Backend | Monolitik başlangıç (Node.js + Express) |
| DB | PostgreSQL + Redis |
| AI | OpenAI GPT-4o, Google Vision (OCR) |
| Auth | JWT + Firebase Auth (Google) |
| Storage | AWS S3 veya eşdeğeri |

## MVP'de Olmayan (V1.0+)

- Boşluk doldurma kartları
- Bilgi yarışması (1v1, grup)
- AI Özet/Sunum modülü
- Öğretmen modu / Sınıf
- Sosyal (arkadaş, gruplar, discover)
- Sanal çalışma odaları
- AI Koçluk botu
- Kurumsal plan
- Gelişmiş gamification (rozetler tam liste, turnuvalar)

## MVP Kalite Kriterleri

1. **Onboarding:** 3 dakika içinde Ana Panel'e ulaşılabilmeli
2. **Soru çözme:** Kamera ile soru %85+ başarıyla tanınmalı
3. **Flash kart:** FSRS 17 parametre ile çalışmalı
4. **Deneme:** 120 soruluk TYT denemesi kesintisiz tamamlanabilmeli
5. **Offline:** Temel içerik (indirilen desteler) offline erişilebilir olmalı
6. **KVKK:** Kayıt sırasında açık rıza alınmalı

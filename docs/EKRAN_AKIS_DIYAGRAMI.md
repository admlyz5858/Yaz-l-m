# ZekaAkademi - Ekran Akış Diyagramı

## Onboarding Flow (7 Ekran - Maks 3 Dakika)

```
[Splash 2.5sn] ──┬── Token Var ──────► [Ana Panel]
                └── Token Yok ──────► [Karşılama 1/3]
                                         │
                [Karşılama 2/3] ◄────────┤
                                         │
                [Karşılama 3/3] ◄────────┤
                         │
            ┌────────────┴────────────┐
            │                         │
     [Hemen Başla]              [Giriş Yap]
            │                         │
            ▼                         ▼
     [Kayıt Ekranı]            [Giriş Ekranı]
     - E-posta+Şifre                 │
     - Google OAuth                   │
     - Apple Sign-In                  │
     - Telefon OTP                    │
     - Misafir (3 deneme)             │
            │                         │
            └────────────┬────────────┘
                         ▼
              [Profil Step 1/4]
              Ad, Doğum Tarihi, Şehir
                         │
                         ▼
              [Sınav Seçimi Step 2/4]
              YKS/LGS/KPSS/ALES/DGS...
              Puan türü, Hedef net
                         │
                         ▼
              [Seviye Tespiti Step 3/4]
              10 soru, 60sn/soru, Adaptif
                         │
                         ▼
              [Plan Oluşturma Step 4/4]
              AI Plan (3sn animasyon)
                         │
                         ▼
                  [Ana Panel]
```

## Ana Navigasyon Yapısı

```
                    [Bottom Nav]
                         │
        ┌────────────────┼────────────────┬────────────────┐
        │                │                │                │
   [Ana Sayfa]      [Çalış]          [Sınav]       [İstatistik]  [Profil]
        │                │                │                │
        ▼                ▼                ▼                ▼
   Dashboard         Soru Çözme      Deneme         Performans    Ayarlar
   - Görevler        Flash Kart      Soru Bankası   - Grafikler   Abonelik
   - Geri Sayım      Pomodoro        Yarışma        - Rozetler    Hedefler
   - Quick Actions   Odak Odaları                   - Raporlar
```

## Modül Bazlı Ekran Hierarşisi (60+ Ekran)

### 1. Giriş ve Onboarding (7 ekran)
- Splash, Karşılama x3, Kayıt/Giriş, Profil 1-4

### 2. Ana Panel (5 alt bölüm)
- Durum çubuğu, Geri sayım widget, Görevler, Quick Actions, Son aktivite

### 3. AI Planlama (4 ekran)
- Plan oluşturma, Haftalık/Günlük/Aylık görünüm, Plan analizi, Görev detay

### 4. Soru Çözme (6 ekran)
- Giriş seçimi (Kamera/Galeri/El/Metin/Ses), Çözüm ekranı, Soru bankası listesi, Filtre paneli, Çözüm modu, Soru ekleme (6 adım)

### 5. Flash Kart (5 ekran)
- Deste listesi, Çalışma ekranı, Kart üretim (PDF/URL/Ses/Video), Deste yönetimi, Paylaşım

### 6. Pomodoro ve Odak (4 ekran)
- Zamanlayıcı, Mola ekranı, App Blocker ayarları, Sanal odalar listesi

### 7. Deneme Sınavı (5 ekran)
- Sınav seçimi, Başlatma bilgileri, Sınav ekranı, Sonuç, Detaylı analiz

### 8. Bilgi Yarışması (4 ekran)
- Format seçimi, Eşleşme/Lobi, Yarışma ekranı, Sonuç

### 9. Geri Sayım ve Takvim (3 ekran)
- Sınav listesi, Detay widget, Müfredat yükleme (Document AI)

### 10. İstatistik (4 ekran)
- Dashboard, Konu haritası, Hata analizi, Haftalık rapor

### 11. Sosyal (5 ekran)
- Arkadaş listesi, 1v1 davet, Sınıf/Grup, Discover feed, Paylaşım

### 12. Profil ve Ayarlar (6 ekran)
- Profil düzenleme, Abonelik, Rozetler, Liderlik, Destek, KVKK

---

**Toplam: 60+ benzersiz ekran**

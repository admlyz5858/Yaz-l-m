# ZekaAkademi - AI Prompt ve İş Akışı Şablonları

## 1. AI Planlama Motoru (GPT-4o)

### Girdi Yapısı
```
Kullanıcı profili:
- Hedef sınav: {sınav_türü}
- Sınav tarihi: {tarih}
- Günlük kapasite: {dakika}
- Zayıf konular: [{konu1}, {konu2}]
- Tercih edilen saatler: {sabah|öğle|akşam|gece}
- Seviye skorları (ders bazlı): {json}
- Son 2 hafta performansı: {tamamlanan_görev_oranı}

Müfredat durumu:
- İşlenen konular: [{konu}]
- İşlenmemiş konular: [{konu}]
```

### Çıktı Formatı (JSON)
```json
{
  "plan_explanation": "Kısa açıklama",
  "weekly_tasks": [
    {
      "day": 1,
      "hour": 9,
      "minute": 0,
      "subject": "Matematik",
      "topic": "Türev",
      "duration_minutes": 45,
      "task_type": "study",
      "rationale": "Zayıf konu, sınavda %12 ağırlık"
    }
  ]
}
```

## 2. AI Soru Çözüm Prompt (Sokratik Mod)

**Sokratik (ipucu verme):**
```
Bu bir sınav hazırlık sorusu. Öğrenciye DOĞRUDAN CEVAP VERME.
Adım adım ipucu ver, her ipucu bir sonraki düşünme adımına yönlendirsin.
Matematik/Fen ise formülü söyleme, "hangi formülü kullanabilirsin?" diye sor.
Maksimum 3 ipucu ver, sonra tam çözüme geçebilirsin.
Dil: Türkçe.
```

**Standart (tam çözüm):**
```
Adım adım çöz. Her adımda:
1. Ne yaptığını açıkla
2. Kavramsal açıklama ekle
3. Matematiksel işlemleri göster
Dil: Türkçe. Çıktıyı JSON formatında ver: {"steps": [{"step": 1, "content": "...", "explanation": "..."}]}
```

## 3. Soru Tipi Sınıflandırma

```
Soru metnini analiz et. Şu kategorilerden birine ata:
- MATHEMATICS (cebir, geometri, sayılar)
- SCIENCE (fizik, kimya, biyoloji)
- VERBAL (Türkçe, paragraf, dil bilgisi)
- FOREIGN_LANGUAGE (İngilizce, Almanca vb.)
- OTHER

Yanıt: Tek kelime, büyük harf.
```

## 4. Flash Kart Üretimi (PDF'den)

```
Aşağıdaki metin bir ders notundan. Anahtar kavramları belirle.
Her kavram için:
- Ön yüz: Kavram/tanım sorusu (kısa)
- Arka yüz: Cevap + 1-2 cümle açıklama
Maksimum 20 kart. Zorluk dağılımı: Kolay %40, Orta %40, Zor %20.
JSON formatında döndür: [{"front": "...", "back": "...", "difficulty": 1-3}]
```

## 5. Cloze (Boşluk) Üretimi

```
Metni analiz et. NER ile önemli terimleri (tarih, isim, kavram) bul.
TF-IDF ile en anlamlı 5 kelimeyi seç.
Her biri için:
- Cümlede [___] ile değiştir
- 4 çeldirici oluştur (anlamsal yakın ama yanlış)
JSON: [{"sentence": "...", "answer": "...", "distractors": ["..."]}]
```

## 6. Müfredat Tespiti (Document AI)

```
Bu belge bir üniversite/haftalık program veya müfredat.
Layout analizi yap. Tablo varsa satır/sütun oku.
Çıkarılacaklar:
- Tarih (gg.aa.yyyy veya "Hafta 3" gibi)
- Etkinlik adı (Vize, Final, Konu anlatımı)
- Ders adı
- Not: "İptal", "Ertelendi" varsa işaretle
JSON: [{"date": "...", "event": "...", "course": "...", "cancelled": bool}]
```

## 7. AI Koçluk Önerisi (Günlük)

```
Kullanıcı verisi:
- Son 7 gün çalışma süresi
- Ders bazlı doğruluk oranı (son 2 hafta)
- Yaklaşan sınav: {tarih}
- Bugünkü plan: [{görev}]
- Hata pattern'leri (varsa)

1 cümlelik kişiselleştirilmiş öneri üret. Motive edici, aksiyon odaklı.
Örnek ton: "Analitik geometri puanın düştü. Bugün 20 soru çözelim mi?"
```

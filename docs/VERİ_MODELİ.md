# ZekaAkademi - Veri Modeli ve API Spesifikasyonları

## Temel Entity İlişkileri

```
User ─┬─► UserProfile (1:1)
      ├─► ExamTarget (1:N) ──► Sınav türü, tarih, hedef
      ├─► StudyPlan (1:N) ──► AI oluşturulmuş planlar
      ├─► FlashcardDeck (1:N) ──► Kullanıcı desteleri
      ├─► QuestionAttempt (1:N) ──► Soru çözüm geçmişi
      ├─► ExamSession (1:N) ──► Deneme sınavları
      ├─► PomodoroSession (1:N)
      ├─► Friendship (N:N)
      └─► Subscription (1:1)

Question ─┬─► QuestionMetadata (sınav_türü, ders, konu, zorluk...)
          ├─► Solution (adım adım)
          └─► RelatedQuestions (benzer sorular)

Curriculum ─┬─► Subject ─► Topic ─► SubTopic ─► LearningObjective
            └─► ExamMapping (hangi sınavda hangi konu)
```

## Soru Bankası Veri Şeması (question)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | UUID | ✓ | question_id |
| sınav_türü | Enum | ✓ | YKS_TYT, YKS_AYT, LGS, KPSS_GY, ALES, DGS |
| ders | String | ✓ | Matematik, Türkçe, vb. |
| konu | String | ✓ | Olasılık |
| alt_konu | String | | Koşullu Olasılık |
| müfredat_yılı | Integer | ✓ | 2025 |
| zorluk | 1-5 | ✓ | |
| soru_tipi | Enum | ✓ | MCQ, Açık uçlu, Boşluk |
| kaynak | String | | ÖSYM 2023, Özgün |
| içerik | JSON/Text | ✓ | Soru metni, şıklar |
| çözüm | JSON | | Adım adım çözüm |
| görsel_url | String | | Soru görseli |
| çözüm_süresi_ort | Integer | | Saniye |
| doğru_cevap_oranı | Float | | 0-1 |
| created_at | Timestamp | ✓ | |
| moderation_status | Enum | | pending, approved, rejected |

## FSRS Kart Metrikleri (flashcard)

| Alan | Tip | Açıklama |
|------|-----|----------|
| difficulty | Float | Kart zorluğu |
| stability | Float | Hatırlama kararlılığı |
| retrievability | Float | Geri çağırılabilirlik |
| last_review | Timestamp | Son tekrar |
| next_review | Timestamp | Sonraki tekrar (FSRS hesaplanan) |
| state | Enum | new, learning, review, relearning |

## AI Planlama Veri Yapısı (JSON Output)

```json
{
  "plan_id": "uuid",
  "user_id": "uuid",
  "week_start": "2025-03-24",
  "tasks": [
    {
      "task_id": "uuid",
      "subject": "Matematik",
      "topic": "Türev",
      "duration_minutes": 45,
      "task_type": "study|questions|flashcard|exam",
      "day_of_week": 1,
      "start_hour": 9,
      "start_minute": 0,
      "priority": 1
    }
  ],
  "weights_used": {
    "level_test": 0.25,
    "performance": 0.30,
    "curriculum": 0.25,
    "calendar": 0.20
  }
}
```

## API Endpoint Grupları

### Auth Service
- `POST /auth/register` - Kayıt (e-posta, OAuth, OTP)
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/otp/verify`
- `DELETE /auth/account` - KVKK veri silme

### AI Gateway
- `POST /ai/solve-question` - Soru çözüm (multimodal input)
- `POST /ai/generate-plan` - Plan oluşturma
- `POST /ai/summarize` - Belge özetleme
- `POST /ai/generate-presentation`
- `POST /ai/extract-flashcards` - İçerikten kart üretimi
- `POST /ai/parse-curriculum` - Document AI müfredat tespiti

### Question Service
- `GET /questions` - Filtreleme, arama, sayfalama
- `GET /questions/:id`
- `POST /questions` - Kullanıcı soru ekleme
- `GET /questions/similar/:id` - Benzer 5 soru
- `POST /questions/:id/vote` - 👍/👎 kalite oylama

### Flashcard Service
- `GET /decks` - Kullanıcı desteleri
- `POST /decks` - Yeni deste
- `GET /decks/:id/cards/due` - FSRS due kartlar
- `POST /decks/:id/review` - Tekrar sonucu (1-5)
- `POST /decks/from-content` - AI ile deste üretimi

### Exam Service
- `GET /exams/available` - Sınav türleri
- `POST /exams/start` - Sınav başlat
- `GET /exams/session/:id` - Aktif sınav
- `POST /exams/session/:id/answer` - Cevap gönder
- `POST /exams/session/:id/finish` - Sınav bitir
- `GET /exams/session/:id/analysis` - Detaylı analiz

### Planning Service
- `GET /plans/current`
- `POST /plans/generate` - AI plan
- `PUT /plans/:id/tasks/:taskId` - Sürükle-bırak güncelleme
- `POST /plans/:id/reschedule` - Akıllı yeniden zamanlama

### Analytics Service
- `GET /analytics/dashboard` - Genel metrikler
- `GET /analytics/topic-map` - Konu yeterlilik haritası
- `GET /analytics/weekly-report`
- `GET /analytics/prediction` - Tahmin edilen net

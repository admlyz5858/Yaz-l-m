# ZekaAkademi - Uygulama Mimarisi Taslağı

Bu depo, **ZekaAkademi** (Yapay Zeka Destekli Akıllı Eğitim Platformu) belgesine tam uyumlu uygulama mimarisi taslağını içerir.

## Hedef

LGS • YKS • KPSS • ALES • DGS • ÖSYM sınavlarına yönelik, 15+ modül, 60+ ekran, 100+ özellik içeren kapsamlı mobil eğitim platformu.

## Uygulama (zeka_akademi/)

`zeka_akademi/` klasöründe **Expo (React Native)** ile geliştirilen mobil uygulama bulunur.

**Çalıştırma:** `cd zeka_akademi && npm start` (veya `npm run web`)

### APK indirme (GitHub Actions)

Her push/PR sonrası otomatik APK derlenir:

1. GitHub repo → **Actions** sekmesi → en son **Build Android APK** workflow'u
2. Yeşil tikten sonra sayfanın altındaki **Artifacts** bölümünden **zeka-akademi-apk** indir
3. İndirilen ZIP içindeki `app-debug.apk` dosyasını Android cihaza yükleyip kurun

### Tamamlanan modüller
- ✅ **Modül 1:** Splash (2.5 sn) + Karşılama (3 sayfa)
- ✅ **Modül 2:** Kayıt/Giriş (E-posta, KVKK, Google/Apple/Telefon, Misafir)
- ✅ **Modül 3:** Profil Step 1, Sınav Seçimi Step 2, Seviye Tespiti Step 3, Plan Oluşturma Step 4
- ✅ **Modül 4:** Ana panel (Dashboard), 5 sekmeli Bottom Navigation
- ⏳ **Sıradaki:** AI Planlama, Soru Çözme, Flash Kart, Pomodoro, Deneme Sınavı

## Mimari Dokümanlar

| Dosya | İçerik |
|-------|--------|
| [ZEKAAKADEMI_UYGULAMA_MIMARISI.md](./ZEKAAKADEMI_UYGULAMA_MIMARISI.md) | Ana mimari taslak — 18 bölüm, tüm modül detayları |
| [docs/EKRAN_AKIS_DIYAGRAMI.md](./docs/EKRAN_AKIS_DIYAGRAMI.md) | Onboarding ve navigasyon akış diyagramları |
| [docs/VERİ_MODELİ.md](./docs/VERİ_MODELİ.md) | Veri şeması, entity ilişkileri, API endpoint grupları |
| [docs/MVP_KAPSAMI.md](./docs/MVP_KAPSAMI.md) | MVP (v0.1) kapsamı — 3 ay, 500 beta kullanıcı |
| [docs/AI_PROMPT_ŞABLONLARI.md](./docs/AI_PROMPT_ŞABLONLARI.md) | GPT-4o, Document AI vb. prompt şablonları |

## Öne Çıkan Özellikler

- **AI Destekli Planlama** — GPT-4o + müfredat analizi
- **AI Soru Çözme** — OCR + LLM + Sokratik mod
- **FSRS Flash Kart** — Anki'den %20-30 daha az tekrar
- **Zamanlanmış Denemeler** — TYT, AYT, LGS, KPSS vb.
- **Pomodoro + Sanal Odalar** — Yeolpumta tarzı odaklanma
- **KVKK Uyumlu** — Veri yerelleştirme, açık rıza, silme hakkı

## Geliştirme Roadmap

- **MVP (3 ay):** Soru bankası, AI çözüm, Flash kart, Pomodoro, Deneme
- **V1.0 (3 ay):** Tam AI plan, müfredat tespiti, geri sayım, gamification
- **V1.5 (2 ay):** Yarışmalar, boşluk doldurma, öğretmen modu, sosyal
- **V2.0+:** AI özet/sunum, koçluk botu, sanal odalar, kurumsal

---
*Bu taslak, ZekaAkademi PDF rehberinin her detayına uyumlu olacak şekilde hazırlanmıştır.*

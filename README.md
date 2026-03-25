# ZekaAkademi - Uygulama Mimarisi Taslağı

Bu depo, **ZekaAkademi** (Yapay Zeka Destekli Akıllı Eğitim Platformu) belgesine tam uyumlu uygulama mimarisi taslağını içerir.

## Hedef

LGS • YKS • KPSS • ALES • DGS • ÖSYM sınavlarına yönelik, 15+ modül, 60+ ekran, 100+ özellik içeren kapsamlı mobil eğitim platformu.

## Mobil uygulama: LadeK Academy (`zeka_akademi/`)

`zeka_akademi/` içinde **LadeK Academy** markasıyla Expo (React Native) uygulaması bulunur (lacivert–elektrik mavisi tema, `com.ladekacademy.app`).

**Çalıştırma:** `cd zeka_akademi && npm start` (veya `npm run web`)

**Özel ikon görselleri:** Tasarım PNG’lerini `zeka_akademi/assets/icon.png`, `splash-icon.png` ve Android adaptive görsellerine koyup `npx expo prebuild` ile yeniden üretin.

### APK indirme (GitHub Actions)

Her push/PR sonrası otomatik APK derlenir:

1. GitHub repo → **Actions** sekmesi → en son **Build Android APK** workflow'u
2. Yeşil tikten sonra sayfanın altındaki **Artifacts** bölümünden **zeka-akademi-apk** indir
3. İndirilen ZIP içindeki `app-release.apk` dosyasını Android cihaza yükleyip kurun (JS paketi gömülü, Metro gerekmez)

### Tamamlanan modüller
- ✅ **Modül 1:** Splash + Karşılama (LadeK markası)
- ✅ **Modül 2:** Kayıt/Giriş akışı (placeholder)
- ✅ **Modül 3:** Onboarding (Profil, Sınav seçimi, Seviye testi, Plan oluşturma)
- ✅ **Modül 4:** Ana panel (Dashboard) + alt sekmeler (Ana / Çalış / Sınav)
- ✅ **Modül 5:** AI Plan (görüntüleme ve analiz ekranları)
- ✅ **Modül 6:** Soru bankası + AI çözüm + soru çözme (Türkçe örnek set)
- ✅ **Modül 7:** Flash kart + Pomodoro
- ✅ **Modül 8:** Deneme sınavı (TYT/LGS mini, süre, sonuç özeti)
- ⏳ **Sıradaki:** Sınav geri sayım, istatistik, mağaza ikonları

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

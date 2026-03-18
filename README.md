# CodeFlow - Android Kod Editörü / IDE

> VSCode ve Cursor benzeri, AI destekli, profesyonel bir Android kod editörü.

## Proje Hakkında

CodeFlow, Android platformu için geliştirilen, modern ve AI destekli bir kod editörü/IDE projesidir. VSCode'un güçlü düzenleme yeteneklerini ve Cursor'un AI özelliklerini mobil platforma taşımayı hedeflemektedir.

## Hedef Özellikler

- Yüksek performanslı kod editörü (60+ dil desteği)
- AI destekli kod tamamlama ve sohbet (OpenAI, Claude, Gemini)
- Git entegrasyonu ve görsel diff araçları
- Dahili terminal emülatörü
- LSP tabanlı akıllı dil desteği (IntelliSense)
- Eklenti/uzantı sistemi
- Uzaktan geliştirme (SSH, Container)
- Mobil'e özel optimizasyonlar (dokunmatik klavye, pil yönetimi)
- Tema ve kişiselleştirme

## Dokümantasyon

- [Kapsamlı Özellik Listesi](FEATURES.md) - Tüm planlanan özelliklerin detaylı açıklamaları

## Teknoloji Yığını (Planlanan)

| Katman | Teknoloji |
|--------|-----------|
| UI | Jetpack Compose + Material 3 |
| Editör | Sora Editor / Monaco Editor |
| Sözdizimi | KotlinTextMate + KTreeSitter |
| AI | OpenAI / Claude / Gemini API |
| Git | JGit |
| DI | Hilt |
| Async | Kotlin Coroutines + Flow |

## Geliştirme Fazları

1. **Faz 1** - MVP: Temel editör, sözdizimi vurgulama, dosya gezgini
2. **Faz 2** - Gelişmiş Editör: Kod katlama, çoklu imleç, arama
3. **Faz 3** - AI Entegrasyonu: Chat, kod tamamlama, inline edit
4. **Faz 4** - Terminal ve Git: Dahili terminal, Git işlemleri
5. **Faz 5** - Dil Desteği: LSP, IntelliSense, diagnostics
6. **Faz 6** - Eklenti Sistemi: Plugin API, marketplace
7. **Faz 7** - İleri Seviye: SSH, debug, collaboration

## Lisans

Bu proje geliştirme aşamasındadır.

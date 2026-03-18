# CodeFlow - Android Kod Editörü / IDE

> VSCode ve Cursor benzeri, AI destekli, profesyonel bir Android kod editörü.

## Proje Hakkında

CodeFlow, Android platformu için geliştirilen, modern ve AI destekli bir kod editörü/IDE projesidir. VSCode'un güçlü düzenleme yeteneklerini ve Cursor'un AI özelliklerini mobil platforma taşımayı hedeflemektedir.

## Mevcut Durum: Faz 1 - MVP

### Tamamlanan Özellikler
- Proje mimarisi (MVVM + Clean Architecture + Hilt DI)
- Sora Editor ile yüksek performanslı kod editörü
- Dosya gezgini (ağaç yapısı, uzun basma ile bağlam menüsü)
- Çoklu sekme sistemi (açma, kapama, geçiş)
- Mobil sembol araç çubuğu (27 programlama sembolü)
- Koyu/Açık tema desteği (VSCode Dark+/Light+ renkleri)
- Durum çubuğu (satır sayısı, encoding, dil, kaydetme durumu)
- Dosya CRUD: Oluşturma, silme, yeniden adlandırma
- Otomatik kaydetme sistemi
- SAF (Storage Access Framework) ile klasör açma
- 60+ programlama dili algılama
- Ayar kalıcılığı (DataStore)

## Proje Yapısı

```
app/src/main/java/com/codeflow/editor/
├── CodeFlowApp.kt                    # Hilt Application
├── data/
│   ├── model/
│   │   ├── AppSettings.kt            # Uygulama ayarları
│   │   ├── EditorTab.kt              # Sekme + dil algılama
│   │   └── FileNode.kt               # Dosya ağacı modeli
│   └── repository/
│       ├── FileRepository.kt         # Dosya I/O işlemleri
│       └── SettingsRepository.kt     # DataStore ayar yönetimi
├── di/
│   └── AppModule.kt                  # Hilt DI modülü
└── ui/
    ├── components/
    │   ├── Dialogs.kt                # Dosya dialog'ları
    │   ├── EditorTabBar.kt           # Sekme çubuğu
    │   ├── StatusBar.kt              # Durum çubuğu
    │   └── SymbolToolbar.kt          # Sembol araç çubuğu
    ├── editor/
    │   └── CodeEditorView.kt         # Sora Editor Compose wrapper
    ├── explorer/
    │   └── FileExplorerPanel.kt      # Dosya gezgini
    ├── main/
    │   ├── MainActivity.kt           # Ana Activity
    │   ├── MainScreen.kt             # Ana Compose ekranı
    │   └── MainViewModel.kt          # Durum yönetimi
    └── theme/
        ├── Color.kt                  # VSCode renk paleti
        ├── Theme.kt                  # Material 3 tema
        └── Type.kt                   # Tipografi
```

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| UI | Jetpack Compose + Material 3 | BOM 2024.12.01 |
| Editör | Sora Editor | 0.23.6 |
| Sözdizimi | TextMate gramerleri | - |
| DI | Hilt | 2.53.1 |
| Async | Kotlin Coroutines + Flow | 1.9.0 |
| Storage | DataStore Preferences | 1.1.1 |
| Min SDK | Android 8.0 | API 26 |
| Target SDK | Android 15 | API 35 |

## Dokümantasyon

- [Kapsamlı Özellik Listesi](FEATURES.md) - 21 kategoride 200+ özellik

## Geliştirme Fazları

1. **Faz 1** - MVP *(Aktif)* : Temel editör, dosya gezgini, tema, sembol çubuğu
2. **Faz 2** - Gelişmiş Editör: Kod katlama, çoklu imleç, arama
3. **Faz 3** - AI Entegrasyonu: Chat, kod tamamlama, inline edit
4. **Faz 4** - Terminal ve Git: Dahili terminal, Git işlemleri
5. **Faz 5** - Dil Desteği: LSP, IntelliSense, diagnostics
6. **Faz 6** - Eklenti Sistemi: Plugin API, marketplace
7. **Faz 7** - İleri Seviye: SSH, debug, collaboration

## Derleme

```bash
# Android Studio'da açın veya:
./gradlew assembleDebug
```

## Gereksinimler

- Android Studio Ladybug veya üzeri
- JDK 17
- Android SDK 35

## Lisans

Bu proje geliştirme aşamasındadır.

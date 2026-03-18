# CodeFlow - Android Kod Editörü / IDE

> VSCode ve Cursor benzeri, AI destekli, profesyonel bir Android kod editörü.

## Proje Hakkında

CodeFlow, Android platformu için geliştirilen, modern ve AI destekli bir kod editörü/IDE projesidir. VSCode'un güçlü düzenleme yeteneklerini ve Cursor'un AI özelliklerini mobil platforma taşımayı hedeflemektedir.

## Mevcut Durum: Faz 4 - Terminal ve Git

### Faz 1 - MVP (Tamamlandı)
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

### Faz 2 - Gelişmiş Editör (Tamamlandı)
- Bul ve Değiştir (büyük/küçük harf, tam kelime, regex, toplu değiştirme)
- Proje geneli dosyalarda arama (debounce, gruplu sonuçlar, vurgulama)
- Komut Paleti (16 yerleşik komut, fuzzy search)
- Hızlı Dosya Açma (fuzzy match, 5000 dosya indeksleme)
- Satıra Gitme (Go to Line)
- Snippet sistemi (JS/TS/Python/Java/Kotlin/HTML/CSS - 75+ snippet)
- Ayarlar ekranı (tema, font slider, tab boyutu, word wrap, auto-save)
- Geri/İleri navigasyon geçmişi

### Faz 3 - AI Entegrasyonu (Tamamlandı)
- AI Chat paneli (sağ kenar paneli, Markdown/kod blok desteği)
- 4 AI sağlayıcı: OpenAI (GPT-4o, 4o-mini, 3.5), Anthropic (Claude Sonnet 4, Haiku), Google Gemini (2.0 Flash, 1.5 Flash), Yerel Ollama
- Satır içi AI düzenleme (Inline Edit + kabul/reddet diff önizleme)
- Dosya/dil/seçili kod bağlamı ile sohbet
- Hızlı AI eylemleri: Kodu açıkla, hataları düzelt, test yaz, dokümantasyon, optimize et
- AI Ayarları ekranı (sağlayıcı, model, API key, sıcaklık slider)
- Token kullanım takibi
- Güvenli API key saklama (Android DataStore)

### Faz 4 - Terminal ve Git (Tamamlandı)
- Dahili terminal emülatörü (sh komut çalıştırma, cd/pwd/clear yerleşik)
- ANSI renk kodu temizleme, 5000 satır tampon, komut geçmişi
- Git paneli (branch, ahead/behind, stage/unstage/discard, commit, pull, push)
- Satır bazlı diff görüntüleyici (yeşil=eklenen, kırmızı=silinen, satır numaraları)
- Branch yönetimi (checkout, yeni branch oluşturma)
- Git log (commit geçmişi, yazar, tarih)

## Proje Yapısı

```
app/src/main/java/com/codeflow/editor/
├── CodeFlowApp.kt                    # Hilt Application
├── data/
│   ├── model/
│   │   ├── AppSettings.kt            # Uygulama ayarları
│   │   ├── EditorTab.kt              # Sekme + dil algılama
│   │   ├── FileNode.kt               # Dosya ağacı modeli
│   │   └── Snippet.kt                # Snippet veri modeli + 75+ yerleşik snippet
│   ├── ai/
│   │   ├── AIModels.kt               # AI veri modelleri ve yapılandırma
│   │   ├── AIApiClient.kt            # OpenAI/Claude/Gemini/Ollama API istemcisi
│   │   └── AIRepository.kt           # AI durum yönetimi ve mesajlaşma
│   ├── git/
│   │   ├── GitModels.kt              # Git veri modelleri (status, branch, diff)
│   │   └── GitRepository.kt          # Git CLI komut çalıştırma
│   ├── terminal/
│   │   └── TerminalSession.kt        # Terminal oturum yönetimi
│   └── repository/
│       ├── FileRepository.kt         # Dosya I/O + proje arama
│       └── SettingsRepository.kt     # DataStore ayar yönetimi
├── di/
│   └── AppModule.kt                  # Hilt DI modülü
└── ui/
    ├── components/
    │   ├── CommandPalette.kt          # VSCode benzeri komut paleti
    │   ├── Dialogs.kt                # Dosya dialog'ları
    │   ├── EditorTabBar.kt           # Sekme çubuğu
    │   ├── FindReplaceBar.kt         # Bul ve Değiştir çubuğu
    │   ├── GoToLineDialog.kt         # Satıra gitme dialog'u
    │   ├── QuickOpenDialog.kt        # Hızlı dosya açma (fuzzy search)
    │   ├── SearchFilesPanel.kt       # Proje geneli arama paneli
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
    ├── ai/
    │   ├── AIChatPanel.kt            # AI sohbet paneli + Markdown renderer
    │   ├── AIChatViewModel.kt        # AI durum yönetimi
    │   ├── AISettingsSheet.kt        # AI ayarları ekranı
    │   └── InlineEditDialog.kt       # Satır içi AI düzenleme dialogu
    ├── git/
    │   ├── GitPanel.kt               # Git kaynak kontrol paneli
    │   ├── GitViewModel.kt           # Git durum yönetimi
    │   └── DiffView.kt               # Diff görüntüleyici
    ├── terminal/
    │   ├── TerminalPanel.kt          # Terminal arayüzü
    │   └── TerminalViewModel.kt      # Terminal oturum yönetimi
    ├── settings/
    │   └── SettingsScreen.kt         # Ayarlar ekranı
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

1. **Faz 1** - MVP *(Tamamlandı)* : Temel editör, dosya gezgini, tema, sembol çubuğu
2. **Faz 2** - Gelişmiş Editör *(Tamamlandı)*: Bul/Değiştir, Komut Paleti, Arama, Snippet, Ayarlar
3. **Faz 3** - AI Entegrasyonu *(Tamamlandı)*: Chat, Inline Edit, OpenAI/Claude/Gemini/Ollama
4. **Faz 4** - Terminal ve Git *(Tamamlandı)*: Terminal emülatörü, Git panel, Diff görüntüleyici
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

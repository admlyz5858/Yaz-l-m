# Android Kod Editörü / IDE - Kapsamlı Özellik Listesi

> VSCode ve Cursor benzeri, AI destekli, profesyonel bir Android kod editörü için gerekli tüm özellikler.

---

## İÇİNDEKİLER

1. [Çekirdek Editör Motoru](#1-çekirdek-editör-motoru)
2. [Kullanıcı Arayüzü (UI/UX)](#2-kullanıcı-arayüzü-uiux)
3. [Dosya Sistemi ve Proje Yönetimi](#3-dosya-sistemi-ve-proje-yönetimi)
4. [Sözdizimi Vurgulama ve Dil Desteği](#4-sözdizimi-vurgulama-ve-dil-desteği)
5. [Akıllı Kod Tamamlama (IntelliSense)](#5-akıllı-kod-tamamlama-intellisense)
6. [AI Entegrasyonu (Cursor Benzeri)](#6-ai-entegrasyonu-cursor-benzeri)
7. [Terminal Entegrasyonu](#7-terminal-entegrasyonu)
8. [Git ve Versiyon Kontrolü](#8-git-ve-versiyon-kontrolü)
9. [Hata Ayıklama (Debugger)](#9-hata-ayıklama-debugger)
10. [Arama ve Navigasyon](#10-arama-ve-navigasyon)
11. [Eklenti / Uzantı Sistemi](#11-eklenti--uzantı-sistemi)
12. [Uzaktan Geliştirme (Remote Development)](#12-uzaktan-geliştirme-remote-development)
13. [İşbirliği (Collaboration)](#13-işbirliği-collaboration)
14. [Mobil'e Özel Optimizasyonlar](#14-mobile-özel-optimizasyonlar)
15. [Güvenlik](#15-güvenlik)
16. [Performans ve Mimari](#16-performans-ve-mimari)
17. [Tema ve Kişiselleştirme](#17-tema-ve-kişiselleştirme)
18. [Desteklenecek Diller ve Çerçeveler](#18-desteklenecek-diller-ve-çerçeveler)
19. [Bulut Entegrasyonu](#19-bulut-entegrasyonu)
20. [Erişilebilirlik (Accessibility)](#20-erişilebilirlik-accessibility)
21. [Teknik Mimari Kararlar](#21-teknik-mimari-kararlar)

---

## 1. Çekirdek Editör Motoru

Uygulamanın kalbi olan metin düzenleme motoru, yüksek performanslı ve zengin özellikli olmalıdır.

### 1.1 Metin İşleme Altyapısı
- **Rope veya Piece Table veri yapısı**: Büyük dosyaları (100K+ satır) verimli şekilde işlemek için geleneksel string yerine rope/piece-table yapısı kullanılmalı
- **Satır bazlı sanal kaydırma (Virtual Scrolling)**: Tüm dosyayı render etmek yerine sadece görünür satırları render etme
- **Incremental parsing**: Dosya değişikliklerinde tüm dosyayı yeniden parse etmek yerine sadece değişen kısmı parse etme
- **UTF-8, UTF-16, UTF-32 desteği**: Farklı encoding formatlarını okuma/yazma
- **Büyük dosya desteği**: 1MB+ dosyaları kasma olmadan açabilme
- **Satır sonu formatları**: LF (Linux/Mac), CRLF (Windows), CR (eski Mac) desteği

### 1.2 Temel Düzenleme Özellikleri
- **Çoklu imleç (Multi-cursor)**: Aynı anda birden fazla noktada düzenleme
- **Çoklu seçim (Multi-selection)**: Birden fazla metin bloğu seçme
- **Blok seçimi (Column/Box selection)**: Dikey blok seçimi
- **Otomatik girinti (Auto-indentation)**: Dile göre akıllı girinti
- **Otomatik parantez kapatma**: `(`, `{`, `[`, `"`, `'` otomatik tamamlama
- **Parantez eşleştirme ve vurgulama**: Eşleşen parantezleri renklendirme
- **Parantez çifti renklendirme (Bracket pair colorization)**: İç içe parantezleri farklı renklerde gösterme
- **Satır numaraları**: Mutlak ve göreli satır numarası seçeneği
- **Kod katlama (Code folding)**: Fonksiyon, sınıf, blok bazında kod katlama
- **Minimap**: Dosyanın küçültülmüş genel görünümü (sağ kenarda)
- **Word wrap**: Uzun satırları otomatik sarma
- **Girinti kılavuz çizgileri (Indent guides)**: Girinti seviyelerini görsel çizgilerle gösterme
- **Boşluk/Tab gösterimi**: Görünmez karakterleri görselleştirme
- **Geri Al / Yinele (Undo/Redo)**: Sınırsız geri alma geçmişi
- **Sürükle-Bırak (Drag & Drop)**: Metin blokları sürükleyerek taşıma

### 1.3 Gelişmiş Düzenleme
- **Snippet desteği**: Kod parçacıkları şablonları ve tab-stop navigasyonu
- **Emmet desteği**: HTML/CSS için Emmet kısayolları
- **Çoklu clipboard**: Birden fazla panoya kopyalama
- **Satır taşıma (Move line up/down)**: Alt+Yukarı/Aşağı ile satır taşıma
- **Satır kopyalama (Duplicate line)**: Mevcut satırı çoğaltma
- **Satır silme**: Tüm satırı tek tuşla silme
- **Satır sıralama (Sort lines)**: Seçili satırları alfabetik sıralama
- **Büyük/küçük harf dönüştürme**: Seçili metni uppercase/lowercase/titlecase yapma
- **Yorum satırı toggle**: Tek tuşla yorum ekleme/kaldırma (satır ve blok)
- **Akıllı seçim genişletme**: Kelime → ifade → satır → blok → dosya şeklinde genişleyen seçim
- **Linked editing**: HTML etiketlerinde açılış/kapanış etiketini eş zamanlı düzenleme

---

## 2. Kullanıcı Arayüzü (UI/UX)

### 2.1 Ana Düzen (Layout)
- **Activity Bar**: Sol tarafta ana navigasyon çubuğu (Dosya Gezgini, Arama, Git, Debug, Eklentiler, AI)
- **Primary Sidebar**: Dosya gezgini, arama sonuçları ve diğer paneller
- **Secondary Sidebar**: Ek paneller (AI Chat vb.)
- **Editör Alanı**: Merkezdeki ana kod düzenleme alanı
- **Alt Panel**: Terminal, çıktı, sorunlar, debug konsolu
- **Durum Çubuğu (Status Bar)**: Satır/sütun, encoding, dil, git branch bilgisi
- **Breadcrumb navigasyonu**: Dosya yolu ve sembol hiyerarşisi gösterimi

### 2.2 Editör Yönetimi
- **Çoklu sekme (Tabs)**: Birden fazla dosyayı sekmelerde açma
- **Bölünmüş editör (Split Editor)**: Ekranı yatay/dikey bölme
- **Editör grupları**: Birden fazla editör grubu oluşturma
- **Tab önizleme (Preview mode)**: Tek tıkla geçici açma, çift tıkla kalıcı açma
- **Tab sıralaması**: Sürükleyerek sekme sıralaması
- **Sabitlenmiş sekmeler (Pinned tabs)**: Önemli dosyaları sabitleme
- **Tab geçmişi**: Son açılan dosyalar arasında gezinme

### 2.3 Mobil Uyumlu Arayüz Elemanları
- **Dokunmatik uyumlu kaydırma**: Parmakla akıcı kaydırma
- **Pinch-to-zoom**: İki parmakla yakınlaştırma/uzaklaştırma (yazı boyutu)
- **Uzun basma (Long press) menüleri**: Bağlam menüleri için uzun basma
- **Kaydırma (Swipe) hareketleri**: Panel açma/kapama için swipe
- **Floating Action Button (FAB)**: Hızlı eylemler için yüzen buton
- **Bottom Sheet menüleri**: Alt kısımdan kayan menüler
- **Alt navigasyon çubuğu**: Mobil'e özel kolay erişim çubuğu
- **Uyarlanabilir düzen (Adaptive Layout)**: Tablet/telefon ekranına göre otomatik düzen

### 2.4 Komut Paleti (Command Palette)
- **Hızlı komut erişimi**: Ctrl+Shift+P benzeri tüm komutlara erişim
- **Bulanık arama (Fuzzy search)**: Komutları yaklaşık eşleşmeyle bulma
- **Son kullanılan komutlar**: Sık kullanılan komutları üstte gösterme
- **Klavye kısayolu gösterimi**: Her komutun yanında kısayolunu gösterme

---

## 3. Dosya Sistemi ve Proje Yönetimi

### 3.1 Dosya Gezgini (File Explorer)
- **Ağaç yapısı görünümü**: Klasör/dosya hiyerarşisi
- **Dosya/klasör oluşturma, silme, yeniden adlandırma**
- **Sürükle-bırak ile taşıma**: Dosya/klasör sürükleyerek taşıma
- **Kopyala/Yapıştır/Kes**: Dosya işlemleri
- **Dosya filtreleme**: Glob pattern ile dosya filtreleme
- **Gizli dosyaları gösterme/gizleme**: `.gitignore` ve gizli dosya yönetimi
- **Dosya ikonu temaları**: Dosya uzantısına göre ikon
- **Çoklu kök klasör (Multi-root workspace)**: Birden fazla proje klasörü açma

### 3.2 Dosya İşlemleri
- **Otomatik kaydetme (Auto-save)**: Yapılandırılabilir otomatik kaydetme
- **Sıcak çıkış (Hot exit)**: Kaydedilmemiş değişiklikleri oturum arası koruma
- **Dosya izleme (File watching)**: Dışarıdan değişen dosyaları algılama
- **Encoding dönüşümü**: Dosya kodlamasını değiştirme
- **Son açılan dosyalar**: Geçmiş dosya listesi
- **Çalışma alanı (Workspace) desteği**: `.workspace` dosyaları ile proje yapılandırması
- **Dosya karşılaştırma (Diff)**: İki dosyayı yan yana karşılaştırma

### 3.3 Depolama
- **Dahili depolama**: Uygulama sandbox alanında dosya yönetimi
- **SAF (Storage Access Framework)**: Android dosya sistemi erişimi
- **SD Kart desteği**: Harici depolama alanı erişimi
- **IndexedDB / SQLite**: Proje meta verileri ve ayarları için veritabanı
- **Scoped Storage uyumluluğu**: Android 10+ depolama politikalarına uyum

---

## 4. Sözdizimi Vurgulama ve Dil Desteği

### 4.1 Sözdizimi Vurgulama Motorları
- **TextMate gramerleri**: VSCode ile uyumlu `.tmLanguage.json` desteği (600+ dil)
- **Tree-sitter entegrasyonu**: Incremental AST parsing ile doğru ve hızlı vurgulama
- **Semantik vurgulama (Semantic highlighting)**: LSP tabanlı gelişmiş renklendirme
- **KotlinTextMate**: Pure Kotlin TextMate grameri implementasyonu
- **KTreeSitter**: Kotlin native tree-sitter binding'leri

### 4.2 Dil Özellikleri
- **Otomatik dil algılama**: Dosya uzantısına veya içeriğine göre dil tespiti
- **Diller arası vurgulama**: HTML içinde CSS ve JS, Markdown içinde kod blokları
- **Özel dil tanımları**: Kullanıcı tanımlı dil gramerleri ekleme
- **Dil yapılandırması**: Dil bazında girinti, yorum stili, parantez tanımları

### 4.3 Desteklenecek Öncelikli Diller
| Öncelik | Diller |
|---------|--------|
| **Tier 1** | JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown |
| **Tier 2** | Java, Kotlin, C, C++, C#, Go, Rust, Swift, Dart |
| **Tier 3** | PHP, Ruby, SQL, Shell/Bash, YAML, XML, TOML |
| **Tier 4** | Lua, R, Scala, Haskell, Perl, Docker, Terraform |
| **Tier 5** | Assembly, VHDL, Prolog, ve diğer niş diller |

---

## 5. Akıllı Kod Tamamlama (IntelliSense)

### 5.1 Temel Otomatik Tamamlama
- **Kelime tabanlı tamamlama**: Dosyadaki mevcut kelimelere göre öneriler
- **Snippet tamamlama**: Kod parçacıkları önerileri
- **Dosya yolu tamamlama**: Import/require yolları için otomatik tamamlama
- **Emoji tamamlama**: Markdown ve yorum satırlarında emoji desteği

### 5.2 LSP (Language Server Protocol) Entegrasyonu
- **Evrensel LSP istemcisi**: Herhangi bir LSP sunucusuyla çalışabilme
- **Kod tamamlama (Completion)**: Bağlama duyarlı akıllı öneriler
- **Hover bilgisi**: Değişken/fonksiyon üzerinde tür ve dokümantasyon gösterimi
- **Tanıma gitme (Go to Definition)**: Fonksiyon/değişken tanımına atlama
- **Referansları bulma (Find References)**: Bir sembolün tüm kullanım noktalarını bulma
- **Sembol yeniden adlandırma (Rename Symbol)**: Proje genelinde güvenli yeniden adlandırma
- **Kod eylemleri (Code Actions)**: Hızlı düzeltme ve refactoring önerileri
- **Tanılama (Diagnostics)**: Gerçek zamanlı hata ve uyarı gösterimi
- **İmza yardımı (Signature Help)**: Fonksiyon parametreleri bilgisi
- **Sembol arama (Workspace Symbol)**: Proje genelinde sembol arama
- **Kod Lens (CodeLens)**: Satır üstü bilgi ve eylem gösterimi
- **Belge vurgulama (Document Highlight)**: Aynı sembolün diğer kullanımlarını vurgulama
- **Biçimlendirme (Formatting)**: Belge ve seçim biçimlendirme

### 5.3 LSP Sunucu Yönetimi
- **Yerel LSP sunucuları**: Cihazda çalışan hafif dil sunucuları
- **Uzak LSP sunucuları**: SSH/WebSocket üzerinden uzak sunuculara bağlanma
- **Sunucu otomatik başlatma/durdurma**: Dil dosyası açıldığında sunucuyu başlatma
- **Çoklu sunucu desteği**: Farklı diller için paralel sunucu çalıştırma

---

## 6. AI Entegrasyonu (Cursor Benzeri)

Bu bölüm uygulamayı sıradan bir editörden ayıracak en kritik özellik setidir.

### 6.1 AI Sohbet (Chat)
- **Proje bağlamında sohbet**: Tüm kod tabanını anlayan AI asistan
- **Seçili kod hakkında soru sorma**: Kod bloğu seçip "Bu ne yapıyor?" sorma
- **Hata açıklama**: Hata mesajlarını AI ile analiz ettirme
- **Kod üretimi**: Doğal dilde talimat vererek kod yazdırma
- **Çoklu model desteği**: OpenAI GPT, Anthropic Claude, Google Gemini, yerel modeller
- **Sohbet geçmişi**: Önceki konuşmaları saklama ve arama
- **Bağlam ekleme (@mentions)**: `@file`, `@folder`, `@symbol`, `@web`, `@docs` ile bağlam belirtme
- **Görsel girdi**: Ekran görüntüsü veya UI taslağı ile AI'dan kod isteme

### 6.2 Satır İçi Düzenleme (Inline Edit)
- **Ctrl+K benzeri satır içi prompt**: Seçili kod üzerinde doğrudan AI talimatı
- **Diff önizleme**: AI'ın önerdiği değişiklikleri diff olarak gösterme
- **Kabul/Reddet mekanizması**: Değişiklikleri tek tek veya toplu kabul/reddetme
- **Kısmi kabul**: Değişikliklerin sadece bir kısmını kabul etme

### 6.3 AI Kod Tamamlama (Tab Completion)
- **Çok satırlı tahmin**: AI ile birden fazla satır önerisi
- **Bağlam farkında tamamlama**: Mevcut dosya ve projedeki diğer dosyaları anlayan öneriler
- **Ghost text**: Önerileri gri renkte gösterme
- **Tab ile kabul**: Tek tuşla tüm öneriyi kabul etme
- **Kısmi kabul**: Kelime kelime veya satır satır kabul etme
- **Otomatik import**: Tamamlamada gerekli import ifadelerini otomatik ekleme

### 6.4 Agent Modu
- **Otonom görev yürütme**: "Bir login sayfası oluştur" gibi karmaşık talimatları bağımsız yürütme
- **Çoklu dosya düzenleme**: Birden fazla dosyada eş zamanlı değişiklik yapma
- **Terminal komutu çalıştırma**: Gerektiğinde paket kurma, build alma vb.
- **Hata düzeltme döngüsü**: Hata oluşursa otomatik tespit ve düzeltme
- **Plan oluşturma**: Görevi adımlara bölerek kullanıcıya plan sunma
- **Onay mekanizması**: Kritik işlemlerde kullanıcı onayı isteme

### 6.5 Diğer AI Özellikleri
- **Kod açıklama**: Karmaşık kodları Türkçe/İngilizce açıklama
- **Birim test üretimi**: Seçili fonksiyon için otomatik test yazma
- **Dokümantasyon üretimi**: JSDoc, docstring vb. otomatik oluşturma
- **Kod inceleme (AI Review)**: Pull request'leri AI ile inceleme
- **Hata tahminleme**: Potansiyel bug'ları AI ile tespit etme
- **Performans önerileri**: Kod optimizasyonu tavsiyeleri
- **Dil çevirisi**: Kodu bir dilden başka bir dile çevirme (Python → JavaScript vb.)
- **Commit mesajı üretimi**: Değişikliklere göre otomatik commit mesajı
- **README üretimi**: Proje için otomatik README.md oluşturma

### 6.6 AI Yapılandırma
- **API anahtarı yönetimi**: Farklı AI sağlayıcıları için API anahtarı saklama
- **Model seçimi**: Görev tipine göre model seçimi (hız vs kalite)
- **Bağlam penceresi ayarı**: AI'a gönderilen bağlam miktarını ayarlama
- **Özel sistem promptları**: Proje bazında AI davranışını özelleştirme (`.cursorrules` benzeri)
- **Gizlilik ayarları**: Hangi dosyaların AI'a gönderileceğini kontrol etme
- **Yerel model desteği**: Ollama, LM Studio vb. ile yerel model kullanımı
- **Maliyet takibi**: API kullanım ve maliyet izleme

---

## 7. Terminal Entegrasyonu

### 7.1 Dahili Terminal
- **Tam özellikli terminal emülatörü**: Bash, Zsh, sh desteği
- **Çoklu terminal oturumu**: Birden fazla terminal açma ve yönetme
- **Bölünmüş terminal**: Terminali yatay/dikey bölme
- **Terminal profilleri**: Önceden yapılandırılmış terminal profilleri
- **Otomatik dizin değiştirme**: Proje dizinine otomatik cd
- **Terminal geçmişi**: Komut geçmişi ve arama
- **ANSI renk desteği**: Renkli terminal çıktısı
- **Link algılama**: Terminal çıktısındaki URL'leri tıklanabilir yapma
- **Dosya yolu algılama**: Çıktıdaki dosya yollarını tıklayınca editörde açma

### 7.2 Termux Entegrasyonu
- **Termux:API bağlantısı**: Termux üzerinden tam Linux ortamı erişimi
- **Paket yönetimi**: `pkg install` ile araç kurma
- **Python, Node.js, Git**: Geliştirme araçları kurabilme
- **SSH istemcisi**: Uzak sunuculara SSH bağlantısı
- **Shell özelleştirme**: Oh My Zsh, starship vb. tema desteği

### 7.3 AI Terminal Yardımı
- **Doğal dilde komut üretimi**: "Bu klasördeki tüm .js dosyalarını listele" → `find . -name "*.js"`
- **Komut açıklama**: Karmaşık komutları açıklama
- **Hata çözümleme**: Terminal hatalarını AI ile analiz etme

---

## 8. Git ve Versiyon Kontrolü

### 8.1 Temel Git İşlemleri
- **Kaynak kontrol paneli**: Değişen dosyaları listeleme
- **Stage / Unstage**: Dosyaları hazırlama alanına ekleme/çıkarma
- **Commit**: Değişiklikleri taahhüt etme (mesaj ile)
- **Push / Pull**: Uzak depoya gönderme/alma
- **Fetch**: Uzak depo değişikliklerini kontrol etme
- **Branch yönetimi**: Dal oluşturma, silme, geçiş yapma
- **Merge**: Dalları birleştirme
- **Rebase**: Dalları yeniden temellendirme
- **Stash**: Değişiklikleri geçici saklama
- **Cherry-pick**: Belirli commit'leri seçerek alma
- **Tag yönetimi**: Etiket oluşturma ve yönetme

### 8.2 Görsel Git Araçları
- **Diff görünümü**: Satır satır değişiklik karşılaştırma (inline ve side-by-side)
- **3-yollu merge editörü**: Çakışma çözümü için görsel araç
- **Git blame (Satır geçmişi)**: Her satırın son değiştiren kişiyi gösterme
- **Git log grafiği**: Commit geçmişini görsel graf olarak gösterme
- **Gutter göstergeleri**: Editör kenarında değişiklik göstergeleri (yeşil=eklenen, kırmızı=silinen, mavi=değişen)
- **Önceki versiyonla karşılaştırma**: Dosyanın herhangi bir commit'teki halini görme

### 8.3 Git Hosting Entegrasyonu
- **GitHub entegrasyonu**: PR oluşturma, issue yönetimi, Actions durumu
- **GitLab entegrasyonu**: MR oluşturma, CI/CD durumu
- **Bitbucket entegrasyonu**: PR ve pipeline desteği
- **Hesap yönetimi**: Çoklu Git hesabı desteği
- **SSH anahtar yönetimi**: SSH key oluşturma ve yönetme

---

## 9. Hata Ayıklama (Debugger)

### 9.1 Temel Debug Özellikleri
- **Kesme noktaları (Breakpoints)**: Satır bazında durdurma noktaları
- **Koşullu breakpoint**: Belirli koşul sağlandığında durdurma
- **Logpoint**: Durdurma yerine log yazdırma noktaları
- **Adım adım çalıştırma**: Step Over, Step Into, Step Out
- **Devam ettirme (Continue)**: Sonraki breakpoint'e kadar çalıştırma
- **Yeniden başlatma**: Debug oturumunu yeniden başlatma

### 9.2 Değişken İnceleme
- **Değişken paneli**: Yerel ve global değişkenleri listeleme
- **Watch ifadeleri**: İzlenmek istenen değişkenleri takip etme
- **Çağrı yığını (Call Stack)**: Fonksiyon çağrı hiyerarşisini gösterme
- **Değişken düzenleme**: Çalışma anında değişken değerini değiştirme
- **Hover ile inceleme**: Fare/parmakla değişken üzerinde değer gösterme

### 9.3 Debug Konfigürasyonu
- **launch.json desteği**: VSCode uyumlu debug yapılandırması
- **Debug profilleri**: Farklı çalıştırma senaryoları
- **Uzak debug**: SSH üzerinden uzak sunucuda debug
- **Web uygulaması debug**: Chrome DevTools protokolü ile web debug

### 9.4 Desteklenecek Debug Protokolleri
- **DAP (Debug Adapter Protocol)**: VSCode uyumlu evrensel debug protokolü
- **Chrome DevTools Protocol**: JavaScript/TypeScript debug
- **Python debugpy**: Python debug desteği
- **Java Debug Wire Protocol**: Java debug desteği

---

## 10. Arama ve Navigasyon

### 10.1 Dosya İçi Arama
- **Bul ve Değiştir**: Metin arama ve değiştirme
- **Regex desteği**: Düzenli ifadelerle arama
- **Büyük/küçük harf duyarlılığı**: Case-sensitive toggle
- **Tam kelime eşleşmesi**: Whole word match
- **Seçim içinde arama**: Yalnızca seçili alanda arama
- **Vurgulama**: Tüm eşleşmeleri vurgulama
- **Preserve case**: Değiştirirken büyük/küçük harf formatını koruma

### 10.2 Proje Geneli Arama
- **Tüm dosyalarda arama**: Ripgrep benzeri hızlı tam metin arama
- **Dosya filtresi**: Glob pattern ile arama kapsamı daraltma
- **Hariç tutma**: `.gitignore` ve özel hariç tutma kuralları
- **Sonuç önizleme**: Arama sonuçlarında bağlam satırlarını gösterme
- **Toplu değiştirme**: Proje genelinde toplu bul-değiştir

### 10.3 Hızlı Navigasyon
- **Hızlı dosya açma (Quick Open)**: Dosya adıyla bulanık arama
- **Sembole gitme**: Fonksiyon/sınıf/değişken ismiyle arama
- **Satıra gitme**: Belirli satır numarasına atlama
- **Breadcrumb navigasyonu**: Dosya yolu ve sembol hiyerarşisinde gezinme
- **Geri/İleri gitme**: Navigasyon geçmişinde gezinme
- **Tanıma gitme (Go to Definition)**: F12 benzeri tanım noktasına atlama
- **Tür tanımına gitme**: Değişkenin tür tanımına gitme
- **Implementasyona gitme**: Interface'in gerçek implementasyonuna gitme

### 10.4 Outline / Sembol Haritası
- **Belge sembol ağacı**: Dosyadaki tüm fonksiyon, sınıf, değişkenlerin ağaç görünümü
- **Breadcrumb**: Mevcut konumun hiyerarşik gösterimi
- **Sembol filtreleme**: Tür bazında filtreleme (sadece fonksiyonlar, sadece sınıflar vb.)

---

## 11. Eklenti / Uzantı Sistemi

### 11.1 Eklenti Mimarisi
- **Sandbox izolasyonu**: Eklentilerin ana uygulamayı çökertememesi
- **API katmanı**: Eklentilerin kullanabileceği güvenli API seti
- **Yaşam döngüsü yönetimi**: Eklenti yükleme, etkinleştirme, devre dışı bırakma, kaldırma
- **Tembel yükleme (Lazy loading)**: Eklentileri gerektiğinde yükleme
- **Etkinleştirme olayları**: Belirli koşullarda eklenti etkinleştirme (dosya türü açılınca vb.)

### 11.2 Eklenti Yetenekleri
- **Dil desteği ekleme**: Yeni dil grameri ve LSP sunucusu ekleme
- **Tema ekleme**: Renk teması ve ikon teması ekleme
- **Snippet paketi ekleme**: Dil bazında snippet koleksiyonları
- **Komut ekleme**: Komut paletine yeni komut ekleme
- **Menü öğesi ekleme**: Bağlam menülerine yeni seçenek ekleme
- **Panel ekleme**: Sidebar'a yeni panel ekleme
- **Formatter ekleme**: Kod biçimlendirme aracı ekleme
- **Linter ekleme**: Kod kalite kontrolü aracı ekleme

### 11.3 Eklenti Mağazası (Marketplace)
- **Eklenti keşfi**: Kategori, popülerlik, puana göre listeleme
- **Otomatik güncelleme**: Eklenti güncellemelerini otomatik indirme
- **Derecelendirme ve inceleme**: Kullanıcı puanları ve yorumları
- **Yayıncı doğrulama**: Güvenilir yayıncı rozeti
- **Eklenti önerileri**: Proje türüne göre eklenti önerisi

---

## 12. Uzaktan Geliştirme (Remote Development)

### 12.1 SSH Uzak Bağlantı
- **SSH ile uzak sunucuya bağlanma**: Kod uzak sunucuda, editör yerel cihazda
- **SSH anahtar yönetimi**: Public/private key desteği
- **SSH yapılandırması**: `~/.ssh/config` dosyası desteği
- **Port yönlendirme**: Uzak sunucudaki portları yerel cihaza yönlendirme
- **Bağlantı yöneticisi**: Kayıtlı sunucu profilleri

### 12.2 Konteyner Geliştirme
- **Dev Container desteği**: `.devcontainer.json` ile konteyner ortamında geliştirme
- **Docker entegrasyonu**: Docker konteynerlerine bağlanma
- **Otomatik ortam kurulumu**: Konteyner başlatıldığında araçları otomatik kurma

### 12.3 Bulut Geliştirme Ortamları
- **GitHub Codespaces**: Bulut tabanlı geliştirme ortamı
- **Gitpod**: Bulut IDE bağlantısı
- **AWS Cloud9 / Azure Dev Box**: Kurumsal bulut ortamları
- **Özel sunucu**: Kendi sunucunuzda code-server çalıştırma

---

## 13. İşbirliği (Collaboration)

### 13.1 Gerçek Zamanlı İşbirliği
- **Çok kullanıcılı düzenleme**: Google Docs gibi eş zamanlı düzenleme (CRDT/OT tabanlı)
- **İmleç paylaşımı**: Diğer kullanıcıların imleçlerini görme
- **Takipçi modu**: Başka bir kullanıcının görünümünü takip etme
- **Oturum yönetimi**: Oturum oluşturma ve davet linkleri

### 13.2 Paylaşım
- **Kod parçacığı paylaşımı**: Seçili kodu link olarak paylaşma
- **Canlı sunucu paylaşımı**: Web uygulamasının canlı önizlemesini paylaşma
- **Ekran görüntüsü**: Kod ekran görüntüsü alma ve paylaşma (Carbon benzeri)

---

## 14. Mobil'e Özel Optimizasyonlar

Bu bölüm uygulamayı masaüstü editörlerden ayıran en önemli farklılıklardır.

### 14.1 Dokunmatik Optimizasyonlar
- **Akıllı klavye çubuğu (Toolbar)**: Klavye üzerinde özel sembol çubuğu (`Tab`, `{`, `}`, `(`, `)`, `[`, `]`, `;`, `:`, `=`, `<`, `>`, `/`, `"`, `'`)
- **Özelleştirilebilir hızlı tuşlar**: Kullanıcının kendi sembol çubuğunu oluşturması
- **Dokunmatik imleç hassasiyeti**: Parmağın altındaki metni büyüterek gösterme (magnifier)
- **Çift dokunma ile kelime seçimi**: Hızlı kelime seçimi
- **Üç dokunma ile satır seçimi**: Hızlı satır seçimi
- **İmleç kaydırma hareketleri**: Boşluk tuşunda parmak kaydırarak imleç hareket ettirme
- **Haptic feedback**: Kod tamamlama ve gezinme işlemlerinde titreşim geri bildirimi

### 14.2 Klavye Yönetimi
- **Harici klavye desteği**: Bluetooth/USB klavye kısayolları
- **Vim keybinding desteği**: Vim benzeri modal düzenleme (özellikle harici klavyede)
- **Özel klavye düzeni**: Programlamaya özel sanal klavye
- **Klavye kısayolları**: Harici klavye için kapsamlı kısayol desteği
- **Ctrl/Alt/Shift tuşları**: Sanal klavyede modifier tuşları

### 14.3 Ekran Yönetimi
- **Tam ekran modu**: Durum çubuğu ve navigasyonu gizleme
- **Odak modu (Zen Mode)**: Sadece kod, tüm panelleri gizleme
- **Yatay/Dikey mod**: Cihaz yönüne göre otomatik düzen
- **Samsung DeX / Desktop mode**: Masaüstü modunda genişletilmiş arayüz
- **Tablet modu**: Büyük ekranlarda çoklu panel düzeni
- **Katlanabilir cihaz desteği**: Fold ekranlarda bölünmüş görünüm
- **Picture-in-Picture**: Terminal veya AI sohbetini küçük pencerede tutma

### 14.4 Pil ve Kaynak Yönetimi
- **Arka plan işlem optimizasyonu**: LSP sunucularını arka planda verimli çalıştırma
- **Pil tasarrufu modu**: Sözdizimi vurgulama ve AI önerilerini azaltma
- **Bellek yönetimi**: Kullanılmayan sekmeleri bellekten boşaltma
- **Ağ optimizasyonu**: AI isteklerini toplu gönderme, gereksiz API çağrılarını önleme

### 14.5 Çevrimdışı Çalışma
- **Tam çevrimdışı düzenleme**: İnternet olmadan dosya düzenleme
- **Yerel AI modelleri**: Ollama/GGML ile cihaz üzerinde AI çalıştırma
- **Yerel Git**: İnternet olmadan commit ve branch işlemleri
- **Senkronizasyon kuyruğu**: Çevrimiçi olunca otomatik push/sync

---

## 15. Güvenlik

### 15.1 Veri Güvenliği
- **Uçtan uca şifreleme**: Bulut senkronizasyonunda E2E şifreleme
- **Yerel şifreleme**: Hassas dosyaları cihazda şifreli saklama
- **API anahtarı güvenliği**: Anahtarları Android Keystore ile koruma
- **Güvenli clipboard**: Hassas verilerin clipboard'da kalma süresini sınırlama

### 15.2 Kimlik Doğrulama
- **Biyometrik kilitleme**: Parmak izi / yüz tanıma ile uygulama kilidi
- **OAuth 2.0**: GitHub, GitLab, Bitbucket ile güvenli giriş
- **2FA desteği**: İki faktörlü doğrulama
- **Oturum yönetimi**: Uzak oturumları görüntüleme ve sonlandırma

### 15.3 Eklenti Güvenliği
- **İzin sistemi**: Eklentilerin erişim izinlerini kısıtlama
- **Kod imzalama**: Eklenti bütünlüğünü doğrulama
- **Sandbox çalışma**: Eklentilerin izole ortamda çalışması
- **Güvenlik denetimi**: Eklenti kodunun otomatik güvenlik taraması

### 15.4 AI Güvenliği
- **Veri gizliliği**: AI'a gönderilen verileri kontrol etme (`.aiignore` dosyası)
- **Yerel işleme tercihi**: Mümkün olduğunca yerel model kullanma
- **Hassas veri maskeleme**: API anahtarı, şifre vb. AI'a göndermeme
- **Gizlilik modu**: AI özelliklerini tamamen kapatma seçeneği

---

## 16. Performans ve Mimari

### 16.1 Uygulama Mimarisi
- **Yerel Kotlin/Jetpack Compose**: Ana uygulama katmanı
- **WebView hibrit yaklaşımı**: Editör motoru için Monaco Editor veya özel WebView bileşeni
- **MVVM / Clean Architecture**: Sürdürülebilir kod yapısı
- **Dependency Injection**: Hilt/Koin ile bağımlılık yönetimi
- **Modüler yapı**: Feature bazında modüler mimari

### 16.2 Performans Hedefleri
| Metrik | Hedef |
|--------|-------|
| Soğuk başlatma süresi | < 2 saniye |
| Dosya açma (10KB) | < 100ms |
| Dosya açma (1MB) | < 1 saniye |
| Sözdizimi vurgulama gecikmesi | < 50ms |
| AI tamamlama başlatma | < 200ms |
| Bellek kullanımı (boşta) | < 150MB |
| Bellek kullanımı (aktif) | < 500MB |
| Pil tüketimi (1 saat düzenleme) | < %10 |
| APK boyutu | < 50MB |

### 16.3 Optimizasyon Teknikleri
- **Tembel yükleme**: Görünür olmayan bileşenleri gerektiğinde yükleme
- **Sanal kaydırma**: Sadece ekranda görünen satırları render etme
- **Web Worker / Coroutine**: Ağır işlemleri arka plan iş parçacıklarında yürütme
- **Incremental parsing**: Değişen satırları yeniden analiz etme
- **LRU önbellek**: Sık kullanılan verileri bellekte tutma
- **Debounce / Throttle**: Yazarken aşırı API çağrısını önleme
- **ProGuard / R8**: APK boyutunu küçültme ve optimizasyon

### 16.4 Teknik Yığın Alternatifleri

#### Yaklaşım 1: Tamamen Native (Kotlin)
| Bileşen | Teknoloji |
|---------|-----------|
| UI Framework | Jetpack Compose |
| Editör Motoru | Sora Editor / Özel geliştirme |
| Sözdizimi | KotlinTextMate + KTreeSitter |
| AI İstemci | Retrofit / OkHttp |
| Veritabanı | Room / DataStore |
| DI | Hilt |

**Avantajları**: En iyi performans, tam platform entegrasyonu, küçük APK
**Dezavantajları**: Editör motorunu sıfırdan geliştirmek zor

#### Yaklaşım 2: Hibrit (Native + WebView)
| Bileşen | Teknoloji |
|---------|-----------|
| UI Framework | Jetpack Compose (ana çerçeve) |
| Editör Motoru | Monaco Editor (WebView içinde) |
| Köprü | JavaScript Interface / WebChannel |
| AI İstemci | Native Retrofit |
| Terminal | Native terminal emülatör |

**Avantajları**: Monaco'nun tüm özelliklerini kullanma, hızlı geliştirme
**Dezavantajları**: WebView performans sınırlamaları, dokunmatik sorunları

#### Yaklaşım 3: Cross-Platform
| Bileşen | Teknoloji |
|---------|-----------|
| Framework | Flutter / Kotlin Multiplatform |
| Editör | CodeForge (Flutter) / Özel |
| AI | Platform agnostik HTTP istemci |

**Avantajları**: iOS desteği de eklenebilir
**Dezavantajları**: Platform özel özelliklerde kısıtlama

---

## 17. Tema ve Kişiselleştirme

### 17.1 Renk Temaları
- **Dahili temalar**: Dark, Light, High Contrast, Solarized, Monokai, Dracula, One Dark, Nord, Gruvbox, Tokyo Night
- **VSCode tema uyumluluğu**: `.json` tema dosyalarını içe aktarma
- **Otomatik tema değiştirme**: Sistem koyu/açık moduna göre otomatik geçiş
- **Özel tema oluşturucu**: Kullanıcının kendi temasını oluşturması
- **OLED koyu tema**: Saf siyah arka plan ile pil tasarrufu

### 17.2 Yazı Tipi Ayarları
- **Monospace font seçimi**: JetBrains Mono, Fira Code, Source Code Pro, Cascadia Code
- **Ligature desteği**: Programlama ligatürleri (`=>`, `!=`, `>=` vb.)
- **Yazı boyutu ayarı**: Hassas boyut ayarlama
- **Satır yüksekliği**: Satır aralığı özelleştirme
- **Font ağırlığı**: İnce/kalın yazı tipi seçimi

### 17.3 Genel Kişiselleştirme
- **Ayar senkronizasyonu**: Ayarları bulut üzerinden cihazlar arası senkronize etme
- **Profiller**: Farklı proje türleri için ayar profilleri (Web Dev, Python, C++ vb.)
- **JSON ayar dosyası**: Gelişmiş ayarlar için doğrudan JSON düzenleme
- **Klavye kısayollarını özelleştirme**: Tüm kısayolları değiştirme
- **Düzen özelleştirme**: Panel pozisyonlarını ve boyutlarını değiştirme

---

## 18. Desteklenecek Diller ve Çerçeveler

### 18.1 Programlama Dilleri (60+ Dil)
**Web**: JavaScript, TypeScript, HTML, CSS, SCSS, LESS, PHP, WebAssembly
**Mobil**: Kotlin, Java, Swift, Dart, Objective-C
**Sistem**: C, C++, Rust, Go, Zig
**Betik**: Python, Ruby, Perl, Lua, Shell/Bash, PowerShell
**Veri**: SQL, R, Julia, MATLAB
**Fonksiyonel**: Haskell, Elixir, Erlang, Scala, Clojure, F#
**Diğer**: C#, Assembly, VHDL, Verilog, LaTeX, Prolog

### 18.2 Yapılandırma ve Veri Dosyaları
JSON, YAML, TOML, XML, INI, ENV, Dockerfile, Docker Compose, Makefile, CMakeLists, Gradle (Kotlin DSL & Groovy), Terraform, Ansible

### 18.3 Çerçeve Desteği
**Frontend**: React, Vue, Angular, Svelte, Next.js, Nuxt.js, Astro
**Backend**: Node.js/Express, Django, Flask, Spring Boot, Laravel, Ruby on Rails, ASP.NET
**Mobil**: Flutter, React Native, Jetpack Compose, SwiftUI
**Diğer**: TailwindCSS, GraphQL, Prisma, Docker

---

## 19. Bulut Entegrasyonu

### 19.1 Proje Senkronizasyonu
- **Git tabanlı senkronizasyon**: Tüm projeler Git ile senkronize
- **Bulut yedekleme**: Ayarlar, snippet'ler, tema tercihleri yedekleme
- **Çoklu cihaz senkronizasyonu**: Telefon, tablet, masaüstü arası senkronizasyon

### 19.2 Bulut Build / Run
- **Uzak derleme**: Bulut sunucusunda kod derleme
- **Uzak çalıştırma**: Kodu bulut sunucusunda çalıştırma ve çıktıyı gösterme
- **CI/CD izleme**: GitHub Actions, GitLab CI, Jenkins durumlarını izleme
- **Canlı önizleme**: Web uygulamalarının canlı önizlemesi

### 19.3 Bulut AI
- **Sunucu taraflı AI**: Güçlü AI modelleri bulutta çalıştırma
- **Bağlam indeksleme**: Kod tabanını bulutta indeksleme (hızlı AI yanıtları)
- **Paylaşılan AI bağlamı**: Takım genelinde AI öğrenmelerini paylaşma

---

## 20. Erişilebilirlik (Accessibility)

### 20.1 Görme Engelli Desteği
- **TalkBack uyumluluğu**: Android ekran okuyucu ile tam uyumluluk
- **Yüksek kontrast temaları**: Görme zorluğu için özel temalar
- **Büyük yazı tipi desteği**: Sistem yazı tipi ölçeğine uyum
- **Ekran büyüteci uyumluluğu**: Android büyüteç ile çalışma

### 20.2 Motor Engelli Desteği
- **Ses ile komut**: Sesli komutlarla kod düzenleme
- **Switch Access uyumluluğu**: Harici switch cihazları desteği
- **Özelleştirilebilir dokunma hedefleri**: Dokunma alanlarını büyütme

### 20.3 Diğer
- **Çoklu dil desteği (i18n)**: Uygulama arayüzü çoklu dilde (Türkçe, İngilizce, Almanca, Arapça vb.)
- **RTL desteği**: Sağdan sola yazım desteği (Arapça, İbranice)
- **Renk körlüğü modları**: Deuteranopia, Protanopia, Tritanopia filtreleri

---

## 21. Teknik Mimari Kararlar

### 21.1 Önerilen Teknoloji Yığını (Başlangıç İçin)

```
┌──────────────────────────────────────────────┐
│              Kullanıcı Arayüzü               │
│         Jetpack Compose + Material 3         │
├──────────────────────────────────────────────┤
│              Editör Katmanı                  │
│   Sora Editor (Native) veya Monaco (WebView) │
├──────────────────────────────────────────────┤
│          Sözdizimi Vurgulama                 │
│      KotlinTextMate + KTreeSitter            │
├──────────────────────────────────────────────┤
│          Dil Zekası (LSP)                    │
│      Yerel/Uzak LSP Sunucuları               │
├──────────────────────────────────────────────┤
│           AI Katmanı                         │
│   OpenAI / Claude / Gemini API İstemcisi     │
│   + Yerel Model Desteği (Ollama/GGML)        │
├──────────────────────────────────────────────┤
│           Terminal                           │
│   Terminal Emülatör + Termux Entegrasyonu    │
├──────────────────────────────────────────────┤
│         Versiyon Kontrolü                    │
│     JGit (Java Git implementasyonu)          │
├──────────────────────────────────────────────┤
│          Veri Katmanı                        │
│   Room DB + DataStore + File I/O             │
├──────────────────────────────────────────────┤
│         Ağ Katmanı                           │
│       Retrofit + OkHttp + WebSocket          │
├──────────────────────────────────────────────┤
│         Altyapı                              │
│   Hilt DI + Kotlin Coroutines + Flow         │
└──────────────────────────────────────────────┘
```

### 21.2 Minimum Android Gereksinimleri
| Gereksinim | Değer |
|-----------|-------|
| Minimum SDK | API 26 (Android 8.0) |
| Hedef SDK | API 35 (Android 15) |
| Minimum RAM | 3GB |
| Önerilen RAM | 6GB+ |
| Depolama | 200MB kurulum + proje boyutu |
| İşlemci | ARMv8 (64-bit) |

### 21.3 Geliştirme Fazları (Önerilen Yol Haritası)

#### Faz 1 - MVP (Temel Editör)
- [x] Proje yapısı ve mimari kurulum
- [ ] Temel metin editörü (açma, düzenleme, kaydetme)
- [ ] Sözdizimi vurgulama (Tier 1 diller)
- [ ] Dosya gezgini
- [ ] Çoklu sekme desteği
- [ ] Mobil klavye araç çubuğu
- [ ] Temel tema desteği (koyu/açık)
- [ ] Dosya oluşturma/silme/yeniden adlandırma

#### Faz 2 - Gelişmiş Editör
- [x] Bul ve Değiştir (dosya içi + proje geneli)
- [x] Snippet desteği (JS/TS/Python/Java/Kotlin/HTML/CSS)
- [x] Komut paleti (14 yerleşik komut)
- [x] Ayarlar ekranı (tema, font, tab boyutu, auto-save)
- [x] Proje geneli dosyalarda arama (SearchFilesPanel)
- [x] Hızlı dosya açma (Quick Open + fuzzy match)
- [x] Satıra gitme (Go to Line)
- [x] Geri/ileri navigasyon geçmişi
- [ ] Kod katlama (Sora Editor seviyesinde)
- [ ] Minimap
- [ ] Çoklu imleç

#### Faz 3 - AI Entegrasyonu
- [x] AI Chat paneli (mesaj balonları, Markdown desteği, bağlam göstergesi)
- [x] Satır içi AI düzenleme (Inline Edit + diff önizleme)
- [x] Çoklu AI model desteği (OpenAI, Anthropic, Gemini, Ollama)
- [x] Bağlam yönetimi (dosya, dil, seçili kod bağlamı)
- [x] AI Ayarları (sağlayıcı, model, API key, sıcaklık)
- [x] Hızlı AI eylemleri (açıkla, düzelt, test yaz, dokümantasyon, optimize)
- [x] Token kullanım takibi
- [ ] AI kod tamamlama (ghost text) - ileri fazda

#### Faz 4 - Terminal ve Git
- [x] Dahili terminal emülatörü (komut çalıştırma, cd/pwd/clear, ANSI temizleme)
- [x] Git temel işlemleri (stage, unstage, commit, pull, push)
- [x] Diff görünümü (tam ekran, satır bazlı, renk kodlu)
- [x] Branch yönetimi (checkout, oluşturma, ahead/behind)
- [x] Git log (commit geçmişi)
- [x] Stage/Unstage/Discard dosya bazında
- [ ] Git blame (satır geçmişi) - ileri fazda

#### Faz 5 - Akıllı Dil Desteği
- [x] LSP istemci (JSON-RPC 2.0, stdio transport, Content-Length)
- [x] IntelliSense (completion, hover, definition, references, signature help)
- [x] Tanılama (diagnostics - hata/uyarı/bilgi/ipucu)
- [x] Kod biçimlendirme (formatting)
- [x] Sembol arama ve belge yapısı (outline)
- [x] 16 dil için hazır LSP sunucu yapılandırmaları
- [x] Kod eylemleri (code actions)
- [x] CompletionPopup, DiagnosticsPanel, OutlinePanel UI

#### Faz 6 - Eklenti Sistemi
- [ ] Eklenti API tasarımı
- [ ] Eklenti yükleme/kaldırma mekanizması
- [ ] Eklenti mağazası
- [ ] Tema eklentileri
- [ ] Dil eklentileri

#### Faz 7 - İleri Seviye
- [ ] Uzaktan geliştirme (SSH)
- [ ] Hata ayıklama (Debug)
- [ ] İşbirliği (Real-time collaboration)
- [ ] Agent modu
- [ ] Bulut senkronizasyonu
- [ ] Erişilebilirlik iyileştirmeleri

---

## Referans Uygulamalar ve Kütüphaneler

| Kaynak | Açıklama |
|--------|----------|
| [Sora Editor](https://github.com/Rosemoe/sora-editor) | Android için yüksek performanslı native kod editörü bileşeni |
| [KotlinTextMate](https://github.com/ivan-magda/KotlinTextMate) | Pure Kotlin TextMate grameri implementasyonu |
| [KTreeSitter](https://github.com/tree-sitter/kotlin-tree-sitter) | Tree-sitter Kotlin bindings |
| [Monaco Editor](https://github.com/microsoft/monaco-editor) | VSCode'un editör motoru (WebView yaklaşımı için) |
| [JGit](https://www.eclipse.org/jgit/) | Java ile yazılmış Git implementasyonu |
| [Termux](https://github.com/termux/termux-app) | Android terminal emülatörü referansı |
| [CodeForge](https://pub.dev/packages/code_forge) | Flutter için kod editörü bileşeni |

---

> **Not**: Bu belge, adım adım geliştirme sürecinin ilk aşamasıdır. Her faz, detaylı tasarım dokümanları ve teknik spesifikasyonlarla desteklenecektir. Bir sonraki adımda hangi fazdan başlamak istediğinizi belirleyeceğiz.

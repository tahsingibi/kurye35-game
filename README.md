# 🛵🚗 Kurye 35: İzmir Vardiyası

İzmir'in körfez rüzgarından Alsancak trafiğine, Altınyol'dan Karşıyaka sahiline uzanan; gündüzden geceye yaşayan, teslimat ve kaçış odaklı retro-modern bir **HTML5 Canvas Arcade** oyunu. 

İster kıvrak **Kurye Motoru** ile makas atarak trafiğin aralarından süzül, ister zırhlı ve dayanıklı **Kurye Arabası** ile darbelere karşı koyarak paketleri ulaştır; trafik ihlallerinden kaçın ve peşine düşen polislere yakalanmadan vardiyanı tamamla!

---

## 🎮 Öne Çıkan Özellikler

- **Farklı Araç Seçenekleri & Özgün Mekanikler**:
  - **🛵 Kurye Motoru**: Dar ve kıvrak gövde (`48x88px`), seri şerit geçişi ve yüksek manevra kabiliyeti. Darbelere karşı daha hassas.
  - **🚗 Kurye Arabası**: Geniş ve oturaklı gövde (`52x84px`), engellere ve kaza darbelerine karşı **%50 daha yüksek dayanıklılık**, polisle çarpışmalarda darbeyi emen sağlam şasi.
  - **Vardiya Öncesi Araç Seçim Ekranı**: Oyuna başlarken canlı istatistiklerle (Manevra, İvmelenme, Dayanıklılık) araç belirleme veya seçili araçla doğrudan yola çıkma imkanı.
- **Dinamik Web Audio API Ses & Ambiyans Motoru**:
  - Harici ses dosyası indirmeye gerek kalmadan, tamamen sıfır gecikmeli sentetik motor sesleri.
  - Gaza basma, süzülme (coasting), frenleme ve NOS durumlarına göre akıcı devir tepkileri.
  - Hızlandıkça yükselen doğal **asfalt & rüzgar uğultusu**, yağmurlu havalarda **ıslak zemin şıpırtısı** ve gece vardiyasında **derin gece esintisi**.
  - Son viteste kulak tırmalamayan, tok ve kadife gibi kalibre edilmiş egzoz tınısı.
- **Canvas 2D Motoru**: 60 FPS akıcı piksel fiziği, dinamik araç trafik simülasyonu ve parçacık efektleri.
- **İzmir Rotaları**: Konak Saat Kulesi, Alsancak Liman Hattı, Kordon boyu, Altınyol viyadükleri ve Karşıyaka sahil şeridi.
- **Günün Evreleri & Hava Durumu**: Şafak, gündüz, akşam kızıllığı ve neon gece atmosferi; yağmurlu zeminlerde değişen yol tutuşu.
- **Vardiya Mekanikleri**: Seri teslimat comboları, aşırı hız ihlalleri, aranma seviyesi ve peşine düşen polis takibi.
- **Ergonomik Mobil Kokpit HUD**:
  - Oyuncu aracının arkasını/gövdesini asla kapatmayan alt merkez spor ibreli kadran tasarımı.
  - Başparmak ergonomisine uygun D-Pad yön butonları, Gaz, Fren ve interaktif NOS pedalları (Solak/Sağlak el desteğiyle).
- **Yerelleştirme (i18n)**: Çoklu dil desteği.
- **PWA & Çevrimdışı Oynanabilirlik**: Service worker desteğiyle mobil cihazlara yüklenebilir ve internetsiz oynanabilir.
- **Gelişmiş Kalıcılık**: Yüksek skor, rekor teslimat, seçilen araç ve 8 özel başarım `localStorage` üzerinde saklanır.

---

## 🕹️ Kontroller

### 💻 Masaüstü (Klavye)

| Eylem | Kontrol Tuşları |
| :--- | :--- |
| **Şerit Değiştir** | `A` / `D` veya `←` / `→` |
| **Gaz (Hızlan)** | `W` veya `↑` |
| **Fren (Yavaşla)** | `S`, `↓` veya `Space` |
| **NOS Boost** | `Shift` |
| **Duraklat / Devam** | `P` veya `Escape` |
| **Menü Seçimi** | `Enter` |

### 📱 Mobil (Dokunmatik Ekran)

Ekranın en altına yerleşen, başparmak ergonomisine uygun neon arcade kontrolleri:
- **`[ ← ]` ve `[ → ]` Yön Butonları**: Tek dokunuşla şerit değiştirir; basılı tutulduğunda sol şeritten sağ şeride takılmadan pürüzsüzce akar.
- **`[ GAZ ▲ ]` Pedalı**: Basılı tutulduğunda araç hızlanır; bırakıldığında doğal akış hızına döner.
- **`[ FREN ▼ ]` Pedalı**: Basılı tutulduğunda fren yapar; bırakıldığında normal hıza döner.
- **`[ NOS ⚡ ]` Butonu**: Dokunulduğunda nitro ateşini devreye sokar.
- **Alt Merkez İbreli KM Kadranı**: Kontrol butonlarının arasındaki ferah alt merkez koridorunda aracın görüşünü kapatmadan hız ve devri canlı yansıtır.
- **Solak / Sağlak Düzen**: Ayarlar ekranından yön butonları sol veya sağ ele göre tek dokunuşla ayarlanabilir.

---

## 🛠️ Teknoloji Yığını

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Stil & Tasarım**: [Tailwind CSS](https://tailwindcss.com/)
- **Oyun Motoru**: Vanilla Canvas 2D API (Sıfır harici oyun kütüphanesi bağımlılığı)
- **Ses Sentezi**: Web Audio API (Dinamik sentezleyici, filtreler ve ambiyans nodeları)
- **Tip Güvenliği**: TypeScript
- **PWA**: Web App Manifest & Service Worker

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.0 veya üzeri
- npm, yarn veya pnpm

### Kurulum

```bash
# Depoyu klonla
git clone https://github.com/tahsingibi/kurye-izmir.git

# Proje dizinine gir
cd kurye-izmir

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

### Komutlar

```bash
npm run dev      # Geliştirme sunucusunu başlatır
npm run build    # Production derlemesi alır
npm run start    # Production sunucusunu çalıştırır
npm run lint     # Kod standartları ve tip kontrolü
```

---

## 📁 Proje Mimarisi

```text
├── app/
│   ├── page.tsx               # Ana oyun sayfası (SSR devre dışı)
│   ├── layout.tsx             # HTML iskeleti, fontlar ve PWA meta etiketleri
│   └── api/og/route.tsx       # Sosyal medya paylaşım kartları
├── components/
│   ├── game-container/        # Oyun durum makinesi (Menü, Hikaye, Oyun, Pause, GameOver)
│   ├── game-canvas/           # Canvas döngüsü ve viewport yönetimi
│   ├── touch-controls/        # Mobil arcade dokunmatik kontroller
│   ├── vehicle-select-modal/  # Araç seçim ve istatistik modalı
│   ├── game-menu/             # Başlangıç ve araç göstergesi arayüzü
│   ├── game-story/            # Vardiya hikaye ekranı
│   ├── game-pause/            # Duraklatma ve düzen ayarları
│   └── game-over/             # Vardiya sonu raporu ve istatistikler
├── engine/
│   ├── game-engine.ts         # Ana oyun döngüsü, kurallar ve ses/fizik orkestrasyonu
│   ├── game-renderer.ts       # Canvas çizim orkestrasyonu
│   ├── audio.ts               # Web Audio API sentetik motor ve ortam sesi motoru
│   ├── input.ts               # Klavye ve dokunmatik girdi yönetimi
│   ├── collision.ts           # Çarpışma ve ihlal kontrolleri
│   ├── constants.ts           # Oyun sabitleri, ölçüler ve başarımlar
│   ├── entities/              # Oyuncu (motor/araba), trafik araçları ve polis
│   └── renderers/             # Şehir, yol, araçlar, efektler ve HUD
├── locales/
│   ├── tr.json                # Türkçe yerelleştirme
│   └── en.json                # İngilizce yerelleştirme
└── utils/
    ├── localization/          # Çoklu dil kancaları
    └── settings.ts            # Araç seçimi, mobil düzen ve yerel ayar saklayıcısı
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---

## 👨‍💻 Geliştirici

- **Geliştirici**: Tahsin Sungur
- **X (Twitter)**: [@tahsingibi](https://x.com/tahsingibi)
- **Web**: [sungur.dev](https://sungur.dev)
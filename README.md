# 🛵 Kurye 35: İzmir Vardiyası

İzmir'in körfez rüzgarından Alsancak trafiğine, Altınyol'dan Karşıyaka sahiline uzanan; gündüzden geceye yaşayan, teslimat ve kaçış odaklı retro-modern bir **HTML5 Canvas Arcade** oyunu. 

Motosikletli kurye olarak kontak aç, paketleri zamanında teslim et, trafik ihlallerinden kaçın ve peşine düşen polislere yakalanmadan vardiyanı tamamla!

---

## 🎮 Öne Çıkan Özellikler

- **Canvas 2D Motoru**: 60 FPS akıcı piksel fiziği, dinamik araç trafik simülasyonu ve parçacık efektleri.
- **İzmir Rotaları**: Konak Saat Kulesi, Alsancak Liman Hattı, Kordon boyu, Altınyol viyadükleri ve Karşıyaka sahil şeridi.
- **Günün Evreleri & Hava Durumu**: Şafak, gündüz, akşam kızıllığı ve neon gece atmosferi; yağmurlu zeminlerde değişen yol tutuşu.
- **Vardiya Mekanikleri**: Seri teslimat comboları, aşırı hız ihlalleri, aranma seviyesi ve peşine düşen polis takibi.
- **Ergonomik Mobil Kontroller**: Ekranı ve yolu asla kapatmayan, akıcı şerit geçişi sunan D-Pad yön butonları, Gaz, Fren ve NOS pedalları (Solak/Sağlak el desteğiyle).
- **Yerelleştirme (i18n)**: Türkçe ve İngilizce dil desteği.
- **PWA & Çevrimdışı Oynanabilirlik**: Service worker desteğiyle mobil cihazlara yüklenebilir ve internetsiz oynanabilir.
- **Gelişmiş Kalıcılık**: Yüksek skor, rekor teslimat ve 8 özel başarım `localStorage` üzerinde saklanır.

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
- **`[ GAZ ▲ ]` Pedalı**: Basılı tutulduğunda motor hızlanır; bırakıldığında motor akış hızına döner.
- **`[ FREN ▼ ]` Pedalı**: Basılı tutulduğunda fren yapar; bırakıldığında normal hıza döner.
- **`[ NOS ⚡ ]` Butonu**: Dokunulduğunda nitro ateşini devreye sokar.
- **Solak / Sağlak Düzen**: Duraklatma (Pause) ekranından ve Ana Menü'den yön butonları sol veya sağ ele göre tek dokunuşla ayarlanabilir.

---

## 🛠️ Teknoloji Yığını

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Stil & Tasarım**: [Tailwind CSS](https://tailwindcss.com/)
- **Oyun Motoru**: Vanilla Canvas 2D API (Sıfır harici oyun kütüphanesi bağımlılığı)
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
git clone https://github.com/kullaniciadi/kurye-izmir.git

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
│   ├── game-menu/             # Başlangıç ve ayarlar arayüzü
│   ├── game-story/            # Vardiya hikaye ekranı
│   ├── game-pause/            # Duraklatma ve düzen ayarları
│   └── game-over/             # Vardiya sonu raporu ve istatistikler
├── engine/
│   ├── game-engine.ts         # Ana oyun döngüsü ve kurallar
│   ├── game-renderer.ts       # Canvas çizim orkestrasyonu
│   ├── input.ts               # Klavye ve dokunmatik girdi yönetimi
│   ├── collision.ts           # Çarpışma ve ihlal kontrolleri
│   ├── constants.ts           # Oyun sabitleri, ölçüler ve başarımlar
│   ├── entities/              # Oyuncu (motor), trafik araçları ve polis
│   └── renderers/             # Şehir, yol, araçlar, efektler ve HUD
├── locales/
│   ├── tr.json                # Türkçe yerelleştirme
│   └── en.json                # İngilizce yerelleştirme
└── utils/
    ├── localization/          # Çoklu dil kancaları
    └── settings.ts            # Mobil düzen ve yerel ayar saklayıcısı
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---

## 👨‍💻 Geliştirici

- **Geliştirici**: Tahsin Sungur
- **X (Twitter)**: [@tahsingibi](https://x.com/tahsingibi)
- **Web**: [sungur.dev](https://sungur.dev)
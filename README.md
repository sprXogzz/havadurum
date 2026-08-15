#  Atmosfer - Anlık & Detaylı Hava Durumu Web Uygulaması

Modern, hızlı ve kullanıcı dostu bir arayüze sahip; anlık hava durumu verilerini, 5 günlük tahminleri ve animasyonlu görsel efektleri bir arada sunan **Progressive Web App (PWA)** destekli hava durumu uygulaması.

---

##  Ekran Görüntüsü

<img width="1040" height="696" alt="image" src="https://github.com/user-attachments/assets/ad613c4f-c82e-42e0-8694-aa17341ac968" />


---

##  Öne Çıkan Özellikler

*   ** Dinamik ve Canlı Hava Animasyonları:** Yağmur, kar veya fırtına durumuna göre arka planda çalışan HTML5 Canvas parçacık (particle) animasyonları.
*   ** Konum & Şehir Arama:** Nominatim API entegrasyonu ile akıllı şehir arama önerileri ve tek tıkla GPS ile konumdan hava durumu alma.
*   ** Detaylı Hava Metrikleri:** Anlık sıcaklığın yanı sıra Nem (%), Hissedilen Sıcaklık, Rüzgar Hızı, UV İndeksi ve Basınç değerleri.
*   ** 5 Günlük Hava Tahmini:** Önümüzdeki günlerin en yüksek / en düşük sıcaklıklarını ve durum ikonlarını gösteren tahmin paneli.
*   ** Favori Şehirler:** Sık bakılan şehirleri `localStorage` ile hafızada tutma ve tek tıkla erişim.
*   ** PWA (Progressive Web App) Desteği:** Masaüstü ve mobil cihazlara "Uygulama Olarak Yükle" desteği ve Service Worker ile hızlı önbellekleme.
*   ** SEO & Sosyal Medya Uyumlu:** Dinamik sayfa başlığı (`document.title`), Open Graph (OG) meta etiketleri ve özel `404.html` sayfası.

---

##  Kullanılan Teknolojiler

*   **Frontend:** HTML5, CSS3 (Glassmorphism & CSS Grid/Flexbox), Pure JavaScript (ES6+)
*   **Grafik & Animasyon:** HTML5 Canvas API
*   **API'ler:**
    *   [Open-Meteo API](https://open-meteo.com/) (Hava durumu verileri & 5 günlük tahminler)
    *   [OpenStreetMap Nominatim API](https://nominatim.openstreetmap.org/) (Şehir arama & Jeokodlama)
*   **PWA:** Web App Manifest (`manifest.json`) & Service Worker (`sw.js`)

---

##  Yerel Kurulum & Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için ekstra bir bağımlılık (npm/node) yüklemenize gerek yoktur.

1.  **Depoyu klonlayın:**
    ```bash
    git clone [https://github.com/sprxogzz/havadurum.git](https://github.com/sprxogzz/havadurum.git)
    ```
2.  **Proje dizinine gidin:**
    ```bash
    cd havadurum
    ```
3.  `index.html` dosyasını çift tıklayarak veya bir yerel sunucu (örneğin VS Code Live Server) ile açarak tarayıcınızda görüntüleyin.

---

##  İletişim

Geliştirici: **Orahmetsevik**  
E-posta: [sevikoguzrahmet@gmail.com](mailto:sevikoguzrahmet@gmail.com)  
Canlı Proje: [GitHub Pages Canlı Linki](https://sprxogzz.github.io/havadurum/)

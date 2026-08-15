
const havaHaritasi = {
    0: { simge: "", tur: "sunny", renk: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
    1: { simge: "", tur: "sunny", renk: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
    2: { simge: "", tur: "cloudy", renk: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)" },
    3: { simge: "", tur: "cloudy", renk: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    45: { simge: "", tur: "cloudy", renk: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
    48: { simge: "", tur: "cloudy", renk: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
    51: { simge: "", tur: "rainy", renk: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)" },
    53: { simge: "", tur: "rainy", renk: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)" },
    55: { simge: "", tur: "rainy", renk: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
    61: { simge: "", tur: "rainy", renk: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
    71: { simge: "", tur: "snowy", renk: "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)" },
    95: { simge: "", tur: "storm", renk: "linear-gradient(135deg, #232526 0%, #414345 100%)" }
};

let tanecikler = [];
let mevcutHavaTuru = "sunny";
let animasyonKimligi = null;
let favoriSehirler = [];

const tuval = document.getElementById('weatherCanvas');
const cizimKapsami = tuval.getContext('2d');
let tuvalGenislik = tuval.width = window.innerWidth;
let tuvalYukseklik = tuval.height = window.innerHeight;

window.addEventListener('resize', () => {
    tuvalGenislik = tuval.width = window.innerWidth;
    tuvalYukseklik = tuval.height = window.innerHeight;
    tanecikleriOlustur();
});

function tanecikleriOlustur() {
    tanecikler = [];
    let adet = 0;
    const mobilMi = tuvalGenislik < 600;

    if (mevcutHavaTuru === "rainy") adet = mobilMi ? 80 : 200;
    else if (mevcutHavaTuru === "snowy") adet = mobilMi ? 40 : 100;
    else if (mevcutHavaTuru === "storm") adet = mobilMi ? 100 : 250;

    for (let i = 0; i < adet; i++) {
        tanecikler.push({
            x: Math.random() * tuvalGenislik,
            y: Math.random() * tuvalYukseklik,
            boyut: Math.random() * 2 + 1,
            hiz: mevcutHavaTuru === "snowy" ? Math.random() * 1.5 + 0.5 : Math.random() * 7 + 4
        });
    }
}

function animasyonuBaslat() {
    if (animasyonKimligi) cancelAnimationFrame(animasyonKimligi);

    function ciz() {
        cizimKapsami.clearRect(0, 0, tuvalGenislik, tuvalYukseklik);

        tanecikler.forEach(t => {
            cizimKapsami.beginPath();
            if (mevcutHavaTuru === "snowy") {
                cizimKapsami.fillStyle = "rgba(255, 255, 255, 0.8)";
                cizimKapsami.arc(t.x, t.y, t.boyut * 1.5, 0, Math.PI * 2);
                cizimKapsami.fill();
            } else if (mevcutHavaTuru === "rainy" || mevcutHavaTuru === "storm") {
                cizimKapsami.strokeStyle = "rgba(255, 255, 255, 0.4)";
                cizimKapsami.lineWidth = t.boyut;
                cizimKapsami.moveTo(t.x, t.y);
                cizimKapsami.lineTo(t.x - 2, t.y + 12);
                cizimKapsami.stroke();
            }

            t.y += t.hiz;
            if (t.y > tuvalYukseklik) {
                t.y = -10;
                t.x = Math.random() * tuvalGenislik;
            }
        });

        animasyonKimligi = requestAnimationFrame(ciz);
    }
    ciz();
}

function geciktirmeliFonksiyon(fonksiyon, beklemeSuresi = 400) {
    let zamanlayici;
    return (...args) => {
        clearTimeout(zamanlayici);
        zamanlayici = setTimeout(() => fonksiyon.apply(this, args), beklemeSuresi);
    };
}

const sehirOnerileriniGetir = geciktirmeliFonksiyon(async (sorgu) => {
    const onerikutusu = document.getElementById('suggestions');
    const yukleyici = document.getElementById('searchLoader');

    if (!sorgu || sorgu.trim().length < 2) {
        onerikutusu.classList.add('hidden');
        onerikutusu.innerHTML = "";
        return;
    }

    yukleyici.classList.remove('hidden');

    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(sorgu)}&format=json&addressdetails=1&limit=5`;
        const yanıt = await fetch(url);
        const veriler = await yanıt.json();

        onerikutusu.innerHTML = "";
        if (veriler.length === 0) {
            onerikutusu.classList.add('hidden');
            return;
        }

        veriler.forEach(yer => {
            const oge = document.createElement('div');
            oge.className = 'suggestion-item';
            oge.textContent = yer.display_name;
            oge.onclick = () => {
                document.getElementById('cityInput').value = yer.display_name.split(',')[0];
                onerikutusu.classList.add('hidden');
                havaDurumuGetir(yer.lat, yer.lon, yer.display_name.split(',')[0]);
            };
            onerikutusu.appendChild(oge);
        });

        onerikutusu.classList.remove('hidden');
    } catch (hata) {
        console.error("Arama hatası:", hata);
    } finally {
        yukleyici.classList.add('hidden');
    }
});

function gunIsmiGetir(tarihMetni) {
    const gunler = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const d = new Date(tarihMetni);
    return gunler[d.getDay()];
}

async function havaDurumuGetir(enlem, boylam, sehirAdi = "Mevcut Konum") {
    const kart = document.getElementById('weatherCard');
    
    try {
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${enlem}&longitude=${boylam}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
        
        const yanıt = await fetch(url);
        if (!yanıt.ok) throw new Error("Hava durumu verisi alınamadı");

        const veri = await yanıt.json();
        const mevcut = veri.current;
        const gunluk = veri.daily;

        const havaDetay = havaHaritasi[mevcut.weather_code] || { simge: "❓", tur: "sunny", renk: "#0f172a" };
        const sicaklik = Math.round(mevcut.temperature_2m);

        document.title = `${sehirAdi} - ${sicaklik}°C | Hava Durumu`;
        mevcutHavaTuru = havaDetay.tur;
        document.body.style.background = havaDetay.renk;

        tanecikleriOlustur();
        animasyonuBaslat();

        // 5 Günlük Tahmin HTML Yapısı
        let tahminHTML = "";
        for (let i = 0; i < 5; i++) {
            const gunHava = havaHaritasi[gunluk.weather_code[i]] || { simge: "❓" };
            tahminHTML += `
                <div class="forecast-item">
                    <span class="forecast-day">${i === 0 ? 'Bugün' : gunIsmiGetir(gunluk.time[i])}</span>
                    <span class="forecast-icon">${gunHava.simge}</span>
                    <span class="forecast-temp">${Math.round(gunluk.temperature_2m_max[i])}° / ${Math.round(gunluk.temperature_2m_min[i])}°</span>
                </div>
            `;
        }

        kart.innerHTML = `
            <div class="weather-header">
                <h1>${sehirAdi}</h1>
                <p>Anlık Hava Durumu</p>
            </div>
            <div class="weather-main">
                <div class="weather-icon">${havaDetay.simge}</div>
                <div class="temp-display">${sicaklik}°C</div>
                <div class="feels-like">Hissedilen: ${Math.round(mevcut.apparent_temperature)}°C</div>
            </div>

            <!-- Detaylı Metrikler (2x2 Grid) -->
            <div class="weather-details">
                <div class="detail-item">
                    <span>Nem</span>
                    <strong>%${mevcut.relative_humidity_2m}</strong>
                </div>
                <div class="detail-item">
                    <span>Rüzgar</span>
                    <strong>${mevcut.wind_speed_10m} km/s</strong>
                </div>
                <div class="detail-item">
                    <span>UV İndeksi</span>
                    <strong>${gunluk.uv_index_max[0]}</strong>
                </div>
                <div class="detail-item">
                    <span>Basınç</span>
                    <strong>${Math.round(mevcut.surface_pressure)} hPa</strong>
                </div>
            </div>

            <!-- 5 Günlük Tahmin Listesi -->
            <div class="forecast-section">
                <h3>5 Günlük Tahmin</h3>
                <div class="forecast-container">
                    ${tahminHTML}
                </div>
            </div>
        `;

        favoriEkle(sehirAdi, enlem, boylam);
    } catch (hata) {
        kart.innerHTML = `<div class="card-placeholder" style="color: #ef4444;">${hata.message}</div>`;
    }
}

function favorileriYukle() {
    const kayitli = localStorage.getItem('favoriSehirler');
    if (kayitli) favoriSehirler = JSON.parse(kayitli);
    
    const kapsayici = document.getElementById('favoritesSection');
    kapsayici.innerHTML = "";

    favoriSehirler.forEach((fav, indeks) => {
        const rozet = document.createElement('div');
        rozet.className = 'fav-chip';
        rozet.innerHTML = `
            <span>${fav.isim}</span>
            <span class="remove-fav">&times;</span>
        `;

        rozet.querySelector('.remove-fav').onclick = (e) => {
            e.stopPropagation();
            favoriSehirler.splice(indeks, 1);
            localStorage.setItem('favoriSehirler', JSON.stringify(favoriSehirler));
            favorileriYukle();
        };

        rozet.onclick = () => havaDurumuGetir(fav.enlem, fav.boylam, fav.isim);
        kapsayici.appendChild(rozet);
    });
}

function favoriEkle(isim, enlem, boylam) {
    if (!isim || isim === "Mevcut Konum") return;
    if (favoriSehirler.some(f => f.isim === isim)) return;

    if (favoriSehirler.length >= 5) favoriSehirler.shift();
    favoriSehirler.push({ isim, enlem, boylam });
    localStorage.setItem('favoriSehirler', JSON.stringify(favoriSehirler));
    favorileriYukle();
}

document.getElementById('cityInput').addEventListener('input', (e) => {
    sehirOnerileriniGetir(e.target.value);
});

document.getElementById('btnGeo').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pozisyon => havaDurumuGetir(pozisyon.coords.latitude, pozisyon.coords.longitude, "Mevcut Konum"),
            () => alert("Konum erişimi reddedildi veya alınamadı.")
        );
    } else {
        alert("Tarayıcınız konum servislerini desteklemiyor.");
    }
});

favorileriYukle();
tanecikleriOlustur();
animasyonuBaslat();

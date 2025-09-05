const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
});


const weatherMap = {
    0:{icon:"☀️", type:"sunny", color:"#f6d365"},
    1:{icon:"🌤️", type:"sunny", color:"#f6d365"},
    2:{icon:"⛅", type:"cloudy", color:"#bdc3c7"},
    3:{icon:"☁️", type:"cloudy", color:"#bdc3c7"},
    45:{icon:"🌫️", type:"cloudy", color:"#95a5a6"},
    48:{icon:"🌫️", type:"cloudy", color:"#95a5a6"},
    51:{icon:"🌦️", type:"rainy", color:"#4e54c8"},
    53:{icon:"🌦️", type:"rainy", color:"#4e54c8"},
    55:{icon:"🌧️", type:"rainy", color:"#2980b9"},
    61:{icon:"🌧️", type:"rainy", color:"#2980b9"},
    63:{icon:"🌧️", type:"rainy", color:"#2471a3"},
    65:{icon:"🌧️", type:"rainy", color:"#1f618d"},
    71:{icon:"❄️", type:"snowy", color:"#85c1e9"},
    73:{icon:"❄️", type:"snowy", color:"#5dade2"},
    75:{icon:"❄️", type:"snowy", color:"#2e86c1"},
    95:{icon:"⛈️", type:"storm", color:"#34495e"},
    99:{icon:"🌩️", type:"storm", color:"#2c3e50"}
};

let particles = [];
let weatherType = "sunny";
let lightning = false;
let favorites = [];

// süslemeler
function createParticles(){
    particles=[];
    let count = 0;
    const isMobile = W < 600;

    if(weatherType==="rainy") count = isMobile ? 100 : 300;
    else if(weatherType==="snowy") count = isMobile ? 50 : 150;
    else if(weatherType==="storm") count = isMobile ? 70 : 200;

    for(let i=0;i<count;i++){
        particles.push({
            x: Math.random()*W,
            y: Math.random()*H,
            l: Math.random()*2+1,
            speed: weatherType==="rainy"?Math.random()*6+4:
                   weatherType==="snowy"?Math.random()*2+1:
                   weatherType==="storm"?Math.random()*8+4:0,
            angle: weatherType==="rainy"?Math.PI*0.25:0
        });
    }
}

function drawParticles(){
    ctx.clearRect(0,0,W,H);
    if(weatherType==="storm" && Math.random()<0.01){
        lightning=true;
        setTimeout(()=>lightning=false,100);
    }
    if(lightning){
        ctx.fillStyle="#fff";
        ctx.fillRect(0,0,W,H);
    }

    particles.forEach(p=>{
        ctx.beginPath();
        if(weatherType==="snowy") ctx.fillStyle="#fff";
        else if(weatherType==="rainy" || weatherType==="storm") ctx.strokeStyle="#0cf";

        if(weatherType==="rainy" || weatherType==="storm"){
            ctx.lineWidth=p.l;
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(p.x+Math.tan(p.angle)*10, p.y+10*p.l);
            ctx.stroke();
        } else {
            ctx.arc(p.x,p.y,p.l*2,0,Math.PI*2);
            ctx.fill();
        }

        p.x += Math.tan(p.angle)*p.speed;
        p.y += p.speed;
        if(p.y>H){ p.y=-10; p.x=Math.random()*W; }
        if(p.x>W) p.x=0;
    });
    requestAnimationFrame(drawParticles);
}

// şehir 
function loadFavorites(){
    const stored = localStorage.getItem('favorites');
    if(stored) favorites = JSON.parse(stored);
    const favContainer = document.getElementById('favorites');
    favContainer.innerHTML = "";

    favorites.forEach((fav,index)=>{
        const btn = document.createElement('button');
        btn.style.position = "relative";
        btn.textContent = fav.name;

        const del = document.createElement('span');
        del.textContent = "×";
        del.onclick = (e)=>{
            e.stopPropagation();
            favorites.splice(index,1);
            localStorage.setItem('favorites',JSON.stringify(favorites));
            loadFavorites();
        };
        btn.appendChild(del);

        btn.onclick = ()=>getWeather(fav.lat,fav.lon,fav.name);
        favContainer.appendChild(btn);
    });
}

function addFavorite(cityName,lat,lon){
    if(favorites.some(f=>f.name===cityName)) return;
    const fav={name:cityName,lat,lon};
    favorites.push(fav);
    localStorage.setItem('favorites',JSON.stringify(favorites));
    loadFavorites();
}

// hava durumu ile ilgili
async function getCoordinates(city){
    const url=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res=await fetch(url);
    if(!res.ok) throw new Error("Konum alınamadı");
    const data=await res.json();
    if(data.length===0) throw new Error("Şehir bulunamadı");
    return {lat:data[0].lat, lon:data[0].lon, name:data[0].display_name};
}

async function getWeather(lat,lon,cityName="Mevcut Konum"){
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    try{
        const res=await fetch(url);
        if(!res.ok) throw new Error("Hava durumu alınamadı");
        const data=await res.json();
        const weather=data.current_weather;
        const info=weatherMap[weather.weathercode] || {icon:"❓", type:"sunny"};
        weatherType=info.type;
        createParticles();
        document.body.style.background=info.color || "#000";
        document.getElementById('result').innerHTML=`
            <h2>${cityName}</h2>
            <div style="font-size:80px;">${info.icon}</div>
            <p>Sıcaklık: ${weather.temperature.toFixed(1)} °C</p>
            <p>Rüzgar Hızı: ${weather.windspeed} km/s</p>
            <p>Hava Kodu: ${weather.weathercode}</p>
        `;
        addFavorite(cityName,lat,lon);
    }catch(err){
        document.getElementById('result').innerHTML=`<p style="color:#ff5252;">${err.message}</p>`;
    }
}

// Buton Fonksiyonları
async function getWeatherByCity(){
    const city=document.getElementById('cityInput').value.trim();
    if(!city){ document.getElementById('result').innerHTML=`<p style="color:#ff5252;">Lütfen bir şehir girin!</p>`; return; }
    try{
        const coords=await getCoordinates(city);
        getWeather(coords.lat,coords.lon,coords.name);
    }catch(err){
        document.getElementById('result').innerHTML=`<p style="color:#ff5252;">${err.message}</p>`;
    }
}

function getWeatherByGeolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            pos=>getWeather(pos.coords.latitude,pos.coords.longitude),
            ()=>document.getElementById('result').innerHTML=`<p style="color:#ff5252;">Konum alınamadı.</p>`
        );
    } else {
        document.getElementById('result').innerHTML=`<p style="color:#ff5252;">Tarayıcınız konum desteklemiyor.</p>`;
    }
}


async function showSuggestions(query){
    const sugBox=document.getElementById('suggestions');
    if(!query){ sugBox.innerHTML=""; return; }
    try{
        const url=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
        const res=await fetch(url);
        const data=await res.json();
        sugBox.innerHTML="";
        data.forEach(place=>{
            const div=document.createElement('div');
            div.textContent=place.display_name;
            div.onclick=()=>{
                document.getElementById('cityInput').value=place.display_name;
                sugBox.innerHTML="";
                getWeather(place.lat,place.lon,place.display_name);
            };
            sugBox.appendChild(div);
        });
    }catch(e){ sugBox.innerHTML=""; }
}

// başlatma yeri
loadFavorites();
createParticles();
drawParticles();

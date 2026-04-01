// Tema Yönetimi
function temaDegistir() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.getElementById('theme-toggle').innerText = isLight ? '🌙' : '☀️';
}

// Sayfa yüklendiğinde varsayılan Dark Mode gelsin (CSS'te dark tanımlı)
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').innerText = '🌙';
} else {
    document.getElementById('theme-toggle').innerText = '☀️';
}

// Menü Geçişleri
function araciAc(type) {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    
    // Tüm alanları gizle
    document.querySelectorAll('.tool-area').forEach(el => el.classList.add('hidden'));
    
    // Tıklananı göster ve başlığı değiştir
    const baslik = document.getElementById('arac-baslik');
    if(type === 'vize-final') {
        document.getElementById('vize-final-area').classList.remove('hidden');
        baslik.innerText = "Üniversite Not Hesaplama Aracı";
    } else if(type === 'dgs') {
        document.getElementById('dgs-area').classList.remove('hidden');
        baslik.innerText = "DGS Puan Hesaplama Aracı";
    } else if(type === 'msu') {
        document.getElementById('msu-area').classList.remove('hidden');
        baslik.innerText = "MSÜ Puan Hesaplama Aracı";
    } else if(type === 'pomem') {
        document.getElementById('pomem-area').classList.remove('hidden');
        baslik.innerText = "POMEM Puan Hesaplama Aracı";
    } else if(type === 'tyt') {
        document.getElementById('tyt-area').classList.remove('hidden');
        baslik.innerText = "TYT Puan Hesaplama Aracı";
    } else if(type === 'kpss') {
        document.getElementById('kpss-area').classList.remove('hidden');
        baslik.innerText = "KPSS Puan Hesaplama Aracı";
    }
}

function anaMenuyeDon() {
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}

// Temizle Butonları (Tüm inputları ve checkboxları temizler)
document.querySelectorAll('.btn-temizle').forEach(btn => {
    btn.addEventListener('click', function() {
        const parentArea = this.closest('.tool-area');
        parentArea.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
        parentArea.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    });
});

// Üniversite Ders Ekleme Fonksiyonu
function dersEkle() {
    const ad = document.getElementById('ders-adi').value || "Ders";
    const v = parseFloat(document.getElementById('vize-not').value) || 0;
    const vy = parseFloat(document.getElementById('vize-yuzde').value) || 40;
    const f = parseFloat(document.getElementById('final-not').value) || 0;
    const fy = parseFloat(document.getElementById('final-yuzde').value) || 60;

    // Yüzdelere göre ortalama hesaplama
    const ortalama = (v * (vy / 100)) + (f * (fy / 100));

    // Harf notu belirleme (Standart skala)
    let harf = "FF";
    if (ortalama >= 90) harf = "AA";
    else if (ortalama >= 80) harf = "BA";
    else if (ortalama >= 70) harf = "BB";
    else if (ortalama >= 60) harf = "CB";
    else if (ortalama >= 50) harf = "CC";
    else if (ortalama >= 45) harf = "DC";

    const tablo = document.getElementById('tablo-govde');
    const satir = tablo.insertRow();

    satir.innerHTML = `
        <td>${ad}</td>
        <td>${v} <small>(%${vy})</small></td>
        <td>${f} <small>(%${fy})</small></td>
        <td><strong>${ortalama.toFixed(2)}</strong></td>
        <td class="harf-notu">${harf}</td>
        <td><button class="delete-btn" onclick="dersSil(this)">Sil</button></td>
    `;

    // Inputları temizle (Yüzdeler kalsın)
    document.getElementById('ders-adi').value = "";
    document.getElementById('vize-not').value = "";
    document.getElementById('final-not').value = "";
}

function dersSil(btn) {
    // Butonun bulunduğu satırı bul ve kaldır
    btn.closest('tr').remove();
}

function hesaplaDGS() {
    // 1. Verileri Al
    const sayD = parseFloat(document.getElementById('dgs-say-d').value) || 0;
    const sayY = parseFloat(document.getElementById('dgs-say-y').value) || 0;
    const sozD = parseFloat(document.getElementById('dgs-soz-d').value) || 0;
    const sozY = parseFloat(document.getElementById('dgs-soz-y').value) || 0;
    const obp = parseFloat(document.getElementById('dgs-obp').value) || 0;

    // 2. Netleri Hesapla (4 Yanlış 1 Doğruyu Götürür)
    const sayNet = Math.max(0, sayD - (sayY / 4));
    const sozNet = Math.max(0, sozD - (sozY / 4));

    // 3. Puanları Hesapla (DGS Yaklaşık Katsayıları)
    // Katsayılar her yıl değişse de standart formül: 
    // Taban Puan + (Sayısal Net * Katsayı) + (Sözel Net * Katsayı) + (ÖBP * 0.6)
    const pSAY = (145 + (sayNet * 3.2) + (sozNet * 0.5) + (obp * 0.6)).toFixed(3);
    const pSOZ = (120 + (sayNet * 0.5) + (sozNet * 3.1) + (obp * 0.6)).toFixed(3);
    const pEA = (130 + (sayNet * 1.8) + (sozNet * 1.8) + (obp * 0.6)).toFixed(3);

    // 4. Sonuç Ekranını Oluştur (2. Ekteki Görsel Yapı)
    const sonucBox = document.getElementById('dgs-sonuc-konteynir');
    sonucBox.innerHTML = `
        <div class="result-header">Sınav Sonuç Detayları</div>
        <div class="net-summary">
            <div class="net-item">Sayısal Net: <span>${sayNet.toFixed(2)}</span></div>
            <div class="net-item">Sözel Net: <span>${sozNet.toFixed(2)}</span></div>
        </div>
        <div class="score-table">
            <div class="score-row">
                <span>DGS Sayısal</span>
                <span class="score-val">${pSAY}</span>
            </div>
            <div class="score-row">
                <span>DGS Sözel</span>
                <span class="score-val">${pSOZ}</span>
            </div>
            <div class="score-row">
                <span>DGS Eşit Ağırlık</span>
                <span class="score-val">${pEA}</span>
            </div>
        </div>
        <p class="disclaimer">* Puanlar standart sapma hariç yaklaşık değerlerdir.</p>
    `;

    // Gizli alanı göster
    sonucBox.classList.remove('hidden');
}

function dgsTemizle() {
    document.querySelectorAll('#dgs-area input').forEach(i => i.value = '');
    document.getElementById('dgs-sonuc-konteynir').classList.add('hidden');
}

// KPSS Alan Gizleme/Gösterme
function kpssAlanGoster(isLisans) {
    const alan = document.getElementById('kpss-lisans-alanlari');
    alan.style.display = isLisans ? 'block' : 'none';
    // Sonucu temizle
    document.getElementById('kpss-sonuc-konteynir').classList.add('hidden');
}

function hesaplaKPSS() {
    const isLisans = document.getElementById('kpss-lisans').checked;
    
    // Yardımcı fonksiyon: Net hesapla
    const netHesapla = (dId, yId) => {
        const d = parseFloat(document.getElementById(dId)?.value) || 0;
        const y = parseFloat(document.getElementById(yId)?.value) || 0;
        return Math.max(0, d - (y / 4));
    };

    // Netleri al
    const gyNet = netHesapla('kpss-gy-d', 'kpss-gy-y');
    const gkNet = netHesapla('kpss-gk-d', 'kpss-gk-y');

    let sonucHTML = `
        <div class="result-header">Hesaplama Sonuçları</div>
        <div style="padding: 20px;">
            <p><strong>Genel Yetenek:</strong> ${gyNet.toFixed(2)} net</p>
            <p><strong>Genel Kültür:</strong> ${gkNet.toFixed(2)} net</p>`;

    if (isLisans) {
        // Lisans derslerini ekle
        const hukukNet = netHesapla('kpss-hukuk-d', 'kpss-hukuk-y');
        const iktisatNet = netHesapla('kpss-iktisat-d', 'kpss-iktisat-y');
        // ... Diğer dersleri de buraya ekleyebilirsin ...

        sonucHTML += `<p><strong>Hukuk:</strong> ${hukukNet.toFixed(2)} net</p>`;
        sonucHTML += `<p><strong>İktisat:</strong> ${iktisatNet.toFixed(2)} net</p>`;
    }

    // Puan (Örnek katsayılar ile)
    const puan = (70 + (gyNet * 0.5) + (gkNet * 0.5)).toFixed(5);
    
    sonucHTML += `
        <hr class="divider" style="margin: 15px 0;">
        <div class="score-row">
            <span>Sınav Yılı:</span>
            <span class="score-val" style="color: var(--text);">2024</span>
        </div>
        <div class="score-row">
            <span>KPSSP1:</span>
            <span class="score-val">${puan}</span>
        </div>
    </div>`;

    const sonucBox = document.getElementById('kpss-sonuc-konteynir');
    sonucBox.innerHTML = sonucHTML;
    sonucBox.classList.remove('hidden');
}

// KPSS Sıfırlama
function kpssTemizle() {
    document.querySelectorAll('#kpss-area input[type="number"]').forEach(i => i.value = '');
    document.getElementById('kpss-sonuc-konteynir').classList.add('hidden');
}

function hesaplaPOMEM() {
    // Verileri al
    const kpss = parseFloat(document.getElementById('pomem-kpss').value) || 0;
    const fiziki = parseFloat(document.getElementById('pomem-fiziki').value) || 0;
    const mulakat = parseFloat(document.getElementById('pomem-mulakat').value) || 0;

    // Ortalama hesapla
    const ortalama = (kpss + fiziki + mulakat) / 3;
    
    // Durum belirle (50 barajı)
    const gectiMi = ortalama >= 50;
    const sonucMetni = gectiMi ? "Hak kazandınız !" : "Tekrar deneyiniz.";
    const sonucRengi = gectiMi ? "#22c55e" : "#ef4444"; // Yeşil veya Kırmızı

    const sonucBox = document.getElementById('pomem-sonuc-konteynir');
    
    // HTML içeriği (Animasyon CSS'deki slideUp ile otomatik tetiklenir)
    sonucBox.innerHTML = `
        <div class="result-header">POMEM Değerlendirme Sonucu</div>
        <div style="padding: 20px;">
            <div class="score-row">
                <span>Ortalama Puanınız:</span>
                <span class="score-val" style="color: ${sonucRengi}">${ortalama.toFixed(2)}</span>
            </div>
            <div class="score-row" style="border-bottom: none;">
                <span>Durum:</span>
                <span class="score-val" style="color: ${sonucRengi}; font-size: 1.3rem;">${sonucMetni}</span>
            </div>
        </div>
    `;

    sonucBox.classList.remove('hidden');
}

function pomemTemizle() {
    document.getElementById('pomem-kpss').value = '';
    document.getElementById('pomem-fiziki').value = '';
    document.getElementById('pomem-mulakat').value = '';
    document.getElementById('pomem-sonuc-konteynir').classList.add('hidden');
}

function hesaplaMSU() {
    // Netleri Hesapla yardımcı fonksiyonu
    const getNet = (dId, yId) => {
        const d = parseFloat(document.getElementById(dId).value) || 0;
        const y = parseFloat(document.getElementById(yId).value) || 0;
        return Math.max(0, d - (y / 4));
    };

    const trNet = getNet('msu-tr-d', 'msu-tr-y');
    const sosNet = getNet('msu-sos-d', 'msu-sos-y');
    const matNet = getNet('msu-mat-d', 'msu-mat-y');
    const fenNet = getNet('msu-fen-d', 'msu-fen-y');

    // Şart Kontrolü: Türkçe veya Matematikten en az 0.5 net
    if (trNet < 0.5 && matNet < 0.5) {
        alert("Puanınızın hesaplanabilmesi için Türkçe veya Temel Matematik testinden en az 0,5 net yapmanız gerekmektedir.");
        return;
    }

    // Puan Hesaplama (Yaklaşık katsayılar ile 100-500 arası ölçeklendirme)
    // Katsayılar verdiğin ağırlık yüzdelerine göredir.
    const base = 100; // Başlangıç puanı
    const msuSA = (base + (matNet * 3.5) + (fenNet * 3.0) + (trNet * 2.5) + (sosNet * 1.0)).toFixed(3);
    const msuEA = (base + (matNet * 3.5) + (trNet * 3.5) + (sosNet * 2.0) + (fenNet * 1.0)).toFixed(3);
    const msuSO = (base + (trNet * 3.5) + (sosNet * 3.5) + (matNet * 2.0) + (fenNet * 1.0)).toFixed(3);
    const msuGN = (base + (trNet * 3.3) + (matNet * 3.3) + (fenNet * 1.7) + (sosNet * 1.7)).toFixed(3);

    const sonucBox = document.getElementById('msu-sonuc-konteynir');
    sonucBox.innerHTML = `
        <div class="result-header">MSÜ Sınav Sonuçları</div>
        <div class="net-summary" style="background: var(--light-blue); padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="net-item" style="color: white">Türkçe: <span>${trNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Matematik: <span>${matNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Sosyal: <span>${sosNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Fen: <span>${fenNet.toFixed(2)}</span></div>
        </div>
        <div class="score-table">
            <div class="score-row"><span>MSÜ Sayısal (SA)</span> <span class="score-val">${msuSA}</span></div>
            <div class="score-row"><span>MSÜ Eşit Ağırlık (EA)</span> <span class="score-val">${msuEA}</span></div>
            <div class="score-row"><span>MSÜ Sözel (SÖ)</span> <span class="score-val">${msuSO}</span></div>
            <div class="score-row"><span>MSÜ Genel (GN)</span> <span class="score-val">${msuGN}</span></div>
        </div>
        <p class="disclaimer">* Puanlar katsayılar doğrultusunda yaklaşık olarak hesaplanmıştır.</p>
    `;

    sonucBox.classList.remove('hidden'); // slideUp animasyonu otomatik başlar
}

function msuTemizle() {
    document.querySelectorAll('#msu-area input').forEach(i => i.value = '');
    document.getElementById('msu-sonuc-konteynir').classList.add('hidden');
}

function hesaplaTYT() {
    const getNet = (dId, yId) => {
        const d = parseFloat(document.getElementById(dId).value) || 0;
        const y = parseFloat(document.getElementById(yId).value) || 0;
        return Math.max(0, d - (y * 0.25));
    };

    const trNet = getNet('tyt-tr-d', 'tyt-tr-y');
    const sosNet = getNet('tyt-sos-d', 'tyt-sos-y');
    const matNet = getNet('tyt-mat-d', 'tyt-mat-y');
    const fenNet = getNet('tyt-fen-d', 'tyt-fen-y');
    const diplomaNotu = parseFloat(document.getElementById('tyt-obp').value) || 0;

    // TYT Ham Puan Hesaplama (100 Taban + Netler * Katsayılar)
    const hamPuan = 100 + (trNet * 1.32) + (matNet * 1.32) + (sosNet * 1.36) + (fenNet * 1.36);
    
    // Yerleştirme Puanı (OBP = Diploma Notu * 0.6)
    const obpPuani = diplomaNotu * 0.6;
    const yerlestirmePuani = hamPuan + obpPuani;

    const sonucBox = document.getElementById('tyt-sonuc-konteynir');
    sonucBox.innerHTML = `
        <div class="result-header">TYT Sınav Sonuç Detayları</div>
        <div class="net-summary" style="background: var(--light-blue); padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="net-item" style="color: white">Türkçe: <span>${trNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Matematik: <span>${matNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Sosyal: <span>${sosNet.toFixed(2)}</span></div>
            <div class="net-item" style="color: white">Fen: <span>${fenNet.toFixed(2)}</span></div>
        </div>
        <div class="score-table">
            <div class="score-row">
                <span>TYT Ham Puan</span>
                <span class="score-val" style="color: var(--light-blue)">${hamPuan.toFixed(3)}</span>
            </div>
            <div class="score-row">
                <span>OBP Katkısı</span>
                <span class="score-val" style="color: var(--text)">+${obpPuani.toFixed(3)}</span>
            </div>
            <div class="score-row" style="border-top: 2px solid var(--border); margin-top: 10px;">
                <span class="font-bold">Yerleştirme Puanı</span>
                <span class="score-val" style="font-size: 1.4rem; color: #22c55e;">${yerlestirmePuani.toFixed(3)}</span>
            </div>
        </div>
    `;

    sonucBox.classList.remove('hidden');
}

function tytTemizle() {
    document.querySelectorAll('#tyt-area input').forEach(i => i.value = '');
    document.getElementById('tyt-sonuc-konteynir').classList.add('hidden');
}

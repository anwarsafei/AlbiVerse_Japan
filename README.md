# Absensi AlbiFirst: Panduan Setup

Total waktu sekitar 15 menit. Semua layanan yang dipakai gratis.

## 1. Google Sheet + Apps Script
1. Buat Google Sheet baru, misalnya "Absensi AlbiFirst".
2. Buka menu **Extensions > Apps Script**.
3. Hapus isi `Code.gs` bawaan, lalu tempel isi file `Code.gs` dari paket ini.
4. Ganti `TOKEN` dengan kata rahasia, misalnya `albi-2026-xyz`.
5. Klik **Deploy > New deployment**, pilih ⚙️ lalu **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Klik **Deploy**, izinkan akses (Advanced > Go to project), lalu **salin URL Web App** (berakhiran `/exec`).

> Kalau `Code.gs` diubah, deploy ulang lewat **Deploy > Manage deployments > ✏️ > Version: New version** agar URL-nya tetap sama.

## 2. Hosting di GitHub Pages
1. Buat repo baru (publik), misalnya `albifirst`.
2. Upload `index.html` dan folder `assets/` (berisi `sakura.webp` dan `fuji.svg`) lewat **Add file > Upload files**.
3. Buka **Settings > Pages**, lalu pilih Source: *Deploy from a branch*, Branch: `main` / root, lalu **Save**.
4. Tunggu sekitar 1 menit. Halaman bisa dibuka di `https://USERNAME.github.io/albifirst/`.

## 3. Setup di tablet
1. Buka URL tersebut di **Chrome (Android)**.
2. **Tekan lama judul "🌳 AlbiFirst" selama 2 detik** untuk membuka Panel Panitia.
3. Isi **URL Web App** dan **Token**, lalu Simpan. Indikator di pojok kanan bawah akan berubah menjadi hijau "Tersimpan ke Sheet".
4. Saat diminta, izinkan akses mikrofon.
5. Tekan ⛶ Layar penuh. Supaya lebih rapi, pakai menu Chrome > **Add to Home screen**.

Bisa memakai beberapa tablet sekaligus: pohon kehadiran di semua tablet tersinkron tiap 20 detik.

## Fitur
- Alurnya: anak pilih hewan, menyebut nama (Web Speech API, `id-ID`), ortu cek/perbaiki ejaan + usia, simpan, lalu animasi sambutan dengan suara.
- Pohon kehadiran bertambah setiap ada anak yang datang, dengan perayaan setiap kelipatan 10 anak.
- **Antrean offline**: kalau internet putus, data disimpan di tablet lalu dikirim otomatis setelah tersambung lagi.
- Panel Panitia bisa menghapus input yang salah.
- Layar kembali ke beranda jika tidak disentuh selama 90 detik.

## Catatan
- Web Speech API di Chrome memproses suara lewat server Google, jadi **perlu internet**. Kalau internet putus, nama tetap bisa diketik.
- Anak usia TK sering mengucapkan nama dengan kurang jelas, jadi konfirmasi oleh ortu tetap penting.
- Token terlihat di kode/browser. Itu cukup untuk mencegah iseng di acara sehari, tapi jangan simpan data sensitif.
- Tanpa URL, aplikasi berjalan dalam **Mode demo** (data hanya tersimpan di tablet), cocok untuk uji coba.

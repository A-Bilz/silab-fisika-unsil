# Website Sistem Informasi & Inventaris Laboratorium Kampus (SILAB)

Paket proyek ini berisi kode sumber lengkap untuk website **Peralatan dan Inventaris Laboratorium Kampus** yang terinspirasi dari tata letak bersih bergaya Site123 dan telah memenuhi seluruh 6 spesifikasi halaman yang diminta.

---

## Struktur Direktori Proyek

```text
campus_lab_website/
├── index.html        # Halaman utama dengan sistem navigasi 6 halaman (SPA)
├── css/
│   └── style.css     # Desain responsif modern, tabel, katalog, dan modal kartu alat
├── js/
│   └── app.js        # Data inventaris laboratorium, pencarian katalog, filter, dan modal Kartu Alat
└── README.md         # Dokumentasi panduan kustomisasi & deployment untuk AI Agent
```

---

## Fitur Lengkap Sesuai Kebutuhan (6 Halaman)

1. **Halaman 1 — Beranda (Utama):**
   - Deskripsi lengkap laboratorium
   - Galeri gambar fasilitas laboratorium
   - Alamat, kontak, dan jam operasional
   - Visi dan Misi laboratorium
2. **Halaman 2 — Disiplin Laboratorium:**
   - Tata Tertib Laboratorium
   - Prosedur Pemeliharaan Alat (Preventive Maintenance)
   - Prosedur Perawatan Alat (Pembersihan, Kalibrasi, dan Perbaikan)
3. **Halaman 3 — Daftar Judul Praktikum:**
   - Tabel daftar mata kuliah praktikum, kode MK, rincian judul modul praktikum per semester, dan nama koordinator.
4. **Halaman 4 — Administrasi & Mekanisme Peminjaman (Integrasi Google Form):**
   - Penjelasan mekanisme/alur peminjaman
   - Tombol tautan Google Form (GForm) untuk:
     1. Surat Peminjaman Laboratorium
     2. Surat Peminjaman Alat
     3. Berita Acara Peminjaman Alat dan Barang
     4. Berita Acara Pengembalian Alat dan Barang
5. **Halaman 5 — Katalog Alat Laboratorium & Kartu Alat:**
   - Katalog peralatan dengan fitur pencarian langsung (live search) dan filter kategori.
   - **Kartu Alat Digital (Modal Popup & Cetak):** Menampilkan Kode Inventaris, Nama Alat, Merk/Tipe, Spesifikasi, Jumlah, Kondisi, Lokasi Penyimpanan, Tanggal Kalibrasi Terakhir, Jadwal Perawatan Berikutnya, serta SOP ringkas.
6. **Halaman 6 — Tarif Layanan:**
   - Tabel rincian tarif sewa alat, layanan analisis sampel, dan pemakaian laboratorium untuk Mahasiswa Internal, Dosen/Peneliti, dan Umum/Instansi Luar.

---

## Panduan Kustomisasi (Untuk Admin / AI Agent)

### 1. Mengganti Link Google Form (GForm)
Buka file `index.html` pada bagian `<!-- HALAMAN 4: ADMINISTRASI & PEMINJAMAN (GFORM) -->`, lalu ganti URL placeholder berikut dengan link Google Form asli milik laboratorium Anda:
- `https://docs.google.com/forms/d/e/1FAIpQLSd_CONTOH_PINJAM_LAB/viewform`
- `https://docs.google.com/forms/d/e/1FAIpQLSd_CONTOH_PINJAM_ALAT/viewform`
- `https://docs.google.com/forms/d/e/1FAIpQLSd_CONTOH_BA_PEMINJAMAN/viewform`
- `https://docs.google.com/forms/d/e/1FAIpQLSd_CONTOH_BA_PENGEMBALIAN/viewform`

### 2. Menambah atau Mengubah Data Alat & Kartu Alat
Buka file `js/app.js` dan ubah array `equipmentData`. Setiap objek memiliki struktur:
```javascript
{
  code: "LAB-OPT-001",
  name: "Nama Alat",
  category: "Optik & Analisis",
  brand: "Merk / Tipe",
  quantity: "12 Unit",
  condition: "Baik / Terkalibrasi",
  location: "Lemari Optik A-1",
  lastCalibration: "12 Agustus 2026",
  nextMaintenance: "12 Februari 2027",
  specs: "Spesifikasi teknis alat",
  sop: "Langkah-langkah penggunaan alat"
}
```

---

## Instruksi Deployment untuk AI Agent (Automated Deployment Guide)

Proyek ini adalah **Static Web Application** murni (HTML5, CSS3, Vanilla JS) tanpa ketergantungan build step yang rumit, sehingga AI Agent dapat langsung melakukan deployment ke berbagai platform:

### Opsi A: Deploy ke Vercel (via CLI)
```bash
npx vercel deploy ./campus_lab_website --prod --yes
```

### Opsi B: Deploy ke Netlify (via CLI)
```bash
npx netlify-cli deploy --dir=./campus_lab_website --prod
```

### Opsi C: Deploy ke GitHub Pages
1. Inisialisasi repositori Git di dalam folder `campus_lab_website`:
   ```bash
   cd campus_lab_website
   git init
   git add .
   git commit -m "Initial commit: Campus Lab Equipment & Inventory Website"
   ```
2. Push ke branch `main` pada GitHub dan aktifkan **GitHub Pages** dari branch `main` (root `/`).

### Opsi D: Menjalankan Secara Lokal / Server Docker Nginx
Untuk pratinjau lokal menggunakan Python:
```bash
cd campus_lab_website
python3 -m http.server 8080
```
Atau salin isi folder `campus_lab_website` ke `/usr/share/nginx/html` pada container `nginx:alpine`.

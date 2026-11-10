# SILAB FISIKA UNSIL - Panduan Pengembangan & Modifikasi (AI-Ready)

Aplikasi web portal statis enam halaman untuk **Laboratorium Pendidikan Fisika**, Fakultas Keguruan dan Ilmu Pendidikan (FKIP), **Universitas Siliwangi (UNSIL)** Kampus I, Tasikmalaya.

Dibangun dengan prinsip arsitektur **Zero-Framework**: murni HTML5 semantik, CSS3 responsif, dan Vanilla JavaScript ES6 tanpa bundler rumit. Sangat cepat, hemat sumber daya, dan ramah untuk dimodifikasi baik secara manual maupun menggunakan asisten AI (ChatGPT, Claude, Codex, Copilot, dll).

---

## 🌸 PANDUAN KHUSUS CIMOT: CARA EDIT WEB PAKE GOOGLE ANTIGRAVITY / AI

Bagian ini dibuat khusus agar Cimot bisa langsung mengedit, menambah data, atau mengubah tampilan web dengan mudah memakai AI Google Antigravity tanpa takut webnya error atau rusak.

### 🗺️ Peta Cepat: Mau Edit Apa? Buka File Mana?

| Yang Mau Diedit | File yang Dibuka | Keterangan Singkat |
| :--- | :--- | :--- |
| **Ganti Jam Layanan & Link Form** | `js/config.js` | Tempat ganti jam buka lab, no WA laboran, dan tautan Google Form / Spreadsheet. |
| **Tambah / Edit Alat & Pasang Foto** | `js/equipment-data.js` | Daftar 50 master alat lab lengkap dengan nama, spesifikasi, SOP, dan foto fisik. |
| **Ganti Tulisan Web, Visi-Misi, Kontak** | `index.html` | Struktur teks utama web dari Halaman 1 sampai Halaman 6. |
| **Logika Sistem & Berita Acara** | `js/app.js` | Otak web: pencarian alat, keranjang peminjaman, Berita Acara digital, dan modal SOP. |
| **Warna, Ukuran Huruf, Tampilan** | `css/style.css` | Tampilan visual, warna kuning keemasan UNSIL (`#f59e0b`), dan mode cetak. |
| **Foto Fisik Alat Lab** | Folder `images/equipment_gallery/` | Tempat menyimpan file gambar `.jpg` foto alat laboratorium. |

---

### 📸 Cara Menambah atau Mengganti Foto Alat Laboratorium

1. **Simpan file foto:**
   Masukkan file foto alat ke dalam folder `images/equipment_gallery/`, misalnya `foto-77.jpg` atau `alat-mikrometer.jpg`.
2. **Buka file `js/equipment-data.js`:**
   Cari nama alat yang mau diganti fotonya (tekan `Ctrl + F` lalu ketik nama alatnya).
3. **Ubah baris `"image":`:**
   Ganti nama filenya menjadi:
   ```javascript
   "image": "images/equipment_gallery/foto-77.jpg"
   ```
4. Simpan file (`Ctrl + S`). Foto otomatis akan langsung muncul di kartu katalog dan modal detail alat!

---

### 🤖 Kumpulan Prompt Siap Pakai untuk Google Antigravity / AI

Tinggal salin (copy-paste) prompt di bawah ini ke dalam Google Antigravity atau asisten AI kamu:

#### 📌 Prompt 1: Mau Tambah Alat Baru ke Katalog
```text
Halo Google Antigravity, tolong tambahkan 1 alat baru ke dalam array window.EQUIPMENT_DATA pada file js/equipment-data.js:
- Nama Alat: [Nama Alat, contoh: Osiloskop Digital 100MHz]
- Kategori: [Pilih salah satu: Mekanika & Kalibrasi / Listrik & Magnet / Optik & Gelombang / Termodinamika & Fluida / Elektronika & Instrumentasi / Fisika Modern & Inti]
- Lokasi Simpan: [contoh: Lemari Instrumentasi C-1]
- Jumlah: [contoh: 2 Unit]
- Kondisi: Baik (Siap Pakai)
- Foto: images/equipment_gallery/[nama-file-foto.jpg]
- Buatkan 4 langkah SOP ringkas pengoperasiannya dalam bahasa Indonesia.
Pastikan format objek JSON-nya valid dan tidak mengubah alat-alat yang sudah ada.
```

#### 📌 Prompt 2: Mau Update Jam Buka Lab atau Nomor WhatsApp Laboran
```text
Halo Google Antigravity, tolong perbarui data operasional pada file js/config.js:
- Jam Layanan: [contoh: Senin - Jumat, 08.00 - 15.30 WIB]
- Nomor WhatsApp Laboran: [contoh: 0812-2241-517]
- Link Google Form Peminjaman Alat: [contoh: https://forms.gle/ContohLinkAlat]
Pastikan penulisan objek window.SILAB_CONFIG tetap rapi dan valid.
```

#### 📌 Prompt 3: Mau Edit Teks Pengumuman / Aturan Lab di Halaman Web
```text
Halo Google Antigravity, tolong buka file index.html pada bagian #halaman-2 (Aturan K3 & Disiplin Lab).
Saya ingin mengganti poin aturan nomor [X] menjadi:
"[Tuliskan teks aturan baru di sini]"
Pertahankan tag HTML, ikon, dan class CSS yang ada agar tampilannya tetap konsisten.
```

#### 📌 Prompt 4: Mau Ubah Format atau Teks Berita Acara (D-03 / D-04)
```text
Halo Google Antigravity, tolong periksa fungsi cetak dan modal Berita Acara di js/app.js.
Saya ingin menyesuaikan bagian kop surat atau keterangan tanda tangan Berita Acara menjadi:
- Nama Laboran: [Nama Lengkap]
- NIP: [Nomor NIP]
Jangan hapus ID tombol atau struktur modal #beritaAcaraModal agar fungsi klik di web tetap bekerja normal.
```

---

### ⚠️ Aturan Emas untuk AI / Google Antigravity (Jangan Dilanggar!)

Jika kamu meminta AI melakukan perubahan kode yang cukup banyak, selalu sertakan **4 Aturan Emas** ini di akhir instruksi kamu:

1. **JANGAN gunakan framework eksternal:** Web ini murni HTML5, CSS3, dan Vanilla JavaScript. Jangan tambahkan React, Vue, Tailwind, atau bundler (Vite/Webpack).
2. **JANGAN ubah ID navigasi halaman:** ID seksi wajib tetap `#halaman-1` sampai `#halaman-6` karena digunakan oleh sistem perpindahan tab tanpa reload.
3. **Selalu gunakan `escapeHTML()`:** Setiap data teks dari luar yang dimasukkan ke HTML dinamis wajib dibungkus fungsi `escapeHTML(...)` agar aman dari celah keamanan.
4. **Jaga Aksesibilitas:** Jangan menghapus atribut `aria-*`, penanganan tombol `Escape`, dan pastikan semua tombol dapat diakses keyboard.

---

## 🚀 Menjalankan Secara Lokal

Buka `index.html` langsung di browser, atau gunakan server pengembangan lokal:

```sh
# Instalasi alat pengujian (opsional, hanya perlu sekali)
npm install

# Jalankan server lokal
npm start
```

Aplikasi dapat diakses di `http://127.0.0.1:8080`.
Untuk deployment ke Vercel / Netlify / GitHub Pages, cukup unggah folder proyek apa adanya tanpa proses build.

---

## 📁 Struktur Direktori & Tanggung Jawab File

```text
campus_lab_website/
├── index.html          # Kerangka 6 halaman (#halaman-1 s/d #halaman-6) & modal dialog
├── css/
│   └── style.css       # Desain tema UNSIL (#f59e0b, #0f172a), layout mobile-first, print CSS
├── js/
│   ├── config.js       # [TEMPAT EDIT UTAMA] Konfigurasi URL Google Form & jam operasional
│   └── app.js          # [LOGIKA & DATA] Data alat, praktikum, SPA routing, filter & modal
├── tests/
│   └── application.cjs # Test suite Playwright + Axe-core WCAG A/AA
└── README.md           # Panduan teknis & cheatsheet prompt AI ini
```

---

## 🛠️ Panduan Modifikasi Cepat (Cheat Sheet)

### 1. Menghubungkan Google Form Resmi
Edit file `js/config.js`. Ganti nilai `null` dengan tautan HTTPS Google Form resmi:
```javascript
window.SILAB_CONFIG = {
  serviceHours: "Senin - Jumat, 08.00 - 15.30 WIB",
  forms: {
    room: "https://forms.gle/ContohLinkRuang",
    equipment: "https://forms.gle/ContohLinkAlat",
    checkout: "https://forms.gle/ContohLinkBAPeminjaman",
    return: "https://forms.gle/ContohLinkBAPengembalian",
  },
};
```
*Catatan:* Tombol di Halaman 04 akan otomatis berubah menjadi tautan aktif begitu URL diisi. Jika dibiarkan `null`, sistem otomatis menampilkan tombol permintaan via email prodi.

### 2. Menambah Alat Baru ke Katalog
Buka `js/app.js`, cari array `equipmentData`, lalu tambahkan objek alat baru:
```javascript
{
  code: "FIS-GEL-009",
  name: "Tangki Riak Gelombang Air (Ripple Tank)",
  category: "Optik & Gelombang",
  location: "Usulan: lemari gelombang A-3",
  specs: "Tangki riak transparan, pembangkit getar frekuensi variabel, sumber cahaya stroboskopik.",
  calibrationPlan: "Verifikasi frekuensi getar dan kerataan tangki sebelum sesi.",
  sop: [
    "Periksa kedataran tangki riak dan isi air bersih setinggi 5-10 mm.",
    "Pasang pembangkit getar dan celupkan bilah getar menyentuh permukaan air tipis-tipis.",
    "Nyalakan sumber getar dan lampu stroboskop, amati pola gelombang pada layar bayangan.",
    "Keringkan tangki setelah digunakan dan simpan unit stroboskop pada wadah pelindung."
  ]
}
```
*Kategori akan otomatis masuk ke dropdown filter di Halaman 05.*

### 3. Menambah atau Mengubah Mata Kuliah Praktikum
Buka `js/app.js`, cari array `courses`. Format tuple:
`[Kode_MK, Semester_Romawi, Nama_Praktikum, [Array_Modul]]`
```javascript
[
  "LAB-FIS-103",
  "II",
  "Praktikum Termodinamika & Gelombang",
  ["Azas Black", "Konduktivitas Panas", "Resonansi Bunyi", "Kecepatan Gelombang Tali"]
]
```

### 4. Menyesuaikan Teks Identitas, Kontak, atau Pimpinan
Buka `index.html`:
- **Pimpinan Prodi:** Cari seksi `<section id="halaman-1">`, temukan judul `Kepemimpinan akademik` (sekitar baris 160).
- **Kontak & Jam Layanan:** Temukan blok `Kontak resmi` di baris 200.
- **Aturan K3 / Disiplin Lab:** Buka seksi `<section id="halaman-2">` (sekitar baris 230).

---

## 🤖 Panduan Khusus Modifikasi Menggunakan AI (ChatGPT / Claude / Codex)

Jika kamu ingin meminta asisten AI melakukan kustomisasi kode, salin instruksi berikut bersama perintah kamu agar AI **tidak merusak** arsitektur dan fungsionalitas situs.

### ⚠️ Aturan Emas untuk AI (System Guardrails):
1. **Pertahankan Zero-Framework:** Jangan menambahkan React, Vue, Tailwind, atau bundler (Webpack/Vite). Tetap gunakan Vanilla HTML/CSS/JS murni.
2. **Keamanan Sanitasi XSS:** Setiap rendering data string dinamis ke dalam innerHTML **wajib** menggunakan pembungkus `escapeHTML(string)`.
3. **Pertahankan Routing Hash:** Seluruh seksi navigasi harus tetap menggunakan ID `#halaman-1` sampai `#halaman-6` dan kelas `.page-section`.
4. **Jaga Aksesibilitas (WCAG A/AA):**
   - Jangan hapus `aria-expanded`, `aria-controls`, `aria-labelledby`, atau `role="status"`.
   - Pastikan kontras warna teks tetap memenuhi rasio minimal 4.5:1.
   - Pertahankan fitur penanganan fokus keyboard dan tombol `Escape` pada modal kartu alat dan menu navigasi.
5. **Pertahankan Struktur Testing:** Setelah mengedit kode, selalu jalankan `npm test` untuk memastikan semua uji otomatis (responsivitas 320px-1440px dan audit axe-core) tetap 100% lulus.

---

### 📋 Contoh Template Prompt Siap Pakai untuk AI:

#### Contoh Prompt 1: Menambah Alat Laboratorium
> *"Tolong tambahkan alat baru ke dalam array `equipmentData` di file `js/app.js`. Nama alat: 'Jembatan Wheatstone & Galvanometer Presisi', kategori: 'Elektronika & Instrumentasi', lokasi: 'rak B-2'. Sertakan spesifikasi teknis, usulan kalibrasi, serta 4 langkah SOP pengoperasian ringkas dalam bahasa Indonesia. Jangan ubah struktur fungsi lainnya."*

#### Contoh Prompt 2: Mengubah Data Kontak atau Jam Buka
> *"Tolong perbarui jam layanan resmi di `js/config.js` menjadi 'Senin - Kamis: 08.00 - 15.00 WIB, Jumat: 08.00 - 14.30 WIB'. Pastikan sintaks objek SILAB_CONFIG tetap valid."*

#### Contoh Prompt 3: Menambah Poin SOP Keselamatan K3
> *"Buka file `index.html` pada bagian `<section id="halaman-2">` (Disiplin Lab). Tolong tambahkan satu kartu aturan baru untuk 'Penanganan Bahan Kimia & Larutan Pembersih Optik' di dalam `.safety-grid`. Gunakan format elemen `<article class="card">` yang konsisten dengan kartu lainnya."*

---

## 🧪 Pengujian Kualitas & Kepatuhan Standar

Suite pengujian otomatis menggunakan Playwright dan engine Axe-core:

```sh
npm test
```

Suite ini menguji secara komprehensif:
- 42 pengujian responsivitas pada 7 ukuran layar (320px, 375px, 600px, 768px, 960px, 1280px, 1440px) tanpa ada elemen yang overflow horizontal.
- 0 pelanggaran otomatis WCAG 2.1 Level A & AA (kontras warna, ARIA semantics, keyboard navigation).
- Penguncian fokus modal `<dialog>`, penutupan via tombol Escape / klik backdrop, dan pemulihan fokus tombol.
- Filter live search, reset filter, dan penanganan status form Google Form.

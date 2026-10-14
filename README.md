# SILAB FISIKA UNSIL

Aplikasi statis enam halaman untuk Laboratorium Pendidikan Fisika, FKIP, Universitas Siliwangi Kampus I, Tasikmalaya. HTML, CSS, dan JavaScript tanpa framework atau dependensi runtime. Aset eksperimen berupa SVG lokal di sumber; tidak ada foto stok yang diklaim sebagai fasilitas UNSIL.

## Menjalankan

Buka `index.html` langsung, atau gunakan Node.js:

```sh
npm install
npm start
```

Buka http://127.0.0.1:8080. Untuk hosting statis, cukup unggah `index.html`, `css/`, dan `js/`. Server pengembangan hanya mendengarkan localhost. Tidak ada backend, penyimpanan permohonan, atau sistem pembayaran.

## Konten dan konfigurasi

- `index.html`: identitas, visi/misi berdasarkan brief, pimpinan, kontak, K3, alur peminjaman, serta struktur enam halaman.
- `js/app.js`: `equipmentData` (8 alat), 7 praktikum, kartu alat/SOP, pencarian/filter, navigasi hash dan riwayat browser.
- `js/config.js`: empat URL formulir dan jam layanan yang disetujui pengelola.
- `css/style.css`: desain responsif dan aturan cetak khusus kartu alat.

Isi `SILAB_CONFIG.forms.room`, `equipment`, `checkout`, dan `return` dengan URL HTTPS resmi `forms.gle/...` atau `docs.google.com/forms/...`. Nilai awal `null` sengaja tidak menuju formulir contoh. Selama URL belum tersedia, setiap tombol menampilkan status dan tautan email permintaan formulir. URL yang tidak valid ditolak. Isi `serviceHours` dengan teks jadwal yang telah dikonfirmasi.

### Data yang masih memerlukan pengesahan

Tarif dan dokumen penetapannya, jam layanan, URL formulir, nomor aset, model/jumlah unit, kondisi, lokasi, serta riwayat/tanggal kalibrasi tidak tersedia dalam brief. Antarmuka secara eksplisit menandai informasi tersebut belum terverifikasi. Lokasi penyimpanan dan interval pemeriksaan di katalog merupakan usulan, bukan catatan inventaris resmi. Kartu cetak mempertahankan penanda ini. Jangan mengubah status menjadi siap pakai tanpa verifikasi laboran.

Tabel tarif memuat delapan instrumen dan enam kelompok layanan untuk ketiga kelompok pengguna. Untuk memublikasikan nominal, perbarui renderer `ratesBody` dan pemberitahuan tarif setelah menerima dokumen resmi; cantumkan sumber, tanggal berlaku, satuan, dan cakupan setiap tarif. Tidak ada tarif asumsi, klaim gratis, rekening, atau mekanisme pembayaran rekaan.

Kode mata kuliah, daftar modul, akreditasi, jabatan, dan kontak mengikuti detail yang diberikan pemilik proyek. Visi/misi merupakan perumusan dari arah pendidikan dalam brief, bukan kutipan dokumen keputusan. SOP adalah panduan umum; laboran harus menyesuaikannya dengan model aktual, manual pabrikan, penilaian risiko, dan SOP yang disahkan.

## Pengujian

```sh
npm ci
npx playwright install chromium
npm test
```

Tes menjalankan server lokal sementara dan Chromium headless. Cakupan: enam halaman pada 320, 375, 600, 768, 960, 1280, dan 1440 px; audit axe WCAG A/AA; pencarian gabungan/filter/reset; delapan dialog; fokus keyboard/Escape; cetak; empat tombol formulir dalam keadaan belum tersedia dan terkonfigurasi; URL validation; browser back; deep link; dan ukuran teks 200%. Hasil, tangkapan layar, serta contoh kartu PDF disimpan di `test-results/` (diabaikan Git). Pengujian otomatis tidak menggantikan pengujian dengan pengguna pembaca layar atau perangkat fisik.

`npm run format` merapikan seluruh sumber dengan Prettier.

## Pilihan desain

- ENERGY 2 / RHYTHM 2 / MOTION 1: layanan akademik yang tenang dengan hierarki editorial jelas.
- Emas UNSIL menandai tindakan utama dan halaman aktif; charcoal membingkai identitas, sementara slate menjadi aksen FKIP.
- Segoe UI/system font menjaga keterbacaan bahasa Indonesia dan akses offline tanpa pengunduhan font.
- Hero optik memberi konteks eksperimen; seluruh diagram diberi label ilustrasi dan tidak menyerupai lambang universitas.
- Baris semester memudahkan perbandingan modul; kartu digunakan untuk alat dan formulir yang bisa dipilih secara mandiri.
- Jarak antarseksi memisahkan informasi akademik, fasilitas, dan kontak; kolom berubah menjadi susunan tunggal pada ponsel.
- Dialog native memberi penguncian fokus dan Escape; warna fokus serta label input selalu tersedia. Gerak dibatasi pada umpan balik tombol.

## Referensi eksternal

- [OSHA Laser Hazards](https://www.osha.gov/laser-hazards) dan [Laboratory Safety Guidance](https://www.osha.gov/sites/default/files/publications/OSHA3404laboratory-safety-guidance.pdf) untuk prinsip keselamatan umum, bukan klaim sertifikasi/kepatuhan institusi.
- [Pengumuman DIFFRACTION](https://jurnal.unsil.ac.id/index.php/Diffraction/announcement) menyatakan perpindahan ke [ejournal.unsil.ac.id/index.php/diffraction](https://ejournal.unsil.ac.id/index.php/diffraction) sejak volume 8, Mei 2026.

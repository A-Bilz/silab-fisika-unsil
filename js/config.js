/**
 * SILAB FISIKA UNSIL - Konfigurasi Layanan & Formulir
 *
 * File ini adalah tempat utama untuk mengatur jam layanan dan tautan Google Form resmi.
 * Dapat diedit langsung secara manual atau melalui instruksi prompt AI.
 *
 * PANDUAN PENGISIAN:
 * 1. serviceHours: Isi dengan string jadwal, contoh: "Senin - Jumat, 08.00 - 15.30 WIB"
 * 2. forms: Isi dengan tautan lengkap HTTPS Google Form resmi ("https://forms.gle/..." atau "https://docs.google.com/forms/...").
 *    Jika tautan belum ada, biarkan tetap `null`. Sistem akan otomatis menampilkan status "Belum tersedia"
 *    dan tombol permintaan tautan via email resmi prodi.
 */
window.SILAB_CONFIG = {
  // Jam operasional resmi laboratorium (ganti null dengan teks jam buka jika sudah disahkan)
  serviceHours: null,

  // Tautan formulir permohonan dan berita acara resmi
  forms: {
    room: null, // Form 01: Peminjaman Ruang Lab Fisika
    equipment: null, // Form 02: Peminjaman Alat Fisika
    checkout: null, // Form 03: Berita Acara (BA) Peminjaman Alat
    return: null, // Form 04: Berita Acara (BA) Pengembalian Alat
  },
};

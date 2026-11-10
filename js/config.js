/**
 * SILAB FISIKA UNSIL - Konfigurasi Layanan & Formulir
 *
 * File ini adalah tempat utama untuk mengatur jam layanan dan tautan Google Form resmi.
 * Dapat diedit langsung secara manual atau melalui instruksi prompt AI (Google Antigravity).
 *
 * 🌸 PANDUAN CIMOT / GOOGLE ANTIGRAVITY:
 * 1. serviceHours: Isi dengan string jadwal, contoh: "Senin - Jumat, 08.00 - 15.30 WIB"
 * 2. forms: Isi dengan tautan lengkap HTTPS Google Form resmi ("https://forms.gle/..." atau "https://docs.google.com/forms/...").
 *    Jika tautan belum ada, biarkan tetap `null`.
 * 3. officialLinks: Ganti nomor WA atau tautan spreadsheet sesuai kontak resmi terbaru.
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

  // Tautan resmi & kontak operasional Lab Pendidikan Fisika UNSIL
  officialLinks: {
    waPLP: "https://wa.me/6282391976750",
    phonePLP: "0823-9197-6750",
    namePLP: "Laboran / PLP Fisika UNSIL",
    formEquipment: "https://forms.gle/eu4CZGbYu1TwrWec6",
    formReturn: "https://forms.gle/MvGYv9BxaR9zXPn57",
    formRoom: "https://forms.gle/4gtGYTmuNKnBYw8VA",
    sheetEquipment: "https://docs.google.com/spreadsheets/d/1pLms8u0h-KzzGCAdGwq-MxSu0V10XOoY5JBxDlTr0QQ/edit",
    sheetBHP: "https://docs.google.com/spreadsheets/d/1lcrLb97R9xGr88fYCfGLdD20OJwwXc7okAnZBG8yl9U/edit",
    sheetRates: "https://docs.google.com/spreadsheets/d/1YIpFCHxAgMYssIrZCRgoEXRgxiCevHW1eRDHDA8EAlw/edit",
    // Webhook Google Apps Script untuk pencatatan peminjaman otomatis langsung ke Google Sheets (tanpa Google Form)
    loanSyncEndpoint: null,
  },
};

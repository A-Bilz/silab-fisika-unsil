/**
 * SILAB FISIKA UNSIL - Google Apps Script Web App Endpoint
 * 
 * Skrip ini dipasang pada Google Sheet Rekap Peminjaman Lab Pendidikan Fisika UNSIL.
 * Berfungsi menerima data peminjaman langsung dari formulir website SILAB tanpa Google Form,
 * dan otomatis mencatat setiap baris pengajuan peminjaman ke dalam sheet ini secara real-time.
 * 
 * CARA PEMASANGAN (Cukup 1 Menit):
 * 1. Buka Google Sheet tempat Anda ingin menyimpan data peminjaman (misal: "Rekap Peminjaman Lab Fisika").
 * 2. Di menu atas Google Sheet, klik: Ekstensi (Extensions) > Apps Script.
 * 3. Hapus semua teks di editor Apps Script, lalu salin dan tempel (paste) seluruh kode di bawah ini.
 * 4. Klik tombol simpan (ikon disket).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Penerapan baru" (New deployment).
 * 6. Pada ikon gerigi "Pilih jenis", pilih "Aplikasi Web" (Web app).
 * 7. Isi:
 *    - Deskripsi: SILAB Peminjaman Endpoint
 *    - Jalankan sebagai: Saya (akun Anda)
 *    - Siapa yang memiliki akses: Siapa saja (Anyone) -> Agar formulir website bisa mengirim data.
 * 8. Klik "Terapkan" (Deploy) dan berikan izin akses Google Sheet jika diminta.
 * 9. Salin URL Aplikasi Web yang dihasilkan (berawalan https://script.google.com/macros/s/...)
 *    dan tempelkan ke berkas js/config.js pada baris `loanSyncEndpoint`.
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000); // Cegah konflik penulisan bersamaan

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Peminjaman_Masuk") || doc.getActiveSheet();

    // Inisialisasi header kolom otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "ID Tiket",
        "Nama Pemohon",
        "NPM / NIDN",
        "Email Mahasiswa",
        "No. WhatsApp",
        "Program Studi",
        "Keperluan",
        "Judul Riset / Praktikum",
        "Dosen Pembimbing",
        "Tanggal Pinjam",
        "Tanggal Kembali",
        "Daftar Alat Dipinjam",
        "Status Verifikasi",
        "Sumber Pengajuan"
      ]);
      // Format header agar rapi
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);

    // Susun ringkasan daftar alat teks
    var itemsSummary = "";
    if (data.items && Array.isArray(data.items)) {
      itemsSummary = data.items.map(function(item, idx) {
        return (idx + 1) + ". " + (item.name || item.code) + " (" + (item.quantity || 1) + " " + (item.unit || "buah") + ") [" + (item.code || "-") + "]";
      }).join("\n");
    }

    var row = [
      new Date(),
      data.id || ("TKT-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss")),
      data.borrowerName || data.name || "-",
      data.borrowerNPM || data.npm || "-",
      data.borrowerEmail || data.email || "-",
      data.borrowerPhone || data.phone || "-",
      data.borrowerDept || data.prodi || "Pendidikan Fisika - FKIP UNSIL",
      data.purpose || "Praktikum Mata Kuliah",
      data.title || "-",
      data.advisor || data.supervisor || "-",
      data.startDate || "-",
      data.endDate || "-",
      itemsSummary || JSON.stringify(data.items || []),
      data.status || "Diajukan (Menunggu Konfirmasi)",
      "Website SILAB FKIP UNSIL"
    ];

    sheet.appendRow(row);
    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      ticketId: data.id,
      message: "Data peminjaman berhasil dicatat ke Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "SILAB Fisika UNSIL Peminjaman API",
    time: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}

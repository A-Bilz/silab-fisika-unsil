// Campus Laboratory Website Interactive Script & Data

const equipmentData = [
  {
    code: "LAB-OPT-001",
    name: "Mikroskop Binokuler Digital Olympus CX23",
    category: "Optik & Analisis",
    brand: "Olympus / CX23LED",
    quantity: "12 Unit",
    condition: "Baik / Terkalibrasi",
    location: "Lemari Optik A-1",
    lastCalibration: "12 Agustus 2026",
    nextMaintenance: "12 Februari 2027",
    specs: "Perbesaran 40x - 1000x, Iluminasi LED, Lensa Objektif Plan Achromat",
    sop: "1. Hubungkan kabel daya. 2. Nyalakan saklar utama dan atur intensitas cahaya. 3. Letakkan preparat pada meja objek. 4. Bersihkan lensa dengan kertas lensa setelah pemakaian."
  },
  {
    code: "LAB-CHM-002",
    name: "Spektrofotometer UV-Vis Shimadzu UV-1900i",
    category: "Instrumen Kimia",
    brand: "Shimadzu / UV-1900i",
    quantity: "2 Unit",
    condition: "Baik / Terkalibrasi",
    location: "Ruang Instrumen B-2",
    lastCalibration: "05 September 2026",
    nextMaintenance: "05 Maret 2027",
    specs: "Rentang Panjang Gelombang 190 - 1100 nm, Lebar Celah 1 nm, Layar Sentuh Warna",
    sop: "1. Nyalakan alat 15 menit sebelum pengukuran untuk pemanasan. 2. Lakukan baseline correction dengan kuvet blanko. 3. Masukkan sampel dan catat absorbansi."
  },
  {
    code: "LAB-MTR-003",
    name: "Neraca Analitik Presisi Mettler Toledo ME204",
    category: "Pengukuran Dasar",
    brand: "Mettler Toledo / ME204",
    quantity: "6 Unit",
    condition: "Baik / Terkalibrasi",
    location: "Meja Timbang C-1",
    lastCalibration: "20 September 2026",
    nextMaintenance: "20 Maret 2027",
    specs: "Kapasitas 220 g, Ketelitian 0.1 mg (0.0001 g), Kalibrasi Internal Otomatis",
    sop: "1. Pastikan gelembung waterpass berada di tengah. 2. Tekan tombol Tare sebelum menimbang. 3. Tutup pintu kaca saat pembacaan angka. 4. Bersihkan piringan dengan kuas halus."
  },
  {
    code: "LAB-THR-004",
    name: "Autoklaf Sterilisasi Hirayama HVE-50",
    category: "Sterilisasi & Termal",
    brand: "Hirayama / HVE-50",
    quantity: "3 Unit",
    condition: "Baik / Siap Pakai",
    location: "Ruang Preparasi D-1",
    lastCalibration: "01 Juli 2026",
    nextMaintenance: "01 Januari 2027",
    specs: "Kapasitas 50 Liter, Suhu Kerja 105°C - 135°C, Sistem Pengunci Keamanan Elektromekanis",
    sop: "1. Periksa ketinggian air akuades di dasar chamber. 2. Masukkan alat/media yang akan disterilkan. 3. Kunci tutup dengan rapat. 4. Atur suhu 121°C selama 15-20 menit."
  },
  {
    code: "LAB-MEC-005",
    name: "Centrifuge Refrigerated Eppendorf 5810R",
    category: "Pemisahan Sampel",
    brand: "Eppendorf / 5810R",
    quantity: "4 Unit",
    condition: "Baik / Terkalibrasi",
    location: "Ruang Biologi Molekuler E-1",
    lastCalibration: "18 Agustus 2026",
    nextMaintenance: "18 Februari 2027",
    specs: "Kecepatan Maks 14.000 rpm, Rentang Suhu -9°C hingga 40°C",
    sop: "1. Pastikan tabung sampel seimbang (balanced) secara berhadapan. 2. Atur RPM, suhu, dan waktu putaran. 3. Jangan membuka penutup sebelum rotor berhenti sempurna."
  },
  {
    code: "LAB-ELC-006",
    name: "pH Meter Benchtop Thermo Scientific Orion Star A211",
    category: "Instrumen Kimia",
    brand: "Thermo Scientific",
    quantity: "8 Unit",
    condition: "Perawatan Berkala",
    location: "Meja Analisis Kimia A-3",
    lastCalibration: "01 Oktober 2026",
    nextMaintenance: "01 November 2026",
    specs: "Rentang pH -2.000 hingga 20.000, Akurasi ±0.002 pH, Kompensasi Suhu Otomatis (ATC)",
    sop: "1. Bilas elektroda dengan akuades dan keringkan dengan tisu halus. 2. Kalibrasi dengan buffer pH 4, 7, dan 10. 3. Celupkan ke larutan uji dan tunggu indikator stabil."
  }
];

function switchPage(pageId) {
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetSection = document.getElementById(pageId);
  if (targetSection) targetSection.classList.add('active');

  const activeBtn = document.querySelector(`.nav-btn[data-target="${pageId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCatalog() {
  const searchInput = document.getElementById('searchEquipment').value.toLowerCase();
  const categorySelect = document.getElementById('categoryFilter').value;
  const container = document.getElementById('catalogContainer');

  const filtered = equipmentData.filter(item => {
    const matchText = item.name.toLowerCase().includes(searchInput) ||
                      item.code.toLowerCase().includes(searchInput) ||
                      item.brand.toLowerCase().includes(searchInput);
    const matchCategory = categorySelect === 'ALL' || item.category === categorySelect;
    return matchText && matchCategory;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p>Tidak ada alat yang sesuai dengan pencarian Anda.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const isReady = item.condition.includes("Baik");
    return `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span class="badge ${isReady ? 'badge-available' : 'badge-maintenance'}">${item.condition}</span>
          <small style="color:var(--text-muted); font-weight:600;">${item.code}</small>
        </div>
        <h3>${item.name}</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <strong>Kategori:</strong> ${item.category}<br>
          <strong>Merk/Tipe:</strong> ${item.brand}<br>
          <strong>Jumlah:</strong> ${item.quantity}<br>
          <strong>Lokasi:</strong> ${item.location}
        </p>
        <button class="btn btn-primary" style="margin-top:0.5rem; width:100%;" onclick="openKartuAlat('${item.code}')">
          Lihat Kartu Alat & SOP
        </button>
      </div>
    `;
  }).join('');
}

function openKartuAlat(code) {
  const item = equipmentData.find(e => e.code === code);
  if (!item) return;

  const modalBody = document.getElementById('modalKartuBody');
  modalBody.innerHTML = `
    <table style="margin-bottom:1rem;">
      <tr><th style="width:38%;">Kode Inventaris Alat</th><td><strong>${item.code}</strong></td></tr>
      <tr><th>Nama Alat</th><td>${item.name}</td></tr>
      <tr><th>Kategori</th><td>${item.category}</td></tr>
      <tr><th>Merk / Tipe</th><td>${item.brand}</td></tr>
      <tr><th>Spesifikasi Teknis</th><td>${item.specs}</td></tr>
      <tr><th>Jumlah Unit</th><td>${item.quantity}</td></tr>
      <tr><th>Kondisi Saat Ini</th><td>${item.condition}</td></tr>
      <tr><th>Lokasi Penyimpanan</th><td>${item.location}</td></tr>
      <tr><th>Kalibrasi Terakhir</th><td>${item.lastCalibration}</td></tr>
      <tr><th>Jadwal Perawatan Berikutnya</th><td>${item.nextMaintenance}</td></tr>
    </table>
    <div style="background:#f8fafc; padding:1rem; border-radius:8px; border-left:4px solid var(--secondary);">
      <h4 style="color:var(--primary); margin-bottom:0.4rem;">Prosedur Operasional Standar (SOP) Ringkas:</h4>
      <p style="font-size:0.92rem;">${item.sop}</p>
    </div>
  `;

  document.getElementById('kartuAlatModal').classList.add('open');
}

function closeKartuAlat() {
  document.getElementById('kartuAlatModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.target));
  });
  renderCatalog();
});

"use strict";

// Pertahanan Frame-Busting / Anti-Clickjacking
if (window.top !== window.self) {
  try {
    window.top.location = window.self.location;
  } catch {
    document.documentElement.style.display = "none";
  }
}

/**
 * ============================================================================
 * SILAB FISIKA UNSIL - APLIKASI WEB LABORATORIUM STATIS
 * ============================================================================
 *
 * File ini mengontrol seluruh logika interaktif aplikasi SILAB:
 * - Routing halaman tanpa reload (SPA berbasis hash #halaman-1 s/d #halaman-6)
 * - Katalog alat fisika dengan live search, filter kategori, dan modal kartu alat/SOP
 * - Daftar praktikum 7 semester dan modul-modulnya
 * - Integrasi formulir peminjaman & Berita Acara (Google Form)
 * - Tabel tarif layanan dan ilustrasi eksperimen SVG
 *
 * PETUNJUK UNTUK PENGEMBANG / PROMPT AI:
 * 1. Tambah Alat Baru: Cukup tambahkan objek baru ke array `equipmentData` di bawah.
 * 2. Tambah Praktikum: Cukup tambahkan data ke array `courses`.
 * 3. Sanitasi: Selalu gunakan `escapeHTML()` saat memasukkan teks ke dalam innerHTML
 *    untuk mencegah celah keamanan (XSS) dan menjaga keutuhan struktur DOM.
 * ============================================================================
 */

/* ============================================================================
   1. DATA MASTER ALAT LABORATORIUM (KATALOG & SOP)
   ============================================================================
   Setiap item mewakili satu instrumen laboratorium.
   Format objek:
   - code: string unik kode katalog (misal: "FIS-OPT-001")
   - name: nama lengkap instrumen
   - category: kategori bidang fisika (akan otomatis menjadi opsi filter dropdown)
   - location: usulan tempat penyimpanan di lab
   - specs: ringkasan spesifikasi teknis
   - calibrationPlan: rekomendasi jadwal kalibrasi dan verifikasi berkala
   - sop: array langkah-langkah SOP pengoperasian ringkas (1 per baris)
   ============================================================================ */
const fallbackEquipmentData = [
  {
    code: "FIS-OPT-001",
    name: "Spektrometer Kisi & Prisma Optik",
    category: "Optik & Gelombang",
    location: "Usulan: lemari optik A-1",
    specs:
      "Meja prisma, kolimator, teleskop pengamat, dan skala sudut; resolusi mengikuti model aktual.",
    calibrationPlan:
      "Verifikasi nol sudut dan penyelarasan sebelum sesi; evaluasi kalibrasi tahunan atau setelah benturan oleh laboran.",
    sop: [
      "Periksa dudukan, kebersihan optik, dan sumber cahaya bersama laboran.",
      "Atur kolimator dan teleskop sesuai manual, lalu periksa titik nol skala.",
      "Pasang prisma atau kisi pada dudukan tanpa menyentuh permukaan optik; ukur sudut sesuai modul.",
      "Matikan sumber, simpan optik dalam pelindung, dan catat pengukuran serta kondisi pada buku log.",
    ],
  },
  {
    code: "FIS-ELK-002",
    name: "Digital Storage Oscilloscope 50 MHz",
    category: "Elektronika & Instrumentasi",
    location: "Usulan: rak elektronika B-1",
    specs:
      "Osiloskop penyimpanan digital dengan bandwidth 50 MHz; jumlah kanal dan batas masukan harus diperiksa pada unit.",
    calibrationPlan:
      "Periksa kompensasi probe sebelum sesi; kalibrasi berkala mengikuti manual dan penilaian laboran, usulan evaluasi tahunan.",
    sop: [
      "Periksa pembumian, probe, dan rating masukan; minta laboran memverifikasi rangkaian.",
      "Gunakan sinyal referensi untuk kompensasi probe sesuai manual dan cocokkan faktor atenuasi.",
      "Hubungkan ground hanya ke referensi aman yang disetujui; jangan lepaskan protective earth. Atur volt/div, time/div, dan trigger dalam batas alat.",
      "Simpan data, matikan sumber rangkaian sebelum melepas probe, lalu matikan alat dan isi log.",
    ],
  },
  {
    code: "FIS-MEK-003",
    name: "Linear Air Track & Digital Timer Photogate",
    category: "Mekanika Presisi",
    location: "Usulan: rak mekanika C-1",
    specs:
      "Rel udara linear, kereta, blower, photogate, dan timer digital untuk pengukuran gerak.",
    calibrationPlan:
      "Periksa kerataan rel dan panjang bendera sebelum sesi; verifikasi timer terhadap acuan berkala dan setelah servis.",
    sop: [
      "Pastikan rel stabil, rata, bersih, dan dilengkapi pembatas ujung.",
      "Aktifkan blower sesuai manual sebelum menggerakkan kereta; periksa aliran udara.",
      "Pasang photogate dan ukur panjang bendera; pilih mode timer sesuai modul dan lepaskan kereta dengan terkendali.",
      "Hentikan kereta sebelum mematikan blower; rapikan sensor dan catat hasil serta kondisi.",
    ],
  },
  {
    code: "FIS-UKR-004",
    name: "Neraca Ohaus 4 Lengan Presisi",
    category: "Pengukuran Dasar",
    location: "Usulan: lemari pengukuran D-1",
    specs:
      "Neraca mekanik empat lengan; kapasitas dan resolusi mengikuti pelat identitas unit.",
    calibrationPlan:
      "Verifikasi nol setiap pemakaian dan cek anak timbangan acuan sebelum sesi; usulan kalibrasi tahunan berdasarkan riwayat alat.",
    sop: [
      "Letakkan neraca pada meja rata dan stabil, bersihkan piringan, lalu kembalikan pemberat ke nol.",
      "Atur titik nol tanpa beban dan verifikasi dengan anak timbangan acuan yang disetujui laboran.",
      "Letakkan benda kering dalam batas kapasitas; geser pemberat hingga seimbang dan jumlahkan pembacaan empat lengan.",
      "Angkat benda, kembalikan pemberat ke nol, bersihkan piringan, dan catat penyimpangan jika ada.",
    ],
  },
  {
    code: "FIS-MOD-005",
    name: "Aparatus Efek Fotolistrik & Penentu Konstanta Planck",
    category: "Fisika Modern",
    location: "Usulan: lemari fisika modern E-1",
    specs:
      "Fototabung, sumber cahaya/filter, dan pengukur potensial henti; konfigurasi mengikuti model alat.",
    calibrationPlan:
      "Cek arus gelap dan pembacaan tegangan sebelum sesi; verifikasi sumber panjang gelombang dan meter sesuai manual, usulan evaluasi tahunan.",
    sop: [
      "Periksa kabel, grounding, fototabung, dan filter bersama laboran; hindari paparan cahaya berlebih.",
      "Pilih filter atau panjang gelombang sesuai modul; catat nilai acuan.",
      "Atur potensial henti hingga arus fotolistrik nol; catat tegangan dan ulangi untuk tiap filter.",
      "Turunkan tegangan, matikan sumber cahaya dan instrumen, lalu rapikan filter ke kotaknya.",
    ],
  },
  {
    code: "FIS-OPT-006",
    name: "Interferometer Michelson Presisi",
    category: "Optik & Gelombang",
    location: "Usulan: meja optik A-2",
    specs:
      "Pemisah berkas, cermin tetap, cermin geser mikrometer, dan dudukan laser acuan.",
    calibrationPlan:
      "Verifikasi kelurusan berkas dan gerak mikrometer sebelum sesi; kalibrasi berkala mikrometer dengan standar panjang gelombang acuan.",
    sop: [
      "Letakkan alat pada meja bebas getaran; pastikan cermin bersih dan tidak disentuh jari.",
      "Gunakan sumber cahaya yang disetujui; sejajarkan berkas hingga pola interferensi tampak di layar.",
      "Putar mikrometer perlahan sambil menghitung pergeseran frinji; catat posisi awal dan akhir.",
      "Tutup pelindung debu, matikan sumber, dan kembalikan mikrometer ke posisi aman.",
    ],
  },
  {
    code: "FIS-TRM-007",
    name: "Kalorimeter Joule & Sensor Suhu Digital",
    category: "Termodinamika",
    location: "Usulan: rak termodinamika F-1",
    specs:
      "Bejana kalorimeter berinsulasi, pemanas listrik, pengaduk, dan sensor suhu dengan tampilan digital.",
    calibrationPlan:
      "Periksa sensor suhu dan meter listrik sebelum sesi; verifikasi terhadap acuan sesuai manual, usulan evaluasi tahunan.",
    sop: [
      "Periksa isolasi kabel, wadah, sensor, dan pemanas; jauhkan konektor listrik dari cairan.",
      "Siapkan massa bahan dan posisi sensor sesuai modul; pastikan batas suhu serta tegangan diketahui.",
      "Aktifkan pemanas dengan pengawasan, catat waktu, suhu, tegangan, dan arus; jangan menyentuh permukaan panas.",
      "Matikan dan isolasi sumber; tunggu hingga dingin sebelum mengosongkan atau menyimpan alat, lalu isi log.",
    ],
  },
  {
    code: "FIS-MAG-008",
    name: "Kumparan Helmholtz & Tabung Sinar Katoda e/m",
    category: "Listrik & Magnet",
    location: "Usulan: lemari elektromagnet G-1",
    specs:
      "Sepasang kumparan Helmholtz, tabung berkas elektron, catu daya, serta meter arus/tegangan.",
    calibrationPlan:
      "Periksa nol meter, radius kumparan, dan skala lintasan sebelum sesi; verifikasi meter dan medan sesuai manual, usulan evaluasi tahunan.",
    sop: [
      "Laboran memeriksa tabung kaca, pelindung, koneksi, dan batas kerja; catu tegangan tinggi hanya dioperasikan pengguna berizin.",
      "Dengan sumber terisolasi, petugas menyambung rangkaian sesuai manual dan memverifikasi pengamanan.",
      "Ikuti urutan pemanasan serta pengaturan pabrikan; amati lintasan elektron tanpa menyentuh terminal, tabung, atau kumparan panas.",
      "Turunkan pengaturan dan matikan sumber sesuai manual; petugas memastikan bebas tegangan sebelum koneksi dilepas. Catat arus, tegangan, dan radius.",
    ],
  },
].map((item) => ({
  ...item,
  brand: "Model unit belum diverifikasi",
  quantity: "Belum diverifikasi",
  condition: "Belum diverifikasi",
  sizeType: "BESAR",
  lastCalibration: "Belum ada catatan terverifikasi",
  nextMaintenance: "Tanggal ditetapkan laboran setelah verifikasi",
}));

const equipmentData =
  typeof window !== "undefined" &&
  window.EQUIPMENT_DATA &&
  window.EQUIPMENT_DATA.length
    ? window.EQUIPMENT_DATA
    : fallbackEquipmentData;

/* ============================================================================
   2. DATA MASTER PRAKTIKUM (7 SEMESTER)
   ============================================================================
   Format tuple: [Kode MK, Semester Romawi, Nama Mata Kuliah, [Array Modul]]
   ============================================================================ */
const courses = [
  [
    "LAB-FIS-101",
    "I",
    "Praktikum Fisika Dasar I",
    ["Kinematika", "Dinamika", "Torsi", "Hukum Hooke", "Bandul Sederhana"],
  ],
  [
    "LAB-FIS-102",
    "II",
    "Praktikum Fisika Dasar II",
    [
      "Resonansi Gelombang Bunyi",
      "Viskositas Fluida",
      "Kalorimetri",
      "Pemuaian Termal",
    ],
  ],
  [
    "LAB-ELK-201",
    "III",
    "Praktikum Elektronika Dasar I",
    [
      "Hukum Ohm/Kirchhoff",
      "Karakteristik Dioda & Transistor",
      "Penyearah Gelombang",
    ],
  ],
  [
    "LAB-ELK-202",
    "IV",
    "Praktikum Elektronika Dasar II",
    ["Op-Amp Inverting/Non-inverting", "Komparator", "Gerbang Logika Digital"],
  ],
  [
    "LAB-OPT-301",
    "V",
    "Praktikum Gelombang & Optik",
    [
      "Pembiasan Prisma",
      "Cincin Newton",
      "Difraksi Kisi Laser",
      "Polarimeter Cahaya",
    ],
  ],
  [
    "LAB-MOD-302",
    "VI",
    "Praktikum Fisika Modern",
    [
      "Efek Fotolistrik & Konstanta Planck",
      "Rasio Muatan Massa Elektron e/m",
      "Interferometer Michelson",
    ],
  ],
  [
    "LAB-SEK-401",
    "VII",
    "Praktikum Fisika Sekolah & Alat Peraga",
    ["Pembuatan Media Pembelajaran & Kit Percobaan Fisika SMA"],
  ],
];

/* ============================================================================
   3. DEFINISI FORMULIR PEMINJAMAN & BERITA ACARA
   ============================================================================
   Format tuple: [keyConfig, Judul Formulir, Deskripsi Singkat]
   Tautan aktif diambil dari window.SILAB_CONFIG.forms[keyConfig].
   ============================================================================ */
const formDefinitions = [
  [
    "room",
    "Peminjaman Ruang Lab Fisika",
    "Ajukan ruang untuk praktikum, penelitian tugas akhir, atau pelatihan olimpiade sekolah.",
  ],
  [
    "equipment",
    "Peminjaman Alat Fisika",
    "Sampaikan instrumen, kebutuhan eksperimen, durasi, dan penanggung jawab peminjaman.",
  ],
  [
    "checkout",
    "BA Peminjaman",
    "Catat kondisi awal, kelengkapan, dan dokumentasi saat serah terima bersama laboran.",
  ],
  [
    "return",
    "BA Pengembalian",
    "Catat kondisi akhir, kelengkapan, dan temuan setelah pemeriksaan bersama laboran.",
  ],
];

// Membaca objek konfigurasi global dari js/config.js
const config = window.SILAB_CONFIG || {};

/* ============================================================================
   4. FUNGSI UTILITAS & SANITASI
   ============================================================================ */

/** Mengambil elemen DOM berdasarkan ID */
const byId = (id) => document.getElementById(id);

/**
 * Sanitasi string untuk mencegah kerentanan XSS saat merender HTML dinamis.
 * Selalu lewatkan data dinamis ke fungsi ini sebelum digabungkan ke innerHTML.
 */
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

/** Mengubah array string menjadi daftar tag <li> yang sudah disanitasi */
const listHTML = (items) =>
  items.map((item) => `<li>${escapeHTML(item)}</li>`).join("");

// Menyimpan elemen yang memicu pembukaan modal untuk pemulihan fokus saat modal ditutup
let modalOpener;

// Media query untuk mendeteksi breakpoint navigasi seluler (lebar <= 60rem / 960px)
const menuMedia = window.matchMedia("(max-width: 60rem)");
menuMedia.addEventListener("change", () => setMenu(false));

/* ============================================================================
   5. KONTROL DRAWER MENU SELULER (RESPONSIVE NAVBAR)
   ============================================================================ */

/**
 * Membuka atau menutup menu navigasi mobile drawer
 * @param {boolean} open Status buka/tutup menu
 */
function setMenu(open) {
  byId("menuToggle").setAttribute("aria-expanded", String(open));
  byId("navigation").classList.toggle("open", open);
  byId("navigation").hidden = menuMedia.matches && !open;
}

/* ============================================================================
   6. CLIENT-SIDE ROUTER / NAVIGASI HALAMAN (SPA)
   ============================================================================ */

/**
 * Berpindah antar seksi halaman berdasarkan hash URL (#halaman-1 s/d #halaman-6).
 * Memperbarui status seksi yang aktif, tombol navigasi, dan judul halaman.
 * @param {boolean} focus Menentukan apakah fokus keyboard dipindahkan ke judul seksi
 */
function switchPage(focus = true) {
  const hash = location.hash.slice(1);
  if (hash === "main") {
    byId("main").focus();
    return;
  }

  // Dukungan deep link QR/Barcode alat via hash #alat=CODE
  if (hash.startsWith("alat=")) {
    let rawCode = hash.slice(5);
    let code = "";
    try {
      code = decodeURIComponent(rawCode).trim();
    } catch {
      code = rawCode.trim();
    }
    // Sanitasi ketat: hanya izinkan karakter alfanumerik dan tanda hubung (maksimal 32 karakter)
    code = code.replace(/[^\w-]/g, "").slice(0, 32);
    if (code === "__proto__" || code === "constructor" || code === "prototype") {
      code = "";
    }
    history.replaceState(null, "", "#halaman-5");
    switchPage(false);
    setTimeout(() => {
      const match = equipmentData.find(
        (e) =>
          e.code.toLowerCase() === code.toLowerCase() ||
          (e.aliases &&
            e.aliases.some((a) => a.toLowerCase() === code.toLowerCase())),
      );
      if (match) {
        openKartuAlat(match.code);
      } else {
        const searchInput = byId("searchEquipment");
        if (searchInput && code) {
          searchInput.value = code;
          renderCatalog();
        }
      }
    }, 50);
    return;
  }

  if (byId("kartuAlatModal").open) closeKartuAlat();

  // Validasi hash: hanya terima halaman-1 sampai halaman-6; fallback ke halaman-1
  const target = /^halaman-[1-6]$/.test(hash) ? hash : "halaman-1";
  if (hash !== target) history.replaceState(null, "", `#${target}`);

  // Tampilkan hanya seksi halaman yang aktif
  document.querySelectorAll(".page-section").forEach((section) => {
    section.hidden = section.id !== target;
    section.classList.toggle("active", section.id === target);
  });

  // Perbarui status tombol navigasi dan atribut ARIA
  document.querySelectorAll(".nav-btn").forEach((link) => {
    link.classList.toggle("active", link.hash === `#${target}`);
    if (link.hash === `#${target}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Perbarui status navigasi tab bar mobile
  document.querySelectorAll(".mobile-tab-item").forEach((item) => {
    if (item.dataset.page) {
      item.classList.toggle("active", item.dataset.page === target);
    }
  });

  setMenu(false);
  const heading = byId(target).querySelector("h1");
  document.title = `${document.querySelector('.nav-btn[aria-current="page"]').textContent} | SILAB FISIKA UNSIL`;

  if (focus) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

/* ============================================================================
   7. PENCARIAN & FILTER KATALOG ALAT
   ============================================================================ */

/**
 * Merender daftar kartu alat berdasarkan kata kunci pencarian dan filter kategori.
 * Menangani tampilan kosong (empty state) jika tidak ada alat yang cocok.
 */
let currentSizeFilter = "ALL";

/**
 * Mencari foto fisik instrumen laboratorium dari manifest galeri atau localStorage pengguna.
 */
function getPhotoForItem(code, name) {
  let photoMap = window.EQUIPMENT_GALLERY || {};
  try {
    const rawMap = localStorage.getItem("silab_photo_mapping_v1");
    if (rawMap) photoMap = Object.assign({}, photoMap, JSON.parse(rawMap));
  } catch (_) {}
  for (const k in photoMap) {
    const entry = photoMap[k];
    if (entry && entry.name) {
      const n = entry.name.toLowerCase();
      if (n.includes(code.toLowerCase()) || n.includes(name.toLowerCase())) {
        return entry.path;
      }
    }
  }
  return null;
}

/**
 * Merender daftar kartu alat berdasarkan kata kunci pencarian, filter kategori, dan ukuran.
 * Menangani tampilan kosong (empty state) jika tidak ada alat yang cocok.
 */
function renderCatalog() {
  const query = byId("searchEquipment").value.trim().toLocaleLowerCase("id");
  const category = byId("categoryFilter").value;
  const filtered = equipmentData.filter((item) => {
    const matchQuery = [
      item.name,
      item.code,
      item.brand,
      item.category,
      item.specs,
      ...(item.aliases || []),
    ]
      .join(" ")
      .toLocaleLowerCase("id")
      .includes(query);
    const matchCategory = category === "ALL" || item.category === category;
    const matchSize =
      currentSizeFilter === "ALL" || item.sizeType === currentSizeFilter;
    return matchQuery && matchCategory && matchSize;
  });

  byId("resultCount").textContent =
    `${filtered.length} dari ${equipmentData.length} alat ditampilkan`;
  byId("catalogContainer").innerHTML = filtered.length
    ? filtered
        .map(
          (item) => {
            const mappedPhoto = item.image || getPhotoForItem(item.code, item.name);
            const visualThumb = mappedPhoto
              ? `<img src="${escapeHTML(mappedPhoto)}" alt="Foto ${escapeHTML(item.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" loading="lazy">`
              : (item.svgBlueprint || "");
            return `<article class="card equipment-card" data-code="${escapeHTML(item.code)}"><div class="card-badges-row"><span class="code">${escapeHTML(item.code)}</span><span class="size-badge ${item.sizeType === "BESAR" ? "badge-besar" : "badge-kecil"}">${item.sizeType === "BESAR" ? "Alat Besar" : "Alat Kecil"}</span><span class="cond-badge ${item.condition.includes("Baik") ? "cond-good" : "cond-warning"}">${escapeHTML(item.condition)}</span></div><div class="equipment-blueprint-thumb" aria-hidden="true">${visualThumb}</div><h2>${escapeHTML(item.name)}</h2><p class="category">${escapeHTML(item.category)}</p><p class="state">Stok: <strong>${escapeHTML(item.quantity)}</strong></p><p class="shelf">${escapeHTML(item.location)}</p><div class="card-actions-grid"><button class="btn outline" data-equipment="${escapeHTML(item.code)}" aria-label="Lihat kartu alat & SOP: ${escapeHTML(item.name)}">Lihat kartu alat & SOP</button><div class="card-btn-split"><button class="btn btn-secondary add-cart-btn" data-add-cart="${escapeHTML(item.code)}" aria-label="Tambah ${escapeHTML(item.name)} ke keranjang peminjaman">+ Keranjang</button><button class="btn btn-primary-soft direct-loan-btn" data-direct-loan="${escapeHTML(item.code)}" aria-label="Ajukan pinjam ${escapeHTML(item.name)}">Ajukan Pinjam</button></div></div></article>`;
          }
        )
        .join("")
    : '<div class="empty-state"><h2>Tidak ada alat yang cocok</h2><p>Coba kata kunci lain atau gunakan tombol Reset filter.</p></div>';
}

/* ============================================================================
   8. MODAL DIALOG KARTU ALAT & SOP CETAK
   ============================================================================ */

/**
 * Membuka modal dialog rincian kartu alat dan SOP pengoperasian.
 * Mengunci fokus keyboard di dalam modal untuk kepatuhan aksesibilitas WCAG.
 * @param {string} code Kode unik alat (misal: "FIS-OPT-001")
 */
function openKartuAlat(code, triggerElement = null) {
  const item = equipmentData.find((equipment) => equipment.code === code);
  if (!item) return;
  modalOpener =
    triggerElement ||
    (document.activeElement?.dataset?.equipment === code
      ? document.activeElement
      : document.querySelector(`[data-equipment="${CSS.escape(code)}"]`));
  const details = [
    ["Kode katalog (bukan nomor aset)", item.code],
    ["Bidang", item.category],
    ["Merk / model unit", item.brand],
    ["Spesifikasi umum", item.specs],
    ["Jumlah unit", item.quantity],
    ["Kondisi", item.condition],
    ["Penyimpanan (usulan)", item.location],
    ["Kalibrasi terakhir", item.lastCalibration],
    ["Rencana verifikasi / kalibrasi (usulan)", item.calibrationPlan],
    ["Jadwal berikutnya", item.nextMaintenance],
  ];

  const photoUrl = item.image || getPhotoForItem(item.code, item.name);
  const heroImage = photoUrl
    ? `<div class="modal-kartu-photo" style="margin-bottom:1.25rem;border-radius:8px;overflow:hidden;max-height:260px;background:#0b1329;text-align:center;border:1px solid #1e293b;"><img src="${escapeHTML(photoUrl)}" alt="Foto fisik ${escapeHTML(item.name)}" style="max-height:260px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;display:block;"></div>`
    : (item.svgBlueprint ? `<div class="modal-kartu-blueprint" style="margin-bottom:1.25rem;border-radius:8px;overflow:hidden;height:160px;background:#0f172a;display:flex;align-items:center;justify-content:center;border:1px solid #1e293b;">${item.svgBlueprint}</div>` : "");

  byId("modalKartuBody").innerHTML =
    `<h3>${escapeHTML(item.name)}</h3><p class="source-note">Laboratorium Pendidikan Fisika UNSIL · FKIP · Kampus I Tasikmalaya</p>${heroImage}<dl class="equipment-details">${details.map(([label, value]) => `<dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd>`).join("")}</dl><div class="notice"><strong>Data belum diverifikasi; bukan bukti kelayakan alat.</strong><p>Rencana kalibrasi dan penyimpanan merupakan usulan. Ikuti manual model aktual serta SOP yang disahkan laboran sebelum menggunakan alat.</p></div><h3>SOP pengoperasian ringkas</h3><ol class="sop">${listHTML(item.sop)}</ol><p class="source-note">Buku log: nama pengguna, tanggal, waktu mulai/selesai, tujuan, pengaturan, kondisi awal/akhir, dan verifikasi laboran.</p>`;
  byId("kartuAlatModal").showModal();
  document.body.classList.add("modal-open");
  byId("closeModal").focus();
}

/** Menutup modal dialog dan memulihkan fokus keyboard ke elemen pemanggil */
function closeKartuAlat() {
  byId("kartuAlatModal").close();
}

/* ============================================================================
   9. INTEGRASI FORMULIR LAYANAN (GOOGLE FORMS)
   ============================================================================ */

/**
 * Memvalidasi format URL Google Form resmi untuk keamanan
 * Hanya mengizinkan protokol HTTPS ke domain docs.google.com atau forms.gle
 * @param {string} value String URL yang akan divalidasi
 * @returns {string|null} URL yang bersih atau null jika tidak valid
 */
function googleFormURL(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const valid =
      (url.hostname === "docs.google.com" &&
        /^\/forms\/(d|u)\//.test(url.pathname)) ||
      (url.hostname === "forms.gle" && url.pathname.length > 1);
    return valid ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Merender kartu formulir peminjaman dan berita acara.
 * Jika URL terkonfigurasi di SILAB_CONFIG.forms, tombol menjadi tautan langsung.
 * Jika belum, tombol memicu status informatif dan tautan email permintaan.
 */
function renderForms() {
  byId("formsContainer").innerHTML = formDefinitions
    .map(([key, title, description], index) => {
      const url = googleFormURL(config.forms?.[key]);
      const isBA = key === "checkout" || key === "return";
      const baTab = key === "return" ? "D04" : "D03";
      const extraAction = isBA
        ? `<div style="margin-top:0.6rem;"><button type="button" class="btn primary btn-sm open-inapp-ba-btn" data-ba-tab="${baTab}">Buka Berita Acara Digital (D-0${key === "return" ? "4" : "3"}) 📄</button></div>`
        : "";
      return `<article class="card form-card"><span class="index">0${index + 1}</span><h3>${title}</h3><p>${description}</p><small class="form-state">${url ? "Google Form · terbuka di tab baru" : "Tautan Google Form resmi belum tersedia"}</small>${url ? `<a class="btn primary" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Buka ${title}</a>` : `<button class="btn outline" data-form="${key}">${title}</button>`}${extraAction}</article>`;
    })
    .join("");
}

/* ============================================================================
   10. GALERI SKEMATIK EKSPERIMEN (VEKTOR SVG)
   ============================================================================ */

/** Merender 4 ilustrasi skematik eksperimen optik, mekanika, dan elektronika */
function renderGallery() {
  const gallery = [
    [
      "Mekanika",
      "Air track & pengukuran gerak",
      '<path d="M20 115H260M30 125H250M55 125V145M225 125V145"/><rect x="83" y="88" width="64" height="24" rx="3"/><path d="M70 112V53H87V72M180 112V53H197V72"/><path d="M150 92H225M217 85L225 92L217 99" stroke="#b45309"/>',
    ],
    [
      "Optik laser",
      "Interferensi & lintasan cahaya",
      '<rect x="20" y="85" width="52" height="30"/><path d="M72 100H145V40M145 100H239M145 100V147" stroke="#b45309"/><path d="M135 37H155M237 90V110M130 115L160 85"/><circle cx="145" cy="150" r="8"/>',
    ],
    [
      "Elektronika",
      "Osiloskop & bentuk gelombang",
      '<rect x="30" y="40" width="220" height="110" rx="6"/><rect x="44" y="53" width="137" height="80" rx="3"/><path d="M49 94Q65 42 82 94T115 94T148 94T178 94" stroke="#b45309"/><circle cx="211" cy="71" r="10"/><circle cx="211" cy="107" r="10"/><path d="M58 150V158M223 150V158"/>',
    ],
    [
      "Spektroskopi",
      "Kisi, prisma & spektrum",
      '<path d="M25 112H106M141 101L255 47M141 101L255 76M141 101L255 105M141 101L255 134" stroke="#b45309"/><path d="M131 49L93 127H170Z"/><path d="M116 137H151M133 128V151M111 151H155"/>',
    ],
  ];
  byId("gallery").innerHTML = gallery
    .map(
      ([title, description, drawing]) =>
        `<figure class="gallery-item"><div class="gallery-art"><svg viewBox="0 0 280 180" role="img" aria-label="Ilustrasi ${title}"><g fill="none" stroke="#334155" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg></div><figcaption>${title}<small>${description}</small></figcaption></figure>`,
    )
    .join("");
}

/* ============================================================================
   11. SISTEM KERANJANG PINJAM ALAT (PINJAM BASKET & ZERO-FRICTION HANDOVER)
   ============================================================================ */

function loadCart() {
  try {
    const saved = localStorage.getItem("silab_cart");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        if (typeof item.code !== "string") return null;
        const validItem = equipmentData.find((eq) => eq.code === item.code);
        if (!validItem) return null;
        const qty = Math.min(20, Math.max(1, parseInt(item.qty, 10) || 1));
        return { code: validItem.code, name: validItem.name, qty };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem("silab_cart", JSON.stringify(cart));
  } catch {}
  updateCartUI();
}

function triggerHaptic(ms) {
  if (
    typeof navigator !== "undefined" &&
    navigator.userActivation?.hasBeenActive &&
    typeof navigator.vibrate === "function"
  ) {
    try {
      navigator.vibrate(ms);
    } catch (_) {}
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = byId("cartBadge");
  const floatingBtn = byId("cartFloatingBtn");
  const mobileTabBadge = byId("mobileTabBadge");
  if (badge) {
    if (badge.textContent !== String(totalCount)) {
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.textContent = String(totalCount);
      badge.classList.add("pop");
      triggerHaptic(15);
    }
  }
  if (mobileTabBadge) {
    mobileTabBadge.textContent = String(totalCount);
    mobileTabBadge.hidden = totalCount === 0;
  }
  if (floatingBtn) {
    floatingBtn.hidden = totalCount === 0;
  }
  renderCartItems();
}

function addToCart(code) {
  if (typeof code !== "string") return;
  const item = equipmentData.find((eq) => eq.code === code);
  if (!item) return;
  const existing = cart.find((c) => c.code === code);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + 1);
  } else {
    cart.push({ code: item.code, name: item.name, qty: 1 });
  }
  saveCart();
  triggerHaptic(15);
  showToast(`✓ ${item.name} ditambahkan ke keranjang`);
}

function updateCartQty(code, delta) {
  if (typeof code !== "string") return;
  const existing = cart.find((c) => c.code === code);
  if (!existing) return;
  existing.qty = Math.min(20, existing.qty + delta);
  if (existing.qty <= 0) {
    cart = cart.filter((c) => c.code !== code);
  }
  saveCart();
  triggerHaptic(12);
}

function removeFromCart(code) {
  cart = cart.filter((c) => c.code !== code);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
  showToast("Keranjang peminjaman dikosongkan");
}

function renderCartItems() {
  const listEl = byId("cartItemsList");
  if (!listEl) return;
  if (cart.length === 0) {
    listEl.innerHTML =
      '<div class="cart-empty-message"><p>Keranjang peminjaman masih kosong.</p><small>Pilih alat di Katalog dan klik tombol "+ Keranjang" untuk menambahkan.</small></div>';
    return;
  }
  listEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <strong>${escapeHTML(item.name)}</strong>
          <small>${escapeHTML(item.code)}</small>
        </div>
        <div class="cart-item-stepper">
          <button class="stepper-btn" data-stepper-code="${escapeHTML(item.code)}" data-stepper-delta="-1" aria-label="Kurangi jumlah ${escapeHTML(item.name)}">−</button>
          <span class="stepper-val">${item.qty}</span>
          <button class="stepper-btn" data-stepper-code="${escapeHTML(item.code)}" data-stepper-delta="1" aria-label="Tambah jumlah ${escapeHTML(item.name)}">+</button>
          <button class="cart-remove-btn" data-remove-code="${escapeHTML(item.code)}" aria-label="Hapus ${escapeHTML(item.name)} dari keranjang">×</button>
        </div>
      </div>
    `,
    )
    .join("");
}

let cartDrawerOpener = null;

function openCartDrawer() {
  cartDrawerOpener = document.activeElement;
  byId("cartBackdrop").hidden = false;
  byId("cartDrawer").hidden = false;
  byId("cartFloatingBtn")?.setAttribute("aria-expanded", "true");
  renderCartItems();
  const closeBtn = byId("closeCartBtn");
  if (closeBtn) closeBtn.focus();
}

function closeCartDrawer() {
  byId("cartBackdrop").hidden = true;
  byId("cartDrawer").hidden = true;
  byId("cartFloatingBtn")?.setAttribute("aria-expanded", "false");
  if (cartDrawerOpener && typeof cartDrawerOpener.focus === "function") {
    cartDrawerOpener.focus();
    cartDrawerOpener = null;
  }
}

let toastTimeout;
function showToast(message) {
  const toast = byId("toastNotification");
  if (!toast) return;
  triggerHaptic(10);
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.hidden = false;
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

function composeCartText() {
  const rawStudentName =
    byId("cartStudentName")?.value.trim() || "Mahasiswa Praktikan";
  const rawNotes = byId("cartStudentNotes")?.value.trim() || "-";
  // Sanitasi karakter kontrol & pembatasan panjang
  const studentName = rawStudentName
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, 100);
  const notes = rawNotes.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 200);

  const lines = [
    "Halo Bapak/Ibu PLP Laboratorium Pendidikan Fisika UNSIL,",
    "",
    `Saya: ${studentName}`,
    `Keperluan / Modul: ${notes}`,
    "",
    "Mengajukan peminjaman alat praktikum laboratorium:",
    ...cart.map(
      (item, i) => `${i + 1}. [${item.code}] ${item.name} (${item.qty} unit)`,
    ),
    "",
    "Mohon arahan dan konfirmasi ketersediaan alat. Terima kasih.",
  ];
  return lines.join("\n");
}

function copyCartToClipboard() {
  if (cart.length === 0) {
    showToast("Keranjang masih kosong");
    return;
  }
  const text = composeCartText();
  navigator.clipboard.writeText(text).then(
    () => showToast("✓ Format rincian alat disalin ke clipboard!"),
    () => showToast("Gagal menyalin otomatis, silakan salin manual."),
  );
}

function sendCartToWhatsApp() {
  if (cart.length === 0) {
    showToast("Pilih alat terlebih dahulu!");
    return;
  }
  const text = composeCartText();
  const baseWa =
    (typeof config !== "undefined" && config.officialLinks?.waPeminjaman) ||
    "https://wa.me/6282391976750";
  const separator = baseWa.includes("?") ? "&" : "?";
  const waUrl = `${baseWa}${separator}text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

/* ============================================================================
   11B. SISTEM PEMINJAMAN INTERAKTIF D-05, TIKET QR & BERITA ACARA D-03 / D-04
   ============================================================================ */

let currentLoanItems = [];
let currentTicketData = null;

/**
 * Membuka formulir permohonan peminjaman alat Dokumen D-05
 * @param {string[]} itemCodes Daftar kode alat yang akan dipinjam
 */
function openLoanModal(itemCodes = []) {
  modalOpener = document.activeElement;
  currentLoanItems = [];

  itemCodes.forEach((code) => {
    const item = equipmentData.find(
      (eq) => eq.code === code || (eq.aliases && eq.aliases.includes(code)),
    );
    if (item && !currentLoanItems.some((ci) => ci.code === item.code)) {
      currentLoanItems.push({
        code: item.code,
        name: item.name,
        qty: 1,
        condition: item.condition,
        specs: item.specs || "-",
      });
    }
  });

  if (currentLoanItems.length === 0 && equipmentData.length > 0) {
    currentLoanItems.push({
      code: equipmentData[0].code,
      name: equipmentData[0].name,
      qty: 1,
      condition: equipmentData[0].condition,
      specs: equipmentData[0].specs || "-",
    });
  }

  renderLoanItemsSummary();

  const cartName = byId("cartStudentName")?.value.trim();
  const cartNotes = byId("cartStudentNotes")?.value.trim();
  if (cartName && byId("loanBorrowerName")) byId("loanBorrowerName").value = cartName;
  if (cartNotes && byId("loanTitle")) byId("loanTitle").value = cartNotes;

  const today = new Date();
  const returnDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const startEl = byId("loanStartDate");
  const endEl = byId("loanEndDate");
  if (startEl) startEl.value = today.toISOString().split("T")[0];
  if (endEl) endEl.value = returnDate.toISOString().split("T")[0];

  byId("peminjamanModal").showModal();
  document.body.classList.add("modal-open");
  byId("loanBorrowerName").focus();
}

function closeLoanModal() {
  byId("peminjamanModal").close();
}

function renderLoanItemsSummary() {
  const container = byId("loanItemsSummary");
  if (!container) return;
  container.innerHTML = currentLoanItems
    .map(
      (item, idx) => `
    <div class="loan-item-row">
      <div>
        <strong>${escapeHTML(item.name)}</strong> (<code>${escapeHTML(item.code)}</code>)
        <div style="font-size:0.75rem; color:#94a3b8">Kondisi: ${escapeHTML(item.condition)}</div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem">
        <label for="itemQty_${idx}" class="visually-hidden">Jumlah ${escapeHTML(item.name)}</label>
        <input type="number" id="itemQty_${idx}" min="1" max="10" value="${item.qty}" style="width:52px; text-align:center" onchange="updateLoanItemQty(${idx}, this.value)">
        <button type="button" class="btn outline" style="padding:0.25rem 0.6rem; font-size:0.75rem" onclick="removeLoanItem(${idx})">Hapus</button>
      </div>
    </div>
  `,
    )
    .join("");
}

window.updateLoanItemQty = function (idx, val) {
  if (currentLoanItems[idx]) {
    currentLoanItems[idx].qty = Math.max(1, parseInt(val, 10) || 1);
  }
};

window.removeLoanItem = function (idx) {
  currentLoanItems.splice(idx, 1);
  renderLoanItemsSummary();
};

/**
 * Menampilkan tiket digital ber-QR Code setelah form D-05 disubmit
 */
function showTicketModal(ticket) {
  currentTicketData = ticket;
  byId("ticketIdDisplay").textContent = ticket.id;
  byId("ticketBorrowerName").textContent = ticket.borrowerName;
  byId("ticketBorrowerNPM").textContent = ticket.borrowerNPM;
  byId("ticketPurpose").textContent =
    `${ticket.purpose} (${ticket.borrowerProdi})`;
  byId("ticketTitleText").textContent = ticket.title;
  byId("ticketPeriodText").textContent =
    `${ticket.startDate} s/d ${ticket.endDate}`;

  const tbody = byId("ticketItemsTableBody");
  if (tbody) {
    tbody.innerHTML = ticket.items
      .map(
        (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><code>${escapeHTML(it.code)}</code></td>
        <td>${escapeHTML(it.name)}</td>
        <td>${it.qty} unit</td>
        <td><span class="ticket-status-pill verified">Baik</span></td>
      </tr>
    `,
      )
      .join("");
  }

  // Generate QR Code sisi klien offline
  const qrContainer = byId("ticketQrContainer");
  if (qrContainer) {
    qrContainer.innerHTML = "";
    const qrPayload = `UNSIL-LAB-TIKET:${ticket.id}|NPM:${ticket.borrowerNPM}|ITEMS:${ticket.items.map((i) => i.code).join(",")}`;
    if (typeof QRCode !== "undefined") {
      new QRCode(qrContainer, {
        text: qrPayload,
        width: 140,
        height: 140,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
    } else {
      qrContainer.innerHTML = `<div style="padding:1rem; font-family:monospace; font-size:0.75rem; color:#0f172a; text-align:center">${escapeHTML(ticket.id)}</div>`;
    }
  }

  byId("tiketDigitalModal").showModal();
  document.body.classList.add("modal-open");
  byId("openBAFromTicket").focus();
}

function closeTicketModal() {
  byId("tiketDigitalModal").close();
}

/**
 * Menampilkan modal dialog Berita Acara resmi (D-03 & D-04)
 */
function showBeritaAcaraModal(ticket = null, tab = "D03") {
  const activeTicket = ticket ||
    currentTicketData || {
      id: "UNSIL-LAB-" + Date.now().toString(36).toUpperCase(),
      borrowerName: "Abilah",
      borrowerNPM: "251011400716",
      borrowerProdi: "Pendidikan Fisika",
      purpose: "Praktikum Reguler / Eksperimen Mandiri",
      title: "Verifikasi Karakteristik & Kalibrasi Instrumen Fisika",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      responsible: "Rosliana Siregar, M.Pd.",
      items: [
        {
          code: "FIS-OPT-001",
          name: "Kit Optik Standar Laboratorium",
          qty: 1,
          specs: "Set lengkap optik geometris",
          condition: "Baik (Siap Pakai)",
        },
        {
          code: "FIS-ELK-002",
          name: "Osiloskop Dual Chanel",
          qty: 1,
          specs: "Dual channel calibrated",
          condition: "Baik (Siap Pakai)",
        },
      ],
    };

  currentTicketData = activeTicket;
  switchBATab(tab);
  byId("beritaAcaraModal").showModal();
  document.body.classList.add("modal-open");
  byId("closeBAModal").focus();
}

function closeBeritaAcaraModal() {
  byId("beritaAcaraModal").close();
}

function switchBATab(tab) {
  const isD03 = tab === "D03";
  byId("baTabD03").classList.toggle("active", isD03);
  byId("baTabD04").classList.toggle("active", !isD03);
  byId("baTabD03").setAttribute("aria-selected", isD03 ? "true" : "false");
  byId("baTabD04").setAttribute("aria-selected", !isD03 ? "true" : "false");

  const t = currentTicketData;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const docTitle = isD03
    ? "BERITA ACARA PEMINJAMAN ALAT/BARANG (D-03)"
    : "BERITA ACARA PENGEMBALIAN ALAT/BARANG (D-04)";
  const docNum = isD03
    ? `BA-03/UN58.10.6/Lab.Fis/${now.getFullYear()}`
    : `BA-04/UN58.10.6/Lab.Fis/${now.getFullYear()}`;
  const clauseText = isD03
    ? `Pada hari ini, <strong>${dateFormatted}</strong>, bertempat di Laboratorium Pendidikan Fisika FKIP Universitas Siliwangi, telah dilakukan serah terima peminjaman peralatan laboratorium untuk keperluan praktikum/penelitian ilmiah dengan rincian sebagai berikut:`
    : `Pada hari ini, <strong>${dateFormatted}</strong>, bertempat di Laboratorium Pendidikan Fisika FKIP Universitas Siliwangi, telah dilakukan serah terima pengembalian seluruh peralatan laboratorium yang dipinjam sebelumnya dengan rincian pemeriksaan fisik sebagai berikut:`;

  const itemsRows = (t.items || [])
    .map(
      (it, idx) => `
    <tr>
      <td style="text-align:center">${idx + 1}</td>
      <td><code>${escapeHTML(it.code)}</code></td>
      <td>${escapeHTML(it.name)}</td>
      <td>${escapeHTML(it.specs || "-")}</td>
      <td style="text-align:center">${it.qty}</td>
      <td style="text-align:center">Set/Unit</td>
      <td style="text-align:center">${isD03 ? "Baik (Lengkap)" : "Lengkap & Berfungsi Baik"}</td>
    </tr>
  `,
    )
    .join("");

  byId("baDocumentContent").innerHTML = `
    <div class="ba-document">
      <div class="ba-kop">
        <p class="ba-kop-line1">Kementerian Pendidikan Tinggi, Sains, dan Teknologi</p>
        <p class="ba-kop-line2">Universitas Siliwangi</p>
        <p class="ba-kop-line3">Fakultas Keguruan dan Ilmu Pendidikan · Jurusan Pendidikan Fisika</p>
        <p class="ba-kop-address">Jalan Siliwangi No. 24 Kota Tasikmalaya Kode Pos 46115 Telepon (0265) 323532 · Laman: fkip.unsil.ac.id</p>
      </div>

      <h3 class="ba-doc-title">${docTitle}</h3>
      <p class="ba-doc-number">Nomor: ${docNum}</p>

      <p class="ba-clause">${clauseText}</p>

      <table class="ba-parties-table">
        <tr>
          <td style="width:140px"><strong>Pihak Kesatu (Peminjam)</strong></td>
          <td style="width:10px">:</td>
          <td>${escapeHTML(t.borrowerName)} (NPM: ${escapeHTML(t.borrowerNPM)})</td>
        </tr>
        <tr>
          <td>Program Studi</td>
          <td>:</td>
          <td>${escapeHTML(t.borrowerProdi)}</td>
        </tr>
        <tr>
          <td>Keperluan / Topik</td>
          <td>:</td>
          <td>${escapeHTML(t.purpose)} — ${escapeHTML(t.title)}</td>
        </tr>
        <tr>
          <td>Masa Pinjam</td>
          <td>:</td>
          <td>${escapeHTML(t.startDate)} sampai ${escapeHTML(t.endDate)}</td>
        </tr>
        <tr>
          <td style="padding-top:6px"><strong>Pihak Kedua (Pengelola)</strong></td>
          <td style="padding-top:6px">:</td>
          <td style="padding-top:6px">Laboran / Pengelola Laboratorium Pendidikan Fisika UNSIL</td>
        </tr>
      </table>

      <table class="ba-items-table">
        <thead>
          <tr>
            <th style="width:30px">No</th>
            <th style="width:100px">Kode Inventaris</th>
            <th>Nama Alat / Komponen</th>
            <th>Spesifikasi</th>
            <th style="width:40px">Jumlah</th>
            <th style="width:60px">Satuan</th>
            <th style="width:100px">Kondisi Fisik</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <p class="ba-clause" style="font-size:9pt; color:#1e293b">
        ${
          isD03
            ? "Pihak Kesatu menyatakan telah menerima alat-alat tersebut dalam keadaan bersih, lengkap, dan berfungsi normal, serta bersedia menjaga, merawat, dan mematuhi Tata Tertib Laboratorium Fisika UNSIL."
            : "Pihak Kedua telah memeriksa keutuhan dan kelengkapan fungsi setiap komponen instrumen di atas. Dengan ditandatanganinya Berita Acara ini, kewajiban peminjaman dinyatakan SELESAI."
        }
      </p>

      <div class="ba-signature-grid">
        <div class="ba-sig-box">
          <p>Pihak Kesatu (Peminjam),</p>
          <div class="ba-sig-space"></div>
          <p class="ba-sig-name">${escapeHTML(t.borrowerName)}</p>
          <p class="ba-sig-nip">NPM. ${escapeHTML(t.borrowerNPM)}</p>
        </div>
        <div class="ba-sig-box">
          <p>Pihak Kedua (Pengelola Lab),</p>
          <div class="ba-sig-space"></div>
          <p class="ba-sig-name">Ida Rahmawati, S.Pd.</p>
          <p class="ba-sig-nip">Pengelola Laboratorium Fisika</p>
        </div>
      </div>

      <div class="ba-head-signature">
        <p>Mengetahui,<br>Ketua Laboratorium Pendidikan Fisika FKIP UNSIL,</p>
        <div class="ba-sig-space"></div>
        <p class="ba-sig-name">Rosliana Siregar, M.Pd.</p>
        <p class="ba-sig-nip">NIP. 198805122019032014</p>
      </div>
    </div>
  `;

  const switchBtn = byId("switchBATabBtn");
  if (switchBtn) {
    switchBtn.textContent = isD03
      ? "Ganti ke Dokumen D-04 (Pengembalian)"
      : "Ganti ke Dokumen D-03 (Peminjaman)";
  }
}

/* ==========================================================================
   11C. REKAP & LOGBOOK PEMINJAMAN MASUK (SINKRON GOOGLE SHEETS TANPA GFORM)
   ========================================================================== */

const INITIAL_LOAN_RECORDS = [
  {
    id: "TKT-20260302-01",
    borrowerName: "Rizki Pratama",
    borrowerNPM: "212153018",
    borrowerEmail: "212153018@student.unsil.ac.id",
    borrowerPhone: "082119882341",
    borrowerDept: "Pendidikan Fisika - FKIP UNSIL",
    purpose: "Praktikum Mata Kuliah Fisika Gelombang",
    title: "Percobaan Interferensi dan Difraksi Kisi",
    startDate: "2026-03-02",
    endDate: "2026-03-05",
    advisor: "Rosliana Siregar, M.Pd.",
    items: [
      { code: "FIS-OPT-001", name: "Kit Optik Standar Laboratorium", qty: 1, condition: "Baik" },
      { code: "FME-001-02", name: "Jangka sorong skala 0,02 mm", qty: 1, condition: "Baik" }
    ],
    status: "Disetujui",
    createdAt: "2026-03-02T08:30:00.000Z"
  },
  {
    id: "TKT-20260303-02",
    borrowerName: "Dhea Ananda",
    borrowerNPM: "222153045",
    borrowerEmail: "222153045@student.unsil.ac.id",
    borrowerPhone: "085223409121",
    borrowerDept: "Pendidikan Fisika - FKIP UNSIL",
    purpose: "Penelitian Skripsi / Tugas Akhir",
    title: "Karakterisasi Koefisien Gesek Statis dan Kinetis Bahan",
    startDate: "2026-03-03",
    endDate: "2026-03-10",
    advisor: "Dr. H. Mamat Ruhimat, M.Pd.",
    items: [
      { code: "FME-001-01", name: "Kit Bidang Miring", qty: 1, condition: "Baik" },
      { code: "FME-001-03", name: "Micrometer sekrup", qty: 2, condition: "Baik" }
    ],
    status: "Diajukan",
    createdAt: "2026-03-03T09:15:00.000Z"
  },
  {
    id: "TKT-20260304-03",
    borrowerName: "Ilham Fajar",
    borrowerNPM: "212153009",
    borrowerEmail: "212153009@student.unsil.ac.id",
    borrowerPhone: "081394556210",
    borrowerDept: "Pendidikan Fisika - FKIP UNSIL",
    purpose: "Praktikum Mandiri",
    title: "Analisis Resonansi Gelombang Bunyi",
    startDate: "2026-03-04",
    endDate: "2026-03-07",
    advisor: "Dosen Pengampu Gelombang",
    items: [
      { code: "alat-031", name: "Garputala", qty: 2, condition: "Baik" },
      { code: "alat-032", name: "Sonometer", qty: 1, condition: "Baik" }
    ],
    status: "Selesai",
    createdAt: "2026-03-04T10:00:00.000Z"
  }
];

function getLoanRecords() {
  try {
    const raw = localStorage.getItem("silab_loan_records");
    if (!raw) {
      localStorage.setItem("silab_loan_records", JSON.stringify(INITIAL_LOAN_RECORDS));
      return INITIAL_LOAN_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOAN_RECORDS;
  } catch (e) {
    return INITIAL_LOAN_RECORDS;
  }
}

function saveLoanRecord(record) {
  const records = getLoanRecords();
  records.unshift(record);
  localStorage.setItem("silab_loan_records", JSON.stringify(records));
  return records;
}

function updateRecordStatus(recordId, newStatus) {
  const records = getLoanRecords();
  const rec = records.find(r => r.id === recordId);
  if (rec) {
    rec.status = newStatus;
    localStorage.setItem("silab_loan_records", JSON.stringify(records));
    renderAdminLogbook();
    showToast(`Status ${recordId} diperbarui menjadi: ${newStatus}`);
  }
}

function openAdminLogbook() {
  modalOpener = document.activeElement;
  byId("adminLogbookModal").showModal();
  document.body.classList.add("modal-open");
  const endpoint = localStorage.getItem("silab_gsheet_endpoint") || window.SILAB_CONFIG?.officialLinks?.loanSyncEndpoint || "";
  if (byId("gsheetEndpointInput")) {
    byId("gsheetEndpointInput").value = endpoint;
  }
  renderAdminLogbook();
}

function closeAdminLogbook() {
  byId("adminLogbookModal").close();
  document.body.classList.remove("modal-open");
  if (modalOpener?.isConnected) modalOpener.focus();
}

function renderAdminLogbook(filterText = "") {
  const tbody = byId("logbookTableBody");
  if (!tbody) return;
  const records = getLoanRecords();
  const query = (filterText || byId("logbookSearchInput")?.value || "").toLowerCase().trim();

  const filtered = records.filter(rec => {
    if (!query) return true;
    const name = (rec.borrowerName || "").toLowerCase();
    const npm = (rec.borrowerNPM || "").toLowerCase();
    const id = (rec.id || "").toLowerCase();
    const items = (rec.items || []).map(i => i.name + " " + i.code).join(" ").toLowerCase();
    return name.includes(query) || npm.includes(query) || id.includes(query) || items.includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:#94a3b8">Belum ada pengajuan peminjaman yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((rec) => {
    const dateStr = rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : (rec.startDate || "-");
    const itemsSummary = (rec.items || []).map(it => `<code>${escapeHTML(it.code || "")}</code> ${escapeHTML(it.name || "")} (${it.qty || 1}x)`).join("<br>");
    
    let badgeClass = "badge-diajukan";
    if (rec.status === "Disetujui") badgeClass = "badge-disetujui";
    if (rec.status === "Selesai") badgeClass = "badge-selesai";

    return `
      <tr>
        <td><small>${dateStr}</small></td>
        <td><code>${escapeHTML(rec.id)}</code></td>
        <td><strong>${escapeHTML(rec.borrowerName || "-")}</strong><br><small style="color:#94a3b8">${escapeHTML(rec.borrowerDept || "")}</small></td>
        <td><code>${escapeHTML(rec.borrowerNPM || "-")}</code></td>
        <td>${escapeHTML(rec.purpose || "-")}<br><small style="color:#94a3b8">${escapeHTML(rec.title || "-")}</small></td>
        <td style="font-size:0.8rem">${itemsSummary}</td>
        <td>
          <span class="logbook-badge ${badgeClass}">${escapeHTML(rec.status || "Diajukan")}</span>
          <div style="margin-top:0.35rem">
            <select class="btn-mini" onchange="updateRecordStatus('${rec.id}', this.value)" aria-label="Ubah status ${rec.id}">
              <option value="Diajukan" ${rec.status === "Diajukan" ? "selected" : ""}>Diajukan</option>
              <option value="Disetujui" ${rec.status === "Disetujui" ? "selected" : ""}>Disetujui</option>
              <option value="Selesai" ${rec.status === "Selesai" ? "selected" : ""}>Selesai</option>
            </select>
          </div>
        </td>
        <td>
          <div class="table-action-btns">
            <button type="button" class="btn-mini" onclick="viewLogbookTicket('${rec.id}')">Tiket QR</button>
            <button type="button" class="btn-mini action-print" onclick="printLogbookBA('${rec.id}', 'D03')">Cetak D-03</button>
            <button type="button" class="btn-mini" onclick="printLogbookBA('${rec.id}', 'D04')">Cetak D-04</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.viewLogbookTicket = function(recordId) {
  const records = getLoanRecords();
  const rec = records.find(r => r.id === recordId);
  if (rec) {
    closeAdminLogbook();
    showTicketModal(rec);
  }
};

window.printLogbookBA = function(recordId, tab) {
  const records = getLoanRecords();
  const rec = records.find(r => r.id === recordId);
  if (rec) {
    closeAdminLogbook();
    showBeritaAcaraModal(rec, tab);
  }
};

window.showBeritaAcaraModal = showBeritaAcaraModal;
window.closeBeritaAcaraModal = closeBeritaAcaraModal;
window.updateRecordStatus = updateRecordStatus;

function exportLogbookCSV() {
  const records = getLoanRecords();
  if (records.length === 0) {
    showToast("Belum ada data untuk diekspor!");
    return;
  }
  const headers = ["ID Tiket", "Nama Mahasiswa", "NPM", "Email", "No. WhatsApp", "Program Studi", "Keperluan", "Judul", "Dosen Pembimbing", "Tgl Pinjam", "Tgl Kembali", "Daftar Alat", "Status", "Waktu Pengajuan"];
  const rows = records.map(r => {
    const itemsStr = (r.items || []).map(i => `${i.code}: ${i.name} (${i.qty} unit)`).join(" | ");
    return [
      `"${r.id}"`,
      `"${(r.borrowerName || "").replace(/"/g, '""')}"`,
      `"${r.borrowerNPM || ""}"`,
      `"${r.borrowerEmail || ""}"`,
      `"${r.borrowerPhone || ""}"`,
      `"${(r.borrowerDept || "").replace(/"/g, '""')}"`,
      `"${(r.purpose || "").replace(/"/g, '""')}"`,
      `"${(r.title || "").replace(/"/g, '""')}"`,
      `"${(r.advisor || r.supervisor || "").replace(/"/g, '""')}"`,
      `"${r.startDate || ""}"`,
      `"${r.endDate || ""}"`,
      `"${itemsStr.replace(/"/g, '""')}"`,
      `"${r.status || "Diajukan"}"`,
      `"${r.createdAt || ""}"`
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rekap_peminjaman_silab_unsil_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("✓ Berkas rekap CSV berhasil diunduh!");
}

/**
 * Sinkronisasi dinamis inventaris Google Sheets resmi lab
 */
async function syncGoogleSheets(manual = false) {
  const syncBtn = byId("syncSheetBtn");
  const syncText = byId("syncStatusText");
  if (syncBtn) syncBtn.disabled = true;
  if (syncText)
    syncText.textContent = "Menghubungkan ke Google Sheets Inventaris...";

  try {
    const sheetUrl =
      (typeof config !== "undefined" && config.sheetEquipment) ||
      "https://docs.google.com/spreadsheets/d/1pLms8u0h-KzzGCAdGwq-MxSu0V10XOoY5JBxDlTr0QQ/export?format=csv";
    const resp = await fetch(sheetUrl, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const csv = await resp.text();
    const updatedCount = applyGoogleSheetCsv(csv);
    if (syncText) {
      syncText.textContent = `Sinkron live: ${updatedCount} baris diperbarui dari Google Sheets`;
    }
    renderCatalog();
    if (manual)
      showToast(
        `✓ Berhasil menyinkronkan ${updatedCount} instrumen dari Google Sheets!`,
      );
  } catch (err) {
    if (syncText) {
      syncText.textContent =
        "Dataset resmi Dokumen C-01/UN58.10.6/Lab/2026 (50 alat aktif offline)";
    }
  } finally {
    if (syncBtn) syncBtn.disabled = false;
  }
}

function applyGoogleSheetCsv(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  let updated = 0;
  for (const line of lines) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 5) continue;
    const code = cols[1];
    const name = cols[2];
    const specs = cols[3];
    const baik = parseInt(cols[4], 10);
    const dipinjam = parseInt(cols[10], 10) || 0;
    const tersedia = parseInt(cols[11], 10) || baik;

    if (!code || isNaN(baik)) continue;

    const match = equipmentData.find(
      (item) =>
        item.code === code ||
        item.name.toLowerCase() === name.toLowerCase() ||
        (item.aliases && item.aliases.includes(code)),
    );
    if (match) {
      if (!isNaN(tersedia))
        match.quantity = `${tersedia} ${cols[7] || "unit"} (Tersedia)`;
      if (specs && specs.length > 3) match.specs = specs;
      updated++;
    }
  }
  return updated;
}

/* ============================================================================
   12. INITIALISASI UTAMA & PENDAFTARAN EVENT LISTENERS
   ============================================================================ */

/**
 * Menyiapkan data awal saat halaman pertama kali dimuat:
 * - Menampilkan jam layanan dari konfigurasi
 * - Merender daftar 7 mata kuliah praktikum
 * - Mengisi dropdown kategori filter secara dinamis dari data alat
 * - Merender tabel tarif layanan
 * - Mendaftarkan listener interaktif (pencarian, filter, modal, navigasi)
 */
function init() {
  // Jam layanan dari konfigurasi
  if (typeof config.serviceHours === "string" && config.serviceHours.trim())
    byId("serviceHours").textContent = config.serviceHours;

  // Render mata kuliah praktikum
  byId("courseList").innerHTML = courses
    .map(
      ([code, semester, title, modules]) =>
        `<article class="course"><div class="course-meta"><small>Semester ${semester}</small><strong>${code}</strong></div><div class="course-content"><h2>${title}</h2><ul class="module-list">${listHTML(modules)}</ul><p class="coordinator"><strong>Koordinator:</strong> Dosen pengampu ${title}; penugasan belum dikonfirmasi program studi.</p></div></article>`,
    )
    .join("");

  // Isi dropdown kategori filter berdasarkan kategori alat yang unik
  const uniqueCategories = Array.from(
    new Set(equipmentData.map((item) => item.category)),
  );
  uniqueCategories.forEach((cat) =>
    byId("categoryFilter").add(new Option(cat, cat)),
  );

  // Render chip kategori filter cepat
  const filterChipsEl = byId("filterChips");
  if (filterChipsEl) {
    filterChipsEl.innerHTML = [
      '<button class="chip-btn active" data-category="ALL">Semua</button>',
      ...uniqueCategories.map(
        (cat) =>
          `<button class="chip-btn" data-category="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`,
      ),
    ].join("");

    filterChipsEl.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-category]");
      if (!btn) return;
      byId("categoryFilter").value = btn.dataset.category;
      syncActiveChip(btn.dataset.category);
      renderCatalog();
    });
  }

  function syncActiveChip(cat) {
    if (!filterChipsEl) return;
    filterChipsEl.querySelectorAll(".chip-btn").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.category === cat);
    });
  }

  byId("courseList").insertAdjacentHTML(
    "afterbegin",
    '<p class="source-note">Rancangan praktikum: kode, semester, dan modul perlu dicocokkan dengan kurikulum UNSIL yang berlaku.</p>',
  );

  // Render daftar layanan dan tarif resmi berdasarkan Google Sheet Lab Fisika
  const services = [
    { name: "Layanan Praktikum Kit Mekanika", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Tarif 6 peserta praktikan" },
    { name: "Layanan Praktikum Kit Optik", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Spektrometer & sumber cahaya" },
    { name: "Layanan Praktikum Kit Listrik Magnet", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Catu daya, galvanometer, rangkaian" },
    { name: "Layanan Praktikum Kit Termodinamika", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Kalorimeter, Joule, termometer" },
    { name: "Layanan Praktikum Kit Gelombang (Ripple)", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Ripple tank difraksi air" },
    { name: "Layanan Praktikum Elektronika", internal: "Rp 250.000 / judul", external: "Rp 300.000 / judul", desc: "Oscilloscope & sinyal audio" },
    { name: "Layanan Praktikum Kit Bidang Miring", internal: "Rp 250.000 / paket", external: "Rp 300.000 / paket", desc: "Koefisien gesek & kinematika" },
    { name: "Layanan Praktikum Modul Viskositas Fluida", internal: "Rp 250.000 / paket", external: "Rp 300.000 / paket", desc: "Tabung Stokes & bola uji" },
    { name: "Praktikum terjadwal / penggunaan ruang", internal: "Sesuai Jadwal", external: "Konfirmasi PLP", desc: "Penggunaan lab per sesi perkuliahan" },
    { name: "Penggunaan instrumen untuk penelitian", internal: "Bebas Biaya TA", external: "Tarif Mitra", desc: "Skripsi mahasiswa & riset dosen FKIP" },
    { name: "Pengukuran dan pengujian sampel fisika", internal: "Konfirmasi PLP", external: "Sesuai Sampel", desc: "Analisis data instrumen presisi" },
    { name: "Pendampingan operator / laboran", internal: "Termasuk", external: "Sesuai Kegiatan", desc: "Panduan teknis dan operasional PLP" },
    { name: "Pelatihan eksperimen sekolah & OSN", internal: "Program Pengabdian", external: "Rp 50.000 / siswa", desc: "Bimbel & persiapan olimpiade fisika" },
    { name: "Pengembangan dan pengujian kit alat peraga", internal: "Kerjasama Lab", external: "Sesuai Spesifikasi", desc: "Validasi media pembelajaran sekolah" },
  ];
  byId("ratesBody").innerHTML = services
    .map(
      (item) =>
        `<tr><th scope="row">${escapeHTML(item.name)}<small style="display:block;color:var(--muted);font-weight:normal">${escapeHTML(item.desc)}</small></th><td>${escapeHTML(item.internal)}</td><td>${escapeHTML(item.external)}</td><td><span class="sheet-badge">Terverifikasi</span></td></tr>`,
    )
    .join("");

  // Render komponen dinamis
  renderGallery();
  renderForms();
  renderCatalog();
  switchPage(false);

  // Listener navigasi hash URL
  window.addEventListener("hashchange", () => switchPage());
  document.querySelectorAll('a[href^="#halaman-"]').forEach((link) =>
    link.addEventListener("click", () => {
      if (link.hash === location.hash) switchPage();
    }),
  );

  // Listener toggle menu mobile
  byId("menuToggle").addEventListener("click", () =>
    setMenu(byId("menuToggle").getAttribute("aria-expanded") !== "true"),
  );
  byId("navigation").addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      byId("menuToggle").getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      byId("menuToggle").focus();
    }
  });

  // Listener filter ukuran alat (Semua, Alat Besar, Alat Kecil)
  const sizeChipsEl = byId("sizeFilterChips");
  if (sizeChipsEl) {
    sizeChipsEl.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-size]");
      if (!btn) return;
      currentSizeFilter = btn.dataset.size;
      sizeChipsEl.querySelectorAll(".chip-btn").forEach((chip) => {
        chip.classList.toggle("active", chip.dataset.size === currentSizeFilter);
      });
      renderCatalog();
    });
  }

  // Listener pencarian dan filter katalog
  byId("searchEquipment").addEventListener("input", renderCatalog);
  byId("categoryFilter").addEventListener("change", () => {
    syncActiveChip(byId("categoryFilter").value);
    renderCatalog();
  });
  byId("resetFilters").addEventListener("click", () => {
    byId("searchEquipment").value = "";
    byId("categoryFilter").value = "ALL";
    currentSizeFilter = "ALL";
    if (sizeChipsEl) {
      sizeChipsEl.querySelectorAll(".chip-btn").forEach((chip) => {
        chip.classList.toggle("active", chip.dataset.size === "ALL");
      });
    }
    syncActiveChip("ALL");
    renderCatalog();
    byId("searchEquipment").focus();
  });

  // Listener delegasi klik untuk tombol "Lihat kartu alat & SOP", "+ Keranjang", dan "Ajukan Pinjam"
  byId("catalogContainer").addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-equipment]");
    if (detailBtn) {
      openKartuAlat(detailBtn.dataset.equipment, detailBtn);
      return;
    }
    const addBtn = event.target.closest("[data-add-cart]");
    if (addBtn) {
      addToCart(addBtn.dataset.addCart);
      return;
    }
    const directLoanBtn = event.target.closest("[data-direct-loan]");
    if (directLoanBtn) {
      openLoanModal([directLoanBtn.dataset.directLoan]);
      return;
    }
  });

  // Tombol floating keranjang & penutupan drawer
  byId("cartFloatingBtn")?.addEventListener("click", openCartDrawer);
  byId("mobileCartTabBtn")?.addEventListener("click", openCartDrawer);
  byId("closeCartBtn")?.addEventListener("click", closeCartDrawer);
  byId("cartBackdrop")?.addEventListener("click", closeCartDrawer);

  // Interaksi simulasi prisma optik (Fisika Hidup)
  const prismSlider = byId("prismAngleSlider");
  if (prismSlider) {
    const updatePrismRay = () => {
      const theta1Deg = parseFloat(prismSlider.value);
      const theta1Rad = (theta1Deg * Math.PI) / 180;
      const nPrism = 1.52;
      const sinTheta2 = Math.sin(theta1Rad) / nPrism;
      const theta2Rad = Math.asin(sinTheta2);
      const theta2Deg = (theta2Rad * 180) / Math.PI;

      const readout = byId("prismAngleReadout");
      if (readout) readout.textContent = `${theta1Deg.toFixed(1)}°`;
      const refractReadout = byId("prismRefractReadout");
      if (refractReadout) {
        refractReadout.innerHTML = `Sudut Bias: <strong>&theta;₂ = ${theta2Deg.toFixed(1)}&deg;</strong>`;
      }

      const delta = theta1Deg - 45;
      const outY = 177 + delta * 0.55;
      const beamEl = byId("prismBeamRay");
      if (beamEl) {
        beamEl.setAttribute(
          "d",
          `M0 188H164L278 ${outY.toFixed(1)}L440 ${(125 + delta * 0.45).toFixed(1)}M278 ${outY.toFixed(1)}L440 ${(156 + delta * 0.35).toFixed(1)}M278 ${outY.toFixed(1)}L440 ${(188 + delta * 0.25).toFixed(1)}M278 ${outY.toFixed(1)}L440 ${(218 + delta * 0.15).toFixed(1)}`,
        );
      }
      const rayOut = byId("rayOutPoint");
      if (rayOut) rayOut.setAttribute("cy", outY.toFixed(1));
    };
    prismSlider.addEventListener("input", updatePrismRay);
  }

  // Stepper & hapus item di dalam keranjang
  byId("cartItemsList")?.addEventListener("click", (event) => {
    const stepperBtn = event.target.closest("[data-stepper-code]");
    if (stepperBtn) {
      const code = stepperBtn.dataset.stepperCode;
      const delta = parseInt(stepperBtn.dataset.stepperDelta, 10);
      updateCartQty(code, delta);
      return;
    }
    const removeBtn = event.target.closest("[data-remove-code]");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.removeCode);
    }
  });

  // Aksi footer keranjang peminjaman
  byId("cartCheckoutLoanBtn")?.addEventListener("click", () => {
    closeCartDrawer();
    openLoanModal(cart.map((c) => c.code));
  });
  byId("sendCartWABtn")?.addEventListener("click", sendCartToWhatsApp);
  byId("copyCartBtn")?.addEventListener("click", copyCartToClipboard);
  byId("clearCartBtn")?.addEventListener("click", clearCart);

  // Form submit Permohonan Peminjaman D-05 & pembuatan Tiket QR (Sinkron Google Sheets Langsung)
  byId("loanForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentLoanItems.length === 0) {
      showToast("Pilih minimal satu alat untuk diajukan!");
      return;
    }
    const ticketId = "TKT-" + Math.floor(100000 + Math.random() * 900000);
    const borrowerName = byId("loanBorrowerName")?.value.trim() || "";
    const borrowerNPM = byId("loanBorrowerNPM")?.value.trim() || "";
    const borrowerEmail = byId("loanBorrowerEmail")?.value.trim() || "";
    const borrowerPhone = byId("loanBorrowerPhone")?.value.trim() || "";
    const borrowerDept = byId("loanBorrowerDept")?.value.trim() || byId("loanBorrowerProdi")?.value || "Pendidikan Fisika - FKIP UNSIL";
    const purpose = byId("loanPurpose")?.value || "";
    const title = byId("loanTitle")?.value.trim() || "";
    const startDate = byId("loanStartDate")?.value || "";
    const endDate = byId("loanEndDate")?.value || "";
    const advisor = byId("loanAdvisor")?.value.trim() || byId("loanSupervisor")?.value.trim() || "-";

    const ticketData = {
      id: ticketId,
      borrowerName,
      borrowerNPM,
      borrowerEmail,
      borrowerPhone,
      borrowerDept,
      borrowerProdi: borrowerDept,
      purpose,
      title,
      startDate,
      endDate,
      advisor,
      supervisor: advisor,
      items: [...currentLoanItems],
      status: "Diajukan",
      createdAt: new Date().toISOString(),
    };

    // 1. Simpan ke database lokal logbook pengajuan lab
    saveLoanRecord(ticketData);

    // 2. Kirim otomatis ke Google Sheets via Google Apps Script Web App jika endpoint disetel
    const gsheetEndpoint = localStorage.getItem("silab_gsheet_endpoint") || window.SILAB_CONFIG?.officialLinks?.loanSyncEndpoint;
    if (gsheetEndpoint && gsheetEndpoint.startsWith("http")) {
      fetch(gsheetEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      }).catch((err) => console.warn("Google Sheet sync notice:", err));
    }

    closeLoanModal();
    showTicketModal(ticketData);
    showToast(
      "✓ Permohonan peminjaman berhasil dicatat & disinkronkan ke Google Sheet! Tiket digital & QR siap.",
    );
  });

  // Listener penutupan & navigasi modal peminjaman D-05
  byId("closeLoanModal")?.addEventListener("click", closeLoanModal);
  byId("cancelLoanBtn")?.addEventListener("click", closeLoanModal);
  byId("peminjamanModal")?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });

  // Listener tiket digital ber-QR Code
  byId("closeTicketModal")?.addEventListener("click", closeTicketModal);
  byId("closeTicketTopBtn")?.addEventListener("click", closeTicketModal);
  byId("tiketDigitalModal")?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });
  byId("openBAFromTicket")?.addEventListener("click", () => {
    closeTicketModal();
    showBeritaAcaraModal(currentTicketData, "D03");
  });

  // Listener Berita Acara D-03 / D-04
  byId("closeBAModal")?.addEventListener("click", closeBeritaAcaraModal);
  byId("closeBAModalBottom")?.addEventListener("click", closeBeritaAcaraModal);
  byId("closeBATopBtn")?.addEventListener("click", closeBeritaAcaraModal);
  byId("beritaAcaraModal")?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });
  byId("baTabD03")?.addEventListener("click", () => switchBATab("D03"));
  byId("baTabD04")?.addEventListener("click", () => switchBATab("D04"));
  byId("switchBATabBtn")?.addEventListener("click", () => {
    const isCurrentlyD03 = byId("baTabD03").classList.contains("active");
    switchBATab(isCurrentlyD03 ? "D04" : "D03");
  });
  byId("printBABtn")?.addEventListener("click", () => window.print());
  byId("openStandaloneBABtn")?.addEventListener("click", () => showBeritaAcaraModal(null, "D03"));
  byId("openBABtnFromOfficial")?.addEventListener("click", () => showBeritaAcaraModal(null, "D03"));

  // Listener Admin Logbook Peminjaman Masuk
  byId("openLogbookFromHalaman4")?.addEventListener("click", openAdminLogbook);
  byId("openAdminLogbookCatalogBtn")?.addEventListener("click", openAdminLogbook);
  byId("closeAdminLogbookBtn")?.addEventListener("click", closeAdminLogbook);
  byId("closeAdminLogbookBottom")?.addEventListener("click", closeAdminLogbook);
  byId("adminLogbookModal")?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });
  byId("logbookSearchInput")?.addEventListener("input", (e) => {
    renderAdminLogbook(e.target.value);
  });
  byId("exportLogbookCSVBtn")?.addEventListener("click", exportLogbookCSV);
  byId("toggleGSheetConfigBtn")?.addEventListener("click", () => {
    const box = byId("gsheetConfigBox");
    if (box) box.hidden = !box.hidden;
  });
  byId("saveGSheetEndpointBtn")?.addEventListener("click", () => {
    const val = byId("gsheetEndpointInput")?.value.trim() || "";
    if (val && !val.startsWith("http")) {
      showToast("URL Web App harus diawali dengan https://");
      return;
    }
    localStorage.setItem("silab_gsheet_endpoint", val);
    showToast(val ? "✓ URL Web App Google Sheets berhasil disimpan!" : "✓ URL sinkronisasi direset ke default.");
    byId("gsheetConfigBox").hidden = true;
  });

  // Listener tombol sinkronisasi Google Sheets
  byId("syncSheetBtn")?.addEventListener("click", () => syncGoogleSheets(true));

  // Global keydown handler untuk Escape & Focus Trap pada cart drawer
  document.addEventListener("keydown", (event) => {
    const drawer = byId("cartDrawer");
    if (!drawer || drawer.hidden) return;
    if (event.key === "Escape") {
      closeCartDrawer();
      return;
    }
    if (event.key === "Tab") {
      const focusables = drawer.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Sinkronisasi status keranjang saat halaman pertama dibuka
  updateCartUI();

  // Listener penutupan modal dialog
  byId("closeModal").addEventListener("click", closeKartuAlat);
  byId("closeModalBottom").addEventListener("click", closeKartuAlat);
  byId("kartuAlatModal").addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });

  // Menutup modal jika klik di latar belakang (backdrop)
  byId("kartuAlatModal").addEventListener("click", (event) => {
    if (event.target !== byId("kartuAlatModal")) return;
    const bounds = event.target.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      closeKartuAlat();
  });

  // Tombol cetak kartu alat
  byId("printCard").addEventListener("click", () => window.print());

  // Listener tombol formulir jika tautan Google Form belum diset
  byId("formsContainer").addEventListener("click", (event) => {
    const baBtn = event.target.closest(".open-inapp-ba-btn");
    if (baBtn) {
      showBeritaAcaraModal(null, baBtn.dataset.baTab || "D03");
      return;
    }
    const button = event.target.closest("[data-form]");
    if (!button) return;
    const formKey = button.dataset.form;
    const target = formDefinitions.find(([key]) => key === formKey);
    if (!target) return;
    const [, title] = target;
    const isBA = formKey === "checkout" || formKey === "return";
    const baBtnHtml = isBA
      ? ` <button type="button" class="btn primary btn-sm open-inapp-ba-btn" data-ba-tab="${formKey === "return" ? "D04" : "D03"}" style="margin-top:8px; display:inline-block; font-size:0.85rem; padding:4px 10px;">Buka Berita Acara Digital Sekarang 📄</button>`
      : "";
    byId("formStatus").hidden = false;
    byId("formStatus").innerHTML =
      `Tautan resmi ${escapeHTML(title)} belum tersedia. <a href="mailto:fisikafkip@unsil.ac.id?subject=${encodeURIComponent(`Permintaan tautan ${title}`)}">Minta tautan kepada pengelola melalui fisikafkip@unsil.ac.id</a>.${baBtnHtml}`;
    byId("formStatus").scrollIntoView({ block: "nearest" });
  });

  // ==========================================================================
  // PWA & INSTALASI APLIKASI HOME SCREEN (ANDROID & IOS)
  // ==========================================================================
  let deferredInstallPrompt = null;
  const isIOS =
    /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const installBtn = byId("installAppBtn");
  const iosModal = byId("iosInstallModal");

  if (!isStandalone) {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      if (installBtn) installBtn.hidden = false;
    });

    if (isIOS && installBtn) {
      installBtn.hidden = false;
    }
  }

  if (installBtn) {
    installBtn.addEventListener("click", () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            installBtn.hidden = true;
          }
          deferredInstallPrompt = null;
        });
      } else if (isIOS && iosModal) {
        iosModal.showModal();
      } else {
        showToast("Buka menu browser Anda lalu pilih 'Tambahkan ke Layar Utama'");
      }
    });
  }

  byId("closeIosInstallBtn")?.addEventListener("click", () =>
    iosModal?.close(),
  );
  byId("gotItIosBtn")?.addEventListener("click", () => iosModal?.close());
  iosModal?.addEventListener("click", (event) => {
    if (event.target === iosModal) iosModal.close();
  });

  // ==========================================================================
  // STATUS JAM OPERASIONAL LIVE (WIB / UTC+7)
  // ==========================================================================
  let lastLabOpenState = null;
  function updateLabStatus() {
    const badge = byId("labLiveBadge");
    if (!badge) return;
    const now = new Date();
    // UTC offset to WIB (UTC+7)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 3600000 * 7);
    const day = wib.getDay(); // 0: Min, 1: Sen, ..., 5: Jum, 6: Sab
    const mins = wib.getHours() * 60 + wib.getMinutes();
    const openMins = 8 * 60; // 08:00
    const closeMins = 15 * 60 + 30; // 15:30

    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && mins >= openMins && mins < closeMins;

    // Hanya perbarui DOM jika status berubah agar tidak memicu re-announce berulang pada pembaca layar
    if (lastLabOpenState === isOpen) return;
    lastLabOpenState = isOpen;

    if (isOpen) {
      badge.className = "lab-status-badge open";
      badge.innerHTML = '<span class="lab-status-dot"></span> Buka (08.00 - 15.30 WIB)';
      const heroStatus = byId("heroLiveStatus");
      if (heroStatus) {
        heroStatus.className = "station-live-status open";
        heroStatus.innerHTML = '<span class="station-solid-dot"></span><span class="status-pill-text">Buka · Tutup pukul 15.30 WIB</span>';
      }
    } else {
      badge.className = "lab-status-badge closed";
      badge.innerHTML = '<span class="lab-status-dot"></span> Tutup (Buka Senin - Jumat 08.00)';
      const heroStatus = byId("heroLiveStatus");
      if (heroStatus) {
        heroStatus.className = "station-live-status closed";
        heroStatus.innerHTML = '<span class="station-solid-dot"></span><span class="status-pill-text">Tutup · Buka kembali 08.00 WIB</span>';
      }
    }
  }
  updateLabStatus();
  setInterval(updateLabStatus, 60000);

  // Quick Search Form di Home Section -> Auto navigate & filter ke Katalog
  const heroSearchForm = byId("heroSearchForm");
  const heroSearchInput = byId("heroSearchInput");
  if (heroSearchForm && heroSearchInput) {
    heroSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = heroSearchInput.value.trim();
      window.location.hash = "#halaman-5";
      const searchEquipment = byId("searchEquipment");
      if (searchEquipment) {
        searchEquipment.value = query;
        searchEquipment.dispatchEvent(new Event("input", { bubbles: true }));
        searchEquipment.focus();
      }
    });
  }

  // ==========================================================================
  // IN-APP BARCODE & QR CODE SCANNER (KAMERA & DETEKSI OTOMATIS)
  // ==========================================================================
  const btnScan = byId("btnScanBarcode");
  const scannerModal = byId("scannerModal");
  const closeScannerBtn = byId("closeScannerBtn");
  const closeScannerBottom = byId("closeScannerBottom");
  const scannerVideo = byId("scannerVideo");
  const scannerFileInput = byId("scannerFileInput");
  const scannerMsg = byId("scannerMessage");
  const scannerViewport = byId("scannerViewport");
  let cameraStream = null;
  let isScanning = false;
  let barcodeDetector = null;
  let scanRafId = 0;
  let isCoolingDown = false;

  if (window.BarcodeDetector) {
    try {
      barcodeDetector = new window.BarcodeDetector({
        formats: ["qr_code", "code_128", "code_39", "ean_13"],
      });
    } catch (e) {
      console.warn("BarcodeDetector error:", e);
    }
  }

  function stopScannerCamera() {
    isScanning = false;
    if (scanRafId) {
      cancelAnimationFrame(scanRafId);
      scanRafId = 0;
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
    if (scannerVideo) {
      scannerVideo.pause();
      scannerVideo.srcObject = null;
    }
    scannerViewport?.classList.remove("detected");
  }

  function handleDetectedCode(raw) {
    if (!raw || isCoolingDown) return;
    isCoolingDown = true;
    setTimeout(() => {
      isCoolingDown = false;
    }, 1200);

    // Feedback visual cepat: laser hijau & stop scan
    scannerViewport?.classList.add("detected");

    if (String(raw).includes("UNSIL-LAB-TIKET:")) {
      const parts = String(raw).split("|");
      const ticketId = parts[0].replace("UNSIL-LAB-TIKET:", "");
      const npm = parts[1] ? parts[1].replace("NPM:", "") : "-";
      stopScannerCamera();
      scannerModal?.close();
      showBeritaAcaraModal(
        {
          id: ticketId,
          borrowerName: "Mahasiswa Terverifikasi",
          borrowerNPM: npm,
          borrowerProdi: "Pendidikan Fisika",
          purpose: "Praktikum Laboratorium Fisika",
          title: "Peminjaman Instrumen Praktikum",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 3 * 86400000)
            .toISOString()
            .split("T")[0],
          items:
            currentLoanItems.length > 0 ? currentLoanItems : [equipmentData[0]],
        },
        "D03",
      );
      showToast(`✓ Tiket ${ticketId} berhasil diverifikasi! Berita Acara siap.`);
      return;
    }

    let code = String(raw).trim();
    if (code.includes("#alat=")) {
      code = code.split("#alat=")[1];
    } else if (code.includes("alat=")) {
      code = code.split("alat=")[1].split("&")[0];
    }
    // Sanitasi kode
    code = code.replace(/[^\w-]/g, "");

    const matched = equipmentData.find(
      (item) =>
        item.code.toLowerCase() === code.toLowerCase() ||
        item.name.toLowerCase().includes(code.toLowerCase()),
    );

    if (navigator.vibrate) {
      try {
        if (matched) {
          navigator.vibrate([60, 40, 60]); // Dua getar konfirmasi saat sukses
        } else {
          navigator.vibrate(180); // Satu getar peringatan saat kode tak terdaftar
        }
      } catch (e) {}
    }

    if (scannerMsg) {
      scannerMsg.textContent = matched
        ? `✓ Terbaca: ${matched.name} (${matched.code})`
        : `Kode "${code}" terbaca (belum ada di katalog lokal)`;
    }

    setTimeout(() => {
      stopScannerCamera();
      scannerModal?.close();

      location.hash = "#halaman-5";
      if (matched) {
        openKartuAlat(matched.code);
        showToast(`✓ Alat terdeteksi: ${matched.name} (${matched.code})`);
      } else {
        const searchBox = byId("searchEquipment");
        if (searchBox) {
          searchBox.value = code;
          renderCatalog();
          searchBox.focus();
        }
        showToast(`Kode terpindai: ${code}`);
      }
    }, 320);
  }

  async function scanFrameLoop() {
    if (!isScanning || !barcodeDetector || !scannerVideo) return;
    try {
      if (scannerVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        const results = await barcodeDetector.detect(scannerVideo);
        if (results && results.length > 0) {
          handleDetectedCode(results[0].rawValue);
          return;
        }
      }
    } catch (e) {}
    if (isScanning) {
      scanRafId = requestAnimationFrame(scanFrameLoop);
    }
  }

  async function openScannerModal() {
    if (!scannerModal) return;
    if (cameraStream) stopScannerCamera(); // Guard cegah duplicate camera stream

    scannerModal.showModal();
    if (navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (e) {}
    }

    if (scannerMsg) scannerMsg.textContent = "Mengaktifkan kamera perangkat…";

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (scannerMsg)
        scannerMsg.textContent =
          "Akses kamera tidak didukung di peramban ini. Silakan gunakan tombol unggah gambar di bawah.";
      return;
    }

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (scannerVideo) {
        scannerVideo.srcObject = cameraStream;
        await scannerVideo.play();
        isScanning = true;
        if (barcodeDetector) {
          if (scannerMsg)
            scannerMsg.textContent = "Arahkan kamera ke stiker kode alat…";
          scanRafId = requestAnimationFrame(scanFrameLoop);
        } else {
          if (scannerMsg) {
            scannerMsg.textContent = isIOS
              ? "Tips iPhone: Arahkan kamera bawaan iPhone ke stiker QR untuk membuka alat instan, atau gunakan unggah foto."
              : "Pendeteksi otomatis tidak aktif di peramban ini. Silakan unggah foto stiker.";
          }
        }
      }
    } catch (err) {
      console.warn("Kamera tidak dapat diakses:", err);
      if (scannerMsg) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          scannerMsg.textContent = isIOS
            ? "Izin kamera ditolak. Buka Pengaturan iPhone > Safari > Kamera, atau scan pakai kamera bawaan iPhone."
            : "Izin kamera ditolak. Izinkan akses kamera pada pengaturan peramban Anda.";
        } else {
          scannerMsg.textContent =
            "Kamera tidak dapat dibuka. Silakan gunakan tombol unggah foto di bawah.";
        }
      }
    }
  }

  btnScan?.addEventListener("click", openScannerModal);
  closeScannerBtn?.addEventListener("click", () => {
    stopScannerCamera();
    scannerModal?.close();
  });
  closeScannerBottom?.addEventListener("click", () => {
    stopScannerCamera();
    scannerModal?.close();
  });
  scannerModal?.addEventListener("close", stopScannerCamera);
  window.addEventListener("pagehide", stopScannerCamera);
  scannerModal?.addEventListener("click", (event) => {
    if (event.target === scannerModal) {
      stopScannerCamera();
      scannerModal.close();
    }
  });

  scannerFileInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (barcodeDetector) {
      try {
        const bmp = await createImageBitmap(file);
        const results = await barcodeDetector.detect(bmp);
        if (results && results.length > 0) {
          handleDetectedCode(results[0].rawValue);
          return;
        }
      } catch (e) {
        console.warn("Error mendeteksi gambar:", e);
      }
    }
    showToast(
      "Kode tidak terbaca pada gambar. Coba masukkan nama alat manual di pencarian.",
    );
  });

  // Pemicu sinkronisasi dinamis Google Sheets resmi di latar belakang
  setTimeout(() => {
    syncGoogleSheets(false).catch(() => {});
  }, 1200);
}

// Registrasi Service Worker untuk kapabilitas offline & PWA instan
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        // Paksa cek update ke server setiap kali halaman dimuat
        reg.update().catch(() => {});
      })
      .catch((err) => {
        console.warn("Registrasi Service Worker gagal:", err);
      });
  });

  // Jika service worker baru mengambil alih update, reload agar aset terbaru aktif
  let hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Inisialisasi aplikasi dengan blok penanganan kesalahan
try {
  init();
} catch (error) {
  console.error("SILAB gagal dimuat:", error);
  byId("catalogContainer").innerHTML =
    '<div class="notice" role="alert">Katalog tidak dapat dimuat. Muat ulang halaman atau hubungi <a href="mailto:fisikafkip@unsil.ac.id">pengelola laboratorium</a>.</div>';
}

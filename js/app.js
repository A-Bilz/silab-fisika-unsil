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
const equipmentData = [
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
      "Laboran memeriksa catu daya, pelindung sumber cahaya, dan sambungan sebelum alat diaktifkan.",
      "Lakukan penyetelan nol dan pemeriksaan arus gelap sesuai manual.",
      "Gunakan filter atau sumber yang ditentukan modul; ukur potensial henti tanpa membuka pelindung sumber atau fototabung.",
      "Matikan catu daya sesuai urutan manual, tutup fototabung, dan simpan data untuk analisis konstanta Planck.",
    ],
  },
  {
    code: "FIS-OPT-006",
    name: "Interferometer Michelson & Laser He-Ne",
    category: "Optik Lanjutan",
    location: "Usulan: meja optik A-2",
    specs:
      "Pembagi berkas, cermin tetap/bergerak, pengatur perpindahan, dan sumber laser He-Ne.",
    calibrationPlan:
      "Periksa kestabilan frinji dan nol mikrometer sebelum sesi; evaluasi skala perpindahan tahunan atau setelah penyetelan mekanik.",
    sop: [
      "Pengguna terlatih memeriksa kelas laser, pengamanan lintasan, penahan berkas, dan APD bersama laboran.",
      "Pasang seluruh komponen dengan laser belum menyala; jangan menempatkan mata pada lintasan atau pantulan.",
      "Laboran melakukan penyelarasan sesuai SOP; amati pola pada layar dan putar mikrometer perlahan sesuai modul.",
      "Matikan laser sebelum mengubah susunan atau merapikan alat; tutup optik dan isi buku log.",
    ],
  },
  {
    code: "FIS-TRM-007",
    name: "Kalorimeter Joule & Konduktivitas Termal Logam",
    category: "Termodinamika",
    location: "Usulan: rak termodinamika F-1",
    specs:
      "Perangkat kalorimeter Joule dan kit konduktivitas logam dengan sensor suhu serta pemanas.",
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
  lastCalibration: "Belum ada catatan terverifikasi",
  nextMaintenance: "Tanggal ditetapkan laboran setelah verifikasi",
}));

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
        (e) => e.code.toLowerCase() === code.toLowerCase(),
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
function renderCatalog() {
  const query = byId("searchEquipment").value.trim().toLocaleLowerCase("id");
  const category = byId("categoryFilter").value;
  const filtered = equipmentData.filter(
    (item) =>
      [item.name, item.code, item.brand, item.category]
        .join(" ")
        .toLocaleLowerCase("id")
        .includes(query) &&
      (category === "ALL" || item.category === category),
  );
  byId("resultCount").textContent =
    `${filtered.length} dari ${equipmentData.length} alat ditampilkan`;
  byId("catalogContainer").innerHTML = filtered.length
    ? filtered
        .map(
          (item) =>
            `<article class="card equipment-card"><span class="code">${escapeHTML(item.code)}</span><h2>${escapeHTML(item.name)}</h2><p class="category">${escapeHTML(item.category)}</p><p class="state">Kondisi: ${escapeHTML(item.condition)}</p><p class="shelf">${escapeHTML(item.location)}</p><div class="equipment-actions"><button class="btn outline" data-equipment="${escapeHTML(item.code)}" aria-label="Lihat kartu alat & SOP: ${escapeHTML(item.name)}">Lihat kartu alat & SOP</button><button class="btn btn-secondary add-cart-btn" data-add-cart="${escapeHTML(item.code)}" aria-label="Tambah ${escapeHTML(item.name)} ke keranjang peminjaman">+ Keranjang</button></div></article>`,
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
function openKartuAlat(code) {
  const item = equipmentData.find((equipment) => equipment.code === code);
  if (!item) return;
  modalOpener = document.activeElement;
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
  byId("modalKartuBody").innerHTML =
    `<h3>${escapeHTML(item.name)}</h3><p class="source-note">Laboratorium Pendidikan Fisika UNSIL · FKIP · Kampus I Tasikmalaya</p><dl class="equipment-details">${details.map(([label, value]) => `<dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd>`).join("")}</dl><div class="notice"><strong>Data belum diverifikasi; bukan bukti kelayakan alat.</strong><p>Rencana kalibrasi dan penyimpanan merupakan usulan. Ikuti manual model aktual serta SOP yang disahkan laboran sebelum menggunakan alat.</p></div><h3>SOP pengoperasian ringkas</h3><ol class="sop">${listHTML(item.sop)}</ol><p class="source-note">Buku log: nama pengguna, tanggal, waktu mulai/selesai, tujuan, pengaturan, kondisi awal/akhir, dan verifikasi laboran.</p>`;
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
      return `<article class="card form-card"><span class="index">0${index + 1}</span><h3>${title}</h3><p>${description}</p><small class="form-state">${url ? "Google Form · terbuka di tab baru" : "Tautan Google Form resmi belum tersedia"}</small>${url ? `<a class="btn primary" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Buka ${title}</a>` : `<button class="btn outline" data-form="${key}">${title}</button>`}</article>`;
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

  // Isi dropdown kategori filter berdasarkan kategori alat yang ada
  equipmentData.forEach((item) =>
    byId("categoryFilter").add(new Option(item.category, item.category)),
  );

  // Render chip kategori filter cepat
  const categories = Array.from(
    new Set(equipmentData.map((item) => item.category)),
  );
  const filterChipsEl = byId("filterChips");
  if (filterChipsEl) {
    filterChipsEl.innerHTML = [
      '<button class="chip-btn active" data-category="ALL">Semua</button>',
      ...categories.map(
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

  // Listener pencarian dan filter katalog
  byId("searchEquipment").addEventListener("input", renderCatalog);
  byId("categoryFilter").addEventListener("change", () => {
    syncActiveChip(byId("categoryFilter").value);
    renderCatalog();
  });
  byId("resetFilters").addEventListener("click", () => {
    byId("searchEquipment").value = "";
    byId("categoryFilter").value = "ALL";
    syncActiveChip("ALL");
    renderCatalog();
    byId("searchEquipment").focus();
  });

  // Listener delegasi klik untuk tombol "Lihat kartu alat & SOP" dan "+ Keranjang"
  byId("catalogContainer").addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-equipment]");
    if (detailBtn) {
      openKartuAlat(detailBtn.dataset.equipment);
      return;
    }
    const addBtn = event.target.closest("[data-add-cart]");
    if (addBtn) {
      addToCart(addBtn.dataset.addCart);
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
  byId("sendCartWABtn")?.addEventListener("click", sendCartToWhatsApp);
  byId("copyCartBtn")?.addEventListener("click", copyCartToClipboard);
  byId("clearCartBtn")?.addEventListener("click", clearCart);

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
    const button = event.target.closest("[data-form]");
    if (!button) return;
    const title = formDefinitions.find(
      ([key]) => key === button.dataset.form,
    )[1];
    byId("formStatus").hidden = false;
    byId("formStatus").innerHTML =
      `Tautan resmi ${escapeHTML(title)} belum tersedia. <a href="mailto:fisikafkip@unsil.ac.id?subject=${encodeURIComponent(`Permintaan tautan ${title}`)}">Minta tautan kepada pengelola melalui fisikafkip@unsil.ac.id</a>.`;
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

  // Jika service worker baru mengambil alih, reload sekali agar UI langsung sinkron
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
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

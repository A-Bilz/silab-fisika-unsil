"use strict";

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
const config = window.SILAB_CONFIG || {};
const byId = (id) => document.getElementById(id);
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const listHTML = (items) =>
  items.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
let modalOpener;
const menuMedia = window.matchMedia("(max-width: 60rem)");
menuMedia.addEventListener("change", () => setMenu(false));

function setMenu(open) {
  byId("menuToggle").setAttribute("aria-expanded", String(open));
  byId("navigation").classList.toggle("open", open);
  byId("navigation").hidden = menuMedia.matches && !open;
}

function switchPage(focus = true) {
  const hash = location.hash.slice(1);
  if (hash === "main") {
    byId("main").focus();
    return;
  }
  if (byId("kartuAlatModal").open) closeKartuAlat();
  const target = /^halaman-[1-6]$/.test(hash) ? hash : "halaman-1";
  if (hash !== target) history.replaceState(null, "", `#${target}`);
  document.querySelectorAll(".page-section").forEach((section) => {
    section.hidden = section.id !== target;
    section.classList.toggle("active", section.id === target);
  });
  document.querySelectorAll(".nav-btn").forEach((link) => {
    link.classList.toggle("active", link.hash === `#${target}`);
    if (link.hash === `#${target}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  setMenu(false);
  const heading = byId(target).querySelector("h1");
  document.title = `${document.querySelector('.nav-btn[aria-current="page"]').textContent} | SILAB FISIKA UNSIL`;
  if (focus) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

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
            `<article class="card equipment-card"><span class="code">${escapeHTML(item.code)}</span><h2>${escapeHTML(item.name)}</h2><p class="category">${escapeHTML(item.category)}</p><p class="state">Kondisi: ${escapeHTML(item.condition)}</p><p class="shelf">${escapeHTML(item.location)}</p><button class="btn outline" data-equipment="${escapeHTML(item.code)}" aria-label="Lihat kartu alat & SOP: ${escapeHTML(item.name)}">Lihat kartu alat & SOP</button></article>`,
        )
        .join("")
    : '<div class="empty-state"><h2>Tidak ada alat yang cocok</h2><p>Coba kata kunci lain atau gunakan tombol Reset filter.</p></div>';
}

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

function closeKartuAlat() {
  byId("kartuAlatModal").close();
}

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

function renderForms() {
  byId("formsContainer").innerHTML = formDefinitions
    .map(([key, title, description], index) => {
      const url = googleFormURL(config.forms?.[key]);
      return `<article class="card form-card"><span class="index">0${index + 1}</span><h3>${title}</h3><p>${description}</p><small class="form-state">${url ? "Google Form · terbuka di tab baru" : "Tautan Google Form resmi belum tersedia"}</small>${url ? `<a class="btn primary" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Buka ${title}</a>` : `<button class="btn outline" data-form="${key}">${title}</button>`}</article>`;
    })
    .join("");
}

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

function init() {
  if (typeof config.serviceHours === "string" && config.serviceHours.trim())
    byId("serviceHours").textContent = config.serviceHours;
  byId("courseList").innerHTML = courses
    .map(
      ([code, semester, title, modules]) =>
        `<article class="course"><div class="course-meta"><small>Semester ${semester}</small><strong>${code}</strong></div><div class="course-content"><h2>${title}</h2><ul class="module-list">${listHTML(modules)}</ul><p class="coordinator"><strong>Koordinator:</strong> Dosen pengampu ${title}; penugasan belum dikonfirmasi program studi.</p></div></article>`,
    )
    .join("");
  equipmentData.forEach((item) =>
    byId("categoryFilter").add(new Option(item.category, item.category)),
  );
  byId("courseList").insertAdjacentHTML(
    "afterbegin",
    '<p class="source-note">Rancangan praktikum: kode, semester, dan modul perlu dicocokkan dengan kurikulum UNSIL yang berlaku.</p>',
  );
  const services = [
    ...equipmentData.map((item) => item.name),
    "Praktikum terjadwal / penggunaan ruang",
    "Penggunaan instrumen untuk penelitian",
    "Pengukuran dan pengujian sampel fisika",
    "Pendampingan operator / laboran",
    "Pelatihan eksperimen sekolah & OSN",
    "Pengembangan dan pengujian kit alat peraga",
  ];
  byId("ratesBody").innerHTML = services
    .map(
      (service) =>
        `<tr><th scope="row">${escapeHTML(service)}</th><td>Menunggu tarif resmi</td><td>Menunggu tarif resmi</td><td>Menunggu tarif resmi</td></tr>`,
    )
    .join("");
  renderGallery();
  renderForms();
  renderCatalog();
  switchPage(false);
  window.addEventListener("hashchange", () => switchPage());
  document.querySelectorAll('a[href^="#halaman-"]').forEach((link) =>
    link.addEventListener("click", () => {
      if (link.hash === location.hash) switchPage();
    }),
  );
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
  byId("searchEquipment").addEventListener("input", renderCatalog);
  byId("categoryFilter").addEventListener("change", renderCatalog);
  byId("resetFilters").addEventListener("click", () => {
    byId("searchEquipment").value = "";
    byId("categoryFilter").value = "ALL";
    renderCatalog();
    byId("searchEquipment").focus();
  });
  byId("catalogContainer").addEventListener("click", (event) => {
    const button = event.target.closest("[data-equipment]");
    if (button) openKartuAlat(button.dataset.equipment);
  });
  byId("closeModal").addEventListener("click", closeKartuAlat);
  byId("closeModalBottom").addEventListener("click", closeKartuAlat);
  byId("kartuAlatModal").addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (modalOpener?.isConnected) modalOpener.focus();
  });
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
  byId("printCard").addEventListener("click", () => window.print());
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
}

try {
  init();
} catch (error) {
  console.error("SILAB gagal dimuat:", error);
  byId("catalogContainer").innerHTML =
    '<div class="notice" role="alert">Katalog tidak dapat dimuat. Muat ulang halaman atau hubungi <a href="mailto:fisikafkip@unsil.ac.id">pengelola laboratorium</a>.</div>';
}

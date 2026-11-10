import urllib.request
import csv
import io
import json

sid = '1pLms8u0h-KzzGCAdGwq-MxSu0V10XOoY5JBxDlTr0QQ'
csv_url = f'https://docs.google.com/spreadsheets/d/{sid}/export?format=csv'
req = urllib.request.Request(csv_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    text = resp.read().decode('utf-8')

reader = csv.reader(io.StringIO(text))
rows = list(reader)

sheet_items = {}
for r in rows[13:]:
    if len(r) >= 3 and r[2].strip():
        name = r[2].strip()
        code = r[1].strip() if len(r) > 1 else ''
        specs = r[3].strip() if len(r) > 3 else ''
        baik = int(r[4].strip()) if len(r) > 4 and r[4].strip().isdigit() else 0
        rusak_ringan = int(r[5].strip()) if len(r) > 5 and r[5].strip().isdigit() else 0
        rusak_berat = int(r[6].strip()) if len(r) > 6 and r[6].strip().isdigit() else 0
        satuan = r[7].strip() if len(r) > 7 and r[7].strip() else 'Buah'
        date_in = r[8].strip() if len(r) > 8 else ''
        keterangan = r[9].strip() if len(r) > 9 else ''
        dipinjam = int(r[10].strip()) if len(r) > 10 and r[10].strip().isdigit() else 0
        total_tersedia = int(r[11].strip()) if len(r) > 11 and r[11].strip().isdigit() else baik
        
        sheet_items[name] = {
            'code': code,
            'specs': specs,
            'baik': baik,
            'rusak_ringan': rusak_ringan,
            'rusak_berat': rusak_berat,
            'total': baik + rusak_ringan + rusak_berat,
            'satuan': satuan,
            'date_in': date_in,
            'keterangan': keterangan,
            'dipinjam': dipinjam,
            'total_tersedia': total_tersedia
        }

besar_list = [
    ('Kit Mekanika', 'FME-KM-04', 'Mekanika & Kalibrasi', 'Rak Mekanika B-2', 'Pudak Scientific', [
        'Periksa kelengkapan rel presisi, tumpakan, dan kereta dinamika bersama laboran.',
        'Susun rangkaian percobaan mekanika di atas meja datar dan kunci kaki statif.',
        'Gunakan beban dan timer sesuai petunjuk modul praktikum mekanika.',
        'Setelah selesai, bersihkan rel dan simpan seluruh komponen ke dalam boks kit.'
    ]),
    ('Kit Listrik dan Magnet', 'FEM-KL-004', 'Elektronika & Instrumentasi', 'Lemari Elektromagnet G-1', 'Pudak Scientific', [
        'Periksa kondisi kumparan, inti besi, papan rangkaian, dan kabel penghubung.',
        'Hubungkan ke catu daya dengan tegangan rendah sesuai spesifikasi modul.',
        'Pastikan tidak terjadi korsleting dan amati jarum meter galvanometer/multimeter.',
        'Matikan catu daya sebelum mencabut kabel dan rapikan kembali komponen ke boks kit.'
    ]),
    ('Kit Optik', 'FPT-KO-004', 'Optik & Astronomi', 'Lemari Optik A-1', 'Pudak Scientific', [
        'Periksa kebersihan meja optik, lensa, cermin, dan sumber cahaya kotak lampu.',
        'Pasang komponen optik pada rel tanpa menyentuh permukaan kaca secara langsung.',
        'Nyalakan lampu sumber cahaya dan lakukan pengukuran fokus/pembiasan dengan teliti.',
        'Matikan kotak cahaya, biarkan dingin, lalu simpan seluruh komponen optik ke tempat pelindung.'
    ]),
    ('Kit gelombang dan termodinamika', 'FGE-KGT-004', 'Gelombang & Termodinamika', 'Rak Gelombang C-2', 'Pudak Scientific', [
        'Periksa kelengkapan pipa resonansi, pembangkit getaran, dan sensor termal.',
        'Rangkai alat secara stabil dan kalibrasi titik awal frekuensi atau skala suhu.',
        'Lakukan pengamatan pola gelombang atau konduksi panas sesuai modul praktikum.',
        'Keringkan komponen bila terkena cairan dan simpan kembali ke lemari penyimpanan.'
    ]),
    ('Ripple Tank', 'FGE-RT-004', 'Gelombang & Termodinamika', 'Meja Tangki Riak C-1', 'Pudak Scientific', [
        'Isi wadah tangki dengan air bersih setinggi 1-1,5 cm pada permukaan meja datar.',
        'Atur stroboskop dan motor pembangkit riak gelombang hingga pola bayangan tampak jelas.',
        'Gunakan pembias atau penghalang untuk mengamati difraksi dan interferensi gelombang.',
        'Kuras air secara hati-hati melalui selang pembuangan, keringkan tangki, dan matikan unit stroboskop.'
    ]),
    ('Kit Bidang miring', 'FME-KB-04', 'Mekanika & Kalibrasi', 'Rak Mekanika B-3', 'Pudak Scientific', [
        'Pasang bidang miring pada sudut elevasi yang ditentukan dengan busur derajat presisi.',
        'Tempatkan balok peluncur pada puncak bidang dan siapkan pencatat waktu / neraca pegas.',
        'Lepaskan balok luncur tanpa kecepatan awal dan catat waktu serta gaya gesek.',
        'Rapikan balok luncur, kendurkan klem busur derajat, dan simpan kembali ke rak.'
    ]),
    ('Osiloskop Dual Chanel', 'FET-001-04', 'Elektronika & Instrumentasi', 'Rak Elektronika B-1', 'Digital Storage 100 MHz', [
        'Periksa pembumian (grounding) dan kabel daya unit sebelum menghidupkan osiloskop.',
        'Hubungkan probe kanal 1 atau 2 ke terminal kalibrasi 1 kHz untuk memeriksa kompensasi probe.',
        'Atur skala Volt/Div dan Time/Div serta level trigger agar sinyal tertampil stabil.',
        'Simpan hasil tangkapan gelombang, matikan unit daya, dan gulung kabel probe dengan rapi.'
    ]),
    ('Eduscope 3000', 'FET-001-01', 'Elektronika & Instrumentasi', 'Rak Elektronika B-1', 'Pudak Scientific 250 MS/s', [
        'Hubungkan kabel daya dan pastikan layar TFT 8 inci menyala normal tanpa error sistem.',
        'Lakukan kalibrasi probe 2 kanal dan atur sampling rate sesuai frekuensi sinyal input.',
        'Gunakan menu penyimpanan digital internal untuk merekam hingga 10.000 titik data.',
        'Ekspor data gelombang bila diperlukan, matikan alat melalui prosedur shutdown, dan rapikan kabel.'
    ]),
    ('Teleskop Starsense Explore LT 80AZ Smartphone App-Enabled Refraktor', 'FPT-001-01', 'Optik & Astronomi', 'Ruang Instrumen Astronomi', 'Celestron 80mm Refractor', [
        'Rakit tripod aluminium dan pasang tabung optik 80 mm secara seimbang pada mount altazimuth.',
        'Pasang dock smartphone dan kalibrasi posisi kamera ponsel dengan aplikasi StarSense Explorer.',
        'Arahkan teleskop ke objek langit malam (bintang, bulan, planet) melalui panduan slow-motion rod.',
        'Setelah pengamatan selesai, lepas smartphone dock, tutup pelindung lensa objektif, dan simpan dalam tas khusus.'
    ]),
    ('Teleskop Astronomi', 'FPT-002-02', 'Optik & Astronomi', 'Ruang Instrumen Astronomi', 'Refraktor f=800mm D=60mm', [
        'Buka kaki tripod aluminium dan pastikan posisi berdiri kokoh di area pengamatan terbuka.',
        'Pasang diagonal 90 derajat dan lensa okuler pembesaran rendah (H20mm) terlebih dahulu.',
        'Gunakan finderscope 5x24 untuk memfokuskan objek target lalu beralih ke okuler pembesaran tinggi.',
        'Tutup rapat lensa objektif dan okuler setelah pengamatan untuk mencegah debu dan kelembapan.'
    ]),
    ('Tabung Viskositas', 'FSC-003-05', 'Gelombang & Termodinamika', 'Meja Fluida D-2', 'Plexiglass 56x680 mm', [
        'Isi tabung plexiglass dengan cairan uji (gliserin / oli) hingga batas tanda skala atas.',
        'Ukur diameter dan massa bola uji menggunakan mikrometer sekrup dan neraca analitis.',
        'Jatuhkan bola uji di tengah tabung dan catat waktu tempuh antara dua batas skala menggunakan stopwatch.',
        'Gunakan sendok magnetik untuk mengambil kembali bola uji dari dasar tabung, lalu bersihkan alat.'
    ]),
    ('Momen Inersia', 'FME-008-01', 'Mekanika & Kalibrasi', 'Rak Mekanika B-2', 'Pudak Scientific AT-01', [
        'Pasang benda uji (silinder pejal, bola pejal, atau cakram) pada poros pemutar aparatus.',
        'Hubungkan gerbang cahaya (photogate) ke pewaktu cacah digital AT-01.',
        'Beri beban gantung penggerak dan lepaskan hingga memicu counter pencacah digital.',
        'Catat waktu putaran, hitung momen inersia eksperimental, dan rapikan benda uji ke kotaknya.'
    ]),
    ('Tabung resonansi', 'FGE-001-01', 'Gelombang & Termodinamika', 'Rak Gelombang C-1', 'Pudak Scientific Sound Kit', [
        'Hubungkan generator frekuensi audio ke speaker sumber pada mulut tabung resonansi.',
        'Geser posisi piston air atau mikrofon detektor di dalam tabung hingga tercapai amplitudo puncak.',
        'Catat posisi titik resonansi pertama, kedua, dan seterusnya untuk menghitung cepat rambat bunyi.',
        'Matikan generator sinyal suara dan kembalikan piston ke posisi dasar.'
    ]),
    ('Gas Ideal', 'FSG-001-01', 'Gelombang & Termodinamika', 'Rak Termodinamika C-3', 'Pudak Scientific Boyle-GayLussac', [
        'Periksa kerapatan katup tabung silinder gas dan pembacaan manometer tekanan udara.',
        'Ubah volume tabung silinder secara perlahan dan catat perubahan tekanan pada manometer.',
        'Pastikan suhu ruangan konstan selama pengujian hukum Boyle berlangsung.',
        'Kembalikan piston tabung silinder ke posisi netral dan buka katup tekanan setelah selesai.'
    ]),
    ('Alat sistem Radiasi Termal', 'FPA-002-01', 'Gelombang & Termodinamika', 'Rak Termodinamika C-3', 'Pudak Scientific Leslie Cube', [
        'Isi kubus Leslie dengan air panas bersuhu terukur dan letakkan sensor radiometer pada jarak tetap.',
        'Arahkan sensor berturut-turut ke permukaan hitam kusam, putih, mengkilap, dan kasar.',
        'Catat nilai beda potensial termokopel untuk membandingkan emisivitas masing-masing permukaan.',
        'Kosongkan kubus radiasi, tunggu hingga suhu mendingin, lalu keringkan permukaan logam.'
    ]),
    ('Milikan oil drop', 'FMD-002-01', 'Pengukuran & Kimia Fisika', 'Meja Fisika Modern E-2', 'Apparatus Muatan Elektron e', [
        'Hubungkan catu daya tegangan tinggi DC dan mikroskop pengamat tetes minyak Milikan.',
        'Semprotkan tetes minyak halus ke dalam ruang plat kapasitor medan listrik.',
        'Atur tegangan plat hingga satu tetes minyak melayang seimbang melawan gravitasi bumi.',
        'Hitung kecepatan jatuh bebas dan kecepatan gerak ke atas tetes minyak untuk menentukan muatan elektron.'
    ]),
    ('Thermoelektrik Effeck', 'FMD-001-01', 'Pengukuran & Kimia Fisika', 'Meja Fisika Modern E-1', 'Seebeck & Peltier Module', [
        'Siapkan modul Seebeck/Peltier dengan dua reservoir suhu (panas dan dingin).',
        'Hubungkan voltmeter digital peka ke terminal keluaran modul termoelektrik.',
        'Catat beda tegangan yang dihasilkan sebanding dengan gradien perbedaan suhu.',
        'Putuskan koneksi multimeter dan rapikan modul beserta sensor suhu digital.'
    ]),
    ('Signal generator Dual Chanel', 'FET-008-04', 'Elektronika & Instrumentasi', 'Rak Elektronika B-2', 'Function Generator DDS', [
        'Sambungkan unit ke stopkontak AC 220V dan nyalakan tombol power utama.',
        'Pilih bentuk gelombang keluaran (Sinus, Kotak, Segitiga, Pulse) dan atur rentang frekuensi yang diinginkan.',
        'Atur level tegangan puncak-ke-puncak (Vp-p) dan hubungkan probe BNC ke rangkaian beban praktikum.',
        'Turunkan amplitudo ke posisi minimum sebelum mematikan saklar power generator.'
    ]),
    ('Audiogenerator', 'FET-009-01', 'Elektronika & Instrumentasi', 'Rak Elektronika B-2', 'Audio Generator 10Hz-1MHz', [
        'Periksa kesesuaian tegangan input dan hubungkan kabel daya unit audio generator.',
        'Pilih rentang frekuensi audio (10 Hz hingga 1 MHz) dengan akurasi tinggi.',
        'Hubungkan kabel keluaran 600 ohm ke rangkaian penguat atau tabung resonansi bunyi.',
        'Matikan alat setelah praktikum akustik selesai dan gulung kabel dengan aman.'
    ]),
    ('Catu Daya GSE 100', 'FET-002-01', 'Elektronika & Instrumentasi', 'Rak Catu Daya B-3', 'Power Supply 3/6/9/12V', [
        'Pastikan saklar daya berada di posisi OFF sebelum menghubungkan kabel ke stopkontak PLN.',
        'Pilih selektor tegangan output DC (3V, 6V, 9V, atau 12V) sesuai kebutuhan rangkaian percobaan.',
        'Gunakan soket pisang (banana plug) bertanda merah (+) dan hitam (-) untuk menghubungkan ke beban.',
        'Cabut beban terlebih dahulu sebelum mematikan saklar power catu daya.'
    ]),
    ('Timbangan Presisi ', 'FME-007-01', 'Pengukuran & Kimia Fisika', 'Meja Timbang Analitis D-1', '0.001g Precision Balance 500g', [
        'Tempatkan timbangan presisi di atas meja bebas getaran dan periksa indikator waterpass gelembung udara.',
        'Nyalakan timbangan digital dan tekan tombol Tare untuk menyetel pembacaan nol pada layar LCD.',
        'Gunakan cawan timbang tertutup kaca pelindung hembusan angin saat meletakkan sampel uji.',
        'Catat hasil pengukuran dengan resolusi 0,001 g, bersihkan piringan timbang dengan kuas halus, dan matikan unit.'
    ]),
    ('Neraca Ohaus 4 lengan', 'FME-003-05', 'Pengukuran & Kimia Fisika', 'Lemari Pengukuran D-1', 'Kapasitas 311g Ketelitian 0.1g', [
        'Letakkan neraca di meja datar dan kokoh, pastikan semua anting pemberat berada di posisi skala nol.',
        'Putar sekrup penyetel nol hingga garis indeks pada ujung lengan berimpit dengan garis nol keseimbangan.',
        'Letakkan benda pada piringan timbang, lalu geser anting pemberat dari lengan terbesar ke lengan terkecil.',
        'Jumlahkan nilai pembacaan dari keempat lengan, lalu kembalikan semua anting ke posisi nol.'
    ]),
    ('Neraca Ohaus 3 lengan', 'FME-004-004', 'Pengukuran & Kimia Fisika', 'Lemari Pengukuran D-1', 'Kapasitas 2610g Ketelitian 0.1g', [
        'Periksa kebersihan piringan timbang dan kembalikan ketiga anting pemberat ke batas nol.',
        'Atur tombol kalibrasi nol sampai garis keseimbangan neraca sejajar horizontal.',
        'Taruh benda uji pada cawan neraca dan geser rider dari lengan 100g, 10g, hingga skala gram terkecil.',
        'Angkat benda uji setelah pengukuran dan bersihkan sisa serbuk/debu di atas piringan timbang.'
    ]),
    ('Authentic Mesin Laser Cutting Akrilik', 'TKT-007-01', 'Alat Bengkel Lab', 'Bengkel Pembuatan Alat Peraga', 'Sculpfun S9 Dioda Laser 90W', [
        'Gunakan kacamata pelindung laser (safety goggles) sebelum menghubungkan daya mesin potong laser.',
        'Pasang benda kerja akrilik atau kayu pada area kerja berukuran 410x420 mm secara rata.',
        'Atur jarak fokus lensa laser menggunakan plat acuan dan hubungkan perangkat lunak kontrol pemotongan.',
        'Pastikan sistem ventilasi udara menyala dan jangan tinggalkan mesin tanpa pengawasan saat proses potong berjalan.'
    ]),
    ('muschenbrook', 'FPA-003-04', 'Gelombang & Termodinamika', 'Rak Termodinamika C-3', 'Aparatus Pemuaian Musschenbroek', [
        'Pasang batang logam uji (tembaga, aluminium, besi) pada dudukan penjepit aparatus.',
        'Setel jarum penunjuk skala putar tepat menunjuk pada angka nol derajat defleksi.',
        'Nyalakan pembakar spirtus di bawah batang logam dan amati pertambahan panjang melalui pembesaran jarum.',
        'Padamkan pembakar spirtus dengan tutup penutupnya dan biarkan batang logam dingin sebelum dilepas.'
    ])
]

kecil_list = [
    ('Jangka sorong (skala 0,05 mm)', 'FME-001-05', 'Pengukuran & Kimia Fisika', 'Lemari Alat Ukur D-2', '200 mm Akurasi 0.05 mm', [
        'Bersihkan rahang jangka sorong dan geser rahang geser hingga rapat untuk memeriksa kesalahan nol.',
        'Jepit benda ukur di antara rahang bawah untuk diameter luar atau rahang atas untuk diameter dalam.',
        'Kunci baut pengencang dan baca angka pada skala utama yang dilewati garis nol nonius.',
        'Cari garis nonius yang paling lurus berimpit dengan garis skala utama untuk nilai desimal 0,05 mm.'
    ]),
    ('Jangka sorong (skala 0,02 mm)', 'FME-001-05', 'Pengukuran & Kimia Fisika', 'Lemari Alat Ukur D-2', '200 mm Akurasi 0.02 mm', [
        'Pastikan permukaan rahang ukur bersih dari partikel debu atau minyak pelumas.',
        'Tutup rahang geser perlahan dan pastikan garis 0 nonius berimpit sempurna dengan garis 0 skala utama.',
        'Lakukan pengukuran pada bagian luar, dalam, atau kedalaman celah benda uji.',
        'Baca nilai skala utama ditambah pembacaan garis skala nonius presisi 0,02 mm.'
    ]),
    ('Mikrometer sekrup', 'FME-002-05', 'Pengukuran & Kimia Fisika', 'Lemari Alat Ukur D-2', 'Ukuran 0-25 mm Akurasi 0.01 mm', [
        'Bersihkan landasan (anvil) dan spindel ukur dengan kertas bersih sebelum digunakan.',
        'Putar rachet knob hingga landasan dan spindel merapat bunyi klik 2-3 kali untuk mengecek titik nol.',
        'Letakkan benda tipis (kawat/kaca) di antara rahang lalu putar rachet secara hati-hati hingga berbunyi klik.',
        'Kunci tuas pengunci dan baca skala utama pada laras serta skala putar pada thimble dengan ketelitian 0,01 mm.'
    ]),
    ('Stopwach analog', 'FME-005-01', 'Pengukuran & Kimia Fisika', 'Kotak Waktu D-3', 'Diamond 1/5s Mechanical', [
        'Tekan tombol pemutar (crown) atas untuk mengembalikan kedua jarum penunjuk detik dan menit ke posisi nol.',
        'Tekan crown satu kali untuk memulai perhitungan waktu stopwatch bertepatan dengan mulainya gerak benda.',
        'Tekan crown kedua kali untuk menghentikan putaran jarum dan baca interval waktu hingga resolusi 0,2 sekon.',
        'Tekan crown ketiga kali untuk mereset jarum kembali ke titik awal sebelum penyimpanan.'
    ]),
    ('Stopwatch Digital', 'FME-012-06', 'Pengukuran & Kimia Fisika', 'Kotak Waktu D-3', 'Digital LCD 1/100s Split', [
        'Nyalakan stopwatch digital dan tekan tombol Split/Reset untuk memastikan tampilan layar 00:00:00.',
        'Tekan tombol Start/Stop di sisi kanan atas saat fenomena eksperimen dimulai.',
        'Gunakan fungsi Lap/Split untuk mencatat waktu antara tanpa menghentikan penghitungan waktu total.',
        'Tekan Start/Stop untuk menyelesaikan pencatatan dan tekan Reset sebelum dimasukkan ke wadah pelindung.'
    ]),
    ('Alat ukur sentripetal', 'FME-006-05', 'Mekanika & Kalibrasi', 'Rak Mekanika B-3', 'Apparatus Sentripetal 15 cm', [
        'Pasang beban putar pada tali nilon melalui tabung pegangan silinder kaca/plastik halus.',
        'Gantungkan beban penyeimbang pada ujung bawah tali dengan penanda batas jari-jari putaran.',
        'Putar beban atas secara horizontal dengan kecepatan konstan hingga penanda batas tetap di bawah tabung.',
        'Hitung waktu untuk 20 atau 30 putaran menggunakan stopwatch untuk menentukan gaya sentripetal.'
    ]),
    ('Multimeter digital', 'FET-007-10', 'Elektronika & Instrumentasi', 'Lemari Elektronika B-3', 'Auto Ranging 6000 Counts', [
        'Pasang kabel probe hitam ke soket COM dan probe merah ke soket V/Ohm atau mA/A sesuai kebutuhan.',
        'Putar saklar selektor fungsi ke mode pengukuran yang dituju (Tegangan AC/DC, Resistansi, atau Kontinuitas).',
        'Sentuhkan kedua ujung probe pengukur ke titik uji rangkaian dan baca nilai stabil pada layar LCD backlight.',
        'Matikan multimeter ke posisi OFF setelah sesi selesai untuk menghemat daya baterai.'
    ]),
    ('Multimeter analog', 'FET-003-04', 'Elektronika & Instrumentasi', 'Lemari Elektronika B-3', 'Sunwa 160x129x42 mm', [
        'Atur jarum penunjuk mekanik tepat di angka nol sebelah kiri sebelum menghubungkan rangkaian.',
        'Pilih batas ukur saklar putar yang lebih tinggi dari perkiraan nilai tegangan atau arus rangkaian.',
        'Untuk pengukuran hambatan, lakukan zero-ohm adjustment dengan menghubungkan kedua probe dan memutar knop ADJ.',
        'Posisikan pandangan mata tegak lurus dengan jarum dan cermin skala anti-paralaks saat membaca hasil.'
    ]),
    ('luxmeter', 'FCA-001-01', 'Pengukuran & Kimia Fisika', 'Kotak Sensor Optik D-3', 'Digital Lux Meter Display', [
        'Lepaskan penutup pelindung fotosensor putih dan arahkan sensor tegak lurus ke sumber cahaya.',
        'Pilih satuan ukur (Lux atau Foot-candle) dan rentang sensitivitas yang sesuai dengan intensitas pencahayaan.',
        'Tunggu hingga nilai intensitas penerangan stabil pada display digital.',
        'Pasang kembali penutup pelindung sensor fotosel dan matikan tombol power.'
    ]),
    ('Termometer', 'FPA-001-04', 'Pengukuran & Kimia Fisika', 'Kotak Alat Kaca D-4', 'Borosilikat 300 mm Panas', [
        'Keluarkan termometer kaca secara hati-hati dari selongsong pelindung plastik.',
        'Celupkan reservoir termometer ke dalam zat cair yang diukur tanpa menyentuh dinding atau dasar bejana.',
        'Tunggu hingga kolom cairan pemuaian berhenti bergerak dan baca skala suhu dengan arah pandang sejajar miniskus.',
        'Keringkan batang termometer dengan tisu bersih sebelum dimasukkan kembali ke selongsong pelindung.'
    ]),
    ('Dinamometer', 'FME-009-04', 'Mekanika & Kalibrasi', 'Rak Mekanika B-3', 'Neraca Pegas Skala Newton', [
        'Pegang tabung dinamometer secara vertikal dan periksa bahwa penunjuk berada tepat di angka nol Newton.',
        'Putar sekrup penyetel nol bila terjadi pergeseran batas elastisitas pegas.',
        'Kaitkan beban atau hubungkan ke balok gesek perlahan tanpa melebihi kapasitas beban maksimum.',
        'Baca nilai gaya tarik pada skala Newton, lepaskan beban secara perlahan, dan simpan dalam posisi tergantung.'
    ]),
    ('Elektroskop', 'FES-001-05', 'Elektronika & Instrumentasi', 'Lemari Elektrostatik G-2', 'Pudak Daun Defleksi 0-90°', [
        'Letakkan elektroskop pada landasan datar dan hubungkan soket 4 mm ke kabel pentanahan (grounding).',
        'Dekatkan batang bermuatan listrik (kaca atau ebonit) ke kepala elektroda tanpa menyentuhnya untuk induksi.',
        'Amati pembukaan defleksi daun elektroskop melalui jendela kaca transparan berskala 0 - 90 derajat.',
        'Sentuh kepala elektroda dengan jari untuk menetralkan muatan sebelum sesi pengujian berikutnya.'
    ]),
    ('Galvanometer', 'FET-006-05', 'Elektronika & Instrumentasi', 'Lemari Elektronika B-3', 'Galvanometer Sensitif Nol Tengah', [
        'Periksa jarum penunjuk galvanometer tepat berada di posisi angka nol di tengah skala.',
        'Gunakan saklar shunt pengaman saat pertama kali menguji adanya arus listrik induksi Faraday.',
        'Amati arah simpangan jarum (ke kiri atau ke kanan) sesuai dengan polaritas arus listrik mikro.',
        'Lindungi galvanometer dari lonjakan arus berlebih dan guncangan mekanik selama praktikum.'
    ]),
    ('Gelas kimia 250 ml', 'FSC-001-04', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Pyrex Borosilikat 250 mL', [
        'Pastikan bibir dan badan gelas kimia bersih dan bebas dari retakan sebelum digunakan.',
        'Tuangkan zat cair melalui corong kaca hingga batas volume yang diperlukan.',
        'Gunakan kasa asbes saat melakukan pemanasan menggunakan pembakar bunsen/spirtus.',
        'Bilas gelas kimia dengan air suling setelah selesai dan letakkan di rak pengeringan dengan posisi terbalik.'
    ]),
    ('Gelas kimia 100 ml', 'FSC-002-04', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Pyrex Borosilikat 100 mL', [
        'Periksa kondisi fisik gelas kimia sebelum pengisian larutan atau akuades.',
        'Gunakan batang pengaduk kaca secara perlahan saat melarutkan zat padat agar tidak membentur dasar gelas.',
        'Pegang bagian atas leher gelas kimia atau gunakan penjepit kayu saat larutan dalam kondisi panas.',
        'Bersihkan dan keringkan gelas kimia setelah digunakan untuk praktikum kalorimetri/viskositas.'
    ]),
    ('Gelas kimia 50 ml', 'FSC-006-02', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Pyrex Borosilikat 50 mL', [
        'Gunakan gelas kimia 50 ml untuk menampung sampel cairan dalam volume kecil.',
        'Gunakan pipet tetes untuk memindahkan cairan tetes demi tetes secara presisi.',
        'Jangan memanaskan gelas kimia kosong secara langsung di atas nyala api.',
        'Cuci bersih dari residu zat kimia dan simpan di lemari kaca laboratorium.'
    ]),
    ('Gelas kimia 25 ml', 'FSC-005-02', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Pyrex Borosilikat 25 mL', [
        'Periksa kebersihan bagian dalam bejana kaca mini 25 ml sebelum pengujian zat.',
        'Letakkan pada tatakan karet anti-selip saat mengambil sampel menggunakan mikropipet.',
        'Hindari benturan keras dengan spatula logam.',
        'Bilas menggunakan akuades dan keringkan pada rak tabung reaksi/bejana.'
    ]),
    ('Gelas kimia 10 ml', 'FSC-004-02', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Pyrex Borosilikat 10 mL', [
        'Gunakan untuk pengujian reaksi tetes atau pengukuran massa jenis cairan mikro.',
        'Timbang gelas kosong terlebih dahulu pada timbangan presisi sebelum diisi cairan.',
        'Catat massa total dan hitung selisih untuk mengetahui massa zat cair.',
        'Bersihkan bejana kaca dan simpan pada baki pelindung khusus.'
    ]),
    ('Corong kaca', 'FSC-007-04', 'Pengukuran & Kimia Fisika', 'Rak Alat Kaca D-4', 'Corong Kaca Borosilikat 60°', [
        'Pasang corong kaca pada klem statif atau langsung di atas mulut labu takar / erlenmeyer.',
        'Lipat kertas saring menjadi bentuk kerucut dan pasang merapat pada dinding dalam corong.',
        'Tuangkan cairan campuran secara perlahan melalui batang pengaduk agar tidak meluap.',
        'Bilas corong dari endapan partikel dan keringkan di rak pengeringan.'
    ]),
    ('Busur', 'FME-008-04', 'Mekanika & Kalibrasi', 'Kotak Alat Gambar D-3', 'Busur Derajat Akrilik 180°', [
        'Tempatkan titik pusat busur derajat tepat pada titik simpul perpotongan dua garis sudut.',
        'Sejajarkan garis dasar busur derajat dengan salah satu garis acuan sudut.',
        'Baca nilai sudut elevasi atau bias sinar pada skala derajat dengan cermat.',
        'Jaga permukaan busur dari goresan benda tajam dan simpan dalam map alat ukur.'
    ]),
    ('Solder', 'FAL-002-08', 'Alat Bengkel Lab', 'Meja Kerja Perakitan E-3', 'Dekko 25-80W 240V', [
        'Tempatkan solder pada stand logam sebelum mencolokkan kabel daya ke stopkontak PLN.',
        'Tunggu 3-5 menit hingga mata solder mencapai suhu kerja leleh timah secara sempurna.',
        'Bersihkan ujung mata solder pada spons basah sebelum menyolder kaki komponen elektronika.',
        'Cabut kabel solder setelah selesai, biarkan dingin di atas stand, dan jangan menyentuh elemen pemanas.'
    ]),
    ('Penghisap solder', 'FAL-003-07', 'Alat Bengkel Lab', 'Meja Kerja Perakitan E-3', 'Desoldering Pump DS-200', [
        'Tekan tuas pegas penyedot ke bawah hingga terkunci pada posisinya.',
        'Dekatkan ujung corong nozzle tahan panas tepat di atas timah solder yang sedang dipanaskan cair.',
        'Tekan tombol release pegas untuk menyedot lelehan timah ke dalam tabung penyerap.',
        'Buka tabung penghisap secara berkala untuk membuang sisa remah timah padat.'
    ]),
    ('Stand solder', 'FAL-004-05', 'Alat Bengkel Lab', 'Meja Kerja Perakitan E-3', 'Stand Dudukan Logam Pegas', [
        'Letakkan dudukan stand solder di atas permukaan meja kerja yang tahan panas dan stabil.',
        'Basahi spons pembersih kuning dengan sedikit air hingga mengembang.',
        'Selalu masukkan mata solder yang panas ke dalam spiral kawat pelindung stand.',
        'Jauhkan kabel listrik dan bahan mudah terbakar dari jangkauan area panas stand solder.'
    ]),
    ('Adaptor Adjustable DC', 'FAL-006-10', 'Elektronika & Instrumentasi', 'Lemari Adaptor B-4', 'Input 100-240V Output 3-24V 3A', [
        'Hubungkan steker adaptor ke stopkontak listrik AC rumah tangga 220V.',
        'Putar kenop potensiometer hingga voltmeter LED internal menunjukkan tegangan DC yang dibutuhkan (3 - 24V).',
        'Hubungkan colokan jack DC ke rangkaian beban elektronika yang diuji.',
        'Putuskan koneksi daya setelah pengukuran selesai dan biarkan badan adaptor berada di tempat berventilasi baik.'
    ]),
    ('Maxb Set 77 Pcs Obeng Presisi', 'TKT-003-01', 'Alat Bengkel Lab', 'Kotak Perkakas Mekanik E-3', '77 Pcs Precision Bit Box', [
        'Buka kotak perkakas dan pilih mata bit obeng yang presisi dengan kepala baut instrumen.',
        'Pasang mata bit ke gagang obeng magnetik hingga terkunci kencang.',
        'Gunakan obeng dengan torsi wajar tanpa memaksakan sudut agar mata baut tidak aus (sleek).',
        'Kembalikan seluruh mata bit ke slot masing-masing di dalam kotak perkakas sebelum ditutup rapi.'
    ])
]

output_items = []
doc_ref = "C-01/UN58.10.6/Lab/2026"

def build_item(item_tuple, size_type, index):
    name, code, cat, loc, default_brand, sop = item_tuple
    clean_name = name.strip()
    sheet_meta = sheet_items.get(clean_name, {})
    
    # Official name mapping for beautiful UI
    display_name = clean_name
    if clean_name == 'muschenbrook':
        display_name = 'Aparatus Pemuaian Musschenbroek'
    elif clean_name == 'Stopwach analog':
        display_name = 'Stopwatch Analog Presisi'
    elif clean_name == 'luxmeter':
        display_name = 'Digital Lux Meter'
    elif clean_name == 'Busur':
        display_name = 'Busur Derajat Presisi 180°'
    elif clean_name == 'Kit gelombang dan termodinamika':
        display_name = 'Kit Gelombang & Termodinamika'
    elif clean_name == 'Timbangan Presisi':
        display_name = 'Timbangan Analitis Presisi 0.001g'
    
    raw_specs = sheet_meta.get('specs') or default_brand
    baik = sheet_meta.get('baik', 1)
    rr = sheet_meta.get('rusak_ringan', 0)
    rb = sheet_meta.get('rusak_berat', 0)
    total_unit = sheet_meta.get('total', 1) or max(1, baik + rr + rb)
    satuan = sheet_meta.get('satuan', 'Buah')
    keterangan = sheet_meta.get('keterangan', '')
    
    # Condition evaluation
    cond = "Baik (Siap Pakai)"
    cond_status = "good"
    if rb > 0 or "patah" in keterangan.lower() or "rusak" in keterangan.lower():
        cond = "Perlu Perbaikan"
        cond_status = "warning"
    elif rr > 0 or "bocor" in keterangan.lower() or "catatan" in keterangan.lower() or "kurang" in keterangan.lower():
        cond = "Perlu Kalibrasi"
        cond_status = "warning"
        
    qty_str = f"{baik} {satuan} siap pakai"
    if rr > 0 or rb > 0:
        qty_str += f" ({rr+rb} unit diservis)"
    
    return {
        "id": f"alat-{index+1:03d}",
        "code": code,
        "name": display_name,
        "originalName": clean_name,
        "docRef": doc_ref,
        "sizeType": size_type,
        "category": cat,
        "location": loc,
        "brand": default_brand,
        "specs": raw_specs,
        "quantity": qty_str,
        "totalUnits": total_unit,
        "availableUnits": baik,
        "unit": satuan,
        "condition": cond,
        "conditionStatus": cond_status,
        "conditionNote": keterangan if keterangan else "Kondisi fisik dan fungsional terverifikasi baik untuk praktikum.",
        "lastCalibration": "Maret 2026 (Audit Inventaris C-01)",
        "sop": sop
    }

for i, it in enumerate(besar_list):
    output_items.append(build_item(it, "BESAR", i))

for i, it in enumerate(kecil_list):
    output_items.append(build_item(it, "KECIL", i + len(besar_list)))

with open('data_hunt/50_equipment.json', 'w', encoding='utf-8') as f:
    json.dump(output_items, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(output_items)} items!")
print(f"Besar: {sum(1 for x in output_items if x['sizeType'] == 'BESAR')}")
print(f"Kecil: {sum(1 for x in output_items if x['sizeType'] == 'KECIL')}")

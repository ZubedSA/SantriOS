# SantriOS --- Role, Fitur, dan Struktur Halaman

**Dokumen Spesifikasi Role & Modul**\
**Produk:** SantriOS\
**Tagline:** Operating System for Modern Pesantren\
**Versi:** 1.0

------------------------------------------------------------------------

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan struktur role, tanggung jawab, fitur, menu,
halaman, hak akses, dan prinsip UX untuk lima area utama SantriOS:

1.  Kiai / Pengasuh
2.  Admin / TU / Sekretaris
3.  Guru / Ustadz
4.  Bendahara
5.  Kesantrian / Kedisiplinan

Dokumen ini menjadi acuan awal untuk desain UI/UX, arsitektur
permission, routing halaman, database, dan pengembangan modul SantriOS.

------------------------------------------------------------------------

# 2. Prinsip Arsitektur Role SantriOS

SantriOS tidak menggunakan role sebagai satu-satunya sumber hak akses.

Struktur akses:

**Role → Assignment → Permission → Scope → Workflow**

### Role

Menentukan identitas dan area kerja utama pengguna.

### Assignment

Menentukan tugas tambahan yang dimiliki pengguna.

Contoh: - Guru + Wali Kelas - Guru + Guru Tahfizh - Guru + Wali Kelas +
Guru Tahfizh

### Permission

Menentukan tindakan yang boleh dilakukan.

Contoh: - `student.view` - `attendance.create` - `grade.create` -
`tahfizh.setoran.create` - `finance.transaction.create`

### Scope

Menentukan data mana yang boleh diakses.

Contoh: - Guru hanya melihat kelas yang dia ajar. - Guru Tahfizh hanya
melihat santri di halaqahnya. - Bendahara cabang hanya melihat keuangan
unitnya. - Admin hanya dapat mengelola tenant/pesantren sesuai
kewenangannya.

### Workflow

Mengatur proses yang membutuhkan verifikasi atau persetujuan.

Contoh:

Bendahara membuat pengajuan pengeluaran → pihak berwenang menyetujui →
Bendahara melakukan pembayaran → bukti pembayaran dicatat.

------------------------------------------------------------------------

# 3. Role: Kiai / Pengasuh

## 3.1 Konsep

Kiai/Pengasuh menggunakan **Executive Mode**.

Fokus utama:

**Monitor → Review → Approve → Decide → Evaluate**

Kiai bukan pengguna utama untuk input administrasi harian.

Kiai tidak perlu dipaksa: - menginput absensi; - memasukkan
pembayaran; - mengelola data santri satu per satu; - memasukkan nilai; -
mencatat transaksi rutin; - mengelola stok.

Kiai mendapatkan informasi yang sudah diringkas dan relevan untuk
pengambilan keputusan.

## 3.2 Dashboard

Halaman:

**Dashboard Kiai**

Informasi utama: - Total santri - Santri aktif - Guru/ustadz -
Kesantrian - Kehadiran hari ini - Santri sakit/izin - Progress tahfizh -
Pemasukan - Pengeluaran - Saldo - Tunggakan - Aktivitas penting -
Notifikasi strategis - Persetujuan yang menunggu

## 3.3 Kondisi Pesantren

Halaman:

**Kondisi Pesantren / Executive Overview**

Ringkasan: - Kondisi keuangan - Kehadiran santri - Perkembangan
tahfizh - Kondisi akademik - Kedisiplinan - Kondisi asrama - Tunggakan -
PPDB - Aktivitas pesantren

Sistem dapat memberikan indikator:

-   Stabil
-   Perlu perhatian
-   Perlu tindakan

Indikator hanya merupakan ringkasan data dan tidak menggantikan
keputusan Kiai.

## 3.4 Persetujuan

Halaman:

**Persetujuan**

Contoh: - Pengeluaran besar - Kegiatan - Izin khusus - Pengajuan
tertentu - Keputusan administratif sesuai workflow pesantren

Setiap workflow dapat dikonfigurasi.

## 3.5 Laporan Eksekutif

Halaman:

**Laporan**

Periode: - Hari - Minggu - Bulan - Semester - Tahun

Laporan: - Keuangan - Santri - Akademik - Tahfizh - Kedisiplinan -
Kehadiran - Kegiatan

Output: - PDF - Excel/CSV - Tampilan ringkas di aplikasi

## 3.6 Notifikasi Strategis

Contoh: - Tunggakan meningkat - Banyak santri belum hadir - Progress
tahfizh tertinggal - Pengeluaran meningkat - Ada pengajuan besar - Ada
masalah kedisiplinan yang perlu perhatian

## 3.7 Menu Kiai

``` text
Dashboard
Kondisi Pesantren
Santri
Akademik
Tahfizh
Keuangan
Kesantrian
Persetujuan
Laporan
Notifikasi
Pengaturan
```

Mobile navigation:

``` text
Dashboard | Aktivitas | Persetujuan | Laporan | Lainnya
```

------------------------------------------------------------------------

# 4. Role: Admin / TU / Sekretaris

## 4.1 Konsep

Admin/TU merupakan pusat administrasi operasional pesantren.

Fokus:

**Input → Kelola → Verifikasi → Arsipkan → Laporkan**

## 4.2 Dashboard

Halaman:

**Dashboard Admin**

Informasi: - Total santri - Data belum lengkap - Perizinan menunggu
proses - Pembayaran menunggu verifikasi - Surat yang sedang diproses -
PPDB - Tugas/disposisi - Aktivitas administrasi

Quick actions: - Tambah Santri - Catat Pembayaran - Buat Surat - Proses
Perizinan - Tambah Pengguna

## 4.3 Manajemen Santri

Halaman:

**Santri**

Fitur: - Tambah santri - Edit santri - Nonaktifkan santri - Mutasi -
Import Excel - Export data - Cetak kartu - NIS/NISN - Data orang
tua/wali - Alamat - Pendidikan - Kelas - Kamar - Status santri - Dokumen
santri

## 4.4 Master Data

Halaman:

**Master Data**

Data: - Tahun ajaran - Semester - Kelas - Program - Mata pelajaran -
Ruangan - Gedung - Guru - Staff - Kamar - Jenis pembayaran - Jenis
kegiatan - Jenis izin - Kategori surat - Kategori inventaris

## 4.5 Surat & Administrasi

Halaman:

**Surat**

Fitur: - Surat masuk - Surat keluar - Surat keterangan - Surat tugas -
Surat rekomendasi - Surat aktif santri - Surat panggilan wali -
Keputusan/SK - Template surat - Penomoran otomatis - Arsip - PDF

## 4.6 Wali Santri

Halaman:

**Wali Santri**

Fitur: - Tambah wali - Hubungkan wali dengan santri - Banyak wali dalam
satu santri - Verifikasi data - Nomor WhatsApp - Undangan akun - Reset
akses

## 4.7 PPDB

Halaman:

**PPDB**

Fitur: - Daftar pendaftar - Verifikasi data - Verifikasi dokumen -
Jadwal seleksi - Status pendaftaran - Pembayaran pendaftaran - Informasi
pendaftar - Konversi pendaftar menjadi santri aktif

## 4.8 Perizinan

Admin mengelola proses administrasi perizinan, tetapi tidak otomatis
menjadi pihak yang menyetujui semua izin.

Fitur: - Daftar pengajuan - Verifikasi dokumen - Catat keberangkatan -
Catat kepulangan - Santri belum kembali - Cetak daftar izin - Laporan
izin

## 4.9 Absensi Administratif

Fitur: - Monitoring absensi santri - Monitoring guru/staff - Rekap
harian - Rekap bulanan - Koreksi absensi - Audit koreksi - Export
laporan

## 4.10 Keuangan Administratif

Admin dapat: - Melihat status tagihan - Input pembayaran - Verifikasi
pembayaran sesuai permission - Cetak kwitansi - Melihat invoice -
Mengirim pengingat

Admin tidak otomatis memiliki seluruh kewenangan Bendahara.

## 4.11 Pengumuman

Fitur: - Pengumuman umum - Pengumuman kelas - Pengumuman wali -
Informasi kegiatan - Pengingat pembayaran - Pengumuman darurat

Target: - Semua pengguna - Kelompok - Kelas - Santri tertentu - Wali
tertentu

## 4.12 Kegiatan & Kalender

Fitur: - Kegiatan - Jadwal - Lokasi - PIC - Peserta - Dokumen -
Pengumuman kegiatan

## 4.13 Document Center

Fitur: - Dokumen santri - Dokumen guru - Surat - SK - Sertifikat -
Dokumen PPDB - Arsip institusi

## 4.14 Disposisi / Task Management

Fitur: - Kiai memberi tugas - Penanggung jawab - Deadline - Status -
Progress - Catatan - Penyelesaian

Contoh:

``` text
Tugas: Siapkan surat kegiatan
PIC: Admin TU
Deadline: 25 September
Status: Dalam proses
```

## 4.15 Menu Admin/TU

``` text
Dashboard

Data
├── Santri
├── Wali Santri
├── Guru & Staff
└── Master Data

Administrasi
├── Surat
├── Dokumen
├── Perizinan
└── Disposisi

Akademik
├── Kelas
├── Jadwal
└── Absensi

PPDB

Keuangan
├── Tagihan
└── Pembayaran

Kegiatan
Pengumuman
Laporan
Pengaturan
```

------------------------------------------------------------------------

# 5. Role: Guru / Ustadz

## 5.1 Konsep

Guru menggunakan **Teaching Mode**.

Fokus:

**Mengajar → Memantau → Menilai → Membina → Berkomunikasi**

## 5.2 Dashboard Guru

Informasi: - Jadwal hari ini - Kelas hari ini - Tugas - Absensi -
Nilai - Tugas siswa - Setoran tahfizh jika memiliki assignment Guru
Tahfizh - Aktivitas terbaru

## 5.3 Jadwal Mengajar

Halaman:

**Jadwal Saya**

Menampilkan: - Mata pelajaran - Kelas - Jam - Ruangan - Status
pertemuan - Perubahan jadwal

## 5.4 Kelas Saya

Halaman:

**Kelas Saya**

Tab: - Santri - Absensi - Nilai - Tugas - Catatan - Tahfizh jika guru
memiliki permission tahfizh

## 5.5 Absensi

Fitur: - Hadir - Izin - Sakit - Alpa - Dispensasi - Catatan

Dibuat mobile-first agar guru dapat mengisi absensi dengan cepat.

## 5.6 Nilai

Fitur: - Tugas - Ujian - Praktik - Sikap - Catatan guru - Nilai akhir

## 5.7 Tugas

Fitur: - Buat tugas - Target kelas - Deadline - Instruksi - Lampiran -
Lihat pengumpulan - Penilaian

## 5.8 Perkembangan Santri

Guru dapat melihat: - Kehadiran - Nilai - Progress akademik - Catatan
perkembangan - Tahfizh jika memiliki akses

Data keuangan dan data sensitif keluarga tidak otomatis terlihat.

------------------------------------------------------------------------

# 6. Guru dengan Assignment Guru Tahfizh

## 6.1 Prinsip

**Guru Tahfizh bukan role terpisah.**

Tahfizh merupakan assignment/tugas pada role Guru.

Contoh:

``` text
Ustadz Ahmad
Role: Guru

Assignment:
- Guru Mata Pelajaran
- Wali Kelas
- Guru Tahfizh
```

Guru lain dapat hanya memiliki:

``` text
Role: Guru

Assignment:
- Guru Mata Pelajaran
```

## 6.2 Menu Tahfizh

Hanya muncul jika pengguna memiliki permission/assignment Guru Tahfizh.

``` text
Tahfizh
├── Halaqah Saya
├── Setoran
├── Murajaah
├── Target Hafalan
├── Ujian
├── Perkembangan Santri
└── Laporan
```

## 6.3 Setoran

Fitur: - Pilih santri - Surat - Ayat - Jenis setoran - Kelancaran -
Tajwid - Makhraj - Fashahah - Catatan - Nilai

## 6.4 Murajaah

Fitur: - Murajaah harian - Murajaah mingguan - Murajaah juz - Target
murajaah - Catatan kesalahan

## 6.5 Target

Target: - Harian - Mingguan - Bulanan - Semester - Tahunan

## 6.6 Halaqah

Fitur: - Daftar halaqah - Ustadz pembimbing - Anggota - Jadwal -
Target - Progress

## 6.7 Ujian Tahfizh

Fitur: - Ujian juz - Tasmi' - Ujian beberapa juz - Nilai - Penguji -
Catatan - Status kelulusan

## 6.8 Laporan Tahfizh

Menampilkan: - Target - Realisasi - Progress - Riwayat setoran -
Murajaah - Nilai - Santri yang tertinggal target

------------------------------------------------------------------------

# 7. Role: Bendahara

## 7.1 Konsep

Bendahara menggunakan **Finance Mode**.

Fokus:

**Tagihan → Pembayaran → Pemasukan → Pengeluaran → Rekonsiliasi →
Laporan**

## 7.2 Dashboard

Informasi: - Saldo kas - Saldo bank - Pemasukan hari ini - Pengeluaran
hari ini - Pemasukan bulan berjalan - Pengeluaran bulan berjalan -
Surplus/defisit - Tagihan belum dibayar - Pembayaran menunggu
verifikasi - Pengeluaran menunggu approval - Piutang/tunggakan -
Transaksi terbaru

## 7.3 Tagihan

Fitur: - SPP - Makan - Asrama - Pendidikan - Tahfizh - Kesehatan -
Kegiatan - Seragam - Buku - Daftar ulang - Pendaftaran - Tagihan lainnya

Fitur massal:

**Buat Tagihan Massal**

## 7.4 Pembayaran

Fitur: - Pembayaran tunai - Transfer - QRIS - Payment gateway/VA pada
tahap lanjutan - Verifikasi - Kwitansi - Koreksi - Pembatalan dengan
alasan - Riwayat pembayaran

Status:

``` text
Menunggu
↓
Diverifikasi
↓
Lunas
```

atau:

``` text
Menunggu
↓
Ditolak
```

## 7.5 Kas & Bank

Fitur: - Kas utama - Kas kecil - Kas kegiatan - Kas unit - Rekening
bank - Transfer antar akun - Saldo - Mutasi

## 7.6 Pengeluaran

Fitur: - Pengajuan pengeluaran - Pembayaran supplier - Gaji/honor -
Listrik - Air - Internet - Konsumsi - Operasional - Kegiatan -
Pemeliharaan - Pembelian

## 7.7 Approval Keuangan

Contoh workflow:

``` text
Bendahara
    ↓
Pengajuan Pengeluaran
    ↓
Verifikasi
    ↓
Approval sesuai nominal
    ↓
Pembayaran
    ↓
Upload Bukti
    ↓
Transaksi Final
```

Batas nominal harus configurable.

## 7.8 Tunggakan

Fitur: - Total tunggakan - Santri menunggak - Jumlah bulan - Nominal -
Tunggakan per kelas - Tunggakan per periode - Riwayat pembayaran -
Pengingat wali

## 7.9 Rekonsiliasi

Tahap lanjutan:

Membandingkan transaksi SantriOS dengan mutasi bank.

Status: - Cocok - Belum cocok - Perlu pemeriksaan

## 7.10 Anggaran

Fitur: - Budget tahunan - Budget unit - Budget kategori - Realisasi -
Sisa anggaran - Persentase penggunaan

## 7.11 Laporan Keuangan

Laporan: - Pemasukan - Pengeluaran - Kas - Bank - Tagihan - Tunggakan -
Pembayaran - Arus kas - Rekap bulanan - Rekap tahunan

Output: - PDF - Excel - CSV

## 7.12 Menu Bendahara

``` text
Dashboard

Keuangan
├── Ringkasan
├── Pemasukan
├── Pengeluaran
├── Kas
├── Bank
└── Transfer

Tagihan
├── Daftar Tagihan
├── Buat Tagihan
├── Tagihan Massal
└── Tunggakan

Pembayaran
├── Semua Pembayaran
├── Menunggu Verifikasi
├── Terverifikasi
└── Riwayat

Pengajuan
├── Pengajuan Pengeluaran
├── Menunggu Approval
└── Riwayat

Rekonsiliasi
Anggaran
Laporan
Pengaturan Keuangan
```

------------------------------------------------------------------------

# 8. Bagian: Kesantrian / Kedisiplinan

## 8.1 Prinsip

SantriOS tidak menggunakan "Musyrif" sebagai role utama.

Nama bagian:

**Kesantrian**

Fokus utama:

**Pembinaan Kehidupan dan Perkembangan Santri**

Kedisiplinan merupakan salah satu fungsi utama di dalam Kesantrian.

Contoh struktur:

``` text
Kesantrian
├── Kepala Kesantrian
├── Pembina Kesantrian
└── Petugas Kedisiplinan
```

## 8.2 Dashboard Kesantrian

Informasi: - Kondisi kedisiplinan - Pelanggaran hari ini - Pelanggaran
minggu ini - Santri perlu pembinaan - Santri izin - Santri belum
kembali - Kondisi per kamar/asrama - Kegiatan santri - Prestasi -
Aktivitas terbaru

## 8.3 Kedisiplinan

Fitur: - Pelanggaran - Kategori - Poin - Kronologi - Lokasi - Petugas -
Bukti - Tindakan - Riwayat

Contoh:

``` text
Terlambat apel       -2
Tidak ikut jamaah    -3
Keluar tanpa izin    -5
Pelanggaran berat    -20
```

Nilai poin harus configurable sesuai peraturan pesantren.

## 8.4 Prestasi

Kesantrian juga mencatat perkembangan positif:

-   Santri teladan
-   Disiplin terbaik
-   Kebersihan
-   Ketepatan waktu
-   Prestasi kegiatan
-   Prestasi lainnya

## 8.5 Pembinaan

Alur:

**Pelanggaran → Pembinaan → Evaluasi → Perkembangan**

Fitur: - Masalah - Hasil pembinaan - Target perubahan - Tindak lanjut -
Tanggal evaluasi - Catatan pembina

## 8.6 Tindakan

Contoh: - Teguran - Nasihat - Pembinaan - Panggilan wali - Tugas
pembinaan - Pembatasan kegiatan - Skorsing - Tindakan lain sesuai
peraturan pesantren

## 8.7 Perizinan

Fitur: - Pengajuan izin - Verifikasi - Persetujuan sesuai workflow -
Keberangkatan - Kepulangan - Santri belum kembali - Riwayat izin -
Laporan

## 8.8 Asrama

Jika asrama berada di bawah Kesantrian:

-   Gedung
-   Kamar
-   Kapasitas
-   Penghuni
-   Penempatan
-   Mutasi kamar
-   Kondisi kamar
-   Catatan pembinaan

## 8.9 Kegiatan Santri

Fitur: - Kegiatan - Jadwal - Peserta - PIC - Kehadiran - Catatan -
Dokumentasi

## 8.10 Laporan Kesantrian

Laporan: - Pelanggaran - Poin - Pembinaan - Prestasi - Perizinan -
Kehadiran - Asrama - Kegiatan

## 8.11 Menu Kesantrian

``` text
Dashboard
Santri

Kedisiplinan
├── Pelanggaran
├── Poin
├── Prestasi
├── Pembinaan
└── Tindakan

Perizinan
├── Pengajuan
├── Persetujuan
├── Belum Kembali
└── Riwayat

Asrama
├── Gedung
├── Kamar
├── Penghuni
└── Mutasi

Kegiatan Santri
Laporan
```

------------------------------------------------------------------------

# 9. Hubungan Antar Role

## 9.1 Kiai ↔ Admin

Kiai memberikan keputusan/disposisi.

Admin menjalankan administrasi.

``` text
Kiai
↓
Disposisi
↓
Admin
↓
Pelaksanaan
↓
Laporan kembali ke Kiai
```

## 9.2 Kiai ↔ Bendahara

``` text
Bendahara
↓
Laporan/Pengajuan
↓
Kiai
↓
Approval/Keputusan
```

## 9.3 Guru ↔ Kesantrian

Guru dapat mencatat atau melaporkan perkembangan santri sesuai
permission.

Kesantrian menangani pembinaan dan kedisiplinan.

## 9.4 Guru ↔ Tahfizh

Tahfizh berada di dalam role Guru sebagai assignment.

``` text
Guru
├── Guru Mata Pelajaran
├── Wali Kelas
└── Guru Tahfizh
```

## 9.5 Kesantrian ↔ Wali Santri

Untuk informasi yang memang diperbolehkan: - Perizinan - Pembinaan -
Pengumuman - Informasi perkembangan tertentu

## 9.6 Bendahara ↔ Wali Santri

-   Tagihan
-   Status pembayaran
-   Riwayat pembayaran
-   Bukti pembayaran
-   Pengingat

------------------------------------------------------------------------

# 10. Student 360 Profile

Semua modul harus terhubung ke profil santri.

``` text
Profil Santri
│
├── Biodata
├── Wali
├── Akademik
├── Absensi
├── Tahfizh
├── Kedisiplinan
├── Pembinaan
├── Perizinan
├── Asrama
├── Keuangan
└── Dokumen
```

Namun akses setiap bagian tetap dikontrol permission dan scope.

Contoh Guru tidak otomatis melihat data keuangan.

Bendahara tidak otomatis melihat catatan pembinaan.

Kesantrian tidak otomatis melihat detail transaksi keuangan.

------------------------------------------------------------------------

# 11. Prinsip Mobile-First

SantriOS harus dirancang mobile-first.

Prioritas UI: - Bottom navigation - Quick action - Card - Bottom sheet -
Tab - Sticky action - Form singkat - Tombol besar - Input cepat -
Responsive table/card

Contoh Guru:

``` text
Dashboard
   ↓
Jadwal
   ↓
Kelas
   ↓
Absensi
   ↓
Simpan
```

Contoh Guru Tahfizh:

``` text
Halaqah
   ↓
Santri
   ↓
Setoran
   ↓
Nilai
   ↓
Simpan
```

Contoh Bendahara:

``` text
Pembayaran
   ↓
Verifikasi
   ↓
Konfirmasi
   ↓
Kwitansi
```

------------------------------------------------------------------------

# 12. Prinsip Keamanan

Semua data bisnis harus terisolasi berdasarkan tenant/pesantren.

Aturan utama:

-   Setiap data bisnis memiliki `tenant_id`.
-   Server wajib memeriksa tenant.
-   Permission harus diperiksa di server.
-   Module access harus diperiksa di server.
-   Scope akses harus diperiksa di server.
-   Jangan mengandalkan hidden menu sebagai keamanan.
-   Semua perubahan penting dicatat dalam Audit Log.
-   Koreksi transaksi keuangan harus memiliki alasan.
-   Perubahan absensi harus dapat dilacak.
-   Perubahan data penting harus memiliki actor dan timestamp.
-   Secret tidak boleh dikirim ke client.

------------------------------------------------------------------------

# 13. Audit Log

Audit Log minimal mencatat:

-   User
-   Role
-   Tenant
-   Action
-   Entity
-   Entity ID
-   Data sebelum perubahan jika diperlukan
-   Data setelah perubahan jika diperlukan
-   Timestamp
-   IP/device metadata sesuai kebutuhan keamanan

Contoh:

``` text
20 Sep 2026 10:32
Ust. Ahmad
Mengubah absensi
Santri: Ahmad
Hadir → Sakit
```

------------------------------------------------------------------------

# 14. Prinsip Modular

Tidak semua pesantren membutuhkan semua modul.

Core tetap aktif:

``` text
Core
├── Tenant
├── User
├── Role
├── Permission
├── Santri
├── Notification
└── Audit Log
```

Modul dapat diaktifkan sesuai kebutuhan:

``` text
Santri
Keuangan
Akademik
Absensi
Tahfizh
Kesantrian
Asrama
Perizinan
PPDB
Inventaris
Koperasi
Wali Santri
```

Tahfizh tetap merupakan **module**, tetapi dari sisi pengguna fitur
Tahfizh ditempatkan pada Guru yang memiliki assignment/permission Guru
Tahfizh.

------------------------------------------------------------------------

# 15. Ringkasan Struktur Utama SantriOS

``` text
SANTRIOS
│
├── KIAI / PENGASUH
│   └── Executive Mode
│
├── ADMIN / TU
│   └── Administration Mode
│
├── GURU / USTADZ
│   ├── Teaching Mode
│   ├── Wali Kelas
│   └── Guru Tahfizh
│
├── BENDAHARA
│   └── Finance Mode
│
└── KESANTRIAN
    └── Student Development & Discipline
```

------------------------------------------------------------------------

# 16. Prinsip Akhir

SantriOS tidak boleh menjadi aplikasi yang membuat semua pengguna
melihat menu yang sama.

Setiap pengguna harus melihat lingkungan kerja sesuai tanggung jawabnya.

**Kiai:** melihat kondisi pesantren dan mengambil keputusan.

**Admin/TU:** mengelola administrasi dan memastikan data pesantren
tertib.

**Guru/Ustadz:** mengajar, menilai, dan membina santri.

**Guru Tahfizh:** merupakan tugas tambahan pada Guru untuk mengelola
hafalan, setoran, murajaah, target, dan ujian.

**Bendahara:** mengelola tagihan, pembayaran, kas, bank, pengeluaran,
anggaran, dan laporan keuangan.

**Kesantrian:** menangani pembinaan kehidupan santri, kedisiplinan,
perizinan, asrama, kegiatan, dan perkembangan perilaku.

Prinsip arsitektur yang digunakan:

**Role + Assignment + Permission + Scope + Workflow**

Dengan prinsip ini, satu pengguna dapat memiliki lebih dari satu tugas
tanpa membuat sistem role menjadi terlalu banyak dan kaku.

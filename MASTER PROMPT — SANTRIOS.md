# MASTER PROMPT — SANTRIOS

## 1. PROJECT IDENTITY

Nama aplikasi:

**SantriOS**

Tagline:

**Operating System for Modern Pesantren**

SantriOS adalah platform SaaS modular untuk membantu pesantren mengelola operasional, administrasi, akademik, keuangan, santri, asrama, tahfizh, wali santri, PPDB, inventaris, koperasi, dan berbagai kebutuhan lainnya dalam satu platform.

SantriOS harus dirancang sebagai **multi-tenant modular SaaS**, bukan aplikasi single-pesantren.

Prinsip utama:

> Satu platform, banyak pesantren, banyak modul, konfigurasi fleksibel.

Setiap pesantren dapat mengaktifkan hanya modul yang mereka butuhkan.

---

# 2. OBJECTIVE

Bangun aplikasi SantriOS dengan karakter:

- Mobile-first
- Modern
- Premium
- Clean
- Professional
- Islamic but not overly decorative
- Fast
- Responsive
- Accessible
- Scalable
- Modular
- Multi-tenant
- Secure
- Production-ready

Prioritas utama:

1. UX mobile
2. Arsitektur modular
3. Multi-tenancy
4. Security
5. Database architecture
6. Developer experience
7. Performance
8. Scalability

Jangan membuat aplikasi seperti dashboard admin lama yang penuh tabel dan sidebar.

SantriOS harus terasa seperti produk SaaS modern.

---

# 3. TECH STACK

Gunakan:

### Monorepo

- Turborepo
- pnpm
- TypeScript

Struktur awal:

```text
santrios/
├── apps/
│   ├── web/
│   ├── admin/
│   └── mobile/
│
├── packages/
│   ├── ui/
│   ├── database/
│   ├── auth/
│   ├── config/
│   ├── types/
│   ├── validators/
│   ├── utils/
│   └── modules/
│
├── tooling/
│   ├── eslint/
│   ├── prettier/
│   └── typescript/
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

Gunakan arsitektur yang memungkinkan aplikasi berkembang tanpa menjadi monolith yang sulit dirawat.

---

# 4. WEB FRAMEWORK

Gunakan:

- Next.js
- App Router
- TypeScript
- Server Components jika sesuai
- Server Actions/API routes sesuai kebutuhan
- Tailwind CSS
- shadcn/ui atau komponen UI modern yang kompatibel
- Lucide Icons

Jangan menggunakan JavaScript biasa.

Semua kode harus TypeScript.

---

# 5. DATABASE

Gunakan:

**Neon PostgreSQL**

ORM:

**Prisma**

Package database:

```text
packages/database
```

Database harus dipisahkan dari aplikasi.

Contoh:

```text
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── client.ts
│   └── index.ts
└── package.json
```

Gunakan Prisma Client secara terpusat.

Jangan membuat Prisma Client baru di setiap request.

---

# 6. MULTI-TENANT ARCHITECTURE

Ini adalah salah satu bagian terpenting.

SantriOS harus menggunakan:

**Shared Database + Shared Schema + tenant_id**

Setiap data bisnis yang berhubungan dengan pesantren harus memiliki:

```text
tenant_id
```

Contoh:

```text
students
- id
- tenant_id
- nis
- name
- gender
- status
- created_at
```

Data dari:

```text
Pesantren A
```

tidak boleh dapat diakses oleh:

```text
Pesantren B
```

Implementasikan tenant isolation di application/service layer.

Jangan bergantung pada developer untuk selalu menambahkan filter tenant secara manual.

Buat helper/service pattern seperti:

```ts
getTenantContext()
```

dan:

```ts
tenantDb()
```

atau pola repository yang memastikan query selalu scoped terhadap tenant.

---

# 7. CORE DATA MODEL

Buat model inti:

```text
Tenant
User
Role
Permission
UserRole
Subscription
Plan
Module
TenantModule
AuditLog
Notification
Setting
```

Relasi konsep:

```text
Tenant
 ├── Users
 ├── Students
 ├── Classes
 ├── Rooms
 ├── Transactions
 ├── Attendance
 ├── Hafalan
 ├── Invoices
 └── Modules
```

---

# 8. ROLE SYSTEM

Gunakan RBAC.

Role awal:

```text
SUPER_ADMIN
OWNER
ADMIN
BENDAHARA
GURU
MUSYRIF
WALI_SANTRI
SANTRI
STAFF
```

Tetapi jangan hard-code seluruh permission.

Gunakan permission system.

Contoh:

```text
students.view
students.create
students.update
students.delete

finance.view
finance.create
finance.approve

attendance.view
attendance.create

hafalan.view
hafalan.create
hafalan.update
```

Super admin SaaS berbeda dari admin pesantren.

---

# 9. MODULAR SYSTEM

SantriOS harus memiliki module registry.

Contoh:

```text
CORE
SANTRI
KEUANGAN
ABSENSI
TAHFIZH
AKADEMIK
ASRAMA
PERIZINAN
WALI_SANTRI
PPDB
INVENTARIS
KOPERASI
ALUMNI
```

Buat model:

```text
Module
TenantModule
```

Contoh:

```text
Module
- id
- key
- name
- description
- icon
- is_active
```

dan:

```text
TenantModule
- id
- tenant_id
- module_id
- enabled
- activated_at
```

Sistem harus dapat menentukan:

```text
Apakah tenant memiliki akses ke modul ini?
```

Contoh:

```ts
hasModule("TAHFIZH")
```

Jika modul tidak aktif:

- jangan tampilkan menu
- jangan izinkan route
- jangan izinkan server action
- jangan izinkan API
- jangan izinkan akses data

---

# 10. CORE MODULE

Modul CORE wajib tersedia untuk semua tenant.

Fitur:

### Dashboard

Tampilkan:

- jumlah santri
- santri aktif
- guru
- pembayaran
- tagihan
- absensi hari ini
- pengumuman
- aktivitas terbaru

Dashboard harus mobile-first.

Gunakan card yang ringkas.

---

# 11. MODUL SANTRI

Fitur:

- daftar santri
- tambah santri
- edit santri
- detail santri
- foto
- NIS
- NISN jika diperlukan
- nama lengkap
- nama panggilan
- jenis kelamin
- tempat/tanggal lahir
- alamat
- nomor HP
- status
- kelas
- kamar
- wali
- tanggal masuk
- riwayat

Detail santri harus menggunakan halaman profil modern.

Contoh:

```text
[Foto]

Ahmad Fauzan
NIS: 20260021
Kelas: Ulya 2
Kamar: A-03

[Ringkasan]

Tahfizh
Absensi
Keuangan
Akademik
Perizinan
```

Gunakan tab untuk mobile.

---

# 12. MODUL KEUANGAN

Fitur:

- jenis tagihan
- invoice
- pembayaran
- pengeluaran
- pemasukan
- kas
- laporan
- periode
- tunggakan
- riwayat transaksi

Dashboard keuangan:

```text
Pemasukan
Rp xxx

Pengeluaran
Rp xxx

Saldo
Rp xxx

Tunggakan
Rp xxx
```

Buat transaksi dengan audit trail.

Jangan menyimpan saldo hanya sebagai angka yang bisa diedit.

Saldo harus dapat dihitung berdasarkan transaksi.

---

# 13. MODUL ABSENSI

Fitur:

- absensi santri
- hadir
- izin
- sakit
- alpa
- dispensasi
- rekap
- statistik

Mobile-first.

Guru/musyrif harus dapat melakukan absensi dengan cepat.

Contoh:

```text
Kelas Ulya 2

✓ Ahmad
✓ Yusuf
× Hasan
I Ali
S Fatih

[ Simpan Absensi ]
```

Jangan membuat user harus membuka form yang panjang.

---

# 14. MODUL TAHFIZH

Fitur:

- target hafalan
- setoran
- murajaah
- surah
- juz
- halaman
- nilai
- catatan guru
- perkembangan hafalan

Detail santri:

```text
Juz 30      ✓
Juz 29      ✓
Juz 28      72%
Juz 27      35%
```

Tampilkan progress visual.

---

# 15. MODUL AKADEMIK

Fitur:

- tahun ajaran
- semester
- kelas
- guru
- mata pelajaran
- jadwal
- nilai
- ujian
- raport

Struktur:

```text
AcademicYear
Semester
Class
Subject
TeacherAssignment
Schedule
Grade
ReportCard
```

---

# 16. MODUL ASRAMA

Fitur:

- gedung
- kamar
- kapasitas
- musyrif
- penempatan santri
- mutasi kamar
- kondisi kamar

Dashboard:

```text
Gedung A
12 kamar
143 santri
87% kapasitas
```

---

# 17. MODUL PERIZINAN

Workflow harus configurable.

Default:

```text
Santri/Wali
      ↓
Pengajuan
      ↓
Musyrif
      ↓
Admin
      ↓
Approved
```

Tetapi setiap pesantren dapat memiliki workflow berbeda.

Status:

```text
PENDING
APPROVED
REJECTED
CANCELLED
COMPLETED
```

---

# 18. MODUL WALI SANTRI

Buat portal khusus wali.

Wali dapat melihat:

- profil anak
- absensi
- hafalan
- nilai
- tagihan
- pembayaran
- izin
- pengumuman

Tampilan harus sederhana karena target user bukan admin teknis.

---

# 19. MODUL PPDB

Fitur:

- formulir pendaftaran
- calon santri
- dokumen
- seleksi
- pembayaran
- status
- pengumuman
- konversi calon santri menjadi santri aktif

Workflow:

```text
Pendaftar
↓
Verifikasi
↓
Seleksi
↓
Lulus
↓
Daftar Ulang
↓
Santri Aktif
```

---

# 20. MODUL INVENTARIS

Fitur:

- barang
- kategori
- lokasi
- kondisi
- jumlah
- peminjaman
- pengembalian
- mutasi
- riwayat

Status:

```text
BAIK
RUSAK_RINGAN
RUSAK_BERAT
HILANG
```

---

# 21. MODUL KOPERASI

Fitur:

- produk
- kategori
- stok
- harga beli
- harga jual
- transaksi
- kasir
- laporan
- hutang santri

Harus dibuat modular sehingga tidak memengaruhi modul utama jika tidak diaktifkan.

---

# 22. MODUL ALUMNI

Fitur:

- alumni
- angkatan
- tahun lulus
- pendidikan
- pekerjaan
- kontak
- lokasi
- aktivitas

---

# 23. MOBILE-FIRST DESIGN

Ini adalah prioritas.

Design dari:

```text
320px
360px
390px
430px
```

terlebih dahulu.

Kemudian desktop.

Jangan membuat desktop dashboard kemudian mengecilkannya menjadi mobile.

Gunakan:

- bottom navigation
- bottom sheet
- drawer
- tabs
- cards
- sticky action
- floating action jika diperlukan

Mobile navigation contoh:

```text
Home
Santri
Aktivitas
Keuangan
Lainnya
```

Desktop dapat menggunakan sidebar.

---

# 24. DESIGN SYSTEM

Buat design system di:

```text
packages/ui
```

Komponen:

```text
Button
Input
Select
Dialog
Drawer
Sheet
Card
Table
Badge
Avatar
Tabs
Dropdown
Toast
Alert
DatePicker
Pagination
EmptyState
LoadingState
Skeleton
StatCard
DataTable
MobileList
```

Gunakan konsistensi spacing, typography, radius, shadow dan interaction.

Jangan menggunakan terlalu banyak warna.

Gunakan visual identity yang profesional dan modern.

Nuansa Islam cukup melalui detail desain, bukan ornamentasi berlebihan.

---

# 25. UX PRINCIPLES

Setiap halaman harus menjawab:

1. Apa informasi terpenting?
2. Apa aksi utama?
3. Apa yang harus dilakukan user berikutnya?

Hindari:

- form terlalu panjang
- tabel terlalu lebar
- terlalu banyak card
- terlalu banyak warna
- menu berlebihan
- modal bertingkat
- navigasi membingungkan

Untuk mobile, ubah tabel menjadi card/list ketika memungkinkan.

---

# 26. SEARCH

Implementasikan global search.

User dapat mencari:

```text
Santri
Guru
Kamar
Tagihan
Transaksi
Dokumen
```

Gunakan command palette untuk desktop.

Mobile gunakan search screen.

---

# 27. NOTIFICATION SYSTEM

Buat notification center.

Contoh:

```text
Tagihan baru
Pembayaran diterima
Izin disetujui
Hafalan diperbarui
Pengumuman baru
```

Struktur:

```text
Notification
- id
- tenant_id
- user_id
- type
- title
- message
- read_at
- created_at
```

---

# 28. AUDIT LOG

Setiap aktivitas penting harus dicatat.

Contoh:

```text
Admin mengubah data santri
Bendahara mencatat pembayaran
Guru mengubah nilai
Musyrif menyetujui izin
```

Audit:

```text
user
action
entity
entity_id
old_data
new_data
timestamp
ip
```

Jangan menyimpan data sensitif secara berlebihan.

---

# 29. AUTHENTICATION

Buat authentication yang aman.

Mendukung:

- email/password
- Google OAuth jika diperlukan

Session harus aman.

Implementasikan:

- authorization
- role checking
- permission checking
- tenant checking

Authentication bukan authorization.

Pisahkan keduanya.

---

# 30. VALIDATION

Gunakan schema validation.

Direkomendasikan:

```text
Zod
```

Semua input:

- client
- server
- API

harus divalidasi.

Jangan mempercayai data dari client.

---

# 31. ERROR HANDLING

Buat standar error:

```text
ValidationError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
TenantAccessError
ModuleDisabledError
```

User mendapatkan pesan sederhana.

Developer mendapatkan error log yang jelas.

---

# 32. SECURITY

Prioritaskan:

- tenant isolation
- RBAC
- permission checking
- server-side validation
- CSRF protection jika relevan
- XSS protection
- secure cookies
- rate limiting
- input sanitization
- secure headers
- audit logs
- least privilege

Jangan pernah expose:

```text
DATABASE_URL
API_KEYS
SECRET_KEYS
SERVICE_ROLE_KEYS
```

ke client.

---

# 33. ENVIRONMENT

Gunakan:

```text
.env
.env.local
.env.example
```

Contoh:

```env
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=
```

Buat `.env.example`.

Jangan commit secret.

---

# 34. API / SERVICE ARCHITECTURE

Jangan meletakkan seluruh business logic di UI.

Gunakan:

```text
UI
 ↓
Server Action / API
 ↓
Service
 ↓
Repository
 ↓
Prisma
 ↓
Neon
```

Contoh:

```text
students/
├── components/
├── actions/
├── services/
├── repositories/
├── validators/
├── types/
└── routes/
```

Dengan demikian business logic dapat digunakan kembali.

---

# 35. MODULE ARCHITECTURE

Setiap modul harus memiliki boundary yang jelas.

Contoh:

```text
packages/modules/
├── core/
├── students/
├── finance/
├── attendance/
├── tahfizh/
├── academics/
├── dormitory/
├── permissions/
├── guardians/
├── ppdb/
├── inventory/
├── cooperative/
└── alumni/
```

Jangan membuat satu file besar berisi seluruh business logic.

---

# 36. FEATURE FLAGS

Gunakan module activation sebagai feature flag.

Contoh:

```ts
if (!hasModule("FINANCE")) {
   throw new ModuleDisabledError()
}
```

UI:

```tsx
{hasModule("FINANCE") && (
   <FinanceMenu />
)}
```

Tetapi security check tetap wajib dilakukan di server.

UI hiding bukan security.

---

# 37. SUBSCRIPTION SYSTEM

Buat fondasi subscription.

Model:

```text
Plan
Subscription
SubscriptionItem
Module
TenantModule
```

Contoh:

```text
FREE
STARTER
PRO
ENTERPRISE
```

Jangan langsung mengunci seluruh sistem berdasarkan pembayaran.

Bangun architecture yang memungkinkan integrasi payment gateway kemudian.

---

# 38. SUPER ADMIN

Buat aplikasi/admin area khusus SaaS.

Super admin dapat:

- melihat seluruh tenant
- membuat tenant
- mengaktifkan/nonaktifkan tenant
- melihat subscription
- melihat modul
- mengaktifkan modul
- melihat statistik penggunaan
- melihat audit log
- mengelola plan

Super admin tidak boleh otomatis menggunakan role admin pesantren.

Pisahkan authorization boundary.

---

# 39. TENANT ONBOARDING

Buat onboarding:

```text
Create Account
↓
Create Pesantren
↓
Isi Profil
↓
Pilih Modul
↓
Buat Admin
↓
Dashboard
```

Saat pesantren dibuat:

- generate tenant
- create owner
- activate CORE
- activate selected modules
- create default settings

---

# 40. DASHBOARD EXPERIENCE

Dashboard harus berbeda berdasarkan role.

OWNER:

```text
Overview
Santri
Keuangan
Aktivitas
Laporan
```

BENDAHARA:

```text
Keuangan
Tagihan
Pembayaran
Pengeluaran
Laporan
```

GURU:

```text
Kelas
Absensi
Nilai
Tahfizh
```

MUSYRIF:

```text
Asrama
Santri
Absensi
Perizinan
```

WALI:

```text
Anak
Absensi
Hafalan
Tagihan
Pengumuman
```

Jangan memberikan semua menu kepada semua role.

---

# 41. EMPTY STATES

Setiap halaman harus memiliki empty state.

Contoh:

```text
Belum ada data santri.

Tambahkan santri pertama untuk mulai mengelola
data kepesantrenan.

[ + Tambah Santri ]
```

Jangan menampilkan halaman kosong.

---

# 42. LOADING STATE

Gunakan skeleton loading.

Jangan membuat halaman terasa blank saat data sedang dimuat.

---

# 43. RESPONSIVE TABLE

Desktop:

```text
DataTable
```

Mobile:

```text
Card List
```

Jangan memaksa tabel 10 kolom tampil di layar smartphone.

---

# 44. PERFORMANCE

Prioritaskan:

- server components
- dynamic imports
- lazy loading
- pagination
- database indexing
- selective Prisma queries
- caching jika relevan
- image optimization

Jangan mengambil seluruh data database hanya untuk menampilkan 20 record.

Gunakan:

```text
pagination
limit
cursor
select
include
```

secara tepat.

---

# 45. DATABASE INDEXING

Tambahkan index untuk field yang sering digunakan.

Minimal pertimbangkan:

```text
tenant_id
tenant_id + status
tenant_id + created_at
tenant_id + student_id
tenant_id + user_id
```

Jangan asal menambahkan index.

Gunakan berdasarkan pola query.

---

# 46. SEED DATABASE

Buat seed development.

Contoh:

```text
Demo Pesantren
Admin
Bendahara
Guru
Musyrif
Wali
Santri
Kelas
Kamar
Transaksi
Absensi
Hafalan
```

Sehingga setelah setup developer dapat langsung login dan mencoba sistem.

---

# 47. DEMO ACCOUNT

Buat akun demo development:

```text
owner@demo.local
admin@demo.local
bendahara@demo.local
guru@demo.local
musyrif@demo.local
wali@demo.local
```

Password hanya untuk development.

Jangan menggunakan password tersebut di production.

---

# 48. TESTING

Siapkan fondasi:

- unit testing
- integration testing
- E2E testing

Prioritas test:

1. tenant isolation
2. authentication
3. authorization
4. permission
5. module access
6. financial transactions
7. student CRUD

Tenant isolation harus memiliki test khusus.

Contoh:

```text
Tenant A tidak boleh membaca student Tenant B.
```

---

# 49. DOCUMENTATION

Buat:

```text
README.md
ARCHITECTURE.md
DATABASE.md
MODULES.md
SECURITY.md
DEVELOPMENT.md
```

Dokumentasi harus menjelaskan:

- cara install
- cara menjalankan
- environment variables
- database migration
- seed
- arsitektur
- menambah modul
- menambah permission
- menambah role
- deployment

---

# 50. GIT

Gunakan Git.

Commit harus jelas.

Contoh:

```text
feat: add student module
feat: add finance module
fix: prevent cross-tenant access
refactor: improve tenant repository
docs: update architecture
```

Jangan membuat commit:

```text
update
fix
test
aaa
```

---

# 51. CODE QUALITY

Rules:

- TypeScript strict
- ESLint
- Prettier
- no unnecessary any
- no duplicated business logic
- no giant component
- no giant service
- no hard-coded tenant ID
- no secrets in source
- no direct database access from UI
- no bypass authorization

Gunakan reusable abstraction tetapi jangan melakukan over-engineering.

---

# 52. FILE STRUCTURE

Gunakan struktur yang scalable.

Contoh:

```text
apps/web/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── finance/
│   │   ├── attendance/
│   │   └── ...
│   └── api/
│
├── components/
├── lib/
└── middleware.ts
```

Tetapi business logic utama tetap berada di package/module layer.

---

# 53. UI COPY

Gunakan Bahasa Indonesia sebagai bahasa utama.

Contoh:

```text
Dashboard
Santri
Keuangan
Absensi
Tahfizh
Akademik
Asrama
Perizinan
Wali Santri
PPDB
Inventaris
Koperasi
Alumni
Pengaturan
```

Gunakan bahasa yang jelas dan sederhana.

---

# 54. VISUAL IDENTITY

Brand:

**SantriOS**

Gaya:

- modern
- premium
- minimal
- trustworthy
- Islamic
- technology-oriented

Jangan membuat:

- motif masjid berlebihan
- ornamen Arab berlebihan
- gradient berlebihan
- warna terlalu mencolok
- UI seperti template dashboard 2018

SantriOS harus terlihat seperti startup SaaS modern.

---

# 55. MOBILE UX EXAMPLE

Halaman dashboard mobile:

```text
Good morning,
Admin 👋

Pondok Al-Hikmah

┌──────────────────────┐
│ Total Santri         │
│ 428                  │
│ +12 bulan ini        │
└──────────────────────┘

┌──────────┐ ┌──────────┐
│ Hadir    │ │ Tunggak. │
│ 391      │ │ 24       │
└──────────┘ └──────────┘

Aktivitas terbaru

Pembayaran baru
Ahmad Fauzan
Rp500.000

Izin disetujui
Muhammad Ali
```

Jangan menampilkan terlalu banyak informasi sekaligus.

---

# 56. MOBILE NAVIGATION

Gunakan:

```text
┌─────────────────────────────┐
│                             │
│          CONTENT            │
│                             │
├─────────────────────────────┤
│ Home │ Santri │ Aktiv │ Lain│
└─────────────────────────────┘
```

Menu tambahan berada di:

```text
Lainnya
```

dan dikelompokkan berdasarkan modul.

---

# 57. DEVELOPMENT PHASE

Jangan membangun seluruh sistem sekaligus.

Kerjakan bertahap.

## PHASE 1 — FOUNDATION

Bangun:

- Turborepo
- pnpm
- Next.js
- TypeScript
- Tailwind
- UI package
- Neon
- Prisma
- authentication
- multi-tenant
- RBAC
- permission
- module registry
- tenant onboarding
- dashboard
- audit log

Pastikan foundation stabil sebelum membuat modul bisnis.

## PHASE 2 — MVP

Bangun:

- Santri
- Keuangan
- Absensi
- Wali Santri

## PHASE 3

Bangun:

- Tahfizh
- Akademik
- Asrama
- Perizinan

## PHASE 4

Bangun:

- PPDB
- Inventaris
- Koperasi
- Alumni

## PHASE 5

Bangun:

- Subscription
- Billing
- Notification
- WhatsApp integration
- Advanced reporting
- AI assistant

---

# 58. AI ARCHITECTURE

Jangan langsung membuat AI sebagai pusat aplikasi.

AI harus menjadi layer tambahan.

Contoh:

```text
SantriOS
   │
   ├── Core
   ├── Modules
   ├── Data
   │
   └── AI Layer
        ├── Analytics
        ├── Assistant
        ├── Report Generator
        └── Recommendation
```

Contoh AI:

> "Berapa santri yang memiliki tunggakan lebih dari 2 bulan?"

AI mengambil data melalui service yang terotorisasi.

Jangan memberikan akses database mentah langsung kepada AI.

---

# 59. FUTURE INTEGRATIONS

Architecture harus memungkinkan:

- WhatsApp
- Midtrans
- Google Drive
- Google Calendar
- Email
- Push notification
- QR Code
- Payment gateway
- AI provider

Tetapi jangan mengimplementasikan semuanya pada MVP.

Buat abstraction/interface terlebih dahulu jika memang diperlukan.

---

# 60. DEPLOYMENT

Target deployment:

```text
Frontend
→ Vercel

Database
→ Neon PostgreSQL

Repository
→ GitHub

CI/CD
→ GitHub Actions

File Storage
→ dapat diintegrasikan kemudian
```

Pastikan aplikasi dapat berjalan dengan:

```text
pnpm dev
pnpm build
pnpm lint
pnpm test
```

---

# 61. TURBOREPO PIPELINE

Konfigurasikan task:

```text
dev
build
lint
typecheck
test
```

Dependency graph harus bekerja dengan benar.

Contoh:

```text
apps/web
   ↓
packages/modules
   ↓
packages/database
```

Jangan membuat circular dependency.

---

# 62. IMPORTANT ARCHITECTURAL RULE

Jangan membuat semua fitur dalam satu aplikasi besar.

SantriOS harus benar-benar modular.

Core hanya menangani:

```text
identity
tenant
authentication
authorization
navigation
settings
notifications
audit
subscription
module registry
```

Business module menangani domain masing-masing.

Contoh:

```text
Finance tidak boleh mengetahui detail internal Tahfizh.

Tahfizh tidak boleh bergantung langsung kepada Finance.

Students menjadi domain yang dapat digunakan oleh modul lain melalui abstraction yang jelas.
```

---

# 63. FIRST TASK

Jangan langsung membuat seluruh modul.

Pertama:

1. Buat repository Turborepo.
2. Buat struktur workspace.
3. Konfigurasi pnpm.
4. Konfigurasi TypeScript.
5. Konfigurasi ESLint.
6. Konfigurasi Prettier.
7. Buat Next.js app.
8. Buat UI package.
9. Hubungkan Neon.
10. Konfigurasi Prisma.
11. Buat schema core.
12. Jalankan migration.
13. Buat seed.
14. Buat authentication.
15. Buat tenant system.
16. Buat RBAC.
17. Buat module registry.
18. Buat onboarding.
19. Buat dashboard.
20. Buat test tenant isolation.

Setelah semua berhasil, baru lanjut ke modul Santri.

---

# 64. DEFINITION OF DONE

Jangan menyatakan sebuah feature selesai hanya karena UI sudah terlihat.

Feature dianggap selesai jika:

- UI selesai
- mobile responsive
- server logic selesai
- validation selesai
- authorization selesai
- tenant isolation selesai
- database schema benar
- loading state tersedia
- empty state tersedia
- error handling tersedia
- audit log jika diperlukan
- test tersedia untuk logic penting
- tidak ada TypeScript error
- tidak ada lint error
- build berhasil

---

# 65. DEVELOPMENT BEHAVIOR

Sebagai AI coding agent:

Jangan mengarang requirement.

Jika requirement belum jelas, gunakan asumsi yang paling aman dan dokumentasikan.

Jangan melakukan perubahan besar pada architecture tanpa alasan.

Sebelum membuat kode:

1. Analisis repository.
2. Identifikasi architecture.
3. Identifikasi dependency.
4. Buat implementation plan.
5. Implementasikan secara bertahap.
6. Jalankan typecheck.
7. Jalankan lint.
8. Jalankan test.
9. Perbaiki error.
10. Baru lanjut.

Jangan menghasilkan pseudo-code jika implementation nyata memungkinkan.

Jangan membuat placeholder yang tidak diperlukan.

Jika sebuah fitur belum diimplementasikan, tandai dengan jelas.

---

# 66. FIRST DELIVERABLE

Deliverable pertama bukan seluruh aplikasi.

Deliverable pertama adalah:

**SantriOS Foundation v0.1**

Dengan:

```text
Turborepo
+
Next.js
+
TypeScript
+
Tailwind
+
UI Package
+
Neon
+
Prisma
+
Authentication
+
Multi Tenant
+
RBAC
+
Permission
+
Module System
+
Onboarding
+
Dashboard
+
Audit Log
+
Seed
+
Testing
```

Setelah Foundation v0.1 stabil, lanjutkan:

**SantriOS MVP v0.2**

dengan:

```text
Santri
Keuangan
Absensi
Wali Santri
```

---

# FINAL PRINCIPLE

Bangun SantriOS seperti sebuah platform SaaS jangka panjang.

Jangan mengejar jumlah fitur.

Prioritaskan:

**Architecture → Security → UX → Reliability → Modularity → Features**

Setiap keputusan teknis harus mempertimbangkan bahwa SantriOS nantinya dapat digunakan oleh:

```text
10 pesantren
↓
100 pesantren
↓
1.000 pesantren
↓
10.000+ pesantren
```

Kode harus tetap dapat dirawat ketika jumlah tenant, user, dan transaksi berkembang besar.

**Mulai sekarang dari SantriOS Foundation v0.1.**
Jangan membuat modul bisnis sebelum foundation tersebut selesai dan tervalidasi.
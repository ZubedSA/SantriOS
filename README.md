# SantriOS — Operating System for Modern Pesantren

> **Satu platform, banyak pesantren, banyak modul, konfigurasi fleksibel.**

SantriOS adalah platform SaaS modular multi-tenant yang dirancang khusus untuk transformasi digital pondok pesantren modern di Indonesia. Dibangun dengan pendekatan **Mobile-First**, arsitektur berlapis yang aman, dan isolasi tenant tingkat enterprise.

---

## ✨ Fitur Utama Foundation v0.1

1. **Multi-Tenant Architecture**:
   - Model *Shared Database + Shared Schema + `tenant_id`*.
   - Isolasi data mutlak di level application/service wrapper (`createTenantDb`).
   - Mencegah kebocoran data antar pesantren (*Zero Cross-Tenant Leakage*).
2. **Mobile-First User Experience**:
   - Navigasi responsif layar smartphone (320px–430px) dengan *Bottom Navigation Bar* (`Home`, `Santri`, `Aktivitas`, `Keuangan`, `Lainnya`).
   - Tampilan adaptif desktop dengan sidebar modern dan pencarian global.
3. **Modular SaaS Registry & Feature Flags**:
   - 13 Modul terdaftar: `CORE`, `SANTRI`, `KEUANGAN`, `ABSENSI`, `TAHFIZH`, `AKADEMIK`, `ASRAMA`, `PERIZINAN`, `WALI_SANTRI`, `PPDB`, `INVENTARIS`, `KOPERASI`, `ALUMNI`.
   - Setiap pesantren dapat mengaktifkan atau menonaktifkan modul sesuai kebutuhan secara mandiri.
4. **Role-Based Access Control (RBAC)**:
   - Peran terpisah: `SUPER_ADMIN` (SaaS global), `OWNER`, `ADMIN`, `BENDAHARA`, `GURU`, `MUSYRIF`, `WALI_SANTRI`, `SANTRI`, `STAFF`.
   - Pengecekan izin granular (`hasPermission`, `requirePermission`).
5. **Pesantren Onboarding Wizard**:
   - Alur pendaftaran mandiri 3 langkah (Identitas Pesantren → Pemilihan Modul Awal → Pembuatan Akun Pimpinan/Owner).
6. **Audit Trail & Keamanan**:
   - Pencatatan seluruh aktivitas penting dan mutasi sistem ke dalam tabel `AuditLog`.
7. **Database Neon PostgreSQL & Prisma ORM**:
   - Akses data terpusat, connection pooling, dan skrip seed development interaktif.

---

## 🏗️ Struktur Monorepo

```text
SantriOS/
├── apps/
│   └── web/                # Next.js 14 App Router, Tailwind CSS, Lucide Icons
│
├── packages/
│   ├── ui/                 # Design system modern (Button, Card, Badge, StatCard, MobileNav, dll.)
│   ├── database/           # Prisma ORM, Neon PostgreSQL schema, tenantDb wrapper, seed, tests
│   ├── auth/               # RBAC, session JWT tokens, password hashing
│   ├── modules/            # Module registry (13 modul) & feature flag checker
│   ├── types/              # TypeScript types & domain interfaces
│   ├── validators/         # Zod schemas untuk client dan server
│   └── utils/              # Indonesian currency formatter, helper cn, error classes
│
├── tooling/
│   ├── typescript/         # Shared tsconfig (base, nextjs)
│   ├── eslint/             # Shared ESLint configuration
│   └── prettier/           # Shared Prettier configuration
│
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml     # pnpm workspace definition
├── package.json            # Root configuration
└── README.md
```

---

## 🚀 Memulai Pengembangan (Quick Start)

### Prasyarat
- Node.js >= 18
- pnpm >= 9
- Git

### Instalasi Dependensi
```bash
pnpm install
```

### Konfigurasi Environment
Salin template konfigurasi:
```bash
cp .env.example .env
```
Sesuaikan `DATABASE_URL` dengan database Neon PostgreSQL Anda.

### Generate Prisma Client & Database Seed
```bash
pnpm run db:generate
pnpm run db:seed
```

### Jalankan Development Server
```bash
pnpm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🔑 Akun Demo Pengembangan

Sistem telah dilengkapi data demo akun pesantren **Al-Hikmah Modern** (password default: `Demo123456!`):

| Role | Email | Password |
|---|---|---|
| **Pimpinan / Owner** | `owner@demo.local` | `Demo123456!` |
| **Administrator** | `admin@demo.local` | `Demo123456!` |
| **Bendahara** | `bendahara@demo.local` | `Demo123456!` |
| **Guru / Pengajar** | `guru@demo.local` | `Demo123456!` |
| **Musyrif Asrama** | `musyrif@demo.local` | `Demo123456!` |
| **Wali Santri** | `wali@demo.local` | `Demo123456!` |
| **Super Admin SaaS** | `superadmin@santrios.local` | `SuperAdmin123456!` |

---

## 🧪 Menjalankan Pengujian

Menjalankan test otomatis isolasi multi-tenant dan hak akses:
```bash
pnpm run test
```

Pemeriksaan tipe data TypeScript:
```bash
pnpm run typecheck
```

---

## 📖 Dokumentasi Terkait
- [ARCHITECTURE.md](file:///d:/WEB/SantriOS/ARCHITECTURE.md) — Detail arsitektur sistem dan lapisan service.
- [DATABASE.md](file:///d:/WEB/SantriOS/DATABASE.md) — Desain skema multi-tenant dan indexing.
- [MODULES.md](file:///d:/WEB/SantriOS/MODULES.md) — Panduan 13 modul dan feature flagging.
- [DEVELOPMENT.md](file:///d:/WEB/SantriOS/DEVELOPMENT.md) — Standar penulisan kode dan alur kerja.

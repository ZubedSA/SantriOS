# SantriOS — Database Architecture & Schema

SantriOS menggunakan **PostgreSQL (dioptimalkan untuk Neon Database)** dengan **Prisma ORM**.

---

## 1. Multi-Tenant Data Strategy

- Seluruh tabel entitas bisnis pesantren **wajib** memiliki kolom `tenantId` bertipe `String`.
- Relasi cascade `onDelete: Cascade` dikonfigurasikan agar saat tenant dihapus, seluruh data turunannya terbersihkan secara teratur.
- Dilarang membuat PrismaClient baru di setiap request. Gunakan client singleton dari `packages/database/src/client.ts`.

---

## 2. Entitas Utama Foundation v0.1

### `Tenant`
Menyimpan identitas pondok pesantren penyewa SaaS:
- `id` (cuid, PK)
- `slug` (unique, e.g. `al-hikmah`)
- `name` (e.g. `Pondok Pesantren Al-Hikmah Modern`)
- `tagline`, `phone`, `email`, `address`, `city`, `province`, `logoUrl`
- `status` (`ACTIVE`, `SUSPENDED`, `TRIAL`, `INACTIVE`)
- `createdAt`, `updatedAt`

### `User`
Data akun pengguna terdaftar:
- `id` (cuid, PK)
- `email` (unique)
- `passwordHash` (SHA-256 salted hash)
- `name`, `phone`, `avatarUrl`
- `status` (`ACTIVE`, `INACTIVE`, `PENDING`)

### `Role` & `Permission` (RBAC)
- `Role`: Nama role per-tenant atau global (`SUPER_ADMIN`, `OWNER`, `ADMIN`, `BENDAHARA`, `GURU`, `MUSYRIF`, `WALI_SANTRI`, `SANTRI`, `STAFF`).
- `Permission`: Kunci hak akses terperinci (contoh: `students.view`, `finance.create`, `attendance.mark`).
- `RolePermission`: Relasi many-to-many role dengan permission.
- `UserRole`: Penugasan peran pengguna pada suatu tenant (`userId`, `tenantId`, `roleId`).

### `Module` & `TenantModule`
- `Module`: 13 Modul SantriOS (`CORE`, `SANTRI`, `KEUANGAN`, `ABSENSI`, `TAHFIZH`, dll.).
- `TenantModule`: Status aktif (`enabled: true/false`) modul untuk tenant tertentu beserta konfigurasi spesifik tenant (`settings: Json`).

### `AuditLog`
Audit trail mutasi dan aktivitas operasional:
- `id`, `tenantId`, `userId`, `action`, `entity`, `entityId`, `oldData`, `newData`, `ipAddress`, `userAgent`, `createdAt`.

---

## 3. Strategi Indexing (Section 45 of Master Prompt)

Database dilengkapi indeks pada kombinasi field yang sering digunakan dalam query filter:
- `tenant_id`
- `tenant_id + status`
- `tenant_id + created_at`
- `tenant_id + user_id`
- `tenant_id + entity` (pada AuditLog)

---

## 4. Migrasi & Seed

Untuk menjalankan migrasi ke database Neon:
```bash
pnpm run db:push
```

Untuk memasukkan data awal demonstrasi (pesantren demo, peran, modul, akun demo):
```bash
pnpm run db:seed
```
